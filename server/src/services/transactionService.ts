import TransactionRepository from "../repositories/transactionRepository.js";
import type { CreateCheckoutRequest } from "../types/transactionType.js";

class TransactionService {
	static async checkout(userId: string, data: CreateCheckoutRequest) {
		const user = await TransactionRepository.getUserById(userId);
		if (!user) {
			throw new Error("User not found");
		}

		const schedule = await TransactionRepository.getScheduleById(
			data.scheduleId
		);
		if (!schedule) {
			throw new Error("Schedule not found");
		}

		const bookedSeats = await TransactionRepository.getBookedSeats(
			data.scheduleId
        );
        
		const conflictingSeats = data.seatLabels.filter((seat) =>
			bookedSeats.includes(seat)
		);

		if (conflictingSeats.length > 0) {
			throw new Error(`Seats already booked: ${conflictingSeats.join(", ")}`);
		}

		const pricePerSeat = Number(schedule.price);
		const transaction =
			await TransactionRepository.createTransactionWithTickets(
				userId,
				data.scheduleId,
				data.seatLabels,
				pricePerSeat
			);

		const completeTransaction = await TransactionRepository.getTransactionById(
			transaction.transactionId
		);

		return completeTransaction;
	}

	static async getTicketById(ticketId: string, userId: string) {
		const ticket = await TransactionRepository.getTicketById(ticketId);

		if (!ticket) {
			throw new Error("Ticket not found");
		}

		if (ticket.transaction.userId !== userId) {
			throw new Error("Ticket not found");
		}

		const allSeats = ticket.transaction.tickets.map((t) => t.seatLabel);

		return {
			movieTitle: ticket.schedule.movie.title,
			durationMinutes: ticket.schedule.movie.durationMinutes,
			genre: ticket.schedule.movie.genre,
			rating: ticket.schedule.movie.rating,
			date: ticket.schedule.date,
			startTime: ticket.schedule.startTime,
			endTime: ticket.schedule.endTime,
			cinemaName: ticket.schedule.studio.cinema.name,
			cinemaCity: ticket.schedule.studio.cinema.city,
			studioName: ticket.schedule.studio.name,
			seatCount: allSeats.length,
			seats: allSeats,
			qrCode: ticket.qrCode,
		};
	}

	static async getMyTickets(userId: string) {
		const tickets = await TransactionRepository.getTicketsByUserId(userId);

		// Group tickets by transactionId to combine seats
		const transactionMap = new Map<string, (typeof tickets)[0][]>();

		tickets.forEach((ticket) => {
			const transactionId = ticket.transaction.transactionId;
			if (!transactionMap.has(transactionId)) {
				transactionMap.set(transactionId, []);
			}
			transactionMap.get(transactionId)!.push(ticket);
		});

		// Transform grouped tickets into response format
		const result = Array.from(transactionMap.values())
			.filter((groupedTickets) => groupedTickets.length > 0)
			.map((groupedTickets) => {
				const firstTicket = groupedTickets[0]!;
				const allSeats = groupedTickets.map((t) => t.seatLabel);

				return {
					ticketId: firstTicket.ticketId,
					movieTitle: firstTicket.schedule.movie.title,
					posterUrl: firstTicket.schedule.movie.posterUrl,
					date: firstTicket.schedule.date,
					startTime: firstTicket.schedule.startTime,
					endTime: firstTicket.schedule.endTime,
					cinemaName: firstTicket.schedule.studio.cinema.name,
					cinemaCity: firstTicket.schedule.studio.cinema.city,
					seatCount: allSeats.length,
					seats: allSeats,
				};
			});

		return result;
	}

	static async getBookedSeats(scheduleId: string) {
		const schedule = await TransactionRepository.getScheduleById(scheduleId);
		if (!schedule) {
			throw new Error("Schedule not found");
		}

		return await TransactionRepository.getBookedSeats(scheduleId);
	}

	// Admin Dashboard
	static async getAdminDashboard() {
		const [
			totalRevenue,
			totalTicketsSold,
			nowShowingCount,
			recentTransactions,
		] = await Promise.all([
			TransactionRepository.getTotalRevenue(),
			TransactionRepository.getTotalTicketsSold(),
			TransactionRepository.getNowShowingMoviesCount(),
			TransactionRepository.getRecentTransactions(10),
		]);

		const formattedRecentTransactions = recentTransactions.map(
			(transaction) => {
				const firstTicket = transaction.tickets[0];
				const movie = firstTicket?.schedule?.movie;

				return {
					transactionId: transaction.transactionId,
					movieTitle: movie?.title || "Unknown",
					userName: transaction.user.name,
					date: transaction.createdAt,
					status: transaction.status,
				};
			}
		);

		return {
			totalRevenue,
			totalTicketsSold,
			nowShowingMovies: nowShowingCount,
			recentTransactions: formattedRecentTransactions,
		};
	}
}

export default TransactionService;
