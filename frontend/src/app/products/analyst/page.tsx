"use client";

import { useState } from "react";
import Link from "next/link";
import ScoutVisionLogo from "@/components/ScoutVisionLogo";
import ContactModal from "@/components/ContactModal";
import { 
  Video, 
  Sparkles, 
  Layers, 
  Sliders, 
  Share2, 
  CheckCircle2, 
  ArrowRight, 
  MonitorPlay,
  Pencil,
  Grid,
  Users,
  Heart
} from "lucide-react";

export default function AnalystPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const tools = [
    {
      icon: Grid,
      title: "Custom Code Windows",
      desc: "Build your own custom tagging panels with hotkey shortcuts. Tag offensive sets, reception ratings, and setter tempos at the speed of live play."
    },
    {
      icon: Layers,
      title: "Multi-Angle Timeline Sync",
      desc: "Synchronize up to 4 camera angles simultaneously. View the endline camera, broadcast high-wide, and bench angle in frame-by-frame lockstep."
    },
    {
      icon: Pencil,
      title: "Pro Telestration & Drawing",
      desc: "Draw tactical lines, spotlight players, illustrate defensive block shadows, and highlight open court seams with intuitive broadcast-level graphics."
    },
    {
      icon: Share2,
      title: "Interactive Video Playlists",
      desc: "Assemble custom film sessions in seconds. Send targeted video clips with voice notes directly to an athlete's mobile phone or tablet."
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
              <Link href="/products/analyst" className="text-[#ff6300] py-1 border-b-2 border-[#ff6300]">
                Analyst Suite
              </Link>
              <Link href="/products/volleymetrics" className="hover:text-white transition-colors">
                Volleymetrics
              </Link>
              <Link href="/products/focus" className="hover:text-white transition-colors">
                Focus Camera
              </Link>
              <Link href="/products/assist" className="hover:text-white transition-colors">
                Assist Breakdown
              </Link>
              <Link href="/solutions/high-school" className="hover:text-white transition-colors">
                High School
              </Link>
              <Link href="/solutions/club" className="hover:text-white transition-colors">
                Club
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
              Get Analyst License
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
                <Video className="w-3.5 h-3.5" />
                <span>Professional Tactical Video Software</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
                ScoutVision Analyst.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6300] to-amber-400">
                  Precision Video Breakdown for Master Tacticians.
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
                The high-performance video analysis workspace built for coaches and performance analysts. Tag matches live or in post-game, sync multiple camera feeds, and telestrate tactical adjustments with broadcast-grade fluidity.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="px-7 py-3.5 bg-[#ff6300] hover:bg-[#e05700] text-white font-bold text-xs rounded-sm shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Request Coach Demo & Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold text-xs rounded-sm transition-all"
                >
                  Launch Web Analyst Demo
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-800 text-left">
                <div>
                  <div className="text-2xl font-extrabold text-white">4 Angles</div>
                  <div className="text-xs text-slate-400 mt-1">Simultaneous Timecode Lock</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#ff6300]">0 Latency</div>
                  <div className="text-xs text-slate-400 mt-1">Live Bench Review Ingest</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#009ce3]">Cloud + App</div>
                  <div className="text-xs text-slate-400 mt-1">Cross-Platform Sync</div>
                </div>
              </div>
            </div>

            {/* HERO WORKSPACE CARD */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl border border-neutral-800 bg-[#0f1215] p-6 shadow-2xl overflow-hidden group">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 text-xs font-mono">
                  <span className="text-slate-300 font-bold flex items-center gap-2">
                    <MonitorPlay className="w-4 h-4 text-[#ff6300]" /> Video Tagging Matrix
                  </span>
                  <span className="text-[#009ce3] font-semibold">00:42:18.06</span>
                </div>

                {/* Simulated Workspace */}
                <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Angle 1: Endline Cam (Wide)</span>
                    <span className="text-emerald-400 font-mono">60 FPS SYNC</span>
                  </div>
                  <div className="h-28 bg-[#14181c] rounded flex items-center justify-center border border-neutral-800 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#ff6300]/10 to-transparent pointer-events-none" />
                    <span className="text-xs font-mono text-slate-500">▶ Live High-Speed Scrub Timeline</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold pt-1">
                    <div className="p-2 rounded bg-neutral-800 border border-neutral-700 text-slate-200">
                      Serve (S)
                    </div>
                    <div className="p-2 rounded bg-[#ff6300]/20 border border-[#ff6300]/40 text-[#ff6300]">
                      Attack (A)
                    </div>
                    <div className="p-2 rounded bg-neutral-800 border border-neutral-700 text-slate-200">
                      Block (B)
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>Customizable Code Hotkeys</span>
                  <span className="text-white font-bold">1-Click iPad Sync</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CORE FEATURES */}
        <section className="py-20 bg-[#14181c] border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-mono tracking-widest uppercase text-[#ff6300] font-bold">
                Elite Coaching Workflow
              </h2>
              <p className="text-3xl md:text-4xl font-extrabold text-white mt-2">
                Built for the Demands of Competitive Sports
              </p>
              <p className="text-sm text-slate-400 mt-3">
                ScoutVision Analyst strips away the clutter and gives coaching staffs deep tactical precision, lightning navigation, and presentation-ready output.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map((tool, idx) => (
                <div key={idx} className="p-6 rounded-lg bg-[#191f24] border border-neutral-800 hover:border-[#ff6300]/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-md bg-[#ff6300]/10 border border-[#ff6300]/20 flex items-center justify-center text-[#ff6300] mb-5">
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{tool.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">{tool.desc}</p>
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
              Upgrade Your Coaching Video Room
            </h2>
            <p className="text-sm md:text-base text-slate-100 max-w-xl">
              Equip your staff with the tools they need to prepare winning game plans. Available with department-wide multi-seat licensing.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-8 py-3.5 rounded bg-white text-neutral-900 hover:bg-slate-100 font-bold text-xs shadow-lg transition-all"
              >
                Request Team Consultation →
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
              Enterprise sports video intelligence and breakdown software for athletic departments, academies, and professional teams.
            </p>
            <div className="text-slate-300">
              📍 Magarpatta City, Hadapsar, Pune, Maharashtra 411028, India
            </div>
            <div>
              ✉️ <a href="mailto:contact.scoutvision@gmail.com" className="text-[#ff6300] hover:underline">contact.scoutvision@gmail.com</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Products</h4>
            <ul className="space-y-2">
              <li><Link href="/products/analyst" className="text-[#ff6300] font-medium">ScoutVision Analyst</Link></li>
              <li><Link href="/products/volleymetrics" className="hover:text-white transition-colors">Volleymetrics Pro</Link></li>
              <li><Link href="/products/focus" className="hover:text-white transition-colors">Focus Smart Camera</Link></li>
              <li><Link href="/products/assist" className="hover:text-white transition-colors">ScoutVision Assist</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Live Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Solutions</h4>
            <ul className="space-y-2">
              <li><Link href="/solutions/high-school" className="hover:text-white transition-colors">High School Programs</Link></li>
              <li><Link href="/solutions/club" className="hover:text-white transition-colors">Club Volleyball</Link></li>
              <li><Link href="/solutions/collegiate" className="hover:text-white transition-colors">Collegiate Programs</Link></li>
              <li><Link href="/solutions/professional" className="hover:text-white transition-colors">Professional & Federations</Link></li>
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
