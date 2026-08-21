import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Store Information */}
          <div>
            <Link to="/">
              <img
                src="/Shop.png"
                alt="Sri Sai Balaji Dress Materials"
                className="w-16 mb-4"
              />
            </Link>

            <p className="text-sm leading-6 text-gray-400 ">
              Discover beautiful fashion collections at the best prices. Quality
              products, trusted service, and styles you'll love.
            </p>

            <p className="mt-3 text-sm text-gray-400  ">
              Shop No. 311, Panja Center, <span>Krishnaveni Cloth Market</span>,
              Mahanthi Puram, Vinchipeta, Vijayawada, Andhra Pradesh 520001
            </p>

            <p className="mt-3 text-sm text-gray-400 ">
              Email: umamuvvala72@gmail.com
            </p>

            <p className="mt-3 text-sm text-gray-400 ">Phone: +91 9491955032</p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold font-serif text-white">
              Customer Service
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link to="/contact" className="hover:text-orange-400">
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  to="/shipping"
                  className="hover:text-orange-400 transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>

              <li>
                <Link
                  to="/faq"
                  className="hover:text-orange-400 transition-colors"
                >
                  FAQs
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="hover:text-orange-400 transition-colors"
                >
                  Order Tracking
                </Link>
              </li>

              <li>
                <Link
                  to="/size-guide"
                  className="hover:text-orange-400 transition-colors"
                >
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold font-serif text-white">
              Follow Us
            </h3>

            <div className="flex items-center gap-4 mt-5">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FaFacebook size={20} />
              </a>

              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaPinterest size={20} />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold font-serif text-white">
              Stay in the Loop
            </h3>

            <p className="mt-3 text-sm text-gray-400 leading-6">
              Subscribe to get special offers, new collections, and exclusive
              deals.
            </p>

            <form className="mt-5 flex">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full min-w-0 px-3 py-2 text-sm bg-white text-gray-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-medium rounded-r-md cursor-pointer transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-orange-400 font-semibold">
              Sri Sai Balaji Dress Materials
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
