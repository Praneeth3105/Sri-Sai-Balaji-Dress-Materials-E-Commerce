import React from "react";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
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

  // ==================================================
  // ADD TO CART
  // ==================================================
  const addToCart = async (productId) => {
    if (!accessToken) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/cart/add`,
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Cart response:", res.data);

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("Product Added to Cart");
      }
    } catch (error) {
      console.log("Add to cart error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to add product to cart",
      );
    }
  };

  // ==================================================
  // LOADING SKELETON
  // ==================================================
  if (loading) {
    return (
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          backgroundColor: "#fffdf9",
          border: "1px solid #e8ded2",
        }}
      >
        <div className="aspect-[4/5] overflow-hidden">
          <Skeleton className="w-full h-full rounded-none bg-[#eee7df]" />
        </div>

        <div className="p-5 space-y-4">
          <Skeleton className="w-3/4 h-4 bg-[#eee7df]" />
          <Skeleton className="w-full h-6 bg-[#eee7df]" />
          <Skeleton className="w-1/3 h-6 bg-[#eee7df]" />
          <Skeleton className="w-full h-11 rounded-full bg-[#eee7df]" />
        </div>
      </div>
    );
  }

  const { productImage, productPrice, productName } = product;

  const imageUrl = productImage?.[0]?.url;

  return (
    <article
      className="group relative overflow-hidden rounded-2xl transition-all duration-500"
      style={{
        backgroundColor: "#fffdf9",
        border: "1px solid #e8ded2",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#d7c3aa";
        e.currentTarget.style.boxShadow = "0 20px 45px rgba(61,44,35,0.10)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e8ded2";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* ==================================================
          PRODUCT IMAGE
      ================================================== */}
      <div
        className="relative aspect-[4/5] overflow-hidden cursor-pointer"
        onClick={() => navigate(`/products/${product._id}`)}
        style={{
          backgroundColor: "#f4ede4",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span
              style={{
                fontFamily: "Cormorant Garamond, serif",
                color: "#a47c43",
              }}
            >
              No Image
            </span>
          </div>
        )}

        {/* Image overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(61,44,35,0.20), transparent 50%)",
          }}
        />

        {/* View Details */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div
            className="px-5 py-2.5 rounded-full whitespace-nowrap backdrop-blur-md"
            style={{
              backgroundColor: "rgba(255,253,249,0.94)",
              color: "#3d2c23",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "9px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            View Details
          </div>
        </div>

        {/* Top-right view icon */}
        <button
          type="button"
          aria-label="View product"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${product._id}`);
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: "rgba(255,253,249,0.94)",
            color: "#3d2c23",
          }}
        >
          <ArrowUpRight size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* ==================================================
          PRODUCT DETAILS
      ================================================== */}
      <div className="px-5 pt-5 pb-5">
        {/* Collection */}
        <p
          className="mb-2 text-[9px] uppercase tracking-[0.22em]"
          style={{
            fontFamily: "DM Sans, sans-serif",
            color: "#a47c43",
          }}
        >
          Sri Sai Balaji
        </p>

        {/* Product Name */}
        <h2
          onClick={() => navigate(`/products/${product._id}`)}
          className="text-[20px] leading-[1.08] cursor-pointer line-clamp-2 min-h-[44px] transition-colors duration-300"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 600,
            color: "#3d2c23",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#a47c43";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#3d2c23";
          }}
        >
          {productName}
        </h2>

        {/* Price */}
        <div className="flex items-end justify-between mt-4">
          <div>
            <p
              className="text-[9px] uppercase tracking-[0.16em] mb-1"
              style={{
                fontFamily: "DM Sans, sans-serif",
                color: "#927d6d",
              }}
            >
              Price
            </p>

            <p
              className="text-[23px] leading-none"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: 600,
                color: "#3d2c23",
              }}
            >
              ₹{Number(productPrice).toLocaleString("en-IN")}
            </p>
          </div>

          <span
            className="w-8 h-px mb-1.5"
            style={{
              backgroundColor: "#c8aa75",
            }}
          />
        </div>

        {/* ==================================================
            ADD TO CART
        ================================================== */}
        <button
          type="button"
          onClick={() => addToCart(product._id)}
          className="mt-5 w-full h-11 rounded-full flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
          style={{
            backgroundColor: "#3d2c23",
            color: "#fffdf9",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#a47c43";

            e.currentTarget.style.boxShadow =
              "0 8px 20px rgba(164,124,67,0.20)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#3d2c23";

            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <ShoppingBag size={15} strokeWidth={1.6} />
          Add to Cart
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
