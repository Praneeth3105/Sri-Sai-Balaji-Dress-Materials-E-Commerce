import { Button } from "@base-ui/react";
import { ShoppingCart } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = true;
  return (
    <header className="bg-orange-300 fixed top-0 w-full z-20 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2">
        {/* Logo Section */}
        <div>
          <img src="/Shop.png" alt="Shop Logo" className="w-[40px] h-auto" />
        </div>
        {/* {nav Section} */}
        <nav className="flex gap-10 justify-between items-center">
          <ul className="flex gap-7 items-center text-xl font-serif">
            <Link to={"/"}>
              <li>Home</li>
            </Link>
            <Link to={"/products"}>
              <li>Products</li>
            </Link>
            {user && (
              <Link to={"/profile"}>
                <li>Hello User</li>
              </Link>
            )}
          </ul>
          <Link to={"/cart"} className="relative">
            <ShoppingCart />
            <span className="bg-red-500 rounded-full absolute text-white -top-3 -right-4 px-2">
              0
            </span>
          </Link>
          {user ? (
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 cursor-pointer font-serif shadow-sm">
              Logout
            </Button>
          ) : (
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-md px-4 py-2 cursor-pointer font-serif shadow-sm">
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
