import {
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  Users,
  ClipboardList,
  AlertTriangle,
  BadgePercent,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    {
      to: "/dashboard/sales",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/dashboard/add-product",
      label: "Add Product",
      icon: PackagePlus,
    },
    {
      to: "/dashboard/products",
      label: "Products",
      icon: PackageSearch,
    },
    {
      to: "/dashboard/users",
      label: "Users",
      icon: Users,
    },
    {
      to: "/dashboard/orders",
      label: "Orders",
      icon: ClipboardList,
    },
    {
      to: "/dashboard/out-of-stock",
      label: "Out of Stock",
      icon: AlertTriangle,
    },
    {
      to: "/dashboard/coupons",
      label: "Offers & Coupons",
      icon: BadgePercent,
    },
  ];

  const handleMobileNavigation = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside
        className="
          hidden md:flex
          fixed
          left-0
          top-[100px]
          z-40
          h-[calc(100vh-100px)]
          w-[300px]
          flex-col
          border-r
          border-[#e3d6c7]
          bg-[#f5efe7]
        "
      >
        {/* BRAND */}

        <div className="px-8 pt-9 pb-7">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#4a382c] flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-[#d7bc91]" strokeWidth={1.4} />
            </div>

            <div>
              <p className="font-[Cormorant_Garamond] text-2xl leading-none text-[#44352c]">
                Admin Studio
              </p>

              <p className="text-[8px] uppercase tracking-[0.3em] text-[#a78352] mt-1">
                Sri Sai Balaji
              </p>
            </div>
          </div>

          <div className="w-10 h-px bg-[#b99a6b] mt-7" />
        </div>

        {/* NAVIGATION */}

        <nav className="px-5">
          <p className="px-4 mb-4 text-[9px] uppercase tracking-[0.3em] font-semibold text-[#9a8a7e]">
            Management
          </p>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-[#4a382c] text-white shadow-md shadow-[#4a382c]/10"
                        : "text-[#66584e] hover:bg-[#eee5da] hover:text-[#44352c]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-[#c9aa7a]" />
                      )}

                      <Icon
                        className={`w-[18px] h-[18px] ${
                          isActive
                            ? "text-[#d7bc91]"
                            : "text-[#9b8060] group-hover:text-[#a78352]"
                        }`}
                        strokeWidth={1.6}
                      />

                      <span className="text-sm font-medium tracking-wide">
                        {item.label}
                      </span>

                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d7bc91]" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* BOTTOM CARD */}

        <div className="mt-auto px-6 pb-6">
          <div className="rounded-2xl bg-[#4a382c] p-5 text-white">
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#d5b98b]">
              Sri Sai Balaji
            </p>

            <p className="font-[Cormorant_Garamond] italic text-xl mt-2 text-white/90">
              Style that feels like you.
            </p>

            <div className="w-8 h-px bg-[#b99a6b] mt-4" />

            <p className="text-[9px] leading-4 text-white/50 mt-3">
              Manage your boutique collection with elegance.
            </p>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MOBILE MENU BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="
          md:hidden
          fixed
          top-4
          left-4
          z-[60]
          w-11
          h-11
          rounded-xl
          bg-[#4a382c]
          text-white
          flex
          items-center
          justify-center
          shadow-lg
          border
          border-[#6a5344]
        "
        aria-label="Open admin menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileOpen && (
        <div
          className="
            md:hidden
            fixed
            inset-0
            z-[70]
            bg-black/40
            backdrop-blur-[2px]
          "
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}

      <aside
        className={`
          md:hidden
          fixed
          left-0
          top-0
          z-[80]
          h-screen
          w-[280px]
          bg-[#f5efe7]
          border-r
          border-[#e3d6c7]
          shadow-2xl
          transition-transform
          duration-300
          ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* MOBILE HEADER */}

        <div className="px-6 pt-7 pb-6 border-b border-[#e3d6c7]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#4a382c] flex items-center justify-center">
                <Sparkles
                  className="w-5 h-5 text-[#d7bc91]"
                  strokeWidth={1.4}
                />
              </div>

              <div>
                <p className="font-[Cormorant_Garamond] text-xl leading-none text-[#44352c]">
                  Admin Studio
                </p>

                <p className="text-[7px] uppercase tracking-[0.3em] text-[#a78352] mt-1">
                  Sri Sai Balaji
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="
                w-9
                h-9
                rounded-full
                bg-[#eee5da]
                flex
                items-center
                justify-center
                text-[#5d4b3e]
              "
              aria-label="Close admin menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="w-8 h-px bg-[#b99a6b] mt-5" />
        </div>

        {/* MOBILE NAVIGATION */}

        <nav className="px-4 pt-6">
          <p className="px-3 mb-4 text-[9px] uppercase tracking-[0.3em] font-semibold text-[#9a8a7e]">
            Management
          </p>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleMobileNavigation}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-[#4a382c] text-white shadow-md"
                        : "text-[#66584e] active:bg-[#eee5da]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-[#c9aa7a]" />
                      )}

                      <Icon
                        className={`w-[19px] h-[19px] ${
                          isActive ? "text-[#d7bc91]" : "text-[#9b8060]"
                        }`}
                        strokeWidth={1.6}
                      />

                      <span className="text-sm font-medium tracking-wide">
                        {item.label}
                      </span>

                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d7bc91]" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* MOBILE BOTTOM CARD */}

        <div className="absolute left-4 right-4 bottom-5">
          <div className="rounded-2xl bg-[#4a382c] p-4 text-white">
            <p className="text-[8px] uppercase tracking-[0.25em] text-[#d5b98b]">
              Sri Sai Balaji
            </p>

            <p className="font-[Cormorant_Garamond] italic text-lg mt-1 text-white/90">
              Style that feels like you.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
