import mongoose from "mongoose";
const userschema = mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  channelname: { type: String },
  description: { type: String },
  image: { type: String },
  joinedon: { type: Date, default: Date.now },
  plan: { type: String, default: "Free" },
  downloadsTodayCount: { type: Number, default: 0 },
  lastDownloadDate: { type: Date },
  themePreference: { type: String, default: "auto" },
  knownDevices: [{ type: String }],
  otpCode: { type: String },
  otpExpiresAt: { type: Date },
});

export default mongoose.model("user", userschema);
