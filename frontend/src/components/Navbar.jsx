import { setUser } from "@/redux/UserSlice";
// import { Button } from "@base-ui/react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Menu, ShoppingCart, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

.nav-root{font-family:'Plus Jakarta Sans',system-ui,sans-serif}

/* slide-down entrance */
.nav-drop{animation:nav-drop .9s cubic-bezier(.2,.8,.2,1) both}
@keyframes nav-drop{from{transform:translateY(-100%);opacity:0}to{transform:none;opacity:1}}

/* animated gold underline */
.nav-link{position:relative;padding:.35rem 0}
.nav-link::after{content:"";position:absolute;left:0;bottom:-2px;height:2px;width:100%;border-radius:2px;background:linear-gradient(90deg,#fcd34d,#e879f9);transform:scaleX(0);transform-origin:right;transition:transform .45s cubic-bezier(.2,.8,.2,1)}
.nav-link:hover::after,.nav-link-active::after{transform:scaleX(1);transform-origin:left}

/* cart badge pop when count changes */
.nav-pop{animation:nav-pop .55s cubic-bezier(.34,1.56,.64,1)}
@keyframes nav-pop{0%{transform:scale(.3)}100%{transform:scale(1)}}

/* button shine */
.nav-shine{position:relative;overflow:hidden}
.nav-shine::after{content:"";position:absolute;top:0;left:-75%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);transform:skewX(-20deg);transition:left .7s ease}
.nav-shine:hover::after{left:130%}

@media (prefers-reduced-motion:reduce){
  .nav-root *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
}
`;

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const accessToken = localStorage.getItem("accessToken");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const admin = user?.role === "admin" ? true : false;
  const { cart } = useSelector((store) => store.product);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/logout`,
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
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(cart);

  // glass gets stronger after scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    ...(user
      ? [{ to: `/profile/${user._id}`, label: `Hello, ${user.firstName}` }]
      : []),
    ...(admin ? [{ to: `/dashboard/sales`, label: "Dashboard" }] : []),
  ];

  const isActive = (to) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  const cartCount = cart?.items?.length || 0;

  const cartLink = (
    <Link
      to={"/cart"}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/70 hover:bg-white/20 hover:text-amber-200"
    >
      <ShoppingCart className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
      <span
        key={cartCount}
        className="nav-pop absolute -top-1.5 -right-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-rose-500 px-1.5 text-xs font-semibold text-white shadow-lg shadow-fuchsia-500/40"
      >
        {cartCount}
      </span>
    </Link>
  );

  const authButton = user ? (
    <Button
      onClick={logoutHandler}
      className="nav-shine h-10 rounded-full bg-gradient-to-r from-rose-500 to-red-600 px-6 font-semibold text-white cursor-pointer shadow-lg shadow-rose-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/50"
    >
      Logout
    </Button>
  ) : (
    <Button
      onClick={() => navigate("/login")}
      className="nav-shine h-10 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 px-6 font-semibold text-gray-900 cursor-pointer shadow-lg shadow-amber-400/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-400/60"
    >
      Login
    </Button>
  );

  return (
    <header
      className={`nav-root nav-drop fixed top-0 w-full z-20 border-b backdrop-blur-xl transition-all duration-500 ${
        scrolled
          ? "bg-[#160828]/90 border-white/15 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]"
          : "bg-[#160828]/60 border-white/10"
      }`}
    >
      <style>{styles}</style>

      <div
        className={`max-w-7xl mx-auto flex justify-between items-center px-4 transition-all duration-500 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        {/* Logo Section */}
        <div className="group">
          <div className="rounded-xl border border-white/20 bg-white/90 p-1.5 shadow-lg shadow-fuchsia-500/20 transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:shadow-fuchsia-500/50">
            <img src="/Shop.png" alt="Shop Logo" className="w-[34px] h-auto" />
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 justify-between items-center">
          <ul className="flex gap-8 items-center text-[15px] font-medium tracking-wide">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`nav-link transition-colors duration-300 ${
                    isActive(item.to)
                      ? "nav-link-active text-amber-300"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {cartLink}
          {authButton}
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          {cartLink}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md cursor-pointer transition-colors hover:bg-white/20"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-4 mb-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
          <ul className="flex flex-col gap-1 text-base font-medium">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`block rounded-xl px-4 py-3 transition-colors duration-300 ${
                    isActive(item.to)
                      ? "bg-white/15 text-amber-300"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4">{authButton}</div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
