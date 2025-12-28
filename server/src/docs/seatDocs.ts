/**
 * @swagger
 * /api/schedule/{scheduleId}/seats:
 *   get:
 *     summary: Get all seats for a schedule
 *     description: Retrieve all seats with their current status (available, locked, or booked). Merges booked seats from database with temporarily locked seats from Redis.
 *     tags: [Seats (Public)]
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Schedule ID
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Seats retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Seats retrieved successfully"
 *               data:
 *                 scheduleId: "550e8400-e29b-41d4-a716-446655440000"
 *                 totalSeats: 50
 *                 availableCount: 42
 *                 lockedCount: 3
 *                 bookedCount: 5
 *                 seats:
 *                   - seatLabel: "A1"
 *                     status: "available"
 *                   - seatLabel: "A2"
 *                     status: "locked"
 *                     lockedBy: "user-123"
 *                     lockedAt: 1703548800000
 *                   - seatLabel: "A3"
 *                     status: "booked"
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
 *
 * @swagger
 * /api/seats/lock:
 *   post:
 *     summary: Lock a seat
 *     description: Temporarily lock a seat for 10 minutes. The lock will be released automatically after timeout or when the user disconnects.
 *     tags: [Seats (User)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduleId
 *               - seatLabel
 *             properties:
 *               scheduleId:
 *                 type: string
 *                 format: uuid
 *               seatLabel:
 *                 type: string
 *           example:
 *             scheduleId: "550e8400-e29b-41d4-a716-446655440000"
 *             seatLabel: "A1"
 *     responses:
 *       200:
 *         description: Seat locked successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Seat locked successfully"
 *               data:
 *                 scheduleId: "550e8400-e29b-41d4-a716-446655440000"
 *                 seatLabel: "A1"
 *                 lockedBy: "user-123"
 *       400:
 *         description: Seat already locked or booked
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               success: false
 *               message: "Seat is locked by another user"
 *               error: null
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Internal server error
 *
 * @swagger
 * /api/seats/unlock:
 *   post:
 *     summary: Unlock a seat
 *     description: Release a locked seat. Only the user who locked the seat can unlock it.
 *     tags: [Seats (User)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduleId
 *               - seatLabel
 *             properties:
 *               scheduleId:
 *                 type: string
 *                 format: uuid
 *               seatLabel:
 *                 type: string
 *           example:
 *             scheduleId: "550e8400-e29b-41d4-a716-446655440000"
 *             seatLabel: "A1"
 *     responses:
 *       200:
 *         description: Seat unlocked successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Seat unlocked successfully"
 *               data:
 *                 scheduleId: "550e8400-e29b-41d4-a716-446655440000"
 *                 seatLabel: "A1"
 *                 releasedBy: "user-123"
 *       400:
 *         description: Seat not locked by you
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * @swagger
 * /api/seats/unlock-all:
 *   post:
 *     summary: Unlock all user's seats
 *     description: Release all seats locked by the authenticated user in a specific schedule.
 *     tags: [Seats (User)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduleId
 *             properties:
 *               scheduleId:
 *                 type: string
 *                 format: uuid
 *           example:
 *             scheduleId: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: All seats unlocked successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "Released 3 seats"
 *               data:
 *                 scheduleId: "550e8400-e29b-41d4-a716-446655440000"
 *                 releasedSeats: ["A1", "A2", "B3"]
 *                 releasedBy: "user-123"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

export {};
