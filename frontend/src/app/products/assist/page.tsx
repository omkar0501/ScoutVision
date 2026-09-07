"use client";

import { useState } from "react";
import Link from "next/link";
import ScoutVisionLogo from "@/components/ScoutVisionLogo";
import ContactModal from "@/components/ContactModal";
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  FileSpreadsheet, 
  PlayCircle, 
  ShieldAlert, 
  BarChart3,
  Layers,
  Award,
  Sparkles,
  Heart
} from "lucide-react";

export default function AssistPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const breakdownSteps = [
    {
      num: "01",
      title: "Upload Match Video",
      desc: "Upload game footage directly from your ScoutVision Focus camera, mobile phone, or high-definition camcorder. Instant cloud processing starts right away."
    },
    {
      num: "02",
      title: "Expert + AI Tagging",
      desc: "Our verified volleyball statisticians and proprietary computer vision models log every serve, pass rating, set, attack direction, block, and dig."
    },
    {
      num: "03",
      title: "Delivered in 12 Hours",
      desc: "Wake up the next morning with complete box scores, rotation efficiency reports, shot charts, and clickable video clips ready for film review."
    }
  ];

  const statsBreakdown = [
    { metric: "Serve Rating (0-3)", desc: "Quantify serving pressure with official collegiate & international scoring standards." },
    { metric: "Pass Quality Index", desc: "Evaluate serve-receive precision by player, rotation, and server target zones." },
    { metric: "Attack Efficiency by Rotation", desc: "Isolate side-out percentages across all 6 rotations to exploit offensive mismatches." },
    { metric: "Setter Distribution Trends", desc: "Discover what your setter (or opponent setter) calls on in-system vs. out-of-system plays." },
    { metric: "Defense & Transition Spikes", desc: "Track defensive conversion rates from dig to transition kill." }
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
              <Link href="/products/assist" className="text-[#ff6300] py-1 border-b-2 border-[#ff6300]">
                Assist Breakdown
              </Link>
              <Link href="/products/volleymetrics" className="hover:text-white transition-colors">
                Volleymetrics
              </Link>
              <Link href="/products/focus" className="hover:text-white transition-colors">
                Focus Camera
              </Link>
              <Link href="/products/analyst" className="hover:text-white transition-colors">
                Analyst Suite
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
              Try Assist Free
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 mt-[58px]">
        {/* HERO SECTION */}
        <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-[#14181c] via-[#191f24] to-[#14181c] border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6300]/10 border border-[#ff6300]/30 text-[#ff6300] text-xs font-semibold w-fit">
                <Clock className="w-3.5 h-3.5" />
                <span>12-Hour Turnaround Guaranteed</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
                ScoutVision Assist.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6300] to-amber-400">
                  You Coach. We Tag Every Ball.
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
                Reclaim your weekends. Send us your match footage and our trained sports analysts will tag every rally, rotation, and player touch. Within 12 hours, you get pro-level data linked directly to clickable video clips.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="px-7 py-3.5 bg-[#ff6300] hover:bg-[#e05700] text-white font-bold text-xs rounded-sm shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Request Free Assist Trial Match</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold text-xs rounded-sm transition-all"
                >
                  Explore Interactive Box Score
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-800 text-left">
                <div>
                  <div className="text-2xl font-extrabold text-[#ff6300]">12 Hours</div>
                  <div className="text-xs text-slate-400 mt-1">Guaranteed Turnaround</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">8+ Hours</div>
                  <div className="text-xs text-slate-400 mt-1">Time Saved Per Match</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#009ce3]">99.4%</div>
                  <div className="text-xs text-slate-400 mt-1">Stat Verification Accuracy</div>
                </div>
              </div>
            </div>

            {/* HERO VISUAL CARD */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl border border-neutral-800 bg-[#0f1215] p-6 shadow-2xl overflow-hidden group">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#009ce3] mb-3 flex items-center justify-between">
                  <span>Match Report Breakdown</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> QA Verified
                  </span>
                </div>

                {/* Sample Tag Preview */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Set 1 • Rotation 4 (Server #7)</div>
                      <div className="text-[11px] text-slate-400">Jump Float Ace • Deep Corner Zone 5</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-[#ff6300]/20 text-[#ff6300] font-mono font-bold text-[11px]">
                      Score: 18-14
                    </span>
                  </div>

                  <div className="p-3 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Opponent Receive Rating: 1.0</div>
                      <div className="text-[11px] text-slate-400">Out-of-System High Ball to OH #12</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 font-mono font-bold text-[11px]">
                      In-Net Dig
                    </span>
                  </div>

                  <div className="p-3 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">ScoutVision Block Touch #9</div>
                      <div className="text-[11px] text-slate-400">Terminal Stuff Block (Point ScoutVision)</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[11px]">
                      Point Win
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Linked to HD Video Playlists</span>
                  <span className="text-white font-bold">1-Click PDF Export</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3-STEP PROCESS */}
        <section className="py-20 bg-[#14181c] border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-mono tracking-widest uppercase text-[#ff6300] font-bold">
                Simple & Seamless
              </h2>
              <p className="text-3xl md:text-4xl font-extrabold text-white mt-2">
                How ScoutVision Assist Works
              </p>
              <p className="text-sm text-slate-400 mt-3">
                No complex training or tedious manual clicking. Upload your video, go to sleep, and wake up with championship-grade analytics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {breakdownSteps.map((step, idx) => (
                <div key={idx} className="p-8 rounded-lg bg-[#191f24] border border-neutral-800 hover:border-[#ff6300]/50 transition-all relative group">
                  <div className="text-3xl font-extrabold font-mono text-[#ff6300] mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* METRICS DETAIL */}
        <section className="py-20 bg-[#191f24] border-b border-neutral-800">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono tracking-widest uppercase text-[#009ce3] font-bold">
                Comprehensive Game Stats
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-1">
                Every Metric Coaches Need to Win
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statsBreakdown.map((stat, i) => (
                <div key={i} className="p-5 rounded-lg bg-[#14181c] border border-neutral-800 flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-[#ff6300] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{stat.metric}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{stat.desc}</p>
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
              Ready to Stop Tagging Late Into the Night?
            </h2>
            <p className="text-sm md:text-base text-slate-100 max-w-xl">
              Try your first match breakdown completely free. Send us a match and experience the ScoutVision Assist advantage.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-8 py-3.5 rounded bg-white text-neutral-900 hover:bg-slate-100 font-bold text-xs shadow-lg transition-all"
              >
                Send Us a Free Trial Match →
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
              Enterprise sports video intelligence and breakdown services for athletic departments, academies, and professional teams.
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
              <li><Link href="/products/assist" className="text-[#ff6300] font-medium">ScoutVision Assist</Link></li>
              <li><Link href="/products/focus" className="hover:text-white transition-colors">Focus Smart Camera</Link></li>
              <li><Link href="/products/volleymetrics" className="hover:text-white transition-colors">Volleymetrics Pro</Link></li>
              <li><Link href="/products/analyst" className="hover:text-white transition-colors">ScoutVision Analyst</Link></li>
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
