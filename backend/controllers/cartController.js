import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const findVariant = (product, color) => {
  if (!product?.variants?.length) return null;

  return product.variants.find(
    (variant) => normalize(variant.color) === normalize(color),
  );
};

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

export const getCart = async (req, res) => {
  try {
    const userId = req.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

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

    const { productId, quantity, color, size } = req.body;

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

    let selectedColor = String(color || "").trim();
    let selectedSize = String(size || "").trim();

    // New variant products must select a valid color.
    if (product.variants?.length > 0) {
      if (!selectedColor) {
        return res.status(400).json({
          success: false,
          message: "Please select a color",
        });
      }

      const variant = findVariant(product, selectedColor);

      if (!variant) {
        return res.status(400).json({
          success: false,
          message: "Selected color is not available",
        });
      }

      selectedColor = variant.color;

      // If the color has sizes, the customer must select one.
      if (variant.sizes?.length > 0) {
        if (!selectedSize) {
          return res.status(400).json({
            success: false,
            message: "Please select a size",
          });
        }

        const sizeExists = variant.sizes.some(
          (item) => normalize(item) === normalize(selectedSize),
        );

        if (!sizeExists) {
          return res.status(400).json({
            success: false,
            message: "Selected size is not available for this color",
          });
        }

        selectedSize = variant.sizes.find(
          (item) => normalize(item) === normalize(selectedSize),
        );

        const availableStock = getVariantStock(variant, selectedSize);

        if (availableStock <= 0) {
          return res.status(400).json({
            success: false,
            message: `This color and size is out of stock`,
          });
        }

        if (selectedQuantity > availableStock) {
          return res.status(400).json({
            success: false,
            message: `Only ${availableStock} item${availableStock === 1 ? "" : "s"} available for ${selectedColor} / ${selectedSize}`,
          });
        }
      } else {
        selectedSize = "";
      }
    } else {
      // Old products without variants remain compatible.
      selectedColor = "";
      selectedSize = "";
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            color: selectedColor,
            size: selectedSize,
            quantity: selectedQuantity,
            price: product.productPrice,
          },
        ],
        totalPrice: Number(product.productPrice || 0) * selectedQuantity,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId.toString() &&
          normalize(item.color) === normalize(selectedColor) &&
          normalize(item.size) === normalize(selectedSize),
      );

      if (itemIndex !== -1) {
        cart.items[itemIndex].quantity += selectedQuantity;
      } else {
        cart.items.push({
          productId,
          color: selectedColor,
          size: selectedSize,
          quantity: selectedQuantity,
          price: product.productPrice,
        });
      }

      cart.totalPrice = cart.items.reduce(
        (total, item) =>
          total + Number(item.price || 0) * Number(item.quantity || 0),
        0,
      );
    }

    if (product.variants?.length > 0 && selectedSize) {
      const variant = findVariant(product, selectedColor);
      const availableStock = getVariantStock(variant, selectedSize);
      const cartItem = cart.items.find(
        (item) =>
          item.productId.toString() === productId.toString() &&
          normalize(item.color) === normalize(selectedColor) &&
          normalize(item.size) === normalize(selectedSize),
      );

      if (Number(cartItem?.quantity || 0) > availableStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableStock} item${availableStock === 1 ? "" : "s"} available for ${selectedColor} / ${selectedSize}`,
        });
      }
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
    const { productId, color, size, type } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart Not Found",
      });
    }

    const item = cart.items.find(
      (cartItem) =>
        cartItem.productId.toString() === productId?.toString() &&
        normalize(cartItem.color) === normalize(color) &&
        normalize(cartItem.size) === normalize(size),
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item Not Found",
      });
    }

    if (type === "increase") {
      const product = await Product.findById(productId);

      if (product?.variants?.length > 0 && item.size) {
        const variant = findVariant(product, item.color);
        const availableStock = getVariantStock(variant, item.size);

        if (item.quantity >= availableStock) {
          return res.status(400).json({
            success: false,
            message: `Only ${availableStock} item${availableStock === 1 ? "" : "s"} available for ${item.color} / ${item.size}`,
          });
        }
      }

      item.quantity += 1;
    }

    if (type === "decrease" && item.quantity > 1) {
      item.quantity -= 1;
    }

    cart.totalPrice = cart.items.reduce(
      (total, cartItem) =>
        total + Number(cartItem.price || 0) * Number(cartItem.quantity || 0),
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
    const { productId, color, size } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart Not Found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === productId?.toString() &&
          normalize(item.color) === normalize(color) &&
          normalize(item.size) === normalize(size)
        ),
    );

    cart.totalPrice = cart.items.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.quantity || 0),
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
