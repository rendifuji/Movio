import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import {
  adminMovieRouter,
  userMovieRouter,
  publicMovieRouter,
} from "./routes/movieRoute.js";
import {
  adminScheduleRouter,
  userScheduleRouter,
  publicScheduleRouter,
} from "./routes/scheduleRoute.js";
import {
  adminCinemaRouter,
  userCinemaRouter,
  publicCinemaRouter,
} from "./routes/cinemaRoute.js";
import { adminStudioRouter, userStudioRouter } from "./routes/studioRoute.js";
import { publicSeatRouter, userSeatRouter } from "./routes/seatRoute.js";
import { userRouter } from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import {
	adminTicketRouter,
	userTicketRouter,
} from "./routes/transactionRoute.js";
import mediaRouter from "./routes/mediaRoute.js";
import { setupSwagger } from "./config/swagger.js";
import { initializeSocketIO } from "./lib/socket.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

initializeSocketIO(httpServer);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Setup Swagger API Documentation
setupSwagger(app);

app.use("/api/movie/admin", adminMovieRouter);
app.use("/api/movie/user", userMovieRouter);
app.use("/api/movie", publicMovieRouter);
app.use("/api/schedule/admin", adminScheduleRouter);
app.use("/api/schedule/user", userScheduleRouter);
app.use("/api/schedule", publicScheduleRouter);
app.use("/api/cinema/admin", adminCinemaRouter);
app.use("/api/cinema/user", userCinemaRouter);
app.use("/api/cinema", publicCinemaRouter);
app.use("/api/studio/admin", adminStudioRouter);
app.use("/api/studio/user", userStudioRouter);
app.use("/api/seats/user", userSeatRouter);
app.use("/api/seats", publicSeatRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/transaction/admin", adminTicketRouter);
app.use("/api/transaction/user", userTicketRouter);
app.use("/api/media", mediaRouter);

app.get("/", (req, res) => {
  res.send("Test");
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
