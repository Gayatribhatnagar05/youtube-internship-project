import mongoose from "mongoose";

const downloadSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles",
      required: true,
    },
    videoTitle: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: String },
    userPlan: { type: String, default: "Free" },
    downloadDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("download", downloadSchema);
