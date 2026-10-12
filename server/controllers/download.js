import Download from "../Modals/Download.js";
import User from "../Modals/Auth.js";
import Video from "../Modals/video.js";
import { CATEGORY_CATALOG } from "./video.js";
import mongoose from "mongoose";

const PLAN_QUOTAS = {
  Free: 1,
  Bronze: 5,
  Silver: 20,
  Gold: 1000,
};

export const handleVideoDownload = async (req, res) => {
  const { videoId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Authentication required to download videos" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(444).json({ message: "User not found" });
    }

    let video = null;
    if (mongoose.Types.ObjectId.isValid(videoId)) {
      video = await Video.findById(videoId);
    }
    if (!video) {
      video = CATEGORY_CATALOG.find((v) => String(v._id) === String(videoId));
    }
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const userPlan = user.plan || "Free";
    const quota = PLAN_QUOTAS[userPlan] || 1;

    // Check if last download was on a previous calendar day
    const now = new Date();
    const lastDate = user.lastDownloadDate ? new Date(user.lastDownloadDate) : null;
    let downloadsToday = user.downloadsTodayCount || 0;

    if (
      !lastDate ||
      lastDate.getUTCFullYear() !== now.getUTCFullYear() ||
      lastDate.getUTCMonth() !== now.getUTCMonth() ||
      lastDate.getUTCDate() !== now.getUTCDate()
    ) {
      downloadsToday = 0;
    }

    if (downloadsToday >= quota) {
      return res.status(403).json({
        message: `Daily download limit reached for your ${userPlan} plan (${downloadsToday}/${quota}). Upgrade your plan to download more videos!`,
        userPlan,
        quota,
        downloadsToday,
      });
    }

    // Record download entry
    const newDownload = new Download({
      userId: user._id,
      videoId: video._id,
      videoTitle: video.videotitle,
      filePath: video.filepath,
      fileSize: video.filesize || "Unknown",
      userPlan,
      downloadDate: now,
    });

    await newDownload.save();

    // Update user download count and last date
    user.downloadsTodayCount = downloadsToday + 1;
    user.lastDownloadDate = now;
    await user.save();

    return res.status(200).json({
      message: "Download permitted",
      downloadUrl: video.filepath,
      videoTitle: video.videotitle,
      downloadsToday: user.downloadsTodayCount,
      quota,
      userPlan,
    });
  } catch (error) {
    console.error("Error handling download:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserDownloads = async (req, res) => {
  const { userId } = req.params;

  try {
    const downloads = await Download.find({ userId }).sort({ createdAt: -1 });
    const user = await User.findById(userId);

    const userPlan = user?.plan || "Free";
    const quota = PLAN_QUOTAS[userPlan] || 1;
    const downloadsToday = user?.downloadsTodayCount || 0;

    return res.status(200).json({
      downloads,
      userPlan,
      quota,
      downloadsToday,
      remainingToday: Math.max(0, quota - downloadsToday),
    });
  } catch (error) {
    console.error("Error fetching user downloads:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
