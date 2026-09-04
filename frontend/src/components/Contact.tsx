"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, Database } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    club: "",
    sport: "soccer",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <section id="contact" className="py-24 border-t border-neutral-200 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mt-3 mb-6 tracking-tight">
            Consult Our Analytics Engineers
          </h2>
          <p className="text-slate-600 text-lg font-light leading-relaxed">
            Have questions about system setup, custom integrations, or pricing models? Let us assist you.
          </p>
        </div>

        {/* Form and info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left panel: Info cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-6 rounded border border-neutral-200 bg-slate-50">
              <h3 className="text-lg font-bold text-neutral-900 mb-6">Contact Information</h3>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block tracking-widest uppercase mb-0.5">
                      Direct Email
                    </span>
                    <a href="mailto:solutions@scoutvision.ai" className="text-sm font-semibold text-neutral-900 hover:text-orange-500 transition-colors">
                      solutions@scoutvision.ai
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block tracking-widest uppercase mb-0.5">
                      Global Phone
                    </span>
                    <span className="text-sm font-semibold text-neutral-900">
                      +1 (800) 555-0199
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block tracking-widest uppercase mb-0.5">
                      Headquarters
                    </span>
                    <span className="text-sm font-semibold text-neutral-900 leading-relaxed">
                      100 Sports Science Parkway, Suite 400<br />
                      Palo Alto, CA 94301
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Microservice health card */}
            <div className="p-6 rounded border border-neutral-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-orange-500" />
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">System Service Health</span>
                  <span className="text-[10px] font-mono text-emerald-600">All Microservices Online (99.98%)</span>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          {/* Right panel: Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded border border-neutral-200 bg-white shadow-sm relative overflow-hidden">
              
              {isSubmitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-6">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Message Sent Successfully</h3>
                  <p className="text-slate-500 text-sm font-light max-w-sm leading-relaxed">
                    Our solutions engineers will review your request and get back to your squad within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name input */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="p-3 rounded bg-slate-50 border border-neutral-200 text-neutral-950 text-sm focus:border-orange-500 focus:outline-none transition-colors"
                        placeholder="e.g. Marcus Vance"
                      />
                    </div>

                    {/* Email input */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                        Work Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="p-3 rounded bg-slate-50 border border-neutral-200 text-neutral-950 text-sm focus:border-orange-500 focus:outline-none transition-colors"
                        placeholder="e.g. marcus@club.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Club Name input */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="club" className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                        Club / Organization
                      </label>
                      <input
                        type="text"
                        id="club"
                        required
                        value={formData.club}
                        onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                        className="p-3 rounded bg-slate-50 border border-neutral-200 text-neutral-950 text-sm focus:border-orange-500 focus:outline-none transition-colors"
                        placeholder="e.g. London FC Academy"
                      />
                    </div>

                    {/* Sport selection */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="sport" className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                        Primary Sport
                      </label>
                      <select
                        id="sport"
                        value={formData.sport}
                        onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                        className="p-3 rounded bg-slate-50 border border-neutral-200 text-neutral-950 text-sm focus:border-orange-500 focus:outline-none transition-colors"
                      >
                        <option value="soccer">Soccer</option>
                        <option value="basketball">Basketball</option>
                        <option value="football">Football</option>
                        <option value="volleyball">Volleyball</option>
                      </select>
                    </div>
                  </div>

                  {/* Message input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                      Analytics Needs
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="p-3 rounded bg-slate-50 border border-neutral-200 text-neutral-950 text-sm focus:border-orange-500 focus:outline-none transition-colors resize-none"
                      placeholder="Outline your match schedule and required telemetry options..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="py-3 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Submit Request
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
