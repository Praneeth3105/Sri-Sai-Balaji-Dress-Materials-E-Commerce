import mongoose from "mongoose";

const sizeStockSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    sizes: {
      type: [String],
      default: [],
    },
    sizeStock: {
      type: [sizeStockSchema],
      default: [],
    },
  },
  { _id: true },
);

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productName: { type: String, required: true },
    productDesc: { type: String, required: true },
    productImage: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    productPrice: { type: Number },
    category: { type: String },
    brand: { type: String },
    variants: {
      type: [variantSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
