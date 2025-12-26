import express, { Router } from "express";
import { getPresignedUrl, deleteFile } from "../controllers/mediaController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

const router: Router = express.Router();

router.use(AuthMiddleware.authenticateToken);
router.use(AuthMiddleware.adminOnly);

router.post("/presigned-url", getPresignedUrl);

router.delete("/:fileKey", deleteFile);

export default router;