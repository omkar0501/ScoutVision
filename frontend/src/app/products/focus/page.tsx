"use client";

import { useState } from "react";
import Link from "next/link";
import ScoutVisionLogo from "@/components/ScoutVisionLogo";
import ContactModal from "@/components/ContactModal";
import { 
  Camera, 
  Wifi, 
  Cpu, 
  Eye, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Play, 
  Layers, 
  ChevronRight, 
  Maximize2,
  Calendar,
  CloudUpload,
  Tv,
  Heart
} from "lucide-react";

export default function FocusCameraPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState<"indoor" | "outdoor">("indoor");

  const specs = {
    indoor: [
      { label: "Optical Resolution", val: "4K Ultra-HD with HDR Dynamic Range" },
      { label: "Frame Rate", val: "60 fps High-Speed Sports Capture" },
      { label: "Field of View", val: "180° Panoramic Dual-Lens Optical Array" },
      { label: "AI Tracking", val: "Autonomous Ball & Player Trajectory Tracking" },
      { label: "Connectivity", val: "Gigabit Ethernet (PoE+ 802.3at) & Wi-Fi 6" },
      { label: "Installation", val: "Wall, Beam, or Ceiling Mount (Gymnasiums & Fieldhouses)" },
      { label: "Live Streaming", val: "RTMP / SRT Output to YouTube, Hudl TV, or Custom CDN" },
      { label: "Cloud Sync", val: "Direct zero-touch upload to ScoutVision Cloud" }
    ],
    outdoor: [
      { label: "Weather Resistance", val: "IP67 Weatherproof & Temperature Hardened (-20°C to 50°C)" },
      { label: "Optical Resolution", val: "4K Ultra-HD with Glare Suppression" },
      { label: "Frame Rate", val: "60 fps Multi-Angle Tracking" },
      { label: "Field of View", val: "190° Ultra-Wide Stadium Array" },
      { label: "Connectivity", val: "PoE+ Industrial Grade & 5G Cellular Backup" },
      { label: "Mounting", val: "Press Box, Light Pole, or Field Gantry" },
      { label: "Live Streaming", val: "Adaptive Bitrate 1080p60 Stadium Streaming" },
      { label: "Cloud Sync", val: "Auto-ingest into ScoutVision Analyst & Volleymetrics" }
    ]
  };

  const features = [
    {
      icon: Eye,
      title: "Hands-Free Autonomous Tracking",
      desc: "No camera operator needed. Our proprietary computer-vision neural networks track volleyball spikes, rallies, and fast-break basketball plays seamlessly."
    },
    {
      icon: Calendar,
      title: "Calendar Schedule Automation",
      desc: "Sync your athletic calendar once. The camera automatically turns on 15 minutes before the match, records the entire contest, and powers down when done."
    },
    {
      icon: CloudUpload,
      title: "Zero-Touch Cloud Upload",
      desc: "Video is processed in real time and automatically uploaded to your ScoutVision coaching library before your team leaves the court."
    },
    {
      icon: Tv,
      title: "Live Stream with Scoreboard",
      desc: "Broadcast HD games directly to parents, fans, and college scouts with automatic scoreboard graphics integration and zero latency."
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
              <Link href="/products/focus" className="text-[#ff6300] py-1 border-b-2 border-[#ff6300]">
                Focus Camera
              </Link>
              <Link href="/products/volleymetrics" className="hover:text-white transition-colors">
                Volleymetrics
              </Link>
              <Link href="/products/assist" className="hover:text-white transition-colors">
                Assist Breakdown
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
              Get Focus Camera
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
                <Camera className="w-3.5 h-3.5" />
                <span>Next-Generation AI Sports Hardware</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
                ScoutVision Focus.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6300] to-amber-400">
                  Zero Camera Operators. 100% Precision.
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
                The smart indoor and outdoor camera that automatically captures every match and practice in pristine 4K. Installed once, it tracks the action hands-free, livestreams to your community, and instantly feeds video into your ScoutVision analytics suite.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="px-7 py-3.5 bg-[#ff6300] hover:bg-[#e05700] text-white font-bold text-xs rounded-sm shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Request Focus Quote & Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold text-xs rounded-sm transition-all"
                >
                  View Sample Footage
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-800 text-left">
                <div>
                  <div className="text-2xl font-extrabold text-white">4K UHD</div>
                  <div className="text-xs text-slate-400 mt-1">Dual-Lens Optical Clarity</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#ff6300]">100%</div>
                  <div className="text-xs text-slate-400 mt-1">Autonomous Hands-Free</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#009ce3]">PoE+</div>
                  <div className="text-xs text-slate-400 mt-1">Single Cable Installation</div>
                </div>
              </div>
            </div>

            {/* HERO PRODUCT VISUAL */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl border border-neutral-800 bg-[#0f1215] p-6 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6300]/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Visual Camera Simulation */}
                <div className="relative rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 p-8 flex flex-col items-center justify-center min-h-[340px] text-center">
                  <div className="w-24 h-24 rounded-full bg-[#191F24] border-2 border-[#ff6300] flex items-center justify-center relative shadow-[0_0_30px_rgba(255,99,0,0.3)] mb-6">
                    <div className="w-16 h-16 rounded-full bg-black border border-neutral-700 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-[#ff6300] animate-pulse" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#191F24]" />
                  </div>
                  
                  <span className="text-xs font-mono font-bold tracking-widest text-[#ff6300] uppercase">
                    ScoutVision Focus Point Pro
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Indoor Gymnasium Smart Sensor
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-xs">
                    Hardened aluminium chassis, dual wide-angle lenses, and embedded neural processing unit for sub-second ball detection.
                  </p>
                  
                  <div className="flex items-center gap-4 mt-6 text-[11px] text-slate-300 font-mono">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active Tracking
                    </span>
                    <span className="flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5 text-[#009ce3]" /> Live Ingest Ready
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded bg-neutral-900/60 border border-neutral-800 text-xs text-slate-300 flex items-center justify-between">
                  <span>Mounting Kit & Ethernet Included</span>
                  <span className="font-bold text-[#ff6300]">Gym-Ready In 60 Mins</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-20 bg-[#14181c] border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-mono tracking-widest uppercase text-[#ff6300] font-bold">
                Effortless Sports Capture
              </h2>
              <p className="text-3xl md:text-4xl font-extrabold text-white mt-2">
                Engineered for Gyms, Arenas & Sports Complexes
              </p>
              <p className="text-sm text-slate-400 mt-3">
                Stop scrambling for volunteer camera operators or relying on shaky cell phone footage. ScoutVision Focus delivers television-grade broadcasts without human effort.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feat, i) => (
                <div key={i} className="p-6 rounded-lg bg-[#191f24] border border-neutral-800 hover:border-[#ff6300]/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-md bg-[#ff6300]/10 border border-[#ff6300]/20 flex items-center justify-center text-[#ff6300] mb-5">
                      <feat.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TECH SPECS TOGGLE SECTION */}
        <section className="py-20 bg-[#191f24] border-b border-neutral-800">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-xs font-mono tracking-widest uppercase text-[#009ce3] font-bold">
                  Technical Specifications
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-1">
                  Built to Professional Hardware Standards
                </h2>
              </div>

              <div className="flex items-center bg-neutral-900 border border-neutral-800 p-1 rounded-sm w-fit">
                <button
                  onClick={() => setSelectedSpec("indoor")}
                  className={`px-4 py-2 text-xs font-bold rounded-sm transition-all ${
                    selectedSpec === "indoor"
                      ? "bg-[#ff6300] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Indoor Gymnasiums
                </button>
                <button
                  onClick={() => setSelectedSpec("outdoor")}
                  className={`px-4 py-2 text-xs font-bold rounded-sm transition-all ${
                    selectedSpec === "outdoor"
                      ? "bg-[#ff6300] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Outdoor Stadiums
                </button>
              </div>
            </div>

            <div className="bg-[#14181c] border border-neutral-800 rounded-lg overflow-hidden">
              <div className="divide-y divide-neutral-800">
                {specs[selectedSpec].map((item, idx) => (
                  <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-neutral-800/30 transition-colors">
                    <span className="text-xs font-semibold text-slate-300">{item.label}</span>
                    <span className="text-xs font-mono font-bold text-[#ff6300]">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 bg-gradient-to-r from-[#a13c06] via-[#8c3203] to-[#0082b2] text-white text-center">
          <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Ready to Equip Your Gym With Focus?
            </h2>
            <p className="text-sm md:text-base text-slate-100 max-w-xl">
              Talk to our team in Pune or request an on-site facility evaluation. We provide complete installation, testing, and coaching onboarding.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-8 py-3.5 rounded bg-white text-neutral-900 hover:bg-slate-100 font-bold text-xs shadow-lg transition-all"
              >
                Schedule Facility Consultation →
              </button>
              <Link
                href="/products/volleymetrics"
                className="px-8 py-3.5 rounded border border-white/40 bg-black/20 hover:bg-black/30 text-white font-bold text-xs backdrop-blur-sm transition-all"
              >
                Explore Volleymetrics Integration
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
              Enterprise sports video intelligence and autonomous hardware for athletic departments, academies, and professional teams.
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
              <li><Link href="/products/focus" className="text-[#ff6300] font-medium">ScoutVision Focus Camera</Link></li>
              <li><Link href="/products/volleymetrics" className="hover:text-white transition-colors">Volleymetrics Pro</Link></li>
              <li><Link href="/products/assist" className="hover:text-white transition-colors">ScoutVision Assist</Link></li>
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
