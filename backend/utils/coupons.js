import { Coupon } from "../models/couponModel.js";
import { CouponUsage } from "../models/couponUsageModel.js";
import { Order } from "../models/orderModel.js";

export const normalizeCouponCode = (code) =>
  String(code || "")
    .trim()
    .toUpperCase();

const successfulStatuses = [
  "Paid",
  "Order Placed",
  "Accepted",
  "Processing",
  "Ready for Dispatch",
  "Dispatched",
  "Out for Delivery",
  "Delivered",
];

export const getUserType = async (userId) => {
  const previousOrder = await Order.findOne({
    user: userId,
    status: { $in: successfulStatuses },
  }).select("_id");

  return previousOrder ? "existing" : "new";
};

export const calculateDiscount = (coupon, subtotal) => {
  const safeSubtotal = Math.max(0, Number(subtotal) || 0);

  if (safeSubtotal < Number(coupon.minimumOrderValue || 0)) {
    return {
      valid: false,
      discount: 0,
      message: `This coupon requires a minimum order of ₹${Number(
        coupon.minimumOrderValue || 0,
      ).toLocaleString("en-IN")}`,
    };
  }

  let discount =
    coupon.discountType === "percent"
      ? (safeSubtotal * Number(coupon.discountValue || 0)) / 100
      : Number(coupon.discountValue || 0);

  if (coupon.maximumDiscount !== null && coupon.maximumDiscount !== undefined) {
    discount = Math.min(discount, Number(coupon.maximumDiscount));
  }

  discount = Math.min(Math.max(0, discount), safeSubtotal);

  return {
    valid: true,
    discount: Number(discount.toFixed(2)),
    code: coupon.code,
    message: `${coupon.code} applied successfully`,
  };
};

export const validateCouponForUser = async ({
  code,
  subtotal,
  userId,
  reserve = false,
}) => {
  const normalizedCode = normalizeCouponCode(code);
  const safeSubtotal = Math.max(0, Number(subtotal) || 0);

  if (!normalizedCode) {
    return { valid: false, discount: 0, message: "Enter a coupon code" };
  }

  const coupon = await Coupon.findOne({ code: normalizedCode });

  if (!coupon) {
    return { valid: false, discount: 0, message: "Invalid coupon code" };
  }

  const now = new Date();

  if (coupon.approvalStatus !== "Approved") {
    return {
      valid: false,
      discount: 0,
      message: "This offer has not been approved yet",
    };
  }

  if (coupon.status !== "active") {
    return { valid: false, discount: 0, message: "This offer is inactive" };
  }

  if (now < coupon.startDate) {
    return {
      valid: false,
      discount: 0,
      message: `This offer starts on ${coupon.startDate.toLocaleString("en-IN")}`,
    };
  }

  if (now > coupon.endDate) {
    return { valid: false, discount: 0, message: "This offer has expired" };
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return {
      valid: false,
      discount: 0,
      message: "This offer has reached its usage limit",
    };
  }

  // Release abandoned reservations older than 30 minutes for this user/coupon.
  await CouponUsage.deleteMany({
    coupon: coupon._id,
    user: userId,
    status: "Reserved",
    createdAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) },
  });

  const existingUsage = await CouponUsage.findOne({
    coupon: coupon._id,
    user: userId,
  });

  if (existingUsage) {
    return {
      valid: false,
      discount: 0,
      message:
        existingUsage.status === "Used"
          ? "You have already used this coupon"
          : "This coupon is already reserved for your current order",
    };
  }

  if (coupon.audience !== "all") {
    const userType = await getUserType(userId);
    if (coupon.audience !== userType) {
      return {
        valid: false,
        discount: 0,
        message:
          coupon.audience === "new"
            ? "This offer is available for new customers only"
            : "This offer is available for existing customers only",
      };
    }
  }

  const discountResult = calculateDiscount(coupon, safeSubtotal);
  if (!discountResult.valid) return discountResult;

  if (reserve) {
    return {
      ...discountResult,
      coupon,
    };
  }

  return {
    ...discountResult,
    couponId: coupon._id,
    title: coupon.title,
    description: coupon.description,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    minimumOrderValue: coupon.minimumOrderValue,
    maximumDiscount: coupon.maximumDiscount,
    startDate: coupon.startDate,
    endDate: coupon.endDate,
  };
};

export const calculateCouponDiscount = async (code, subtotal, userId) =>
  validateCouponForUser({ code, subtotal, userId, reserve: false });
