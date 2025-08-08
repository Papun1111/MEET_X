export interface User {
  username: string;
  name: string;
  token: string;
}

export interface Meeting {
  meetingCode: string;
  date: string;
  user_id?: string;
}

export interface ChatMessage {
  data: string;
  sender: string;
  socketIdSender: string;
  timestamp?: number;
}

export interface PeerConnection {
  pc: RTCPeerConnection;
  socketId: string;
  stream?: MediaStream;
}
