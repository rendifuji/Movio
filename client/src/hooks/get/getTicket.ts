import API from "../../services/api";

export type Ticket = {
  id: number;
  title?: string;
  image?: string;
  date?: string;
  time?: string;
  location?: string;
  seats?: string;
};

export const getTicket = async (): Promise<Ticket[]> => {
  const res = await API.get("/transaction/user/ticket", { withCredentials: true });
  const payload = res.data;

  const list =
    Array.isArray(payload) ? payload :
    Array.isArray(payload?.data) ? payload.data :
    Array.isArray(payload?.data?.tickets) ? payload.data.tickets :
    Array.isArray(payload?.tickets) ? payload.tickets :
    [];

  return list.map((t: any) => ({
    id: t.id,
    title: t.title,
    image: t.image,
    date: t.date,
    time: t.time,
    location: t.location,
    seats: t.seats,
  }));
};