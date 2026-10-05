import razorpayInstance from "../Config/razorpay.js";
import { Order } from "../models/orderModel.js";
import crypto from "crypto";
import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";
import { validateCouponForUser } from "../utils/coupons.js";
import { Coupon } from "../models/couponModel.js";
import { CouponUsage } from "../models/couponUsageModel.js";

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const STATUS_FLOW = [
  "Order Placed",
  "Accepted",
  "Processing",
  "Ready for Dispatch",
  "Dispatched",
  "Out for Delivery",
  "Delivered",
];

const getVariantStock = (variant, size) => {
  const stockItem = (variant?.sizeStock || []).find(
    (item) => normalize(item.size) === normalize(size),
  );

  if (stockItem) return Math.max(0, Number(stockItem.quantity) || 0);

  const sizeExists = (variant?.sizes || []).some(
    (item) => normalize(item) === normalize(size),
  );
  return sizeExists ? 1 : 0;
};

const validateOrderStock = async (products) => {
  for (const item of products) {
    const product = await Product.findById(item.productId);

    if (!product)
      throw new Error("One of the selected products is no longer available");
    if (!product.variants?.length) continue;

    const variant = product.variants.find(
      (entry) => normalize(entry.color) === normalize(item.color),
    );
    if (!variant)
      throw new Error(`Color ${item.color || ""} is no longer available`);

    const stock = getVariantStock(variant, item.size);
    if (stock <= 0) {
      throw new Error(
        `${product.productName} - ${variant.color} / ${item.size || "size"} is out of stock`,
      );
    }

    if (Number(item.quantity) > stock) {
      throw new Error(
        `Only ${stock} item${stock === 1 ? "" : "s"} available for ${product.productName} - ${variant.color} / ${item.size}`,
      );
    }
  }
};

const calculateOrderPricing = async (products, couponCode = "", userId) => {
  let subtotal = 0;

  for (const item of products) {
    const product = await Product.findById(item.productId).select(
      "productName productPrice",
    );
    if (!product)
      throw new Error("One of the selected products is no longer available");
    subtotal += Number(product.productPrice || 0) * Number(item.quantity || 0);
  }

  subtotal = Number(subtotal.toFixed(2));

  let discount = 0;
  let appliedCoupon = "";

  if (couponCode) {
    const couponResult = await validateCouponForUser({
      code: couponCode,
      subtotal,
      userId,
    });
    // User-aware validation is performed before this function from createOrder.
    if (!couponResult.valid) throw new Error(couponResult.message);
    discount = couponResult.discount;
    appliedCoupon = couponResult.code;
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping = discountedSubtotal > 299 ? 0 : 10;
  const tax = Number((discountedSubtotal * 0.05).toFixed(2));
  const total = Number((discountedSubtotal + shipping + tax).toFixed(2));

  return {
    subtotal,
    discount,
    couponCode: appliedCoupon,
    shipping,
    tax,
    amount: total,
  };
};

const ensureTracking = (order) => {
  if (!order.tracking || order.tracking.length === 0) {
    const status = order.status === "Paid" ? "Order Placed" : order.status;
    order.tracking = [
      {
        status,
        message:
          status === "Order Placed"
            ? "Payment received and order placed."
            : "Order created.",
        timestamp: order.createdAt || new Date(),
      },
    ];
  }
  return order;
};

export const applyCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const result = await validateCouponForUser({
      code,
      subtotal,
      userId: req.id,
      reserve: false,
    });

    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      couponCode: result.code,
      discount: result.discount,
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.id;
    const { products, currency, address, couponCode } = req.body;

    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No products found" });
    }

    await validateOrderStock(products);
    const pricing = await calculateOrderPricing(products, couponCode, userId);

    let coupon = null;

    if (couponCode) {
      const couponResult = await validateCouponForUser({
        code: couponCode,
        subtotal: pricing.subtotal,
        userId,
        reserve: true,
      });
      if (!couponResult.valid) throw new Error(couponResult.message);
      coupon = couponResult.coupon;
    }

    const newOrder = new Order({
      user: userId,
      products,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      couponCode: pricing.couponCode,
      amount: pricing.amount,
      tax: pricing.tax,
      shipping: pricing.shipping,
      currency: currency || "INR",
      deliveryAddress: address || null,
      status: "Pending",
    });

    await newOrder.save();

    if (coupon) {
      try {
        await CouponUsage.create({
          coupon: coupon._id,
          user: userId,
          order: newOrder._id,
          discountAmount: pricing.discount,
          status: "Reserved",
        });
      } catch (usageError) {
        await newOrder.deleteOne();
        if (usageError?.code === 11000) {
          return res.status(409).json({
            success: false,
            message: "You have already used or reserved this coupon",
          });
        }
        throw usageError;
      }
    }

    try {
      const options = {
        amount: Math.round(pricing.amount * 100),
        currency: currency || "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const razorpayOrder = await razorpayInstance.orders.create(options);
      newOrder.razorpayOrderId = razorpayOrder.id;
      await newOrder.save();

      return res.status(200).json({
        success: true,
        message: "Order Created Successfully",
        order: razorpayOrder,
        dbOrder: newOrder,
        pricing,
      });
    } catch (razorpayError) {
      if (coupon)
        await CouponUsage.deleteOne({
          coupon: coupon._id,
          user: userId,
          order: newOrder._id,
        });
      await newOrder.deleteOne();
      throw razorpayError;
    }
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message:
        error?.error?.description || error.message || "Failed to create order",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const userId = req.id;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentFailed,
    } = req.body;

    if (paymentFailed) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id, user: userId },
        { status: "Failed" },
        { new: true },
      );
      if (order?.couponCode) {
        await CouponUsage.deleteOne({
          order: order._id,
          user: userId,
          status: "Reserved",
        });
      }
      return res
        .status(400)
        .json({ success: false, message: "Payment Failed", order });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is missing",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      const failedOrder = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id, user: userId },
        { status: "Failed" },
        { new: true },
      );
      if (failedOrder?.couponCode) {
        await CouponUsage.deleteOne({
          order: failedOrder._id,
          user: userId,
          status: "Reserved",
        });
      }
      return res
        .status(400)
        .json({ success: false, message: "Invalid Signature" });
    }

    const existingOrder = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user: userId,
    });
    if (!existingOrder)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (
      [
        "Paid",
        "Order Placed",
        "Accepted",
        "Processing",
        "Ready for Dispatch",
        "Dispatched",
        "Out for Delivery",
        "Delivered",
      ].includes(existingOrder.status)
    ) {
      return res.status(200).json({
        success: true,
        message: "Payment Already Verified",
        order: existingOrder,
      });
    }

    const productsToSave = new Map();

    for (const orderItem of existingOrder.products) {
      const key = String(orderItem.productId);
      let product = productsToSave.get(key);

      if (!product) {
        product = await Product.findById(orderItem.productId);
      }

      if (!product)
        throw new Error("A product in this order is no longer available");
      if (!product.variants?.length) {
        productsToSave.set(key, product);
        continue;
      }

      const variant = product.variants.find(
        (item) => normalize(item.color) === normalize(orderItem.color),
      );
      if (!variant)
        throw new Error(
          `Color ${orderItem.color || ""} is no longer available`,
        );

      let stockItem = variant.sizeStock?.find(
        (item) => normalize(item.size) === normalize(orderItem.size),
      );

      if (!stockItem) {
        const sizeExists = (variant.sizes || []).some(
          (size) => normalize(size) === normalize(orderItem.size),
        );
        if (!sizeExists)
          throw new Error(
            `Size ${orderItem.size || ""} is no longer available for ${variant.color}`,
          );
        if (!variant.sizeStock) variant.sizeStock = [];
        stockItem = { size: orderItem.size, quantity: 1 };
        variant.sizeStock.push(stockItem);
      }

      if (Number(stockItem.quantity) < Number(orderItem.quantity)) {
        throw new Error(
          `Only ${stockItem.quantity} item${Number(stockItem.quantity) === 1 ? "" : "s"} available for ${variant.color} / ${orderItem.size}`,
        );
      }

      stockItem.quantity =
        Number(stockItem.quantity) - Number(orderItem.quantity);
      product.salesCount =
        Number(product.salesCount || 0) + Number(orderItem.quantity || 0);
      productsToSave.set(key, product);
    }

    for (const product of productsToSave.values()) {
      await product.save();
    }

    const order = await Order.findOneAndUpdate(
      { _id: existingOrder._id, status: "Pending" },
      {
        status: "Order Placed",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        $push: {
          tracking: {
            status: "Order Placed",
            message: "Payment received and your order has been placed.",
            timestamp: new Date(),
          },
        },
      },
      { new: true },
    );

    if (!order)
      return res
        .status(409)
        .json({ success: false, message: "Order was already processed" });

    if (order.couponCode) {
      const usage = await CouponUsage.findOneAndUpdate(
        { order: order._id, user: userId, status: "Reserved" },
        { status: "Used", usedAt: new Date() },
        { new: true },
      );

      if (usage) {
        await Coupon.findByIdAndUpdate(usage.coupon, {
          $inc: { usedCount: 1 },
        });
      }
    }

    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], totalPrice: 0 } },
    );

    return res
      .status(200)
      .json({ success: true, message: "Payment Successful", order });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const populateOrders = (query) =>
  query
    .populate({
      path: "products.productId",
      select: "productName productPrice productImage variants",
    })
    .populate("user", "firstName lastName email phoneNo")
    .sort({ createdAt: -1 });

export const getMyOrder = async (req, res) => {
  try {
    const orders = await populateOrders(Order.find({ user: req.id }));
    orders.forEach(ensureTracking);
    return res
      .status(200)
      .json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await populateOrders(
      Order.find({ user: req.params.userId }),
    );
    orders.forEach(ensureTracking);
    return res
      .status(200)
      .json({ success: true, count: orders.length, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await populateOrders(
      Order.findOne({ _id: req.params.orderId, user: req.id }),
    ).then((orders) => orders[0]);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    ensureTracking(order);
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await populateOrders(Order.find());
    orders.forEach(ensureTracking);
    return res
      .status(200)
      .json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to Fetch All Orders",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, message } = req.body;

    if (![...STATUS_FLOW, "Cancelled"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });
    }

    const order = await Order.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    const current = order.status === "Paid" ? "Order Placed" : order.status;

    if (current === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be moved backwards",
      });
    }

    if (status !== "Cancelled") {
      const currentIndex = STATUS_FLOW.indexOf(current);
      const nextIndex = STATUS_FLOW.indexOf(status);
      if (currentIndex === -1 || nextIndex !== currentIndex + 1) {
        return res.status(400).json({
          success: false,
          message: `Next status should be ${STATUS_FLOW[Math.max(0, currentIndex + 1)] || "Delivered"}`,
        });
      }
    }

    if (
      status === "Cancelled" &&
      ["Delivered", "Out for Delivery"].includes(current)
    ) {
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled at the current stage",
      });
    }

    // A paid order that is cancelled before the delivery stage returns its
    // purchased inventory to the correct color + size stock.
    if (
      status === "Cancelled" &&
      current !== "Cancelled" &&
      current !== "Pending" &&
      current !== "Failed"
    ) {
      const restoredProducts = new Map();

      for (const item of order.products || []) {
        const key = String(item.productId);
        const product =
          restoredProducts.get(key) || (await Product.findById(item.productId));
        if (!product) continue;

        const variant = (product.variants || []).find(
          (entry) => normalize(entry.color) === normalize(item.color),
        );
        if (variant) {
          let stockItem = (variant.sizeStock || []).find(
            (entry) => normalize(entry.size) === normalize(item.size),
          );
          if (!stockItem) {
            if (!variant.sizeStock) variant.sizeStock = [];
            stockItem = { size: item.size, quantity: 0 };
            variant.sizeStock.push(stockItem);
          }
          stockItem.quantity =
            Number(stockItem.quantity || 0) + Number(item.quantity || 0);
        }

        product.salesCount = Math.max(
          0,
          Number(product.salesCount || 0) - Number(item.quantity || 0),
        );
        restoredProducts.set(key, product);
      }

      for (const product of restoredProducts.values()) {
        await product.save();
      }
    }

    order.status = status;
    if (!order.tracking) order.tracking = [];
    order.tracking.push({
      status,
      message: message || getDefaultTrackingMessage(status),
      timestamp: new Date(),
    });

    await order.save();

    if (status === "Cancelled" && order.couponCode) {
      await CouponUsage.findOneAndDelete({
        order: order._id,
        user: order.user,
        status: "Reserved",
      });
    }

    const populated = await Order.findById(order._id)
      .populate({
        path: "products.productId",
        select: "productName productPrice productImage variants",
      })
      .populate("user", "firstName lastName email phoneNo");

    return res.status(200).json({
      success: true,
      message: `Order moved to ${status}`,
      order: populated,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getDefaultTrackingMessage = (status) => {
  const messages = {
    "Order Placed": "Your payment was received and the order was placed.",
    Accepted: "Your order has been accepted by our team.",
    Processing: "Your order is being prepared.",
    "Ready for Dispatch": "Your order is packed and ready for dispatch.",
    Dispatched: "Your order has left our store.",
    "Out for Delivery": "Your order is with the delivery partner.",
    Delivered: "Your order has been delivered successfully.",
    Cancelled: "Your order has been cancelled.",
  };
  return messages[status] || "Order status updated.";
};

export const getSalesData = async (req, res) => {
  try {
    const paidMatch = { status: { $nin: ["Pending", "Failed", "Cancelled"] } };

    const salesData = await Order.aggregate([
      { $match: paidMatch },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$amount" },
          totalOrders: { $sum: 1 },
          totalProducts: {
            $sum: {
              $reduce: {
                input: "$products",
                initialValue: 0,
                in: { $add: ["$$value", "$$this.quantity"] },
              },
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const summary = await Order.aggregate([
      { $match: paidMatch },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$amount" },
          totalOrders: { $sum: 1 },
          totalProducts: {
            $sum: {
              $reduce: {
                input: "$products",
                initialValue: 0,
                in: { $add: ["$$value", "$$this.quantity"] },
              },
            },
          },
        },
      },
    ]);

    const data = summary[0] || {
      totalSales: 0,
      totalOrders: 0,
      totalProducts: 0,
    };
    return res
      .status(200)
      .json({ success: true, sales: salesData, salesData, ...data });
  } catch (error) {
    console.error("GET SALES DATA ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
