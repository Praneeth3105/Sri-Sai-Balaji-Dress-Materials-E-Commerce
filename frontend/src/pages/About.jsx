import React from "react";
import { ArrowRight, CheckCircle2, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    title: "Quality Fabrics",
    desc: "Every piece is carefully selected for its texture, print, finish, and overall quality before it reaches our collection.",
    icon: CheckCircle2,
  },
  {
    title: "Honest Pricing",
    desc: "We believe beautiful fabrics should come with fair, transparent pricing — without unnecessary markups.",
    icon: Sparkles,
  },
  {
    title: "Rooted In Vijayawada",
    desc: "Located in Krishnaveni Cloth Market, we're a real local store bringing the personal shopping experience online.",
    icon: MapPin,
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#3d3028]">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden px-6 pt-28 pb-24 md:pt-36 md:pb-32">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#ead8bd]/40 blur-3xl" />
        <div className="absolute top-20 -right-32 w-80 h-80 rounded-full bg-[#e8cfc5]/30 blur-3xl" />

        <div className="relative max-w-5xl mx-auto text-center">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-[#a78352] font-semibold mb-5">
            Our Story
          </p>

          <h1 className="font-[Cormorant_Garamond] text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-[#382b24]">
            Sri Sai Balaji
            <span className="block italic font-normal text-[#a78352]">
              Dress Materials
            </span>
          </h1>

          <div className="w-16 h-px bg-[#b99a6b] mx-auto my-7" />

          <p className="max-w-2xl mx-auto text-sm md:text-base leading-8 text-[#75665d]">
            A family-run dress material store in the heart of Vijayawada's
            Krishnaveni Cloth Market, bringing carefully selected fabrics and
            everyday elegance online — without losing the personal touch of a
            store you can walk into.
          </p>
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section className="px-6 py-20 md:py-28 bg-[#f2ece4]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Image / Editorial panel */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border border-[#c9ae83]/50 rounded-[2rem]" />

            <div className="relative h-[400px] md:h-[480px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#e5d5c0] via-[#f4eee6] to-[#d9c3a7] flex items-center justify-center">
              {/* Decorative fabric-style shapes */}
              <div className="absolute w-64 h-64 rounded-full border border-[#b99a6b]/30" />
              <div className="absolute w-48 h-48 rounded-full border border-[#b99a6b]/20 rotate-45" />

              <div className="relative text-center px-8">
                <p className="uppercase tracking-[0.3em] text-[10px] text-[#9b794e] mb-4">
                  Since The Beginning
                </p>

                <h3 className="font-[Cormorant_Garamond] text-5xl md:text-6xl italic text-[#4a382c]">
                  Style
                </h3>

                <p className="font-[Cormorant_Garamond] text-3xl text-[#8e704c]">
                  with a personal touch
                </p>
              </div>
            </div>
          </div>

          {/* Story */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#a78352] font-semibold mb-4">
              From The Market To Your Doorstep
            </p>

            <h2 className="font-[Cormorant_Garamond] text-4xl md:text-5xl leading-tight text-[#3c2d25] mb-7">
              A local store,
              <span className="block italic text-[#a78352]">
                now a little closer to you.
              </span>
            </h2>

            <div className="space-y-5 text-[#75665d] text-sm md:text-base leading-8">
              <p>
                What started as a single shop counter in Panja Center has grown
                into an online shopping experience — the same fabrics, the same
                trusted sourcing, and the same care, now just a few taps away.
              </p>

              <p>
                We carefully select our dress materials based on their feel,
                print, colour, finish, and everyday usability before adding them
                to our collection.
              </p>

              <p>
                Whether you're shopping for a festival, a special occasion, a
                thoughtful gift, or simply something beautiful for your everyday
                wardrobe, our goal remains simple:
                <span className="font-semibold text-[#4a382c]">
                  {" "}
                  good fabric, fair pricing, and a pleasant shopping experience.
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 mt-8 text-[#a78352]">
              <div className="w-10 h-px bg-[#b99a6b]" />
              <span className="font-[Cormorant_Garamond] italic text-lg">
                Style that feels like you.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="px-6 py-20 md:py-28 bg-[#f8f4ee]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#a78352] font-semibold mb-3">
              Our Promise
            </p>

            <h2 className="font-[Cormorant_Garamond] text-4xl md:text-5xl text-[#3d3028]">
              What We Stand For
            </h2>

            <p className="max-w-xl mx-auto mt-4 text-sm leading-7 text-[#81736a]">
              The little things that make shopping with Sri Sai Balaji
              different.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="group bg-[#fffdf9] border border-[#e7dccd] rounded-[1.5rem] p-8 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#6b5138]/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-[#f0e4d3] flex items-center justify-center mb-6 group-hover:bg-[#e7d3b3] transition-colors">
                    <Icon
                      className="w-5 h-5 text-[#9a784e]"
                      strokeWidth={1.5}
                    />
                  </div>

                  <h3 className="font-[Cormorant_Garamond] text-2xl text-[#45352b] mb-3">
                    {value.title}
                  </h3>

                  <p className="text-sm leading-7 text-[#7b6d64]">
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= LOCATION STRIP ================= */}
      <section className="px-6 py-14 bg-[#eee5da]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f8f4ee] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#a78352]" strokeWidth={1.5} />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#a78352] font-semibold">
                Visit Us
              </p>

              <p className="font-[Cormorant_Garamond] text-xl text-[#44352c]">
                Krishnaveni Cloth Market, Vijayawada
              </p>
            </div>
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 border border-[#b99a6b] text-[#6d5338] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#b99a6b] hover:text-white transition-all"
          >
            Visit Store
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 py-24 md:py-28 text-center bg-[#f8f4ee]">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#a78352] font-semibold mb-4">
          Need Help?
        </p>

        <h2 className="font-[Cormorant_Garamond] text-4xl md:text-5xl text-[#3d3028] mb-4">
          Have a question before you order?
        </h2>

        <p className="text-sm md:text-base text-[#7b6d64] mb-8">
          We're happy to help you choose the right fabric or product.
        </p>

        <Link
          to="/contact"
          className="inline-flex items-center gap-3 bg-[#4a382c] hover:bg-[#35271f] text-white px-7 py-3.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-[#4a382c]/10"
        >
          Contact Us
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};

export default About;
