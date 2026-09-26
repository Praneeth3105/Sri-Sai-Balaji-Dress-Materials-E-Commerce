import mongoose from "mongoose";

const trackingEventSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    message: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const addressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    email: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        color: { type: String, default: "" },
        size: { type: String, default: "" },
        quantity: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: "" },
    amount: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    deliveryAddress: { type: addressSchema, default: null },
    status: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Order Placed",
        "Accepted",
        "Processing",
        "Ready for Dispatch",
        "Dispatched",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Failed",
      ],
      default: "Pending",
    },
    tracking: {
      type: [trackingEventSchema],
      default: [],
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
