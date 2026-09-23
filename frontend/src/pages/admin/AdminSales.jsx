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
  // FETCH SALES DATA
  // =========================================================

  const getSalesData = async () => {
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

      console.log("SALES API RESPONSE:", res.data);

      if (res.data.success) {
        setSalesData(res.data.salesData || []);

        setSummary({
          totalSales: res.data.summary?.totalSales || 0,
          totalOrders: res.data.summary?.totalOrders || 0,
          totalProducts: res.data.summary?.totalProducts || 0,
        });
      } else {
        toast.error(res.data.message || "Failed to fetch sales");
      }
    } catch (error) {
      console.error("GET SALES ERROR:", error);

      toast.error(
        error?.response?.data?.message || "Unable to fetch sales data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSalesData();
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

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

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
      <div className="rounded-xl border border-[#dfd2c2] bg-[#fffdf9] p-4 shadow-xl">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a78352]">
          {label}
        </p>

        <p className="text-sm text-[#4a382c]">
          Sales:{" "}
          <span className="font-semibold">
            {formatCurrency(payload[0]?.value)}
          </span>
        </p>

        {payload[1] && (
          <p className="mt-1 text-sm text-[#7b6d64]">
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
      <div className="min-h-screen bg-[#f8f4ee] pl-0 lg:pl-[300px] pt-[125px] pb-24 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1450px] animate-pulse">
          <div className="mb-4 h-3 w-32 rounded bg-[#e5d9ca]" />

          <div className="mb-5 h-14 w-80 rounded bg-[#e5d9ca]" />

          <div className="mb-12 h-px w-14 bg-[#d6c0a0]" />

          <div className="mb-8 grid gap-5 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 rounded-[1.5rem] border border-[#e5d9ca] bg-[#fffdf9]"
              />
            ))}
          </div>

          <div className="h-[500px] rounded-[1.5rem] border border-[#e5d9ca] bg-[#fffdf9]" />
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f4ee] text-[#3d3028] pl-0 lg:pl-[300px] pt-[125px] pb-28">
      {/* =====================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#ead8bd]/25 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 h-[450px] w-[450px] rounded-full bg-[#ead6d0]/20 blur-3xl" />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#a78352]" strokeWidth={1.6} />

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a78352]">
                Business Insights
              </span>
            </div>

            <h1 className="font-[Cormorant_Garamond] text-5xl leading-none text-[#382b24] md:text-6xl">
              Sales <span className="italic text-[#a78352]">Overview</span>
            </h1>

            <div className="mb-4 mt-5 h-px w-14 bg-[#b99a6b]" />

            <p className="text-sm leading-6 text-[#7b6d64]">
              Track your store&apos;s sales and order activity.
            </p>
          </div>

          {/* REFRESH */}

          <button
            type="button"
            onClick={getSalesData}
            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-full border border-[#d8c9b8] bg-[#fffdf9] px-5 text-sm text-[#66564a] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#eee5da] hover:shadow-md md:self-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* ===================================================
            SUMMARY CARDS
        ==================================================== */}

        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* TOTAL SALES */}

          <div className="group rounded-[1.5rem] border border-[#e5d9ca] bg-[#fffdf9] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#88786d]">
                  Total Sales
                </p>

                <h2 className="mt-3 font-[Cormorant_Garamond] text-4xl text-[#44352c]">
                  {formatCurrency(summary.totalSales)}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eee5da]">
                <IndianRupee
                  className="h-5 w-5 text-[#a78352]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-[#71806a]">
              <TrendingUp className="h-3.5 w-3.5" />
              Overall revenue
            </div>
          </div>

          {/* TOTAL ORDERS */}

          <div className="group rounded-[1.5rem] border border-[#e5d9ca] bg-[#fffdf9] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#88786d]">
                  Total Orders
                </p>

                <h2 className="mt-3 font-[Cormorant_Garamond] text-4xl text-[#44352c]">
                  {summary.totalOrders}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eee5da]">
                <ShoppingBag
                  className="h-5 w-5 text-[#a78352]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <p className="mt-6 text-xs text-[#88786d]">Orders recorded</p>
          </div>

          {/* PRODUCTS SOLD */}

          <div className="group rounded-[1.5rem] border border-[#e5d9ca] bg-[#fffdf9] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#88786d]">
                  Products Sold
                </p>

                <h2 className="mt-3 font-[Cormorant_Garamond] text-4xl text-[#44352c]">
                  {summary.totalProducts}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eee5da]">
                <Package className="h-5 w-5 text-[#a78352]" strokeWidth={1.5} />
              </div>
            </div>

            <p className="mt-6 text-xs text-[#88786d]">Total units sold</p>
          </div>
        </div>

        {/* ===================================================
            SALES CHART
        ==================================================== */}

        <div className="mb-10 overflow-hidden rounded-[1.5rem] border border-[#e5d9ca] bg-[#fffdf9] shadow-sm">
          {/* CHART HEADER */}

          <div className="flex flex-col gap-3 border-b border-[#eadfd3] px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a78352]">
                Revenue Trend
              </p>

              <h2 className="mt-1 font-[Cormorant_Garamond] text-3xl text-[#44352c]">
                Daily Sales
              </h2>

              <p className="mt-1 text-xs text-[#88786d]">
                Sales and orders over time
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#7b6d64]">
              <CalendarDays className="h-4 w-4 text-[#a78352]" />
              Sales performance
            </div>
          </div>

          {/* CHART */}

          <div className="p-5 md:p-8">
            {chartData.length === 0 ? (
              <div className="flex h-[400px] flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eee5da]">
                  <BarChart3
                    className="h-7 w-7 text-[#a78352]"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="font-[Cormorant_Garamond] text-2xl text-[#44352c]">
                  No Sales Data
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#7b6d64]">
                  Paid orders will appear here once sales are recorded.
                </p>
              </div>
            ) : (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 15,
                      right: 20,
                      left: 5,
                      bottom: 10,
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
            )}
          </div>
        </div>

        {/* ===================================================
            SALES TABLE
        ==================================================== */}

        <div className="overflow-hidden rounded-[1.5rem] border border-[#e5d9ca] bg-[#fffdf9] shadow-sm">
          {/* TABLE HEADER */}

          <div className="border-b border-[#eadfd3] px-6 py-6 md:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#a78352]">
              Sales Records
            </p>

            <h2 className="mt-1 font-[Cormorant_Garamond] text-3xl text-[#44352c]">
              Daily Breakdown
            </h2>

            <p className="mt-1 text-xs text-[#88786d]">
              Overview of your daily store performance
            </p>
          </div>

          {/* EMPTY */}

          {salesData.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#eee5da]">
                <Package className="h-6 w-6 text-[#a78352]" strokeWidth={1.5} />
              </div>

              <h3 className="font-[Cormorant_Garamond] text-2xl text-[#44352c]">
                No Sales Records
              </h3>

              <p className="mt-2 text-sm text-[#7b6d64]">
                No sales information is available yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#eadfd3] bg-[#f5efe7]">
                    <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-[#806f63]">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-[#806f63]">
                      Total Sales
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-[#806f63]">
                      Total Orders
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-[#806f63]">
                      Products Sold
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {salesData.map((item, index) => (
                    <tr
                      key={`${item?._id}-${index}`}
                      className="border-b border-[#f0e7dc] last:border-0 transition-colors hover:bg-[#faf7f2]"
                    >
                      <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-[#4a382c]">
                        {item?._id || "-"}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-right font-[Cormorant_Garamond] text-xl text-[#9a784e]">
                        {formatCurrency(item?.totalSales)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-right text-sm text-[#5e5047]">
                        {item?.totalOrders || 0}
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-right text-sm text-[#5e5047]">
                        {item?.totalProducts || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ===================================================
            BOTTOM SPACE / FOOTER GAP
        ==================================================== */}

        <div className="h-16" />
      </div>
    </div>
  );
};

export default AdminSales;
