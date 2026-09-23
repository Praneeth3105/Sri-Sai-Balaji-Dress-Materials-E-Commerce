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
  ReceiptText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

  const getStatusStyle = (status) => {
    if (status === "Paid") {
      return "bg-[#e8f1e8] text-[#536b53] border-[#cddfcd]";
    }

    if (status === "Pending") {
      return "bg-[#f7f0df] text-[#967a45] border-[#ead9b5]";
    }

    return "bg-[#f6e8e5] text-[#9a625a] border-[#e8cbc6]";
  };

  if (loading) {
    return (
      <div className="md:pl-[300px] min-h-screen bg-[#f8f4ee] pt-24 px-5 md:px-10">
        <div className="min-h-[65vh] flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#eee5da] flex items-center justify-center">
            <div className="w-7 h-7 border-[3px] border-[#d9c9b8] border-t-[#4a382c] rounded-full animate-spin" />
          </div>

          <p className="mt-4 text-sm text-[#7b6d64] font-[DM_Sans]">
            Loading user orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:pl-[300px] min-h-screen bg-[#f8f4ee] pt-24 pb-14 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-9">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="
                w-11
                h-11
                rounded-full
                bg-[#fffdf9]
                border-[#e5d9ca]
                text-[#4a382c]
                hover:bg-[#eee5da]
                cursor-pointer
              "
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#a78352] font-semibold font-[DM_Sans]">
                Admin Panel
              </p>

              <h1 className="text-3xl md:text-4xl font-[Cormorant_Garamond] font-semibold text-[#35271f]">
                User Orders
              </h1>

              <p className="text-sm text-[#7b6d64] font-[DM_Sans] mt-1">
                View all orders placed by this customer
              </p>
            </div>
          </div>

          {/* ORDER COUNT */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#fffdf9] border border-[#e5d9ca]">
            <div className="w-9 h-9 rounded-full bg-[#eee5da] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#a78352]" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#8b7d73]">
                Total Orders
              </p>

              <p className="text-lg font-semibold text-[#4a382c]">
                {orders.length}
              </p>
            </div>
          </div>
        </div>

        {/* EMPTY */}
        {orders.length === 0 ? (
          <Card className="border-[#e5d9ca] bg-[#fffdf9] rounded-3xl shadow-[0_15px_40px_rgba(74,56,44,0.06)]">
            <CardContent className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-[#f4efe7] flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-[#b99a6b]" />
              </div>

              <h2 className="text-2xl font-[Cormorant_Garamond] font-semibold text-[#35271f] mt-6">
                No Orders Found
              </h2>

              <p className="text-sm text-[#7b6d64] mt-2 font-[DM_Sans]">
                This user has not placed any orders yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-7">
            {orders.map((order) => (
              <Card
                key={order._id}
                className="
                  overflow-hidden
                  rounded-3xl
                  border-[#e5d9ca]
                  bg-[#fffdf9]
                  shadow-[0_15px_45px_rgba(74,56,44,0.07)]
                "
              >
                {/* ORDER HEADER */}
                <CardHeader className="bg-[#f4efe7] border-b border-[#e5d9ca] p-6 md:p-7">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#fffdf9] border border-[#e5d9ca] flex items-center justify-center shrink-0">
                        <ReceiptText className="w-5 h-5 text-[#a78352]" />
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8b7d73] font-[DM_Sans]">
                          Order ID
                        </p>

                        <p className="mt-1 font-mono text-sm font-semibold text-[#4a382c] break-all">
                          {order._id}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* DATE */}
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#fffdf9] border border-[#e5d9ca]">
                        <CalendarDays className="w-4 h-4 text-[#a78352]" />

                        <span className="text-xs text-[#6f625a]">
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

                      {/* STATUS */}
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-semibold border ${getStatusStyle(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                {/* ORDER CONTENT */}
                <CardContent className="p-6 md:p-7">
                  {/* CUSTOMER */}
                  {order.user && (
                    <div className="mb-7 rounded-2xl border border-[#e5d9ca] bg-[#faf7f2] p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-[#eee5da] flex items-center justify-center">
                          <User className="w-4 h-4 text-[#a78352]" />
                        </div>

                        <div>
                          <h3 className="font-[Cormorant_Garamond] text-xl font-semibold text-[#35271f]">
                            Customer Information
                          </h3>

                          <p className="text-xs text-[#8b7d73]">
                            Account details
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 bg-[#fffdf9] rounded-xl p-3 border border-[#eadfd3]">
                          <User className="w-4 h-4 text-[#a78352]" />

                          <span className="text-sm text-[#4a382c]">
                            {order.user.firstName || ""}{" "}
                            {order.user.lastName || ""}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 bg-[#fffdf9] rounded-xl p-3 border border-[#eadfd3]">
                          <Mail className="w-4 h-4 text-[#a78352]" />

                          <span className="text-sm text-[#4a382c] break-all">
                            {order.user.email || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PRODUCTS */}
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#eee5da] flex items-center justify-center">
                          <Package className="w-4 h-4 text-[#a78352]" />
                        </div>

                        <div>
                          <h3 className="font-[Cormorant_Garamond] text-xl font-semibold text-[#35271f]">
                            Ordered Products
                          </h3>

                          <p className="text-xs text-[#8b7d73]">
                            Items in this order
                          </p>
                        </div>
                      </div>

                      <span className="text-xs text-[#8b7d73]">
                        {order.products?.length || 0} items
                      </span>
                    </div>

                    <div className="space-y-3">
                      {order.products?.map((item, index) => {
                        const product = item.productId;

                        if (!product) {
                          return (
                            <div
                              key={index}
                              className="
                                border
                                border-[#e5d9ca]
                                rounded-2xl
                                p-4
                                bg-[#faf7f2]
                              "
                            >
                              <p className="text-sm text-[#7b6d64]">
                                Product no longer available
                              </p>

                              <p className="text-xs text-[#a0968f] mt-1">
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
                            className="
                              flex
                              flex-col
                              sm:flex-row
                              sm:items-center
                              justify-between
                              gap-5
                              rounded-2xl
                              border
                              border-[#e5d9ca]
                              bg-[#fffdf9]
                              p-4
                              hover:border-[#cdbb9f]
                              transition
                            "
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 rounded-xl bg-[#f4efe7] overflow-hidden border border-[#e5d9ca] shrink-0">
                                <img
                                  src={image}
                                  alt={product.productName}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div>
                                <h4 className="font-[Cormorant_Garamond] text-lg font-semibold text-[#35271f]">
                                  {product.productName}
                                </h4>

                                <p className="text-sm text-[#a78352] font-semibold mt-1">
                                  ₹
                                  {Number(
                                    product.productPrice || 0,
                                  ).toLocaleString("en-IN")}
                                </p>

                                <p className="text-xs text-[#8b7d73] mt-1">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>

                            <div className="sm:text-right">
                              <p className="text-[10px] uppercase tracking-wider text-[#8b7d73]">
                                Product Total
                              </p>

                              <p className="font-semibold text-lg text-[#4a382c] mt-1">
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

                  {/* TOTALS */}
                  <div className="mt-7 rounded-2xl bg-[#f4efe7] border border-[#e5d9ca] p-5 md:p-6">
                    <div className="max-w-md ml-auto">
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-[#7b6d64]">Subtotal</span>

                        <span className="text-sm font-semibold text-[#4a382c]">
                          ₹{Number(order.amount || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex justify-between py-2">
                        <span className="text-sm text-[#7b6d64]">Tax</span>

                        <span className="text-sm font-semibold text-[#4a382c]">
                          ₹{Number(order.tax || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex justify-between py-2">
                        <span className="text-sm text-[#7b6d64]">Shipping</span>

                        <span className="text-sm font-semibold text-[#4a382c]">
                          ₹{Number(order.shipping || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="border-t border-[#d9cabb] mt-3 pt-4 flex items-center justify-between">
                        <span className="font-[Cormorant_Garamond] text-xl font-semibold text-[#35271f]">
                          Total Amount
                        </span>

                        <span className="font-semibold text-xl text-[#4a382c] flex items-center">
                          <IndianRupee className="w-5 h-5" />

                          {Number(order.amount || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowUsersOrders;
