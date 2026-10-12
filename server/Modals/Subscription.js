import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    plan: {
      type: String,
      enum: ["Free", "Bronze", "Silver", "Gold"],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true },
    invoiceId: { type: String, required: true },
    status: { type: String, default: "SUCCESS" },
    paymentDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("subscription", subscriptionSchema);
