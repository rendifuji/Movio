import { google } from "googleapis";

export const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	`http://localhost:${process.env.PORT || 8000}/api/auth/google/callback`
);

export const googleScopes = [
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/userinfo.profile",
];

export const getGoogleAuthUrl = () => {
	return oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: googleScopes,
		include_granted_scopes: true,
	});
};

export const getGoogleUserInfo = async (code: string) => {
	try {
		console.log("🟡 [GoogleAuth] Exchanging code for tokens...");
		const { tokens } = await oauth2Client.getToken(code);
		console.log("🟡 [GoogleAuth] Tokens received:", {
			has_access_token: !!tokens.access_token,
			has_refresh_token: !!tokens.refresh_token,
		});

		oauth2Client.setCredentials(tokens);

		console.log("🟡 [GoogleAuth] Fetching user info from Google...");
		const oauth2 = google.oauth2({
			auth: oauth2Client,
			version: "v2",
		});

		const userInfoResponse = await oauth2.userinfo.get();
		console.log("✅ [GoogleAuth] User info received:", userInfoResponse.data);
		return userInfoResponse.data;
	} catch (error) {
		console.error("❌ [GoogleAuth] Error getting user info:", error);
		if (error instanceof Error) {
			console.error("❌ [GoogleAuth] Error message:", error.message);
		}
		throw new Error("Failed to get Google user info");
	}
};
