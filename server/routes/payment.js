import express from "express";
import { createOrder, verifyPayment, getSubscriptionHistory } from "../controllers/payment.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.get("/history/:userId", getSubscriptionHistory);

export default router;
