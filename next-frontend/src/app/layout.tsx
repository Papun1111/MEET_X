import "./globals.css";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "MeetX",
  description: "Video meetings with chat and screen share",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          {children}
        </div>
      </body>
    </html>
  );
}
