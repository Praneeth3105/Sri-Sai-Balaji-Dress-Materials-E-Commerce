import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/contact`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.success) {
        setForm({
          name: "",
          email: "",
          message: "",
        });

        toast.success("Message sent successfully!");
      }
    } catch (error) {
      console.error("CONTACT ERROR:", error);

      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#3d3028]">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden px-6 pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#e6d1b5]/40 blur-3xl" />
        <div className="absolute top-32 -left-32 w-72 h-72 rounded-full bg-[#ead6d0]/30 blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-[#a78352] font-semibold mb-4">
            We'd Love To Hear From You
          </p>

          <h1 className="font-[Cormorant_Garamond] text-5xl md:text-7xl text-[#382b24] leading-none">
            Get In
            <span className="italic text-[#a78352]"> Touch</span>
          </h1>

          <div className="w-14 h-px bg-[#b99a6b] mx-auto my-6" />

          <p className="max-w-xl mx-auto text-sm md:text-base leading-7 text-[#776961]">
            Questions about an order, fabric availability, or bulk pricing?
            Reach out — we're always happy to help.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
          {/* ================= STORE DETAILS ================= */}
          <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.75rem] p-7 md:p-9 shadow-sm">
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold mb-2">
                Come Say Hello
              </p>

              <h2 className="font-[Cormorant_Garamond] text-3xl md:text-4xl text-[#3e3028]">
                Visit The Store
              </h2>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 mb-7">
              <div className="w-11 h-11 flex-shrink-0 rounded-full bg-[#f0e4d3] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#9b794e]" strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#4a382c] mb-1">
                  Address
                </p>

                <p className="text-sm leading-6 text-[#776961]">
                  Shop No. 311, Panja Center,
                  <br />
                  Krishnaveni Cloth Market,
                  <br />
                  Mahanthi Puram, Vinchipeta,
                  <br />
                  Vijayawada, Andhra Pradesh 520001
                </p>

                <a
                  href="https://maps.app.goo.gl/Wqsvcj6JXR8rydcW9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-[#9a784e] hover:text-[#735637] transition-colors"
                >
                  View on Google Maps
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="h-px bg-[#eadfd3] mb-7" />

            {/* Phone */}
            <div className="flex items-start gap-4 mb-7">
              <div className="w-11 h-11 flex-shrink-0 rounded-full bg-[#f0e4d3] flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#9b794e]" strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#4a382c] mb-1">
                  Phone
                </p>

                <a
                  href="tel:+919491955032"
                  className="text-sm text-[#776961] hover:text-[#9a784e] transition-colors"
                >
                  +91 94919 55032
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 mb-7">
              <div className="w-11 h-11 flex-shrink-0 rounded-full bg-[#f0e4d3] flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#9b794e]" strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#4a382c] mb-1">
                  Email
                </p>

                <a
                  href="mailto:umamuvvala72@gmail.com"
                  className="text-sm text-[#776961] hover:text-[#9a784e] transition-colors break-all"
                >
                  umamuvvala72@gmail.com
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-11 h-11 flex-shrink-0 rounded-full bg-[#f0e4d3] flex items-center justify-center">
                <Clock3 className="w-5 h-5 text-[#9b794e]" strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#4a382c] mb-1">
                  Store Hours
                </p>

                <p className="text-sm leading-6 text-[#776961]">
                  Mon – Sat: 10:00 AM – 8:30 PM
                  <br />
                  Sunday: 11:00 AM – 2:00 PM
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-[#e4d7c7] bg-[#f1e9df]">
              <div className="px-4 py-3 bg-[#f7f1e9] border-b border-[#e4d7c7]">
                <p className="font-[Cormorant_Garamond] text-lg text-[#4a382c]">
                  Find Us In Vijayawada
                </p>
              </div>

              <iframe
                title="Sri Sai Balaji Dress Materials location"
                src="https://www.google.com/maps?q=Panja+Center,+Krishnaveni+Cloth+Market,+Mahanthi+Puram,+Vinchipeta,+Vijayawada,+Andhra+Pradesh+520001&output=embed"
                width="100%"
                height="220"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* ================= CONTACT FORM ================= */}
          <div className="relative overflow-hidden bg-[#4a382c] rounded-[1.75rem] p-7 md:p-10 text-white shadow-xl">
            {/* Decorative circles */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full border border-[#d0b383]/20" />
            <div className="absolute -bottom-32 -left-24 w-72 h-72 rounded-full border border-[#d0b383]/10" />

            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-[#b99a6b]/20 flex items-center justify-center mb-6">
                <MessageCircle
                  className="w-5 h-5 text-[#dfc49b]"
                  strokeWidth={1.5}
                />
              </div>

              <p className="text-[10px] uppercase tracking-[0.3em] text-[#d2b888] font-semibold mb-2">
                Let's Talk
              </p>

              <h2 className="font-[Cormorant_Garamond] text-4xl md:text-5xl mb-3">
                Send a Message
              </h2>

              <p className="text-sm leading-7 text-[#d5c7bb] mb-8 max-w-md">
                Tell us what you're looking for and we'll get back to you as
                soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs uppercase tracking-wider text-[#dfd1c5] mb-2"
                  >
                    Your Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3.5 text-sm text-white placeholder:text-[#bcaea3] focus:outline-none focus:border-[#cdb27f] focus:ring-1 focus:ring-[#cdb27f] transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-wider text-[#dfd1c5] mb-2"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3.5 text-sm text-white placeholder:text-[#bcaea3] focus:outline-none focus:border-[#cdb27f] focus:ring-1 focus:ring-[#cdb27f] transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs uppercase tracking-wider text-[#dfd1c5] mb-2"
                  >
                    Your Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="How can we help you?"
                    className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3.5 text-sm text-white placeholder:text-[#bcaea3] focus:outline-none focus:border-[#cdb27f] focus:ring-1 focus:ring-[#cdb27f] transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#d1b47f] hover:bg-[#dec494] disabled:opacity-50 disabled:cursor-not-allowed text-[#3d2e24] font-semibold rounded-full py-3.5 text-sm transition-all cursor-pointer"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-[11px] text-[#bcaea3] mt-6">
                We usually reply within the same day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM MESSAGE ================= */}
      <section className="px-6 pb-24 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-12 h-px bg-[#b99a6b] mx-auto mb-6" />

          <p className="font-[Cormorant_Garamond] italic text-2xl md:text-3xl text-[#6b5441]">
            "Style that feels like you."
          </p>

          <p className="text-xs uppercase tracking-[0.25em] text-[#a78352] mt-4">
            Sri Sai Balaji Dress Materials
          </p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
