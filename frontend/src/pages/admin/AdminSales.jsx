import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { IndianRupee, ShoppingBag, Package } from "lucide-react";

const AdminSales = () => {
  const [salesData, setSalesData] = useState([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
  });

  const [loading, setLoading] = useState(true);

  const getSalesData = async () => {
    try {
      setLoading(true);

      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        setSalesData(res.data.salesData || []);

        setSummary(
          res.data.summary || {
            totalSales: 0,
            totalOrders: 0,
            totalProducts: 0,
          },
        );
      }
    } catch (error) {
      console.error("GET SALES DATA ERROR:", error);

      toast.error(error.response?.data?.message || "Failed to load sales data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSalesData();
  }, []);

  // ==========================================
  // FORMAT GRAPH DATA
  // ==========================================

  const chartData = salesData.map((item) => ({
    date: item._id,
    sales: item.totalSales,
    orders: item.totalOrders,
  }));

  return (
    <div className="pl-[350px] pr-10 pt-20 pb-10 min-h-screen bg-gray-100 font-serif">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Sales Overview</h1>

        <p className="text-gray-500 mt-2">
          Track your store sales and order performance
        </p>
      </div>

      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* TOTAL SALES */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Sales</p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                ₹{Number(summary.totalSales || 0).toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="bg-orange-100 p-4 rounded-xl">
              <IndianRupee className="text-orange-600 w-7 h-7" />
            </div>
          </div>
        </div>

        {/* TOTAL ORDERS */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Paid Orders</p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {summary.totalOrders || 0}
              </h2>
            </div>

            <div className="bg-green-100 p-4 rounded-xl">
              <ShoppingBag className="text-green-600 w-7 h-7" />
            </div>
          </div>
        </div>

        {/* PRODUCTS SOLD */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Products Sold</p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                {summary.totalProducts || 0}
              </h2>
            </div>

            <div className="bg-blue-100 p-4 rounded-xl">
              <Package className="text-blue-600 w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          SALES GRAPH
      ========================================== */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Sales Performance</h2>

          <p className="text-sm text-gray-500 mt-1">Daily paid sales</p>
        </div>

        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-gray-500">Loading sales data...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="mx-auto w-12 h-12 text-gray-300" />

              <p className="mt-4 text-gray-500">No paid orders yet</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip
                  formatter={(value, name) => {
                    if (name === "sales") {
                      return [
                        `₹${Number(value).toLocaleString("en-IN")}`,
                        "Sales",
                      ];
                    }

                    return [value, "Orders"];
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="sales"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ==========================================
          DAILY SALES TABLE
      ========================================== */}

      {!loading && salesData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-8 overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Daily Sales</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-sm text-gray-600">Date</th>

                  <th className="text-left p-4 text-sm text-gray-600">
                    Orders
                  </th>

                  <th className="text-left p-4 text-sm text-gray-600">
                    Products Sold
                  </th>

                  <th className="text-left p-4 text-sm text-gray-600">Sales</th>
                </tr>
              </thead>

              <tbody>
                {[...salesData].reverse().map((item, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-4">{item._id}</td>

                    <td className="p-4">{item.totalOrders}</td>

                    <td className="p-4">{item.totalProducts}</td>

                    <td className="p-4 font-semibold text-orange-600">
                      ₹{Number(item.totalSales).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSales;
