"use client";

import { useState } from "react";
import Link from "next/link";
import ScoutVisionLogo from "@/components/ScoutVisionLogo";
import ContactModal from "@/components/ContactModal";
import { 
  Globe, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Trophy,
  Heart
} from "lucide-react";

export default function ProfessionalSolutionsPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const pillars = [
    {
      icon: Activity,
      title: "3D Biomechanical Tracking",
      desc: "Sub-millisecond optical tracking calculating jump heights, contact points, approach velocity, and arm swing acceleration for elite athlete load management."
    },
    {
      icon: Zap,
      title: "Ball Trajectory & Spin Telemetry",
      desc: "Instant aerodynamic analysis on float serves, topspin spikes, and block deflections. Understand ball speed, trajectory curves, and court coverage."
    },
    {
      icon: Globe,
      title: "International Match Database",
      desc: "Access global league footage and tactical tendencies from top leagues across Europe, Asia, and the Americas on one secure platform."
    },
    {
      icon: Cpu,
      title: "Raw Data & Python API Feeds",
      desc: "Direct integration for sports science departments and data scientists. Export JSON/CSV telemetry, coordinates, and event matrices into your in-house proprietary models."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#191f24] text-white font-sans antialiased">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#191F24]/95 backdrop-blur-md border-b border-neutral-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between w-full min-h-[58px]">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <ScoutVisionLogo iconSize={40} />
            </Link>
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
              <Link href="/solutions/professional" className="text-[#ff6300] py-1 border-b-2 border-[#ff6300]">
                Professional
              </Link>
              <Link href="/solutions/collegiate" className="hover:text-white transition-colors">
                Collegiate
              </Link>
              <Link href="/solutions/high-school" className="hover:text-white transition-colors">
                High School
              </Link>
              <Link href="/solutions/club" className="hover:text-white transition-colors">
                Club
              </Link>
              <Link href="/products/volleymetrics" className="hover:text-white transition-colors">
                Volleymetrics
              </Link>
              <Link href="/products/focus" className="hover:text-white transition-colors">
                Focus Camera
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-[#009ce3] hover:bg-[#0082b2] text-white text-xs font-bold rounded-sm transition-all"
            >
              Log In
            </Link>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-4 py-2 bg-[#ff6300] hover:bg-[#e05700] text-white text-xs font-bold rounded-sm transition-all shadow"
            >
              Contact Pro Sports Team
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 mt-[58px]">
        {/* HERO */}
        <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-[#14181c] via-[#191f24] to-[#14181c] border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6300]/10 border border-[#ff6300]/30 text-[#ff6300] text-xs font-semibold w-fit">
                <Trophy className="w-3.5 h-3.5" />
                <span>Olympic & Elite Federation Intelligence</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
                ScoutVision Professional.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6300] to-amber-400">
                  Sub-Millisecond Telemetry for World Champions.
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
                The pinnacle of sports analytics technology. Tailored for national teams, Olympic federations, and tier-1 professional clubs seeking marginal gains in speed, tactical anticipation, and physical optimization.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="px-7 py-3.5 bg-[#ff6300] hover:bg-[#e05700] text-white font-bold text-xs rounded-sm shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Request Pro Federation Briefing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/products/volleymetrics"
                  className="px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold text-xs rounded-sm transition-all"
                >
                  View Volleymetrics Pro
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-800 text-left">
                <div>
                  <div className="text-2xl font-extrabold text-[#ff6300]">120 FPS</div>
                  <div className="text-xs text-slate-400 mt-1">High-Speed Capture</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">0.01s</div>
                  <div className="text-xs text-slate-400 mt-1">Reaction Latency Precision</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#009ce3]">Custom API</div>
                  <div className="text-xs text-slate-400 mt-1">Raw Ingest & SDK Access</div>
                </div>
              </div>
            </div>

            {/* HERO CARD */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl border border-neutral-800 bg-[#0f1215] p-6 shadow-2xl overflow-hidden group">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#009ce3] mb-3">
                  Elite Telemetry Dashboard
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded bg-neutral-900 border border-neutral-800">
                    <div className="flex justify-between items-center text-white font-bold mb-1">
                      <span>Jump Contact Height</span>
                      <span className="text-emerald-400 font-mono text-[10px]">3.48 METERS</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Opposite Hitter #4: +4cm higher than 4th set average. Zero approach deceleration.
                    </p>
                  </div>

                  <div className="p-3.5 rounded bg-neutral-900 border border-neutral-800">
                    <div className="flex justify-between items-center text-white font-bold mb-1">
                      <span>Spike Velocity & Exit Angle</span>
                      <span className="text-[#ff6300] font-mono text-[10px]">118 KM/H</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Sharp cut angle across Zone 4 into seam between diggers #6 and #1.
                    </p>
                  </div>

                  <div className="p-3.5 rounded bg-neutral-900 border border-neutral-800">
                    <div className="flex justify-between items-center text-white font-bold mb-1">
                      <span>Tactical Heatmap Overlay</span>
                      <span className="text-sky-400 font-mono text-[10px]">REAL-TIME</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Live court spatial coverage transmitted to bench tablet during technical timeouts.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Custom Hardware & Calibration</span>
                  <span className="text-white font-bold">Encrypted Sovereign Cloud</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* PILLARS */}
        <section className="py-20 bg-[#14181c] border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-mono tracking-widest uppercase text-[#ff6300] font-bold">
                Elite Sports Science
              </h2>
              <p className="text-3xl md:text-4xl font-extrabold text-white mt-2">
                Engineered for Olympic & Professional Competition
              </p>
              <p className="text-sm text-slate-400 mt-3">
                ScoutVision Professional delivers the granular telemetry that national teams require to break down international opponents and optimize player longevity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((pillar, idx) => (
                <div key={idx} className="p-6 rounded-lg bg-[#191f24] border border-neutral-800 hover:border-[#ff6300]/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-md bg-[#ff6300]/10 border border-[#ff6300]/20 flex items-center justify-center text-[#ff6300] mb-5">
                      <pillar.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{pillar.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-[#a13c06] via-[#8c3203] to-[#0082b2] text-white text-center">
          <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Bring Elite Analytics to Your National Team
            </h2>
            <p className="text-sm md:text-base text-slate-100 max-w-xl">
              Confidential consultations, custom data engineering, and bespoke camera configurations for national governing bodies and pro franchises.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-8 py-3.5 rounded bg-white text-neutral-900 hover:bg-slate-100 font-bold text-xs shadow-lg transition-all"
              >
                Schedule Executive Briefing →
              </button>
              <Link
                href="/products/volleymetrics"
                className="px-8 py-3.5 rounded border border-white/40 bg-black/20 hover:bg-black/30 text-white font-bold text-xs backdrop-blur-sm transition-all"
              >
                View Volleymetrics Pro
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#14191d] border-t border-neutral-800 py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <ScoutVisionLogo iconSize={36} />
            <p className="text-slate-400 leading-relaxed">
              Enterprise sports video intelligence and international performance analytics.
            </p>
            <div className="text-slate-300">
              📍 Magarpatta City, Hadapsar, Pune, Maharashtra 411028, India
            </div>
            <div>
              ✉️ <a href="mailto:contact.scoutvision@gmail.com" className="text-[#ff6300] hover:underline">contact.scoutvision@gmail.com</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Solutions</h4>
            <ul className="space-y-2">
              <li><Link href="/solutions/professional" className="text-[#ff6300] font-medium">Professional & Olympic</Link></li>
              <li><Link href="/solutions/collegiate" className="hover:text-white transition-colors">Collegiate Programs</Link></li>
              <li><Link href="/solutions/high-school" className="hover:text-white transition-colors">High School</Link></li>
              <li><Link href="/solutions/club" className="hover:text-white transition-colors">Club Volleyball</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Products</h4>
            <ul className="space-y-2">
              <li><Link href="/products/volleymetrics" className="hover:text-white transition-colors">Volleymetrics Pro</Link></li>
              <li><Link href="/products/focus" className="hover:text-white transition-colors">Focus Smart Camera</Link></li>
              <li><Link href="/products/assist" className="hover:text-white transition-colors">ScoutVision Assist</Link></li>
              <li><Link href="/products/analyst" className="hover:text-white transition-colors">ScoutVision Analyst</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Live Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Company & Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers & Jobs</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} ScoutVision Technologies, Inc. All rights reserved.</div>
          <div className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> for elite athletic performance.
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
}
