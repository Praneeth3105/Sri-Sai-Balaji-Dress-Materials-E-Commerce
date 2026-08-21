import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sent, setSent] = useState(false);
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
        setSent(true);

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
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-amber-50 to-white">
      {/* Hero */}

      <section className="px-6 pt-16 pb-10 text-center">
        <p className="text-orange-600 font-semibold tracking-widest uppercase text-sm mb-3">
          We'd love to hear from you
        </p>

        <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Get In Touch
        </h1>

        <p className="text-slate-600 max-w-xl mx-auto">
          Questions about an order, fabric availability, or bulk pricing? Reach
          out — we usually reply the same day.
        </p>
      </section>

      {/* Content */}

      <section className="px-6 pb-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Store Details */}

        <div className="bg-white/70 backdrop-blur-md border border-orange-100 rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Visit The Store
          </h2>

          <div>
            <p className="font-semibold text-slate-800">Address</p>

            <p className="text-slate-600 text-sm leading-relaxed mt-1">
              Shop No. 311, Panja Center, Krishnaveni Cloth Market,
              <br />
              Mahanthi Puram, Vinchipeta, Vijayawada,
              <br />
              Andhra Pradesh 520001
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-800">Phone</p>

            <a
              href="tel:+919491955032"
              className="text-slate-600 text-sm hover:text-orange-600"
            >
              094919 55032
            </a>
          </div>

          <div>
            <p className="font-semibold text-slate-800">Store Hours</p>

            <p className="text-slate-600 text-sm">
              Mon – Sat: 10:00 AM – 8:30 PM
              <br />
              Sunday: 11:00 AM – 6:00 PM
            </p>
          </div>
        </div>

        {/* Contact Form */}

        <div className="bg-slate-900 text-white rounded-2xl shadow-lg p-8">
          <h2 className="font-serif text-2xl font-bold mb-1">Send a Message</h2>

          <p className="text-slate-300 text-sm mb-6">
            Fill this in and we'll get back to you shortly.
          </p>

          {sent && (
            <div className="mb-5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm px-4 py-3">
              Thanks! Your message has been received.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}

            <div>
              <label className="block text-sm text-slate-300 mb-1">Name</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Your name"
              />
            </div>

            {/* Email */}

            <div>
              <label className="block text-sm text-slate-300 mb-1">Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="you@example.com"
              />
            </div>

            {/* Message */}

            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Message
              </label>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                placeholder="How can we help?"
              />
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 transition-colors text-white font-semibold rounded-lg py-2.5 cursor-pointer"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
