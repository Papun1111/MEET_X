import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
  FaDesktop,
  FaRegComments,
  FaTimes,
} from "react-icons/fa";
import { MdStopScreenShare } from "react-icons/md";
import servers from "../enivronment";
import { useNavigate } from "react-router-dom";

const server_url = servers.prod;
let connections = {};
const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  const router = useNavigate();
  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoref = useRef();
  const videoRef = useRef([]);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [video, setVideo] = useState([]);
  const [audio, setAudio] = useState();
  const [screen, setScreen] = useState();
  const [screenAvailable, setScreenAvailable] = useState();
  const [showModal, setModal] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState(3);
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoAvailable(!!videoPermission);

      const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioAvailable(!!audioPermission);

      setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        window.localStream = userMediaStream;
        if (localVideoref.current) {
          localVideoref.current.srcObject = userMediaStream;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (screen !== undefined) getDisplayMedia();
  }, [screen]);

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [video, audio]);

  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video, audio })
        .then(getUserMediaSuccess)
        .catch((e) => console.log(e));
    }
  };

  const getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch {}

    window.localStream = stream;
    localVideoref.current.srcObject = stream;
  };

  const getDisplayMedia = () => {
    if (screen && navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then(getDisplayMediaSuccess)
        .catch((e) => console.log(e));
    }
  };

  const getDisplayMediaSuccess = (stream) => {
    window.localStream = stream;
    localVideoref.current.srcObject = stream;
  };

  const connectToSocketServer = () => {
    socketRef.current = io.connect(server_url);
    socketRef.current.on("signal", gotMessageFromServer);
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);
      socketRef.current.on("user-left", (id) => {
        setVideos((prev) => prev.filter((v) => v.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        // skipped simplified stream setup
      });
    });
  };

  const gotMessageFromServer = (fromId, message) => {
    const signal = JSON.parse(message);
    if (fromId !== socketIdRef.current && signal.sdp) {
      // skipped simplified SDP setup
    }
  };

  const black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), { width, height });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  const silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  const handleVideo = () => setVideo(!video);
  const handleAudio = () => setAudio(!audio);
  const handleScreen = () => setScreen(!screen);
  const handleMessage = (e) => setMessage(e.target.value);

  const handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch {}
    router("/home");
  };

  const sendMessage = () => {
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prev) => [...prev, { sender, data }]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prev) => prev + 1);
    }
  };

  const connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      {askForUsername ? (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
          <h2 className="text-2xl font-bold text-purple-400">Enter the Lobby</h2>
          <input
            className="px-4 py-2 w-72 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={connect}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
          >
            Connect
          </button>
          <video ref={localVideoref} autoPlay muted className="w-80 h-56 rounded shadow-lg" />
        </div>
      ) : (
        <div className="relative min-h-screen">
          {/* Chat Modal */}
          {showModal && (
            <div className="absolute top-0 right-0 w-full md:w-1/3 h-full bg-gray-900 p-4 overflow-y-auto z-10 border-l border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Chat</h1>
                <button onClick={() => setModal(false)}><FaTimes /></button>
              </div>
              <div className="space-y-4 mb-4 h-96 overflow-y-auto pr-2">
                {messages.length > 0 ? (
                  messages.map((item, index) => (
                    <div key={index}>
                      <p className="font-bold text-purple-300">{item.sender}</p>
                      <p className="text-sm">{item.data}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No Messages Yet</p>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message"
                  value={message}
                  onChange={handleMessage}
                  className="flex-grow px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-xl px-4 py-2 flex items-center gap-4 z-10 shadow-lg">
            <button onClick={handleVideo} className="text-white hover:text-purple-400">
              {video ? <FaVideo /> : <FaVideoSlash />}
            </button>
            <button onClick={handleEndCall} className="text-red-500 hover:text-red-600">
              <FaPhoneSlash />
            </button>
            <button onClick={handleAudio} className="text-white hover:text-purple-400">
              {audio ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>
            {screenAvailable && (
              <button onClick={handleScreen} className="text-white hover:text-purple-400">
                {screen ? <MdStopScreenShare /> : <FaDesktop />}
              </button>
            )}
            <button onClick={() => setModal(!showModal)} className="relative text-white hover:text-purple-400">
              <FaRegComments />
              {newMessages > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-orange-600 px-1.5 rounded-full">
                  {newMessages}
                </span>
              )}
            </button>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 px-4 pb-24">
            <video ref={localVideoref} autoPlay muted className="rounded shadow-md w-full h-auto bg-black" />
            {videos.map((video) => (
              <video
                key={video.socketId}
                autoPlay
                playsInline
                className="rounded shadow-md w-full h-auto bg-black"
                ref={(ref) => {
                  if (ref && video.stream) ref.srcObject = video.stream;
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
