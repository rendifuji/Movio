import { useParams } from "react-router";

const TicketDetail = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  return <div>Ticket Detail — ID: {ticketId}</div>;
};

export default TicketDetail;
