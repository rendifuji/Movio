import API from "./api";
import type {
  GetSchedulesParams,
  ScheduleListResponse,
  ScheduleResponse,
  CreateScheduleRequest,
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

  getAdminSchedules: async (
    params?: GetSchedulesParams
  ): Promise<ScheduleListResponse> => {
    const response = await API.get<ScheduleListResponse>("/schedule/admin", {
      params,
    });
    return response.data;
  },

  createSchedule: async (
    data: CreateScheduleRequest
  ): Promise<ScheduleResponse> => {
    const response = await API.post<ScheduleResponse>("/schedule/admin", data);
    return response.data;
  },

  deleteSchedule: async (scheduleId: string): Promise<void> => {
    await API.delete(`/schedule/admin/${scheduleId}`);
  },
};
