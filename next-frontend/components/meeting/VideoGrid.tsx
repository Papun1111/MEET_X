"use client";
import { useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, User } from "lucide-react";

interface VideoGridProps {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  localAudio: boolean;
  localVideo: boolean;
}

export default function VideoGrid({
  localStream,
  remoteStreams,
  localAudio,
  localVideo,
}: VideoGridProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      // Force play
      localVideoRef.current.play().catch(console.error);
    }
  }, [localStream]);

  const totalStreams = 1 + remoteStreams.size;
  const gridCols = totalStreams <= 2 ? 1 : totalStreams <= 4 ? 2 : 3;

  // Debug log
  console.log("VideoGrid render - Remote streams:", remoteStreams.size);

  return (
    <div
      className={`grid gap-4 h-full p-4 ${
        gridCols === 1 ? "grid-cols-1" : 
        gridCols === 2 ? "grid-cols-1 lg:grid-cols-2" : 
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {/* Local Video */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
        {localStream ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-16 h-16 text-gray-500" />
          </div>
        )}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className={`p-2 rounded-full ${localAudio ? 'bg-green-600' : 'bg-red-600'}`}>
            {localAudio ? (
              <Mic className="w-4 h-4 text-white" />
            ) : (
              <MicOff className="w-4 h-4 text-white" />
            )}
          </div>
          <div className={`p-2 rounded-full ${localVideo ? 'bg-green-600' : 'bg-red-600'}`}>
            {localVideo ? (
              <Video className="w-4 h-4 text-white" />
            ) : (
              <VideoOff className="w-4 h-4 text-white" />
            )}
          </div>
        </div>
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          You
        </div>
      </div>

      {/* Remote Videos */}
      {Array.from(remoteStreams.entries()).map(([socketId, stream]) => (
        <RemoteVideo key={socketId} socketId={socketId} stream={stream} />
      ))}
      
      {/* Debug info when no remote streams */}
      {remoteStreams.size === 0 && (
        <div className="relative bg-gray-700 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
          <div className="text-center text-white">
            <User className="w-16 h-16 mx-auto mb-2 opacity-50" />
            <p className="text-sm opacity-75">Waiting for others to join...</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface RemoteVideoProps {
  socketId: string;
  stream: MediaStream;
}

function RemoteVideo({ socketId, stream }: RemoteVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log("RemoteVideo: Setting up stream for", socketId);
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      // Force play
      videoRef.current.play().catch(console.error);
      
      // Log track info
      console.log("Remote stream tracks:", stream.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled })));
    }
  }, [stream, socketId]);

  const hasVideoTrack = stream.getVideoTracks().length > 0;

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
      {hasVideoTrack ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <User className="w-16 h-16 text-gray-400" />
        </div>
      )}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        Participant
      </div>
    </div>
  );
}
