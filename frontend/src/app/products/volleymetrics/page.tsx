"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Target,
  Zap,
  Shield,
  Video,
  Monitor,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  Play,
  Heart,
  HelpCircle,
  Activity,
  Layers,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Globe2,
  Clock,
  Filter,
  Check,
  Flame,
  Smartphone,
  Send
} from "lucide-react";

export default function VolleymetricsProductPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeRotation, setActiveRotation] = useState<"R1" | "R2" | "R3" | "R4" | "R5" | "R6">("R1");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    role: "Head Coach",
    level: "Collegiate / University",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const menuItems = [
    {
      name: "Solutions",
      href: "/solutions/club",
      dropdown: [
        { name: "Club (Volleyball)", href: "/solutions/club" },
        { name: "High School", href: "/solutions/high-school" },
        { name: "Collegiate", href: "/solutions/club" },
        { name: "Professional", href: "/solutions/club" }
      ]
    },
    {
      name: "Products",
      href: "/products/volleymetrics",
      dropdown: [
        { name: "ScoutVision Volleymetrics", href: "/products/volleymetrics" },
        { name: "ScoutVision Focus Camera", href: "/products/focus" },
        { name: "ScoutVision Assist Tagging", href: "/products/assist" }
      ]
    },
    {
      name: "Resources & Support",
      dropdown: [
        { name: "Support Center", href: "/contact" },
        { name: "Tutorials & Guides", href: "/products/volleymetrics" },
        { name: "Release Notes", href: "/about#milestones" }
      ]
    },
    {
      name: "Company",
      dropdown: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" }
      ]
    }
  ];

  // Rotation data for interactive court
  const rotationDetails = {
    R1: {
      name: "Rotation 1 (Setter in Pos 1)",
      sideOutPct: "68.4%",
      firstBallKill: "54.2%",
      topOption: "Outside Hitter 1 (Cross-court seam)",
      setterTendency: "48% Left Pin | 28% Middle Slide | 24% Opp Right",
      passingRating: "2.42 / 3.00",
      keyAdvantage: "Strong three-option attack with slide capability and pipe transition."
    },
    R2: {
      name: "Rotation 2 (Setter in Pos 6)",
      sideOutPct: "61.8%",
      firstBallKill: "47.9%",
      topOption: "Middle Quick (Gap 31 Attack)",
      setterTendency: "38% Middle Quick | 36% Outside | 26% Opposite",
      passingRating: "2.18 / 3.00",
      keyAdvantage: "High tempo middle attack forcing opposing blockers to commit early."
    },
    R3: {
      name: "Rotation 3 (Setter in Pos 5)",
      sideOutPct: "59.3%",
      firstBallKill: "45.1%",
      topOption: "Opposite Slide / D-Ball",
      setterTendency: "44% Opposite | 34% Outside | 22% Middle",
      passingRating: "2.05 / 3.00",
      keyAdvantage: "Overloads opponent's weak-side left-front blocker with pin speed."
    },
    R4: {
      name: "Rotation 4 (Setter in Pos 4)",
      sideOutPct: "64.7%",
      firstBallKill: "51.8%",
      topOption: "Outside Hitter 2 (Line Drive)",
      setterTendency: "52% Outside 2 | 26% Middle Slide | 22% Pipe",
      passingRating: "2.31 / 3.00",
      keyAdvantage: "Setter front row option with setter dump threat on tight passes."
    },
    R5: {
      name: "Rotation 5 (Setter in Pos 3)",
      sideOutPct: "66.1%",
      firstBallKill: "53.4%",
      topOption: "Middle Quick / Step-Out Slide",
      setterTendency: "42% Middle | 38% Outside | 20% Opposite",
      passingRating: "2.38 / 3.00",
      keyAdvantage: "Maximum passing stability with libero taking 70% of service seams."
    },
    R6: {
      name: "Rotation 6 (Setter in Pos 2)",
      sideOutPct: "63.5%",
      firstBallKill: "49.7%",
      topOption: "Back-row Pipe / BIC Attack",
      setterTendency: "40% Outside | 35% Pipe / Bic | 25% Middle",
      passingRating: "2.24 / 3.00",
      keyAdvantage: "Fast-tempo 2nd step pipe attack opening single block opportunities."
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "contact.scoutvision@gmail.com",
          subject: `New Volleymetrics Demo Request: ${formData.organization}`,
          text: `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nOrg: ${formData.organization}\nRole: ${formData.role}\nLevel: ${formData.level}\nMessage: ${formData.message}`
        })
      });
    } catch {
      // Fallback grace
    } finally {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }
  };

  const faqs = [
    {
      q: "How does ScoutVision Volleymetrics break down matches within 12 hours?",
      a: "Our team of certified collegiate and international volleyball analysts immediately receives your uploaded match video. Every rally, contact touch, rotation change, pass quality (0-3 scale), and attack trajectory is tagged using proprietary AI-assisted video workflows to ensure verified data is ready by morning."
    },
    {
      q: "Is ScoutVision Volleymetrics compatible with DataVolley (.dvw) and VolleyStation?",
      a: "Yes! We offer full bidirectional compatibility. You can export complete ScoutVision match breakdowns into standard .dvw scout files for use in DataVolley, VolleyStation, or import your existing scouts into ScoutVision's interactive video cloud."
    },
    {
      q: "Can our league or conference mandate automatic video exchange?",
      a: "Absolutely. ScoutVision League Exchange allows conference commissioners and tournament organizers to enforce upload deadlines, mandatory camera angles (such as high-angle endline), and automatic opponent access while securing private tactical notes."
    },
    {
      q: "What camera setup is required to use Volleymetrics?",
      a: "Volleymetrics works with virtually any camera angle, but delivers optimal results when recorded from the endline (baseline) at an elevated height. We also offer automated ScoutVision Focus smart cameras that record, pan, and upload without human operators."
    },
    {
      q: "How do athletes and coaches access match video and clips?",
      a: "Everything is cloud-based. Athletes and coaches can access full matches, filtered playlists (e.g. all out-of-system attacks by #7), and personalized feedback directly from our web platform or mobile apps on iOS and Android."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#14181c] text-white font-sans antialiased selection:bg-[#ff6300] selection:text-white">
      
      {/* -------------------- STICKY NAVIGATION HEADER -------------------- */}
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        <div className="w-full bg-[#191F24] border-b border-neutral-900">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between min-h-[56px]">
            
            {/* Logo */}
            <div className="flex items-center gap-8 h-full">
              <Link href="/" className="flex items-center gap-2 group h-full">
                <img
                  src="/logos/scoutvision_icon.png"
                  alt="ScoutVision Logo"
                  className="w-10 h-10 object-contain transition-transform group-hover:scale-105 drop-shadow-[0_0_12px_rgba(255,99,0,0.6)]"
                />
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  Scout<span className="text-[#ff6300]">Vision</span>
                </span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden lg:flex items-center gap-6 h-full mt-1.5">
                {menuItems.map((item) => (
                  <div
                    key={item.name}
                    className="relative group/menu py-2"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href || "#"}
                      className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
                    >
                      {item.name}
                      <svg className={`w-2.5 h-2.5 text-slate-400 mt-0.5 transition-transform duration-150 ${activeDropdown === item.name ? "rotate-180 text-orange-400" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </Link>

                    {activeDropdown === item.name && (
                      <div className="absolute top-full left-0 pt-1 z-[100]">
                        <div className="w-56 p-2 rounded-lg bg-[#1e252b] border border-neutral-700 shadow-2xl flex flex-col gap-1 backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150">
                          {item.dropdown.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              href={sub.href}
                              onClick={() => setActiveDropdown(null)}
                              className="text-xs font-medium text-slate-200 hover:text-orange-400 hover:bg-[#28323b] transition-all py-2 px-3 rounded flex items-center justify-between"
                            >
                              <span>{sub.name}</span>
                              <ChevronRight className="w-3 h-3 opacity-60" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Header Right CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/auth/login" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                Log In
              </Link>
              <a
                href="#demo-form"
                className="bg-[#ff6300] hover:bg-[#e05700] text-white text-xs font-bold px-4 py-2 rounded transition-all shadow-md hover:shadow-orange-950/40 transform hover:-translate-y-0.5"
              >
                Request a Demo
              </a>
            </div>

            {/* Mobile hamburger */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-300 hover:text-white p-1"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Sub-Navbar for Volleymetrics */}
        <div className="w-full bg-[#1b2228] border-b border-neutral-800 text-xs px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff6300] animate-pulse" />
                VOLLEYMETRICS
              </span>
              <span className="text-neutral-500">|</span>
              <span className="text-neutral-400 hidden sm:inline">Professional Volleyball Analytics Suite</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="text-neutral-300 hover:text-orange-400 transition-colors font-medium">Features</a>
              <a href="#rotations" className="text-neutral-300 hover:text-orange-400 transition-colors font-medium">Rotation Radar</a>
              <a href="#pro-suite" className="text-neutral-300 hover:text-orange-400 transition-colors font-medium">Pro Suite</a>
              <a href="#demo-form" className="text-[#ff6300] hover:text-orange-300 font-bold flex items-center gap-1">
                Get Started <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#1e252b] border-b border-neutral-700 p-5 flex flex-col gap-4 text-sm font-medium">
            <Link href="/solutions/club" className="text-slate-200 hover:text-orange-400">Solutions: Volleyball Clubs</Link>
            <Link href="/products/volleymetrics" className="text-orange-400 font-bold">Products: Volleymetrics</Link>
            <Link href="/auth/login" className="text-slate-200 hover:text-orange-400">Log In</Link>
            <a href="#demo-form" onClick={() => setIsMobileMenuOpen(false)} className="bg-[#ff6300] text-center text-white py-2 rounded font-bold">
              Request a Demo
            </a>
          </div>
        )}
      </header>

      {/* -------------------- HERO SECTION -------------------- */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-b from-[#191f24] via-[#14181c] to-[#101316]">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-600/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[250px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-neutral-300">Products</span>
            <span>/</span>
            <span className="text-orange-400 font-semibold">Volleymetrics</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#ff6300] text-xs font-bold uppercase tracking-wider mb-6">
                <Flame className="w-3.5 h-3.5 fill-current" />
                The Gold Standard in Volleyball Analytics
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 font-sans">
                Coach more efficiently. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300">
                  Win with objective data.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8 max-w-2xl">
                Our certified volleyball analysts track every touch on both sides of the net within 12 hours. Get frame-accurate rotation analytics, setter decision radar, passing efficiency ratings, and automated league exchange so you can focus 100% on training and winning.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
                <a
                  href="#demo-form"
                  className="bg-[#ff6300] hover:bg-[#e05700] text-white font-bold text-sm px-7 py-3.5 rounded-md text-center transition-all shadow-lg shadow-orange-950/50 flex items-center justify-center gap-2"
                >
                  Schedule Volleymetrics Demo
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#rotations"
                  className="bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 text-white font-semibold text-sm px-6 py-3.5 rounded-md text-center transition-all flex items-center justify-center gap-2"
                >
                  <Activity className="w-4 h-4 text-orange-400" />
                  Explore Interactive Radar
                </a>
              </div>

              {/* Quick stats pills */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-800 w-full max-w-xl">
                <div>
                  <div className="text-2xl font-black text-white font-mono">&lt; 12h</div>
                  <div className="text-xs text-neutral-400 mt-0.5">Turnaround per match</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-orange-400 font-mono">100%</div>
                  <div className="text-xs text-neutral-400 mt-0.5">Touches coded</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-mono">15,000+</div>
                  <div className="text-xs text-neutral-400 mt-0.5">Matches in database</div>
                </div>
              </div>

            </div>

            {/* Hero Right Visual Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl bg-gradient-to-b from-[#212a32] to-[#181e24] p-5 border border-neutral-700/80 shadow-2xl shadow-black/80">
                
                {/* Window Top Controls */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-700/60 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs font-mono text-neutral-400">ScoutVision Volleymetrics Pro v4.8</span>
                  </div>
                  <span className="text-[11px] font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                    LIVE ANALYST SYNC
                  </span>
                </div>

                {/* Match Banner */}
                <div className="bg-neutral-900/90 rounded-lg p-3.5 mb-4 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-neutral-400 font-medium">NCAA D1 / Open Qualifier Match</div>
                    <div className="text-sm font-bold text-white mt-0.5">Stanford vs. Nebraska</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-orange-400 font-mono">SET 3 · 23-22</div>
                    <div className="text-[11px] text-neutral-400">Rotation 1 · In-System</div>
                  </div>
                </div>

                {/* Volleyball Court Schematic Mockup */}
                <div className="relative bg-[#1c232b] rounded-lg p-4 border border-neutral-800 overflow-hidden mb-4">
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-yellow-400/80 z-10 flex items-center justify-center">
                    <div className="bg-yellow-400 text-black text-[9px] font-black uppercase px-1 py-0.5 rounded -rotate-90 shadow">
                      NET
                    </div>
                  </div>

                  <div className="absolute top-0 bottom-0 left-1/3 w-px border-l border-dashed border-neutral-600/70" />
                  <div className="absolute top-0 bottom-0 right-1/3 w-px border-r border-dashed border-neutral-600/70" />

                  <div className="grid grid-cols-2 gap-4 h-48 relative text-xs">
                    
                    {/* Near Court */}
                    <div className="relative flex flex-col justify-between p-2">
                      <div className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Our Court (Serving)</div>
                      
                      <div className="grid grid-cols-3 gap-2 my-auto text-center">
                        <div className="bg-orange-500/20 border border-orange-400/40 rounded p-1.5">
                          <div className="font-bold text-white text-[11px]">#4 OH1</div>
                          <div className="text-[9px] text-orange-300">Pos 4</div>
                        </div>
                        <div className="bg-orange-500/20 border border-orange-400/40 rounded p-1.5">
                          <div className="font-bold text-white text-[11px]">#11 MB</div>
                          <div className="text-[9px] text-orange-300">Pos 3</div>
                        </div>
                        <div className="bg-orange-500/20 border border-orange-400/40 rounded p-1.5">
                          <div className="font-bold text-white text-[11px]">#9 OPP</div>
                          <div className="text-[9px] text-orange-300">Pos 2</div>
                        </div>
                      </div>

                      <div className="absolute right-2 top-8 text-right">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-700/50">
                          Cross Kill: 72%
                        </span>
                      </div>
                    </div>

                    {/* Far Court */}
                    <div className="relative flex flex-col justify-between p-2 pl-4">
                      <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider text-right">Opponent Court</div>
                      
                      <div className="grid grid-cols-3 gap-2 my-auto text-center opacity-70">
                        <div className="bg-neutral-800 border border-neutral-700 rounded p-1.5">
                          <div className="font-bold text-neutral-200 text-[11px]">Pos 2</div>
                        </div>
                        <div className="bg-neutral-800 border border-neutral-700 rounded p-1.5">
                          <div className="font-bold text-neutral-200 text-[11px]">Pos 3</div>
                        </div>
                        <div className="bg-neutral-800 border border-neutral-700 rounded p-1.5">
                          <div className="font-bold text-neutral-200 text-[11px]">Pos 4</div>
                        </div>
                      </div>

                      <div className="text-[10px] text-neutral-400 font-mono text-right">
                        Defensive Seam: Zone 5/6
                      </div>
                    </div>

                  </div>
                </div>

                {/* Real-time Metric Breakdown Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-900/80 rounded p-3 border border-neutral-800">
                    <div className="text-[11px] text-neutral-400 uppercase font-semibold">Pass Rating (0-3)</div>
                    <div className="text-lg font-bold text-white font-mono mt-0.5 flex items-center gap-2">
                      2.48
                      <span className="text-xs font-normal text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">In-System (78%)</span>
                    </div>
                  </div>
                  <div className="bg-neutral-900/80 rounded p-3 border border-neutral-800">
                    <div className="text-[11px] text-neutral-400 uppercase font-semibold">First Ball Side-Out</div>
                    <div className="text-lg font-bold text-white font-mono mt-0.5 flex items-center gap-2">
                      64.2%
                      <span className="text-xs font-normal text-orange-400 bg-orange-950 px-1.5 py-0.5 rounded">+11% vs Opp</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------- THREE VALUE PILLARS -------------------- */}
      <section id="features" className="py-20 bg-[#161b20] border-t border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full mb-3">
              Engineered For Volleyball Programs
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything you need to scout, coach, and win.
            </h2>
            <p className="text-neutral-400 mt-4 text-base leading-relaxed">
              Volleymetrics eliminates manual coding so coaching staffs can dedicate their energy to match strategy and athlete skill growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="bg-[#1b2228] border border-neutral-800 rounded-xl p-8 hover:border-orange-500/50 transition-all duration-200 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full pointer-events-none group-hover:bg-orange-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/30 text-[#ff6300] flex items-center justify-center mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider mb-2">Within 12 Hours</div>
              <h3 className="text-xl font-bold text-white mb-3">Certified Touch-by-Touch Coding</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                Our professional volleyball analysts code every single contact across both sides of the net. Serves, 0-3 pass grades, setter decisions, hitter shot locations, and block touches are ready when you wake up.
              </p>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>Frame-accurate video-to-stat synchronization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>0-3 collegiate standard passing efficiency</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  <span>Transition attack & dig quality metrics</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#1b2228] border border-neutral-800 rounded-xl p-8 hover:border-orange-500/50 transition-all duration-200 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-6">
                <Globe2 className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider mb-2">Automated Network</div>
              <h3 className="text-xl font-bold text-white mb-3">League Video Exchange Done Right</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                Record and upload automatically through smart cameras. Conference video exchange rules are enforced without coaches chasing down tape, ensuring everyone receives film on time.
              </p>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Automated exchange deadlines and angle enforcement</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Secure, encrypted opponent access management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>Multi-court tournament bulk distribution</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#1b2228] border border-neutral-800 rounded-xl p-8 hover:border-orange-500/50 transition-all duration-200 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">Worldwide Database</div>
              <h3 className="text-xl font-bold text-white mb-3">Scout Top Opponents & Recruits</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                Expand your preparation and recruiting reach. Access thousands of verified matches across NCAA Division I, II, III, junior colleges, club qualifiers, and international federations.
              </p>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Comprehensive opponent scouting dossiers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Prospective student-athlete verified statistics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Hitter tendency heatmaps across entire seasons</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* -------------------- INTERACTIVE ROTATION RADAR (R1 - R6) -------------------- */}
      <section id="rotations" className="py-20 bg-[#12161a] border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full mb-3">
              <Target className="w-3.5 h-3.5" />
              Tactical Rotation Breakdown
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Interactive Rotation Intelligence
            </h2>
            <p className="text-neutral-400 mt-3 text-base">
              Click on any rotation below to see how ScoutVision Volleymetrics breaks down side-out efficiency, setter distribution, and primary attack tendencies.
            </p>
          </div>

          {/* Rotation Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {(Object.keys(rotationDetails) as Array<keyof typeof rotationDetails>).map((rot) => (
              <button
                key={rot}
                onClick={() => setActiveRotation(rot)}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeRotation === rot
                    ? "bg-[#ff6300] text-white shadow-lg shadow-orange-900/50 scale-105"
                    : "bg-[#1b2228] text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <span>{rot}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${activeRotation === rot ? "bg-white/20 text-white" : "bg-neutral-800 text-neutral-400"}`}>
                  {rotationDetails[rot].sideOutPct}
                </span>
              </button>
            ))}
          </div>

          {/* Rotation Detail Dashboard Box */}
          <div className="bg-[#181f26] border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Key Stats & Radar */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                  <div>
                    <span className="text-xs font-mono text-orange-400 font-bold uppercase tracking-wider">Active Selection</span>
                    <h3 className="text-2xl font-black text-white mt-0.5">{rotationDetails[activeRotation].name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-neutral-400">Side-Out %</div>
                    <div className="text-3xl font-black text-orange-400 font-mono">{rotationDetails[activeRotation].sideOutPct}</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-[#12161a] p-4 rounded-xl border border-neutral-800">
                    <div className="text-xs text-neutral-400 uppercase font-semibold">First-Ball Kill %</div>
                    <div className="text-xl font-bold text-white font-mono mt-1">
                      {rotationDetails[activeRotation].firstBallKill}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-1">On In-System Passes</div>
                  </div>

                  <div className="bg-[#12161a] p-4 rounded-xl border border-neutral-800">
                    <div className="text-xs text-neutral-400 uppercase font-semibold">Pass Rating Average</div>
                    <div className="text-xl font-bold text-white font-mono mt-1">
                      {rotationDetails[activeRotation].passingRating}
                    </div>
                    <div className="text-[11px] text-emerald-400 mt-1">Target zone consistency: High</div>
                  </div>
                </div>

                <div className="bg-[#12161a] p-5 rounded-xl border border-neutral-800 space-y-3">
                  <div>
                    <span className="text-xs text-neutral-400 uppercase font-semibold">Setter Distribution (In-System)</span>
                    <div className="text-sm font-semibold text-white mt-1">
                      {rotationDetails[activeRotation].setterTendency}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-neutral-800/80">
                    <span className="text-xs text-neutral-400 uppercase font-semibold">Primary Attack Option</span>
                    <div className="text-sm font-semibold text-orange-400 mt-1 flex items-center gap-2">
                      <Zap className="w-4 h-4 flex-shrink-0" />
                      {rotationDetails[activeRotation].topOption}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-neutral-800/80">
                    <span className="text-xs text-neutral-400 uppercase font-semibold">Tactical Advantage</span>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                      {rotationDetails[activeRotation].keyAdvantage}
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Column: Court Visualizer Graphic */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div className="w-full max-w-sm bg-[#13171c] rounded-xl p-5 border border-neutral-700/80 shadow-inner">
                  
                  <div className="text-center text-xs font-bold text-neutral-300 mb-3 uppercase tracking-wider flex items-center justify-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-orange-400" />
                    Volleyball Court Positions ({activeRotation})
                  </div>

                  {/* 6 Volleyball Court Zones */}
                  <div className="grid grid-cols-3 gap-2.5 bg-neutral-900/90 p-4 rounded-lg border border-neutral-800 relative">
                    
                    {/* Position 4 */}
                    <div className={`p-3 rounded text-center border transition-all ${activeRotation === "R4" ? "bg-orange-500/20 border-orange-400 shadow-md" : "bg-neutral-800/60 border-neutral-700"}`}>
                      <div className="text-[10px] text-neutral-400">Pos 4</div>
                      <div className="text-xs font-bold text-white mt-0.5">OH1 / OH2</div>
                    </div>

                    {/* Position 3 */}
                    <div className={`p-3 rounded text-center border transition-all ${activeRotation === "R5" ? "bg-orange-500/20 border-orange-400 shadow-md" : "bg-neutral-800/60 border-neutral-700"}`}>
                      <div className="text-[10px] text-neutral-400">Pos 3</div>
                      <div className="text-xs font-bold text-white mt-0.5">MB1 / MB2</div>
                    </div>

                    {/* Position 2 */}
                    <div className={`p-3 rounded text-center border transition-all ${activeRotation === "R6" ? "bg-orange-500/20 border-orange-400 shadow-md" : "bg-neutral-800/60 border-neutral-700"}`}>
                      <div className="text-[10px] text-neutral-400">Pos 2</div>
                      <div className="text-xs font-bold text-white mt-0.5">OPP / S</div>
                    </div>

                    {/* 3m Attack Line */}
                    <div className="col-span-3 h-px bg-neutral-700 my-1 border-dashed border-t border-neutral-600" />

                    {/* Position 5 */}
                    <div className={`p-3 rounded text-center border transition-all ${activeRotation === "R3" ? "bg-orange-500/20 border-orange-400 shadow-md" : "bg-neutral-800/60 border-neutral-700"}`}>
                      <div className="text-[10px] text-neutral-400">Pos 5</div>
                      <div className="text-xs font-bold text-white mt-0.5">Libero / OH</div>
                    </div>

                    {/* Position 6 */}
                    <div className={`p-3 rounded text-center border transition-all ${activeRotation === "R2" ? "bg-orange-500/20 border-orange-400 shadow-md" : "bg-neutral-800/60 border-neutral-700"}`}>
                      <div className="text-[10px] text-neutral-400">Pos 6</div>
                      <div className="text-xs font-bold text-white mt-0.5">Pipe / DS</div>
                    </div>

                    {/* Position 1 */}
                    <div className={`p-3 rounded text-center border transition-all ${activeRotation === "R1" ? "bg-orange-500/20 border-orange-400 shadow-md" : "bg-neutral-800/60 border-neutral-700"}`}>
                      <div className="text-[10px] text-neutral-400">Pos 1</div>
                      <div className="text-xs font-bold text-white mt-0.5">Server / S</div>
                    </div>

                  </div>

                  <div className="mt-3 text-[11px] text-neutral-400 text-center flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    Highlighted position shows setter or tactical anchor
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* -------------------- PRO SUITE DEEP-DIVE -------------------- */}
      <section id="pro-suite" className="py-20 bg-[#161b20] border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-6">
              <div className="inline-block text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full mb-3">
                Pro Suite for Volleyball
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Make unbiased evaluations with frame-accurate video sync.
              </h2>
              <p className="text-neutral-300 mt-4 text-base leading-relaxed">
                Cutting-edge optical technology and third-party compatibility give you the most advanced, reliable, and consistent data possible. Review film objectively, uncover opposing hitters&apos; habits under pressure, and prepare customized game plans.
              </p>

              <div className="space-y-4 mt-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-orange-500/10 text-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Interactive Playlist Filtering</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Instantly filter clips by score margin (e.g. Points 20-25 clutch time), transition phase, or hitter vs double-block.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-orange-500/10 text-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Telestration & Video Annotations</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Draw blocking seams, defensive floor coverage, and approach footwork directly onto the video to share with athletes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded bg-orange-500/10 text-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Full DataVolley & VolleyStation Export</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Export scouts to .dvw files seamlessly, keeping all standard scout codes and analyst comments intact.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Visual: Laptop Mockup */}
            <div className="lg:col-span-6">
              <div className="relative rounded-xl overflow-hidden border border-neutral-700/80 shadow-2xl bg-[#1c232a]">
                <div className="bg-neutral-900 px-4 py-3 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-300">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-orange-400" />
                    ScoutVision Video Player · Match Annotations
                  </span>
                  <span className="font-mono text-neutral-400">01:24:18 / Set 4</span>
                </div>
                
                <div className="relative aspect-video bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800 flex items-center justify-center p-6 text-center">
                  <div className="space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-500/20 text-[#ff6300] border border-orange-500/40 shadow-lg">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                    <div className="text-sm font-bold text-white">Opponent OH #7 · Out-of-System Cross Attack</div>
                    <div className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded border border-emerald-800">
                      <span>Blocker Touch Detected</span>
                      <span>•</span>
                      <span>Seam Angle: Zone 5</span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-6 right-6 bg-black/70 backdrop-blur-md rounded-lg p-3 border border-neutral-700/60 flex items-center justify-between text-xs">
                    <span className="text-neutral-300">Coach Note: &quot;Set up middle block 6 inches further left in R4.&quot;</span>
                    <span className="text-orange-400 font-bold font-mono">Shared with Roster</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* -------------------- COACH TESTIMONIAL SPOTLIGHT -------------------- */}
      <section className="py-20 bg-gradient-to-b from-[#14181c] to-[#101316] border-t border-neutral-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[#1b2228] border border-neutral-800 rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Award className="w-4 h-4" />
              Championship Coach Testimonial
            </div>

            <blockquote className="text-xl sm:text-2xl font-medium text-white leading-relaxed mb-8">
              &ldquo;ScoutVision Volleymetrics completely revolutionized how our coaching staff prepares for conference play. Having frame-accurate touch breakdowns and rotation tendencies ready before our morning film session frees up hours of our week to focus strictly on player skill development.&rdquo;
            </blockquote>

            <div className="flex items-center gap-4 pt-6 border-t border-neutral-800">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                SV
              </div>
              <div>
                <div className="font-bold text-white text-sm">National Championship Volleyball Staff</div>
                <div className="text-xs text-neutral-400 mt-0.5">Collegiate & Club Volleyball Program</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* -------------------- DEMO REQUEST / CONTACT FORM -------------------- */}
      <section id="demo-form" className="py-20 bg-[#171c22] border-t border-neutral-800">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-block text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full mb-3">
              Get In Touch
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Want to see Volleymetrics in action?
            </h2>
            <p className="text-neutral-400 mt-3 text-base">
              Connect with our dedicated volleyball specialists to see a live demonstration tailored to your team, club, or conference.
            </p>
          </div>

          <div className="bg-[#1b2228] border border-neutral-800 rounded-2xl p-8 sm:p-10 shadow-2xl relative">
            
            {formSubmitted ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Demo Request Received!</h3>
                <p className="text-neutral-300 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-orange-400 font-semibold">{formData.name}</span>. Our volleyball analytics team will reach out to <span className="text-white">{formData.email}</span> within 1 business day to schedule your personalized session.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      organization: "",
                      role: "Head Coach",
                      level: "Collegiate / University",
                      message: ""
                    });
                  }}
                  className="mt-4 text-xs text-orange-400 hover:text-orange-300 underline font-semibold cursor-pointer"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Coach Sarah Miller"
                      className="w-full bg-[#12161a] border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="coach@program.edu"
                      className="w-full bg-[#12161a] border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 000-0000"
                      className="w-full bg-[#12161a] border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                      Organization / School / Club *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="Midwest Elite Volleyball Club"
                      className="w-full bg-[#12161a] border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                      Your Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-[#12161a] border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer"
                    >
                      <option value="Head Coach">Head Coach</option>
                      <option value="Assistant Coach">Assistant Coach</option>
                      <option value="Club Director">Club Director</option>
                      <option value="Video Coordinator / Analyst">Video Coordinator / Analyst</option>
                      <option value="Athletic Director">Athletic Director</option>
                      <option value="Athlete / Parent">Athlete / Parent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                      Program Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full bg-[#12161a] border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer"
                    >
                      <option value="Collegiate / University">Collegiate / University (NCAA / NAIA)</option>
                      <option value="Club Volleyball (USAV / JVA / AAU)">Club Volleyball (USAV / JVA / AAU)</option>
                      <option value="High School Varsity">High School Varsity</option>
                      <option value="Professional / National Federation">Professional / National Federation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                    What are your main volleyball goals this season?
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your team, number of courts, current camera setup, or specific analytics needs..."
                    className="w-full bg-[#12161a] border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#ff6300] hover:bg-[#e05700] disabled:opacity-50 text-white font-bold text-sm py-4 rounded-lg transition-all shadow-lg shadow-orange-950/60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Schedule My Volleymetrics Demo</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-neutral-500">
                  We respect your privacy. No spam. A volleyball specialist will reach out within 24 hours.
                </p>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* -------------------- FAQ SECTION -------------------- */}
      <section className="py-20 bg-[#12161a] border-t border-neutral-800">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Got Questions? We&apos;ve Got Answers.
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#1b2228] border border-neutral-800 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 text-white font-bold text-base hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform duration-200 flex-shrink-0 ${
                      openFaq === idx ? "rotate-180 text-orange-400" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/80 pt-4 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* -------------------- FOOTER -------------------- */}
      <footer className="bg-[#0d1013] border-t border-neutral-800/80 pt-16 pb-12 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <img
                  src="/logos/scoutvision_icon.png"
                  alt="ScoutVision Logo"
                  className="w-10 h-10 object-contain transition-transform group-hover:scale-105 drop-shadow-[0_0_12px_rgba(255,99,0,0.6)]"
                />
                <span className="text-lg font-bold text-white tracking-tight">
                  Scout<span className="text-[#ff6300]">Vision</span> Volleymetrics
                </span>
              </div>
              <p className="text-neutral-400 max-w-sm leading-relaxed text-xs">
                The gold standard in automated volleyball tracking, rotation intelligence, and frame-accurate film analysis. Built exclusively for volleyball programs worldwide.
              </p>
              <div className="text-[11px] text-neutral-500 font-mono">
                Volleyball-First Analytics Architecture
              </div>
            </div>

            <div>
              <div className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">Solutions</div>
              <ul className="space-y-2">
                <li><Link href="/solutions/club" className="hover:text-orange-400 transition-colors">Club Volleyball</Link></li>
                <li><Link href="/solutions/high-school" className="hover:text-orange-400 transition-colors">High School Teams</Link></li>
                <li><Link href="/solutions/club" className="hover:text-orange-400 transition-colors">Collegiate Programs</Link></li>
                <li><Link href="/solutions/club" className="hover:text-orange-400 transition-colors">National Teams</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">Products</div>
              <ul className="space-y-2">
                <li><Link href="/products/volleymetrics" className="text-orange-400 font-semibold">Volleymetrics Pro</Link></li>
                <li><Link href="/products/focus" className="hover:text-orange-400 transition-colors">Smart Focus Camera</Link></li>
                <li><Link href="/products/assist" className="hover:text-orange-400 transition-colors">Assist Tagging Service</Link></li>
                <li><Link href="/solutions/collegiate" className="hover:text-orange-400 transition-colors">League Exchange</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">Support & Legal</div>
              <ul className="space-y-2">
                <li><Link href="/contact" className="hover:text-orange-400 transition-colors">Knowledge Base</Link></li>
                <li><Link href="/products/focus" className="hover:text-orange-400 transition-colors">Camera Tutorials</Link></li>
                <li><Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-orange-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
            <div>
              &copy; {new Date().getFullYear()} ScoutVision Inc. All rights reserved. Dedicated to Volleyball Excellence.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-neutral-400">Privacy</Link>
              <Link href="/privacy#security" className="hover:text-neutral-400">Security</Link>
              <Link href="/privacy#cookies" className="hover:text-neutral-400">Cookies</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
