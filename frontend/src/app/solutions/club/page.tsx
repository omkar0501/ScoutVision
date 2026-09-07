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
  ChevronRight
} from "lucide-react";

export default function VolleyballClubSolutionPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"director" | "coach" | "athlete">("director");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const volleyballFeatures = [
    {
      title: "Rotation Breakdown (R1 to R6)",
      desc: "Analyze side-out percentage, point scoring streaks, and transition efficiency across every single rotation.",
      metric: "Side-Out % by Rotation"
    },
    {
      title: "Serve Receive Rating (0-3 Scale)",
      desc: "Instant passer ratings calculated on standard collegiate 3-point passing scale with visual target zones.",
      metric: "0-3 Passer Efficiency"
    },
    {
      title: "Attack & Kill Directional Heatmaps",
      desc: "Track kill percentage, hitting errors, tip vs hard spike distribution, and seam attack tendencies.",
      metric: "Hitting Efficiency %"
    },
    {
      title: "Setter Distribution & In-System Rate",
      desc: "Map sets to left pin, right pin, middle slide, and pipe attacks under in-system and out-of-system passes.",
      metric: "Setter Decision Radar"
    }
  ];

  const clubRoles = {
    director: {
      title: "For Volleyball Club Directors",
      subtitle: "Standardize Excellence Across Every Court & Age Group",
      points: [
        "Unify all teams (U12 Developmental to U18 National Open) under one club dashboard.",
        "Equip all club coaches with identical high-level video tagging tools and drill libraries.",
        "Attract elite volleyball talent by offering college recruiting portfolios to families.",
        "Multi-court livestreaming for parents who cannot travel to out-of-state qualifiers."
      ],
      metricText: "98% Player Retention",
      metricSub: "Across clubs using ScoutVision Volleyball"
    },
    coach: {
      title: "For Volleyball Club Coaches",
      subtitle: "Cut Video Review Time by 75% with Automated Tagging",
      points: [
        "Jump straight to specific rotation errors without scrubbing through 2 hours of match video.",
        "Share curated 15-second teaching clips directly to player mobile apps before practice.",
        "Visual shot charts show opposing hitters' favorite angles before tournament playoff matches.",
        "Track block touches, coverage hustle plays, and unforced service errors in real time."
      ],
      metricText: "12 Min Post-Match Review",
      metricSub: "Down from 90 minutes of manual scrubbing"
    },
    athlete: {
      title: "For Volleyball Athletes & Parents",
      subtitle: "College Recruiting Highlights Generated Automatically",
      points: [
        "Every kill, block, ace, and dig is automatically tagged to the athlete's personal profile.",
        "Export verified highlight reels in 1080p Full HD formatted for NCAA volleyball recruiters.",
        "Share private video links directly with college coaches and recruiting coordinators.",
        "Parents can watch live HD tournament streams from any gym court in the country."
      ],
      metricText: "3.4x More College Views",
      metricSub: "For athletes with ScoutVision verified profiles"
    }
  };

  const faqs = [
    {
      q: "How does ScoutVision capture volleyball matches in crowded tournament gyms?",
      a: "Our smart camera technology is optimized for end-line and elevated balcony mounting. It tracks the rapid trajectory of the volleyball, automatically filtering out balls from adjacent courts."
    },
    {
      q: "Can coaches use ScoutVision for practice drills and inter-squad scrimmages?",
      a: "Yes! Coaches can record serve receive reps, 6v6 scrimmage rotations, and setter-hitter timing drills with instant on-court iPad replay."
    },
    {
      q: "Does the package include human QA stat verification?",
      a: "Yes. With ScoutVision Assist for Volleyball, upload your match video and receive box scores, rotation stats, and verified kill/dig logs back in under 12 hours."
    },
    {
      q: "Can parents and family members livestream club matches?",
      a: "Absolutely. ScoutVision includes integrated high-definition live streaming with automated scoreboard overlays, accessible by parents anywhere."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#191f24] text-white font-sans antialiased">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-[#191F24] border-b border-neutral-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between w-full min-h-[58px]">
          
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                  src="/logos/scoutvision_icon.png"
                  alt="ScoutVision Logo"
                  className="w-8 h-8 object-contain transition-transform group-hover:scale-105 drop-shadow-[0_0_8px_rgba(255,99,0,0.4)]"
                />
              <span className="text-xl font-bold tracking-tight text-white">
                Scout<span className="text-[#ff6300]">Vision</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/solutions/club" className="text-xs font-semibold text-orange-500 py-1 border-b-2 border-orange-500">
                Club Volleyball
              </Link>
              <Link href="/" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                All Solutions
              </Link>
              <Link href="/products/volleymetrics" className="text-xs font-semibold text-slate-300 hover:text-orange-400 transition-colors">
                Volleymetrics
              </Link>
              <Link href="/dashboard" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                Demo Platform
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-[#009ce3] hover:bg-[#0082b2] text-white text-xs font-bold rounded-sm transition-all shadow"
            >
              Log In
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-sm transition-all shadow"
            >
              Request Club Demo
            </Link>
          </div>

        </div>
      </header>

      <main className="flex-1 mt-[58px]">
        
        {/* HERO SECTION */}
        <section className="relative bg-[#191f24] text-white py-20 md:py-28 overflow-hidden border-b border-neutral-800">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25"
              style={{
                backgroundImage: "url('https://static.hudl.com/craft/sports/volleyball/volleyball_hero.jpg')"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#191f24] via-[#191f24]/90 to-orange-950/40" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase">
                  CLUB VOLLEYBALL SOLUTION
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-white">
                The Complete Video & Analytics Platform for Volleyball Clubs.
              </h1>

              <p className="text-base text-slate-300 font-light leading-relaxed max-w-xl">
                One unified platform for your entire volleyball club. Support all your coaches with automated match capture, R1–R6 rotation breakdowns, passing efficiency ratings, and college recruiting highlight reels.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/auth/register"
                  className="px-6 py-3.5 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg hover:scale-105"
                >
                  Request Volleyball Club Pricing <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="px-6 py-3.5 rounded border border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800 text-white font-bold text-xs inline-flex items-center gap-2 transition-all"
                >
                  <Play className="w-3.5 h-3.5 text-orange-400" />
                  View Sample Volleyball Match
                </Link>
              </div>

            </div>

            {/* Right Card: Volleyball Rotation & Kill Radar Widget */}
            <div className="lg:col-span-5 p-6 rounded-xl bg-[#20272e] border border-neutral-700/80 shadow-2xl flex flex-col gap-5 text-left">
              <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-500" />
                  Volleyball Match Telemetry
                </span>
                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-mono font-bold">
                  LIVE ANALYTICS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-[#191f24] border border-neutral-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Team Hitting %</span>
                  <span className="text-xl font-extrabold text-white">.342</span>
                  <span className="text-emerald-400 text-[10px] font-medium block mt-0.5">Top 5% National Club</span>
                </div>
                <div className="p-3 rounded bg-[#191f24] border border-neutral-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Serve-Receive (0-3)</span>
                  <span className="text-xl font-extrabold text-orange-400">2.41</span>
                  <span className="text-slate-400 text-[10px] font-medium block mt-0.5">Optimal In-System</span>
                </div>
                <div className="p-3 rounded bg-[#191f24] border border-neutral-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Strongest Rotation</span>
                  <span className="text-xl font-extrabold text-white">Rotation 4</span>
                  <span className="text-orange-400 text-[10px] font-medium block mt-0.5">78% Side-Out Rate</span>
                </div>
                <div className="p-3 rounded bg-[#191f24] border border-neutral-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Setter Assist Ratio</span>
                  <span className="text-xl font-extrabold text-white">12.8 / set</span>
                  <span className="text-emerald-400 text-[10px] font-medium block mt-0.5">+1.4 vs Opponent</span>
                </div>
              </div>

              <div className="p-3.5 rounded bg-neutral-900/80 border border-neutral-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span>18-Open Gold Bracket Finals</span>
                <span className="text-orange-500 font-semibold">Verified by ScoutVision QA ✓</span>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 1: ROLE-BASED TABS */}
        <section className="py-20 bg-[#14191d] border-b border-neutral-800 text-left">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
                TAILORED FOR CLUB VOLLEYBALL
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-4">
                Built for Every Member of Your Volleyball Club
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Whether you oversee 30 club teams, coach an elite national squad, or help your athlete get recruited by colleges—ScoutVision has you covered.
              </p>

              {/* Tab Selector */}
              <div className="inline-flex p-1.5 rounded-lg bg-[#191f24] border border-neutral-800 mt-6 gap-2">
                <button
                  onClick={() => setActiveTab("director")}
                  className={`px-5 py-2.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "director"
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Club Directors
                </button>
                <button
                  onClick={() => setActiveTab("coach")}
                  className={`px-5 py-2.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "coach"
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Club Coaches
                </button>
                <button
                  onClick={() => setActiveTab("athlete")}
                  className={`px-5 py-2.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "athlete"
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Athletes & Families
                </button>
              </div>
            </div>

            {/* Tab Content Display */}
            <div className="p-8 md:p-12 rounded-2xl bg-[#191f24] border border-neutral-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {clubRoles[activeTab].title}
                  </h3>
                  <p className="text-orange-400 text-xs font-medium">
                    {clubRoles[activeTab].subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clubRoles[activeTab].points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#20272e] border border-neutral-800">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/30 flex flex-col items-center text-center gap-2">
                <span className="text-3xl md:text-4xl font-extrabold text-white font-mono">
                  {clubRoles[activeTab].metricText}
                </span>
                <span className="text-xs text-slate-400">
                  {clubRoles[activeTab].metricSub}
                </span>
                <Link
                  href="/auth/register"
                  className="mt-4 px-5 py-2.5 rounded bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow"
                >
                  Upgrade Your Club →
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 2: SPECIALIZED VOLLEYBALL METRICS */}
        <section className="py-20 bg-[#191f24] border-b border-neutral-800 text-left">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-left mb-12">
              <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
                VOLLEYBALL-SPECIFIC CAPABILITIES
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1">
                Precision Metrics Designed for High-Level Volleyball
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {volleyballFeatures.map((feat, idx) => (
                <div key={idx} className="p-6 rounded-xl bg-[#20272e] border border-neutral-800 hover:border-orange-500/50 transition-colors flex flex-col justify-between min-h-[220px]">
                  <div>
                    <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider block mb-2">
                      {feat.metric}
                    </span>
                    <h3 className="text-base font-bold text-white mb-2 leading-snug">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="h-0.5 bg-orange-500/30 w-12 mt-4" />
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION 3: WHAT'S INCLUDED IN THE CLUB PACKAGE */}
        <section className="py-20 bg-[#14191d] border-b border-neutral-800 text-left">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
                COMPLETE CLUB PACKAGE
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-1 mb-3">
                Everything Included in Your Club License
              </h2>
              <p className="text-slate-400 text-sm font-light">
                One annual license covers all age brackets, gym locations, coaches, and players.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="p-6 rounded-xl bg-[#191f24] border border-neutral-800 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                  <Monitor className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">ScoutVision Focus for Gyms</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Permanently mount 4K cameras in your facility. Cameras power on automatically when court practice starts, live-streaming directly to coaches' iPads.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#191f24] border border-neutral-800 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#009ce3]/10 border border-[#009ce3]/30 flex items-center justify-center text-[#009ce3]">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Volleyball Video Tagger</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Keyboard hotkeys mapped specifically for volleyball (S for Serve, P for Pass, A for Attack, B for Block). Tag an entire 3-set match in under 20 minutes.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[#191f24] border border-neutral-800 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">ScoutVision Assist for Volleyball</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Send tournament match files on Saturday evening, receive full rotation breakdown reports, box scores, and kill heatmaps before Sunday morning bracket play.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 4: TESTIMONIAL */}
        <section className="py-20 bg-[#191f24] border-b border-neutral-800 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase block mb-4">
              CLUB SUCCESS STORY
            </span>
            <blockquote className="text-xl md:text-2xl font-medium text-slate-200 leading-relaxed italic">
              "Switching our 24 club volleyball teams to ScoutVision was the single best decision we made this season. Our coaches spend 70% less time editing film, our setters have visual heatmap feedback within hours, and 14 of our seniors committed to D1 and D2 programs using ScoutVision highlight reels."
            </blockquote>
            <div className="mt-6 flex flex-col items-center">
              <span className="text-base font-bold text-white">Coach Dave Mitchell</span>
              <span className="text-xs text-orange-400">Technical Director, Coastline Volleyball Club (California)</span>
            </div>
          </div>
        </section>

        {/* SECTION 5: FAQ */}
        <section className="py-20 bg-[#14191d] border-b border-neutral-800 text-left">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-1">
                Volleyball Club Packages FAQ
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((f, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#191f24] border border-neutral-800 cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{f.q}</span>
                    <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                  </div>
                  {openFaq === idx && (
                    <p className="text-xs text-slate-400 font-light mt-3 leading-relaxed pt-2 border-t border-neutral-800">
                      {f.a}
                    </p>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-20 bg-gradient-to-r from-[#a13c06] to-[#0082b2] text-white text-center">
          <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Ready to Transform Your Volleyball Club?
            </h2>
            <p className="text-sm md:text-base text-slate-100 max-w-xl">
              Join hundreds of top volleyball academies, club directors, and coaching staffs leveraging ScoutVision to develop championship rosters.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link
                href="/auth/register"
                className="px-8 py-3.5 rounded bg-white text-neutral-900 hover:bg-slate-100 font-bold text-xs shadow-lg transition-all"
              >
                Schedule Club Consultation →
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-3.5 rounded border border-white/40 bg-black/20 hover:bg-black/30 text-white font-bold text-xs backdrop-blur-sm transition-all"
              >
                Explore Live Demo
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#14191d] border-t border-neutral-800 py-10 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">ScoutVision Volleyball</span>
            <span>• The Intelligent Video Standard for Club Volleyball</span>
          </div>
          <div>
            © {new Date().getFullYear()} ScoutVision Technologies, Inc. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
