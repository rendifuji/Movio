import crypto from "crypto";
import { blobServiceClient, containerName } from "../lib/azureBlobClient.js";
import type { PresignedUrlRequest } from "../types/mediaType.js";
import { BlobSASPermissions } from "@azure/storage-blob";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const getFileExtension = (mimetype: string): string => {
	switch (mimetype) {
		case "image/png":
			return ".png";
		case "image/jpeg":
		case "image/jpg":
			return ".jpg";
		case "image/webp":
			return ".webp";
		default:
			return "";
	}
};

const generateFileName = (bytes = 32): string => {
	return crypto.randomBytes(bytes).toString("hex");
};

export const MediaService = {
	async createPresignedUrl(data: PresignedUrlRequest) {
		const { mimetype, size } = data;

		if (!getFileExtension(mimetype)) {
			throw new Error(
				"Invalid file type! Supported file formats: PNG, JPEG, JPG, and WEBP."
			);
		}

		if (size > MAX_IMAGE_SIZE) {
			throw new Error("Image file size must not exceed 5 MB.");
		}

		const fileExtension = getFileExtension(mimetype);
		const fileName = generateFileName();
		const blobName = `${fileName}${fileExtension}`;

		const containerClient = blobServiceClient.getContainerClient(containerName);
		const blockBlobClient = containerClient.getBlockBlobClient(blobName);

		// Generate SAS URL for upload
		const expiresOn = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

		const sasUrl = await blockBlobClient.generateSasUrl({
			permissions: BlobSASPermissions.parse("cw"), // create and write
			expiresOn,
			contentType: mimetype,
		});

		return { url: sasUrl, fileKey: blobName };
	},

	async fileExists(fileKey: string): Promise<boolean> {
		try {
			if (!fileKey) {
				throw new Error("File key is required");
			}

			const containerClient =
				blobServiceClient.getContainerClient(containerName);
			const blockBlobClient = containerClient.getBlockBlobClient(fileKey);

			return await blockBlobClient.exists();
		} catch (error: any) {
			if (error.statusCode === 404) {
				return false;
			}
			throw error;
		}
	},

	async deleteFile(fileKey: string) {
		const containerClient = blobServiceClient.getContainerClient(containerName);
		const blockBlobClient = containerClient.getBlockBlobClient(fileKey);

		await blockBlobClient.deleteIfExists();

		return { fileKey };
	},
};
