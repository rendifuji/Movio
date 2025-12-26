import { prisma } from "../lib/prisma.js";
import { TransactionStatus, TicketStatus, MovieStatus } from "@prisma/client";
import crypto from "crypto";

class TransactionRepository {
	static async getScheduleById(scheduleId: string) {
		return await prisma.schedule.findUnique({
			where: { scheduleId },
			include: {
				movie: true,
				studio: {
					include: {
						cinema: true,
					},
				},
			},
		});
	}

	static async getBookedSeats(scheduleId: string) {
		const tickets = await prisma.ticket.findMany({
			where: {
				scheduleId,
				status: {
					in: [TicketStatus.VALID, TicketStatus.USED],
				},
			},
			select: {
				seatLabel: true,
			},
		});

		return tickets.map((ticket) => ticket.seatLabel);
	}

	static async createTransactionWithTickets(
		userId: string,
		scheduleId: string,
		seatLabels: string[],
		pricePerSeat: number
	) {
		const totalAmount = pricePerSeat * seatLabels.length;

		return await prisma.$transaction(async (tx) => {
			// Create transaction with PAID status
			const transaction = await tx.transaction.create({
				data: {
					userId,
					totalAmount,
					status: TransactionStatus.PAID,
				},
			});

			// Create tickets for each seat
			const ticketPromises = seatLabels.map((seatLabel) => {
				const qrCode = crypto.randomBytes(32).toString("hex");
				return tx.ticket.create({
					data: {
						transactionId: transaction.transactionId,
						scheduleId,
						seatLabel,
						qrCode,
						status: TicketStatus.VALID,
					},
				});
			});

			const tickets = await Promise.all(ticketPromises);

			return {
				...transaction,
				tickets,
			};
		});
	}

	static async getTransactionById(transactionId: string) {
		return await prisma.transaction.findUnique({
			where: { transactionId },
			include: {
				tickets: {
					include: {
						schedule: {
							include: {
								movie: true,
								studio: {
									include: {
										cinema: true,
									},
								},
							},
						},
					},
				},
			},
		});
	}

	static async getTransactionsByUserId(userId: string) {
		return await prisma.transaction.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
			include: {
				tickets: {
					include: {
						schedule: {
							include: {
								movie: true,
								studio: {
									include: {
										cinema: true,
									},
								},
							},
						},
					},
				},
			},
		});
	}

	static async getTicketById(ticketId: string) {
		return await prisma.ticket.findUnique({
			where: { ticketId },
			include: {
				schedule: {
					include: {
						movie: true,
						studio: {
							include: {
								cinema: true,
							},
						},
					},
				},
				transaction: {
					include: {
						tickets: true,
					},
				},
			},
		});
	}

	static async getTicketsByUserId(userId: string) {
		return await prisma.ticket.findMany({
			where: {
				transaction: {
					userId,
				},
			},
			orderBy: {
				transaction: {
					createdAt: "desc",
				},
			},
			include: {
				schedule: {
					include: {
						movie: true,
						studio: {
							include: {
								cinema: true,
							},
						},
					},
				},
				transaction: {
					include: {
						tickets: true,
					},
				},
			},
		});
	}

	static async getUserById(userId: string) {
		return await prisma.user.findUnique({
			where: { userId },
		});
	}

	// Admin Dashboard
	static async getTotalRevenue() {
		const result = await prisma.transaction.aggregate({
			where: {
				status: TransactionStatus.PAID,
			},
			_sum: {
				totalAmount: true,
			},
		});

		return Number(result._sum.totalAmount) || 0;
	}

	static async getTotalTicketsSold() {
		return await prisma.ticket.count({
			where: {
				status: {
					in: [TicketStatus.VALID, TicketStatus.USED],
				},
			},
		});
	}

	static async getNowShowingMoviesCount() {
		return await prisma.movie.count({
			where: {
				status: MovieStatus.NOW_SHOWING,
			},
		});
	}

	static async getRecentTransactions(limit: number = 10) {
		return await prisma.transaction.findMany({
			orderBy: { createdAt: "desc" },
			take: limit,
			include: {
				user: {
					select: {
						userId: true,
						name: true,
						email: true,
					},
				},
				tickets: {
					include: {
						schedule: {
							include: {
								movie: {
									select: {
										movieId: true,
										title: true,
										posterUrl: true,
									},
								},
							},
						},
					},
				},
			},
		});
	}
}

export default TransactionRepository;
