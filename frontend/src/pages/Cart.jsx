import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, ShoppingCart, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import userLogo from "../assets/Profile.png";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setCart } from "@/redux/productSlice";
import { toast } from "sonner";
const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  console.log(cart);

  const subtotal = cart?.totalPrice;
  const shipping = subtotal > 299 ? 0 : 10;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
  const API = "http://localhost:8000/api/v1/cart";

  const loadCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const accessToken = localStorage.getItem("accessToken");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(
        `${API}/update`,
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { productId },
      });
      if (res.data.success) {
        console.log(res.data.cart);

        dispatch(setCart(res.data.cart));
        toast.success("Product Removed From Cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCart();
  }, [dispatch]);
  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold font-serif text-gray-800 mb-7">
            Shopping Cart
          </h1>
          <div className="max-w-7xl mx-auto flex gap-7">
            <div className="flex flex-col gap-5 flex-1">
              {cart?.items?.map((product, index) => {
                return (
                  <Card key={index}>
                    <div className="flex justify-between items-center pr-7">
                      <div className="flex items-center w-[350px]">
                        <img
                          src={
                            product?.productId?.productImage?.[0]?.url ||
                            userLogo
                          }
                          alt="Product"
                          className="w-25 h-25 "
                        />
                        <div className="w-[280px">
                          <h1 className="font-semibold font-serif truncate">
                            {product?.productId?.productName}
                          </h1>
                          <p className="font-serif">
                            ₹{product?.productId?.productPrice}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-5 items-center">
                        <Button
                          onClick={() =>
                            handleUpdateQuantity(
                              product.productId._id,
                              "decrease",
                            )
                          }
                          variant="outline"
                          className="cursor-pointer"
                        >
                          -
                        </Button>
                        <span className="font-serif">{product.quantity}</span>
                        <Button
                          onClick={() =>
                            handleUpdateQuantity(
                              product.productId._id,
                              "increase",
                            )
                          }
                          variant="outline"
                          className="cursor-pointer"
                        >
                          +
                        </Button>
                      </div>
                      <p className="font-serif">
                        ₹
                        {(product?.productId?.productPrice || 0) *
                          (product?.quantity || 0)}
                      </p>
                      <p
                        onClick={() => handleRemove(product?.productId?._id)}
                        className="flex text-red-500 items-center gap-1 cursor-pointer font-serif"
                      >
                        <Trash2 className="w-4 h-4 " /> Remove
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
            <div>
              <Card className="w-[400px] font-serif">
                <CardHeader>
                  <CardTitle className="font-serif">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Sub Total ({cart?.items?.length} items)</span>
                    <span>₹{cart?.totalPrice?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>₹{tax}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="space-y-3 pt-4">
                    <div className="flex space-x-2">
                      <Input placeholder="Promo Code" />
                      <Button variant="outline">Apply</Button>
                    </div>
                    <Button
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/address")}
                      className="w-full bg-orange-600"
                    >
                      PLACE ORDER
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Link to="/products">Continue Shopping</Link>
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foregrount pt-4">
                    <p>* Free Shipping on Orders Over ₹299</p>
                    <p>* 30-Days Return Policy</p>
                    <p>* Secure Checkout with SSL Encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">  
          <div className="font-serif bg-orange-100 p-6 rounded-full">
            <ShoppingCart className="w-16 h-16 text-black" />
          </div>
          <h2 className="font-serif mt-6 text-2xl font-bold text-gray-600">
            Your Cart is Empty
          </h2>
          <p className="font-serif mt-2 text-gray-600">
            Looks Like You Have Not Added Anything to Your Cart Yet
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="font-serif cursor-pointer mt-6 bg-orange-600 text-white py-3 px-6 hover:bg-orange-700"
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;