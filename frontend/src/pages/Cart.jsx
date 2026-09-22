import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Tag,
} from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { setCart } from "@/redux/productSlice";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const API = `${import.meta.env.VITE_URL}/api/v1/cart`;
  const subtotal = Number(cart?.totalPrice || 0);
  const shipping = subtotal > 299 ? 0 : 10;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;


  const loadCart = async () => {
    if (!accessToken) {
      return;
    }

    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log("LOAD CART ERROR:", error);
    }
  };

  // =========================================================
  // UPDATE QUANTITY
  // =========================================================

  const handleUpdateQuantity = async (productId, type) => {
    if (!accessToken) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.put(
        `${API}/update`,
        {
          productId,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log("UPDATE CART ERROR:", error);

      toast.error(error?.response?.data?.message || "Unable to update cart");
    }
  };

  // =========================================================
  // REMOVE PRODUCT
  // =========================================================

  const handleRemove = async (productId) => {
    if (!accessToken) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          productId,
        },
      });

      if (res.data.success) {
        dispatch(setCart(res.data.cart));

        toast.success("Product removed from cart");
      }
    } catch (error) {
      console.log("REMOVE CART ERROR:", error);

      toast.error(error?.response?.data?.message || "Unable to remove product");
    }
  };

  // =========================================================
  // LOAD CART ON PAGE LOAD
  // =========================================================

  useEffect(() => {
    loadCart();
  }, []);

  // =========================================================
  // EMPTY CART
  // =========================================================

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] text-[#3d3028] pt-20">
        {/* Decorative background */}
        <div className="relative overflow-hidden">
          <div className="absolute -top-32 -left-24 w-80 h-80 rounded-full bg-[#ead8bd]/40 blur-3xl" />

          <div className="absolute top-10 -right-28 w-80 h-80 rounded-full bg-[#ead6d0]/30 blur-3xl" />

          <div className="relative min-h-[75vh] flex items-center justify-center px-6">
            <div className="text-center max-w-lg">
              {/* Icon */}
              <div className="relative mx-auto w-28 h-28 mb-8">
                <div className="absolute inset-0 rounded-full border border-[#cbb28d]/50" />

                <div className="absolute inset-3 rounded-full bg-[#eee5da] flex items-center justify-center">
                  <ShoppingBag
                    className="w-10 h-10 text-[#9a784e]"
                    strokeWidth={1.3}
                  />
                </div>
              </div>

              {/* Heading */}
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#a78352] font-semibold mb-3">
                Your Collection
              </p>

              <h1 className="font-[Cormorant_Garamond] text-5xl md:text-6xl text-[#3d2f27] leading-none">
                Your Cart Is
                <span className="block italic text-[#a78352]">Waiting</span>
              </h1>

              <div className="w-12 h-px bg-[#b99a6b] mx-auto my-6" />

              <p className="text-sm md:text-base leading-7 text-[#7b6d64]">
                Your shopping bag is currently empty. Explore our collection and
                discover something beautiful for your wardrobe.
              </p>

              <Button
                onClick={() => navigate("/products")}
                className="mt-8 h-12 rounded-full bg-[#4a382c] hover:bg-[#35271f] text-white px-8 cursor-pointer shadow-lg shadow-[#4a382c]/10"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Explore Collection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="font-[Cormorant_Garamond] italic text-lg text-[#9a784e] mt-8">
                Style that feels like you.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN CART
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#3d3028] pt-20">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <section className="relative overflow-hidden px-6 pt-12 pb-12 md:pt-16 md:pb-16">
        <div className="absolute -top-28 -left-24 w-72 h-72 rounded-full bg-[#ead8bd]/40 blur-3xl" />

        <div className="absolute top-10 -right-28 w-80 h-80 rounded-full bg-[#ead6d0]/30 blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#a78352] font-semibold mb-3">
            Your Selection
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <h1 className="font-[Cormorant_Garamond] text-5xl md:text-6xl text-[#382b24] leading-none">
                Shopping
                <span className="italic text-[#a78352]"> Bag</span>
              </h1>

              <div className="w-12 h-px bg-[#b99a6b] mt-5 mb-4" />

              <p className="text-sm text-[#7b6d64]">
                Review your selected pieces before checking out.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#88786d]">
              <ShoppingBag className="w-4 h-4 text-[#a78352]" />
              {cart?.items?.length || 0}{" "}
              {cart?.items?.length === 1 ? "Item" : "Items"}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CART CONTENT
      ====================================================== */}

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_390px] gap-8 items-start">
          {/* =================================================
              PRODUCTS
          ================================================== */}

          <div className="space-y-4">
            {cart?.items?.map((item, index) => {
              const product = item?.productId;

              const productPrice = Number(product?.productPrice || 0);

              const quantity = Number(item?.quantity || 0);

              const itemTotal = productPrice * quantity;

              return (
                <div
                  key={item?._id || index}
                  className="group bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Product Image */}
                    <Link
                      to={`/product/${product?._id}`}
                      className="block flex-shrink-0"
                    >
                      <div className="w-full sm:w-32 h-36 sm:h-36 rounded-xl overflow-hidden bg-[#eee5da]">
                        <img
                          src={
                            product?.productImage?.[0]?.url || "/Profile.png"
                          }
                          alt={product?.productName || "Product"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    {/* Product Information */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.25em] text-[#a78352] font-semibold mb-1">
                          Sri Sai Balaji
                        </p>

                        <Link
                          to={`/product/${product?._id}`}
                          className="font-[Cormorant_Garamond] text-2xl text-[#44352c] hover:text-[#9a784e] transition-colors"
                        >
                          {product?.productName || "Product"}
                        </Link>

                        <p className="text-sm text-[#7b6d64] mt-1">
                          ₹{productPrice.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Quantity + Remove */}
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
                        {/* Quantity */}
                        <div className="inline-flex items-center border border-[#ded1c2] rounded-full bg-[#faf7f2] overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(product?._id, "decrease")
                            }
                            disabled={quantity <= 1}
                            className="w-9 h-9 flex items-center justify-center text-[#6f5b4c] hover:bg-[#eee5da] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="w-9 text-center text-sm font-medium text-[#44352c]">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(product?._id, "increase")
                            }
                            className="w-9 h-9 flex items-center justify-center text-[#6f5b4c] hover:bg-[#eee5da] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemove(product?._id)}
                          className="inline-flex items-center gap-1.5 text-xs text-[#98736b] hover:text-[#7d4037] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="sm:w-28 flex sm:flex-col sm:items-end justify-between sm:justify-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-[#9a8b81]">
                        Total
                      </span>

                      <p className="font-[Cormorant_Garamond] text-2xl text-[#9a784e]">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping */}
            <div className="pt-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm text-[#80644a] hover:text-[#4a382c] transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================== */}

          <div className="lg:sticky lg:top-28">
            <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] overflow-hidden shadow-sm">
              {/* Summary Header */}
              <div className="bg-[#eee5da] px-6 py-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold mb-2">
                  Your Order
                </p>

                <h2 className="font-[Cormorant_Garamond] text-3xl text-[#44352c]">
                  Order Summary
                </h2>
              </div>

              <div className="p-6">
                {/* Price Breakdown */}
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[#75675e]">
                      Subtotal ({cart?.items?.length || 0}{" "}
                      {cart?.items?.length === 1 ? "item" : "items"})
                    </span>

                    <span className="text-[#44352c] font-medium">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#75675e]">Shipping</span>

                    <span
                      className={
                        shipping === 0
                          ? "text-[#7c8b67] font-medium"
                          : "text-[#44352c]"
                      }
                    >
                      {shipping === 0
                        ? "FREE"
                        : `₹${shipping.toLocaleString("en-IN")}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#75675e]">Tax (5%)</span>

                    <span className="text-[#44352c]">
                      ₹
                      {tax.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <Separator className="bg-[#e5d9ca]" />

                  <div className="flex justify-between items-end pt-1">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#a78352]">
                        Total
                      </p>

                      <p className="font-[Cormorant_Garamond] text-3xl text-[#44352c]">
                        Amount
                      </p>
                    </div>

                    <span className="font-[Cormorant_Garamond] text-3xl text-[#9a784e]">
                      ₹
                      {total.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mt-7">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-[#a78352]" strokeWidth={1.5} />

                    <span className="text-xs uppercase tracking-wider text-[#6f6259]">
                      Have a promo code?
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      className="h-11 rounded-xl border-[#ded1c2] bg-[#faf7f2] text-sm focus-visible:ring-[#b99a6b] focus-visible:border-[#b99a6b]"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 rounded-xl border-[#cdb690] text-[#80644a] hover:bg-[#eee5da] hover:text-[#4a382c] cursor-pointer"
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Checkout */}
                <Button
                  type="button"
                  onClick={() => navigate("/address")}
                  className="w-full h-12 mt-6 rounded-full bg-[#4a382c] hover:bg-[#35271f] text-white font-medium cursor-pointer shadow-lg shadow-[#4a382c]/10 transition-all"
                >
                  Proceed To Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {/* Continue Shopping */}
                <Link to="/products">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 mt-3 rounded-full border-[#d7c8b7] text-[#66564a] hover:bg-[#f1e9df] hover:text-[#4a382c] cursor-pointer"
                  >
                    Continue Shopping
                  </Button>
                </Link>

                {/* Benefits */}
                <div className="border-t border-[#eadfd3] mt-7 pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#eee5da] flex items-center justify-center">
                      <Truck
                        className="w-4 h-4 text-[#9a784e]"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#4a382c]">
                        Free Shipping
                      </p>

                      <p className="text-[10px] text-[#8b7d73]">
                        On orders above ₹299
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#eee5da] flex items-center justify-center">
                      <RotateCcw
                        className="w-4 h-4 text-[#9a784e]"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#4a382c]">
                        Easy Returns
                      </p>

                      <p className="text-[10px] text-[#8b7d73]">
                        30-day return policy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#eee5da] flex items-center justify-center">
                      <ShieldCheck
                        className="w-4 h-4 text-[#9a784e]"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#4a382c]">
                        Secure Checkout
                      </p>

                      <p className="text-[10px] text-[#8b7d73]">
                        Protected payment experience
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Small brand note */}
            <div className="text-center mt-6">
              <p className="font-[Cormorant_Garamond] italic text-lg text-[#9a784e]">
                Style that feels like you.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cart;
