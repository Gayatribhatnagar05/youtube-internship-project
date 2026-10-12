"use client";

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Users,
  MessageSquare,
  Copy,
  Check,
  CircleDot,
  Download,
  X,
  Send,
  Share2,
} from "lucide-react";

interface WatchPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
  };
  currentUser?: {
    id: string;
    name: string;
  };
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

interface Participant {
  socketId: string;
  userId: string;
  userName: string;
  audio: boolean;
  video: boolean;
  isHost: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function WatchPartyModal({
  isOpen,
  onClose,
  video,
  currentUser,
  videoRef,
}: WatchPartyModalProps) {
  const [roomId, setRoomId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");

  // Call Controls State
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  // WebRTC & Media Refs
  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const peerConnections = useRef<{ [socketId: string]: RTCPeerConnection }>({});
  const [remoteStreams, setRemoteStreams] = useState<{ [socketId: string]: MediaStream }>({});

  useEffect(() => {
    if (!isOpen) return;

    // Generate room ID if not present
    const id = `party_${video._id}_${Math.random().toString(36).substring(2, 7)}`;
    setRoomId(id);

    const socket = io(BACKEND_URL);
    socketRef.current = socket;

    const userName = currentUser?.name || `User_${Math.floor(1000 + Math.random() * 9000)}`;
    const userId = currentUser?.id || socket.id;

    // Initialize local media (camera/mic)
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn("Could not access camera/mic:", err);
        });
    }

    socket.emit("join-room", {
      roomId: id,
      user: { id: userId, name: userName },
      isHost: true,
    });

    socket.on("room-participants", (list: Participant[]) => {
      setParticipants(list);
    });

    socket.on("receive-room-message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    let isInternalSync = false;

    // Handle video sync events from peers
    socket.on("video-action-sync", ({ action, currentTime }) => {
      if (!videoRef.current) return;
      isInternalSync = true;
      if (Math.abs(videoRef.current.currentTime - currentTime) > 1.5) {
        videoRef.current.currentTime = currentTime;
      }
      if (action === "play") {
        videoRef.current.play().catch(() => {});
      } else if (action === "pause") {
        videoRef.current.pause();
      }
      setTimeout(() => {
        isInternalSync = false;
      }, 300);
    });

    const handlePlay = () => {
      if (!isInternalSync) {
        socket.emit("video-action", {
          roomId: id,
          action: "play",
          currentTime: videoRef.current?.currentTime || 0,
        });
      }
    };

    const handlePause = () => {
      if (!isInternalSync) {
        socket.emit("video-action", {
          roomId: id,
          action: "pause",
          currentTime: videoRef.current?.currentTime || 0,
        });
      }
    };

    const handleSeeked = () => {
      if (!isInternalSync) {
        socket.emit("video-action", {
          roomId: id,
          action: "seek",
          currentTime: videoRef.current?.currentTime || 0,
        });
      }
    };

    const vidEl = videoRef.current;
    if (vidEl) {
      vidEl.addEventListener("play", handlePlay);
      vidEl.addEventListener("pause", handlePause);
      vidEl.addEventListener("seeked", handleSeeked);
    }

    // WebRTC Signaling Handlers
    socket.on("user-joined", async (newParticipant: Participant) => {
      const pc = createPeerConnection(newParticipant.socketId, socket, id);
      peerConnections.current[newParticipant.socketId] = pc;

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("webrtc-offer", {
        targetSocketId: newParticipant.socketId,
        offer,
        caller: { name: userName },
      });
    });

    socket.on("webrtc-offer", async ({ offer, callerSocketId }) => {
      const pc = createPeerConnection(callerSocketId, socket, id);
      peerConnections.current[callerSocketId] = pc;

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc-answer", {
        targetSocketId: callerSocketId,
        answer,
      });
    });

    socket.on("webrtc-answer", async ({ answer, responderSocketId }) => {
      const pc = peerConnections.current[responderSocketId];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("webrtc-ice", async ({ candidate, fromSocketId }) => {
      const pc = peerConnections.current[fromSocketId];
      if (pc && candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
      }
    });

    socket.on("user-left", ({ socketId }) => {
      if (peerConnections.current[socketId]) {
        peerConnections.current[socketId].close();
        delete peerConnections.current[socketId];
      }
      setRemoteStreams((prev) => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
      });
    });

    return () => {
      if (vidEl) {
        vidEl.removeEventListener("play", handlePlay);
        vidEl.removeEventListener("pause", handlePause);
        vidEl.removeEventListener("seeked", handleSeeked);
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      socket.disconnect();
    };
  }, [isOpen, video._id]);

  const createPeerConnection = (targetSocketId: string, socket: Socket, rId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc-ice", {
          targetSocketId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [targetSocketId]: event.streams[0],
      }));
    };

    return pc;
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}/watch/${video._id}?party=${roomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
        socketRef.current?.emit("toggle-media-state", {
          roomId,
          audio: isMuted,
          video: !isCameraOff,
        });
      }
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isCameraOff;
        setIsCameraOff(!isCameraOff);
        socketRef.current?.emit("toggle-media-state", {
          roomId,
          audio: !isMuted,
          video: isCameraOff,
        });
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace video track in peer connections
        Object.values(peerConnections.current).forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(screenTrack);
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error("Screen share error:", err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
    if (cameraTrack) {
      Object.values(peerConnections.current).forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) sender.replaceTrack(cameraTrack);
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    }
    setIsScreenSharing(false);
  };

  // Session Recording Handler (Optional Host Feature)
  const toggleRecording = () => {
    if (!isRecording) {
      const streamToRecord = screenStreamRef.current || localStreamRef.current;
      if (!streamToRecord) return;

      const chunks: Blob[] = [];
      const recorder = new MediaRecorder(streamToRecord, { mimeType: "video/webm" });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `watch_party_recording_${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socketRef.current) return;

    socketRef.current.emit("send-room-message", {
      roomId,
      text: messageInput.trim(),
      sender: currentUser?.name || "You",
    });
    setMessageInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/20 text-red-500 rounded-lg">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Watch Party Session</h2>
              <p className="text-xs text-zinc-400">Watching: {video.videotitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyRoomLink}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Link Copied!" : "Invite Friends"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* Video Call & Stream Area (2 Cols) */}
          <div className="md:col-span-2 p-4 flex flex-col gap-4 bg-black/40 overflow-y-auto">
            {/* Main Video Call Grid */}
            <div className="grid grid-cols-2 gap-3 flex-1 min-h-[300px]">
              {/* Local Video Stream */}
              <div className="relative bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden group">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isCameraOff ? "hidden" : "block"}`}
                />
                {isCameraOff && (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-500 bg-zinc-900">
                    <VideoOff className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                  You {isMuted && "(Muted)"}
                </div>
              </div>

              {/* Remote Participant Streams */}
              {Object.entries(remoteStreams).map(([socketId, stream]) => (
                <div
                  key={socketId}
                  className="relative bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden"
                >
                  <video
                    autoPlay
                    playsInline
                    ref={(el) => {
                      if (el) el.srcObject = stream;
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                    {participants.find((p) => p.socketId === socketId)?.userName || "Participant"}
                  </div>
                </div>
              ))}
            </div>

            {/* Video Call Action Controls Toolbar */}
            <div className="flex items-center justify-center gap-3 p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${
                  isMuted ? "bg-red-600 text-white" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                }`}
                title={isMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleCamera}
                className={`p-3 rounded-full transition-colors ${
                  isCameraOff ? "bg-red-600 text-white" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                }`}
                title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
              >
                {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-full transition-colors ${
                  isScreenSharing ? "bg-blue-600 text-white" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                }`}
                title={isScreenSharing ? "Stop Screen Share" : "Share Screen"}
              >
                <Monitor className="w-5 h-5" />
              </button>

              <button
                onClick={toggleRecording}
                className={`p-3 rounded-full transition-colors ${
                  isRecording ? "bg-red-600 text-white animate-pulse" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                }`}
                title={isRecording ? "Stop Local Recording" : "Record Session"}
              >
                <CircleDot className="w-5 h-5" />
              </button>

              <button
                onClick={onClose}
                className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                title="Leave Call"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat & Participant Sidebar (1 Col) */}
          <div className="border-l border-zinc-800 flex flex-col bg-zinc-900/30">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-zinc-800">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                  activeTab === "chat"
                    ? "border-red-600 text-red-500 bg-zinc-800/40"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Chat ({messages.length})
              </button>
              <button
                onClick={() => setActiveTab("participants")}
                className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                  activeTab === "participants"
                    ? "border-red-600 text-red-500 bg-zinc-800/40"
                    : "border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" /> People ({participants.length})
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "chat" ? (
              <div className="flex-1 flex flex-col justify-between p-3 overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-xs text-zinc-500">
                      No messages yet. Say hi to your watch party!
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="bg-zinc-800/60 p-2.5 rounded-lg border border-zinc-800/80">
                        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                          <span className="font-semibold text-zinc-200">{msg.sender}</span>
                          <span className="text-[10px]">{msg.timestamp}</span>
                        </div>
                        <p className="text-xs text-zinc-300 break-words">{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={sendMessage} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Send a chat message..."
                    className="flex-1 bg-zinc-800 border border-zinc-700 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex-1 p-3 overflow-y-auto space-y-2">
                {participants.map((p) => (
                  <div
                    key={p.socketId}
                    className="flex items-center justify-between p-2.5 bg-zinc-800/40 rounded-lg border border-zinc-800"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-red-600/30 text-red-400 rounded-full flex items-center justify-center text-xs font-bold">
                        {p.userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-zinc-200 font-medium">{p.userName}</span>
                      {p.isHost && (
                        <span className="text-[10px] bg-red-600/20 text-red-400 px-1.5 py-0.5 rounded font-semibold">
                          Host
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-zinc-400">
                      {!p.audio ? <MicOff className="w-3.5 h-3.5 text-red-500" /> : <Mic className="w-3.5 h-3.5 text-zinc-400" />}
                      {!p.video ? <VideoOff className="w-3.5 h-3.5 text-red-500" /> : <Video className="w-3.5 h-3.5 text-zinc-400" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
