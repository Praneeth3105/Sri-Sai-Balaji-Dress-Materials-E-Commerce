import razorpayInstance from "../Config/razorpay.js";
import { Order } from "../models/OrderModel.js";
import crypto from "crypto";
import { Cart } from "../models/cartModel.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.id;

    const { products, amount, tax, shipping, currency } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products found",
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    console.log("Razorpay Order Created:", razorpayOrder.id);

    const newOrder = new Order({
      user: userId,
      products,
      amount: Number(amount),
      tax: Number(tax || 0),
      shipping: Number(shipping || 0),
      currency: currency || "INR",
      status: "Pending",
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    return res.status(200).json({
      success: true,
      message: "Order Created Successfully",
      order: razorpayOrder,
      dbOrder: newOrder,
    });
  } catch (error) {
    console.error("❌ Error in Create Order:", error);

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

    console.log("========== PAYMENT VERIFICATION ==========");
    console.log("User ID:", userId);
    console.log("Order ID:", razorpay_order_id);
    console.log("Payment ID:", razorpay_payment_id);
    console.log("Signature received:", razorpay_signature);

    // ==========================================
    // PAYMENT FAILED / CANCELLED
    // ==========================================

    if (paymentFailed) {
      const order = await Order.findOneAndUpdate(
        {
          razorpayOrderId: razorpay_order_id,
          user: userId,
        },
        {
          status: "Failed",
        },
        {
          new: true,
        },
      );

      return res.status(400).json({
        success: false,
        message: "Payment Failed",
        order,
      });
    }

    // ==========================================
    // CHECK PAYMENT DATA
    // ==========================================

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is missing",
      });
    }

    // ==========================================
    // CREATE SIGNATURE
    // ==========================================

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

    // ==========================================
    // VERIFY SIGNATURE
    // ==========================================

    if (expectedSignature !== razorpay_signature) {
      console.log("❌ INVALID RAZORPAY SIGNATURE");

      await Order.findOneAndUpdate(
        {
          razorpayOrderId: razorpay_order_id,
          user: userId,
        },
        {
          status: "Failed",
        },
        {
          new: true,
        },
      );

      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }

    console.log("✅ RAZORPAY SIGNATURE VERIFIED");

    // ==========================================
    // UPDATE ORDER AS PAID
    // ==========================================

    const order = await Order.findOneAndUpdate(
      {
        razorpayOrderId: razorpay_order_id,
        user: userId,
      },
      {
        status: "Paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      {
        new: true,
      },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==========================================
    // CLEAR USER CART
    // ==========================================

    await Cart.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $set: {
          items: [],
          totalPrice: 0,
        },
      },
    );

    console.log("✅ Cart cleared");
    console.log("✅ Order marked as Paid");

    return res.status(200).json({
      success: true,
      message: "Payment Successful",
      order,
    });
  } catch (error) {
    console.error("❌ ERROR IN VERIFY PAYMENT:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
