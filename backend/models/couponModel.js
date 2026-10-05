import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    discountType: { type: String, enum: ["percent", "flat"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minimumOrderValue: { type: Number, default: 0, min: 0 },
    maximumDiscount: { type: Number, default: null, min: 0 },
    usageLimit: { type: Number, default: null, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    perUserLimit: { type: Number, default: 1, min: 1, max: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    audience: {
      type: String,
      enum: ["all", "new", "existing"],
      default: "all",
    },
    approvalStatus: {
      type: String,
      enum: ["Draft", "Approved", "Rejected"],
      default: "Draft",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

couponSchema.index({ code: 1 }, { unique: true });

export const Coupon = mongoose.model("Coupon", couponSchema);
