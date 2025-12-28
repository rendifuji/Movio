import { useQuery } from "@tanstack/react-query";
import { transactionService } from "@/services/transaction";

export const useAdminDashboard = () => {
  const query = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => transactionService.getAdminDashboard(),
  });

  return {
    data: query.data?.data?.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
