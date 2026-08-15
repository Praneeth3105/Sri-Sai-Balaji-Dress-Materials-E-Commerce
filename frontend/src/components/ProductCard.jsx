import React from "react";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const ProductCard = ({ product, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
        {/* Image Skeleton */}
        <div className="w-full aspect-square bg-gray-50">
          <Skeleton className="w-full h-full rounded-none" />
        </div>

        {/* Content Skeleton */}
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
          src={productImage?.[0]?.url}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

        <Button className="mt-3 bg-orange-600 hover:bg-orange-700 text-white w-full h-10 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200">
          <ShoppingCart className="w-4 h-4" />
          Add To Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
