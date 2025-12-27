import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import SeatLockService from "../services/seatLockService.js";

let io: SocketIOServer | null = null;

const userSessions = new Map<
	string,
	{ userId: string; scheduleId: string | null }
>();

export const initializeSocketIO = (httpServer: HTTPServer): SocketIOServer => {
	io = new SocketIOServer(httpServer, {
		cors: {
			origin: process.env.CLIENT_URL || "http://localhost:5173",
			methods: ["GET", "POST"],
			credentials: true,
		},
	});

	io.on("connection", (socket: Socket) => {
		console.log(`Socket connected: ${socket.id}`);

		socket.on(
			"join-schedule",
			async (data: { scheduleId: string; userId: string }) => {
				const { scheduleId, userId } = data;

				const session = userSessions.get(socket.id);
				if (session?.scheduleId) {
					socket.leave(`schedule:${session.scheduleId}`);
				}

				socket.join(`schedule:${scheduleId}`);
				userSessions.set(socket.id, { userId, scheduleId });

				console.log(`User ${userId} joined schedule room: ${scheduleId}`);

				const lockedSeats = await SeatLockService.getLockedSeats(scheduleId);
				socket.emit("initial-locked-seats", { scheduleId, lockedSeats });
			}
		);

		socket.on("leave-schedule", async (data: { scheduleId: string }) => {
			const { scheduleId } = data;
			const session = userSessions.get(socket.id);

			if (session?.userId && session.scheduleId === scheduleId) {
				const releasedSeats = await SeatLockService.unlockAllUserSeats(
					scheduleId,
					session.userId
				);

				if (releasedSeats.length > 0) {
					socket.to(`schedule:${scheduleId}`).emit("server:seats-released", {
						scheduleId,
						seatLabels: releasedSeats,
						userId: session.userId,
					});
				}
			}

			socket.leave(`schedule:${scheduleId}`);
			userSessions.set(socket.id, { userId: session?.userId || "", scheduleId: null });
		});

		socket.on("disconnect", async () => {
			console.log(`Socket disconnected: ${socket.id}`);

			const session = userSessions.get(socket.id);
			if (session?.userId && session.scheduleId) {
				const releasedSeats = await SeatLockService.unlockAllUserSeats(
					session.scheduleId,
					session.userId
				);

				if (releasedSeats.length > 0) {
					io?.to(`schedule:${session.scheduleId}`).emit("server:seats-released", {
						scheduleId: session.scheduleId,
						seatLabels: releasedSeats,
						userId: session.userId,
					});
				}
			}

			userSessions.delete(socket.id);
		});
	});

	console.log("Socket.IO initialized");
	return io;
};

export const getIO = (): SocketIOServer => {
	if (!io) {
		throw new Error("Socket.IO not initialized");
	}
	return io;
};

export const broadcastSeatLocked = (
	scheduleId: string,
	seatLabel: string,
	userId: string
) => {
	if (io) {
		io.to(`schedule:${scheduleId}`).emit("server:seat-locked", {
			scheduleId,
			seatLabel,
			lockedBy: userId,
			lockedAt: Date.now(),
		});
	}
};

export const broadcastSeatReleased = (
	scheduleId: string,
	seatLabel: string,
	userId: string
) => {
	if (io) {
		io.to(`schedule:${scheduleId}`).emit("server:seat-released", {
			scheduleId,
			seatLabel,
			releasedBy: userId,
		});
	}
};

export const broadcastSeatsReleased = (
	scheduleId: string,
	seatLabels: string[],
	userId: string
) => {
	if (io) {
		io.to(`schedule:${scheduleId}`).emit("server:seats-released", {
			scheduleId,
			seatLabels,
			releasedBy: userId,
		});
	}
};
