"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated,getToken } from "../../../lib/auth";
import { apiAddActivity } from "../../../lib/api";
import { generateMeetingCode } from "../../../lib/rtc";
import { Video, Users } from "lucide-react";

export default function MeetingPage() {
  const [meetingCode, setMeetingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  const createMeeting = async () => {
    setLoading(true);
    try {
      const code = generateMeetingCode();
      const token = getToken();
      if (token) {
        await apiAddActivity(token, code);
        router.push(`/meeting/${code}`);
      }
    } catch (error) {
      console.error("Failed to create meeting:", error);
    } finally {
      setLoading(false);
    }
  };

  const joinMeeting = () => {
    if (meetingCode.trim()) {
      router.push(`/meeting/${meetingCode.trim()}`);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Start or Join a Meeting</h1>
          <p className="text-gray-600">Connect with others instantly</p>
        </div>

        <div className="space-y-6">
          {/* Create Meeting */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                <Video className="w-8 h-8 text-blue-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Start New Meeting</h3>
              <p className="text-gray-600 mb-4">Create a meeting and invite others</p>
              <button
                onClick={createMeeting}
                disabled={loading}
                className="btn-primary w-full py-3"
              >
                {loading ? "Creating..." : "Start Meeting"}
              </button>
            </div>
          </div>

          {/* Join Meeting */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Join Meeting</h3>
              <p className="text-gray-600 mb-4">Enter a meeting code to join</p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter meeting code"
                  className="input-field text-center"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && joinMeeting()}
                />
                <button
                  onClick={joinMeeting}
                  disabled={!meetingCode.trim()}
                  className="btn-primary w-full py-3"
                >
                  Join Meeting
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
