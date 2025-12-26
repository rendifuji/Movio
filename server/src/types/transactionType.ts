export type CreateCheckoutRequest = {
	scheduleId: string;
	seatLabels: string[];
};

export type TicketInfo = {
	ticketId: string;
	seatLabel: string;
	qrCode: string;
	status: string;
};

export type TransactionResponse = {
	transactionId: string;
	userId: string;
	totalAmount: number;
	status: string;
	createdAt: Date;
	tickets: TicketInfo[];
};

export type TicketDetailResponse = {
	ticketId: string;
	seatLabel: string;
	qrCode: string;
	status: string;
	schedule: {
		scheduleId: string;
		date: Date;
		startTime: Date;
		endTime: Date;
		price: number;
		movie: {
			movieId: string;
			title: string;
			posterUrl: string;
			durationMinutes: number;
			genre: string;
			rating: string;
		};
		studio: {
			studioId: string;
			name: string;
			cinema: {
				cinemaId: string;
				name: string;
				city: string;
			};
		};
	};
	transaction: {
		transactionId: string;
		totalAmount: number;
		status: string;
		createdAt: Date;
	};
};

export type MyTicketResponse = {
	transactionId: string;
	movie: {
		movieId: string;
		title: string;
		posterUrl: string;
		durationMinutes: number;
		genre: string;
		rating: string;
	};
	schedule: {
		scheduleId: string;
		date: Date;
		startTime: Date;
		endTime: Date;
	};
	cinema: {
		cinemaId: string;
		name: string;
		city: string;
	};
	seats: string[];
	totalAmount: number;
	status: string;
	createdAt: Date;
};
