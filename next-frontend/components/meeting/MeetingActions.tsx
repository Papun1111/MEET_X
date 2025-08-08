"use client";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff,
  MessageCircle,
  Phone,
  Copy,
  Check
} from "lucide-react";
import { useState } from "react";

interface MeetingActionsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isChatOpen: boolean;
  meetingCode: string;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleChat: () => void;
  onLeaveMeeting: () => void;
}

export default function MeetingActions({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  isChatOpen,
  meetingCode,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onLeaveMeeting,
}: MeetingActionsProps) {
  const [copied, setCopied] = useState(false);

  const copyMeetingCode = async () => {
    try {
      await navigator.clipboard.writeText(meetingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Meeting Info */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Meeting:</span>
          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
            {meetingCode}
          </code>
          <button
            onClick={copyMeetingCode}
            className="p-1 hover:bg-gray-100 rounded"
            title="Copy meeting code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleAudio}
            className={`p-3 rounded-full ${
              isAudioEnabled
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            title={isAudioEnabled ? "Mute" : "Unmute"}
          >
            {isAudioEnabled ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onToggleVideo}
            className={`p-3 rounded-full ${
              isVideoEnabled
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
            title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
          >
            {isVideoEnabled ? (
              <Video className="w-5 h-5" />
            ) : (
              <VideoOff className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onToggleScreenShare}
            className={`p-3 rounded-full ${
              isScreenSharing
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            title={isScreenSharing ? "Stop sharing" : "Share screen"}
          >
            {isScreenSharing ? (
              <MonitorOff className="w-5 h-5" />
            ) : (
              <Monitor className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onToggleChat}
            className={`p-3 rounded-full ${
              isChatOpen
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            title="Toggle chat"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          <button
            onClick={onLeaveMeeting}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white ml-4"
            title="Leave meeting"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
