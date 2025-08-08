"use client";

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun.stunprotocol.org:3478" },
];

export function createPeerConnection(): RTCPeerConnection {
  const pc = new RTCPeerConnection({
    iceServers: ICE_SERVERS,
    iceCandidatePoolSize: 10,
  });

  // Add debugging
  pc.addEventListener('icecandidate', (event) => {
    if (event.candidate) {
      console.log('🧊 ICE candidate generated:', event.candidate.type);
    }
  });

  pc.addEventListener('connectionstatechange', () => {
    console.log('🔗 Connection state changed:', pc.connectionState);
  });

  pc.addEventListener('iceconnectionstatechange', () => {
    console.log('🧊 ICE connection state changed:', pc.iceConnectionState);
  });

  return pc;
}

export async function getUserMedia(video = true, audio = true): Promise<MediaStream> {
  try {
    const constraints = {
      video: video ? { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      } : false,
      audio: audio ? { 
        echoCancellation: true, 
        noiseSuppression: true,
        autoGainControl: true 
      } : false,
    };

    console.log('📹 Requesting user media with constraints:', constraints);
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log('✅ Got user media stream:', {
      video: stream.getVideoTracks().length,
      audio: stream.getAudioTracks().length
    });
    return stream;
  } catch (error) {
    console.error("❌ Error accessing media devices:", error);
    throw error;
  }
}

export async function getDisplayMedia(): Promise<MediaStream> {
  try {
    console.log('🖥️ Requesting display media');
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    console.log('✅ Got display media stream');
    return stream;
  } catch (error) {
    console.error("❌ Error accessing display media:", error);
    throw error;
  }
}

export function generateMeetingCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
