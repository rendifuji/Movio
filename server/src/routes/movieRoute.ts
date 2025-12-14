import express, { Router } from "express";
import MovieController from "../controllers/movieController.js";

export const adminMovieRouter: Router = express.Router();

adminMovieRouter.post("/", MovieController.createMovie);
adminMovieRouter.put("/:movieId", MovieController.updateMovie);
adminMovieRouter.delete("/:movieId", MovieController.deleteMovie);
adminMovieRouter.get("/", MovieController.getMovies);