import razorpayInstance from "../Config/razorpay.js";
import { Order } from "../models/OrderModel.js";
import crypto from "crypto";
import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

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

    if (!product) {
      throw new Error("One of the selected products is no longer available");
    }

    if (!product.variants?.length) continue;

    const variant = product.variants.find(
      (entry) => normalize(entry.color) === normalize(item.color),
    );

    if (!variant) {
      throw new Error(`Color ${item.color || ""} is no longer available`);
    }

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

    await validateOrderStock(products);

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

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification data is missing",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    console.log("Expected Signature:", expectedSignature);
    console.log("Received Signature:", razorpay_signature);

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

    const existingOrder = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user: userId,
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Prevent repeated Razorpay callbacks from reducing stock twice.
    if (existingOrder.status === "Paid") {
      return res.status(200).json({
        success: true,
        message: "Payment Already Verified",
        order: existingOrder,
      });
    }

    const productsToSave = new Map();

    // Validate and reduce each purchased variant in memory first.
    for (const orderItem of existingOrder.products) {
      const product = await Product.findById(orderItem.productId);

      if (!product || !product.variants?.length) {
        continue;
      }

      const variant = product.variants.find(
        (item) =>
          String(item.color || "")
            .trim()
            .toLowerCase() ===
          String(orderItem.color || "")
            .trim()
            .toLowerCase(),
      );

      if (!variant) {
        throw new Error(
          `Color ${orderItem.color || ""} is no longer available`,
        );
      }

      let stockItem = variant.sizeStock?.find(
        (item) =>
          String(item.size || "")
            .trim()
            .toLowerCase() ===
          String(orderItem.size || "")
            .trim()
            .toLowerCase(),
      );

      // Backward compatibility: older products had sizes but no stock field.
      // Treat the old record as one available unit and create the stock entry.
      if (!stockItem) {
        const sizeExists = (variant.sizes || []).some(
          (size) =>
            String(size).trim().toLowerCase() ===
            String(orderItem.size || "")
              .trim()
              .toLowerCase(),
        );

        if (!sizeExists) {
          throw new Error(
            `Size ${orderItem.size || ""} is no longer available for ${variant.color}`,
          );
        }

        if (!variant.sizeStock) {
          variant.sizeStock = [];
        }

        stockItem = {
          size: orderItem.size,
          quantity: 1,
        };

        variant.sizeStock.push(stockItem);
      }

      if (Number(stockItem.quantity) < Number(orderItem.quantity)) {
        throw new Error(
          `Only ${stockItem.quantity} item${Number(stockItem.quantity) === 1 ? "" : "s"} available for ${variant.color} / ${orderItem.size}`,
        );
      }

      stockItem.quantity =
        Number(stockItem.quantity) - Number(orderItem.quantity);

      productsToSave.set(String(product._id), product);
    }

    for (const product of productsToSave.values()) {
      await product.save();
    }

    const order = await Order.findOneAndUpdate(
      {
        _id: existingOrder._id,
        status: "Pending",
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

export const getMyOrder = async (req, res) => {
  try {
    const userId = req.id;

    const orders = await Order.find({
      user: userId,
    })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImage variants",
      })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("❌ Error Fetching User Orders:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const orders = await Order.find({
      user: userId,
    })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImage variants",
      })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error Fetching User Orders:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email")
      .populate({
        path: "products.productId",
        select: "productName productPrice productImage variants",
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error Fetching All Orders:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to Fetch All Orders",
      error: error.message,
    });
  }
};

export const getSalesData = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $match: {
          status: "Paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          totalSales: {
            $sum: "$amount",
          },

          totalOrders: {
            $sum: 1,
          },

          totalProducts: {
            $sum: {
              $reduce: {
                input: "$products",
                initialValue: 0,
                in: {
                  $add: ["$$value", "$$this.quantity"],
                },
              },
            },
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const summary = await Order.aggregate([
      {
        $match: {
          status: "Paid",
        },
      },
      {
        $group: {
          _id: null,

          totalSales: {
            $sum: "$amount",
          },

          totalOrders: {
            $sum: 1,
          },

          totalProducts: {
            $sum: {
              $reduce: {
                input: "$products",
                initialValue: 0,
                in: {
                  $add: ["$$value", "$$this.quantity"],
                },
              },
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,

      salesData,

      summary: summary[0] || {
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
      },
    });
  } catch (error) {
    console.error("GET SALES DATA ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
