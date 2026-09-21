import { Headphones, ShieldCheck, Truck } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

.features-root {
  font-family: 'DM Sans', sans-serif;
}

.features-serif {
  font-family: 'Cormorant Garamond', Georgia, serif;
}

/* reveal */

.feature-reveal {
  opacity: 0;
  transform: translateY(25px);
}

.feature-visible {
  opacity: 1;
  transform: translateY(0);
}

/* card */

.feature-card {
  position: relative;
  transition:
    transform .5s cubic-bezier(.2,.8,.2,1),
    box-shadow .5s ease,
    border-color .5s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow:
    0 25px 55px -25px rgba(70, 48, 35, .28);
}

/* icon */

.feature-icon {
  transition:
    transform .5s cubic-bezier(.2,.8,.2,1),
    background .5s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.08) rotate(-4deg);
}

/* number */

.feature-number {
  transition:
    opacity .4s ease,
    transform .4s ease;
}

.feature-card:hover .feature-number {
  opacity: .16;
  transform: translateY(-4px);
}

/* shine */

.feature-shine {
  position: relative;
  overflow: hidden;
}

.feature-shine::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.65),
      transparent
    );

  transform: skewX(-20deg);
  transition: left .8s ease;
}

.feature-card:hover .feature-shine::after {
  left: 140%;
}

/* decorative circle */

.feature-circle {
  animation: featureCircle 8s ease-in-out infinite;
}

@keyframes featureCircle {
  0%,100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .features-root * {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
`;

const features = [
  {
    icon: Truck,
    number: "01",
    title: "Free Shipping",
    text: "Enjoy complimentary delivery on orders above ₹299.",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Secure Payments",
    text: "Your payments are protected with secure transactions.",
  },
  {
    icon: Headphones,
    number: "03",
    title: "Always Here",
    text: "Our support team is ready whenever you need us.",
  },
];

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
        threshold: 0.15,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

const Features = () => {
  const [ref, visible] = useReveal();

  return (
    <section
      ref={ref}
      className="features-root relative overflow-hidden bg-[#f9f6ef] py-20 sm:py-24"
    >
      <style>{styles}</style>

      {/* soft background */}

      <div className="pointer-events-none absolute left-0 top-20 h-64 w-64 rounded-full bg-[#ead9cb]/35 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#e9ddc5]/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section heading */}

        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#c4a263]" />

            <span className="text-xs font-semibold uppercase tracking-[.3em] text-[#a27b43]">
              The Sri Sai Balaji Promise
            </span>

            <span className="h-px w-12 bg-[#c4a263]" />
          </div>

          <h2 className="features-serif text-4xl font-semibold text-[#382921] sm:text-5xl">
            Designed around you
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#796b61] sm:text-base">
            From choosing your favourite collection to receiving it at your
            doorstep, we make every step simple and special.
          </p>
        </div>

        {/* Cards */}

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`feature-card feature-shine relative overflow-hidden rounded-[28px] border border-[#dfd3c3] bg-white/75 p-7 backdrop-blur-sm transition-all duration-1000 ${
                  visible ? "feature-visible" : "feature-reveal"
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                {/* decorative number */}

                <span className="feature-number features-serif pointer-events-none absolute -right-1 -top-5 text-[110px] font-bold leading-none text-[#8d6b45]/[0.06]">
                  {feature.number}
                </span>

                {/* icon */}

                <div className="relative mb-7">
                  <div className="feature-circle absolute -inset-2 rounded-full border border-[#d9c29a]/40" />

                  <div className="feature-icon relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3eadb] text-[#9a713b] shadow-sm">
                    <Icon className="h-6 w-6" strokeWidth={1.7} />
                  </div>
                </div>

                {/* text */}

                <div className="relative">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.25em] text-[#aa8247]">
                    0{index + 1}
                  </p>

                  <h3 className="features-serif text-2xl font-semibold text-[#3c2b22]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 max-w-xs text-sm leading-7 text-[#7b6d62]">
                    {feature.text}
                  </p>
                </div>

                {/* bottom accent */}

                <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-[#c9a76b] to-transparent opacity-50" />
              </div>
            );
          })}
        </div>

        {/* small bottom statement */}

        <div className="mt-12 flex items-center justify-center gap-4 text-center">
          <span className="h-px w-16 bg-[#d6c6b0]" />

          <span className="features-serif text-lg italic text-[#927044]">
            Fashion that feels like you
          </span>

          <span className="h-px w-16 bg-[#d6c6b0]" />
        </div>
      </div>
    </section>
  );
};

export default Features;
