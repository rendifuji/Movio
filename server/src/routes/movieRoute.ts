import express, { Router } from "express";
import MovieController from "../controllers/movieController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

export const adminMovieRouter: Router = express.Router();
adminMovieRouter.use(AuthMiddleware.authenticateToken);
adminMovieRouter.use(AuthMiddleware.adminOnly);

adminMovieRouter.post("/", MovieController.createMovie);
adminMovieRouter.put("/:movieId", MovieController.updateMovie);
adminMovieRouter.delete("/:movieId", MovieController.deleteMovie);
adminMovieRouter.get("/", MovieController.getMovies);