"use client";
import { useState } from "react";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

    return (
    <section className="py-24 bg-background" id="contact">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 max-w-5xl">
        {/* Left: Illustration */}
        <div className="flex-1 flex justify-center mb-8 md:mb-0">
          <img
            src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80"
            alt="Team collaborating at computers"
            className="rounded-2xl shadow-2xl w-full max-w-2xl object-cover border-4 border-indigo-500"
            style={{ minHeight: 400, maxHeight: 480 }}
          />
        </div>
        {/* Right: Contact Form */}
        <div className="flex-1 w-full max-w-xl">
          <h2 className="text-3xl font-bold mb-4 text-center md:text-left">Contact Us</h2>
          <p className="text-muted-foreground mb-8 text-center md:text-left">Have questions or want to collaborate? Reach out!</p>
          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl shadow">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
              {loading ? "Sending..." : "Send Message"}
            </button>
            {success && <div className="text-green-600 font-medium">Message sent successfully!</div>}
            {error && <div className="text-red-600 font-medium">{error}</div>}
          </form>
        </div>
        </div>
      </section>
    );
  }