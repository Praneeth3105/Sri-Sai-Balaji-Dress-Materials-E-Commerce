import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
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

const AddressForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, addresses, selectedAddress } = useSelector(
    (store) => store.product,
  );

  // =========================
  // ADDRESS FORM STATE
  // =========================

  const [formData, setformData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [showForm, setShowForm] = useState(
    addresses?.length > 0 ? false : true,
  );

  const [paymentLoading, setPaymentLoading] = useState(false);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setformData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SAVE ADDRESS
  // =========================

  const handleSave = () => {
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zip ||
      !formData.country
    ) {
      toast.error("Please fill all address details");
      return;
    }

    dispatch(addAddress(formData));

    // Select newly added address
    dispatch(setselectedAddress(addresses?.length || 0));

    toast.success("Address saved successfully");

    // Hide address form
    setShowForm(false);

    // Clear form
    setformData({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    });
  };

  // =========================
  // DELETE ADDRESS
  // =========================

  const handleDelete = (e, index) => {
    e.stopPropagation();

    dispatch(deleteAddress(index));

    toast.success("Address deleted successfully");

    if (addresses.length === 1) {
      setShowForm(true);
      dispatch(setselectedAddress(null));
    }

    if (selectedAddress === index) {
      dispatch(setselectedAddress(null));
    }
  };

  // =========================
  // SELECT ADDRESS
  // =========================

  const handleSelectAddress = (index) => {
    dispatch(setselectedAddress(index));

    toast.success("Address selected");
  };

  // =========================
  // ORDER CALCULATION
  // =========================

  const subtotal = cart?.totalPrice || 0;

  const shipping = subtotal > 299 ? 0 : 10;

  const tax = Number((subtotal * 0.05).toFixed(2));

  const total = subtotal + shipping + tax;

  // =========================
  // PAYMENT
  // =========================

  const handlePayment = async () => {
    const accessToken = localStorage.getItem("accessToken");

    // Login check
    if (!accessToken) {
      toast.error("Please login to continue");
      return;
    }

    // Cart check
    if (!cart?.items || cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Address check
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

      // =========================
      // CREATE ORDER
      // =========================

      const response = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
        {
          products: cart.items.map((item) => ({
            productId: item.productId?._id,
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

      console.log("Create Order Response:", data);

      if (!data.success) {
        toast.error(data.message || "Unable to create order");
        setPaymentLoading(false);
        return;
      }

      // =========================
      // CHECK RAZORPAY
      // =========================

      if (!window.Razorpay) {
        toast.error(
          "Razorpay is not loaded. Please refresh the page and try again.",
        );

        setPaymentLoading(false);
        return;
      }

      // =========================
      // RAZORPAY OPTIONS
      // =========================

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
          color: "#ea580c",
        },

        // =========================
        // PAYMENT SUCCESS
        // =========================

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

            console.log("Verify Payment Response:", verifyResponse.data);

            if (verifyResponse.data.success) {
              toast.success("Payment Successful!");

              // Empty Redux cart
              dispatch(
                setCart({
                  items: [],
                  totalPrice: 0,
                }),
              );

              // Go to success page
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

        // =========================
        // PAYMENT WINDOW CLOSED
        // =========================

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

      // =========================
      // CREATE RAZORPAY
      // =========================

      const razorpay = new window.Razorpay(options);

      // =========================
      // PAYMENT FAILED
      // =========================

      razorpay.on("payment.failed", async function (response) {
        console.log("Payment Failed:", response);

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

      // =========================
      // OPEN RAZORPAY
      // =========================

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
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ========================= */}
        {/* PAGE TITLE */}
        {/* ========================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-gray-800">
            Checkout
          </h1>

          <p className="text-gray-500 font-serif mt-1">
            Enter your delivery address and review your order
          </p>
        </div>

        {/* ========================= */}
        {/* MAIN CONTENT */}
        {/* ========================= */}

        <div
          className={
            showForm
              ? "max-w-4xl mx-auto"
              : "grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start"
          }
        >
          {/* ========================= */}
          {/* LEFT SIDE */}
          {/* ========================= */}

          <div className="w-full">
            {/* ========================= */}
            {/* ADDRESS FORM */}
            {/* ========================= */}

            {showForm ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}

                <div className="px-8 py-6 border-b border-gray-200 bg-white">
                  <h2 className="text-2xl font-bold font-serif text-gray-800">
                    Delivery Address
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 font-serif">
                    Enter your delivery details below
                  </p>
                </div>

                {/* Form */}

                <div className="p-8 space-y-5">
                  {/* Full Name */}

                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="font-serif font-semibold text-gray-700"
                    >
                      Full Name
                    </Label>

                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="h-11 rounded-lg border-gray-300 font-serif"
                    />
                  </div>

                  {/* Phone + Email */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="font-serif font-semibold text-gray-700"
                      >
                        Phone No
                      </Label>

                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+91 987654321"
                        value={formData.phone}
                        onChange={handleChange}
                        className="h-11 rounded-lg border-gray-300 font-serif"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="font-serif font-semibold text-gray-700"
                      >
                        Email
                      </Label>

                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-11 rounded-lg border-gray-300 font-serif"
                      />
                    </div>
                  </div>

                  {/* Address */}

                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="font-serif font-semibold text-gray-700"
                    >
                      Address
                    </Label>

                    <Input
                      id="address"
                      name="address"
                      type="text"
                      required
                      placeholder="#123 Street, Area"
                      value={formData.address}
                      onChange={handleChange}
                      className="h-11 rounded-lg border-gray-300 font-serif"
                    />
                  </div>

                  {/* City + State */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        className="font-serif font-semibold text-gray-700"
                      >
                        City
                      </Label>

                      <Input
                        id="city"
                        name="city"
                        type="text"
                        required
                        placeholder="Ex: Vijayawada"
                        value={formData.city}
                        onChange={handleChange}
                        className="h-11 rounded-lg border-gray-300 font-serif"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="state"
                        className="font-serif font-semibold text-gray-700"
                      >
                        State
                      </Label>

                      <Input
                        id="state"
                        name="state"
                        type="text"
                        required
                        placeholder="Ex: Andhra Pradesh"
                        value={formData.state}
                        onChange={handleChange}
                        className="h-11 rounded-lg border-gray-300 font-serif"
                      />
                    </div>
                  </div>

                  {/* Zip + Country */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="zip"
                        className="font-serif font-semibold text-gray-700"
                      >
                        Zip Code
                      </Label>

                      <Input
                        id="zip"
                        name="zip"
                        type="text"
                        required
                        placeholder="Ex: 520001"
                        value={formData.zip}
                        onChange={handleChange}
                        className="h-11 rounded-lg border-gray-300 font-serif"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="country"
                        className="font-serif font-semibold text-gray-700"
                      >
                        Country
                      </Label>

                      <Input
                        id="country"
                        name="country"
                        type="text"
                        required
                        placeholder="Ex: India"
                        value={formData.country}
                        onChange={handleChange}
                        className="h-11 rounded-lg border-gray-300 font-serif"
                      />
                    </div>
                  </div>

                  {/* Save */}

                  <div className="pt-4">
                    <Button
                      onClick={handleSave}
                      type="button"
                      className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-serif font-semibold text-base shadow-md cursor-pointer"
                    >
                      Save & Continue
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              /* ========================= */
              /* SAVED ADDRESSES */
              /* ========================= */

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                {/* Header */}

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold font-serif text-gray-800">
                      Saved Addresses
                    </h2>

                    <p className="text-sm text-gray-500 font-serif mt-1">
                      Select an address for delivery
                    </p>
                  </div>

                  <span className="text-sm text-gray-500 font-serif">
                    {addresses?.length || 0} saved
                  </span>
                </div>

                {/* Addresses */}

                <div className="space-y-4">
                  {addresses?.map((address, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectAddress(index)}
                      className={`
                        relative
                        border
                        rounded-xl
                        p-5
                        cursor-pointer
                        transition-all
                        duration-200
                        ${
                          selectedAddress === index
                            ? "border-orange-500 bg-orange-50 shadow-md ring-2 ring-orange-200"
                            : "border-gray-200 bg-white hover:border-orange-300"
                        }
                      `}
                    >
                      {/* Name */}

                      <div className="flex items-center justify-between">
                        <h3 className="font-bold font-serif text-lg text-gray-800">
                          {address.fullName}
                        </h3>

                        {selectedAddress === index && (
                          <span className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                            Selected
                          </span>
                        )}
                      </div>

                      {/* Address */}

                      <div className="mt-3 space-y-1">
                        <p className="font-serif text-gray-600">
                          {address.address}
                        </p>

                        <p className="font-serif text-gray-600">
                          {address.city}, {address.state} - {address.zip}
                        </p>

                        <p className="font-serif text-gray-600">
                          {address.country}
                        </p>
                      </div>

                      {/* Contact */}

                      <div className="mt-3 space-y-1">
                        <p className="font-serif text-gray-600 text-sm">
                          Phone: {address.phone}
                        </p>

                        <p className="font-serif text-gray-600 text-sm">
                          Email: {address.email}
                        </p>
                      </div>

                      {/* Delete */}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => handleDelete(e, index)}
                        className="mt-4 font-serif border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      >
                        Delete Address
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add Address */}

                <div className="mt-6">
                  <Button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-serif"
                  >
                    Add Another Address
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ========================= */}
          {/* ORDER SUMMARY */}
          {/* ========================= */}

          {!showForm && (
            <div className="w-full lg:sticky lg:top-24">
              <Card className="w-full shadow-lg border border-gray-200 font-serif">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-xl font-bold">
                    Order Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5 pt-6">
                  {/* Subtotal */}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Subtotal ({cart?.items?.length || 0} items)
                    </span>

                    <span className="font-semibold text-gray-800">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Shipping */}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>

                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  {/* Tax */}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax (5%)</span>

                    <span className="font-semibold">
                      ₹{tax.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Total */}

                  <div className="border-t border-gray-200 pt-5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-gray-800">
                        Total
                      </span>

                      <span className="font-bold text-xl text-orange-600">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Free Shipping */}

                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                    {shipping === 0 ? (
                      <p className="text-sm text-green-700 font-semibold">
                        🎉 You got free shipping!
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Add more items to get free shipping.
                      </p>
                    )}
                  </div>

                  {/* Promo */}

                  <div className="flex gap-2">
                    <Input placeholder="Promo Code" className="font-serif" />

                    <Button
                      type="button"
                      variant="outline"
                      className="font-serif"
                    >
                      Apply
                    </Button>
                  </div>

                  {/* ========================= */}
                  {/* PROCEED TO CHECKOUT */}
                  {/* ========================= */}

                  <Button
                    onClick={handlePayment}
                    type="button"
                    disabled={selectedAddress === null || paymentLoading}
                    className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-serif font-semibold disabled:opacity-50"
                  >
                    {paymentLoading ? "Processing..." : "Proceed To Checkout"}
                  </Button>

                  {/* Information */}

                  <div className="text-xs text-gray-500 space-y-2 pt-4 border-t border-gray-200">
                    <p>✓ Free Shipping on Orders Over ₹299</p>

                    <p>✓ 30-Days Return Policy</p>

                    <p>✓ Secure Checkout with SSL Encryption</p>
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
