import {
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  Users,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
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
  ];

  return (
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
  );
};

export default Sidebar;
