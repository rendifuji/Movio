/**
 * @swagger
 * /api/movie/admin:
 *   post:
 *     summary: Create a new movie
 *     description: Create a new movie entry. Requires admin authentication.
 *     tags: [Movies (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMovieRequest'
 *           example:
 *             title: "Avatar: Fire and Ash"
 *             description: "The next chapter in the Avatar saga..."
 *             releaseDate: "2025-12-19"
 *             durationMinutes: 198
 *             genre: "SCI_FI"
 *             posterUrl: "https://image.tmdb.org/t/p/w500/avatar3.jpg"
 *             rating: "8.7"
 *             status: "NOW_SHOWING"
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 201
 *               success: true
 *               message: "Movie has been created successfully"
 *               data:
 *                 movieId: "550e8400-e29b-41d4-a716-446655440000"
 *                 title: "Avatar: Fire and Ash"
 *                 description: "The next chapter in the Avatar saga..."
 *                 releaseDate: "2025-12-19T00:00:00.000Z"
 *                 durationMinutes: 198
 *                 genre: "SCI_FI"
 *                 posterUrl: "https://image.tmdb.org/t/p/w500/avatar3.jpg"
 *                 rating: "8.7"
 *                 status: "NOW_SHOWING"
 *                 createdAt: "2025-12-25T10:00:00.000Z"
 *                 updatedAt: "2025-12-25T10:00:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               success: false
 *               message: "Validation failed"
 *               error:
 *                 issues:
 *                   - path: ["title"]
 *                     message: "Title is required"
 *                   - path: ["durationMinutes"]
 *                     message: "Duration must be a positive number"
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
 *     summary: Get all movies (Admin)
 *     description: Retrieve all movies with pagination and filtering. Admin access required.
 *     tags: [Movies (Admin)]
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
 *         name: genre
 *         schema:
 *           $ref: '#/components/schemas/MovieGenre'
 *         description: Filter by movie genre
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/MovieStatus'
 *         description: Filter by movie status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title-asc, title-desc, releaseDate-asc, releaseDate-desc, rating-asc, rating-desc, latest, oldest]
 *           default: latest
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Movies retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "All movies retrieved successfully"
 *               data:
 *                 data:
 *                   - movieId: "550e8400-e29b-41d4-a716-446655440000"
 *                     title: "Avatar: Fire and Ash"
 *                     description: "The next chapter in the Avatar saga..."
 *                     releaseDate: "2025-12-19T00:00:00.000Z"
 *                     durationMinutes: 198
 *                     genre: "SCI_FI"
 *                     posterUrl: "https://image.tmdb.org/t/p/w500/avatar3.jpg"
 *                     rating: "8.7"
 *                     status: "NOW_SHOWING"
 *                     createdAt: "2025-12-25T10:00:00.000Z"
 *                     updatedAt: "2025-12-25T10:00:00.000Z"
 *                 metadata:
 *                   page: 1
 *                   limit: 10
 *                   totalItems: 50
 *                   totalPages: 5
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
 * /api/movie/admin/{movieId}:
 *   put:
 *     summary: Update a movie
 *     description: Update an existing movie by ID. Requires admin authentication.
 *     tags: [Movies (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Movie ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMovieRequest'
 *           example:
 *             title: "Avatar: Fire and Ash (Extended Edition)"
 *             rating: "8.9"
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Movie has been updated successfully"
 *               data:
 *                 movieId: "550e8400-e29b-41d4-a716-446655440000"
 *                 title: "Avatar: Fire and Ash (Extended Edition)"
 *                 description: "The next chapter in the Avatar saga..."
 *                 releaseDate: "2025-12-19T00:00:00.000Z"
 *                 durationMinutes: 198
 *                 genre: "SCI_FI"
 *                 posterUrl: "https://image.tmdb.org/t/p/w500/avatar3.jpg"
 *                 rating: "8.9"
 *                 status: "NOW_SHOWING"
 *                 createdAt: "2025-12-25T10:00:00.000Z"
 *                 updatedAt: "2025-12-25T12:00:00.000Z"
 *       400:
 *         description: Validation error or invalid movie ID
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               success: false
 *               message: "Invalid movie ID format"
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
 *         description: Movie not found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               success: false
 *               message: "Movie not found"
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
 *     summary: Delete a movie
 *     description: Delete a movie by ID. Requires admin authentication.
 *     tags: [Movies (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Movie ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Movie has been deleted successfully"
 *               data:
 *                 movieId: "550e8400-e29b-41d4-a716-446655440000"
 *                 title: "Avatar: Fire and Ash"
 *                 description: "The next chapter in the Avatar saga..."
 *                 releaseDate: "2025-12-19T00:00:00.000Z"
 *                 durationMinutes: 198
 *                 genre: "SCI_FI"
 *                 posterUrl: "https://image.tmdb.org/t/p/w500/avatar3.jpg"
 *                 rating: "8.7"
 *                 status: "NOW_SHOWING"
 *                 createdAt: "2025-12-25T10:00:00.000Z"
 *                 updatedAt: "2025-12-25T10:00:00.000Z"
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
 *         description: Movie not found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               success: false
 *               message: "Movie not found"
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
 * /api/movie/user:
 *   get:
 *     summary: Get all movies (User)
 *     description: Retrieve all movies with pagination and filtering. Requires user authentication.
 *     tags: [Movies (User)]
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
 *         name: genre
 *         schema:
 *           $ref: '#/components/schemas/MovieGenre'
 *         description: Filter by movie genre
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/MovieStatus'
 *         description: Filter by movie status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title-asc, title-desc, releaseDate-asc, releaseDate-desc, rating-asc, rating-desc, latest, oldest]
 *           default: latest
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Movies retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "All movies retrieved successfully"
 *               data:
 *                 data:
 *                   - movieId: "550e8400-e29b-41d4-a716-446655440000"
 *                     title: "Avatar: Fire and Ash"
 *                     description: "The next chapter in the Avatar saga..."
 *                     releaseDate: "2025-12-19T00:00:00.000Z"
 *                     durationMinutes: 198
 *                     genre: "SCI_FI"
 *                     posterUrl: "https://image.tmdb.org/t/p/w500/avatar3.jpg"
 *                     rating: "8.7"
 *                     status: "NOW_SHOWING"
 *                     createdAt: "2025-12-25T10:00:00.000Z"
 *                     updatedAt: "2025-12-25T10:00:00.000Z"
 *                   - movieId: "550e8400-e29b-41d4-a716-446655440001"
 *                     title: "Sonic the Hedgehog 3"
 *                     description: "Sonic, Knuckles, and Tails reunite..."
 *                     releaseDate: "2024-12-20T00:00:00.000Z"
 *                     durationMinutes: 110
 *                     genre: "ACTION"
 *                     posterUrl: "https://image.tmdb.org/t/p/w500/sonic3.jpg"
 *                     rating: "7.8"
 *                     status: "NOW_SHOWING"
 *                     createdAt: "2025-12-20T10:00:00.000Z"
 *                     updatedAt: "2025-12-20T10:00:00.000Z"
 *                 metadata:
 *                   page: 1
 *                   limit: 10
 *                   totalItems: 50
 *                   totalPages: 5
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
 * /api/movie/{movieId}:
 *   get:
 *     summary: Get a movie by ID (Public)
 *     description: Retrieve a single movie by ID. No authentication required.
 *     tags: [Movies (Public)]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Movie ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Movie retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Movie found"
 *               data:
 *                 movieId: "550e8400-e29b-41d4-a716-446655440000"
 *                 title: "A Time for Bravery"
 *                 description: "A psychoanalyst on community service aids an agent shattered by infidelity..."
 *                 releaseDate: "2025-12-19T00:00:00.000Z"
 *                 durationMinutes: 107
 *                 genre: "DRAMA"
 *                 posterUrl: "https://image.tmdb.org/t/p/w500/example.jpg"
 *                 rating: "PG-13"
 *                 status: "NOW_SHOWING"
 *                 createdAt: "2025-12-10T10:00:00.000Z"
 *                 updatedAt: "2025-12-10T10:00:00.000Z"
 *       404:
 *         description: Movie not found
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               success: false
 *               message: "Movie not found"
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
