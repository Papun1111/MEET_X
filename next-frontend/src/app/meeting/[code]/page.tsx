"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { isAuthenticated, getToken, getName } from "../../../../lib/auth";
import { getSocket } from "../../../../lib/socket";
import { createPeerConnection, getUserMedia, getDisplayMedia } from "../../../../lib/rtc";
import { apiAddActivity } from "../../../../lib/api";
import { PeerConnection,ChatMessage } from "../../../../lib/types";
import VideoGrid from "../../../../components/meeting/VideoGrid";
import MeetingActions from "../../../../components/meeting/MeetingActions";
import ChatPanel from "../../../../components/meeting/ChatPanel";

export default function MeetingRoom() {
  const router = useRouter();
  const params = useParams();
  const meetingCode = params.code as string;

  // States
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Refs
  const socketRef = useRef(getSocket());
  const originalStreamRef = useRef<MediaStream | null>(null);

  // Debug effect to log state changes
  useEffect(() => {
    console.log("🔍 State update - Remote streams:", remoteStreams.size);
    console.log("🔍 State update - Peers:", peers.size);
    remoteStreams.forEach((stream, socketId) => {
      console.log(`🔍 Stream from ${socketId}:`, {
        tracks: stream.getTracks().length,
        video: stream.getVideoTracks().length,
        audio: stream.getAudioTracks().length
      });
    });
  }, [remoteStreams, peers]);

  // Initialize media and socket
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const initializeCall = async () => {
      try {
        console.log("🚀 Initializing call for meeting:", meetingCode);
        
        // Get user media
        const stream = await getUserMedia(true, true);
        console.log("✅ Got local media stream:", {
          video: stream.getVideoTracks().length,
          audio: stream.getAudioTracks().length
        });
        
        setLocalStream(stream);
        originalStreamRef.current = stream;

        // Save meeting to history
        const token = getToken();
        if (token) {
          await apiAddActivity(token, meetingCode);
          console.log("✅ Added meeting to history");
        }

        // Setup socket listeners
        setupSocketListeners();

        // Join the call
        console.log("🔌 Joining call via socket");
        socketRef.current.emit("join-call", meetingCode);
      } catch (error) {
        console.error("❌ Failed to initialize call:", error);
        alert("Failed to access camera/microphone. Please check permissions.");
      } finally {
        setLoading(false);
      }
    };

    initializeCall();

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up meeting room");
      localStream?.getTracks().forEach(track => {
        track.stop();
        console.log("🛑 Stopped local track:", track.kind);
      });
      peers.forEach(({ pc, socketId }) => {
        pc.close();
        console.log("🛑 Closed peer connection:", socketId);
      });
      socketRef.current.off("user-joined");
      socketRef.current.off("user-left");
      socketRef.current.off("signal");
      socketRef.current.off("chat-message");
    };
  }, [meetingCode, router]);

  const setupSocketListeners = useCallback(() => {
    const socket = socketRef.current;
    console.log("🔗 Setting up socket listeners");

    socket.on("user-joined", async (socketId: string, connections: string[]) => {
      console.log("🟢 User joined:", socketId, "Total connections:", connections.length);
      if (socketId !== socket.id) {
        await createPeerConnectionForUser(socketId, true);
      }
    });

    socket.on("user-left", (socketId: string) => {
      console.log("🔴 User left:", socketId);
      const peer = peers.get(socketId);
      if (peer) {
        peer.pc.close();
        setPeers(prev => {
          const newPeers = new Map(prev);
          newPeers.delete(socketId);
          console.log("🗑️ Removed peer:", socketId);
          return newPeers;
        });
        setRemoteStreams(prev => {
          const newStreams = new Map(prev);
          newStreams.delete(socketId);
          console.log("🗑️ Removed remote stream:", socketId);
          return newStreams;
        });
      }
    });

    socket.on("signal", async (fromId: string, signal: any) => {
      console.log("📡 Received signal from:", fromId, "Type:", signal.type || 'ice-candidate');
      await handleSignal(fromId, signal);
    });

    socket.on("chat-message", (data: string, sender: string, socketIdSender: string) => {
      console.log("💬 Chat message from:", sender);
      const message: ChatMessage = {
        data,
        sender,
        socketIdSender,
        timestamp: Date.now(),
      };
      setChatMessages(prev => [...prev, message]);
    });
  }, [peers]);

  const createPeerConnectionForUser = async (socketId: string, isInitiator: boolean) => {
    console.log("🤝 Creating peer connection for:", socketId, "Initiator:", isInitiator);
    
    const pc = createPeerConnection();
    
    // Add connection state listeners
    pc.onconnectionstatechange = () => {
      console.log(`📊 Connection state for ${socketId}:`, pc.connectionState);
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`🧊 ICE connection state for ${socketId}:`, pc.iceConnectionState);
    };

    pc.onicegatheringstatechange = () => {
      console.log(`🧊 ICE gathering state for ${socketId}:`, pc.iceGatheringState);
    };
    
    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        console.log("➕ Adding local track to peer:", socketId, track.kind);
        pc.addTrack(track, localStream);
      });
    } else {
      console.warn("⚠️ No local stream available when creating peer for:", socketId);
    }

    // Handle incoming stream
    pc.ontrack = (event) => {
      console.log("🎥 Received remote track from:", socketId, event.track.kind);
      const [remoteStream] = event.streams;
      if (remoteStream) {
        console.log("✅ Setting remote stream for:", socketId, {
          tracks: remoteStream.getTracks().length,
          video: remoteStream.getVideoTracks().length,
          audio: remoteStream.getAudioTracks().length
        });
        
        setRemoteStreams(prev => {
          const newStreams = new Map(prev);
          newStreams.set(socketId, remoteStream);
          console.log("📊 Remote streams updated. Total:", newStreams.size);
          return newStreams;
        });
      } else {
        console.warn("⚠️ No remote stream in track event from:", socketId);
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("🧊 Sending ICE candidate to:", socketId);
        socketRef.current.emit("signal", socketId, event.candidate);
      } else {
        console.log("🧊 ICE gathering complete for:", socketId);
      }
    };

    // Store peer connection
    const peerConnection: PeerConnection = { pc, socketId };
    setPeers(prev => {
      const newPeers = new Map(prev).set(socketId, peerConnection);
      console.log("📊 Peers updated. Total:", newPeers.size);
      return newPeers;
    });

    // Create offer if initiator
    if (isInitiator) {
      try {
        console.log("📤 Creating offer for:", socketId);
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        await pc.setLocalDescription(offer);
        socketRef.current.emit("signal", socketId, offer);
        console.log("✅ Offer sent to:", socketId);
      } catch (error) {
        console.error("❌ Error creating offer for", socketId, ":", error);
      }
    }
  };

  const handleSignal = async (fromId: string, signal: any) => {
    console.log("🔄 Processing signal from:", fromId, "Type:", signal.type || 'ice-candidate');
    
    let peer = peers.get(fromId);
    
    if (!peer) {
      console.log("🆕 Creating new peer connection for incoming signal from:", fromId);
      await createPeerConnectionForUser(fromId, false);
      peer = peers.get(fromId);
    }

    if (!peer) {
      console.error("❌ Failed to create/get peer for:", fromId);
      return;
    }

    try {
      if (signal.type === "offer") {
        console.log("📨 Processing offer from:", fromId);
        await peer.pc.setRemoteDescription(signal);
        const answer = await peer.pc.createAnswer();
        await peer.pc.setLocalDescription(answer);
        socketRef.current.emit("signal", fromId, answer);
        console.log("✅ Answer sent to:", fromId);
      } else if (signal.type === "answer") {
        console.log("📨 Processing answer from:", fromId);
        await peer.pc.setRemoteDescription(signal);
        console.log("✅ Answer processed for:", fromId);
      } else if (signal.candidate) {
        console.log("🧊 Adding ICE candidate from:", fromId);
        await peer.pc.addIceCandidate(signal);
        console.log("✅ ICE candidate added for:", fromId);
      }
    } catch (error) {
      console.error("❌ Error handling signal from", fromId, ":", error);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        console.log("🔊 Audio toggled:", audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        console.log("📹 Video toggled:", videoTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      console.log("🖥️ Stopping screen share");
      // Stop screen sharing
      if (originalStreamRef.current) {
        const videoTrack = originalStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          // Replace screen track with camera track
          peers.forEach(({ pc, socketId }) => {
            const sender = pc.getSenders().find(s => 
              s.track && s.track.kind === "video"
            );
            if (sender) {
              sender.replaceTrack(videoTrack);
              console.log("🔄 Replaced screen track with camera for:", socketId);
            }
          });
          
          setLocalStream(originalStreamRef.current);
          setIsScreenSharing(false);
          setIsVideoEnabled(true);
        }
      }
    } else {
      // Start screen sharing
      try {
        console.log("🖥️ Starting screen share");
        const screenStream = await getDisplayMedia();
        const screenTrack = screenStream.getVideoTracks()[0];
        
        // Replace video track with screen track
        peers.forEach(({ pc, socketId }) => {
          const sender = pc.getSenders().find(s => 
            s.track && s.track.kind === "video"
          );
          if (sender) {
            sender.replaceTrack(screenTrack);
            console.log("🔄 Replaced camera track with screen for:", socketId);
          }
        });

        // Handle screen share ending
        screenTrack.onended = () => {
          console.log("🛑 Screen share ended");
          toggleScreenShare();
        };

        setLocalStream(screenStream);
        setIsScreenSharing(true);
        setIsVideoEnabled(true);
      } catch (error) {
        console.error("❌ Error starting screen share:", error);
        alert("Failed to start screen sharing");
      }
    }
  };

  const sendChatMessage = (message: string) => {
    console.log("💬 Sending chat message:", message);
    socketRef.current.emit("chat-message", message, getName());
  };

  const leaveMeeting = () => {
    console.log("👋 Leaving meeting");
    localStream?.getTracks().forEach(track => track.stop());
    peers.forEach(({ pc }) => pc.close());
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Joining meeting {meetingCode}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Debug Info (remove in production) */}
      <div className="bg-blue-900 text-white p-2 text-xs">
        Meeting: {meetingCode} | Local Stream: {localStream ? '✅' : '❌'} | 
        Remote Streams: {remoteStreams.size} | Peers: {peers.size}
      </div>

      {/* Video Grid */}
      <div className="flex-1">
        <VideoGrid
          localStream={localStream}
          remoteStreams={remoteStreams}
          localAudio={isAudioEnabled}
          localVideo={isVideoEnabled}
        />
      </div>

      {/* Meeting Controls */}
      <MeetingActions
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        isScreenSharing={isScreenSharing}
        isChatOpen={isChatOpen}
        meetingCode={meetingCode}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        onLeaveMeeting={leaveMeeting}
      />

      {/* Chat Panel */}
      <ChatPanel
        isOpen={isChatOpen}
        messages={chatMessages}
        onSendMessage={sendChatMessage}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}
