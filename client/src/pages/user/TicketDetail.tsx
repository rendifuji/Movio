import React, { useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Film, Calendar, Download, Loader2 } from "lucide-react";
import QRCode from "react-qr-code";
import { useTicketDetail } from "@/hooks/transaction";
import { formatDuration, formatDate, formatTime, formatGenre } from "@/lib/formatters";

const TicketPage: React.FC = () => {
	const { ticketId } = useParams<{ ticketId: string }>();
	const navigate = useNavigate();
	const { ticket, isLoading, error } = useTicketDetail(ticketId);

	const qrCodeValue = ticket
		? JSON.stringify({
				ticketId: ticket.ticketId,
				movie: ticket.movieTitle,
				seat: ticket.seats.join(", "),
				date: ticket.date,
				time: ticket.startTime,
				qrCode: ticket.qrCode,
		  })
		: ticketId ?? "";

	const qrRef = useRef<HTMLDivElement>(null);

	const handleDownload = useCallback(() => {
		const svg = qrRef.current?.querySelector("svg");
		if (!svg) return;

		const svgData = new XMLSerializer().serializeToString(svg);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		const size = 300;
		canvas.width = size;
		canvas.height = size;

		img.onload = () => {
			if (ctx) {
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(0, 0, size, size);
				ctx.drawImage(img, 0, 0, size, size);

				const pngUrl = canvas.toDataURL("image/png");
				const downloadLink = document.createElement("a");
				downloadLink.href = pngUrl;
				downloadLink.download = `ticket-${ticket?.ticketId || "qr"}.png`;
				document.body.appendChild(downloadLink);
				downloadLink.click();
				document.body.removeChild(downloadLink);
			}
		};

		img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
	}, [ticket?.ticketId]);

	if (isLoading) {
		return (
			<div className="w-full min-h-screen bg-[#020410] flex items-center justify-center">
				<Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
			</div>
		);
	}

	if (error || !ticket) {
		return (
			<div className="w-full min-h-screen bg-[#020410] flex flex-col items-center justify-center gap-4">
				<p className="text-red-500">Failed to load ticket details</p>
				<button
					onClick={() => navigate(-1)}
					className="text-blue-500 hover:underline"
				>
					Go back
				</button>
			</div>
		);
	}

	return (
		<div className="flex-1 bg-[#020410] flex items-center justify-center font-sans text-white">
			<div className="w-full max-w-4xl">
				<button
					onClick={() => navigate(-1)}
					className="cursor-pointer mb-6 p-3 rounded-xl bg-[#131b2e] border border-gray-800 hover:bg-gray-800 transition-colors"
				>
					<ArrowLeft className="w-5 h-5 text-gray-400" />
				</button>

				<div className="bg-[#0B1221] rounded-2xl border border-[#1e293b] flex flex-col md:flex-row overflow-hidden shadow-2xl">
					<div className="flex-1 p-8 md:p-12 flex flex-col justify-center ">
						<h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
							{ticket.movieTitle}
						</h1>

						<div className="mt-6 flex flex-col gap-5">
							<div className="flex items-center text-gray-400 text-sm md:text-base gap-4">
								<div className="flex items-center gap-2">
									<Clock className="w-4 h-4" />
									<span>{formatDuration(ticket.durationMinutes)}</span>
								</div>

								<div className="flex items-center gap-2">
									<Film className="w-4 h-4" />
									<span>{formatGenre(ticket.genre)}</span>
								</div>

								<span className="bg-[#4ade80] text-black font-bold px-2 py-0.5 rounded text-xs">
									{ticket.rating}
								</span>
							</div>

							<div className="flex items-center gap-2 text-gray-300">
								<Calendar className="w-5 h-5 text-gray-400" />
								<span className="text-lg">{formatDate(ticket.date)}</span>
							</div>

							<div className="flex items-center gap-2 text-gray-300">
								<Clock className="w-5 h-5 text-gray-400" />
								<span className="text-lg">
									{formatTime(ticket.startTime)} - {formatTime(ticket.endTime)}
								</span>
							</div>

							<div className="text-gray-400 text-sm">
								<p>{ticket.cinemaName} - {ticket.cinemaCity}</p>
								<p>{ticket.studioName}</p>
							</div>

							<div className="mt-auto">
								<p className="text-xl font-medium text-white">
									{ticket.seatCount} Seat{ticket.seatCount > 1 ? "s" : ""}{" "}
									<span className="text-gray-500 mx-2">-</span>
									{ticket.seats.join(", ")}
								</p>
							</div>
						</div>
					</div>

					<div className="hidden md:block w-px bg-gray-700 my-10"></div>

					<div className="w-full md:w-1/2 p-8 md:p-12 bg-[#0B1221] flex flex-col items-center justify-center gap-8">
						<div ref={qrRef} className="h-full relative bg-white flex justify-center items-center rounded p-2">
							<QRCode
								value={qrCodeValue}
								size={260}
								bgColor="#FFFFFF"
								fgColor="#000000"
								level="H"
								title="Ticket QR Code"
								className="p-2"
							/>
						</div>

						<button 
							onClick={handleDownload}
							className="cursor-pointer flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3 rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]"
						>
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
