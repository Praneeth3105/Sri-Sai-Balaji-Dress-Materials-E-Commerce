import { Headphones, Shield, Truck } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

.feat-root{font-family:'Plus Jakarta Sans',system-ui,sans-serif}
.feat-display{font-family:'Playfair Display',Georgia,serif}
.feat-card{--cx:50%;--cy:50%}
.feat-spot{background:radial-gradient(360px circle at var(--cx) var(--cy),rgba(252,211,77,.2),transparent 60%)}

.feat-drift{animation:feat-drift 16s ease-in-out infinite}
.feat-drift-b{animation:feat-drift 20s ease-in-out infinite reverse}
@keyframes feat-drift{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(50px,-30px,0) scale(1.15)}}

.feat-icon{animation:feat-float 4s ease-in-out infinite}
@keyframes feat-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.feat-ring{animation:feat-ring 2.8s ease-out infinite}
@keyframes feat-ring{0%{transform:scale(1);opacity:.55}100%{transform:scale(1.8);opacity:0}}

@media (prefers-reduced-motion:reduce){
  .feat-root *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
}
`;

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    text: "On orders over ₹299",
    number: "01",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    text: "100% secure transactions",
    number: "02",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    text: "Always here to help",
    number: "03",
  },
];

// reveal-on-scroll hook
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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, visible];
};

const Features = () => {
  const [ref, visible] = useReveal();

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--cx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--cy", `${e.clientY - r.top}px`);
  };

  return (
    <section
      ref={ref}
      className="feat-root relative overflow-hidden bg-[#160828] py-20"
    >
      <style>{styles}</style>

      {/* Background blobs so the glass has something to blur */}
      <div className="feat-drift pointer-events-none absolute -top-24 left-[8%] h-80 w-80 rounded-full bg-fuchsia-600/30 blur-3xl" />
      <div className="feat-drift-b pointer-events-none absolute -bottom-32 right-[6%] h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="feat-drift pointer-events-none absolute top-1/3 left-1/2 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              // Wrapper handles scroll reveal (with stagger)
              <div
                key={f.title}
                className={`transition-all duration-1000 ease-out ${
                  visible
                    ? "opacity-100 translate-y-0 blur-0"
                    : "opacity-0 translate-y-12 blur-sm"
                }`}
                style={{ transitionDelay: `${i * 160}ms` }}
              >
                {/* Card handles hover */}
                <div
                  onMouseMove={handleMove}
                  className="feat-card group relative overflow-hidden flex items-center gap-5 rounded-3xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] transition-all duration-500 hover:-translate-y-2 hover:border-amber-300/50 hover:bg-white/[0.12] hover:shadow-[0_24px_60px_-15px_rgba(217,70,239,0.5)]"
                >
                  {/* Cursor spotlight inside card */}
                  <div className="feat-spot pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Sliding top accent line */}
                  <div className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-amber-300 via-fuchsia-400 to-violet-400 transition-transform duration-700 group-hover:scale-x-100" />

                  {/* Faint index number */}
                  <span className="feat-display pointer-events-none absolute right-5 top-3 text-5xl font-bold text-white/[0.06] transition-colors duration-500 group-hover:text-amber-300/20">
                    {f.number}
                  </span>

                  {/* Icon */}
                  <div className="relative shrink-0">
                    <span
                      className="feat-ring absolute inset-0 rounded-full bg-amber-300/50"
                      style={{ animationDelay: `${i * 0.6}s` }}
                    />
                    <div
                      className="feat-icon relative h-14 w-14 rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                      style={{ animationDelay: `${i * 0.4}s` }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div className="relative">
                    <h3 className="feat-display text-xl font-semibold text-white transition-colors duration-300 group-hover:text-amber-200">
                      {f.title}
                    </h3>
                    <p className="text-sm text-white/65">{f.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
