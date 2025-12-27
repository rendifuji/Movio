import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { BASE_URL } from "@/services/api";
import { seatService } from "@/services/seat";
import type { AuthUser } from "@/types/auth";

const SOCKET_URL = BASE_URL.replace("/api", "") || "http://localhost:3000";
const LOCK_TTL = 600; // 10 minutes

export interface SeatLockData {
  scheduleId: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  movieDuration: number;
  movieGenre: string;
  movieRating: string;
  cinemaName: string;
  studioName: string;
  date: string;
  startTime: string;
  seats: string[];
  lockedAt: number;
  price: number;
}

interface SeatLockContextType {
  lockData: SeatLockData | null;
  countdown: number | null;
  formattedCountdown: string | null;
  isConnected: boolean;
  isNavigatingToCheckout: boolean;
  setLockData: (data: SeatLockData) => void;
  setNavigatingToCheckout: (value: boolean) => void;
  clearLocks: () => Promise<void>;
}

const SeatLockContext = createContext<SeatLockContextType | null>(null);

const getUser = (): AuthUser | null => {
  const stored = localStorage.getItem("authUser");
  return stored ? JSON.parse(stored) : null;
};

const formatCountdown = (secs: number | null): string | null => {
  if (secs === null) return null;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

interface Props {
  children: ReactNode;
}

export const SeatLockProvider = ({ children }: Props) => {
  const [lockData, setLockData] = useState<SeatLockData | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isNavigatingToCheckout, setNavigatingToCheckout] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const userId = getUser()?.id;

  // Connect/disconnect socket based on lock data
  useEffect(() => {
    if (!lockData?.scheduleId || !userId) {
      // Disconnect if no active locks
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        // defer setState to avoid synchronous state update in effect
        const id = setTimeout(() => setIsConnected(false), 0);
        return () => clearTimeout(id);
      }
      return;
    }

    // Connect if we have lock data
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      // Join with preserveLocks flag - server won't release seats on rejoin
      socket.emit("join-schedule", {
        scheduleId: lockData.scheduleId,
        userId,
        preserveLocks: true,
      });
    });

    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [lockData?.scheduleId, userId]);

  // Countdown timer
  useEffect(() => {
    if (!lockData?.lockedAt) {
      return;
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - lockData.lockedAt) / 1000);
      const remaining = LOCK_TTL - elapsed;

      if (remaining <= 0) {
        setLockData(null);
        setCountdown(null);
      } else {
        setCountdown(remaining);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lockData?.lockedAt]);

  // Clear countdown when lockData is cleared (deferred)
  useEffect(() => {
    if (!lockData) {
      const id = setTimeout(() => setCountdown(null), 0);
      return () => clearTimeout(id);
    }
  }, [lockData]);

  const clearLocks = async () => {
    const scheduleId = lockData?.scheduleId;
    if (scheduleId) {
      try {
        await seatService.unlockAllSeats(scheduleId);
        // Emit leave-schedule to broadcast release to other users
        socketRef.current?.emit("leave-schedule", { scheduleId });
      } catch (err) {
        console.error("Failed to unlock seats:", err);
      }
    }
    setLockData(null);
    setCountdown(null);
    setNavigatingToCheckout(false);
  };

  return (
    <SeatLockContext.Provider
      value={{
        lockData,
        countdown,
        formattedCountdown: formatCountdown(countdown),
        setLockData,
        clearLocks,
        isConnected,
        isNavigatingToCheckout,
        setNavigatingToCheckout,
      }}
    >
      {children}
    </SeatLockContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSeatLockContext = () => {
  const ctx = useContext(SeatLockContext);
  if (!ctx)
    throw new Error("useSeatLockContext must be used within SeatLockProvider");
  return ctx;
};
