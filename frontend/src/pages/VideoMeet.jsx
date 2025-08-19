import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import servers from "../enivronment";
import { useNavigate } from "react-router-dom";
const server_url = servers.prod;


var connections = {};


const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};


export default function VideoMeetComponent() {
  const router = useNavigate();
  var socketRef = useRef();
  let socketIdRef = useRef();


  let localVideoref = useRef();


  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);


  let [video, setVideo] = useState([]);
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();
  let [showModal, setModal] = useState(true);
  let [screenAvailable, setScreenAvailable] = useState();


  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(0); // Start with 0 new messages


  let [askForUsername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState("");


  const videoRef = useRef([]);
  let [videos, setVideos] = useState([]);


  useEffect(() => {
    getPermissions();
  }, []); // Added empty dependency array to run only once


  let getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .catch((e) => console.log("getDisplayMedia error:", e));
      }
    }
  };


  const getPermissions = async () => {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setVideoAvailable(true);
      setAudioAvailable(true);


      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }


      if (stream) {
        window.localStream = stream;
        if (localVideoref.current) {
          localVideoref.current.srcObject = stream;
        }
      }
    } catch (error) {
      console.log("Permission error:", error);
      setVideoAvailable(false);
      setAudioAvailable(false);
    }
  };


  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [video, audio]);


  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };


  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }


    window.localStream = stream;
    localVideoref.current.srcObject = stream;


    for (let id in connections) {
      if (id === socketIdRef.current) continue;


      connections[id].addStream(window.localStream);


      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }


    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);


          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }


          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;


          for (let id in connections) {
            connections[id].addStream(window.localStream);


            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };


  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {
        // Silently catch error if no tracks exist
      }
    }
  };


  let getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }


    window.localStream = stream;
    localVideoref.current.srcObject = stream;


    for (let id in connections) {
      if (id === socketIdRef.current) continue;


      connections[id].addStream(window.localStream);


      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }


    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);


          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }


          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;


          getUserMedia();
        })
    );
  };


  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);


    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }


      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };


  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: true });


    socketRef.current.on("signal", gotMessageFromServer);


    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;


      socketRef.current.on("chat-message", addMessage);


      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      delete connections[id];
      });


      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections
          );
          // Wait for their ice candidate
          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };


        // This is the old way, use ontrack for modern browsers
          connections[socketListId].onaddstream = (event) => {
            // This logic is kept for compatibility but ontrack is preferred
            handleRemoteStream(event.stream, socketListId);
        };
        connections[socketListId].ontrack = (event) => {
            handleRemoteStream(event.streams[0], socketListId);
        };


          // Add the local video stream
          if (window.localStream) {
            window.localStream.getTracks().forEach(track => {
               connections[socketListId].addTrack(track, window.localStream);
            });
          }
        });


        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;


            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };


  const handleRemoteStream = (stream, socketListId) => {
      setVideos((prevVideos) => {
        if (prevVideos.some(video => video.socketId === socketListId)) {
          return prevVideos.map(video => 
            video.socketId === socketListId ? { ...video, stream } : video
          );
        }
        return [...prevVideos, { socketId: socketListId, stream }];
      });
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };
  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };


  let handleVideo = () => {
    setVideo((prevVideo) => !prevVideo);
  };
  let handleAudio = () => {
    setAudio((prevAudio) => !prevAudio);
  };


  useEffect(() => {
    if (screen !== undefined) {
      getDislayMedia();
    }
  }, [screen]);


  let handleScreen = () => {
    setScreen((prevScreen) => !prevScreen);
  };


  let handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    if (socketRef.current) {
        socketRef.current.disconnect();
    }
    router("/home");
  };


  let openChat = () => {
    setModal(true);
    setNewMessages(0);
  };
  let closeChat = () => {
    setModal(false);
  };
  let handleMessage = (e) => {
    setMessage(e.target.value);
  };


  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };


  let sendMessage = () => {
    if (message.trim() && username.trim()) {
      socketRef.current.emit("chat-message", message, username);
      addMessage(message, "Me", socketIdRef.current);
      setMessage("");
    }
  };


  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      {askForUsername === true ? (
        <div className="w-full max-w-md bg-gray-800 rounded-lg p-8 shadow-lg flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center">Enter Lobby</h2>
          <TextField
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            required
            className="w-full mb-4"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray' },
                '&:hover fieldset': { borderColor: 'white' },
              },
              '& .MuiInputLabel-root': { color: 'gray' },
            }}
            InputProps={{ style: { color: "white" } }}
          />
          <Button 
            variant="contained" 
            onClick={connect} 
            disabled={!username.trim()}
            className="w-full !py-3 !text-lg !font-semibold !bg-blue-600 hover:!bg-blue-700 disabled:!bg-gray-600"
          >
            Connect
          </Button>


          <div className="mt-4 aspect-video w-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
            <video ref={localVideoref} autoPlay muted className="w-full h-full object-cover"></video>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-screen flex flex-col bg-black">
          {/* Remote Videos Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2 overflow-auto">
            {videos.map((video) => (
              <div key={video.socketId} className="bg-gray-800 rounded-lg overflow-hidden relative aspect-video">
                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                  className="w-full h-full object-cover"
                ></video>
                <div className="absolute bottom-2 left-2 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                  Remote User
                </div>
              </div>
            ))}
          </div>

          {/* Local Video Preview */}
          <div className="absolute bottom-24 right-4 w-48 h-auto aspect-video rounded-lg overflow-hidden shadow-2xl border-2 border-gray-500 z-20">
              <video
                className="w-full h-full object-cover"
                ref={localVideoref}
                autoPlay
                muted
              ></video>
          </div>

          {/* Chat Modal */}
          {showModal && (
            <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-gray-900 bg-opacity-90 backdrop-blur-sm z-30 flex flex-col p-4 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">Chat</h1>
                    <Button onClick={closeChat} className="!text-white">Close</Button>
                </div>
                <div className="flex-1 overflow-y-auto mb-4 p-2 rounded bg-gray-800 border border-gray-700">
                    {messages.length > 0 ? (
                    messages.map((item, index) => (
                        <div className={`mb-3 flex ${item.sender === 'Me' ? 'justify-end' : 'justify-start'}`} key={index}>
                            <div className={`p-2 rounded-lg max-w-xs ${item.sender === 'Me' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                <p className="font-bold text-sm">{item.sender}</p>
                                <p className="break-words">{item.data}</p>
                            </div>
                        </div>
                    ))
                    ) : (
                    <p className="text-gray-400 text-center">No Messages Yet</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <TextField
                        value={message}
                        onChange={handleMessage}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        label="Enter chat"
                        variant="outlined"
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'gray' } },
                            '& .MuiInputLabel-root': { color: 'gray' },
                        }}
                        InputProps={{ style: { color: "white" } }}
                    />
                    <Button variant="contained" onClick={sendMessage} className="!bg-blue-600">Send</Button>
                </div>
            </div>
          )}

          {/* Controls Bar */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md flex justify-center items-center gap-4 bg-gray-800 bg-opacity-70 backdrop-blur-md py-3 px-6 rounded-t-xl z-20">
            <IconButton onClick={handleVideo} className="!text-white">
              {video ? <VideocamIcon /> : <VideocamOffIcon className="!text-red-500"/>}
            </IconButton>
            <IconButton onClick={handleAudio} className="!text-white">
              {audio ? <MicIcon /> : <MicOffIcon className="!text-red-500"/>}
            </IconButton>
            {screenAvailable && (
              <IconButton onClick={handleScreen} className="!text-white">
                {screen ? <StopScreenShareIcon className="!text-blue-500"/> : <ScreenShareIcon />}
              </IconButton>
            )}
            <IconButton onClick={handleEndCall} className="!bg-red-600 hover:!bg-red-700 !text-white !mx-4">
              <CallEndIcon />
            </IconButton>
            <Badge badgeContent={newMessages} color="error">
              <IconButton onClick={() => setModal(!showModal)} className="!text-white">
                <ChatIcon />
              </IconButton>
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
