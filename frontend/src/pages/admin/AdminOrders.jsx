import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  CalendarDays,
  IndianRupee,
  User,
  Mail,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Please login again");
      setLoading(false);
      return;
    }

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

      console.log("ALL ORDERS:", res.data);

      if (res.data.success) {
        setOrders(res.data.orders || []);
      } else {
        toast.error(res.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("GET ALL ORDERS ERROR:", error);

      toast.error(error?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="pl-[350px] min-h-screen bg-gray-100 pt-20 pr-10 font-serif">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />

          <p className="mt-4 text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pl-[350px] min-h-screen bg-gray-100 pt-20 pr-10 pb-10 font-serif">
      <div className="max-w-7xl mx-auto">
        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin - All Orders
            </h1>

            <p className="text-gray-500 mt-1">
              View and manage all customer orders
            </p>
          </div>

          <Button
            onClick={getAllOrders}
            variant="outline"
            className="bg-white cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* ========================= */}
        {/* ORDER COUNT */}
        {/* ========================= */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
          {/* Total Orders */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>

                  <h2 className="text-2xl font-bold text-gray-800 mt-1">
                    {orders.length}
                  </h2>
                </div>

                <div className="bg-orange-100 p-3 rounded-xl">
                  <ShoppingBag className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paid */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Paid Orders</p>

                  <h2 className="text-2xl font-bold text-green-600 mt-1">
                    {orders.filter((order) => order.status === "Paid").length}
                  </h2>
                </div>

                <div className="bg-green-100 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Orders</p>

                  <h2 className="text-2xl font-bold text-yellow-600 mt-1">
                    {
                      orders.filter((order) => order.status === "Pending")
                        .length
                    }
                  </h2>
                </div>

                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ========================= */}
        {/* NO ORDERS */}
        {/* ========================= */}

        {orders.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="py-20 text-center">
              <div className="flex justify-center">
                <div className="bg-orange-100 p-5 rounded-full">
                  <ShoppingBag className="w-12 h-12 text-orange-500" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mt-5">
                No Orders Found
              </h2>

              <p className="text-gray-500 mt-2">
                No customer orders are available yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          /* ========================= */
          /* DESKTOP TABLE */
          /* ========================= */

          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-4 text-sm font-bold text-gray-700">
                      Order ID
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-bold text-gray-700">
                      User
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-bold text-gray-700">
                      Products
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-bold text-gray-700">
                      Amount
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-bold text-gray-700">
                      Status
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-bold text-gray-700">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 hover:bg-orange-50/30 transition"
                    >
                      {/* ORDER ID */}
                      <td className="px-5 py-5">
                        <p className="font-mono text-xs text-gray-700 max-w-[180px] break-all">
                          {order._id}
                        </p>

                        {order.razorpayOrderId && (
                          <p className="text-[10px] text-gray-400 mt-1">
                            {order.razorpayOrderId}
                          </p>
                        )}
                      </td>

                      {/* USER */}
                      <td className="px-5 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-orange-500" />

                            <span className="font-semibold text-gray-800">
                              {order.user?.firstName || ""}{" "}
                              {order.user?.lastName || ""}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-gray-400" />

                            <span className="text-xs text-gray-500">
                              {order.user?.email || "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* PRODUCTS */}
                      <td className="px-5 py-5">
                        <div className="space-y-1 max-w-[230px]">
                          {order.products?.map((item, index) => {
                            const product = item.productId;

                            return (
                              <div key={index} className="text-sm">
                                <span className="font-medium text-gray-700">
                                  {product?.productName ||
                                    "Product unavailable"}
                                </span>

                                <span className="ml-2 text-gray-500">
                                  × {item.quantity}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* AMOUNT */}
                      <td className="px-5 py-5">
                        <div className="font-bold text-gray-800 flex items-center">
                          <IndianRupee className="w-4 h-4" />

                          {Number(order.amount || 0).toLocaleString("en-IN")}
                        </div>

                        <p className="text-xs text-gray-400 mt-1">
                          Tax: ₹{Number(order.tax || 0).toLocaleString("en-IN")}
                        </p>

                        <p className="text-xs text-gray-400">
                          Shipping: ₹
                          {Number(order.shipping || 0).toLocaleString("en-IN")}
                        </p>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-5">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                            order.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays className="w-4 h-4 text-orange-500" />

                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                },
                              )
                            : "N/A"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================= */}
        {/* MOBILE / TABLET CARDS */}
        {/* ========================= */}

        <div className="lg:hidden space-y-5">
          {orders.map((order) => (
            <Card key={order._id} className="bg-white shadow-sm">
              <CardContent className="p-5">
                {/* HEADER */}
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>

                    <p className="font-mono text-xs text-gray-700 break-all">
                      {order._id}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
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

                {/* USER */}
                <div className="mt-5 bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-gray-800">
                    {order.user?.firstName || ""} {order.user?.lastName || ""}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.user?.email || "N/A"}
                  </p>
                </div>

                {/* PRODUCTS */}
                <div className="mt-5">
                  <h3 className="font-bold text-gray-800 mb-3">Products</h3>

                  <div className="space-y-2">
                    {order.products?.map((item, index) => {
                      const product = item.productId;

                      return (
                        <div
                          key={index}
                          className="flex justify-between border-b pb-2"
                        >
                          <span className="text-sm text-gray-700">
                            {product?.productName || "Product unavailable"}
                          </span>

                          <span className="text-sm font-semibold">
                            × {item.quantity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AMOUNT */}
                <div className="mt-5 bg-orange-50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>

                    <span className="font-bold text-orange-600">
                      ₹{Number(order.amount || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* DATE */}
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                  <CalendarDays className="w-4 h-4 text-orange-500" />

                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN")
                    : "N/A"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
