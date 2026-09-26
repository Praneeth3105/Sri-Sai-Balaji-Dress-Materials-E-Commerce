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
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (res.data.success) setOrders(res.data.orders || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-7 h-7 text-[#a78352] animate-spin mx-auto" />
          <p className="mt-4 font-[Cormorant_Garamond] text-2xl text-[#4a382c]">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] flex items-center justify-center px-6 text-center">
        <div>
          <ShoppingBag className="w-14 h-14 text-[#a78352] mx-auto" />
          <h1 className="font-[Cormorant_Garamond] text-5xl text-[#44352c] mt-6">
            No Orders Yet
          </h1>
          <p className="text-sm text-[#7b6d64] mt-3">
            Your orders will appear here after your first purchase.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="mt-7 h-11 px-6 rounded-full bg-[#4a382c] text-white"
          >
            Explore Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#3d3028] pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-7">
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold">
            Your Collection
          </p>
          <h1 className="font-[Cormorant_Garamond] text-5xl sm:text-6xl text-[#382b24] mt-2">
            My <span className="italic text-[#a78352]">Orders</span>
          </h1>
          <p className="text-sm text-[#7b6d64] mt-4">
            View your order details and track every delivery stage.
          </p>
        </div>

        <div className="space-y-6">
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
                className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] overflow-hidden shadow-sm"
              >
                <div className="px-5 sm:px-7 py-5 bg-[#f5efe7] border-b border-[#eadfd3] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#96877d]">
                      Order ID
                    </p>
                    <p className="text-sm font-semibold text-[#4a382c] mt-1 break-all">
                      #{order._id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#76685f]">
                    <CalendarDays className="w-4 h-4 text-[#a78352]" />
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </div>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#eee5da] border border-[#ddccb5] text-[#6f5949] text-[10px] uppercase tracking-[0.15em] font-semibold">
                    {order.status === "Paid" ? "Order Placed" : order.status}
                  </span>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="grid lg:grid-cols-[1fr_330px] gap-7">
                    <div>
                      <div className="space-y-4">
                        {(order.products || []).map((item, index) => (
                          <div
                            key={`${order._id}-${index}`}
                            className="flex gap-4 border-b border-[#eee4d9] pb-4 last:border-0"
                          >
                            <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#eee5da] shrink-0">
                              {item.productId?.productImage?.[0]?.url ? (
                                <img
                                  src={item.productId.productImage[0].url}
                                  alt={item.productId.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-[#a78352] m-6" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-[Cormorant_Garamond] text-xl font-semibold text-[#44352c]">
                                {item.productId?.productName || "Product"}
                              </p>
                              <p className="text-xs text-[#7b6d64] mt-1">
                                Color: {item.color || "—"} · Size:{" "}
                                {item.size || "—"} · Qty: {item.quantity}
                              </p>
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

                      <div className="mt-5 flex flex-wrap gap-3 text-xs text-[#6f6259]">
                        <span className="px-3 py-2 rounded-full bg-[#f5efe7]">
                          {totalItems} item{totalItems === 1 ? "" : "s"}
                        </span>
                        <span className="px-3 py-2 rounded-full bg-[#f5efe7]">
                          Total ₹
                          {Number(order.amount || 0).toLocaleString("en-IN")}
                        </span>
                        {order.couponCode && (
                          <span className="px-3 py-2 rounded-full bg-[#e7efe8] text-[#536b53]">
                            Coupon {order.couponCode}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#e5d9ca] bg-[#faf7f2] p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#a78352] font-semibold">
                          Delivery Progress
                        </p>
                        <Truck className="w-4 h-4 text-[#a78352]" />
                      </div>
                      <div className="mt-5 space-y-3">
                        {TRACKING_STEPS.map((step, index) => {
                          const event = (order.tracking || []).find(
                            (entry) => entry.status === step,
                          );
                          const done =
                            index <= currentIndex && currentIndex >= 0;
                          const current = index === currentIndex;
                          return (
                            <div key={step} className="flex gap-3">
                              <div
                                className={`mt-1 w-3 h-3 rounded-full border-2 shrink-0 ${done ? "bg-[#a78352] border-[#a78352]" : "bg-white border-[#cdbb9f]"}`}
                              />
                              <div className="min-w-0">
                                <p
                                  className={`text-xs font-semibold ${current ? "text-[#a78352]" : "text-[#5f5148]"}`}
                                >
                                  {step}
                                </p>
                                {event?.timestamp && (
                                  <p className="text-[10px] text-[#9a8a7e] mt-0.5">
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
                      {latest?.message && (
                        <p className="mt-4 pt-4 border-t border-[#e5d9ca] text-[11px] leading-5 text-[#7b6d64]">
                          {latest.message}
                        </p>
                      )}
                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="mt-5 w-full h-10 rounded-full bg-[#4a382c] text-white text-xs font-semibold flex items-center justify-center gap-2"
                      >
                        Track Full Order <ArrowRight className="w-4 h-4" />
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
