import { Coupon } from "../models/couponModel.js";
import { CouponUsage } from "../models/couponUsageModel.js";
import { validateCouponForUser } from "../utils/coupons.js";
import { Order } from "../models/orderModel.js";

const normalize = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

const cleanPayload = (body) => ({
  code: normalize(body.code),
  title: String(body.title || "").trim(),
  description: String(body.description || "").trim(),
  discountType: body.discountType === "flat" ? "flat" : "percent",
  discountValue: Number(body.discountValue || 0),
  minimumOrderValue: Number(body.minimumOrderValue || 0),
  maximumDiscount:
    body.maximumDiscount === "" ||
    body.maximumDiscount === null ||
    body.maximumDiscount === undefined
      ? null
      : Number(body.maximumDiscount),
  usageLimit:
    body.usageLimit === "" ||
    body.usageLimit === null ||
    body.usageLimit === undefined
      ? null
      : Number(body.usageLimit),
  startDate: new Date(body.startDate),
  endDate: new Date(body.endDate),
  audience: ["all", "new", "existing"].includes(body.audience)
    ? body.audience
    : "all",
});

export const createCoupon = async (req, res) => {
  try {
    const data = cleanPayload(req.body);

    if (!data.code || !data.title) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Coupon code and title are required",
        });
    }
    if (!Number.isFinite(data.discountValue) || data.discountValue <= 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Discount value must be greater than 0",
        });
    }
    if (data.discountType === "percent" && data.discountValue > 100) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Percentage discount cannot exceed 100%",
        });
    }
    if (
      !Number.isFinite(data.minimumOrderValue) ||
      data.minimumOrderValue < 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid minimum order value" });
    }
    if (
      data.maximumDiscount !== null &&
      (!Number.isFinite(data.maximumDiscount) || data.maximumDiscount <= 0)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid maximum discount" });
    }
    if (
      data.usageLimit !== null &&
      (!Number.isFinite(data.usageLimit) || data.usageLimit < 1)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Usage limit must be at least 1" });
    }
    if (
      Number.isNaN(data.startDate.getTime()) ||
      Number.isNaN(data.endDate.getTime()) ||
      data.endDate <= data.startDate
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide a valid start and end date",
        });
    }

    const existing = await Coupon.findOne({ code: data.code });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create(data);
    return res
      .status(201)
      .json({ success: true, message: "Offer created successfully", coupon });
  } catch (error) {
    console.error("CREATE COUPON ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, coupons });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.couponId);
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });

    const data = cleanPayload({ ...coupon.toObject(), ...req.body });
    data.code = coupon.code; // coupon codes are immutable after creation

    Object.assign(coupon, data);
    await coupon.save();

    return res
      .status(200)
      .json({ success: true, message: "Offer updated successfully", coupon });
  } catch (error) {
    console.error("UPDATE COUPON ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const approveCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.couponId,
      { approvalStatus: "Approved", status: "active" },
      { new: true },
    );
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    return res
      .status(200)
      .json({ success: true, message: "Offer approved successfully", coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.couponId,
      { approvalStatus: "Rejected", status: "inactive" },
      { new: true },
    );
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    return res
      .status(200)
      .json({ success: true, message: "Offer rejected", coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.couponId);
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    coupon.status = coupon.status === "active" ? "inactive" : "active";
    await coupon.save();
    return res
      .status(200)
      .json({
        success: true,
        message: `Offer ${coupon.status === "active" ? "activated" : "deactivated"}`,
        coupon,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.couponId);
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    const used = await CouponUsage.exists({
      coupon: coupon._id,
      status: "Used",
    });
    if (used) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Used offers cannot be deleted. Deactivate them instead.",
        });
    }
    await CouponUsage.deleteMany({ coupon: coupon._id });
    await coupon.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: "Offer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAvailableCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      approvalStatus: "Approved",
      status: "active",
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ createdAt: -1 });

    // Clean abandoned checkout reservations first.
    await CouponUsage.deleteMany({
      user: req.id,
      status: "Reserved",
      createdAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) },
    });

    const successfulOrderExists = await Order.exists({
      user: req.id,
      status: {
        $in: [
          "Paid",
          "Order Placed",
          "Accepted",
          "Processing",
          "Ready for Dispatch",
          "Dispatched",
          "Out for Delivery",
          "Delivered",
        ],
      },
    });
    const userType = successfulOrderExists ? "existing" : "new";

    const result = [];
    for (const coupon of coupons) {
      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
        continue;
      if (coupon.audience !== "all" && coupon.audience !== userType) continue;

      const usage = await CouponUsage.findOne({
        coupon: coupon._id,
        user: req.id,
      });
      if (usage) continue;

      result.push({
        _id: coupon._id,
        code: coupon.code,
        title: coupon.title,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrderValue: coupon.minimumOrderValue,
        maximumDiscount: coupon.maximumDiscount,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        audience: coupon.audience,
      });
    }

    return res.status(200).json({ success: true, coupons: result });
  } catch (error) {
    console.error("GET AVAILABLE COUPONS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
