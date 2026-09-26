import React, { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, ShieldCheck } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/productSlice";

const ProductDesc = ({
  product,
  variants = [],
  selectedVariant = null,
  onVariantChange,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const dispatch = useDispatch();

  const accessToken = localStorage.getItem("accessToken");

  const hasVariants = variants?.length > 0;

  const getSizeStock = (variant, size) => {
    const stock = variant?.sizeStock?.find(
      (item) =>
        String(item?.size || "")
          .trim()
          .toLowerCase() ===
        String(size || "")
          .trim()
          .toLowerCase(),
    );

    if (stock) return Math.max(0, Number(stock.quantity) || 0);

    // Backward compatibility for old products that have no sizeStock field.
    const exists = (variant?.sizes || []).some(
      (item) =>
        String(item).trim().toLowerCase() ===
        String(size || "")
          .trim()
          .toLowerCase(),
    );

    return exists ? 1 : 0;
  };

  const availableSizes = (selectedVariant?.sizes || []).filter(
    (size) => getSizeStock(selectedVariant, size) > 0,
  );

  const selectedStock = getSizeStock(selectedVariant, selectedSize);

  const variantHasStock = (variant) =>
    (variant?.sizes || []).some((size) => getSizeStock(variant, size) > 0);

  // When the color changes, reset the size because the previous size may
  // not exist for the newly selected color.
  useEffect(() => {
    setSelectedSize(availableSizes?.[0] || "");
  }, [selectedVariant?._id]);

  // ==================================================
  // QUANTITY
  // ==================================================
  const handleIncrease = () => {
    setQuantity((prev) => Math.min(prev + 1, Number(selectedStock || 0)));
  };

  useEffect(() => {
    const maxStock = Number(selectedStock || 0);

    if (maxStock <= 0) {
      setQuantity(1);
      return;
    }

    setQuantity((prev) => Math.min(Math.max(prev, 1), maxStock));
  }, [selectedStock]);

  const handleDecrease = () => {
    setQuantity((prev) => {
      if (prev <= 1) {
        return 1;
      }

      return prev - 1;
    });
  };

  // ==================================================
  // ADD TO CART
  // ==================================================
  const handleAddToCart = async () => {
    if (!product?._id) {
      toast.error("Product not found");
      return;
    }

    if (!accessToken) {
      toast.error("Please login first");
      return;
    }

    if (hasVariants && !selectedVariant) {
      toast.error("Please select a color");
      return;
    }

    if (hasVariants && availableSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (
      hasVariants &&
      availableSizes.length > 0 &&
      Number(selectedStock) <= 0
    ) {
      toast.error("This color and size is out of stock");
      return;
    }

    if (quantity > Number(selectedStock || 0)) {
      toast.error(
        `Only ${selectedStock} item${Number(selectedStock) === 1 ? "" : "s"} available`,
      );
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/cart/add`,
        {
          productId: product._id,
          color: selectedVariant?.color || "",
          size: selectedSize || "",
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

  // ==================================================
  // PRODUCT NOT FOUND
  // ==================================================
  if (!product) {
    return (
      <div
        className="py-10"
        style={{
          fontFamily: "DM Sans, sans-serif",
          color: "#8b7565",
        }}
      >
        Product not found
      </div>
    );
  }

  return (
    <div
      className="space-y-7"
      style={{
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* ==================================================
          BRAND LABEL
      ================================================== */}
      <div className="flex items-center gap-3">
        <span
          className="w-8 h-px"
          style={{
            backgroundColor: "#c8aa75",
          }}
        />

        <span
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{
            color: "#a47c43",
          }}
        >
          Sri Sai Balaji
        </span>
      </div>

      {/* ==================================================
          PRODUCT NAME
      ================================================== */}
      <div>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl leading-[0.95]"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 500,
            color: "#3d2c23",
          }}
        >
          {product.productName}
        </h1>
      </div>

      {/* ==================================================
          PRICE
      ================================================== */}
      <div
        className="pb-6 border-b"
        style={{
          borderColor: "#e5d9cc",
        }}
      >
        <p
          className="text-3xl sm:text-4xl"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 600,
            color: "#a47c43",
          }}
        >
          ₹{Number(product.productPrice || 0).toLocaleString("en-IN")}
        </p>

        <p
          className="mt-1 text-[10px] uppercase tracking-[0.15em]"
          style={{
            color: "#9b8878",
          }}
        >
          Inclusive of listed price
        </p>
      </div>

      {/* ==================================================
          COLOR SELECTION
      ================================================== */}
      {hasVariants && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-xl"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: 600,
                color: "#3d2c23",
              }}
            >
              Color
            </h2>

            <span
              className="text-[10px] uppercase tracking-[0.16em]"
              style={{
                color: "#9b8878",
              }}
            >
              {selectedVariant?.color || "Select color"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => {
              const selected = selectedVariant?._id === variant._id;
              const inStock = variantHasStock(variant);

              return (
                <button
                  key={variant._id || variant.color}
                  type="button"
                  disabled={loading || !inStock}
                  onClick={() => onVariantChange?.(variant)}
                  className="px-5 py-2.5 rounded-full border text-xs transition-all duration-200 cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundColor: selected ? "#3d2c23" : "#fffdf9",
                    color: selected
                      ? "#fffdf9"
                      : inStock
                        ? "#66584f"
                        : "#a9a09a",
                    borderColor: selected ? "#3d2c23" : "#ded1c2",
                    textDecoration: inStock ? "none" : "line-through",
                  }}
                >
                  {variant.color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================
          SIZE SELECTION
      ================================================== */}
      {hasVariants && availableSizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-xl"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: 600,
                color: "#3d2c23",
              }}
            >
              Size
            </h2>

            <span
              className="text-[10px] uppercase tracking-[0.16em]"
              style={{
                color: "#9b8878",
              }}
            >
              {selectedSize || "Select size"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {(selectedVariant?.sizes || []).map((size) => {
              const selected = selectedSize === size;
              const sizeStock = getSizeStock(selectedVariant, size);
              const inStock = sizeStock > 0;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={loading || !inStock}
                  onClick={() => setSelectedSize(size)}
                  className="min-w-[52px] px-4 py-2.5 rounded-full border text-xs transition-all duration-200 cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundColor: selected ? "#3d2c23" : "#fffdf9",
                    color: selected
                      ? "#fffdf9"
                      : inStock
                        ? "#66584f"
                        : "#a9a09a",
                    borderColor: selected ? "#3d2c23" : "#ded1c2",
                    textDecoration: inStock ? "none" : "line-through",
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================
          DESCRIPTION
      ================================================== */}
      {product.productDesc && (
        <div>
          <h2
            className="text-xl mb-3"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 600,
              color: "#3d2c23",
            }}
          >
            About this piece
          </h2>

          <p
            className="text-sm leading-7"
            style={{
              color: "#78675c",
            }}
          >
            {product.productDesc}
          </p>
        </div>
      )}

      {hasVariants && selectedSize && (
        <p className="text-xs" style={{ color: "#9b8878" }}>
          {Number(selectedStock) > 0
            ? `${selectedStock} item${Number(selectedStock) === 1 ? "" : "s"} available for ${selectedVariant?.color || "this color"} / ${selectedSize}`
            : "Out of stock for this color and size"}
        </p>
      )}

      {/* ==================================================
          QUANTITY
      ================================================== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-xl"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 600,
              color: "#3d2c23",
            }}
          >
            Quantity
          </h2>

          <span
            className="text-[10px] uppercase tracking-[0.16em]"
            style={{
              color: "#9b8878",
            }}
          >
            Select amount
          </span>
        </div>

        <div
          className="inline-flex items-center rounded-full p-1"
          style={{
            backgroundColor: "#f3ece3",
            border: "1px solid #e1d5c7",
          }}
        >
          <button
            type="button"
            disabled={quantity <= 1 || loading}
            onClick={handleDecrease}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
            style={{
              color: "#3d2c23",
            }}
            onMouseEnter={(e) => {
              if (quantity > 1 && !loading) {
                e.currentTarget.style.backgroundColor = "#fffdf9";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Minus size={16} strokeWidth={1.6} />
          </button>

          <span
            className="w-12 text-center text-base"
            style={{
              fontWeight: 500,
              color: "#3d2c23",
            }}
          >
            {quantity}
          </span>

          <button
            type="button"
            disabled={loading}
            onClick={handleIncrease}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{
              color: "#3d2c23",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#fffdf9";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Plus size={16} strokeWidth={1.6} />
          </button>
        </div>
      </div>

      {/* ==================================================
          ADD TO CART
      ================================================== */}
      <button
        type="button"
        disabled={loading}
        onClick={handleAddToCart}
        className="w-full h-14 rounded-full flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "#3d2c23",
          color: "#fffdf9",
          fontFamily: "DM Sans, sans-serif",
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = "#a47c43";
            e.currentTarget.style.boxShadow =
              "0 12px 25px rgba(164,124,67,0.20)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#3d2c23";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <ShoppingBag size={18} strokeWidth={1.6} />

        {loading
          ? "Adding..."
          : `Add ${quantity} ${quantity === 1 ? "Item" : "Items"} to Cart`}
      </button>

      {/* ==================================================
          SERVICE PROMISE
      ================================================== */}
      <div
        className="rounded-2xl p-5"
        style={{
          backgroundColor: "#f4ede4",
          border: "1px solid #e5d9cc",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "#eadbc9",
              color: "#a47c43",
            }}
          >
            <ShieldCheck size={17} strokeWidth={1.5} />
          </div>

          <div>
            <p
              className="text-sm font-medium"
              style={{
                color: "#3d2c23",
              }}
            >
              Shop with confidence
            </p>

            <p
              className="text-xs leading-5 mt-1"
              style={{
                color: "#806f61",
              }}
            >
              Carefully selected products with customer-focused service from Sri
              Sai Balaji Dress Materials.
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          SMALL DETAILS
      ================================================== */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <p
            className="text-[9px] uppercase tracking-[0.18em] mb-1"
            style={{
              color: "#a08d7d",
            }}
          >
            Collection
          </p>

          <p
            className="text-sm"
            style={{
              color: "#3d2c23",
            }}
          >
            Sri Sai Balaji
          </p>
        </div>

        <div>
          <p
            className="text-[9px] uppercase tracking-[0.18em] mb-1"
            style={{
              color: "#a08d7d",
            }}
          >
            Availability
          </p>

          <p
            className="text-sm"
            style={{
              color: "#3d2c23",
            }}
          >
            In Stock
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDesc;
