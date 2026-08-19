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
          color: "#ea580c",
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

            console.log("Verify Payment Response:", verifyResponse.data);

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
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* PAGE TITLE */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-gray-800">
            Checkout
          </h1>

          <p className="text-gray-500 font-serif mt-1">
            Enter your delivery address and review your order
          </p>
        </div>

        {/* MAIN */}

        <div
          className={
            showForm
              ? "max-w-4xl mx-auto"
              : "grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start"
          }
        >
  
          <div className="w-full">

            {showForm ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* HEADER */}

                <div className="px-8 py-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold font-serif text-gray-800">
                    Delivery Address
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 font-serif">
                    Enter your delivery details below
                  </p>
                </div>

                <div className="p-8 space-y-5">

                  <div className=" font-serif space-y-2">
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
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="font-serif grid grid-cols-1 md:grid-cols-2 gap-5">
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
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="font-serif space-y-2">
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
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="font-serif space-y-2">
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
                      placeholder="#123 Street, Area"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="font-serif grid grid-cols-1 md:grid-cols-2 gap-5">
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
                        placeholder="Vijayawada"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="font-serif space-y-2">
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
                        placeholder="Andhra Pradesh"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="font-serif grid grid-cols-1 md:grid-cols-2 gap-5">
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
                        placeholder="520001"
                        value={formData.zip}
                        onChange={handleChange}
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
                        placeholder="India"
                        value={formData.country}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="button"
                      onClick={handleSave}
                      className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-serif font-semibold cursor-pointer"
                    >
                      Save & Continue
                    </Button>
                  </div>
                </div>
              </div>
            ) : (

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
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

                <div className="space-y-4">
                  {addresses?.map((address, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectAddress(index)}
                      className={`
                        relative border rounded-xl p-5
                        cursor-pointer transition-all duration-200
                        ${
                          selectedAddress === index
                            ? "border-orange-500 bg-orange-50 shadow-md ring-2 ring-orange-200"
                            : "border-gray-200 bg-white hover:border-orange-300"
                        }
                      `}
                    >
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

                      <div className="mt-3 space-y-1">
                        <p className="font-serif text-gray-600 text-sm">
                          Phone: {address.phone}
                        </p>

                        <p className="font-serif text-gray-600 text-sm">
                          Email: {address.email}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => handleDelete(e, index)}
                        className="mt-4 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      >
                        Delete Address
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button
                    type="button"
                    onClick={handleAddAnother}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-serif cursor-pointer"
                  >
                    Add Another Address
                  </Button>
                </div>
              </div>
            )}
          </div>

          {!showForm && (
            <div className="w-full lg:sticky lg:top-24">
              <Card className="w-full shadow-lg border border-gray-200 font-serif">
                <CardHeader className="border-b border-gray-200">
                  <CardTitle className="text-xl font-bold">
                    Order Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5 pt-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subtotal ({cart?.items?.length || 0} items)
                    </span>

                    <span className="font-semibold">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>

                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%)</span>

                    <span className="font-semibold">
                      ₹{tax.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="border-t pt-5">
                    <div className="flex justify-between">
                      <span className="font-bold text-lg">Total</span>

                      <span className="font-bold text-xl text-orange-600">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

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
                  <div className="flex gap-2">
                    <Input placeholder="Promo Code" />

                    <Button type="button" variant="outline">
                      Apply
                    </Button>
                  </div>
                  <Button
                    type="button"
                    onClick={handlePayment}
                    disabled={
                      selectedAddress === null ||
                      selectedAddress === undefined ||
                      paymentLoading
                    }
                    className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-serif font-semibold disabled:opacity-50"
                  >
                    {paymentLoading ? "Processing..." : "Proceed To Checkout"}
                  </Button>

                  <div className="text-xs text-gray-500 space-y-2 pt-4 border-t">
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
