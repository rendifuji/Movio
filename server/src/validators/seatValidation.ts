import { z } from "zod";

export const lockSeatSchema = z.object({
  scheduleId: z.string().uuid("Invalid schedule ID"),
  seatLabel: z.string().min(1, "Seat label is required"),
});

export const unlockSeatSchema = z.object({
  scheduleId: z.string().uuid("Invalid schedule ID"),
  seatLabel: z.string().min(1, "Seat label is required"),
});

export const unlockAllSeatsSchema = z.object({
  scheduleId: z.string().uuid("Invalid schedule ID"),
});
