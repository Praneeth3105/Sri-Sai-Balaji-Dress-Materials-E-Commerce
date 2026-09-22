import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Package,
  CalendarDays,
  IndianRupee,
  User,
  Mail,
  ShoppingBag,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");

  // =========================================================
  // FETCH ORDERS
  // =========================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/all`,
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
      console.log("ORDERS ERROR:", error);

      toast.error(error?.response?.data?.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================================================
  // HELPERS
  // =========================================================

  const paidOrders =
    orders?.filter(
      (order) => String(order?.status || "").toLowerCase() === "paid",
    ).length || 0;

  const pendingOrders =
    orders?.filter(
      (order) => String(order?.status || "").toLowerCase() === "pending",
    ).length || 0;

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "paid" || value === "delivered") {
      return "bg-[#e7efe8] text-[#4f6b56] border-[#cfddcf]";
    }

    if (value === "pending" || value === "processing") {
      return "bg-[#f3eadb] text-[#8b6b3f] border-[#e2d1b2]";
    }

    return "bg-[#f2e0dc] text-[#8a5148] border-[#e3c8c2]";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCustomerName = (order) => {
    return (
      order?.user?.firstName ||
      order?.user?.name ||
      order?.user?.username ||
      "Customer"
    );
  };

  const getCustomerEmail = (order) => {
    return order?.user?.email || "No email available";
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] pl-0 lg:pl-[350px] pt-24 px-6">
        <div className="max-w-[1450px] mx-auto animate-pulse">
          <div className="h-4 w-32 bg-[#e5d9ca] rounded mb-4" />

          <div className="h-14 w-80 bg-[#e5d9ca] rounded mb-10" />

          <div className="grid md:grid-cols-3 gap-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 bg-[#fffdf9] border border-[#e5d9ca] rounded-2xl"
              />
            ))}
          </div>

          <div className="mt-8 h-[500px] bg-[#fffdf9] border border-[#e5d9ca] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#3d3028] pl-0 lg:pl-[350px] pt-20 pb-20">
      {/* =====================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-[#ead8bd]/25 blur-3xl" />

        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#ead6d0]/20 blur-3xl" />
      </div>

      <div className="relative px-4 sm:px-6 lg:px-10 max-w-[1500px] mx-auto">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-4 h-4 text-[#a78352]" />

              <span className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold">
                Store Management
              </span>
            </div>

            <h1 className="font-[Cormorant_Garamond] text-5xl md:text-6xl text-[#382b24] leading-none">
              Order
              <span className="italic text-[#a78352]"> Management</span>
            </h1>

            <div className="w-12 h-px bg-[#b99a6b] mt-5 mb-4" />

            <p className="text-sm text-[#7b6d64]">
              View and monitor every customer order from your store.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full border border-[#d8c9b8] bg-[#fffdf9] text-[#66564a] hover:bg-[#eee5da] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Orders
          </button>
        </div>

        {/* ===================================================
            STATS
        ==================================================== */}

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {/* Total */}
          <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#88786d]">
                  Total Orders
                </p>

                <p className="font-[Cormorant_Garamond] text-4xl text-[#44352c] mt-3">
                  {orders.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-full bg-[#eee5da] flex items-center justify-center">
                <ShoppingBag
                  className="w-5 h-5 text-[#a78352]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <p className="text-xs text-[#88786d] mt-5">All customer orders</p>
          </div>

          {/* Paid */}
          <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#88786d]">
                  Paid Orders
                </p>

                <p className="font-[Cormorant_Garamond] text-4xl text-[#4f6b56] mt-3">
                  {paidOrders}
                </p>
              </div>

              <div className="w-11 h-11 rounded-full bg-[#e7efe8] flex items-center justify-center">
                <IndianRupee
                  className="w-5 h-5 text-[#5d7862]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <p className="text-xs text-[#7d8a7a] mt-5">Successfully paid</p>
          </div>

          {/* Pending */}
          <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#88786d]">
                  Pending Orders
                </p>

                <p className="font-[Cormorant_Garamond] text-4xl text-[#8b6b3f] mt-3">
                  {pendingOrders}
                </p>
              </div>

              <div className="w-11 h-11 rounded-full bg-[#f3eadb] flex items-center justify-center">
                <Package className="w-5 h-5 text-[#9b794b]" strokeWidth={1.5} />
              </div>
            </div>

            <p className="text-xs text-[#8b7967] mt-5">Awaiting completion</p>
          </div>
        </div>


        <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] overflow-hidden shadow-sm">
          <div className="px-6 md:px-8 py-6 border-b border-[#eadfd3]">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#a78352] font-semibold">
              Customer Orders
            </p>

            <h2 className="font-[Cormorant_Garamond] text-3xl text-[#44352c] mt-1">
              All Orders
            </h2>
          </div>


          {orders.length === 0 ? (
            <div className="py-20 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#eee5da] flex items-center justify-center mx-auto mb-5">
                <Package className="w-7 h-7 text-[#a78352]" />
              </div>

              <h3 className="font-[Cormorant_Garamond] text-3xl text-[#44352c]">
                No Orders Yet
              </h3>

              <p className="text-sm text-[#7b6d64] mt-2">
                Customer orders will appear here when purchases are made.
              </p>
            </div>
          ) : (
            <>

              <div className="hidden xl:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f5efe7] border-b border-[#eadfd3]">
                      <th className="text-left px-6 py-4 text-[10px] uppercase tracking-wider text-[#806f63] font-semibold">
                        Order
                      </th>

                      <th className="text-left px-6 py-4 text-[10px] uppercase tracking-wider text-[#806f63] font-semibold">
                        Customer
                      </th>

                      <th className="text-left px-6 py-4 text-[10px] uppercase tracking-wider text-[#806f63] font-semibold">
                        Products
                      </th>

                      <th className="text-right px-6 py-4 text-[10px] uppercase tracking-wider text-[#806f63] font-semibold">
                        Amount
                      </th>

                      <th className="text-center px-6 py-4 text-[10px] uppercase tracking-wider text-[#806f63] font-semibold">
                        Status
                      </th>

                      <th className="text-right px-6 py-4 text-[10px] uppercase tracking-wider text-[#806f63] font-semibold">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order, index) => (
                      <tr
                        key={order?._id || index}
                        className="border-b border-[#f0e7dc] last:border-0 hover:bg-[#faf7f2] transition-colors"
                      >
                        {/* Order */}
                        <td className="px-6 py-5">
                          <p className="text-xs font-semibold text-[#4a382c]">
                            #{order?._id?.slice(-8) || "—"}
                          </p>

                          <p className="text-[10px] text-[#9a8b81] mt-1">
                            Order ID
                          </p>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#eee5da] flex items-center justify-center">
                              <User
                                className="w-4 h-4 text-[#a78352]"
                                strokeWidth={1.5}
                              />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-[#4a382c]">
                                {getCustomerName(order)}
                              </p>

                              <p className="text-[10px] text-[#8c7d73] flex items-center gap-1 mt-1">
                                <Mail className="w-3 h-3" />

                                {getCustomerEmail(order)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Products */}
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            {order?.items?.length ? (
                              order.items.slice(0, 2).map((item, itemIndex) => (
                                <p
                                  key={itemIndex}
                                  className="text-xs text-[#66584f]"
                                >
                                  {item?.productId?.productName ||
                                    item?.productName ||
                                    "Product"}{" "}
                                  × {item?.quantity || 1}
                                </p>
                              ))
                            ) : (
                              <p className="text-xs text-[#88786d]">
                                No product details
                              </p>
                            )}

                            {order?.items?.length > 2 && (
                              <p className="text-[10px] text-[#a78352]">
                                +{order.items.length - 2} more
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-5 text-right">
                          <p className="font-[Cormorant_Garamond] text-xl text-[#9a784e]">
                            ₹
                            {Number(
                              order?.totalAmount ||
                                order?.totalPrice ||
                                order?.amount ||
                                0,
                            ).toLocaleString("en-IN")}
                          </p>

                          {order?.tax !== undefined && (
                            <p className="text-[10px] text-[#96877d] mt-1">
                              Tax ₹{order.tax}
                            </p>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full border text-[10px] uppercase tracking-wider font-semibold ${getStatusStyle(
                              order?.status,
                            )}`}
                          >
                            {order?.status || "Unknown"}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-xs text-[#76685f]">
                            <CalendarDays className="w-3.5 h-3.5 text-[#a78352]" />

                            {formatDate(
                              order?.createdAt ||
                                order?.orderDate ||
                                order?.date,
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* =================================================
                  MOBILE / TABLET CARDS
              ================================================== */}

              <div className="xl:hidden p-4 md:p-6 space-y-4">
                {orders.map((order, index) => (
                  <div
                    key={order?._id || index}
                    className="border border-[#e5d9ca] rounded-2xl bg-[#faf7f2] p-5"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#a78352]">
                          Order
                        </p>

                        <p className="text-sm font-semibold text-[#4a382c] mt-1">
                          #{order?._id?.slice(-8) || "—"}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full border text-[10px] uppercase tracking-wider font-semibold ${getStatusStyle(
                          order?.status,
                        )}`}
                      >
                        {order?.status || "Unknown"}
                      </span>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-3 mt-5">
                      <div className="w-10 h-10 rounded-full bg-[#eee5da] flex items-center justify-center">
                        <User
                          className="w-4 h-4 text-[#a78352]"
                          strokeWidth={1.5}
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[#4a382c]">
                          {getCustomerName(order)}
                        </p>

                        <p className="text-[10px] text-[#8c7d73] flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3" />
                          {getCustomerEmail(order)}
                        </p>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="mt-5 pt-5 border-t border-[#e8ddd1]">
                      <p className="text-[10px] uppercase tracking-wider text-[#a78352] mb-3">
                        Products
                      </p>

                      <div className="space-y-2">
                        {order?.items?.length ? (
                          order.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex items-center justify-between gap-3"
                            >
                              <p className="text-xs text-[#66584f]">
                                {item?.productId?.productName ||
                                  item?.productName ||
                                  "Product"}
                              </p>

                              <span className="text-xs text-[#8b7b70]">
                                × {item?.quantity || 1}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-[#88786d]">
                            No product details
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-5 pt-5 border-t border-[#e8ddd1] flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#a78352]">
                          Date
                        </p>

                        <div className="flex items-center gap-1.5 mt-1 text-xs text-[#76685f]">
                          <CalendarDays className="w-3.5 h-3.5" />

                          {formatDate(
                            order?.createdAt || order?.orderDate || order?.date,
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-[#a78352]">
                          Amount
                        </p>

                        <p className="font-[Cormorant_Garamond] text-2xl text-[#9a784e] mt-1">
                          ₹
                          {Number(
                            order?.totalAmount ||
                              order?.totalPrice ||
                              order?.amount ||
                              0,
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer note */}
        <div className="text-center mt-8">
          <p className="font-[Cormorant_Garamond] italic text-lg text-[#9a784e]">
            Style that feels like you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
