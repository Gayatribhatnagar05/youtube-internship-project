import { Server } from "socket.io";

export function setupWatchPartySocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // roomId -> Map(socketId -> { socketId, userId, userName, audio: true, video: true, isHost: boolean })
  const rooms = new Map();

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join-room", ({ roomId, user, isHost }) => {
      socket.join(roomId);
      socket.roomId = roomId;

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map());
      }
      const room = rooms.get(roomId);
      const participant = {
        socketId: socket.id,
        userId: user?.id || socket.id,
        userName: user?.name || `Guest_${socket.id.slice(0, 4)}`,
        audio: true,
        video: true,
        isHost: isHost || room.size === 0,
      };

      room.set(socket.id, participant);

      // Send list of current participants to new user
      const participantList = Array.from(room.values());
      io.to(roomId).emit("room-participants", participantList);

      // Notify others that user joined
      socket.to(roomId).emit("user-joined", participant);
    });

    // Video sync handler
    socket.on("video-action", ({ roomId, action, currentTime }) => {
      socket.to(roomId).emit("video-action-sync", {
        action,
        currentTime,
        triggeredBy: socket.id,
      });
    });

    // Chat handler
    socket.on("send-room-message", ({ roomId, text, sender }) => {
      const msg = {
        id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
        sender,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      io.to(roomId).emit("receive-room-message", msg);
    });

    // WebRTC Signaling
    socket.on("webrtc-offer", ({ targetSocketId, offer, caller }) => {
      io.to(targetSocketId).emit("webrtc-offer", {
        offer,
        callerSocketId: socket.id,
        caller,
      });
    });

    socket.on("webrtc-answer", ({ targetSocketId, answer }) => {
      io.to(targetSocketId).emit("webrtc-answer", {
        answer,
        responderSocketId: socket.id,
      });
    });

    socket.on("webrtc-ice", ({ targetSocketId, candidate }) => {
      io.to(targetSocketId).emit("webrtc-ice", {
        candidate,
        fromSocketId: socket.id,
      });
    });

    // Media toggles (mute / camera off)
    socket.on("toggle-media-state", ({ roomId, audio, video }) => {
      const room = rooms.get(roomId);
      if (room && room.has(socket.id)) {
        const participant = room.get(socket.id);
        participant.audio = audio;
        participant.video = video;
        io.to(roomId).emit("room-participants", Array.from(room.values()));
      }
    });

    const handleLeave = () => {
      const roomId = socket.roomId;
      if (roomId && rooms.has(roomId)) {
        const room = rooms.get(roomId);
        const participant = room.get(socket.id);
        room.delete(socket.id);

        if (room.size === 0) {
          rooms.delete(roomId);
        } else {
          // If host left, assign host to first remaining participant
          if (participant?.isHost) {
            const firstRemaining = room.values().next().value;
            if (firstRemaining) firstRemaining.isHost = true;
          }
          io.to(roomId).emit("room-participants", Array.from(room.values()));
          socket.to(roomId).emit("user-left", { socketId: socket.id, userName: participant?.userName });
        }
      }
    };

    socket.on("leave-room", handleLeave);
    socket.on("disconnect", handleLeave);
  });

  return io;
}
