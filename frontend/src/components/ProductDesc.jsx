import { setCart } from "@/redux/productSlice";
import { Button, Input } from "@base-ui/react";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const ProductDesc = ({ product }) => {
  const dispatch = useDispatch();

  const accessToken = localStorage.getItem("accessToken");

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/add",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log("Add cart response:", res.data);

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

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold font-serif text-4xl text-gray-600">
        {product.productName}
      </h1>

      <p className="text-gray-800 font-serif">
        {product.category} | {product.brand}
      </p>

      <h2 className="font-serif text-orange-500 font-bold text-2xl">
        ₹{product.productPrice}
      </h2>

      <p className="font-serif line-clamp-12 text-muted-foreground">
        {product.productDesc}
      </p>

      <div className="flex items-center gap-5 mt-5">
        {/* Quantity */}
        <div className="flex items-center gap-3">
          <p className="font-serif text-gray-800 font-semibold">Quantity:</p>

          <Input
            type="number"
            min="1"
            defaultValue={1}
            className="
              w-20
              h-12
              rounded-xl
              border border-gray-300
              text-center
              font-serif
              font-semibold
              text-gray-800
              shadow-sm
              focus:border-orange-500
              focus:ring-2
              focus:ring-orange-200
            "
          />
        </div>

        {/* Add To Cart */}
        <Button
          type="button"
          className="
            h-12
            px-8
            rounded-xl
            bg-orange-600
            hover:bg-orange-700
            text-white
            font-serif
            font-semibold
            text-base
            shadow-md
            hover:shadow-lg
            transition-all
            duration-200
            hover:-translate-y-0.5
          "
          onClick={() => addToCart(product._id)}
        >
          Add To Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductDesc;
