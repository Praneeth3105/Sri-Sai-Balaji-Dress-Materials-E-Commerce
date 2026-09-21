import React, { useState } from "react";
import "react-medium-image-zoom/dist/styles.css";
import Zoom from "react-medium-image-zoom";

const ProductImg = ({ images = [] }) => {
  const [mainImg, setMainImg] = useState(images?.[0]?.url || "");

  if (!images || images.length === 0) {
    return (
      <div
        className="w-full min-h-[520px] rounded-[2rem] flex items-center justify-center"
        style={{
          backgroundColor: "#f4ede4",
          border: "1px solid #e7dccd",
        }}
      >
        <div className="text-center">
          <div
            className="text-4xl mb-3"
            style={{
              color: "#c8aa75",
              fontFamily: "Cormorant Garamond, serif",
            }}
          >
            ✦
          </div>

          <p
            className="text-sm"
            style={{
              color: "#927d6d",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            Product image unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-5 w-full items-start">
      {/* ==================================================
          THUMBNAILS
      ================================================== */}
      <div className="flex lg:flex-col gap-3 w-full lg:w-auto overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
        {images.map((img, index) => {
          const active = mainImg === img.url;

          return (
            <button
              key={index}
              type="button"
              onClick={() => setMainImg(img.url)}
              className="shrink-0 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
              style={{
                width: "76px",
                height: "88px",
                backgroundColor: "#f4ede4",
                border: active ? "1px solid #a47c43" : "1px solid #e2d7ca",
                padding: "3px",
                boxShadow: active ? "0 5px 15px rgba(164,124,67,0.14)" : "none",
              }}
            >
              <img
                src={img.url}
                alt={`Product thumbnail ${index + 1}`}
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-[1.03]"
              />
            </button>
          );
        })}
      </div>

      {/* ==================================================
          MAIN IMAGE
      ================================================== */}
      <div
        className="relative flex-1 w-full min-h-[500px] rounded-[2rem] flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #f6efe7 0%, #eee3d7 100%)",
          border: "1px solid #e6d9cb",
        }}
      >
        {/* Decorative circle */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full border pointer-events-none"
          style={{
            borderColor: "rgba(164,124,67,0.14)",
          }}
        />

        <div
          className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full border pointer-events-none"
          style={{
            borderColor: "rgba(164,124,67,0.10)",
          }}
        />

        {/* Product image */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-8 sm:p-12">
          <Zoom>
            <img
              src={mainImg}
              alt="Product"
              className="max-w-full max-h-[540px] w-auto h-auto object-contain cursor-zoom-in rounded-xl transition-transform duration-500"
            />
          </Zoom>
        </div>

        {/* Zoom hint */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-md"
          style={{
            backgroundColor: "rgba(255,253,249,0.78)",
            border: "1px solid rgba(164,124,67,0.18)",
            color: "#927d6d",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "9px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Click image to zoom
        </div>
      </div>
    </div>
  );
};

export default ProductImg;
