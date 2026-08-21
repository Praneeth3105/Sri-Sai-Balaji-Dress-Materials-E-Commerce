import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire this up to your backend (e.g. POST /api/contact)
    // For now it just confirms locally.
    console.log("Contact form submitted:", form);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
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
        {/* Store details card */}
        <div className="bg-white/70 backdrop-blur-md border border-orange-100 rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Visit The Store
          </h2>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-800">Address</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Shop No. 311, Panja Center, Krishnaveni Cloth Market,
                <br />
                Mahanthi Puram, Vinchipeta, Vijayawada,
                <br />
                Andhra Pradesh 520001
              </p>
              <a
                href="https://share.google/fDADFYvLTGzXUtwn4"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-2"
              >
                View on Google Maps →
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
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
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-orange-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
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
        </div>

        {/* Message form */}
        <div className="bg-slate-900 text-white rounded-2xl shadow-lg p-8">
          <h2 className="font-serif text-2xl font-bold mb-1">Send a Message</h2>
          <p className="text-slate-300 text-sm mb-6">
            Fill this in and we'll get back to you shortly.
          </p>

          {sent && (
            <div className="mb-5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm px-4 py-3">
              Thanks! Your message has been noted.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold rounded-lg py-2.5"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
