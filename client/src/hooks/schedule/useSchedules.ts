import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "@/services/schedule";
import type {
  GetSchedulesParams,
  CreateScheduleRequest,
} from "@/types/schedule";

interface UseSchedulesOptions {
  movieId?: string;
  date?: string;
}

export const useSchedules = ({ movieId, date }: UseSchedulesOptions) => {
  const query = useQuery({
    queryKey: ["schedules", movieId, date],
    queryFn: () => scheduleService.getSchedules({ movieId, date, limit: 100 }),
    enabled: !!movieId && !!date,
  });

  return {
    schedules: query.data?.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useAdminSchedules = (params?: GetSchedulesParams) => {
  const query = useQuery({
    queryKey: ["admin-schedules", params],
    queryFn: () =>
      scheduleService.getAdminSchedules({
        ...params,
        limit: params?.limit ?? 100,
      }),
  });

  return {
    schedules: query.data?.data?.data ?? [],
    metadata: query.data?.data?.metadata,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleRequest) =>
      scheduleService.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) =>
      scheduleService.deleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-schedules"] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
};
