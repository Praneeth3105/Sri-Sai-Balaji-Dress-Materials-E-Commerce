import mongoose from "mongoose";

const couponUsageSchema = new mongoose.Schema(
  {
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    discountAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Reserved", "Used"],
      default: "Reserved",
    },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// One coupon can be used only once by the same account.
couponUsageSchema.index({ coupon: 1, user: 1 }, { unique: true });

export const CouponUsage = mongoose.model("CouponUsage", couponUsageSchema);
