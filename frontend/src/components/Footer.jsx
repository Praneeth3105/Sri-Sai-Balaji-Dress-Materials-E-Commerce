
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

.foot-root {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}

.foot-display {
  font-family: 'Playfair Display', Georgia, serif;
}

.foot-drift {
  animation: foot-drift 18s ease-in-out infinite;
}

.foot-drift-b {
  animation: foot-drift 22s ease-in-out infinite reverse;
}

@keyframes foot-drift {
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(50px, -30px, 0) scale(1.15);
  }
}

.foot-line {
  background-size: 200% auto;
  animation: foot-line 6s linear infinite;
}

@keyframes foot-line {
  to {
    background-position: 200% center;
  }
}

.foot-shine {
  position: relative;
  overflow: hidden;
}

.foot-shine::after {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.5),
    transparent
  );
  transform: skewX(-20deg);
  transition: left 0.7s ease;
}

.foot-shine:hover::after {
  left: 130%;
}

@media (prefers-reduced-motion: reduce) {
  .foot-root * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

// Reveal-on-scroll hook
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    io.observe(el);

    return () => io.disconnect();
  }, []);

  return [ref, visible];
};

const linkClass =
  "group inline-flex items-center gap-2 text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-amber-300";

const Dash = () => (
  <span className="h-px w-0 bg-amber-300 transition-all duration-300 group-hover:w-4" />
);

const Footer = () => {
  const [ref, visible] = useReveal();

  const reveal = (i) => ({
    className: `transition-all duration-1000 ease-out ${
      visible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-10"
    }`,
    style: {
      transitionDelay: `${i * 130}ms`,
    },
  });

  return (
    <footer
      ref={ref}
      className="foot-root relative overflow-hidden bg-gradient-to-b from-[#160828] via-[#12061f] to-[#0c0316] text-white/70"
    >
      <style>{styles}</style>

      {/* Animated top line */}
      <div className="foot-line absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent [background-image:linear-gradient(90deg,#160828,#fcd34d,#e879f9,#fcd34d,#160828)]" />

      {/* Background blobs */}
      <div className="foot-drift pointer-events-none absolute -top-24 left-[5%] h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl" />

      <div className="foot-drift-b pointer-events-none absolute bottom-0 right-[5%] h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

      {/* Big faint watermark */}
      <div className="foot-display pointer-events-none select-none absolute inset-x-0 -bottom-3 overflow-hidden whitespace-nowrap text-center text-[11vw] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.09] to-transparent">
        Sri Sai Balaji
      </div>

      {/* Main Footer */}
      <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-16 md:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Store Information */}
          <div {...reveal(0)}>
            <Link to="/" className="inline-block">
              <div className="mb-4 w-fit rounded-2xl border border-white/20 bg-white/90 p-2 shadow-lg shadow-fuchsia-500/20 transition-all duration-500 hover:-rotate-6 hover:scale-110 hover:shadow-fuchsia-500/50">
                <img
                  src="/Shop.png"
                  alt="Sri Sai Balaji Dress Materials"
                  className="w-16"
                />
              </div>
            </Link>

            <p className="text-sm leading-6 text-white/60">
              Discover beautiful fashion collections at the best prices.
              Quality products, trusted service, and styles you'll love.
            </p>

            <p className="mt-3 text-sm text-white/60">
              Shop No. 311, Panja Center,{" "}
              <span>Krishnaveni Cloth Market</span>,
              Mahanthi Puram, Vinchipeta, Vijayawada,
              Andhra Pradesh 520001
            </p>

            <p className="mt-3 text-sm text-white/60">
              Email: umamuvvala72@gmail.com
            </p>

            <p className="mt-3 text-sm text-white/60">
              Phone: +91 9491955032
            </p>
          </div>

          {/* Customer Service */}
          <div {...reveal(1)}>
            <h3 className="foot-display text-xl font-semibold text-white">
              Customer Service
            </h3>

            <div className="mt-2 h-[3px] w-10 rounded-full bg-gradient-to-r from-amber-300 to-fuchsia-400" />

            <ul className="mt-5 space-y-3 text-sm">

              <li>
                <Link to="/contact" className={linkClass}>
                  <Dash />
                  Contact Us
                </Link>
              </li>

              <li>
                <Link to="/shipping" className={linkClass}>
                  <Dash />
                  Shipping & Returns
                </Link>
              </li>

              <li>
                <Link to="/faq" className={linkClass}>
                  <Dash />
                  FAQs
                </Link>
              </li>

              <li>
                <Link to="/orders" className={linkClass}>
                  <Dash />
                  Order Tracking
                </Link>
              </li>

              <li>
                <Link to="/size-guide" className={linkClass}>
                  <Dash />
                  Size Guide
                </Link>
              </li>

            </ul>
          </div>

          {/* Social Media */}
          <div {...reveal(2)}>
            <h3 className="foot-display text-xl font-semibold text-white">
              Follow Us
            </h3>

            <div className="mt-2 h-[3px] w-10 rounded-full bg-gradient-to-r from-amber-300 to-fuchsia-400" />

            <div className="flex items-center gap-4 mt-6">

              {/* Facebook */}
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-110 hover:border-blue-400/60 hover:bg-blue-500/20 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/30"
              >
                <FaFacebook size={20} />
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-110 hover:border-pink-400/60 hover:bg-pink-500/20 hover:text-pink-400 hover:shadow-lg hover:shadow-pink-500/30"
              >
                <FaInstagram size={20} />
              </a>

              {/* Pinterest */}
              <a
                href="#"
                aria-label="Pinterest"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:scale-110 hover:border-red-400/60 hover:bg-red-500/20 hover:text-red-400 hover:shadow-lg hover:shadow-red-500/30"
              >
                <FaPinterest size={20} />
              </a>

            </div>
          </div>

          {/* Newsletter */}
          <div {...reveal(3)}>
            <h3 className="foot-display text-xl font-semibold text-white">
              Stay in the Loop
            </h3>

            <div className="mt-2 h-[3px] w-10 rounded-full bg-gradient-to-r from-amber-300 to-fuchsia-400" />

            <p className="mt-4 text-sm text-white/60 leading-6">
              Subscribe to get special offers, new collections, and
              exclusive deals.
            </p>

            <form className="mt-5 flex rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur-xl transition-all duration-300 focus-within:border-amber-300/70 focus-within:shadow-[0_0_30px_-5px_rgba(252,211,77,0.4)]">

              <input
                type="email"
                placeholder="Your email address"
                className="w-full min-w-0 bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
              />

              <button
                type="submit"
                className="foot-shine rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 px-5 py-2 text-sm font-semibold text-gray-900 cursor-pointer shadow-lg shadow-amber-400/30 transition-all duration-300 hover:scale-105 hover:shadow-amber-400/60"
              >
                Subscribe
              </button>

            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-center text-sm text-white/50 sm:flex-row">

          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-amber-300 font-semibold">
              Sri Sai Balaji Dress Materials
            </span>
            . All rights reserved.
          </p>

          <button
            type="button"
            aria-label="Back to top"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-md cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/70 hover:text-amber-300"
          >
            <span className="transition-transform duration-300 group-hover:-translate-y-0.5">
              ↑
            </span>
          </button>

        </div>
      </div>
    </footer>
  );
};

export default Footer;

