import API from "./api";
import type {
  GetSeatsResponse,
  LockSeatRequest,
  LockSeatResponse,
  UnlockSeatRequest,
  UnlockSeatResponse,
} from "@/types/seat";

export const seatService = {
  getSeats: async (scheduleId: string): Promise<GetSeatsResponse> => {
    const response = await API.get<GetSeatsResponse>(
      `/seats/schedule/${scheduleId}/seats`
    );
    return response.data;
  },

  lockSeat: async (data: LockSeatRequest): Promise<LockSeatResponse> => {
    const response = await API.post<LockSeatResponse>("/seats/user/lock", data);
    return response.data;
  },

  unlockSeat: async (data: UnlockSeatRequest): Promise<UnlockSeatResponse> => {
    const response = await API.post<UnlockSeatResponse>(
      "/seats/user/unlock",
      data
    );
    return response.data;
  },

  unlockAllSeats: async (scheduleId: string): Promise<UnlockSeatResponse> => {
    const response = await API.post<UnlockSeatResponse>(
      "/seats/user/unlock-all",
      {
        scheduleId,
      }
    );
    return response.data;
  },
};
