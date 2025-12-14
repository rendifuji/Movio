import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { adminMovieRouter } from "./routes/movieRoute.js";
import authRouter from "./routes/authRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser()); 

app.use("/api/admin/movie", adminMovieRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
	res.send("Test");
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
