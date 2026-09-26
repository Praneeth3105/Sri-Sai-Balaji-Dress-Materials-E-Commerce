import mongoose from "mongoose";

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
        color: {
          type: String,
          default: "",
        },
        size: {
          type: String,
          default: "",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    amount: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
