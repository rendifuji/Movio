import express, { Router } from "express";
import TransactionController from "../controllers/transactionController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

export const adminTicketRouter: Router = express.Router();
adminTicketRouter.use(AuthMiddleware.authenticateToken);
adminTicketRouter.use(AuthMiddleware.adminOnly);

adminTicketRouter.get(
	"/dashboard",
	TransactionController.getAdminDashboard
);

export const userTicketRouter: Router = express.Router();
userTicketRouter.use(AuthMiddleware.authenticateToken);
userTicketRouter.use(AuthMiddleware.userOrAdmin);

userTicketRouter.post("/checkout", TransactionController.checkout);

userTicketRouter.get("/ticket", TransactionController.getMyTickets);
userTicketRouter.get("/ticket/:ticketId", TransactionController.getTicketById);

// userTicketRouter.get("/booked-seats/:scheduleId", TransactionController.getBookedSeats);

