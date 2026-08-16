import Breadcrums from "@/components/Breadcrums";
import ProductDesc from "@/components/ProductDesc";
import ProductImg from "@/components/ProductImg";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
  const params = useParams();
  const productId = params.id;

  const { products } = useSelector((store) => store.product);

  const product = products.find((item) => item._id === productId);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Breadcrums product={product} />
      </div>

      {/* Product Section */}
      <div
        className="
          mt-6
          grid grid-cols-1 lg:grid-cols-2
          gap-10 lg:gap-16
          items-start
          bg-white
          rounded-3xl
          p-5 sm:p-8 lg:p-10
          shadow-[0_10px_40px_rgba(0,0,0,0.08)]
          border border-gray-100
        "
      >
        {/* Product Image */}
        <div
          className="
            rounded-2xl
            bg-gray-50
            p-5
            flex
            items-center
            justify-center
            min-h-[400px]
            hover:shadow-md
            transition-all
            duration-300
          "
        >
          <ProductImg images={product?.productImage} />
        </div>

        {/* Product Details */}
        <div className="pt-2 lg:pt-5">
          <ProductDesc product={product} />
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
