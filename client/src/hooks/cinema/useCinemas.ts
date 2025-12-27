import { useQuery } from "@tanstack/react-query";
import { cinemaService } from "@/services/cinema";

export const useCinemas = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
}) => {
  const query = useQuery({
    queryKey: ["cinemas", params],
    queryFn: () => cinemaService.getCinemas(params),
  });

  return {
    cinemas: query.data?.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
};
