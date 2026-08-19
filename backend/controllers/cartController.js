import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.id;

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    // If user doesn't have a cart
    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
          totalPrice: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log("GET CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.id;

    const { productId, quantity } = req.body;


    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }
    const selectedQuantity = Number(quantity) || 1;

    if (selectedQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,

        items: [
          {
            productId: productId,
            quantity: selectedQuantity,
            price: product.productPrice,
          },
        ],

        totalPrice: product.productPrice * selectedQuantity,
      });
    }

    else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId.toString(),
      );

      if (itemIndex !== -1) {
        cart.items[itemIndex].quantity += selectedQuantity;
      }

      else {
        cart.items.push({
          productId: productId,
          quantity: selectedQuantity,
          price: product.productPrice,
        });
      }

      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );

    return res.status(200).json({
      success: true,
      message: "Product Added to Cart Successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.log("ADD TO CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateQuantity = async (req, res) => {
  try {
    const userId = req.id;

    const { productId, type } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart Not Found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId.toString(),
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item Not Found",
      });
    }

    if (type === "increase") {
      item.quantity += 1;
    }

    if (type === "decrease") {
      if (item.quantity > 1) {
        item.quantity -= 1;
      }
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );

    return res.status(200).json({
      success: true,
      message: "Cart Updated Successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.log("UPDATE CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;

    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart Not Found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString(),
    );

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId",
    );

    return res.status(200).json({
      success: true,
      message: "Product Removed From Cart",
      cart: populatedCart,
    });
  } catch (error) {
    console.log("REMOVE CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
