import React from "react";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/productSlice";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, loading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/add",
        {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log("Cart response:", res.data);

      if (res.data.success) {
        toast.success("Product Added to Cart");

        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log("Add to cart error:", error);

      toast.error(
        error.response?.data?.message || "Failed to add product to cart",
      );
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
        <div className="w-full aspect-square bg-gray-50">
          <Skeleton className="w-full h-full rounded-none" />
        </div>

        <div className="px-4 pt-4 pb-4 space-y-3">
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-2/3 h-5" />
          <Skeleton className="w-1/3 h-5" />
          <Skeleton className="w-full h-10 rounded-lg" />
        </div>
      </div>
    );
  }

  const { productImage, productPrice, productName } = product;

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Product Image */}
      <div className="w-full aspect-square overflow-hidden bg-gray-50">
        <img
          onClick={() => navigate(`/products/${product._id}`)}
          src={productImage?.[0]?.url}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
        />
      </div>

      {/* Product Details */}
      <div className="px-4 pt-4 pb-4">
        <h2 className="font-semibold font-serif text-lg leading-6 text-gray-800 line-clamp-2 min-h-[48px]">
          {productName}
        </h2>

        <p className="mt-2 font-semibold font-serif text-xl text-gray-900">
          ₹{productPrice}
        </p>

        <Button
          type="button"
          onClick={() => addToCart(product._id)}
          className="mt-3 bg-orange-600 hover:bg-orange-700 text-white w-full h-10 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
        >
          <ShoppingCart className="w-4 h-4" />
          Add To Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
