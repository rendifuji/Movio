/**
 * @swagger
 * /api/media/presigned-url:
 *   post:
 *     summary: Get presigned URL for file upload
 *     description: Generate a presigned URL for uploading files to Azure Blob Storage. Admin access required.
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PresignedUrlRequest'
 *           example:
 *             mimetype: "image/jpeg"
 *             size: 1024000
 *     responses:
 *       201:
 *         description: Presigned URL created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 201
 *               success: true
 *               message: "Presigned URL created successfully"
 *               data:
 *                 url: "https://moviostorage.blob.core.windows.net/movies/abc123def456.jpg?sv=2021-06-08&se=..."
 *                 fileKey: "abc123def456.jpg"
 *       400:
 *         description: Validation error or invalid file type
 *         content:
 *           application/json:
 *             examples:
 *               invalidType:
 *                 summary: Invalid file type
 *                 value:
 *                   status: 400
 *                   success: false
 *                   message: "Invalid file type! Supported file formats: PNG, JPEG, JPG, and WEBP."
 *               fileTooLarge:
 *                 summary: File too large
 *                 value:
 *                   status: 400
 *                   success: false
 *                   message: "Image file size must not exceed 5 MB."
 *               validationError:
 *                 summary: Validation failed
 *                 value:
 *                   status: 400
 *                   success: false
 *                   message: "Invalid request data"
 *                   errors:
 *                     - field: "mimetype"
 *                       message: "Mimetype is required"
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
 *               message: "An error occurred while creating presigned URL"
 *
 * @swagger
 * /api/media/{fileKey}:
 *   delete:
 *     summary: Delete a file from storage
 *     description: Delete a file from Azure Blob Storage using its file key. Admin access required.
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileKey
 *         required: true
 *         schema:
 *           type: string
 *         description: The file key (blob name) of the file to delete
 *         example: "abc123def456.jpg"
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: 200
 *               success: true
 *               message: "File deleted successfully"
 *               data:
 *                 fileKey: "abc123def456.jpg"
 *       400:
 *         description: File key is required
 *         content:
 *           application/json:
 *             example:
 *               status: 400
 *               success: false
 *               code: "BAD_REQUEST"
 *               message: "File key is required"
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
 *       404:
 *         description: File not found in storage
 *         content:
 *           application/json:
 *             example:
 *               status: 404
 *               success: false
 *               code: "NOT_FOUND"
 *               message: "File not found in storage"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: 500
 *               success: false
 *               code: "INTERNAL_SERVER_ERROR"
 *               message: "An error occurred while deleting file"
 */
