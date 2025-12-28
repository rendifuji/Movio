import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import SeatLockService from "../services/seatLockService.js";
import { redisSubscriber, enableKeyspaceNotifications } from "./redis.js";

let io: SocketIOServer | null = null;

const userSessions = new Map<
  string,
  { userId: string; scheduleId: string | null }
>();

const setupKeyExpirationListener = async () => {
  try {
    await enableKeyspaceNotifications();

    await redisSubscriber.psubscribe("__keyevent@*__:expired");

    redisSubscriber.on("pmessage", (_pattern, _channel, expiredKey) => {
      if (expiredKey.startsWith("seat:")) {
        const parts = expiredKey.split(":");
        if (parts.length >= 3) {
          const scheduleId = parts[1];
          const seatLabel = parts.slice(2).join(":");

          console.log(`Seat lock expired: ${scheduleId} - ${seatLabel}`);

          if (io && scheduleId) {
            io.to(`schedule:${scheduleId}`).emit("server:seat-expired", {
              scheduleId,
              seatLabel,
            });
          }
        }
      }
    });

    console.log("Redis key expiration listener active");
  } catch (err) {
    console.error("Failed to setup key expiration listener:", err);
  }
};

export const initializeSocketIO = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  setupKeyExpirationListener();

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on(
      "join-schedule",
      async (data: { scheduleId: string; userId: string }) => {
        const { scheduleId, userId } = data;

        const session = userSessions.get(socket.id);
        if (session?.scheduleId) {
          socket.leave(`schedule:${session.scheduleId}`);
        }

        socket.join(`schedule:${scheduleId}`);
        userSessions.set(socket.id, { userId, scheduleId });

        console.log(`User ${userId} joined schedule room: ${scheduleId}`);

        const lockedSeats = await SeatLockService.getLockedSeats(scheduleId);
        socket.emit("initial-locked-seats", { scheduleId, lockedSeats });
      }
    );

    socket.on("leave-schedule", async (data: { scheduleId: string }) => {
      const { scheduleId } = data;
      const session = userSessions.get(socket.id);

      if (session?.userId && session.scheduleId === scheduleId) {
        const releasedSeats = await SeatLockService.unlockAllUserSeats(
          scheduleId,
          session.userId
        );

        if (releasedSeats.length > 0) {
          socket.to(`schedule:${scheduleId}`).emit("server:seats-released", {
            scheduleId,
            seatLabels: releasedSeats,
            userId: session.userId,
          });
        }
      }

      socket.leave(`schedule:${scheduleId}`);
      userSessions.set(socket.id, {
        userId: session?.userId || "",
        scheduleId: null,
      });
    });

    socket.on("disconnect", async () => {
      console.log(`Socket disconnected: ${socket.id}`);

      userSessions.delete(socket.id);
    });
  });

  console.log("Socket.IO initialized");
  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

export const broadcastSeatLocked = (
  scheduleId: string,
  seatLabel: string,
  userId: string
) => {
  if (io) {
    io.to(`schedule:${scheduleId}`).emit("server:seat-locked", {
      scheduleId,
      seatLabel,
      lockedBy: userId,
      lockedAt: Date.now(),
    });
  }
};

export const broadcastSeatReleased = (
  scheduleId: string,
  seatLabel: string,
  userId: string
) => {
  if (io) {
    io.to(`schedule:${scheduleId}`).emit("server:seat-released", {
      scheduleId,
      seatLabel,
      releasedBy: userId,
    });
  }
};

export const broadcastSeatsReleased = (
  scheduleId: string,
  seatLabels: string[],
  userId: string
) => {
  if (io) {
    io.to(`schedule:${scheduleId}`).emit("server:seats-released", {
      scheduleId,
      seatLabels,
      releasedBy: userId,
    });
  }
};
