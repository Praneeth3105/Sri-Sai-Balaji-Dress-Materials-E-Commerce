import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, MapPin, Package, Truck } from "lucide-react";
import { toast } from "sonner";

const steps = [
  "Order Placed",
  "Accepted",
  "Processing",
  "Ready for Dispatch",
  "Dispatched",
  "Out for Delivery",
  "Delivered",
];

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("accessToken");

        if (!token) {
          toast.error("Please login again");
          navigate("/login");
          return;
        }

        // Get all orders of the logged-in user
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/v1/orders/myorder`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("MY ORDERS RESPONSE:", res.data);
        console.log("TRACKING ORDER ID:", orderId);

        if (!res.data.success) {
          toast.error(res.data.message || "Unable to load orders");
          return;
        }

        /*
          Backend may return:
          res.data.orders

          We support both orders and order
          so the page doesn't break if your response naming differs.
        */
        const orders = res.data.orders || [];

        const foundOrder = orders.find(
          (item) => String(item._id) === String(orderId),
        );

        console.log("FOUND ORDER:", foundOrder);

        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          toast.error("Order not found");
          setOrder(null);
        }
      } catch (error) {
        console.error("TRACK ORDER ERROR:", error);
        console.error("SERVER RESPONSE:", error?.response?.data);

        toast.error(error?.response?.data?.message || "Unable to load order");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    } else {
      setLoading(false);
      toast.error("Order ID is missing");
    }
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] flex items-center justify-center text-[#7b6d64]">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] flex flex-col items-center justify-center gap-5">
        <p className="text-[#4a382c] text-lg">Order not found</p>

        <button
          onClick={() => navigate("/orders")}
          className="px-6 py-3 rounded-full bg-[#4a382c] text-white text-sm"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const status =
    order.status === "Paid" ? "Order Placed" : order.status || "Order Placed";

  const currentIndex = steps.indexOf(status);

  return (
    <div className="min-h-screen bg-[#f8f4ee] pt-28 pb-20 text-[#3d3028]">
      <div className="max-w-5xl mx-auto px-5 sm:px-7">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-xs text-[#75675e] hover:text-[#4a382c] mb-7"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>

        {/* HEADER */}
        <div className="mb-9">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold">
            Order Tracking
          </p>

          <h1 className="font-[Cormorant_Garamond] text-5xl text-[#382b24] mt-2">
            Track <span className="italic text-[#a78352]">Your Order</span>
          </h1>

          <p className="text-sm text-[#7b6d64] mt-3 break-all">
            Order #{order._id}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.25fr_.75fr] gap-6">
          <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-7">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#a78352]">
                  Current Status
                </p>
                <h2 className="font-[Cormorant_Garamond] text-3xl text-[#44352c] mt-1">
                  {status}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-full bg-[#eee5da] flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#a78352]" />
              </div>
            </div>

            <div className="space-y-0">
              {steps.map((step, index) => {
                const event = (order.tracking || []).find(
                  (entry) => entry.status === step,
                );

                const done = index <= currentIndex && currentIndex >= 0;

                return (
                  <div key={step} className="flex gap-4 min-h-[78px]">
                    {/* ICON + LINE */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                          done
                            ? "bg-[#4a382c] border-[#4a382c] text-white"
                            : "bg-white border-[#d9c9b7] text-[#b5a28e]"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </div>

                      {index < steps.length - 1 && (
                        <div
                          className={`w-px flex-1 mt-1 ${
                            index < currentIndex
                              ? "bg-[#a78352]"
                              : "bg-[#ddd0c0]"
                          }`}
                        />
                      )}
                    </div>

                    {/* STATUS TEXT */}
                    <div className="pb-6">
                      <p
                        className={`text-sm font-semibold ${
                          done ? "text-[#4a382c]" : "text-[#96877d]"
                        }`}
                      >
                        {step}
                      </p>

                      {event?.timestamp && (
                        <p className="text-[10px] text-[#9a8a7e] mt-1">
                          {new Date(event.timestamp).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}

                      {event?.message && (
                        <p className="text-xs text-[#7b6d64] mt-1 leading-5">
                          {event.message}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-6">
            {/* DELIVERY ADDRESS */}
            <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] p-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#a78352]" />

                <h3 className="font-[Cormorant_Garamond] text-2xl text-[#44352c]">
                  Delivery Address
                </h3>
              </div>

              <div className="mt-4 text-sm text-[#6f6259] leading-6">
                {order.deliveryAddress?.fullName}
                <br />
                {order.deliveryAddress?.address}
                <br />
                {order.deliveryAddress?.city}, {order.deliveryAddress?.state} -{" "}
                {order.deliveryAddress?.zip}
                <br />
                {order.deliveryAddress?.country}
                <br />
                Phone: {order.deliveryAddress?.phone}
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] p-6">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#a78352]" />

                <h3 className="font-[Cormorant_Garamond] text-2xl text-[#44352c]">
                  Order Summary
                </h3>
              </div>

              <div className="mt-4 space-y-3">
                {(order.products || []).map((item, index) => (
                  <div
                    key={index}
                    className="text-xs text-[#6f6259] border-b border-[#eee4d9] pb-3 last:border-0"
                  >
                    <p className="font-semibold text-[#4a382c]">
                      {item.productId?.productName || "Product"}
                    </p>

                    <p>
                      Color: {item.color || "—"} · Size: {item.size || "—"} ·
                      Qty: {item.quantity}
                    </p>
                  </div>
                ))}

                <div className="pt-2 flex justify-between font-semibold text-[#4a382c]">
                  <span>Total</span>

                  <span>
                    ₹{Number(order.amount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
