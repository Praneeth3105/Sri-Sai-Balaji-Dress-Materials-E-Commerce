import { Headphones, Shield, Truck } from "lucide-react";
import React from "react";

const Features = () => {
  return (
    <section className="py-10 bg-orange-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Free Shipping */}
          <div className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <Truck className="h-6 w-6 text-orange-600" />
            </div>

            <div>
              <h3 className="font-semibold font-serif text-gray-900">
                Free Shipping
              </h3>
              <p className="text-sm text-gray-600">On orders over $50</p>
            </div>
          </div>

          {/* Secure Payment */}
          <div className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>

            <div>
              <h3 className="font-semibold font-serif text-gray-900">
                Secure Payment
              </h3>
              <p className="text-sm text-gray-600">100% secure transactions</p>
            </div>
          </div>

          {/* 24/7 Support */}
          <div className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <Headphones className="h-6 w-6 text-orange-600" />
            </div>

            <div>
              <h3 className="font-semibold font-serif text-gray-900">
                24/7 Support
              </h3>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
