/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password. Returns access token and sets refresh token in HTTP-only cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             admin:
 *               summary: Admin login
 *               value:
 *                 email: "admin@gmail.com"
 *                 password: "password123"
 *             user:
 *               summary: User login
 *               value:
 *                 email: "rendi@gmail.com"
 *                 password: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Login successful"
 *               data:
 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsIm5hbWUiOiJBZG1pbiBVc2VyIiwiZW1haWwiOiJhZG1pbkBtb3Zpby5jb20iLCJyb2xlIjoiQURNSU4ifQ.abc123"
 *                 user:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "Admin User"
 *                   email: "admin@movio.com"
 *                   role: "ADMIN"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             example: "refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict"
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               success: false
 *               message: "Validation failed"
 *               error:
 *                 issues:
 *                   - path: ["email"]
 *                     message: "Invalid email format"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             examples:
 *               incorrectPassword:
 *                 summary: Incorrect password
 *                 value:
 *                   status: 401
 *                   success: false
 *                   message: "Incorrect password"
 *                   error: null
 *               emailNotFound:
 *                 summary: Email not found
 *                 value:
 *                   status: 401
 *                   success: false
 *                   message: "Email not found"
 *                   error: null
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
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Get a new access token using the refresh token stored in HTTP-only cookie
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Token refreshed successfully"
 *               data:
 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.newtoken123"
 *       401:
 *         description: Refresh token not found or invalid
 *         content:
 *           application/json:
 *             examples:
 *               tokenNotFound:
 *                 summary: Refresh token not found
 *                 value:
 *                   status: 401
 *                   success: false
 *                   message: "Refresh token not found"
 *                   error: null
 *               tokenInvalid:
 *                 summary: Refresh token invalid or expired
 *                 value:
 *                   status: 401
 *                   success: false
 *                   message: "Refresh token is invalid or expired"
 *                   error: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               success: false
 *               message: "Error occurred while refreshing token"
 *               error: {}
 *
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout user and clear refresh token cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Logout successful"
 *               data: null
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
 * /api/auth/google:
 *   get:
 *     summary: Google OAuth login
 *     description: Redirect to Google OAuth consent page for authentication
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth page
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               success: false
 *               message: "Failed to generate Google OAuth URL"
 *               error: {}
 *
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Callback endpoint for Google OAuth. Receives authorization code and exchanges it for tokens.
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *         example: "4/0AfJohXnR5xK..."
 *     responses:
 *       200:
 *         description: Google login successful
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Google login successful"
 *               data:
 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "John Doe"
 *                   email: "john.doe@gmail.com"
 *                   role: "USER"
 *       400:
 *         description: Authorization code is required
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               success: false
 *               message: "Authorization code is required"
 *               error: null
 *       401:
 *         description: Google authentication failed
 *         content:
 *           application/json:
 *             example:
 *               status: 401
 *               success: false
 *               message: "Google authentication failed"
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
