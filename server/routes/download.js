import express from "express";
import { handleVideoDownload, getUserDownloads } from "../controllers/download.js";

const router = express.Router();

router.post("/:videoId", handleVideoDownload);
router.get("/user/:userId", getUserDownloads);

export default router;
