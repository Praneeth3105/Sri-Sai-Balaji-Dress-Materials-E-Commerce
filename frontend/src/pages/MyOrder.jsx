import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Package,
  CalendarDays,
  IndianRupee,
  User,
  Mail,
  ShoppingBag,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MyOrder = () => {
  const navigate = useNavigate();

  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // GET USER ORDERS
  // =========================================================

  const getUserOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Please login again");
      setLoading(false);
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

      console.log("MY ORDERS RESPONSE:", res.data);

      if (res.data.success) {
        setUserOrders(res.data.orders || []);
      } else {
        toast.error(res.data.message || "Unable to load orders");
      }
    } catch (error) {
      console.error("GET MY ORDERS ERROR:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load your orders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "paid" || value === "delivered") {
      return {
        wrapper: "bg-[#e7efe8] text-[#4f6b56] border-[#cfddcf]",
        dot: "bg-[#71836b]",
      };
    }

    if (value === "pending" || value === "processing") {
      return {
        wrapper: "bg-[#f3eadb] text-[#8b6b3f] border-[#e2d1b2]",
        dot: "bg-[#b99a6b]",
      };
    }

    return {
      wrapper: "bg-[#f2e0dc] text-[#8a5148] border-[#e3c8c2]",
      dot: "bg-[#9a6259]",
    };
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center bg-[#f8f4ee] px-6">
        <div className="w-12 h-12 rounded-full bg-[#eee5da] flex items-center justify-center">
          <RefreshCw
            className="w-5 h-5 text-[#a78352] animate-spin"
            strokeWidth={1.5}
          />
        </div>

        <p className="mt-5 font-[Cormorant_Garamond] text-xl text-[#4a382c]">
          Preparing your orders...
        </p>

        <p className="text-xs text-[#8b7c72] mt-1 font-[DM_Sans]">
          Please wait a moment
        </p>
      </div>
    );
  }

  // =========================================================
  // EMPTY ORDERS
  // =========================================================

  if (userOrders.length === 0) {
    return (
      <div className="min-h-[500px] bg-[#f8f4ee] flex flex-col items-center justify-center text-center px-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[#eee5da] border border-[#dfd0bd] flex items-center justify-center">
            <ShoppingBag className="w-9 h-9 text-[#a78352]" strokeWidth={1.3} />
          </div>

          <div className="absolute -right-1 -bottom-1 w-7 h-7 rounded-full bg-[#fffdf9] border border-[#dfd2c2] flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#b99a6b]" />
          </div>
        </div>

        <p className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold mt-7">
          Your Collection
        </p>

        <h3 className="font-[Cormorant_Garamond] text-4xl text-[#44352c] mt-2">
          No Orders Yet
        </h3>

        <p className="text-sm text-[#7b6d64] mt-3 max-w-sm leading-6">
          Your beautiful selections will appear here after you make your first
          purchase.
        </p>

        <button
          type="button"
          onClick={() => navigate("/products")}
          className="mt-7 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[#4a382c] text-white text-sm hover:bg-[#35271f] transition-all duration-300 shadow-md shadow-[#4a382c]/10 cursor-pointer"
        >
          Explore Collection
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="bg-[#f8f4ee] text-[#3d3028] py-8 sm:py-10">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-[-100px] w-[450px] h-[450px] rounded-full bg-[#ead8bd]/20 blur-3xl" />

        <div className="absolute bottom-0 left-[-100px] w-[400px] h-[400px] rounded-full bg-[#ead6d0]/15 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-9">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag
                className="w-4 h-4 text-[#a78352]"
                strokeWidth={1.5}
              />

              <span className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold">
                Your Collection
              </span>
            </div>

            <h2 className="font-[Cormorant_Garamond] text-4xl sm:text-5xl text-[#382b24] leading-none">
              My
              <span className="italic text-[#a78352]"> Orders</span>
            </h2>

            <div className="w-12 h-px bg-[#b99a6b] mt-4 mb-3" />

            <p className="text-sm text-[#7b6d64]">
              A record of everything you've chosen from us.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-[#fffdf9] border border-[#e5d9ca] rounded-full px-4 py-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#b99a6b]" />

            <span className="text-xs text-[#66584f]">
              {userOrders.length} {userOrders.length === 1 ? "Order" : "Orders"}
            </span>
          </div>
        </div>

        {/* =====================================================
            ORDERS
        ====================================================== */}

        <div className="space-y-7">
          {userOrders.map((order) => {
            const statusStyle = getStatusStyle(order?.status);

            return (
              <div
                key={order._id}
                className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* =================================================
                    ORDER HEADER
                ================================================== */}

                <div className="px-5 sm:px-7 py-5 bg-[#f5efe7] border-b border-[#eadfd3]">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    {/* Order ID */}
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#96877d]">
                        Order ID
                      </p>

                      <p className="font-[DM_Sans] font-medium text-sm text-[#4a382c] break-all mt-1">
                        #{order._id}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-[#76685f]">
                      <CalendarDays
                        className="w-4 h-4 text-[#a78352]"
                        strokeWidth={1.5}
                      />

                      <span className="text-xs">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </span>
                    </div>

                    {/* Status */}
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em] font-semibold border w-fit ${statusStyle.wrapper}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                      />

                      {order.status}
                    </span>
                  </div>
                </div>

                {/* =================================================
                    CUSTOMER
                ================================================== */}

                <div className="px-5 sm:px-7 py-5 border-b border-[#eadfd3]">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#eee5da] flex items-center justify-center">
                        <User
                          className="w-3.5 h-3.5 text-[#a78352]"
                          strokeWidth={1.5}
                        />
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[#9a8b81]">
                          Customer
                        </p>

                        <p className="text-xs text-[#4f433b] mt-0.5">
                          {order.user?.firstName || ""}{" "}
                          {order.user?.lastName || ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#eee5da] flex items-center justify-center">
                        <Mail
                          className="w-3.5 h-3.5 text-[#a78352]"
                          strokeWidth={1.5}
                        />
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[#9a8b81]">
                          Email
                        </p>

                        <p className="text-xs text-[#4f433b] mt-0.5 break-all">
                          {order.user?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    PRODUCTS
                ================================================== */}

                <div className="px-5 sm:px-7 py-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Package
                      className="w-4 h-4 text-[#a78352]"
                      strokeWidth={1.5}
                    />

                    <h3 className="font-[Cormorant_Garamond] text-2xl text-[#44352c]">
                      Ordered Products
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {order.products?.map((item, index) => {
                      const product = item.productId;

                      if (!product) {
                        return (
                          <div
                            key={index}
                            className="border border-[#e5d9ca] rounded-xl p-4 bg-[#faf7f2]"
                          >
                            <p className="text-sm text-[#7b6d64]">
                              Product no longer available
                            </p>

                            <p className="text-xs text-[#a2958c] mt-1">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        );
                      }

                      const image =
                        product?.productImage?.[0]?.url ||
                        product?.productImg?.[0]?.url ||
                        product?.productImg?.[0] ||
                        "/Profile.png";

                      return (
                        <div
                          key={product._id || index}
                          onClick={() => navigate(`/products/${product._id}`)}
                          className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-[#e5d9ca] rounded-xl p-4 bg-[#fffdf9] hover:bg-[#faf7f2] hover:border-[#cdb690] transition-all duration-300 cursor-pointer"
                        >
                          {/* Product */}
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#eee5da] border border-[#e3d5c5] flex-shrink-0">
                              <img
                                src={image}
                                alt={product.productName || "Product"}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>

                            <div className="min-w-0">
                              <h4 className="font-[Cormorant_Garamond] text-xl text-[#44352c] truncate">
                                {product.productName || "Unnamed Product"}
                              </h4>

                              <p className="text-sm text-[#9a784e] mt-1">
                                ₹
                                {Number(
                                  product.productPrice || 0,
                                ).toLocaleString("en-IN")}
                              </p>

                              <p className="text-xs text-[#88786d] mt-1">
                                Quantity: {item.quantity}
                              </p>

                              {(item.color || item.size) && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {item.color && (
                                    <span className="px-2.5 py-1 rounded-full bg-[#eee5da] text-[10px] text-[#66584f]">
                                      Color: {item.color}
                                    </span>
                                  )}

                                  {item.size && (
                                    <span className="px-2.5 py-1 rounded-full bg-[#eee5da] text-[10px] text-[#66584f]">
                                      Size: {item.size}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Product Total */}
                          <div className="sm:text-right pl-24 sm:pl-0">
                            <p className="text-[9px] uppercase tracking-wider text-[#9a8b81]">
                              Product Total
                            </p>

                            <p className="font-[Cormorant_Garamond] text-xl text-[#9a784e] mt-1 flex items-center sm:justify-end">
                              <IndianRupee className="w-4 h-4" />

                              {(
                                Number(product.productPrice || 0) *
                                Number(item.quantity || 0)
                              ).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* =================================================
                    ORDER TOTALS
                ================================================== */}

                <div className="bg-[#f5efe7] border-t border-[#eadfd3] px-5 sm:px-7 py-6">
                  <div className="max-w-md ml-auto space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#76685f]">Subtotal</span>

                      <span className="font-medium text-[#4a382c]">
                        ₹{Number(order.amount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-[#76685f]">Tax</span>

                      <span className="font-medium text-[#4a382c]">
                        ₹{Number(order.tax || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-[#76685f]">Shipping</span>

                      <span className="font-medium text-[#4a382c]">
                        ₹{Number(order.shipping || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="border-t border-[#d9c9b7] pt-4 mt-4 flex justify-between items-center">
                      <span className="font-[Cormorant_Garamond] text-xl text-[#44352c]">
                        Total Amount
                      </span>

                      <span className="font-[Cormorant_Garamond] text-2xl text-[#9a784e] flex items-center">
                        <IndianRupee className="w-5 h-5" />

                        {Number(order.amount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-12 pb-4">
          <div className="flex items-center justify-center gap-3">
            <span className="w-12 h-px bg-[#d5c4ad]" />

            <span className="w-1.5 h-1.5 rounded-full bg-[#b99a6b]" />

            <span className="w-12 h-px bg-[#d5c4ad]" />
          </div>

          <p className="font-[Cormorant_Garamond] italic text-lg text-[#9a784e] mt-3">
            Style that feels like you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
