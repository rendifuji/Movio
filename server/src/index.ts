import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { adminMovieRouter, userMovieRouter } from "./routes/movieRoute.js";
import {
	adminScheduleRouter,
	userScheduleRouter,
} from "./routes/scheduleRoute.js";
import { adminCinemaRouter, userCinemaRouter } from "./routes/cinemaRoute.js";
import { adminStudioRouter, userStudioRouter } from "./routes/studioRoute.js";
import { userRouter } from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import { setupSwagger } from "./config/swagger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Setup Swagger API Documentation
setupSwagger(app);

app.use("/api/movie/admin", adminMovieRouter);
app.use("/api/movie/user", userMovieRouter);
app.use("/api/schedule/admin", adminScheduleRouter);
app.use("/api/schedule/user", userScheduleRouter);
app.use("/api/cinema/admin", adminCinemaRouter);
app.use("/api/cinema/user", userCinemaRouter);
app.use("/api/studio/admin", adminStudioRouter);
app.use("/api/studio/user", userStudioRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
	res.send("Test");
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
