import express, { Router } from "express";
import UserController from "../controllers/userController.js";

export const userRouter: Router = express.Router();

userRouter.post("/", UserController.createUser);