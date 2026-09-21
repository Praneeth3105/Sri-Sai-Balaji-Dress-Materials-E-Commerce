import { setUser } from "@/redux/UserSlice";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Menu, ShoppingBag, X, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

.nav-root {
  font-family: 'DM Sans', sans-serif;
}

.nav-brand {
  font-family: 'Cormorant Garamond', Georgia, serif;
}

/* entrance */

.nav-enter {
  animation: navEnter .8s cubic-bezier(.2,.8,.2,1) both;
}

@keyframes navEnter {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* navigation underline */

.nav-item {
  position: relative;
}

.nav-item::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -7px;
  width: 0;
  height: 1.5px;
  border-radius: 999px;

  background:
    linear-gradient(
      90deg,
      #b18a4b,
      #dfc38b
    );

  transform: translateX(-50%);
  transition:
    width .35s cubic-bezier(.2,.8,.2,1);
}

.nav-item:hover::after,
.nav-item.active::after {
  width: 100%;
}

/* cart */

.nav-cart {
  transition:
    transform .3s ease,
    box-shadow .3s ease,
    background .3s ease;
}

.nav-cart:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 30px -15px rgba(83,59,42,.45);
}

/* cart badge */

.nav-badge {
  animation: badgePop .4s cubic-bezier(.34,1.56,.64,1);
}

@keyframes badgePop {
  from {
    transform: scale(.4);
    opacity: .5;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* login button shine */

.nav-button {
  position: relative;
  overflow: hidden;
}

.nav-button::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 55%;
  height: 100%;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.5),
      transparent
    );

  transform: skewX(-20deg);
  transition: left .7s ease;
}

.nav-button:hover::after {
  left: 140%;
}

/* logo */

.nav-logo {
  transition:
    transform .4s cubic-bezier(.2,.8,.2,1),
    box-shadow .4s ease;
}

.nav-logo:hover {
  transform: scale(1.05);
  box-shadow:
    0 12px 30px -15px rgba(91,65,42,.4);
}

/* mobile menu */

.nav-mobile {
  animation: mobileMenu .4s ease both;
}

@keyframes mobileMenu {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-root * {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
`;

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product);

  const accessToken = localStorage.getItem("accessToken");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const admin = user?.role === "admin";

  /* --------------------------------
     Logout
  -------------------------------- */

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to logout. Please try again.");
    }
  };

  /* --------------------------------
     Scroll effect
  -------------------------------- */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* --------------------------------
     Close mobile menu
  -------------------------------- */

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* --------------------------------
     Navigation
  -------------------------------- */

  const navItems = [
    {
      to: "/",
      label: "Home",
    },
    {
      to: "/products",
      label: "Collections",
    },
    {
      to: "/about",
      label: "Our Story",
    },
    {
      to: "/contact",
      label: "Contact",
    },

    ...(user
      ? [
          {
            to: `/profile/${user._id}`,
            label: `Hello, ${user.firstName}`,
          },
        ]
      : []),

    ...(admin
      ? [
          {
            to: "/dashboard/sales",
            label: "Dashboard",
          },
        ]
      : []),
  ];

  const isActive = (to) => {
    if (to === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(to);
  };

  const cartCount = cart?.items?.length || 0;

  /* --------------------------------
     Cart
  -------------------------------- */

  const cartLink = (
    <Link
      to="/cart"
      aria-label="Shopping cart"
      className="nav-cart group relative flex h-11 w-11 items-center justify-center rounded-full border border-[#d8c9b5] bg-white/75 text-[#49382d] backdrop-blur-md"
    >
      <ShoppingBag
        className="h-[19px] w-[19px] transition-transform duration-300 group-hover:scale-110"
        strokeWidth={1.7}
      />

      {cartCount > 0 && (
        <span
          key={cartCount}
          className="nav-badge absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-[#3d2c23] px-1 text-[10px] font-semibold text-white"
        >
          {cartCount}
        </span>
      )}
    </Link>
  );

  /* --------------------------------
     Auth button
  -------------------------------- */

  const authButton = user ? (
    <Button
      onClick={logoutHandler}
      className="nav-button h-10 rounded-full bg-[#3d2c23] px-6 text-sm font-medium text-white shadow-[0_10px_25px_-12px_rgba(61,44,35,.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4b362b]"
    >
      Logout
    </Button>
  ) : (
    <Button
      onClick={() => navigate("/login")}
      className="nav-button h-10 rounded-full bg-[#3d2c23] px-7 text-sm font-medium text-white shadow-[0_10px_25px_-12px_rgba(61,44,35,.65)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4b362b]"
    >
      Login
    </Button>
  );

  return (
    <>
      <style>{styles}</style>

      <header
        className={`nav-root nav-enter fixed left-0 top-0 z-50 w-full border-b transition-all duration-500 ${
          scrolled
            ? "border-[#ddd0bf] bg-[#fbf8f2]/95 shadow-[0_10px_40px_-25px_rgba(60,42,30,.35)] backdrop-blur-xl"
            : "border-transparent bg-[#fbf8f2]/80 backdrop-blur-md"
        }`}
      >
        {/* Main navbar */}

        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 sm:px-7 lg:px-10 ${
            scrolled ? "py-2.5" : "py-3.5"
          }`}
        >
          {/* --------------------------------
              Logo
          -------------------------------- */}

          <Link to="/" className="group flex items-center gap-3">
            <div className="nav-logo rounded-xl border border-[#d8c7ad] bg-white p-1.5 shadow-[0_8px_25px_-15px_rgba(65,45,30,.4)]">
              <img
                src="/Shop.png"
                alt="Sri Sai Balaji Dress Materials"
                className="h-[38px] w-[38px] object-contain"
              />
            </div>

            <div className="hidden sm:block">
              <p className="nav-brand text-[21px] font-semibold leading-none text-[#3d2c23]">
                Sri Sai Balaji
              </p>

              <p className="mt-1 text-[8px] font-semibold uppercase tracking-[.25em] text-[#a27b43]">
                Dress Materials
              </p>
            </div>
          </Link>

          {/* --------------------------------
              Desktop navigation
          -------------------------------- */}

          <nav className="hidden items-center gap-7 md:flex lg:gap-9">
            <ul className="flex items-center gap-7 lg:gap-9">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`nav-item text-[13px] font-medium tracking-[.04em] transition-colors duration-300 ${
                      isActive(item.to)
                        ? "active text-[#9a713b]"
                        : "text-[#65564c] hover:text-[#9a713b]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="h-5 w-px bg-[#ded2c2]" />

            {cartLink}

            {authButton}
          </nav>

          {/* --------------------------------
              Mobile controls
          -------------------------------- */}

          <div className="flex items-center gap-3 md:hidden">
            {cartLink}

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((value) => !value)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8c9b5] bg-white/75 text-[#49382d] backdrop-blur-md transition-all duration-300 hover:bg-white"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* --------------------------------
            Mobile menu
        -------------------------------- */}

        {open && (
          <div className="nav-mobile border-t border-[#e2d8ca] bg-[#fbf8f2]/98 px-5 pb-5 pt-4 backdrop-blur-xl md:hidden">
            <div className="rounded-2xl border border-[#ded2c2] bg-white/70 p-2">
              <ul className="flex flex-col">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`block rounded-xl px-4 py-3.5 text-sm transition-all duration-300 ${
                        isActive(item.to)
                          ? "bg-[#f1e7d8] font-semibold text-[#9a713b]"
                          : "text-[#62544a] hover:bg-[#f7f2ea] hover:text-[#9a713b]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-2 border-t border-[#e5dbcd] pt-3">
                {authButton}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
  