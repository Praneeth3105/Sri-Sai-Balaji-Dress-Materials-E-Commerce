import React from "react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-orange-100 via-orange-200 to-amber-100 text-gray-900 min-h-[500px] flex items-center py-10">
      <div className="max-w-6xl w-full mx-auto px-6">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight mb-5">
              Latest Collection at Best Price
            </h1>

            <p className="text-lg md:text-xl text-gray-700 font-serif mb-8">
              Discover Unbeatable Deals on Beautiful Fashion Collections
            </p>

            <div className="flex gap-4">
              <Button className="bg-gray-900 text-white hover:bg-gray-700 px-7 py-3 rounded-md font-serif cursor-pointer">
                Shop Now
              </Button>

              <Button
                variant="outline"
                className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-7 py-3 rounded-md font-serif cursor-pointer"
              >
                View Deals
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center md:justify-end items-center md:translate-x-2 md:translate-y-4">
            <img
              src="/Hero-1.jpg"
              alt="Latest Collection"
              className="w-full max-w-sm h-[330px] object-cover rounded-3xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
