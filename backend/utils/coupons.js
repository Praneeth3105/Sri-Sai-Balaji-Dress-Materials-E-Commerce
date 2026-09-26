const COUPONS = {
  SBD10: {
    type: "percent",
    value: 10,
    minSubtotal: 499,
    maxDiscount: 500,
  },
  WELCOME10: {
    type: "percent",
    value: 10,
    minSubtotal: 299,
    maxDiscount: 300,
  },
  SAVE100: {
    type: "flat",
    value: 100,
    minSubtotal: 799,
  },
  FESTIVE15: {
    type: "percent",
    value: 15,
    minSubtotal: 999,
    maxDiscount: 750,
  },
};

export const getCoupon = (code) => {
  const normalized = String(code || "")
    .trim()
    .toUpperCase();
  return COUPONS[normalized]
    ? { code: normalized, ...COUPONS[normalized] }
    : null;
};

export const calculateCouponDiscount = (code, subtotal) => {
  const coupon = getCoupon(code);
  const safeSubtotal = Math.max(0, Number(subtotal) || 0);

  if (!coupon) {
    return {
      valid: false,
      discount: 0,
      message: "Invalid coupon code",
    };
  }

  if (safeSubtotal < coupon.minSubtotal) {
    return {
      valid: false,
      discount: 0,
      message: `This coupon requires a minimum subtotal of ₹${coupon.minSubtotal}`,
    };
  }

  let discount =
    coupon.type === "percent"
      ? (safeSubtotal * coupon.value) / 100
      : coupon.value;

  if (coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  discount = Math.min(Math.max(0, discount), safeSubtotal);

  return {
    valid: true,
    code: coupon.code,
    discount: Number(discount.toFixed(2)),
    message: `${coupon.code} applied successfully`,
  };
};
