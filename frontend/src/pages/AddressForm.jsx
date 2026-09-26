import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addAddress,
  deleteAddress,
  setselectedAddress,
  setCart,
} from "@/redux/productSlice";

import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Check,
  MapPin,
  Plus,
  Trash2,
  CreditCard,
  ShieldCheck,
  Truck,
  RotateCcw,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";

const emptyAddress = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

const AddressForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, addresses, selectedAddress } = useSelector(
    (store) => store.product,
  );

  const [formData, setFormData] = useState(emptyAddress);

  const [showForm, setShowForm] = useState(
    !addresses || addresses.length === 0,
  );

  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!addresses || addresses.length === 0) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [addresses]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const requiredFields = [
      "fullName",
      "phone",
      "email",
      "address",
      "city",
      "state",
      "zip",
      "country",
    ];

    const isEmpty = requiredFields.some((field) => !formData[field]?.trim());

    if (isEmpty) {
      toast.error("Please fill all address details");
      return;
    }

    const newAddressIndex = addresses?.length || 0;

    dispatch(addAddress({ ...formData }));
    dispatch(setselectedAddress(newAddressIndex));

    toast.success("Address saved successfully");

    setShowForm(false);
    setFormData({ ...emptyAddress });
  };

  const handleDelete = (e, index) => {
    e.stopPropagation();

    const currentLength = addresses?.length || 0;

    dispatch(deleteAddress(index));

    if (selectedAddress === index) {
      dispatch(setselectedAddress(null));
    }

    if (
      selectedAddress !== null &&
      selectedAddress !== undefined &&
      selectedAddress > index
    ) {
      dispatch(setselectedAddress(selectedAddress - 1));
    }

    if (currentLength === 1) {
      setShowForm(true);
      dispatch(setselectedAddress(null));
    }

    toast.success("Address deleted successfully");
  };

  const handleSelectAddress = (index) => {
    dispatch(setselectedAddress(index));
    toast.success("Address selected");
  };

  const handleAddAnother = () => {
    setFormData({ ...emptyAddress });
    setShowForm(true);
  };

  const subtotal = Number(cart?.totalPrice || 0);
  const shipping = subtotal > 299 ? 0 : 10;
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  const handlePayment = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (selectedAddress === null || selectedAddress === undefined) {
      toast.error("Please select a delivery address");
      return;
    }

    const selected = addresses?.[selectedAddress];

    if (!selected) {
      toast.error("Please select a valid delivery address");
      return;
    }

    try {
      setPaymentLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
        {
          products: cart.items
            .filter((item) => item?.productId?._id)
            .map((item) => ({
              productId: item.productId._id,
              color: item.color || "",
              size: item.size || "",
              quantity: item.quantity,
            })),

          tax: tax,
          shipping: shipping,
          amount: total,
          currency: "INR",
          address: selected,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = response.data;

      if (!data.success) {
        toast.error(data.message || "Unable to create order");
        setPaymentLoading(false);
        return;
      }

      if (!window.Razorpay) {
        toast.error("Razorpay is not loaded. Please refresh the page.");

        setPaymentLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,

        name: "Sri Sai Balaji Dress Materials",
        description: "Order Payment",

        prefill: {
          name: selected.fullName,
          email: selected.email,
          contact: selected.phone,
        },

        theme: {
          color: "#4a382c",
        },

        handler: async function (paymentResponse) {
          try {
            console.log("Razorpay Payment Response:", paymentResponse);

            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
              paymentResponse,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            if (verifyResponse.data.success) {
              toast.success("Payment Successful!");

              dispatch(
                setCart({
                  items: [],
                  totalPrice: 0,
                }),
              );

              navigate("/order-success");
            } else {
              toast.error(
                verifyResponse.data.message || "Payment verification failed",
              );
            }
          } catch (error) {
            console.error("PAYMENT VERIFICATION ERROR:", error);

            toast.error(
              error.response?.data?.message || "Error verifying payment",
            );
          } finally {
            setPaymentLoading(false);
          }
        },

        modal: {
          ondismiss: async function () {
            console.log("Razorpay window closed");

            try {
              await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
                {
                  razorpay_order_id: data.order.id,
                  paymentFailed: true,
                },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                },
              );
            } catch (error) {
              console.log("Payment cancellation error:", error);
            }

            toast.error("Payment Cancelled");

            setPaymentLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", async function () {
        try {
          await axios.post(
            `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
            {
              razorpay_order_id: data.order.id,
              paymentFailed: true,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
        } catch (error) {
          console.log("Payment failed update error:", error);
        }

        toast.error("Payment Failed. Please try again.");

        setPaymentLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("ORDER PAYMENT ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong while processing payment",
      );

      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4ee] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              text-[#7b6d64]
              hover:text-[#4a382c]
              transition
              cursor-pointer
              mb-5
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <p className="text-xs uppercase tracking-[0.25em] text-[#a78352] font-[DM_Sans] font-semibold">
            Secure Checkout
          </p>

          <h1 className="mt-2 text-4xl md:text-5xl font-[Cormorant_Garamond] font-semibold text-[#35271f]">
            Complete Your Order
          </h1>

          <p className="mt-2 text-sm md:text-base text-[#7b6d64] font-[DM_Sans]">
            Enter your delivery address and review your order
          </p>
        </div>

        {/* CHECKOUT STEPS */}
        <div className="hidden md:flex items-center gap-3 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#4a382c] text-white flex items-center justify-center text-xs font-semibold">
              1
            </div>

            <span className="text-sm font-medium text-[#4a382c]">Delivery</span>
          </div>

          <div className="w-16 h-px bg-[#d9cabb]" />

          <div className="flex items-center gap-2 text-[#a78352]">
            <div className="w-8 h-8 rounded-full bg-[#eee5da] flex items-center justify-center text-xs font-semibold">
              2
            </div>

            <span className="text-sm">Payment</span>
          </div>
        </div>

        {/* MAIN */}
        <div
          className={
            showForm
              ? "max-w-4xl mx-auto"
              : "grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start"
          }
        >
          {/* LEFT */}
          <div className="w-full">
            {/* ADDRESS FORM */}
            {showForm ? (
              <div
                className="
                  bg-[#fffdf9]
                  rounded-3xl
                  border border-[#e5d9ca]
                  overflow-hidden
                  shadow-[0_18px_50px_rgba(74,56,44,0.07)]
                "
              >
                {/* HEADER */}
                <div className="px-7 md:px-9 py-7 border-b border-[#eadfd3] bg-[#f4efe7]">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#fffdf9] border border-[#e5d9ca] flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#a78352]" />
                    </div>

                    <div>
                      <h2 className="text-2xl md:text-3xl font-[Cormorant_Garamond] font-semibold text-[#35271f]">
                        Delivery Address
                      </h2>

                      <p className="mt-1 text-sm text-[#7b6d64] font-[DM_Sans]">
                        Where should we deliver your order?
                      </p>
                    </div>
                  </div>
                </div>

                {/* FORM */}
                <div className="p-7 md:p-9 space-y-6">
                  {/* NAME */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-sm font-semibold text-[#4a382c]"
                    >
                      Full Name
                    </Label>

                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="
                        h-12
                        rounded-xl
                        border-[#e5d9ca]
                        bg-[#fffdf9]
                        focus-visible:ring-[#b99a6b]
                      "
                    />
                  </div>

                  {/* PHONE + EMAIL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-semibold text-[#4a382c]"
                      >
                        Phone Number
                      </Label>

                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="
                          h-12
                          rounded-xl
                          border-[#e5d9ca]
                          bg-[#fffdf9]
                          focus-visible:ring-[#b99a6b]
                        "
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-semibold text-[#4a382c]"
                      >
                        Email Address
                      </Label>

                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="
                          h-12
                          rounded-xl
                          border-[#e5d9ca]
                          bg-[#fffdf9]
                          focus-visible:ring-[#b99a6b]
                        "
                      />
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-sm font-semibold text-[#4a382c]"
                    >
                      Street Address
                    </Label>

                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="#123 Street, Area"
                      value={formData.address}
                      onChange={handleChange}
                      className="
                        h-12
                        rounded-xl
                        border-[#e5d9ca]
                        bg-[#fffdf9]
                        focus-visible:ring-[#b99a6b]
                      "
                    />
                  </div>

                  {/* CITY + STATE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        className="text-sm font-semibold text-[#4a382c]"
                      >
                        City
                      </Label>

                      <Input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="Vijayawada"
                        value={formData.city}
                        onChange={handleChange}
                        className="
                          h-12
                          rounded-xl
                          border-[#e5d9ca]
                          bg-[#fffdf9]
                          focus-visible:ring-[#b99a6b]
                        "
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="state"
                        className="text-sm font-semibold text-[#4a382c]"
                      >
                        State
                      </Label>

                      <Input
                        id="state"
                        name="state"
                        type="text"
                        placeholder="Andhra Pradesh"
                        value={formData.state}
                        onChange={handleChange}
                        className="
                          h-12
                          rounded-xl
                          border-[#e5d9ca]
                          bg-[#fffdf9]
                          focus-visible:ring-[#b99a6b]
                        "
                      />
                    </div>
                  </div>

                  {/* ZIP + COUNTRY */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="zip"
                        className="text-sm font-semibold text-[#4a382c]"
                      >
                        Zip Code
                      </Label>

                      <Input
                        id="zip"
                        name="zip"
                        type="text"
                        placeholder="520001"
                        value={formData.zip}
                        onChange={handleChange}
                        className="
                          h-12
                          rounded-xl
                          border-[#e5d9ca]
                          bg-[#fffdf9]
                          focus-visible:ring-[#b99a6b]
                        "
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="country"
                        className="text-sm font-semibold text-[#4a382c]"
                      >
                        Country
                      </Label>

                      <Input
                        id="country"
                        name="country"
                        type="text"
                        placeholder="India"
                        value={formData.country}
                        onChange={handleChange}
                        className="
                          h-12
                          rounded-xl
                          border-[#e5d9ca]
                          bg-[#fffdf9]
                          focus-visible:ring-[#b99a6b]
                        "
                      />
                    </div>
                  </div>

                  {/* SAVE */}
                  <div className="pt-3">
                    <Button
                      type="button"
                      onClick={handleSave}
                      className="
                        w-full
                        h-12
                        rounded-xl
                        bg-[#4a382c]
                        hover:bg-[#35271f]
                        text-white
                        font-[DM_Sans]
                        font-semibold
                        cursor-pointer
                        shadow-[0_10px_25px_rgba(74,56,44,0.15)]
                      "
                    >
                      Save & Continue
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* SAVED ADDRESSES */
              <div
                className="
                  bg-[#fffdf9]
                  rounded-3xl
                  border border-[#e5d9ca]
                  p-6 md:p-8
                  shadow-[0_18px_50px_rgba(74,56,44,0.07)]
                "
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#eee5da] flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[#a78352]" />
                      </div>

                      <h2 className="text-2xl md:text-3xl font-[Cormorant_Garamond] font-semibold text-[#35271f]">
                        Saved Addresses
                      </h2>
                    </div>

                    <p className="text-sm text-[#7b6d64] font-[DM_Sans] mt-2">
                      Select an address for delivery
                    </p>
                  </div>

                  <span className="self-start sm:self-auto text-xs font-semibold uppercase tracking-wider text-[#7b6d64] bg-[#f4efe7] px-4 py-2 rounded-full">
                    {addresses?.length || 0} saved
                  </span>
                </div>

                <div className="space-y-4">
                  {addresses?.map((address, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectAddress(index)}
                      className={`
                        relative
                        rounded-2xl
                        p-5
                        border
                        cursor-pointer
                        transition-all
                        duration-200
                        ${
                          selectedAddress === index
                            ? "border-[#a78352] bg-[#f8f4ee] shadow-[0_8px_25px_rgba(74,56,44,0.08)]"
                            : "border-[#e5d9ca] bg-[#fffdf9] hover:border-[#cdbb9f] hover:bg-[#faf7f2]"
                        }
                      `}
                    >
                      {/* SELECTED */}
                      {selectedAddress === index && (
                        <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#4a382c] text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}

                      <div className="pr-10">
                        <h3 className="text-xl font-[Cormorant_Garamond] font-semibold text-[#35271f]">
                          {address.fullName}
                        </h3>

                        <div className="mt-4 space-y-1.5 text-sm text-[#6f625a] font-[DM_Sans]">
                          <p>{address.address}</p>

                          <p>
                            {address.city}, {address.state} - {address.zip}
                          </p>

                          <p>{address.country}</p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#eadfd3] space-y-1.5">
                          <p className="text-xs text-[#7b6d64]">
                            <span className="font-semibold text-[#4a382c]">
                              Phone:
                            </span>{" "}
                            {address.phone}
                          </p>

                          <p className="text-xs text-[#7b6d64] break-all">
                            <span className="font-semibold text-[#4a382c]">
                              Email:
                            </span>{" "}
                            {address.email}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => handleDelete(e, index)}
                        className="
                          mt-5
                          h-9
                          rounded-lg
                          border-[#ead2cd]
                          text-[#9a625a]
                          hover:bg-[#f6e8e5]
                          hover:text-[#8c5048]
                          cursor-pointer
                          text-xs
                        "
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Delete Address
                      </Button>
                    </div>
                  ))}
                </div>

                {/* ADD ANOTHER */}
                <div className="mt-6">
                  <Button
                    type="button"
                    onClick={handleAddAnother}
                    variant="outline"
                    className="
                      h-11
                      rounded-xl
                      border-[#cdbb9f]
                      text-[#4a382c]
                      hover:bg-[#f4efe7]
                      cursor-pointer
                      font-[DM_Sans]
                    "
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Address
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ORDER SUMMARY */}
          {!showForm && (
            <div className="w-full lg:sticky lg:top-28">
              <Card
                className="
                  w-full
                  border-[#e5d9ca]
                  bg-[#fffdf9]
                  rounded-3xl
                  shadow-[0_18px_50px_rgba(74,56,44,0.08)]
                  overflow-hidden
                "
              >
                <CardHeader className="bg-[#f4efe7] border-b border-[#e5d9ca] p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fffdf9] border border-[#e5d9ca] flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-[#a78352]" />
                    </div>

                    <div>
                      <CardTitle className="text-2xl font-[Cormorant_Garamond] font-semibold text-[#35271f]">
                        Order Summary
                      </CardTitle>

                      <p className="text-xs text-[#8b7d73] mt-1">
                        Review before payment
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 p-6">
                  {/* SUBTOTAL */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#7b6d64]">Subtotal</span>

                    <span className="text-sm font-semibold text-[#4a382c]">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* ITEMS */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#7b6d64]">Items</span>

                    <span className="text-sm font-semibold text-[#4a382c]">
                      {cart?.items?.length || 0}
                    </span>
                  </div>

                  {/* SHIPPING */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#7b6d64]">Shipping</span>

                    <span className="text-sm font-semibold">
                      {shipping === 0 ? (
                        <span className="text-[#536b53]">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  {/* TAX */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#7b6d64]">Tax (5%)</span>

                    <span className="text-sm font-semibold text-[#4a382c]">
                      ₹{tax.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* TOTAL */}
                  <div className="border-t border-[#eadfd3] pt-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-[Cormorant_Garamond] font-semibold text-[#35271f]">
                        Total
                      </span>

                      <span className="text-2xl font-semibold text-[#4a382c]">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* SHIPPING MESSAGE */}
                  <div className="rounded-xl bg-[#f4efe7] border border-[#e5d9ca] p-4">
                    {shipping === 0 ? (
                      <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-[#a78352] shrink-0" />

                        <div>
                          <p className="text-sm font-semibold text-[#4a382c]">
                            Free shipping unlocked
                          </p>

                          <p className="text-xs text-[#7b6d64] mt-1">
                            Your order qualifies for free delivery.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-[#a78352] shrink-0" />

                        <div>
                          <p className="text-sm font-semibold text-[#4a382c]">
                            Free shipping over ₹299
                          </p>

                          <p className="text-xs text-[#7b6d64] mt-1">
                            Add more items to unlock free delivery.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PROMO */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo Code"
                      className="
                        h-11
                        rounded-xl
                        border-[#e5d9ca]
                        bg-[#fffdf9]
                        focus-visible:ring-[#b99a6b]
                      "
                    />

                    <Button
                      type="button"
                      variant="outline"
                      className="
                        h-11
                        rounded-xl
                        border-[#cdbb9f]
                        text-[#4a382c]
                        hover:bg-[#f4efe7]
                        cursor-pointer
                      "
                    >
                      Apply
                    </Button>
                  </div>

                  {/* PAYMENT */}
                  <Button
                    type="button"
                    onClick={handlePayment}
                    disabled={
                      selectedAddress === null ||
                      selectedAddress === undefined ||
                      paymentLoading
                    }
                    className="
                      w-full
                      h-12
                      rounded-xl
                      bg-[#4a382c]
                      hover:bg-[#35271f]
                      text-white
                      font-[DM_Sans]
                      font-semibold
                      cursor-pointer
                      disabled:opacity-50
                      shadow-[0_10px_25px_rgba(74,56,44,0.15)]
                    "
                  >
                    {paymentLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Proceed to Payment
                      </span>
                    )}
                  </Button>

                  {/* TRUST */}
                  <div className="pt-5 border-t border-[#eadfd3] space-y-3">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-[#a78352]" />

                      <span className="text-xs text-[#6f625a]">
                        Secure checkout
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Truck className="w-4 h-4 text-[#a78352]" />

                      <span className="text-xs text-[#6f625a]">
                        Free shipping over ₹299
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <RotateCcw className="w-4 h-4 text-[#a78352]" />

                      <span className="text-xs text-[#6f625a]">
                        30-day return policy
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <LockKeyhole className="w-4 h-4 text-[#a78352]" />

                      <span className="text-xs text-[#6f625a]">
                        Protected payment with Razorpay
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
