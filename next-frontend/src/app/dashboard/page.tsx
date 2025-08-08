"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGetActivity } from "../../../lib/api";
import { getToken, getName, clearToken, isAuthenticated } from "../../../lib/auth"
import { formatDate } from "../../../lib/util"
import { Plus, Calendar, LogOut, Video } from "lucide-react";

interface Meeting {
  meetingCode: string;
  date: string;
}

export default function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const fetchMeetings = async () => {
      try {
        const token = getToken();
        if (token) {
          const data = await apiGetActivity(token);
          setMeetings(data.sort((a, b) => +new Date(b.date) - +new Date(a.date)));
        }
      } catch (error) {
        console.error("Failed to fetch meetings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [router]);

  const handleLogout = () => {
    clearToken();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {getName()}!</h1>
          <p className="text-gray-600 mt-1">Manage your meetings and start new ones</p>
        </div>
        <button
          onClick={handleLogout}
          className="btn-secondary flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div
          onClick={() => router.push("/meeting")}
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">New Meeting</h3>
              <p className="text-gray-600">Start an instant meeting</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => router.push("/meeting")}
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Video className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Join Meeting</h3>
              <p className="text-gray-600">Join with a meeting code</p>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting History */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold">Recent Meetings</h2>
          </div>
        </div>

        <div className="p-6">
          {meetings.length === 0 ? (
            <div className="text-center py-12">
              <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings yet</h3>
              <p className="text-gray-600 mb-4">Start your first meeting to see it here</p>
              <button
                onClick={() => router.push("/meeting")}
                className="btn-primary"
              >
                Start Meeting
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {meetings.map((meeting, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium">Meeting {meeting.meetingCode}</p>
                    <p className="text-sm text-gray-600">{formatDate(meeting.date)}</p>
                  </div>
                  <button
                    onClick={() => router.push(`/meeting/${meeting.meetingCode}`)}
                    className="btn-primary"
                  >
                    Join Again
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
