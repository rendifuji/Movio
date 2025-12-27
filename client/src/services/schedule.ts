import API from "./api";
import type {
  GetSchedulesParams,
  ScheduleListResponse,
  ScheduleResponse,
} from "@/types/schedule";

export const scheduleService = {
  getSchedules: async (
    params?: GetSchedulesParams
  ): Promise<ScheduleListResponse> => {
    const response = await API.get<ScheduleListResponse>("/schedule", {
      params,
    });
    return response.data;
  },

  getScheduleById: async (scheduleId: string): Promise<ScheduleResponse> => {
    const response = await API.get<ScheduleResponse>(`/schedule/${scheduleId}`);
    return response.data;
  },
};
