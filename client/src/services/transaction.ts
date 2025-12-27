import API from "./api";
import type { ApiResponse } from "@/types/auth";

export interface CheckoutRequest {
  scheduleId: string;
  seatLabels: string[];
}

export interface TicketData {
  ticketId: string;
  movieTitle: string;
  durationMinutes: number;
  genre: string;
  rating: string;
  date: string;
  startTime: string;
  endTime: string;
  cinemaName: string;
  cinemaCity: string;
  studioName: string;
  seatCount: number;
  seats: string[];
  qrCode: string;
}

export interface TicketSummary {
  ticketId: string;
  movieTitle: string;
  posterUrl: string;
  date: string;
  startTime: string;
  endTime: string;
  cinemaName: string;
  cinemaCity: string;
  seatCount: number;
  seats: string[];
}

export interface TransactionData {
  transactionId: string;
  totalAmount: number;
  tickets: Array<{
    ticketId: string;
    seatLabel: string;
    price: number;
  }>;
}

export type CheckoutResponse = ApiResponse<TransactionData>;
export type TicketResponse = ApiResponse<TicketData>;
export type TicketsListResponse = ApiResponse<TicketSummary[]>;

export const transactionService = {
  checkout: (data: CheckoutRequest) =>
    API.post<CheckoutResponse>("/transaction/user/checkout", data),

  getTicketById: (ticketId: string) =>
    API.get<TicketResponse>(`/transaction/user/ticket/${ticketId}`),

  getMyTickets: () => API.get<TicketsListResponse>("/transaction/user/ticket"),
};
