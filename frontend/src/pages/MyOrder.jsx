import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const TRACKING_STEPS = [
  "Order Placed",
  "Accepted",
  "Processing",
  "Ready for Dispatch",
  "Dispatched",
  "Out for Delivery",
  "Delivered",
];

const getCurrentIndex = (status) => {
  const normalized = status === "Paid" ? "Order Placed" : status;
  return TRACKING_STEPS.indexOf(normalized);
};

const MyOrder = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH ORDERS
  ========================================================= */

  const fetchOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/myorder`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);

      toast.error(error?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="w-full min-h-screen overflow-x-hidden bg-[#f8f4ee] flex items-center justify-center px-4">
        <div className="text-center">
          <RefreshCw className="w-7 h-7 text-[#a78352] animate-spin mx-auto" />

          <p className="mt-4 font-[Cormorant_Garamond] text-2xl text-[#4a382c]">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     NO ORDERS
  ========================================================= */

  if (!orders.length) {
    return (
      <div className="w-full min-h-screen overflow-x-hidden bg-[#f8f4ee] flex items-center justify-center px-5 text-center">
        <div className="w-full max-w-md">
          <ShoppingBag className="w-14 h-14 text-[#a78352] mx-auto" />

          <h1 className="font-[Cormorant_Garamond] text-4xl sm:text-5xl text-[#44352c] mt-6">
            No Orders Yet
          </h1>

          <p className="text-sm text-[#7b6d64] mt-3 leading-6">
            Your orders will appear here after your first purchase.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-7 h-11 px-6 rounded-full bg-[#4a382c] text-white text-sm font-medium"
          >
            Explore Collection
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden min-h-screen bg-[#f8f4ee] text-[#3d3028] pt-24 sm:pt-28 pb-14 sm:pb-20">
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-5 lg:px-7 min-w-0">
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-7 sm:mb-10 px-1">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold">
            Your Collection
          </p>

          <h1 className="font-[Cormorant_Garamond] text-4xl sm:text-5xl lg:text-6xl text-[#382b24] mt-2">
            My <span className="italic text-[#a78352]">Orders</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#7b6d64] mt-3 sm:mt-4 leading-5">
            View your order details and track every delivery stage.
          </p>
        </div>

        {/* =====================================================
            ORDER LIST
        ===================================================== */}

        <div className="w-full min-w-0 space-y-5 sm:space-y-6">
          {orders.map((order) => {
            const currentIndex = getCurrentIndex(order.status);

            const latest = order.tracking?.[order.tracking.length - 1];

            const totalItems = (order.products || []).reduce(
              (sum, item) => sum + Number(item.quantity || 0),
              0,
            );

            return (
              <div
                key={order._id}
                className="w-full min-w-0 max-w-full bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.25rem] sm:rounded-[1.5rem] overflow-hidden shadow-sm"
              >
                {/* =================================================
                    ORDER HEADER
                ================================================= */}

                <div className="w-full min-w-0 px-4 sm:px-7 py-4 sm:py-5 bg-[#f5efe7] border-b border-[#eadfd3]">
                  <div className="w-full min-w-0 flex flex-col gap-4">
                    {/* ORDER ID */}

                    <div className="w-full min-w-0">
                      <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#96877d]">
                        Order ID
                      </p>

                      <p className="text-xs sm:text-sm font-semibold text-[#4a382c] mt-1 break-all leading-5">
                        #{order._id}
                      </p>
                    </div>

                    {/* DATE + STATUS */}

                    <div className="w-full min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      {/* DATE */}

                      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#76685f] min-w-0">
                        <CalendarDays className="w-4 h-4 text-[#a78352] shrink-0" />

                        <span className="truncate">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : "—"}
                        </span>
                      </div>

                      {/* STATUS */}

                      <span className="inline-flex self-start sm:self-auto items-center justify-center px-3.5 py-1.5 rounded-full bg-[#eee5da] border border-[#ddccb5] text-[#6f5949] text-[9px] uppercase tracking-[0.12em] font-semibold whitespace-nowrap">
                        {order.status === "Paid"
                          ? "Order Placed"
                          : order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    ORDER CONTENT
                ================================================= */}

                <div className="w-full min-w-0 p-4 sm:p-7">
                  <div className="w-full min-w-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_330px] gap-6 lg:gap-7">
                    {/* =================================================
                        PRODUCTS SECTION
                    ================================================= */}

                    <div className="w-full min-w-0">
                      <div className="w-full min-w-0 space-y-4">
                        {(order.products || []).map((item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className="w-full min-w-0 flex gap-3 sm:gap-4 border-b border-[#eee4d9] pb-4 last:border-0"
                          >
                            {/* PRODUCT IMAGE */}

                            <div className="w-[76px] h-[94px] sm:w-16 sm:h-20 rounded-xl overflow-hidden bg-[#eee5da] shrink-0">
                              {item.productId?.productImage?.[0]?.url ? (
                                <img
                                  src={item.productId.productImage[0].url}
                                  alt={item.productId?.productName || "Product"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-[#a78352]" />
                                </div>
                              )}
                            </div>

                            {/* PRODUCT DETAILS */}

                            <div className="flex-1 min-w-0 overflow-hidden">
                              {/* PRODUCT NAME */}

                              <p className="font-[Cormorant_Garamond] text-lg sm:text-xl font-semibold text-[#44352c] leading-tight break-words whitespace-normal">
                                {item.productId?.productName || "Product"}
                              </p>

                              {/* VARIANT DETAILS */}

                              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs text-[#7b6d64]">
                                <span className="break-words">
                                  Color: {item.color || "—"}
                                </span>

                                <span className="text-[#c7b6a5] hidden xs:inline">
                                  •
                                </span>

                                <span className="break-words">
                                  Size: {item.size || "—"}
                                </span>

                                <span className="text-[#c7b6a5] hidden xs:inline">
                                  •
                                </span>

                                <span>Qty: {item.quantity}</span>
                              </div>

                              {/* PRICE */}

                              <p className="text-sm font-semibold text-[#9a784e] mt-2">
                                ₹
                                {Number(
                                  item.productId?.productPrice || 0,
                                ).toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* =================================================
                          ORDER SUMMARY
                      ================================================= */}

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="px-3 py-2 rounded-full bg-[#f5efe7] text-[11px] text-[#6f6259] whitespace-nowrap">
                          {totalItems} {totalItems === 1 ? "item" : "items"}
                        </span>

                        <span className="px-3 py-2 rounded-full bg-[#f5efe7] text-[11px] text-[#6f6259] whitespace-nowrap">
                          Total ₹
                          {Number(order.amount || 0).toLocaleString("en-IN")}
                        </span>

                        {order.couponCode && (
                          <span className="px-3 py-2 rounded-full bg-[#e7efe8] text-[11px] text-[#536b53] whitespace-nowrap">
                            Coupon {order.couponCode}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* =================================================
                        DELIVERY PROGRESS
                    ================================================= */}

                    <div className="w-full min-w-0 rounded-2xl border border-[#e5d9ca] bg-[#faf7f2] p-4 sm:p-5">
                      {/* DELIVERY TITLE */}

                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#a78352] font-semibold">
                          Delivery Progress
                        </p>

                        <Truck className="w-4 h-4 text-[#a78352] shrink-0" />
                      </div>

                      {/* TRACKING STEPS */}

                      <div className="mt-5 space-y-4">
                        {TRACKING_STEPS.map((step, index) => {
                          const event = (order.tracking || []).find(
                            (entry) => entry.status === step,
                          );

                          const done =
                            index <= currentIndex && currentIndex >= 0;

                          const current = index === currentIndex;

                          return (
                            <div key={step} className="flex gap-3 min-w-0">
                              {/* DOT */}

                              <div
                                className={`mt-1 w-3 h-3 rounded-full border-2 shrink-0 ${
                                  done
                                    ? "bg-[#a78352] border-[#a78352]"
                                    : "bg-white border-[#cdbb9f]"
                                }`}
                              />

                              {/* STEP */}

                              <div className="min-w-0 flex-1">
                                <p
                                  className={`text-xs font-semibold leading-5 break-words ${
                                    current
                                      ? "text-[#a78352]"
                                      : "text-[#5f5148]"
                                  }`}
                                >
                                  {step}
                                </p>

                                {event?.timestamp && (
                                  <p className="text-[9px] sm:text-[10px] text-[#9a8a7e] mt-0.5">
                                    {new Date(event.timestamp).toLocaleString(
                                      "en-IN",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* LATEST MESSAGE */}

                      {latest?.message && (
                        <p className="mt-5 pt-4 border-t border-[#e5d9ca] text-[10px] sm:text-[11px] leading-5 text-[#7b6d64] break-words">
                          {latest.message}
                        </p>
                      )}

                      {/* FULL ORDER BUTTON */}

                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="mt-5 w-full h-10 rounded-full bg-[#4a382c] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                      >
                        Track Full Order
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
