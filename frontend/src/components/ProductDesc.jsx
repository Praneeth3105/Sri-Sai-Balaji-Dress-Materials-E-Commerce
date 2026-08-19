import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/productSlice";

const ProductDesc = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const accessToken = localStorage.getItem("accessToken");

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => {
      if (prev <= 1) {
        return 1;
      }

      return prev - 1;
    });
  };

  const handleAddToCart = async () => {
    if (!product?._id) {
      toast.error("Product not found");
      return;
    }

    if (!accessToken) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/cart/add`,
        {
          productId: product._id,

          // IMPORTANT
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.success) {
        dispatch(setCart(res.data.cart));

        toast.success(
          `${quantity} ${quantity === 1 ? "item" : "items"} added to cart`,
        );

        // Reset selected quantity after adding
        setQuantity(1);
      }
    } catch (error) {
      console.log("ADD CART ERROR:", error);

      toast.error(
        error?.response?.data?.message || "Failed to add product to cart",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <div className="text-red-500 font-serif">Product not found</div>;
  }

  return (
    <div className="space-y-6 font-serif">
      {/* Product Name */}

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          {product.productName}
        </h1>
      </div>

      {/* Price */}

      <div>
        <p className="text-3xl font-bold text-orange-600">
          ₹{product.productPrice?.toLocaleString("en-IN")}
        </p>
      </div>

      {/* Description */}

      {product.description && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>

          <p className="text-gray-600 leading-7">{product.description}</p>
        </div>
      )}

      {/* Quantity */}

      <div>
        <h2 className="text-lg font-semibold mb-3">Quantity</h2>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={quantity <= 1 || loading}
            onClick={handleDecrease}
            className="w-10 h-10 cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <span className="text-xl font-semibold w-8 text-center">
            {quantity}
          </span>

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleIncrease}
            className="w-10 h-10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Add To Cart */}

      <Button
        type="button"
        disabled={loading}
        onClick={handleAddToCart}
        className="w-full sm:w-auto h-12 px-8 bg-orange-600 hover:bg-orange-700 text-white font-semibold cursor-pointer"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />

        {loading
          ? "Adding..."
          : `Add ${quantity} ${quantity === 1 ? "Item" : "Items"} to Cart`}
      </Button>
    </div>
  );
};

export default ProductDesc;
