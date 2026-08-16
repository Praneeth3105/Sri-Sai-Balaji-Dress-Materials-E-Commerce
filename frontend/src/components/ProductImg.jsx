import React, { useState } from "react";
import "react-medium-image-zoom/dist/styles.css";
import Zoom from "react-medium-image-zoom";

const ProductImg = ({ images }) => {
  const [mainImg, setMainImg] = useState(images[0].url);

  return (
    <div className="flex gap-6 w-full items-start">
      {/* Thumbnail Images */}
      <div className="flex flex-col gap-4">
        {images.map((img, index) => {
          return (
            <img
              key={index}
              onClick={() => setMainImg(img.url)}
              src={img.url}
              alt=""
              className={`
                cursor-pointer
                w-20 h-20
                object-cover
                rounded-xl
                border-2
                p-1
                shadow-sm
                transition-all duration-300
                hover:scale-105
                hover:shadow-md
                ${
                  mainImg === img.url
                    ? "border-orange-500 shadow-orange-200"
                    : "border-gray-200"
                }
              `}
            />
          );
        })}
      </div>

      {/* Main Image */}
      <div
        className="
          flex-1
          min-h-[420px]
          rounded-2xl
          bg-gray-50
          flex
          items-center
          justify-center
          p-6
          border border-gray-100
          shadow-sm
          hover:shadow-lg
          transition-shadow duration-300
        "
      >
        <Zoom>
          <img
            src={mainImg}
            alt="Product"
            className="
              w-full
              max-w-[500px]
              h-[420px]
              object-contain
              cursor-zoom-in
              rounded-xl
              transition-transform
              duration-300
            "
          />
        </Zoom>
      </div>
    </div>
  );
};

export default ProductImg;
