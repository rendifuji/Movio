import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Movio API Documentation",
			version: "1.0.0",
			description:
				"Complete API documentation for Movio - Movie Ticketing System",
			contact: {
				name: "Movio Team",
			},
		},
		servers: [
			{
				url: "http://localhost:8000",
				description: "Development Server",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description: "Enter JWT token",
				},
				cookieAuth: {
					type: "apiKey",
					in: "cookie",
					name: "refreshToken",
					description: "Refresh token stored in HTTP-only cookie",
				},
			},
			schemas: {
				// Auth Schemas
				LoginRequest: {
					type: "object",
					required: ["email", "password"],
					properties: {
						email: {
							type: "string",
							format: "email",
							example: "user@example.com",
						},
						password: {
							type: "string",
							example: "password123",
						},
					},
				},
				LoginResponse: {
					type: "object",
					properties: {
						accessToken: {
							type: "string",
							example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
						},
						user: {
							type: "object",
							properties: {
								id: { type: "string", format: "uuid" },
								name: { type: "string", example: "Admin User" },
								email: {
									type: "string",
									format: "email",
									example: "admin@gmail.com",
								},
								role: { type: "string", enum: ["ADMIN", "USER"] },
								picture: {
									type: "string",
									format: "uri",
									example: "https://lh3.googleusercontent.com/a/ACg8oc...s96-c",
									description: "URL to user's profile picture (if available).",
								},
							},
						},
					},
				},
				RefreshResponse: {
					type: "object",
					properties: {
						accessToken: {
							type: "string",
							example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
						},
					},
				},

				// Media Schemas
				PresignedUrlRequest: {
					type: "object",
					required: ["mimetype", "size"],
					properties: {
						mimetype: {
							type: "string",
							description:
								"MIME type of the file (image/png, image/jpeg, image/jpg, image/webp)",
							example: "image/jpeg",
						},
						size: {
							type: "integer",
							description: "File size in bytes (max 5MB)",
							example: 1024000,
						},
					},
				},
				PresignedUrlResponse: {
					type: "object",
					properties: {
						url: {
							type: "string",
							format: "uri",
							description:
								"Presigned URL for uploading file to Azure Blob Storage",
							example:
								"https://moviostorage.blob.core.windows.net/movies/abc123.jpg?sv=...",
						},
						fileKey: {
							type: "string",
							description:
								"File key (blob name) to reference the uploaded file",
							example: "abc123def456.jpg",
						},
					},
				},

				// Transaction Schemas
				CheckoutRequest: {
					type: "object",
					required: ["scheduleId", "seatLabels"],
					properties: {
						scheduleId: {
							type: "string",
							format: "uuid",
							description: "The schedule ID for the movie showing",
							example: "550e8400-e29b-41d4-a716-446655440000",
						},
						seatLabels: {
							type: "array",
							items: {
								type: "string",
							},
							description: "Array of seat labels to book",
							example: ["D10", "D11", "D12"],
						},
					},
				},
				TransactionStatus: {
					type: "string",
					enum: ["PENDING", "PAID", "CANCELLED", "REFUNDED"],
				},
				TicketStatus: {
					type: "string",
					enum: ["VALID", "USED", "CANCELLED", "EXPIRED"],
				},
				Ticket: {
					type: "object",
					properties: {
						ticketId: {
							type: "string",
							format: "uuid",
						},
						scheduleId: {
							type: "string",
							format: "uuid",
						},
						seatLabel: {
							type: "string",
							example: "D10",
						},
						qrCode: {
							type: "string",
							description: "Random generated QR code string",
						},
						status: {
							$ref: "#/components/schemas/TicketStatus",
						},
					},
				},
				MyTicketResponse: {
					type: "object",
					properties: {
						ticketId: {
							type: "string",
							format: "uuid",
						},
						movieTitle: {
							type: "string",
							example: "Zootopia 2",
						},
						posterUrl: {
							type: "string",
							format: "uri",
						},
						date: {
							type: "string",
							format: "date-time",
						},
						startTime: {
							type: "string",
							format: "date-time",
						},
						endTime: {
							type: "string",
							format: "date-time",
						},
						cinemaName: {
							type: "string",
							example: "Movio Central Park",
						},
						cinemaCity: {
							type: "string",
							example: "Jakarta",
						},
						seatCount: {
							type: "integer",
							example: 3,
						},
						seats: {
							type: "array",
							items: {
								type: "string",
							},
							example: ["D10", "D11", "D12"],
						},
					},
				},
				TicketDetailResponse: {
					type: "object",
					properties: {
						movieTitle: {
							type: "string",
							example: "Zootopia 2",
						},
						durationMinutes: {
							type: "integer",
							example: 150,
						},
						genre: {
							type: "string",
							example: "FANTASY",
						},
						rating: {
							type: "string",
							example: "PG-13",
						},
						date: {
							type: "string",
							format: "date-time",
						},
						startTime: {
							type: "string",
							format: "date-time",
						},
						endTime: {
							type: "string",
							format: "date-time",
						},
						cinemaName: {
							type: "string",
							example: "Movio Central Park",
						},
						cinemaCity: {
							type: "string",
							example: "Jakarta",
						},
						studioName: {
							type: "string",
							example: "Studio 1",
						},
						seatCount: {
							type: "integer",
							example: 3,
						},
						seats: {
							type: "array",
							items: {
								type: "string",
							},
							example: ["D10", "D11", "D12"],
						},
						qrCode: {
							type: "string",
							description: "QR code string for ticket validation",
						},
					},
				},
				AdminDashboardResponse: {
					type: "object",
					properties: {
						totalRevenue: {
							type: "number",
							example: 5000000,
						},
						totalTicketsSold: {
							type: "integer",
							example: 125,
						},
						nowShowingMovies: {
							type: "integer",
							example: 8,
						},
						recentTransactions: {
							type: "array",
							items: {
								type: "object",
								properties: {
									transactionId: {
										type: "string",
										format: "uuid",
									},
									movieTitle: {
										type: "string",
									},
									userName: {
										type: "string",
									},
									date: {
										type: "string",
										format: "date-time",
									},
									status: {
										$ref: "#/components/schemas/TransactionStatus",
									},
								},
							},
						},
					},
				},

				// Movie Schemas
				MovieGenre: {
					type: "string",
					enum: [
						"ACTION",
						"COMEDY",
						"DRAMA",
						"HORROR",
						"ROMANCE",
						"SCI_FI",
						"THRILLER",
						"ANIMATION",
						"FANTASY",
						"DOCUMENTARY",
					],
				},
				MovieStatus: {
					type: "string",
					enum: ["NOW_SHOWING", "COMING_SOON"],
				},
				CreateMovieRequest: {
					type: "object",
					required: [
						"title",
						"description",
						"releaseDate",
						"durationMinutes",
						"genre",
						"posterUrl",
						"rating",
						"status",
					],
					properties: {
						title: {
							type: "string",
							example: "Avatar: The Way of Water",
						},
						description: {
							type: "string",
							example:
								"Jake Sully lives with his newfound family on Pandora...",
						},
						releaseDate: {
							type: "string",
							format: "date",
							example: "2024-12-25",
						},
						durationMinutes: {
							type: "integer",
							example: 192,
						},
						genre: {
							$ref: "#/components/schemas/MovieGenre",
						},
						posterUrl: {
							type: "string",
							format: "uri",
							example: "https://image.tmdb.org/t/p/w500/poster.jpg",
						},
						rating: {
							type: "string",
							example: "8.5",
						},
						status: {
							$ref: "#/components/schemas/MovieStatus",
						},
					},
				},
				UpdateMovieRequest: {
					type: "object",
					properties: {
						title: {
							type: "string",
							example: "Avatar: The Way of Water",
						},
						description: {
							type: "string",
							example:
								"Jake Sully lives with his newfound family on Pandora...",
						},
						releaseDate: {
							type: "string",
							format: "date",
							example: "2024-12-25",
						},
						durationMinutes: {
							type: "integer",
							example: 192,
						},
						genre: {
							$ref: "#/components/schemas/MovieGenre",
						},
						posterUrl: {
							type: "string",
							format: "uri",
							example: "https://image.tmdb.org/t/p/w500/poster.jpg",
						},
						rating: {
							type: "string",
							example: "8.5",
						},
						status: {
							$ref: "#/components/schemas/MovieStatus",
						},
					},
				},
				Movie: {
					type: "object",
					properties: {
						movieId: {
							type: "string",
							format: "uuid",
							example: "550e8400-e29b-41d4-a716-446655440000",
						},
						title: {
							type: "string",
							example: "Avatar: The Way of Water",
						},
						description: {
							type: "string",
							example:
								"Jake Sully lives with his newfound family on Pandora...",
						},
						releaseDate: {
							type: "string",
							format: "date-time",
							example: "2024-12-25T00:00:00.000Z",
						},
						durationMinutes: {
							type: "integer",
							example: 192,
						},
						genre: {
							$ref: "#/components/schemas/MovieGenre",
						},
						posterUrl: {
							type: "string",
							format: "uri",
							example: "https://image.tmdb.org/t/p/w500/poster.jpg",
						},
						rating: {
							type: "string",
							example: "8.5",
						},
						status: {
							$ref: "#/components/schemas/MovieStatus",
						},
						createdAt: {
							type: "string",
							format: "date-time",
							example: "2024-12-24T10:00:00.000Z",
						},
						updatedAt: {
							type: "string",
							format: "date-time",
							example: "2024-12-24T10:00:00.000Z",
						},
					},
				},

				// Schedule Schemas
				CreateScheduleRequest: {
					type: "object",
					required: [
						"movieId",
						"cinemaId",
						"studioId",
						"date",
						"startTime",
						"price",
					],
					properties: {
						movieId: {
							type: "string",
							format: "uuid",
							example: "550e8400-e29b-41d4-a716-446655440000",
						},
						cinemaId: {
							type: "string",
							format: "uuid",
							example: "550e8400-e29b-41d4-a716-446655440001",
						},
						studioId: {
							type: "string",
							format: "uuid",
							example: "550e8400-e29b-41d4-a716-446655440002",
						},
						date: {
							type: "string",
							format: "date",
							example: "2024-12-25",
						},
						startTime: {
							type: "string",
							example: "14:30",
							description: "Time in HH:mm format",
						},
						price: {
							type: "number",
							example: 50000,
						},
					},
				},
				UpdateScheduleRequest: {
					type: "object",
					properties: {
						movieId: {
							type: "string",
							format: "uuid",
							example: "550e8400-e29b-41d4-a716-446655440000",
						},
						cinemaId: {
							type: "string",
							format: "uuid",
							example: "550e8400-e29b-41d4-a716-446655440001",
						},
						studioId: {
							type: "string",
							format: "uuid",
							example: "550e8400-e29b-41d4-a716-446655440002",
						},
						date: {
							type: "string",
							format: "date",
							example: "2024-12-25",
						},
						startTime: {
							type: "string",
							example: "14:30",
							description: "Time in HH:mm format",
						},
						price: {
							type: "number",
							example: 50000,
						},
					},
				},
				Schedule: {
					type: "object",
					properties: {
						scheduleId: {
							type: "string",
							format: "uuid",
							example: "550e8400-e29b-41d4-a716-446655440000",
						},
						movieId: {
							type: "string",
							format: "uuid",
							example: "550e8400-e29b-41d4-a716-446655440000",
						},
						studioId: {
							type: "string",
							format: "uuid",
							example: "550e8400-e29b-41d4-a716-446655440002",
						},
						date: {
							type: "string",
							format: "date-time",
							example: "2024-12-25T00:00:00.000Z",
						},
						startTime: {
							type: "string",
							format: "date-time",
							example: "2024-12-25T14:30:00.000Z",
						},
						endTime: {
							type: "string",
							format: "date-time",
							example: "2024-12-25T17:45:00.000Z",
						},
						price: {
							type: "string",
							example: "50000",
						},
						createdAt: {
							type: "string",
							format: "date-time",
							example: "2024-12-24T10:00:00.000Z",
						},
						updatedAt: {
							type: "string",
							format: "date-time",
							example: "2024-12-24T10:00:00.000Z",
						},
						movie: {
							type: "string",
							example: "Avatar: The Way of Water",
						},
						studio: {
							type: "string",
							example: "Studio 1",
						},
						cinema: {
							type: "string",
							example: "CGV Grand Indonesia",
						},
					},
				},

				// Common Schemas
				Pagination: {
					type: "object",
					properties: {
						page: { type: "integer", example: 1 },
						limit: { type: "integer", example: 10 },
						totalItems: { type: "integer", example: 100 },
						totalPages: { type: "integer", example: 10 },
						hasNextPage: { type: "boolean", example: true },
						hasPrevPage: { type: "boolean", example: false },
					},
				},
				SuccessResponse: {
					type: "object",
					properties: {
						status: { type: "integer", example: 200 },
						success: { type: "boolean", example: true },
						message: { type: "string", example: "Operation successful" },
						data: { type: "object" },
					},
				},
				ErrorResponse: {
					type: "object",
					properties: {
						status: { type: "integer", example: 400 },
						success: { type: "boolean", example: false },
						message: { type: "string", example: "Error message" },
						error: { type: "object" },
					},
					example: {
						status: 400,
						success: false,
						message: "Validation failed",
						error: {},
					},
				},
			},
		},
		tags: [
			{
				name: "Auth",
				description: "Authentication endpoints",
			},
			{
				name: "Movies (Admin)",
				description: "Movie management endpoints for Admin",
			},
			{
				name: "Movies (User)",
				description: "Movie endpoints for Users",
			},
			{
				name: "Schedules (Admin)",
				description: "Schedule management endpoints for Admin",
			},
			{
				name: "Schedules (User)",
				description: "Schedule endpoints for Users",
			},
			{
				name: "Transaction (Admin)",
				description: "Transaction and ticket management endpoints for Admin",
			},
			{
				name: "Transaction (User)",
				description: "Transaction and ticket endpoints for Users",
			},
			{
				name: "Media",
				description:
					"Media upload and management endpoints (Azure Blob Storage)",
			},
		],
	},
	apis: ["./src/docs/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
	// Only enable Swagger in development
	if (process.env.NODE_ENV === "production") {
		return;
	}

	app.use(
		"/api-docs",
		swaggerUi.serve,
		swaggerUi.setup(swaggerSpec, {
			explorer: true,
			customSiteTitle: "Movio API Documentation",
			customCss: ".swagger-ui .topbar { display: none }",
		})
	);

	// Serve swagger.json
	app.get("/api-docs.json", (req, res) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});
}

export default swaggerSpec;
