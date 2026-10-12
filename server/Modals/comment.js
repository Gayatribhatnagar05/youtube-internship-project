import mongoose from "mongoose";
const commentschema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    videoid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles",
      required: true,
    },
    commentbody: { type: String },
    usercommented: { type: String },
    commentedon: { type: Date, default: Date.now },
    likes: [{ type: String }],
    dislikes: [{ type: String }],
    isReported: { type: Boolean, default: false },
    reports: [
      {
        userId: { type: String },
        reason: { type: String },
        reportedAt: { type: Date, default: Date.now },
      },
    ],
    language: { type: String, default: "en" },
    location: {
      city: { type: String },
      state: { type: String },
      showLocation: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("comment", commentschema);
