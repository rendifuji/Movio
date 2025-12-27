import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { seatService } from "@/services/seat";
import { useSocket } from "@/hooks/useSocket";

const LOCK_TTL = 600;

interface UseSeatsOptions {
  scheduleId: string;
  userId: string;
}

export const useSeats = ({ scheduleId, userId }: UseSeatsOptions) => {
  const [lockedByOthers, setLockedByOthers] = useState<Set<string>>(new Set());
  const [mySeats, setMySeats] = useState<Map<string, number>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setLockedByOthers(new Set());
      setMySeats(new Map());
      setCountdown(null);
    }, 0);
    return () => clearTimeout(id);
  }, [scheduleId]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["seats", scheduleId],
    queryFn: () => seatService.getSeats(scheduleId),
    enabled: !!scheduleId,
    refetchInterval: 30000,
  });

  useSocket(scheduleId, userId, {
    onConnect: () => setIsConnected(true),
    onDisconnect: () => setIsConnected(false),
    onSeatLocked: ({ seatLabel, lockedBy, lockedAt }) => {
      if (lockedBy === userId) {
        setMySeats((prev) => new Map(prev).set(seatLabel, lockedAt));
      } else {
        setLockedByOthers((prev) => new Set(prev).add(seatLabel));
      }
    },
    onSeatReleased: ({ seatLabel }) => {
      setLockedByOthers((prev) => {
        const next = new Set(prev);
        next.delete(seatLabel);
        return next;
      });
    },
    onSeatsReleased: ({ seatLabels }) => {
      setLockedByOthers((prev) => {
        const next = new Set(prev);
        seatLabels.forEach((s) => next.delete(s));
        return next;
      });
    },
    onSeatExpired: ({ seatLabel }) => {
      // Handle seat expiration - remove from both lockedByOthers and mySeats
      setLockedByOthers((prev) => {
        const next = new Set(prev);
        next.delete(seatLabel);
        return next;
      });
      setMySeats((prev) => {
        const next = new Map(prev);
        next.delete(seatLabel);
        return next;
      });
    },
    onInitialSeats: ({ lockedSeats }) => {
      const others = new Set<string>();
      const mine = new Map<string, number>();
      lockedSeats.forEach((s) => {
        if (s.lockedBy === userId) mine.set(s.seatLabel, s.lockedAt);
        else others.add(s.seatLabel);
      });
      setLockedByOthers(others);
      setMySeats(mine);
    },
  });

  useEffect(() => {
    if (mySeats.size === 0) {
      const id = setTimeout(() => setCountdown(null), 0);
      return () => clearTimeout(id);
    }

    const earliest = Math.min(...mySeats.values());

    const tick = () => {
      const remaining = LOCK_TTL - Math.floor((Date.now() - earliest) / 1000);
      if (remaining <= 0) {
        setMySeats(new Map());
        setCountdown(null);
        refetch();
      } else {
        setCountdown(remaining);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [mySeats, refetch]);

  const lockMutation = useMutation({
    mutationFn: (seatLabel: string) =>
      seatService.lockSeat({ scheduleId, seatLabel }),
    onSuccess: (res, seatLabel) => {
      if (res.data.success) {
        const lockedAt = res.data.expiresAt
          ? res.data.expiresAt - LOCK_TTL * 1000
          : Date.now();
        setMySeats((prev) => new Map(prev).set(seatLabel, lockedAt));
      }
    },
  });

  const unlockMutation = useMutation({
    mutationFn: (seatLabel: string) =>
      seatService.unlockSeat({ scheduleId, seatLabel }),
    onSuccess: (_, seatLabel) => {
      setMySeats((prev) => {
        const next = new Map(prev);
        next.delete(seatLabel);
        return next;
      });
    },
  });

  const getSeatStatus = (seatLabel: string) => {
    if (mySeats.has(seatLabel)) return "selected";
    if (lockedByOthers.has(seatLabel)) return "locked";
    const apiSeat = data?.data.seats.find((s) => s.seatLabel === seatLabel);
    if (apiSeat?.status === "booked") return "booked";
    if (apiSeat?.status === "locked")
      return apiSeat.lockedBy === userId ? "selected" : "locked";
    return "available";
  };

  const toggleSeat = async (seatLabel: string) => {
    const status = getSeatStatus(seatLabel);
    if (status === "booked" || status === "locked") return;
    if (status === "selected") {
      await unlockMutation.mutateAsync(seatLabel);
    } else {
      await lockMutation.mutateAsync(seatLabel);
    }
  };

  const formatCountdown = (secs: number | null) => {
    if (secs === null) return null;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const getEarliestLockedAt = () => {
    if (mySeats.size === 0) return null;
    return Math.min(...mySeats.values());
  };

  return {
    selectedSeats: Array.from(mySeats.keys()),
    totalSeats: data?.data.totalSeats ?? 0,
    isLoading,
    isConnected,
    isLocking: lockMutation.isPending,
    countdown,
    formattedCountdown: formatCountdown(countdown),
    toggleSeat,
    getSeatStatus,
    getEarliestLockedAt,
  };
};
