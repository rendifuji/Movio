/**
 * @swagger
 * /api/transaction/user/checkout:
 *   post:
 *     summary: Checkout and create ticket transaction
 *     description: Create a new transaction with tickets for the selected seats. Requires user authentication.
 *     tags: [Transaction (User)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutRequest'
 *           example:
 *             scheduleId: "550e8400-e29b-41d4-a716-446655440000"
 *             seatLabels: ["D10", "D11", "D12"]
 *     responses:
 *       201:
 *         description: Checkout successful
 *         content:
 *           application/json:
 *             example:
 *               status: 201
 *               success: true
 *               message: "Checkout successful"
 *               data:
 *                 transactionId: "f1e2d3c4-b5a6-7890-1234-567890abcdef"
 *                 userId: "user123-456-789"
 *                 totalAmount: 120000
 *                 status: "PAID"
 *                 createdAt: "2025-12-27T10:30:00.000Z"
 *                 tickets:
 *                   - ticketId: "ticket1-234-567"
 *                     scheduleId: "550e8400-e29b-41d4-a716-446655440000"
 *                     seatLabel: "D10"
 *                     qrCode: "a1b2c3d4e5f67890123456789abcdef1234567890abcdef"
 *                     status: "VALID"
 *                   - ticketId: "ticket2-234-568"
 *                     scheduleId: "550e8400-e29b-41d4-a716-446655440000"
 *                     seatLabel: "D11"
 *                     qrCode: "b2c3d4e5f67890123456789abcdef1234567890abcdef12"
 *                     status: "VALID"
 *                   - ticketId: "ticket3-234-569"
 *                     scheduleId: "550e8400-e29b-41d4-a716-446655440000"
 *                     seatLabel: "D12"
 *                     qrCode: "c3d4e5f67890123456789abcdef1234567890abcdef1234"
 *                     status: "VALID"
 *       400:
 *         description: Validation error or seats already booked
 *         content:
 *           application/json:
 *             examples:
 *               seatsBooked:
 *                 summary: Seats already booked
 *                 value:
 *                   status: 400
 *                   success: false
 *                   code: "BAD_REQUEST"
 *                   message: "Seats already booked: D11, D12"
 *               validationError:
 *                 summary: Validation failed
 *                 value:
 *                   status: 400
 *                   success: false
 *                   code: "BAD_REQUEST"
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "scheduleId"
 *                       message: "Schedule ID must be a valid UUID"
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               status: 401
 *               success: false
 *               code: "UNAUTHORIZED"
 *               message: "Unauthorized"
 *       404:
 *         description: Schedule or user not found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               success: false
 *               code: "NOT_FOUND"
 *               message: "Schedule not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               success: false
 *               code: "INTERNAL_SERVER_ERROR"
 *               message: "Internal server error"
 *
 * @swagger
 * /api/transaction/user/ticket:
 *   get:
 *     summary: Get my tickets
 *     description: Get all tickets for the authenticated user grouped by transaction. If user ordered 3 seats, it shows as 1 item with 3 seats.
 *     tags: [Transaction (User)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Tickets retrieved successfully"
 *               data:
 *                 - ticketId: "550e8400-e29b-41d4-a716-446655440001"
 *                   movieTitle: "Zootopia 2"
 *                   posterUrl: "https://image.tmdb.org/t/p/w500/zootopia2.jpg"
 *                   date: "2025-12-07T00:00:00.000Z"
 *                   startTime: "2025-12-07T09:00:00.000Z"
 *                   endTime: "2025-12-07T11:30:00.000Z"
 *                   cinemaName: "Movio Central Park"
 *                   cinemaCity: "Jakarta"
 *                   seatCount: 3
 *                   seats: ["D10", "D11", "D12"]
 *                 - ticketId: "550e8400-e29b-41d4-a716-446655440002"
 *                   movieTitle: "Avengers End Game"
 *                   posterUrl: "https://image.tmdb.org/t/p/w500/avengers.jpg"
 *                   date: "2025-12-08T00:00:00.000Z"
 *                   startTime: "2025-12-08T09:00:00.000Z"
 *                   endTime: "2025-12-08T11:30:00.000Z"
 *                   cinemaName: "Movio Central Park"
 *                   cinemaCity: "Jakarta"
 *                   seatCount: 3
 *                   seats: ["D10", "D11", "D12"]
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               status: 401
 *               success: false
 *               code: "UNAUTHORIZED"
 *               message: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               success: false
 *               code: "INTERNAL_SERVER_ERROR"
 *               message: "Internal server error"
 *
 * @swagger
 * /api/transaction/user/ticket/{ticketId}:
 *   get:
 *     summary: Get ticket by ID with QR code
 *     description: Get detailed ticket information including movie details, schedule, seats, and QR code for the ticket.
 *     tags: [Transaction (User)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ticket ID
 *         example: "6ec67d12-a234-4fe1-a4d4-0bab27cf7c28"
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Ticket retrieved successfully"
 *               data:
 *                 movieTitle: "Zootopia 2"
 *                 durationMinutes: 150
 *                 genre: "FANTASY"
 *                 rating: "PG-13"
 *                 date: "2025-12-07T00:00:00.000Z"
 *                 startTime: "2025-12-07T09:00:00.000Z"
 *                 endTime: "2025-12-07T11:30:00.000Z"
 *                 cinemaName: "Movio Central Park"
 *                 cinemaCity: "Jakarta"
 *                 studioName: "Studio 1"
 *                 seatCount: 3
 *                 seats: ["D10", "D11", "D12"]
 *                 qrCode: "a1b2c3d4e5f67890123456789abcdef1234567890abcdef1234567890abcdef"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               success: false
 *               code: "BAD_REQUEST"
 *               message: "Validation failed"
 *               errors:
 *                 - field: "ticketId"
 *                   message: "Ticket ID must be a valid UUID"
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               status: 401
 *               success: false
 *               code: "UNAUTHORIZED"
 *               message: "Unauthorized"
 *       404:
 *         description: Ticket not found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               success: false
 *               code: "NOT_FOUND"
 *               message: "Ticket not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               success: false
 *               code: "INTERNAL_SERVER_ERROR"
 *               message: "Internal server error"
 *
 * @swagger
 * /api/transaction/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard data
 *     description: Get dashboard statistics including total revenue, tickets sold, now showing movies count, and recent transactions. Admin access required.
 *     tags: [Transaction (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Dashboard data retrieved successfully"
 *               data:
 *                 totalRevenue: 5000000
 *                 totalTicketsSold: 125
 *                 nowShowingMovies: 8
 *                 recentTransactions:
 *                   - transactionId: "f1e2d3c4-b5a6-7890-1234-567890abcdef"
 *                     movieTitle: "Zootopia 2"
 *                     userName: "John Doe"
 *                     date: "2025-12-26T10:30:00.000Z"
 *                     status: "PAID"
 *                   - transactionId: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
 *                     movieTitle: "Avengers End Game"
 *                     userName: "Jane Smith"
 *                     date: "2025-12-26T09:15:00.000Z"
 *                     status: "PAID"
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               status: 401
 *               success: false
 *               code: "UNAUTHORIZED"
 *               message: "Unauthorized"
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             example:
 *               status: 403
 *               success: false
 *               code: "FORBIDDEN"
 *               message: "Admin access required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               success: false
 *               code: "INTERNAL_SERVER_ERROR"
 *               message: "Internal server error"
 */
