export type PresignedUrlRequest = {
	mimetype: string;
	size: number;
};

export type PresignedUrlResponse = {
	url: string;
	fileKey: string;
};
