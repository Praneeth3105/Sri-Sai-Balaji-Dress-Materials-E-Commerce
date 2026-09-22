import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BarChart3,
  IndianRupee,
  ShoppingBag,
  Package,
  TrendingUp,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const AdminSales = () => {
  const [salesData, setSalesData] = useState([]);

  const [summary, setSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
  });

  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");

  // =========================================================
  // FETCH SALES
  // =========================================================

  const fetchSales = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        setSalesData(res.data.sales || []);

        setSummary({
          totalSales: res.data.totalSales || 0,
          totalOrders: res.data.totalOrders || 0,
          totalProducts: res.data.totalProducts || 0,
        });
      }
    } catch (error) {
      console.log("SALES ERROR:", error);

      toast.error(
        error?.response?.data?.message || "Unable to load sales data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // =========================================================
  // CHART DATA
  // =========================================================

  const chartData = useMemo(() => {
    return (salesData || []).map((item) => ({
      date: item?._id || "",
      totalSales: Number(item?.totalSales || 0),
      totalOrders: Number(item?.totalOrders || 0),
    }));
  }, [salesData]);

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  // =========================================================
  // CUSTOM TOOLTIP
  // =========================================================

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div className="bg-[#fffdf9] border border-[#dfd2c2] rounded-xl shadow-lg p-4">
        <p className="text-[10px] uppercase tracking-wider text-[#a78352] mb-2">
          {label}
        </p>

        <p className="text-sm text-[#4a382c]">
          Sales:{" "}
          <span className="font-semibold">
            {formatCurrency(payload[0]?.value)}
          </span>
        </p>

        {payload[1] && (
          <p className="text-sm text-[#7b6d64] mt-1">
            Orders: <span className="font-semibold">{payload[1]?.value}</span>
          </p>
        )}
      </div>
    );
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

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 bg-[#fffdf9] border border-[#e5d9ca] rounded-2xl"
              />
            ))}
          </div>

          <div className="h-[450px] bg-[#fffdf9] border border-[#e5d9ca] rounded-2xl" />
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

      <div className="relative px-4 sm:px-6 lg:px-10 max-w-[1450px] mx-auto">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-[#a78352]" />

              <span className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold">
                Business Insights
              </span>
            </div>

            <h1 className="font-[Cormorant_Garamond] text-5xl md:text-6xl text-[#382b24] leading-none">
              Sales
              <span className="italic text-[#a78352]"> Overview</span>
            </h1>

            <div className="w-12 h-px bg-[#b99a6b] mt-5 mb-4" />

            <p className="text-sm text-[#7b6d64]">
              Track your store's sales and order activity.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchSales}
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full border border-[#d8c9b8] bg-[#fffdf9] text-[#66564a] hover:bg-[#eee5da] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* ===================================================
            SUMMARY CARDS
        ==================================================== */}

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {/* Total Sales */}
          <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#88786d]">
                  Total Sales
                </p>

                <p className="font-[Cormorant_Garamond] text-4xl text-[#44352c] mt-3">
                  {formatCurrency(summary.totalSales)}
                </p>
              </div>

              <div className="w-11 h-11 rounded-full bg-[#eee5da] flex items-center justify-center">
                <IndianRupee
                  className="w-5 h-5 text-[#a78352]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-5 text-xs text-[#7d8a6b]">
              <TrendingUp className="w-3.5 h-3.5" />
              Overall revenue
            </div>
          </div>

          {/* Orders */}
          <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#88786d]">
                  Total Orders
                </p>

                <p className="font-[Cormorant_Garamond] text-4xl text-[#44352c] mt-3">
                  {summary.totalOrders}
                </p>
              </div>

              <div className="w-11 h-11 rounded-full bg-[#eee5da] flex items-center justify-center">
                <ShoppingBag
                  className="w-5 h-5 text-[#a78352]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <p className="text-xs text-[#88786d] mt-5">Orders recorded</p>
          </div>

          {/* Products */}
          <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#88786d]">
                  Products Sold
                </p>

                <p className="font-[Cormorant_Garamond] text-4xl text-[#44352c] mt-3">
                  {summary.totalProducts}
                </p>
              </div>

              <div className="w-11 h-11 rounded-full bg-[#eee5da] flex items-center justify-center">
                <Package className="w-5 h-5 text-[#a78352]" strokeWidth={1.5} />
              </div>
            </div>

            <p className="text-xs text-[#88786d] mt-5">Total units sold</p>
          </div>
        </div>

        {/* ===================================================
            SALES CHART
        ==================================================== */}

        <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] shadow-sm overflow-hidden">
          <div className="px-6 md:px-8 py-6 border-b border-[#eadfd3] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#a78352] font-semibold">
                Revenue Trend
              </p>

              <h2 className="font-[Cormorant_Garamond] text-3xl text-[#44352c] mt-1">
                Daily Sales
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#7b6d64]">
              <CalendarDays className="w-4 h-4 text-[#a78352]" />
              Sales performance
            </div>
          </div>

          <div className="p-5 md:p-8">
            {chartData.length > 0 ? (
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 15,
                      left: 5,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid stroke="#eadfd3" strokeDasharray="4 4" />

                    <XAxis
                      dataKey="date"
                      tick={{
                        fill: "#82746a",
                        fontSize: 11,
                      }}
                      axisLine={{
                        stroke: "#dfd2c2",
                      }}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{
                        fill: "#82746a",
                        fontSize: 11,
                      }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) =>
                        `₹${Number(value).toLocaleString("en-IN")}`
                      }
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Line
                      type="monotone"
                      dataKey="totalSales"
                      name="Sales"
                      stroke="#a78352"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#a78352",
                        strokeWidth: 0,
                      }}
                      activeDot={{
                        r: 6,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#eee5da] flex items-center justify-center mb-5">
                  <BarChart3 className="w-7 h-7 text-[#a78352]" />
                </div>

                <h3 className="font-[Cormorant_Garamond] text-2xl text-[#44352c]">
                  No Sales Data
                </h3>

                <p className="text-sm text-[#7b6d64] mt-2">
                  Sales information will appear here once orders are recorded.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================
            DAILY SALES TABLE
        ==================================================== */}

        <div className="mt-8 bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] overflow-hidden shadow-sm">
          <div className="px-6 md:px-8 py-6 border-b border-[#eadfd3]">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#a78352] font-semibold">
              Sales Records
            </p>

            <h2 className="font-[Cormorant_Garamond] text-3xl text-[#44352c] mt-1">
              Daily Breakdown
            </h2>
          </div>

          {salesData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f5efe7] border-b border-[#eadfd3]">
                    <th className="text-left px-6 py-4 text-[10px] uppercase tracking-wider text-[#806f63] font-semibold">
                      Date
                    </th>

                    <th className="text-right px-6 py-4 text-[10px] uppercase tracking-wider text-[#806f63] font-semibold">
                      Sales
                    </th>

                    <th className="text-right px-6 py-4 text-[10px] uppercase tracking-wider text-[#806f63] font-semibold">
                      Orders
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {salesData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#f0e7dc] last:border-0 hover:bg-[#faf7f2] transition-colors"
                    >
                      <td className="px-6 py-5 text-sm text-[#5e5047]">
                        {item?._id}
                      </td>

                      <td className="px-6 py-5 text-right font-[Cormorant_Garamond] text-xl text-[#9a784e]">
                        {formatCurrency(item?.totalSales)}
                      </td>

                      <td className="px-6 py-5 text-right text-sm text-[#5e5047]">
                        {item?.totalOrders || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-sm text-[#7b6d64]">
              No daily sales records available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSales;
