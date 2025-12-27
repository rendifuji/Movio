import { useQuery } from "@tanstack/react-query";
import { scheduleService } from "@/services/schedule";

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
