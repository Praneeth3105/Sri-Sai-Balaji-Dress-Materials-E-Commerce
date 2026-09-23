import React from "react";
import {
  CheckCircle,
  ShoppingBag,
  Package,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderSuccess = () => {
  const navigate = useNavigate();

  const { user } = useSelector((store) => store.user);

  const handleViewOrders = () => {
    if (user?._id) {
      navigate(`/profile/${user._id}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4ee] flex items-center justify-center px-4 py-28 relative overflow-hidden">
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-[#ead8bd]/25 blur-3xl pointer-events-none" />

      <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] rounded-full bg-[#ead6d0]/20 blur-3xl pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#d8c7b0]/30 pointer-events-none" />

      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <div className="relative w-full max-w-xl">
        <div
          className="
            bg-[#fffdf9]
            rounded-[2rem]
            border border-[#e5d9ca]
            shadow-[0_25px_70px_rgba(74,56,44,0.10)]
            p-7 sm:p-10
            text-center
          "
        >
          {/* =================================================
              SMALL BRAND EYEBROW
          ================================================== */}

          <div className="flex items-center justify-center gap-2 mb-7">
            <span className="w-8 h-px bg-[#cdb690]" />

            <span className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold">
              Order Confirmed
            </span>

            <span className="w-8 h-px bg-[#cdb690]" />
          </div>

          {/* =================================================
              SUCCESS ICON
          ================================================== */}

          <div className="flex justify-center">
            <div className="relative">
              {/* Outer ring */}
              <div className="absolute inset-[-9px] rounded-full border border-[#d7c4a7]/60" />

              {/* Icon background */}
              <div
                className="
                  w-24
                  h-24
                  rounded-full
                  bg-[#eee5da]
                  border border-[#ddccb5]
                  flex
                  items-center
                  justify-center
                "
              >
                <CheckCircle
                  className="w-14 h-14 text-[#a78352]"
                  strokeWidth={1.4}
                />
              </div>

              {/* Sparkle */}
              <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-[#4a382c] flex items-center justify-center border-4 border-[#fffdf9]">
                <Sparkles
                  className="w-3.5 h-3.5 text-[#e5cfaa]"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* =================================================
              TITLE
          ================================================== */}

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold mt-8">
            Thank You
          </p>

          <h1 className="font-[Cormorant_Garamond] text-4xl sm:text-5xl font-semibold text-[#382b24] mt-2 leading-tight">
            Your Order Is
            <span className="block italic text-[#a78352]">Confirmed</span>
          </h1>

          <div className="w-12 h-px bg-[#b99a6b] mx-auto mt-5 mb-5" />

          <p className="text-sm sm:text-base text-[#74665d] font-[DM_Sans] leading-7 max-w-md mx-auto">
            Your order has been placed successfully. Thank you for choosing Sri
            Sai Balaji Dress Materials.
          </p>

          {/* =================================================
              PAYMENT SUCCESS
          ================================================== */}

          <div
            className="
              mt-7
              bg-[#f4efe7]
              border border-[#e3d5c4]
              rounded-2xl
              p-5
              text-left
            "
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#fffdf9] border border-[#dfd0bc] flex items-center justify-center shrink-0">
                <CheckCircle
                  className="w-5 h-5 text-[#71836b]"
                  strokeWidth={1.6}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#4a382c]">
                  Payment Successful
                </p>

                <p className="text-xs text-[#7b6d64] mt-1">
                  Your order is now being prepared for processing.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              ACTION BUTTONS
          ================================================== */}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Continue Shopping */}
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="
                h-12
                rounded-xl
                bg-[#4a382c]
                hover:bg-[#35271f]
                text-white
                font-[DM_Sans]
                font-semibold
                text-sm
                flex
                items-center
                justify-center
                gap-2
                transition-all
                duration-300
                cursor-pointer
                shadow-[0_10px_25px_rgba(74,56,44,0.14)]
                hover:shadow-[0_14px_30px_rgba(74,56,44,0.18)]
              "
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* View Orders */}
            <button
              type="button"
              onClick={handleViewOrders}
              className="
                h-12
                rounded-xl
                border border-[#cdbb9f]
                bg-[#fffdf9]
                hover:bg-[#f4efe7]
                text-[#4a382c]
                font-[DM_Sans]
                font-semibold
                text-sm
                flex
                items-center
                justify-center
                gap-2
                transition-all
                duration-300
                cursor-pointer
              "
            >
              <Package className="w-4 h-4 text-[#a78352]" />
              View My Orders
            </button>
          </div>

          {/* =================================================
              BRAND FOOTER
          ================================================== */}

          <div className="mt-9 pt-6 border-t border-[#eadfd3]">
            <div className="flex items-center justify-center gap-3">
              <span className="w-10 h-px bg-[#d5c4ad]" />

              <span className="w-1.5 h-1.5 rounded-full bg-[#b99a6b]" />

              <span className="w-10 h-px bg-[#d5c4ad]" />
            </div>

            <p className="font-[Cormorant_Garamond] italic text-lg text-[#9a784e] mt-3">
              Style that feels like you.
            </p>

            <p className="text-[11px] text-[#9a8b81] font-[DM_Sans] mt-1">
              Sri Sai Balaji Dress Materials
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
