import video from "../Modals/video.js";
import history from "../Modals/history.js";
import mongoose from "mongoose";

export const handlehistory = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;

  try {
    if (mongoose.Types.ObjectId.isValid(videoId) && mongoose.Types.ObjectId.isValid(userId)) {
      await history.create({ viewer: userId, videoid: videoId });
      await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    }
    return res.status(200).json({ history: true });
  } catch (error) {
    console.error("error handling history:", error);
    return res.status(200).json({ history: true });
  }
};

export const handleview = async (req, res) => {
  const { videoId } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(videoId)) {
      await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("error handling view:", error);
    return res.status(200).json({ success: true });
  }
};

export const getallhistoryVideo = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(200).json([]);
    }
    const historyvideo = await history
      .find({ viewer: userId })
      .populate({
        path: "videoid",
        model: "videofiles",
      })
      .exec();
    return res.status(200).json(historyvideo || []);
  } catch (error) {
    console.error("error fetching history:", error);
    return res.status(200).json([]);
  }
};

export const deletehistory = async (req, res) => {
  const { historyId } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(historyId)) {
      await history.findByIdAndDelete(historyId);
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("error deleting history:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const clearallhistory = async (req, res) => {
  const { userId } = req.params;
  try {
    if (mongoose.Types.ObjectId.isValid(userId)) {
      await history.deleteMany({ viewer: userId });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("error clearing history:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
