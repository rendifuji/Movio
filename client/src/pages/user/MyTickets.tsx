import { useNavigate } from "react-router-dom";
import { useMyTickets } from "@/hooks/transaction";
import { Loader2, Calendar, Clock, MapPin } from "lucide-react";
import { formatDate, formatTime } from "@/lib/formatters";

const MyTickets = () => {
  const navigate = useNavigate();
  const { tickets, isLoading, error } = useMyTickets();

  return (
    <div className="flex flex-1 justify-center items-center py-10 px-4 md:px-40 w-full">
      <div className="w-full flex flex-col max-w-7xl">
        <p className="font-bold text-left text-3xl py-5 text-white">My Tickets</p>
        <div className="bg-[#0C1325] flex flex-col w-full p-10 justify-center items-center border-[#334155] border-2 border-solid rounded-xl min-h-[400px]">
          {isLoading && (
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          )}
          
          {error && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-red-400">Failed to load tickets</p>
              <p className="text-sm text-gray-500">{(error as Error).message}</p>
            </div>
          )}
          
          {!isLoading && !error && (
            <div className="flex flex-wrap gap-8 justify-center w-full">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.ticketId} 
                  className="bg-[#020617] w-full max-w-[500px] border border-[#334155] rounded-2xl flex flex-row overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => navigate(`/ticket/${ticket.ticketId}`)}
                >
                  <div className="w-1/3 min-w-[120px] relative">
                    <img 
                      src={ticket.posterUrl} 
                      alt={ticket.movieTitle} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                  
                  <div className="flex flex-col p-5 text-left w-2/3 justify-between">
                    <div>
                      <p className="font-bold text-xl md:text-2xl mb-3 text-white truncate" title={ticket.movieTitle}>
                        {ticket.movieTitle}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex flex-row items-center gap-2 text-[#9da4ad]">
                          <Calendar className="w-4 h-4 text-blue-400"/>
                          <p className="text-sm">{formatDate(ticket.date)}</p>
                        </div>
                        
                        <div className="flex flex-row items-center gap-2 text-[#9da4ad]">
                          <Clock className="w-4 h-4 text-blue-400"/>
                          <p className="text-sm">
                            {formatTime(ticket.startTime)} - {formatTime(ticket.endTime)}
                          </p>
                        </div>
                        
                        <div className="flex flex-row items-center gap-2 text-[#9da4ad]">
                          <MapPin className="w-4 h-4 text-blue-400"/>
                          <p className="text-sm truncate">{ticket.cinemaName}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-2 border-t border-[#334155]/50">
                      <p className="text-sm font-medium text-white truncate">
                        {ticket.seatCount} Seat{ticket.seatCount > 1 ? 's' : ''} • <span className="text-blue-400">{ticket.seats.join(", ")}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {tickets.length === 0 && (
                <div className="flex flex-col items-center gap-4 text-[#9da4ad]">
                  <FilmIcon />
                  <p>No tickets found yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper for the empty state
const FilmIcon = () => (
  <svg 
    className="w-16 h-16 opacity-20" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);

export default MyTickets;
