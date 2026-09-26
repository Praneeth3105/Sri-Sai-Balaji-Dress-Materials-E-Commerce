import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  CalendarDays,
  ChevronRight,
  ClipboardList,
  IndianRupee,
  Mail,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";

const STEPS = [
  "Order Placed",
  "Accepted",
  "Processing",
  "Ready for Dispatch",
  "Dispatched",
  "Out for Delivery",
  "Delivered",
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/all`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (res.data.success) setOrders(res.data.orders || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const normalizedStatus = (status) =>
    status === "Paid" ? "Order Placed" : status;
  const getNextStatus = (status) => {
    const index = STEPS.indexOf(normalizedStatus(status));
    return index >= 0 && index < STEPS.length - 1 ? STEPS[index + 1] : "";
  };

  const updateStatus = async (orderId, status) => {
    if (!status) return;
    try {
      setUpdatingId(orderId);
      const res = await axios.put(
        `${import.meta.env.VITE_URL}/api/v1/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) => (order._id === orderId ? res.data.order : order)),
        );
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to update order status",
      );
    } finally {
      setUpdatingId("");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#f8f4ee] pl-0 lg:pl-[300px] pt-36 text-center text-[#7b6d64]">
        Loading orders...
      </div>
    );

  const paid = orders.filter(
    (o) => !["Pending", "Failed", "Cancelled"].includes(o.status),
  ).length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const active = orders.filter(
    (o) => !["Delivered", "Cancelled", "Failed"].includes(o.status),
  ).length;

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#3d3028] pl-0 lg:pl-[300px] pt-[125px] pb-24">
      <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-4 h-4 text-[#a78352]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold">
                Store Management
              </span>
            </div>
            <h1 className="font-[Cormorant_Garamond] text-5xl md:text-6xl text-[#382b24]">
              Order <span className="italic text-[#a78352]">Management</span>
            </h1>
            <div className="w-12 h-px bg-[#b99a6b] mt-5 mb-4" />
            <p className="text-sm text-[#7b6d64]">
              Accept orders and move them through each delivery stage.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[#d8c9b8] bg-[#fffdf9] text-[#66564a] hover:bg-[#eee5da]"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Orders
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            ["Total Orders", orders.length, ShoppingBag],
            ["Paid / Active", paid, IndianRupee],
            ["In Progress", active, Truck],
            ["Delivered", delivered, Package],
          ].map(([label, value, Icon]) => (
            <div
              key={label}
              className="bg-[#fffdf9] border border-[#e5d9ca] rounded-2xl p-5"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[.2em] text-[#88786d]">
                    {label}
                  </p>
                  <p className="font-[Cormorant_Garamond] text-4xl text-[#44352c] mt-2">
                    {value}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#eee5da] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#a78352]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#fffdf9] border border-dashed border-[#d9cabb] rounded-2xl p-16 text-center">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = normalizedStatus(order.status);
              const currentIndex = STEPS.indexOf(status);
              const next = getNextStatus(status);
              const latest = order.tracking?.[order.tracking.length - 1];
              return (
                <div
                  key={order._id}
                  className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] overflow-hidden shadow-sm"
                >
                  <div className="px-5 sm:px-7 py-5 bg-[#f5efe7] border-b border-[#eadfd3] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-[.2em] text-[#96877d]">
                        Order
                      </p>
                      <p className="text-sm font-semibold text-[#4a382c] break-all mt-1">
                        #{order._id}
                      </p>
                      <p className="text-[10px] text-[#8b7c72] mt-1 flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <span className="px-4 py-2 rounded-full bg-[#eee5da] border border-[#ddccb5] text-[#6f5949] text-[10px] uppercase tracking-[.15em] font-semibold">
                      {status}
                    </span>
                    <div className="flex items-center gap-2">
                      {next && (
                        <button
                          disabled={updatingId === order._id}
                          onClick={() => updateStatus(order._id, next)}
                          className="h-10 px-4 rounded-full bg-[#4a382c] text-white text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
                        >
                          {updatingId === order._id ? (
                            "Updating..."
                          ) : (
                            <>
                              Move to {next}
                              <ChevronRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
                      {status !== "Delivered" &&
                        status !== "Cancelled" &&
                        status !== "Out for Delivery" && (
                          <button
                            disabled={updatingId === order._id}
                            onClick={() => updateStatus(order._id, "Cancelled")}
                            className="h-10 px-4 rounded-full border border-[#dfcfc0] text-[#8e4e43] text-xs"
                          >
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>

                  <div className="p-5 sm:p-7 grid xl:grid-cols-[1fr_380px] gap-7">
                    <div>
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="rounded-xl bg-[#faf7f2] border border-[#eadfd3] p-4">
                          <p className="text-[9px] uppercase tracking-[.18em] text-[#a78352]">
                            Customer
                          </p>
                          <p className="mt-2 text-sm font-semibold text-[#4a382c] flex items-center gap-2">
                            <User className="w-4 h-4 text-[#a78352]" />
                            {order.user?.firstName || "Customer"}{" "}
                            {order.user?.lastName || ""}
                          </p>
                          <p className="mt-1 text-xs text-[#7b6d64] flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" />
                            {order.user?.email || "—"}
                          </p>
                        </div>
                        <div className="rounded-xl bg-[#faf7f2] border border-[#eadfd3] p-4">
                          <p className="text-[9px] uppercase tracking-[.18em] text-[#a78352]">
                            Delivery Address
                          </p>
                          <p className="mt-2 text-xs leading-5 text-[#6f6259] flex gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#a78352] shrink-0 mt-0.5" />
                            <span>
                              {order.deliveryAddress?.fullName}
                              <br />
                              {order.deliveryAddress?.address}
                              <br />
                              {order.deliveryAddress?.city},{" "}
                              {order.deliveryAddress?.state} -{" "}
                              {order.deliveryAddress?.zip}
                              <br />
                              Phone: {order.deliveryAddress?.phone}
                            </span>
                          </p>
                        </div>
                      </div>

                      <p className="text-[9px] uppercase tracking-[.2em] text-[#a78352] font-semibold mb-3">
                        Products Ordered
                      </p>
                      <div className="space-y-3">
                        {(order.products || []).map((item, index) => (
                          <div
                            key={index}
                            className="flex gap-4 rounded-xl border border-[#eadfd3] bg-[#fffdf9] p-3"
                          >
                            <div className="w-14 h-16 rounded-lg overflow-hidden bg-[#eee5da] shrink-0">
                              {item.productId?.productImage?.[0]?.url ? (
                                <img
                                  src={item.productId.productImage[0].url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-5 h-5 m-5 text-[#a78352]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-[Cormorant_Garamond] text-xl text-[#44352c]">
                                {item.productId?.productName || "Product"}
                              </p>
                              <p className="text-xs text-[#7b6d64]">
                                Color: {item.color || "—"} · Size:{" "}
                                {item.size || "—"} · Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 border-t border-[#eadfd3] pt-5 ml-auto max-w-sm space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>
                            ₹
                            {Number(
                              order.subtotal || order.amount || 0,
                            ).toLocaleString("en-IN")}
                          </span>
                        </div>
                        {Number(order.discount || 0) > 0 && (
                          <div className="flex justify-between text-[#536b53]">
                            <span>Coupon {order.couponCode}</span>
                            <span>
                              -₹{Number(order.discount).toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>
                            ₹{Number(order.tax || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>
                            {Number(order.shipping || 0) === 0
                              ? "FREE"
                              : `₹${Number(order.shipping).toLocaleString("en-IN")}`}
                          </span>
                        </div>
                        <div className="border-t border-[#d9c9b7] pt-3 flex justify-between font-semibold text-[#4a382c]">
                          <span>Total</span>
                          <span>
                            ₹{Number(order.amount || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#e5d9ca] bg-[#faf7f2] p-5 h-fit">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[.2em] text-[#a78352] font-semibold">
                          Progress Timeline
                        </p>
                        <Truck className="w-4 h-4 text-[#a78352]" />
                      </div>
                      <div className="mt-5 space-y-4">
                        {STEPS.map((step, index) => {
                          const event = (order.tracking || []).find(
                            (e) => e.status === step,
                          );
                          const done =
                            index <= currentIndex && currentIndex >= 0;
                          return (
                            <div key={step} className="flex gap-3">
                              <div
                                className={`mt-1 w-3 h-3 rounded-full border-2 ${done ? "bg-[#a78352] border-[#a78352]" : "bg-white border-[#cdbb9f]"}`}
                              />
                              <div>
                                <p
                                  className={`text-xs font-semibold ${done ? "text-[#4a382c]" : "text-[#96877d]"}`}
                                >
                                  {step}
                                </p>
                                {event?.timestamp && (
                                  <p className="text-[10px] text-[#9a8a7e]">
                                    {new Date(event.timestamp).toLocaleString(
                                      "en-IN",
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {latest?.message && (
                        <p className="mt-5 pt-4 border-t border-[#e5d9ca] text-[11px] leading-5 text-[#7b6d64]">
                          {latest.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
