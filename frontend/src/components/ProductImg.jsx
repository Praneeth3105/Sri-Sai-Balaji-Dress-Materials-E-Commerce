import React, { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ProductImg = ({ images = [] }) => {
  const [mainImg, setMainImg] = useState(images?.[0]?.url || "");
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setMainImg(images?.[0]?.url || "");
    setIsZoomed(false);
  }, [images]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

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
      {/* THUMBNAILS */}
      <div className="flex lg:flex-col gap-3 w-full lg:w-auto overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
        {images.map((img, index) => {
          const active = mainImg === img.url;

          return (
            <button
              key={index}
              type="button"
              onClick={() => {
                setMainImg(img.url);
                setIsZoomed(false);
                setPosition({ x: 50, y: 50 });
              }}
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

      {/* MAIN IMAGE */}
      <div
        className="relative flex-1 w-full min-h-[500px] rounded-[2rem] flex items-center justify-center"
        style={{
          background: "linear-gradient(145deg, #f6efe7 0%, #eee3d7 100%)",
          border: "1px solid #e6d9cb",
        }}
      >
        {/* DECORATIVE CIRCLES */}
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

        {/* DESKTOP HOVER ZOOM */}
        <div
          className="hidden lg:flex relative z-10 w-full h-[540px] items-center justify-center p-8 overflow-hidden"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => {
            setIsZoomed(false);
            setPosition({ x: 50, y: 50 });
          }}
          onMouseMove={handleMouseMove}
          style={{
            cursor: isZoomed ? "zoom-out" : "zoom-in",
          }}
        >
          <img
            src={mainImg}
            alt="Product"
            className="block w-full h-full object-contain rounded-xl"
            style={{
              transform: isZoomed ? "scale(2)" : "scale(1)",
              transformOrigin: `${position.x}% ${position.y}%`,
              transition: isZoomed
                ? "transform 0.15s ease-out"
                : "transform 0.3s ease-out",
            }}
          />
        </div>

        {/* MOBILE CLICK ZOOM */}
        <div className="flex lg:hidden relative z-10 w-full items-center justify-center p-6">
          <Zoom
            zoomMargin={20}
            zoomImg={{
              src: mainImg,
              alt: "Zoomed product image",
            }}
          >
            <img
              src={mainImg}
              alt="Product"
              className="block max-w-full max-h-[540px] w-auto h-auto object-contain rounded-xl cursor-zoom-in"
            />
          </Zoom>
        </div>

        {/* ZOOM HINT */}
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full backdrop-blur-md pointer-events-none"
          style={{
            backgroundColor: "rgba(255,253,249,0.78)",
            border: "1px solid rgba(164,124,67,0.18)",
            color: "#927d6d",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "9px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <span className="hidden lg:inline">Move mouse to zoom</span>

          <span className="inline lg:hidden">Click image to zoom</span>
        </div>
      </div>
    </div>
  );
};

export default ProductImg;
