import React from "react";
import { CheckCircle, ShoppingBag, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderSuccess = () => {
  const navigate = useNavigate();

  const { user } = useSelector((store) => store.user);

  const handleViewOrders = () => {
    if (user?._id) {
      navigate(`/profile/${user._id}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 text-center">
          {/* SUCCESS ICON */}
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-5">
              <CheckCircle
                className="h-20 w-20 text-green-600"
                strokeWidth={1.8}
              />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-800 mt-7">
            Thank You For Your Order!
          </h1>

          <p className="text-gray-600 font-serif mt-4 leading-7">
            Your order has been placed successfully.
            <br />
            Thank you for shopping with us!
          </p>

          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-700 font-semibold font-serif">
              ✓ Payment Successful
            </p>

            <p className="text-sm text-green-600 mt-1 font-serif">
              Your order is being processed.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="
                flex-1
                h-12
                rounded-xl
                bg-orange-600
                hover:bg-orange-700
                text-white
                font-serif
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition-all
                duration-200
                cursor-pointer
                shadow-md
                hover:shadow-lg
              "
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </button>

            <button
              type="button"
              onClick={handleViewOrders}
              className="
                flex-1
                h-12
                rounded-xl
                border
                border-gray-300
                bg-white
                hover:bg-gray-100
                text-gray-800
                font-serif
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition-all
                duration-200
                cursor-pointer
              "
            >
              <Package className="w-5 h-5" />
              View My Orders
            </button>
          </div>
          <p className="text-sm text-gray-400 font-serif mt-7">
            We appreciate your business and hope to see you again soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
