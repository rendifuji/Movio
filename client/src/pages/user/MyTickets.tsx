import { Endgame, Zootopia, JJK } from "@/assets/images";
import { Map, CalenderLogo, Clock } from "@/assets/logo";

const tickets = [
  {id: 1, title: 'Zootopia',  image: Zootopia, desc: ""},
  {id: 2, title: 'Jujutsu Kaisen: Execution', image: JJK},
  {id: 3, title: 'AVENGERSS', image: Endgame}
]

const MyTickets = () => {
  return(
  <div className="flex justify-center items-center py-10 px-40 w-full">
      <div className="flex flex-col">
        <p className="font-bold text-left text-3xl py-5">My Tickets</p>
        <div className="bg-[#0C1325] flex flex-col w-full p-10 justify-center items-center border-[#334155] border-2 border-solid">
            <div className="flex flex-wrap gap-10 justify-center">
              {tickets.map(ticket => (
                <div key={ticket.id} className="bg-[#020617] w-[40%] border border-[#334155] rounded-2xl flex flex-row">
                  <img src={ticket.image} alt={ticket.title} className="w-1/2 p-5" />
                  <div className="flex flex-col p-5 text-left w-full min-w-0">
                    <p className="font-bold text-2xl py-3 truncate" title={ticket.title}>
                      {ticket.title}
                      </p>
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
            </div>
        </div>
      </div>
    </div>
  );
};

export default MyTickets;
