import express, { Router } from "express";
import StudioController from "../controllers/studioController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

export const adminStudioRouter: Router = express.Router();
adminStudioRouter.use(AuthMiddleware.authenticateToken);
adminStudioRouter.use(AuthMiddleware.adminOnly);

adminStudioRouter.post("/", StudioController.createStudio);
adminStudioRouter.put("/:studioId", StudioController.updateStudio);
adminStudioRouter.delete("/:studioId", StudioController.deleteStudio);
adminStudioRouter.get("/", StudioController.getStudios);
adminStudioRouter.get("/:studioId", StudioController.getStudioById);

export const userStudioRouter: Router = express.Router();
userStudioRouter.use(AuthMiddleware.authenticateToken);
userStudioRouter.get("/", StudioController.getStudios);
userStudioRouter.get("/:studioId", StudioController.getStudioById);
