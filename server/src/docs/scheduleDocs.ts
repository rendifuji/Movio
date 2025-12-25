/**
 * @swagger
 * /api/schedule/admin:
 *   post:
 *     summary: Create a new schedule
 *     description: Create a new movie schedule. Requires admin authentication. EndTime is automatically calculated based on movie duration + 15 minutes.
 *     tags: [Schedules (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateScheduleRequest'
 *           example:
 *             movieId: "550e8400-e29b-41d4-a716-446655440000"
 *             cinemaId: "550e8400-e29b-41d4-a716-446655440001"
 *             studioId: "550e8400-e29b-41d4-a716-446655440002"
 *             date: "2025-12-25"
 *             startTime: "14:30"
 *             price: 50000
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 201
 *               success: true
 *               message: "Schedule has been created successfully"
 *               data:
 *                 scheduleId: "f0080183-b227-48cc-a3d9-50be3f104912"
 *                 movieId: "550e8400-e29b-41d4-a716-446655440000"
 *                 studioId: "550e8400-e29b-41d4-a716-446655440002"
 *                 date: "2025-12-25T00:00:00.000Z"
 *                 startTime: "2025-12-25T14:30:00.000Z"
 *                 endTime: "2025-12-25T17:45:00.000Z"
 *                 price: "50000"
 *                 createdAt: "2025-12-25T10:00:00.000Z"
 *                 updatedAt: "2025-12-25T10:00:00.000Z"
 *                 movie: "Avatar: Fire and Ash"
 *                 studio: "Studio 1"
 *                 cinema: "CGV Grand Indonesia"
 *       400:
 *         description: Validation error or invalid references
 *         content:
 *           application/json:
 *             examples:
 *               validationError:
 *                 summary: Validation error
 *                 value:
 *                   status: 400
 *                   success: false
 *                   message: "Validation failed"
 *                   error:
 *                     issues:
 *                       - path: ["movieId"]
 *                         message: "Movie ID is required"
 *               movieNotFound:
 *                 summary: Movie not found
 *                 value:
 *                   status: 400
 *                   success: false
 *                   message: "Movie not found"
 *                   error: null
 *               cinemaNotFound:
 *                 summary: Cinema not found
 *                 value:
 *                   status: 400
 *                   success: false
 *                   message: "Cinema not found"
 *                   error: null
 *               studioNotFound:
 *                 summary: Studio not found
 *                 value:
 *                   status: 400
 *                   success: false
 *                   message: "Studio not found"
 *                   error: null
 *               studioNotBelongToCinema:
 *                 summary: Studio does not belong to cinema
 *                 value:
 *                   status: 400
 *                   success: false
 *                   message: "Studio does not belong to the specified cinema"
 *                   error: null
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               status: 401
 *               success: false
 *               message: "Access token is missing or invalid"
 *               error: null
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             example:
 *               status: 403
 *               success: false
 *               message: "Admin access required"
 *               error: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               success: false
 *               message: "Internal server error"
 *               error: {}
 *
 *   get:
 *     summary: Get all schedules (Admin)
 *     description: Retrieve all schedules with pagination and filtering. Admin access required.
 *     tags: [Schedules (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by movie title (partial match, case insensitive)
 *       - in: query
 *         name: studioName
 *         schema:
 *           type: string
 *         description: Filter by studio name (partial match, case insensitive)
 *       - in: query
 *         name: cinemaName
 *         schema:
 *           type: string
 *         description: Filter by cinema name (partial match, case insensitive)
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (YYYY-MM-DD format)
 *       - in: query
 *         name: time
 *         schema:
 *           type: string
 *         description: Filter by start time (HH:mm format, returns schedules starting within 1 hour)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date-asc, date-desc, starttime-asc, starttime-desc, latest, oldest]
 *           default: date-asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Schedules retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "All schedules retrieved successfully"
 *               data:
 *                 data:
 *                   - scheduleId: "f0080183-b227-48cc-a3d9-50be3f104912"
 *                     movieId: "550e8400-e29b-41d4-a716-446655440000"
 *                     studioId: "550e8400-e29b-41d4-a716-446655440002"
 *                     date: "2025-12-25T00:00:00.000Z"
 *                     startTime: "2025-12-25T14:30:00.000Z"
 *                     endTime: "2025-12-25T17:45:00.000Z"
 *                     price: "50000"
 *                     createdAt: "2025-12-25T10:00:00.000Z"
 *                     updatedAt: "2025-12-25T10:00:00.000Z"
 *                     movie: "Avatar: Fire and Ash"
 *                     studio: "Studio 1"
 *                     cinema: "CGV Grand Indonesia"
 *                   - scheduleId: "a1234567-b227-48cc-a3d9-50be3f104913"
 *                     movieId: "550e8400-e29b-41d4-a716-446655440001"
 *                     studioId: "550e8400-e29b-41d4-a716-446655440003"
 *                     date: "2025-12-25T00:00:00.000Z"
 *                     startTime: "2025-12-25T19:00:00.000Z"
 *                     endTime: "2025-12-25T21:05:00.000Z"
 *                     price: "45000"
 *                     createdAt: "2025-12-25T10:00:00.000Z"
 *                     updatedAt: "2025-12-25T10:00:00.000Z"
 *                     movie: "Sonic the Hedgehog 3"
 *                     studio: "Studio 2"
 *                     cinema: "CGV Grand Indonesia"
 *                 metadata:
 *                   page: 1
 *                   limit: 10
 *                   totalItems: 25
 *                   totalPages: 3
 *                   hasNextPage: true
 *                   hasPrevPage: false
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: 401
 *               success: false
 *               message: "Access token is missing or invalid"
 *               error: null
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               status: 403
 *               success: false
 *               message: "Admin access required"
 *               error: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               success: false
 *               message: "Internal server error"
 *               error: {}
 *
 * @swagger
 * /api/schedule/admin/{scheduleId}:
 *   put:
 *     summary: Update a schedule
 *     description: Update an existing schedule by ID. Requires admin authentication. EndTime is recalculated if startTime or movieId is updated.
 *     tags: [Schedules (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Schedule ID
 *         example: "f0080183-b227-48cc-a3d9-50be3f104912"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateScheduleRequest'
 *           example:
 *             startTime: "16:00"
 *             price: 55000
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Schedule has been updated successfully"
 *               data:
 *                 scheduleId: "f0080183-b227-48cc-a3d9-50be3f104912"
 *                 movieId: "550e8400-e29b-41d4-a716-446655440000"
 *                 studioId: "550e8400-e29b-41d4-a716-446655440002"
 *                 date: "2025-12-25T00:00:00.000Z"
 *                 startTime: "2025-12-25T16:00:00.000Z"
 *                 endTime: "2025-12-25T19:15:00.000Z"
 *                 price: "55000"
 *                 createdAt: "2025-12-25T10:00:00.000Z"
 *                 updatedAt: "2025-12-25T12:00:00.000Z"
 *                 movie: "Avatar: Fire and Ash"
 *                 studio: "Studio 1"
 *                 cinema: "CGV Grand Indonesia"
 *       400:
 *         description: Validation error or invalid references
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               success: false
 *               message: "Studio does not belong to the specified cinema"
 *               error: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: 401
 *               success: false
 *               message: "Access token is missing or invalid"
 *               error: null
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               status: 403
 *               success: false
 *               message: "Admin access required"
 *               error: null
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               success: false
 *               message: "Schedule not found"
 *               error: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               success: false
 *               message: "Internal server error"
 *               error: {}
 *
 *   delete:
 *     summary: Delete a schedule
 *     description: Delete a schedule by ID. Requires admin authentication.
 *     tags: [Schedules (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Schedule ID
 *         example: "f0080183-b227-48cc-a3d9-50be3f104912"
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Schedule has been deleted successfully"
 *               data:
 *                 scheduleId: "f0080183-b227-48cc-a3d9-50be3f104912"
 *                 movieId: "550e8400-e29b-41d4-a716-446655440000"
 *                 studioId: "550e8400-e29b-41d4-a716-446655440002"
 *                 date: "2025-12-25T00:00:00.000Z"
 *                 startTime: "2025-12-25T14:30:00.000Z"
 *                 endTime: "2025-12-25T17:45:00.000Z"
 *                 price: "50000"
 *                 createdAt: "2025-12-25T10:00:00.000Z"
 *                 updatedAt: "2025-12-25T10:00:00.000Z"
 *                 movie: "Avatar: Fire and Ash"
 *                 studio: "Studio 1"
 *                 cinema: "CGV Grand Indonesia"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: 401
 *               success: false
 *               message: "Access token is missing or invalid"
 *               error: null
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               status: 403
 *               success: false
 *               message: "Admin access required"
 *               error: null
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               success: false
 *               message: "Schedule not found"
 *               error: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               success: false
 *               message: "Internal server error"
 *               error: {}
 *
 * @swagger
 * /api/schedule/user:
 *   get:
 *     summary: Get all schedules (User)
 *     description: Retrieve all schedules with pagination and filtering. Requires user authentication.
 *     tags: [Schedules (User)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by movie title (partial match, case insensitive)
 *       - in: query
 *         name: studioName
 *         schema:
 *           type: string
 *         description: Filter by studio name (partial match, case insensitive)
 *       - in: query
 *         name: cinemaName
 *         schema:
 *           type: string
 *         description: Filter by cinema name (partial match, case insensitive)
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (YYYY-MM-DD format)
 *       - in: query
 *         name: time
 *         schema:
 *           type: string
 *         description: Filter by start time (HH:mm format, returns schedules starting within 1 hour)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date-asc, date-desc, starttime-asc, starttime-desc, latest, oldest]
 *           default: date-asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Schedules retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "All schedules retrieved successfully"
 *               data:
 *                 data:
 *                   - scheduleId: "f0080183-b227-48cc-a3d9-50be3f104912"
 *                     movieId: "550e8400-e29b-41d4-a716-446655440000"
 *                     studioId: "550e8400-e29b-41d4-a716-446655440002"
 *                     date: "2025-12-25T00:00:00.000Z"
 *                     startTime: "2025-12-25T14:30:00.000Z"
 *                     endTime: "2025-12-25T17:45:00.000Z"
 *                     price: "50000"
 *                     createdAt: "2025-12-25T10:00:00.000Z"
 *                     updatedAt: "2025-12-25T10:00:00.000Z"
 *                     movie: "Avatar: Fire and Ash"
 *                     studio: "Studio 1"
 *                     cinema: "CGV Grand Indonesia"
 *                 metadata:
 *                   page: 1
 *                   limit: 10
 *                   totalItems: 25
 *                   totalPages: 3
 *                   hasNextPage: true
 *                   hasPrevPage: false
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: 401
 *               success: false
 *               message: "Access token is missing or invalid"
 *               error: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               success: false
 *               message: "Internal server error"
 *               error: {}
 *
 * @swagger
 * /api/schedule/user/{scheduleId}:
 *   get:
 *     summary: Get schedule by ID
 *     description: Retrieve a specific schedule by its ID. Requires user authentication.
 *     tags: [Schedules (User)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Schedule ID
 *         example: "f0080183-b227-48cc-a3d9-50be3f104912"
 *     responses:
 *       200:
 *         description: Schedule retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Schedule retrieved successfully"
 *               data:
 *                 scheduleId: "f0080183-b227-48cc-a3d9-50be3f104912"
 *                 movieId: "550e8400-e29b-41d4-a716-446655440000"
 *                 studioId: "550e8400-e29b-41d4-a716-446655440002"
 *                 date: "2025-12-25T00:00:00.000Z"
 *                 startTime: "2025-12-25T14:30:00.000Z"
 *                 endTime: "2025-12-25T17:45:00.000Z"
 *                 price: "50000"
 *                 createdAt: "2025-12-25T10:00:00.000Z"
 *                 updatedAt: "2025-12-25T10:00:00.000Z"
 *                 movie:
 *                   movieId: "550e8400-e29b-41d4-a716-446655440000"
 *                   title: "Avatar: Fire and Ash"
 *                   description: "The next chapter in the Avatar saga..."
 *                   releaseDate: "2025-12-19T00:00:00.000Z"
 *                   durationMinutes: 198
 *                   genre: "SCI_FI"
 *                   posterUrl: "https://image.tmdb.org/t/p/w500/avatar3.jpg"
 *                   rating: "8.7"
 *                   status: "NOW_SHOWING"
 *                 studio:
 *                   studioId: "550e8400-e29b-41d4-a716-446655440002"
 *                   name: "Studio 1"
 *                   capacity: 150
 *                   cinema:
 *                     cinemaId: "550e8400-e29b-41d4-a716-446655440001"
 *                     name: "CGV Grand Indonesia"
 *                     city: "Jakarta"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               status: 401
 *               success: false
 *               message: "Access token is missing or invalid"
 *               error: null
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               success: false
 *               message: "Schedule not found"
 *               error: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               success: false
 *               message: "Internal server error"
 *               error: {}
 */

export {};
