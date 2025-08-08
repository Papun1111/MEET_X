"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAuthenticated } from "../../lib/auth";
import { Video, Users, Share, MessageCircle } from "lucide-react";

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/login")}
              className="btn-secondary"
            >
              Sign in
            </button>
            <button
              onClick={() => router.push("/register")}
              className="btn-primary"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20">
        <div className="text-center max-w-4xl">
          <h2 className="text-5xl font-bold mb-6">
            Video meetings made{" "}
            <span className="text-blue-600">simple</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with anyone, anywhere. Create secure video meetings with 
            chat and screen sharing in just one click.
          </p>
          <div className="flex gap-4 justify-center mb-16">
            <button
              onClick={() => router.push("/register")}
              className="btn-primary text-lg px-8 py-3"
            >
              Start meeting
            </button>
            <button
              onClick={() => router.push("/meeting")}
              className="btn-secondary text-lg px-8 py-3"
            >
              Join meeting
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <Video className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">HD Video</h3>
              <p className="text-gray-600 text-sm">
                Crystal clear video calls with adaptive quality
              </p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Multiple Participants</h3>
              <p className="text-gray-600 text-sm">
                Connect with multiple people at once
              </p>
            </div>
            <div className="text-center">
              <Share className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Screen Sharing</h3>
              <p className="text-gray-600 text-sm">
                Share your screen with one click
              </p>
            </div>
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm">
                Send messages during meetings
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
