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

  // --------------------------------------------------
  // PRODUCT NOT FOUND
  // --------------------------------------------------
  if (!product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background: "linear-gradient(180deg, #fbf8f2 0%, #f7f1e8 100%)",
        }}
      >
        <div className="text-center">
          <div
            className="text-5xl mb-4"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              color: "#c8aa75",
            }}
          >
            ✦
          </div>

          <h1
            className="text-4xl mb-3"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              color: "#3d2c23",
            }}
          >
            Product Not Found
          </h1>

          <p
            className="text-sm"
            style={{
              fontFamily: "DM Sans, sans-serif",
              color: "#78675c",
            }}
          >
            The product you're looking for is unavailable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 pb-20"
      style={{
        background: "linear-gradient(180deg, #fbf8f2 0%, #f7f1e8 100%)",
      }}
    >
      {/* ==================================================
          MAIN CONTAINER
      ================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ==================================================
            BREADCRUMBS
        ================================================== */}
        <div className="mb-7">
          <Breadcrums product={product} />
        </div>

        {/* ==================================================
            PRODUCT AREA
        ================================================== */}
        <div
          className="relative overflow-hidden rounded-[2rem] p-5 sm:p-8 lg:p-10"
          style={{
            backgroundColor: "#fffdf9",
            border: "1px solid #e6dbcf",
            boxShadow: "0 20px 60px rgba(61,44,35,0.06)",
          }}
        >
          {/* Decorative background elements */}

          <div
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full border pointer-events-none"
            style={{
              borderColor: "rgba(164,124,67,0.10)",
            }}
          />

          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full border pointer-events-none"
            style={{
              borderColor: "rgba(164,124,67,0.07)",
            }}
          />

          {/* ==================================================
              PRODUCT GRID
          ================================================== */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-start">
            {/* ==================================================
                PRODUCT IMAGE
            ================================================== */}
            <div className="min-w-0">
              <ProductImg images={product?.productImage || []} />
            </div>

            {/* ==================================================
                PRODUCT DESCRIPTION
            ================================================== */}
            <div className="pt-2 lg:pt-6 min-w-0">
              <ProductDesc product={product} />
            </div>
          </div>
        </div>

        {/* ==================================================
            BOTTOM INFORMATION
        ================================================== */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Item 1 */}
          <div
            className="rounded-2xl px-6 py-5 text-center"
            style={{
              backgroundColor: "#f4ede4",
              border: "1px solid #e5d9cc",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.2em] mb-2"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: "#a47c43",
              }}
            >
              Carefully Selected
            </p>

            <p
              className="text-sm"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: "#5f4d40",
              }}
            >
              Quality products for you
            </p>
          </div>

          {/* Item 2 */}
          <div
            className="rounded-2xl px-6 py-5 text-center"
            style={{
              backgroundColor: "#f4ede4",
              border: "1px solid #e5d9cc",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.2em] mb-2"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: "#a47c43",
              }}
            >
              Easy Shopping
            </p>

            <p
              className="text-sm"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: "#5f4d40",
              }}
            >
              Simple & secure ordering
            </p>
          </div>

          {/* Item 3 */}
          <div
            className="rounded-2xl px-6 py-5 text-center"
            style={{
              backgroundColor: "#f4ede4",
              border: "1px solid #e5d9cc",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.2em] mb-2"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: "#a47c43",
              }}
            >
              Sri Sai Balaji
            </p>

            <p
              className="text-sm"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: "#5f4d40",
              }}
            >
              Style with a personal touch
            </p>
          </div>
        </div>

        {/* ==================================================
            EDITORIAL FOOTER MESSAGE
        ================================================== */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span
              className="w-12 h-px"
              style={{
                backgroundColor: "#c8aa75",
              }}
            />

            <span
              style={{
                color: "#a47c43",
                fontSize: "14px",
              }}
            >
              ✦
            </span>

            <span
              className="w-12 h-px"
              style={{
                backgroundColor: "#c8aa75",
              }}
            />
          </div>

          <p
            className="text-sm italic"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "18px",
              color: "#78675c",
            }}
          >
            Style that feels like you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
