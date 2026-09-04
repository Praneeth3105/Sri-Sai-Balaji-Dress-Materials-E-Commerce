import React from "react";

const values = [
  {
    title: "Quality Fabrics",
    desc: "Every piece is checked by hand before it reaches the shelf — texture, dye, and stitch.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: "Honest Pricing",
    desc: "No inflated tags before a 'sale'. The price you see is the price you pay.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 6v2m0 8v2"
      />
    ),
  },
  {
    title: "Rooted In Vijayawada",
    desc: "Based right in Krishnaveni Cloth Market — a shop you can actually walk into.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1"
      />
    ),
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-100 via-amber-50 to-orange-100 px-6 py-20 text-center">
        <p className="text-orange-600 font-semibold tracking-widest uppercase text-sm mb-3">
          Our Story
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-5">
          Sri Sai Balaji Dress Materials
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A family-run dress material store in the heart of Vijayawada's
          Krishnaveni Cloth Market, bringing quality fabrics and everyday
          fashion online — without losing the personal touch of a shop you can
          walk into.
        </p>
      </section>

      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">
              From The Market To Your Doorstep
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              What started as a single shop counter in Panja Center has grown
              into an online store — same fabrics, same trusted sourcing, now a
              few taps away. We handpick every dress material for its feel,
              print, and finish before it's listed.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Whether you're shopping for a festival, a gift, or your everyday
              wardrobe, our goal is simple: good fabric, fair price, and a
              smooth experience from browsing to delivery.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg h-72 bg-gradient-to-br from-orange-200 to-amber-100 flex items-center justify-center">
            <svg
              className="w-24 h-24 text-orange-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 3.75V6.75M15 3.75V6.75M4.5 21V6.75A2.25 2.25 0 016.75 4.5h10.5A2.25 2.25 0 0119.5 6.75V21M4.5 21h15M4.5 21l1.5-6h12l1.5 6"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-slate-900 text-center mb-10">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    {v.icon}
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{v.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">
          Have A Question Before You Order?
        </h2>
        <p className="text-slate-600 mb-6">
          We're happy to help you pick the right fabric or size.
        </p>
        <a
          href="/contact"
          className="inline-block bg-slate-900 hover:bg-slate-800 transition-colors text-white font-semibold rounded-lg px-6 py-3"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default About;
