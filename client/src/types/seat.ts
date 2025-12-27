import type { ApiResponse } from "./auth";

export type SeatStatusType = "available" | "locked" | "booked" | "selected";

export interface SeatStatus {
  seatLabel: string;
  status: "available" | "locked" | "booked";
  lockedBy?: string;
  lockedAt?: number;
}

export interface GetSeatsData {
  scheduleId: string;
  totalSeats: number;
  availableCount: number;
  lockedCount: number;
  bookedCount: number;
  seats: SeatStatus[];
}

export interface LockSeatRequest {
  scheduleId: string;
  seatLabel: string;
}

export interface UnlockSeatRequest {
  scheduleId: string;
  seatLabel: string;
}

export interface LockSeatData {
  success: boolean;
  message: string;
  expiresAt?: number;
}

export interface UnlockSeatData {
  success: boolean;
  message: string;
}

export type GetSeatsResponse = ApiResponse<GetSeatsData>;
export type LockSeatResponse = ApiResponse<LockSeatData>;
export type UnlockSeatResponse = ApiResponse<UnlockSeatData>;
