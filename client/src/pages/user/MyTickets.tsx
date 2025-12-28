import { useEffect, useState } from "react";
import { Endgame, Zootopia, JJK } from "@/assets/images";
import { Map, CalenderLogo, Clock } from "@/assets/logo";
import { getTicket } from "@/hooks/get/getTicket";

// Derive the Ticket element type from getTicket’s return type
type Ticket = Awaited<ReturnType<typeof getTicket>> extends (infer U)[] ? U : never;

const MyTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getTicket();
        if (mounted) setTickets(list);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load tickets");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex justify-center items-center py-10 px-40 w-full">
      <div className="flex flex-col">
        <p className="font-bold text-left text-3xl py-5">My Tickets</p>
        <div className="bg-[#0C1325] flex flex-col w-full p-10 justify-center items-center border-[#334155] border-2 border-solid">
          {isLoading && <p className="text-[#9da4ad]">Loading...</p>}
          {error && <p className="text-red-400">Error: {error}</p>}
          {!isLoading && !error && (
            <div className="flex flex-wrap gap-10 justify-center">
              {(Array.isArray(tickets) ? tickets : []).map((ticket) => (
                <div key={ticket.id} className="bg-[#020617] w-[40%] border border-[#334155] rounded-2xl flex flex-row">
                  <img src={ticket.image} alt={ticket.title ?? "Ticket"} className="w-1/2 p-5" />
                  <div className="flex flex-col p-5 text-left w-full min-w-0">
                    <p className="font-bold text-2xl py-3 truncate" title={ticket.title}>{ticket.title ?? "Untitled"}</p>
                    <div className="flex flex-row items-center gap-2">
                      <img src={CalenderLogo} alt="" className="w-5 h-5"/>
                      <p className="text-[#9da4ad]">7 December 2025</p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <img src={Clock} alt="" className="w-5 h-5"/>
                      <p className="text-[#9da4ad]">09:00 - 11:30</p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <img src={Map} alt="" className="w-5 h-5"/>
                      <p className="text-[#9da4ad]">Movio Central Park</p>
                    </div>
                    <p className="pt-5">3 Seats - D10, D,11, D12</p>
                  </div>
                </div>
              ))}
              {(tickets ?? []).length === 0 && <p className="text-[#9da4ad]">No tickets found.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
