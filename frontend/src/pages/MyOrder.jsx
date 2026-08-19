import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Package,
  CalendarDays,
  IndianRupee,
  User,
  Mail,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MyOrder = () => {
    const navigate = useNavigate();
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />

        <p className="mt-4 text-gray-500 font-serif">Loading your orders...</p>
      </div>
    );
  }

  // =========================
  // NO ORDERS
  // =========================

  if (userOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-orange-400" />
        </div>

        <h3 className="text-xl font-semibold font-serif mt-5 text-gray-800">
          No Orders Yet
        </h3>

        <p className="text-gray-500 mt-2 font-serif">
          Your orders will appear here after you make a purchase.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Count */}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold font-serif text-gray-800">
          My Orders
        </h2>

        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
          {userOrders.length} {userOrders.length === 1 ? "Order" : "Orders"}
        </span>
      </div>

      {/* Orders */}

      {userOrders.map((order) => (
        <div
          key={order._id}
          className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
        >
          {/* =========================
              ORDER HEADER
          ========================= */}

          <div className="bg-gray-50 border-b border-gray-200 px-5 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Order ID */}

              <div>
                <p className="text-xs text-gray-500 font-serif">Order ID</p>

                <p className="font-semibold text-gray-800 font-mono text-sm break-all">
                  {order._id}
                </p>
              </div>

              {/* Date */}

              <div className="flex items-center gap-2 text-gray-500">
                <CalendarDays className="w-4 h-4" />

                <span className="text-sm font-serif">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>

              {/* Status */}

              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold font-serif w-fit ${
                  order.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* =========================
              USER DETAILS
          ========================= */}

          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />

                <span className="text-sm text-gray-700 font-serif">
                  {order.user?.firstName || ""} {order.user?.lastName || ""}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" />

                <span className="text-sm text-gray-700 font-serif">
                  {order.user?.email || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* =========================
              PRODUCTS
          ========================= */}

          <div className="px-5 py-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-orange-500" />

              <h3 className="font-semibold font-serif text-gray-800">
                Ordered Products
              </h3>
            </div>

            <div className="space-y-4">
              {order.products?.map((item, index) => {
                const product = item.productId;

                // Product may have been deleted later.
                if (!product) {
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <p className="text-gray-500 font-serif">
                        Product no longer available
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-orange-400 hover:bg-orange-50/40 transition-all"
                  >
                    {/* Product */}

                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={image}
                          alt={product.productName || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h4 className="font-semibold font-serif text-gray-800">
                          {product.productName || "Unnamed Product"}
                        </h4>

                        <p className="text-sm text-gray-500 font-serif mt-1">
                          ₹
                          {Number(product.productPrice || 0).toLocaleString(
                            "en-IN",
                          )}
                        </p>

                        <p className="text-sm text-gray-500 font-serif">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Product Total */}

                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-serif">
                        Product Total
                      </p>

                      <p className="font-bold text-orange-600 font-serif">
                        ₹
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

          {/* =========================
              ORDER TOTAL
          ========================= */}

          <div className="bg-orange-50 border-t border-orange-100 px-5 py-5">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-serif">Subtotal</span>

                <span className="font-semibold font-serif">
                  ₹{Number(order.amount || 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-serif">Tax</span>

                <span className="font-semibold font-serif">
                  ₹{Number(order.tax || 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-serif">Shipping</span>

                <span className="font-semibold font-serif">
                  ₹{Number(order.shipping || 0).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="border-t border-orange-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-lg font-serif text-gray-800">
                  Total Amount
                </span>

                <span className="font-bold text-xl text-orange-600 font-serif flex items-center">
                  <IndianRupee className="w-5 h-5" />

                  {Number(order.amount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrder;
