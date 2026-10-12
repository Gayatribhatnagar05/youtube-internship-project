import User from "../Modals/Auth.js";
import crypto from "crypto";

export const checkDeviceAndSendOtp = async (req, res) => {
  const { email, deviceIdentifier, locationInfo } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required for login device check" });
  }

  try {
    let user = await User.findOne({ email });

    // If user does not exist yet, create initial profile
    if (!user) {
      user = new User({
        email,
        name: email.split("@")[0],
        channelname: email.split("@")[0],
        knownDevices: [],
      });
      await user.save();
    }

    const clientDeviceKey = deviceIdentifier || req.headers["user-agent"] || "default-device";
    const locationKey = locationInfo ? `${locationInfo.city}_${locationInfo.state}` : "unknown_location";
    const deviceHash = crypto.createHash("md5").update(`${clientDeviceKey}_${locationKey}`).digest("hex");

    const isKnown = user.knownDevices && user.knownDevices.includes(deviceHash);

    if (!isKnown) {
      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

      user.otpCode = otpCode;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();

      console.log(`[SECURITY OTP SENT] 6-digit OTP for ${email} from new location/device (${locationKey}): ${otpCode}`);

      return res.status(200).json({
        requireOtp: true,
        message: "New device, city, or state login detected. OTP sent to registered email.",
        email: user.email,
        deviceHash,
        debugOtp: otpCode,
      });
    }

    // Known device - direct login
    return res.status(200).json({
      requireOtp: false,
      user,
      message: "Device recognized. Login authorized.",
    });
  } catch (error) {
    console.error("Error in OTP device check:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyLoginOtp = async (req, res) => {
  const { email, otpCode, deviceHash } = req.body;

  if (!email || !otpCode) {
    return res.status(400).json({ message: "Email and OTP code are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otpCode || !user.otpExpiresAt) {
      return res.status(400).json({ message: "No active OTP request found for this account" });
    }

    if (new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({ message: "OTP code has expired. Please request a new code." });
    }

    if (user.otpCode !== otpCode.trim()) {
      return res.status(400).json({ message: "Invalid OTP code. Please check and try again." });
    }

    // OTP Valid - Register device hash into knownDevices list
    if (deviceHash && (!user.knownDevices || !user.knownDevices.includes(deviceHash))) {
      user.knownDevices.push(deviceHash);
    }
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. Device authorized!",
      user,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserTheme = async (req, res) => {
  const { userId, themePreference } = req.body;

  if (!userId || !themePreference) {
    return res.status(400).json({ message: "Missing userId or themePreference" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.themePreference = themePreference;
    await user.save();

    return res.status(200).json({ success: true, themePreference: user.themePreference });
  } catch (error) {
    console.error("Error updating theme:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
