import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";

import { FaFacebook, FaInstagram, FaPinterest } from "react-icons/fa";

import { ArrowUp, Mail, MapPin, Phone, ArrowRight } from "lucide-react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

.footer-root {
  font-family: 'DM Sans', sans-serif;
}

.footer-serif {
  font-family: 'Cormorant Garamond', Georgia, serif;
}

/* reveal */

.footer-reveal {
  opacity: 0;
  transform: translateY(25px);
}

.footer-visible {
  opacity: 1;
  transform: translateY(0);
}

/* social */

.footer-social {
  transition:
    transform .3s ease,
    background .3s ease,
    color .3s ease,
    border-color .3s ease;
}

.footer-social:hover {
  transform: translateY(-4px);
}

/* newsletter button */

.footer-submit {
  position: relative;
  overflow: hidden;
}

.footer-submit::after {
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

.footer-submit:hover::after {
  left: 140%;
}

/* background ornament */

.footer-orbit {
  animation: footerOrbit 10s ease-in-out infinite;
}

@keyframes footerOrbit {
  0%,100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-12px);
  }
}

/* links */

.footer-link {
  position: relative;
  transition:
    color .3s ease,
    transform .3s ease;
}

.footer-link:hover {
  color: #a47c43;
  transform: translateX(4px);
}

/* reduced motion */

@media (prefers-reduced-motion: reduce) {
  .footer-root * {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
`;

const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

const Footer = () => {
  const [ref, visible] = useReveal();

  const reveal = (index) => ({
    className: `transition-all duration-1000 ease-out ${
      visible ? "footer-visible" : "footer-reveal"
    }`,
    style: {
      transitionDelay: `${index * 130}ms`,
    },
  });

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      ref={ref}
      className="footer-root relative overflow-hidden bg-[#f4efe7] text-[#65564c]"
    >
      <style>{styles}</style>

      {/* --------------------------------
          Decorative background
      -------------------------------- */}

      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#eadbc9]/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#e9dfc9]/50 blur-3xl" />

      <div className="footer-orbit pointer-events-none absolute right-[15%] top-20 h-20 w-20 rounded-full border border-[#c5a56d]/20" />

      {/* --------------------------------
          Top brand statement
      -------------------------------- */}

      <div className="relative border-b border-[#ddd2c4]">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center sm:py-16">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.3em] text-[#a47c43]">
            Sri Sai Balaji Dress Materials
          </p>

          <h2 className="footer-serif text-4xl font-semibold text-[#3c2c23] sm:text-5xl">
            Style that feels like you.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#7d6e63]">
            Beautiful fabrics, thoughtful collections and everyday elegance —
            carefully selected for you.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#c8aa75]" />
            <span className="text-[#a47c43]">✦</span>
            <span className="h-px w-12 bg-[#c8aa75]" />
          </div>
        </div>
      </div>

      {/* --------------------------------
          Main footer
      -------------------------------- */}

      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_.8fr_.8fr_1.2fr]">
          {/* --------------------------------
              Brand
          -------------------------------- */}

          <div {...reveal(0)}>
            <Link to="/" className="inline-block">
              <div className="rounded-2xl border border-[#d6c7b5] bg-white p-2 shadow-[0_12px_30px_-20px_rgba(70,50,35,.35)] transition-all duration-300 hover:-translate-y-1">
                <img
                  src="/Shop.png"
                  alt="Sri Sai Balaji Dress Materials"
                  className="h-16 w-16 object-contain"
                />
              </div>
            </Link>

            <h3 className="footer-serif mt-5 text-2xl font-semibold text-[#3c2c23]">
              Sri Sai Balaji
            </h3>

            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[.25em] text-[#a47c43]">
              Dress Materials
            </p>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#78695e]">
              Discover beautiful dress materials, sarees, leggings and everyday
              fashion at prices you'll love.
            </p>

            {/* Contact */}

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#a47c43]" />

                <p className="text-xs leading-6 text-[#78695e]">
                  Shop No. 311, Panja Center, Krishnaveni Cloth Market, Mahanthi
                  Puram, Vinchipeta, Vijayawada, Andhra Pradesh 520001
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#a47c43]" />

                <p className="text-xs text-[#78695e]">umamuvvala72@gmail.com</p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#a47c43]" />

                <p className="text-xs text-[#78695e]">+91 9491955032</p>
              </div>
            </div>
          </div>

          {/* --------------------------------
              Customer care
          -------------------------------- */}

          <div {...reveal(1)}>
            <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#a47c43]">
              Help
            </p>

            <h3 className="footer-serif mt-2 text-2xl font-semibold text-[#3c2c23]">
              Customer Care
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                to="/contact"
                className="footer-link block text-sm text-[#78695e]"
              >
                Contact Us
              </Link>

              <Link
                to="/shipping"
                className="footer-link block text-sm text-[#78695e]"
              >
                Shipping & Returns
              </Link>

              <Link
                to="/faq"
                className="footer-link block text-sm text-[#78695e]"
              >
                FAQs
              </Link>

              <Link
                to="/orders"
                className="footer-link block text-sm text-[#78695e]"
              >
                Order Tracking
              </Link>

              <Link
                to="/size-guide"
                className="footer-link block text-sm text-[#78695e]"
              >
                Size Guide
              </Link>
            </div>
          </div>

          {/* --------------------------------
              Explore
          -------------------------------- */}

          <div {...reveal(2)}>
            <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#a47c43]">
              Discover
            </p>

            <h3 className="footer-serif mt-2 text-2xl font-semibold text-[#3c2c23]">
              Explore
            </h3>

            <div className="mt-5 space-y-3">
              <Link
                to="/products"
                className="footer-link block text-sm text-[#78695e]"
              >
                All Collections
              </Link>

              <Link
                to="/products"
                className="footer-link block text-sm text-[#78695e]"
              >
                New Arrivals
              </Link>

              <Link
                to="/products"
                className="footer-link block text-sm text-[#78695e]"
              >
                Best Sellers
              </Link>

              <Link
                to="/about"
                className="footer-link block text-sm text-[#78695e]"
              >
                Our Story
              </Link>

              <Link
                to="/contact"
                className="footer-link block text-sm text-[#78695e]"
              >
                Visit Us
              </Link>
            </div>
          </div>

          {/* --------------------------------
              Newsletter
          -------------------------------- */}

          <div {...reveal(3)}>
            <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#a47c43]">
              Stay Connected
            </p>

            <h3 className="footer-serif mt-2 text-2xl font-semibold text-[#3c2c23]">
              Be the first to know.
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#78695e]">
              Get updates about new collections, special offers and beautiful
              arrivals.
            </p>

            <form
              className="mt-6 flex overflow-hidden rounded-full border border-[#d3c4b2] bg-white p-1.5 shadow-sm"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[#4b3a30] outline-none placeholder:text-[#a69a90]"
              />

              <button
                type="submit"
                className="footer-submit flex h-10 items-center gap-2 rounded-full bg-[#3d2c23] px-5 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#4c372c]"
              >
                Join
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Social */}

            <div className="mt-7">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[.2em] text-[#a47c43]">
                Follow our journey
              </p>

              <div className="flex gap-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="footer-social flex h-10 w-10 items-center justify-center rounded-full border border-[#d4c5b4] bg-white text-[#76675c] hover:border-[#b99a65] hover:bg-[#f4eadc] hover:text-[#96703e]"
                >
                  <FaFacebook size={17} />
                </a>

                <a
                  href="#"
                  aria-label="Instagram"
                  className="footer-social flex h-10 w-10 items-center justify-center rounded-full border border-[#d4c5b4] bg-white text-[#76675c] hover:border-[#b99a65] hover:bg-[#f4eadc] hover:text-[#96703e]"
                >
                  <FaInstagram size={17} />
                </a>

                <a
                  href="#"
                  aria-label="Pinterest"
                  className="footer-social flex h-10 w-10 items-center justify-center rounded-full border border-[#d4c5b4] bg-white text-[#76675c] hover:border-[#b99a65] hover:bg-[#f4eadc] hover:text-[#96703e]"
                >
                  <FaPinterest size={17} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------
          Bottom bar
      -------------------------------- */}

      <div className="border-t border-[#ddd2c4]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-[11px] text-[#8b7c70]">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-[#695446]">
              Sri Sai Balaji Dress Materials
            </span>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <span className="text-[10px] uppercase tracking-[.15em] text-[#a0958b]">
              Made with care
            </span>

            <button
              type="button"
              aria-label="Back to top"
              onClick={scrollTop}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4c5b4] bg-white text-[#765f4d] transition-all duration-300 hover:-translate-y-1 hover:border-[#b99a65] hover:bg-[#f5eadc]"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
