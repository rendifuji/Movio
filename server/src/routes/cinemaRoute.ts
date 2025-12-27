import express, { Router } from "express";
import CinemaController from "../controllers/cinemaController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

export const adminCinemaRouter: Router = express.Router();
adminCinemaRouter.use(AuthMiddleware.authenticateToken);
adminCinemaRouter.use(AuthMiddleware.adminOnly);

adminCinemaRouter.post("/", CinemaController.createCinema);
adminCinemaRouter.put("/:cinemaId", CinemaController.updateCinema);
adminCinemaRouter.delete("/:cinemaId", CinemaController.deleteCinema);
adminCinemaRouter.get("/", CinemaController.getCinemas);
adminCinemaRouter.get("/:cinemaId", CinemaController.getCinemaById);

export const userCinemaRouter: Router = express.Router();
userCinemaRouter.use(AuthMiddleware.authenticateToken);
userCinemaRouter.get("/", CinemaController.getCinemas);
userCinemaRouter.get("/:cinemaId", CinemaController.getCinemaById);

export const publicCinemaRouter: Router = express.Router();
publicCinemaRouter.get("/", CinemaController.getCinemas);
publicCinemaRouter.get("/:cinemaId", CinemaController.getCinemaById);
