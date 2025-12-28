import React from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Clock, Film, Calendar, Download } from "lucide-react";
import QRCode from "react-qr-code";

const TicketPage: React.FC = () => {
	const { ticketId } = useParams<{ ticketId: string }>();
	return (
		<div className="min-h-screen bg-[#020410] flex items-center justify-center font-sans text-white">
			<div className="w-full max-w-4xl">
				<button className="mb-6 p-3 rounded-xl bg-[#131b2e] border border-gray-800 hover:bg-gray-800 transition-colors">
					<ArrowLeft className="w-5 h-5 text-gray-400" />
				</button>

				<div className="bg-[#0B1221] rounded-2xl border border-[#1e293b] flex flex-col md:flex-row overflow-hidden shadow-2xl">
					<div className="flex-1 p-8 md:p-12 flex flex-col justify-center ">

						<h1 className="text-4xl md:text-5xl font-bold  text-white tracking-tight">
							Zootopia 2
						</h1>

						<div className="mt-6 flex flex-col gap-5">

							<div className="flex items-center text-gray-400 text-sm md:text-base gap-4">
								<div className="flex items-center gap-2">
									<Clock className="w-4 h-4" />
									<span>2h 30m</span>
								</div>

								<div className="flex items-center gap-2">
									<Film className="w-4 h-4" />
									<span>Fantasy</span>
								</div>

								<span className="bg-[#4ade80] text-black font-bold px-2 py-0.5 rounded text-xs">
									PG-13
								</span>
							</div>

							<div className="flex items-center text-gray-300">
								<Calendar className="w-5 h-5 text-gray-400" />
								<span className="text-lg">7 December 2025</span>
							</div>

							<div className="flex items-center text-gray-300">
								<Clock className="w-5 h-5 text-gray-400" />
								<span className="text-lg">09:00 - 11:30</span>
							</div>
							<div className="mt-auto">
								<p className="text-xl font-medium text-white">
									3 Seats <span className="text-gray-500 mx-2">-</span> D10,
									D11, D12
								</p>
							</div>
						</div>
					</div>

					<div className="hidden md:block w-px bg-gray-700  my-10"></div>

					<div className="w-full md:w-1/2 p-8 md:p-12 bg-[#0B1221] flex flex-col items-center justify-center gap-8">
						<div className="h-full relative bg-white flex justify-center items-center rounded p-2">
							<QRCode
								value={ticketId ?? ""}
								size={260}
								bgColor="#FFFFFF"
								fgColor="#000000"
								level="H"
								title="Ticket QR Code"
								className="p-2"
							/>
						</div>

						<button className="flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3 rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]">
							<Download className="w-5 h-5" />
							Download
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TicketPage;
