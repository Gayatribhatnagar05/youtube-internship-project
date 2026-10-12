import express from "express";
import { checkDeviceAndSendOtp, verifyLoginOtp, updateUserTheme } from "../controllers/otp.js";

const router = express.Router();

router.post("/device-check", checkDeviceAndSendOtp);
router.post("/verify-otp", verifyLoginOtp);
router.post("/theme", updateUserTheme);

export default router;
