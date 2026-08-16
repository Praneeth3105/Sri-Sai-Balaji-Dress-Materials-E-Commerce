import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Trash2 } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import userLogo from "../assets/Profile.png";
import { Button } from "@/components/ui/button";
const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  console.log(cart);

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
                        <Button variant="outline" className="cursor-pointer">
                          -
                        </Button>
                        <span>1</span>
                        <Button variant="outline" className="cursor-pointer">
                          +
                        </Button>
                      </div>
                      <p>
                        ₹{product?.productId.productPrice * product?.quantity}
                      </p>
                      <p className="flex text-red-500 items-center gap-1 cursor-pointer">
                        <Trash2 className="w-4 h-4" /> Remove
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Cart;
