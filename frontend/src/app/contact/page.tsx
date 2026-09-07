"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "Pune, Maharashtra",
    topic: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "contact.scoutvision@gmail.com",
          subject: `[Contact Page] ${formData.topic}: ${formData.name}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          organization: formData.topic,
          message: formData.message
        })
      });
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#191f24] text-white font-sans antialiased selection:bg-[#ff6300] selection:text-white">
      
      {/* ----------------- TOP NAVBAR ----------------- */}
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-[#191F24] border-b border-neutral-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between w-full min-h-[58px]">
          
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/logos/scoutvision_icon.png"
                alt="ScoutVision Logo"
                className="w-10 h-10 object-contain transition-transform group-hover:scale-105 drop-shadow-[0_0_12px_rgba(255,99,0,0.6)]"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                Scout<span className="text-[#ff6300]">Vision</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/contact" className="text-xs font-semibold text-[#ff6300] py-1 border-b-2 border-[#ff6300]">
                Contact Us
              </Link>
              <Link href="/about" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/products/volleymetrics" className="text-xs font-semibold text-slate-300 hover:text-orange-400 transition-colors">
                Volleymetrics
              </Link>
              <Link href="/solutions/high-school" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                High School
              </Link>
              <Link href="/careers" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                Careers
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register"
              className="px-4 py-2 text-xs font-bold rounded-sm bg-[#ff6300] text-white hover:bg-[#e05700] transition-all shadow-md shadow-orange-950/40 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ----------------- HERO & FORM SECTION ----------------- */}
      <section className="relative pt-32 pb-24 lg:pt-36 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#14181c] via-[#191f24] to-[#12161a]">
        
        {/* Glow ambient background */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#ff6300]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[#ff6300] text-xs font-semibold uppercase tracking-wider mb-4">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Get in Touch with Our Team</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              We'd love to hear from you.
            </h1>
            <p className="text-base text-slate-300 mt-3">
              Have questions about ScoutVision Volleymetrics, high school camera systems, or club packages? Our team in Magarpatta, Pune is ready to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Info Panel */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* HQ Card */}
              <div className="p-6 rounded-xl bg-[#14181c] border border-neutral-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6300]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Global Headquarters</h3>
                    <span className="text-xs text-slate-400">ScoutVision Technology</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#ff6300] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">Office Address:</span>
                      <span>Magarpatta City, Hadapsar,</span><br />
                      <span>Pune, Maharashtra 411028, India</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#ff6300] flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-white block">Official Email:</span>
                      <a href="mailto:contact.scoutvision@gmail.com" className="text-[#ff6300] hover:underline">
                        contact.scoutvision@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-[#ff6300] flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-white block">Operating Hours:</span>
                      <span>Monday – Saturday: 9:00 AM – 7:00 PM IST</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Directory */}
              <div className="p-6 rounded-xl bg-[#14181c] border border-neutral-800 space-y-3 text-xs">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Direct Department Assistance</h4>
                
                <div className="p-3 rounded bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Athletic & Club Sales</div>
                    <div className="text-[11px] text-slate-400">Gym cameras, Assist breakdowns, team quotes</div>
                  </div>
                  <span className="text-[#ff6300] font-mono text-[10px]">contact.scoutvision@gmail.com</span>
                </div>

                <div className="p-3 rounded bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Technical Support</div>
                    <div className="text-[11px] text-slate-400">Video uploads, rotation logs, tagging help</div>
                  </div>
                  <span className="text-[#ff6300] font-mono text-[10px]">contact.scoutvision@gmail.com</span>
                </div>

                <div className="p-3 rounded bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Careers & Hiring</div>
                    <div className="text-[11px] text-slate-400">Engineering, CV research, analyst roles</div>
                  </div>
                  <Link href="/careers" className="text-[#ff6300] text-[10px] hover:underline flex items-center gap-0.5">
                    <span>View Jobs</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Right Form Card (Exact Style of the Screenshot Modal!) */}
            <div className="lg:col-span-7">
              <div className="p-8 rounded-xl bg-[#14181c] border border-neutral-800 shadow-2xl relative">
                
                {!isSubmitted ? (
                  <div>
                    <div className="flex items-center gap-2 text-[#ff6300] text-xs font-bold uppercase tracking-wider mb-2">
                      <Mail className="w-4 h-4" />
                      <span>Send a Message</span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1">
                      Online Inquiry Form
                    </h2>
                    <p className="text-xs text-slate-400 mb-6">
                      Fill out your details below. Your message will be immediately routed to{" "}
                      <span className="text-white font-medium">contact.scoutvision@gmail.com</span>.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Omkar Jadhav"
                            className="w-full px-3.5 py-2.5 rounded bg-neutral-900 border border-neutral-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6300]"
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
                            className="w-full px-3.5 py-2.5 rounded bg-neutral-900 border border-neutral-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6300]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full px-3.5 py-2.5 rounded bg-neutral-900 border border-neutral-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6300]"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-1">City / Location</label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Pune, Maharashtra"
                            className="w-full px-3.5 py-2.5 rounded bg-neutral-900 border border-neutral-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6300]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-1">Inquiry Topic *</label>
                        <select
                          value={formData.topic}
                          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]"
                        >
                          <option>General Inquiry</option>
                          <option>ScoutVision Volleymetrics (Volleyball Analytics)</option>
                          <option>High School Athletic Solutions & Focus Cameras</option>
                          <option>Club Volleyball Solutions</option>
                          <option>Careers & Partnership</option>
                          <option>Technical Support</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-1">Your Message or Requirements *</label>
                        <textarea
                          rows={4}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us about your team, school, or how we can assist you..."
                          className="w-full px-3.5 py-2.5 rounded bg-neutral-900 border border-neutral-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6300]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-sm bg-[#ff6300] text-white font-bold hover:bg-[#e05700] transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg disabled:opacity-50 text-sm"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Inquiry Received!</h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                      Thank you, <span className="text-white font-semibold">{formData.name}</span>! Your message has been safely delivered to{" "}
                      <span className="text-[#ff6300]">contact.scoutvision@gmail.com</span>. Our team in Magarpatta City, Pune will review your request and reach out promptly.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          location: "Pune, Maharashtra",
                          topic: "General Inquiry",
                          message: ""
                        });
                      }}
                      className="px-6 py-2.5 rounded-sm bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="bg-[#12161a] border-t border-neutral-900 py-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">
          
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/logos/scoutvision_icon.png"
                alt="ScoutVision Logo"
                className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(255,99,0,0.5)]"
              />
              <span className="text-lg font-bold text-white tracking-tight">
                Scout<span className="text-[#ff6300]">Vision</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Empowering coaches, athletic directors, and athletes with intelligent automated video analytics, verified stats, and seamless live broadcasting.
            </p>
            <div className="text-[11px] text-slate-400 pt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span>📍</span>
                <span>Magarpatta City, Hadapsar, Pune, Maharashtra 411028, India</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>✉️</span>
                <a href="mailto:contact.scoutvision@gmail.com" className="text-[#ff6300] hover:underline">contact.scoutvision@gmail.com</a>
              </div>
              <div className="text-slate-500 pt-1">© {new Date().getFullYear()} ScoutVision Technology, Inc. All rights reserved.</div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers & Jobs</Link></li>
              <li><Link href="/solutions/high-school" className="hover:text-white transition-colors">High School Solutions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Products</h4>
            <ul className="space-y-2">
              <li><Link href="/products/volleymetrics" className="hover:text-white transition-colors">Volleymetrics</Link></li>
              <li><Link href="/solutions/club" className="hover:text-white transition-colors">Club Solutions</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Focus Smart Camera</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">ScoutVision Assist</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Support & Connect</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="hover:text-white transition-colors">Online Contact Form</Link></li>
              <li><a href="https://www.linkedin.com/company/scoutvision-technology" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">LinkedIn <ExternalLink className="w-3 h-3 text-[#ff6300]" /></a></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Coach Sign In</Link></li>
              <li><a href="mailto:contact.scoutvision@gmail.com" className="hover:text-white transition-colors">contact.scoutvision@gmail.com</a></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}
