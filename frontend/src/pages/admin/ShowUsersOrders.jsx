import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  CalendarDays,
  IndianRupee,
  User,
  Mail,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const ShowUsersOrders = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
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
        `${import.meta.env.VITE_URL}/api/v1/orders/user-order/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log("USER ORDERS:", res.data);

      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        toast.error(res.data.message || "Unable to load orders");
      }
    } catch (error) {
      console.error("GET USER ORDERS ERROR:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load user orders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserOrders();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="pl-[350px] min-h-screen bg-gray-100 pt-24 pr-10 font-serif">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />

          <p className="mt-4 text-gray-500">Loading user orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-[350px] min-h-screen bg-gray-100 pt-20 pr-10 pb-10 font-serif">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Orders</h1>

            <p className="text-gray-500 mt-1">
              View all orders placed by this user
            </p>
          </div>
        </div>

        {/* NO ORDERS */}
        {orders.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-orange-500" />
              </div>

              <h2 className="text-xl font-bold text-gray-800 mt-5">
                No Orders Found
              </h2>

              <p className="text-gray-500 mt-2">
                This user has not placed any orders yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* ORDER COUNT */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800">Orders</h2>

              <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>

            {/* ORDERS */}
            <div className="space-y-6">
              {orders.map((order) => (
                <Card
                  key={order._id}
                  className="shadow-sm border-gray-200 overflow-hidden"
                >
                  {/* ORDER HEADER */}
                  <CardHeader className="bg-white border-b">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Order ID</p>

                        <p className="font-mono text-sm font-semibold text-gray-800 break-all">
                          {order._id}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-gray-500">
                        <CalendarDays className="w-4 h-4" />

                        <span className="text-sm">
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

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${
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
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* USER INFORMATION */}
                    {order.user && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <h3 className="font-bold text-gray-800 mb-3">
                          Customer Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-orange-500" />

                            <span className="text-gray-700">
                              {order.user.firstName || ""}{" "}
                              {order.user.lastName || ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-orange-500" />

                            <span className="text-gray-700">
                              {order.user.email || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PRODUCTS */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Package className="w-5 h-5 text-orange-500" />

                        <h3 className="font-bold text-gray-800">
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
                                className="border rounded-xl p-4"
                              >
                                <p className="text-gray-500">
                                  Product no longer available
                                </p>

                                <p className="text-sm text-gray-400">
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
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-200 rounded-xl p-4 bg-white"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden">
                                  <img
                                    src={image}
                                    alt={product.productName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                <div>
                                  <h4 className="font-bold text-gray-800">
                                    {product.productName}
                                  </h4>

                                  <p className="text-sm text-gray-500 mt-1">
                                    ₹
                                    {Number(
                                      product.productPrice || 0,
                                    ).toLocaleString("en-IN")}
                                  </p>

                                  <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right">
                                <p className="text-xs text-gray-500">
                                  Product Total
                                </p>

                                <p className="font-bold text-orange-600">
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

                    {/* TOTAL */}
                    <div className="mt-6 bg-orange-50 border border-orange-100 rounded-xl p-5">
                      <div className="flex justify-between mb-3">
                        <span className="text-gray-600">Subtotal</span>

                        <span className="font-semibold">
                          ₹{Number(order.amount || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex justify-between mb-3">
                        <span className="text-gray-600">Tax</span>

                        <span className="font-semibold">
                          ₹{Number(order.tax || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex justify-between mb-3">
                        <span className="text-gray-600">Shipping</span>

                        <span className="font-semibold">
                          ₹{Number(order.shipping || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="border-t border-orange-200 pt-4 flex justify-between">
                        <span className="font-bold text-lg">Total Amount</span>

                        <span className="font-bold text-xl text-orange-600 flex items-center">
                          <IndianRupee className="w-5 h-5" />

                          {Number(order.amount || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShowUsersOrders;
