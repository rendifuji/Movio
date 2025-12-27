import express, { Router } from "express";
import SeatController from "../controllers/seatController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

export const publicSeatRouter: Router = express.Router();
publicSeatRouter.get("/schedule/:scheduleId/seats", SeatController.getSeats);

export const userSeatRouter: Router = express.Router();
userSeatRouter.use(AuthMiddleware.authenticateToken);
userSeatRouter.use(AuthMiddleware.userOrAdmin);

userSeatRouter.post("/lock", SeatController.lockSeat);
userSeatRouter.post("/unlock", SeatController.unlockSeat);
userSeatRouter.post("/unlock-all", SeatController.unlockAllSeats);
