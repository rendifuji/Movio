import express, { Router } from "express";
import ScheduleController from "../controllers/scheduleController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

export const adminScheduleRouter: Router = express.Router();
adminScheduleRouter.use(AuthMiddleware.authenticateToken);
adminScheduleRouter.use(AuthMiddleware.adminOnly);

adminScheduleRouter.post("/", ScheduleController.createSchedule);
adminScheduleRouter.put("/:scheduleId", ScheduleController.updateSchedule);
adminScheduleRouter.delete("/:scheduleId", ScheduleController.deleteSchedule);
adminScheduleRouter.get("/", ScheduleController.getSchedules);

export const userScheduleRouter: Router = express.Router();
userScheduleRouter.use(AuthMiddleware.authenticateToken);
userScheduleRouter.use(AuthMiddleware.userOrAdmin);
userScheduleRouter.get("/", ScheduleController.getSchedules);
userScheduleRouter.get("/:scheduleId", ScheduleController.getScheduleById);

export const publicScheduleRouter: Router = express.Router();
publicScheduleRouter.get("/", ScheduleController.getSchedules);
publicScheduleRouter.get("/:scheduleId", ScheduleController.getScheduleById);
