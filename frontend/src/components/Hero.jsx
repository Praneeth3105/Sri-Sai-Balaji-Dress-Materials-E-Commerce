import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

.hero-root {
  --mx: 50%;
  --my: 50%;
  --px: 0;
  --py: 0;
  font-family: 'DM Sans', sans-serif;
}

.hero-serif {
  font-family: 'Cormorant Garamond', Georgia, serif;
}

/* --------------------------------
   Entrance animations
-------------------------------- */

.hero-fade {
  opacity: 0;
  animation: heroFade 1s ease forwards;
}

@keyframes heroFade {
  from {
    opacity: 0;
    transform: translateY(25px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-image {
  opacity: 0;
  animation: heroImage 1.2s cubic-bezier(.2,.8,.2,1) .25s forwards;
}

@keyframes heroImage {
  from {
    opacity: 0;
    transform: translateY(30px) scale(.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* --------------------------------
   Floating decorations
-------------------------------- */

.hero-float {
  animation: heroFloat 7s ease-in-out infinite;
}

.hero-float-reverse {
  animation: heroFloat 9s ease-in-out infinite reverse;
}

@keyframes heroFloat {
  0%,100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-12px);
  }
}

/* --------------------------------
   Image shine
-------------------------------- */

.hero-image-shine {
  position: relative;
  overflow: hidden;
}

.hero-image-shine::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      120deg,
      transparent 35%,
      rgba(255,255,255,.38) 50%,
      transparent 65%
    );
  transform: translateX(-120%);
  transition: transform 1s ease;
}

.hero-image-shine:hover::after {
  transform: translateX(120%);
}

/* --------------------------------
   Gold shimmer
-------------------------------- */

.hero-gold {
  background:
    linear-gradient(
      90deg,
      #b88a44,
      #e8c98c,
      #9f7436,
      #d9b56d
    );

  background-size: 200% auto;

  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  animation: goldMove 5s linear infinite;
}

@keyframes goldMove {
  to {
    background-position: 200% center;
  }
}

/* --------------------------------
   Button shine
-------------------------------- */

.hero-button {
  position: relative;
  overflow: hidden;
}

.hero-button::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  transform: skewX(-20deg);

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.45),
      transparent
    );

  transition: left .7s ease;
}

.hero-button:hover::after {
  left: 140%;
}

/* --------------------------------
   Decorative line
-------------------------------- */

.hero-line {
  width: 70px;
  height: 2px;
  background:
    linear-gradient(
      90deg,
      #b88a44,
      #e6c88a,
      transparent
    );
}

/* --------------------------------
   Reduced motion
-------------------------------- */

@media (prefers-reduced-motion: reduce) {
  .hero-root * {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
`;

const Hero = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;

    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      el.style.setProperty("--px", (x / rect.width - 0.5).toFixed(3));

      el.style.setProperty("--py", (y / rect.height - 0.5).toFixed(3));
    };

    const handleMouseLeave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-root relative overflow-hidden bg-[#f9f6ef] text-[#35271f]"
    >
      <style>{styles}</style>

      {/* --------------------------------
          Soft background decorations
      -------------------------------- */}

      <div
        className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[#ead7c8]/60 blur-3xl transition-transform duration-700"
        style={{
          transform:
            "translate(calc(var(--px) * -25px), calc(var(--py) * -25px))",
        }}
      />

      <div
        className="pointer-events-none absolute -bottom-40 -right-32 h-[450px] w-[450px] rounded-full bg-[#eadfc3]/70 blur-3xl transition-transform duration-700"
        style={{
          transform:
            "translate(calc(var(--px) * 30px), calc(var(--py) * 30px))",
        }}
      />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f3e4df]/70 blur-3xl" />

      {/* subtle pattern */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(#6d5545 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* --------------------------------
          Main content
      -------------------------------- */}

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-32 lg:pb-24 lg:pt-36">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
          {/* LEFT */}

          <div className="max-w-2xl">
            {/* Small label */}

            <div
              className="hero-fade mb-7 flex items-center gap-3"
              style={{ animationDelay: ".1s" }}
            >
              <span className="hero-line" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9b753e]">
                Sri Sai Balaji Dress Materials
              </span>
            </div>

            {/* Heading */}

            <h1
              className="hero-serif hero-fade text-[54px] font-semibold leading-[.95] tracking-[-0.025em] text-[#33251e] sm:text-[68px] lg:text-[82px]"
              style={{ animationDelay: ".2s" }}
            >
              Elegance
              <br />
              <span className="hero-gold italic">Woven</span>
              <br />
              For You.
            </h1>

            {/* Description */}

            <p
              className="hero-fade mt-7 max-w-xl text-[16px] leading-8 text-[#75665c] sm:text-[17px]"
              style={{ animationDelay: ".45s" }}
            >
              Discover beautiful dress materials, sarees and everyday essentials
              carefully selected to bring timeless style, comfort and elegance
              to your wardrobe.
            </p>

            {/* Decorative divider */}

            <div
              className="hero-fade mt-7 flex items-center gap-3"
              style={{ animationDelay: ".55s" }}
            >
              <span className="h-px w-16 bg-[#c7a66a]" />
              <span className="text-xs text-[#b18a4c]">✦</span>
              <span className="h-px w-16 bg-[#c7a66a]" />
            </div>

            {/* Buttons */}

            <div
              className="hero-fade mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: ".65s" }}
            >
              <Button
                type="button"
                onClick={() => navigate("/products")}
                className="hero-button h-13 rounded-full bg-[#3b2a22] px-9 text-sm font-semibold text-white shadow-[0_14px_35px_-12px_rgba(59,42,34,.55)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#4a342a] hover:shadow-[0_20px_45px_-12px_rgba(59,42,34,.65)]"
              >
                Explore Collection
              </Button>

              <Button
                type="button"
                onClick={() => navigate("/products")}
                variant="outline"
                className="h-13 rounded-full border-[#c9b59b] bg-white/60 px-9 text-sm font-semibold text-[#4a382d] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#a98148] hover:bg-white"
              >
                View New Arrivals
              </Button>
            </div>

            {/* Trust points */}

            <div
              className="hero-fade mt-10 flex flex-wrap gap-x-8 gap-y-3 text-xs font-medium uppercase tracking-[0.12em] text-[#88776b]"
              style={{ animationDelay: ".8s" }}
            >
              <span>✦ Premium Fabrics</span>
              <span>✦ Best Prices</span>
              <span>✦ Trusted Service</span>
            </div>
          </div>

          {/* RIGHT IMAGE */}

          <div className="relative flex justify-center lg:justify-end">
            {/* Decorative circle */}

            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-[#c9a968]/40 sm:right-0" />

            <div className="absolute -bottom-10 -left-5 h-20 w-20 rounded-full border border-[#d9bba8]/50" />

            {/* Main image container */}

            <div className="hero-image relative w-full max-w-[500px]">
              {/* soft glow */}

              <div className="absolute -inset-5 rounded-[45px] bg-[#dcc8ad]/40 blur-2xl" />

              {/* offset frame */}

              <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-[38px] border border-[#bfa87e]/45" />

              {/* Image */}

              <div className="hero-image-shine relative overflow-hidden rounded-[38px] border-[7px] border-white bg-white shadow-[0_35px_80px_-25px_rgba(79,56,39,.35)]">
                <img
                  src="/Hero-1.jpg"
                  alt="Sri Sai Balaji Dress Materials Collection"
                  className="h-[500px] w-full object-cover object-center transition-transform duration-[1200ms] hover:scale-105 sm:h-[570px]"
                />

                {/* image gradient */}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2d2019]/35 via-transparent to-white/10" />

                {/* image caption */}

                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/40 bg-white/80 px-5 py-4 shadow-xl backdrop-blur-md">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9a7745]">
                    The New Edit
                  </p>

                  <p className="hero-serif mt-1 text-2xl font-semibold text-[#3a2921]">
                    Everyday elegance
                  </p>
                </div>
              </div>

              {/* Floating label */}

              <div className="hero-float absolute -left-5 top-16 rounded-2xl border border-white/80 bg-white/90 px-5 py-3 shadow-[0_15px_40px_-15px_rgba(75,50,35,.3)] backdrop-blur-md sm:-left-10">
                <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#a17b43]">
                  New
                </p>

                <p className="hero-serif text-lg font-semibold text-[#3c2b22]">
                  Arrivals
                </p>
              </div>

              {/* Floating premium label */}

              <div className="hero-float-reverse absolute -right-3 bottom-24 rounded-2xl border border-[#d8c7a9] bg-[#fbf7ee]/95 px-5 py-3 shadow-[0_15px_40px_-15px_rgba(75,50,35,.25)] sm:-right-8">
                <p className="text-[10px] uppercase tracking-[.18em] text-[#a17b43]">
                  Curated
                </p>

                <p className="hero-serif text-lg font-semibold text-[#3c2b22]">
                  With Love ✦
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------
          Bottom statement
      -------------------------------- */}

      <div className="relative border-t border-[#d8cbb9] bg-white/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-5 text-center text-[11px] font-medium uppercase tracking-[.22em] text-[#847368]">
          <span>New Collections</span>
          <span className="text-[#b69256]">✦</span>
          <span>Beautiful Fabrics</span>
          <span className="text-[#b69256]">✦</span>
          <span>Affordable Luxury</span>
          <span className="text-[#b69256]">✦</span>
          <span>Made For You</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
