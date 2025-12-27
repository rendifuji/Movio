import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "@/services/api";

const SOCKET_URL = BASE_URL.replace("/api", "") || "http://localhost:3000";

interface SocketCallbacks {
  onSeatLocked?: (data: {
    seatLabel: string;
    lockedBy: string;
    lockedAt: number;
  }) => void;
  onSeatReleased?: (data: { seatLabel: string }) => void;
  onSeatsReleased?: (data: { seatLabels: string[] }) => void;
  onSeatExpired?: (data: { seatLabel: string }) => void;
  onInitialSeats?: (data: {
    lockedSeats: Array<{
      seatLabel: string;
      lockedBy: string;
      lockedAt: number;
    }>;
  }) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const useSocket = (
  scheduleId: string,
  userId: string,
  callbacks: SocketCallbacks
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!scheduleId || !userId) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      callbacks.onConnect?.();
      socket.emit("join-schedule", { scheduleId, userId });
    });

    socket.on("disconnect", () => callbacks.onDisconnect?.());
    socket.on("server:seat-locked", callbacks.onSeatLocked || (() => {}));
    socket.on("server:seat-released", callbacks.onSeatReleased || (() => {}));
    socket.on("server:seats-released", callbacks.onSeatsReleased || (() => {}));
    socket.on("server:seat-expired", callbacks.onSeatExpired || (() => {}));
    socket.on("initial-locked-seats", callbacks.onInitialSeats || (() => {}));

    return () => {
      socket.disconnect();
    };
  }, [scheduleId, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return socketRef;
};
