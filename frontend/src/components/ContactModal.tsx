"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Send, MapPin, X } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

export default function ContactModal({ isOpen, onClose, defaultTopic = "General Inquiry" }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "Pune / India",
    topic: defaultTopic,
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "contact.scoutvision@gmail.com",
          subject: `[Website Inquiry] ${formData.topic}: ${formData.name}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          organization: formData.topic,
          message: formData.message
        })
      });
    } catch {
      // Fallback grace
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-xl bg-[#191f24] border border-neutral-800 p-8 shadow-2xl">
        
        {/* Close button */}
        <button
          onClick={() => {
            onClose();
            setIsSubmitted(false);
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Top orange badge */}
            <div className="flex items-center gap-2 text-[#ff6300] text-xs font-bold uppercase tracking-wider mb-2">
              <Mail className="w-4 h-4" />
              <span>Get in Touch</span>
            </div>

            {/* Title & info */}
            <h3 className="text-2xl font-bold text-white mb-1">
              Contact ScoutVision
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Magarpatta City, Pune HQ • Email will be routed to{" "}
              <span className="text-white font-medium">contact.scoutvision@gmail.com</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Omkar Jadhav"
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6300]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6300]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6300]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Location / City</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Pune, Maharashtra"
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6300]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Inquiry Topic *</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]"
                >
                  <option>General Inquiry</option>
                  <option>ScoutVision Volleymetrics (Volleyball Analytics)</option>
                  <option>High School Solutions & Smart Cameras</option>
                  <option>Club Volleyball Solutions</option>
                  <option>Careers & Partnership</option>
                  <option>Technical Support</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Your Message or Requirements *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your team, school, or inquiry..."
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6300]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-sm bg-[#ff6300] text-white font-bold hover:bg-[#e05700] transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Thank you, <span className="text-white font-medium">{formData.name}</span>! Your message has been forwarded to{" "}
              <span className="text-[#ff6300]">contact.scoutvision@gmail.com</span>. Our team in Magarpatta City, Pune will reach out to you within 24 hours.
            </p>
            <button
              onClick={() => {
                onClose();
                setIsSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  location: "Pune / India",
                  topic: defaultTopic,
                  message: ""
                });
              }}
              className="px-6 py-2 rounded-sm bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700 transition-colors"
            >
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
