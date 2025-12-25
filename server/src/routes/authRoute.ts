import express, { Router } from "express";
import AuthController from "../controllers/authController.js";

const router: Router = express.Router();

// Regular auth routes
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

// Google OAuth routes
router.get("/google", AuthController.googleAuth);
router.get("/google/callback", AuthController.googleCallback);

export default router;
