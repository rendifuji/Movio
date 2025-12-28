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

export const useTicketDetail = (ticketId: string | undefined) => {
  const query = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => transactionService.getTicketById(ticketId!),
    enabled: !!ticketId,
  });

  return {
    ticket: query.data?.data?.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

export const useMyTickets = () => {
  const query = useQuery({
    queryKey: ["my-tickets"],
    queryFn: () => transactionService.getMyTickets(),
  });

  return {
    tickets: query.data?.data?.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
};
