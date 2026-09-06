"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Globe,
  ArrowRight,
  Shield,
  Zap,
  Target,
  Users,
  Award,
  CheckCircle2,
  Heart,
  Video,
  Monitor,
  Sparkles,
  HelpCircle,
  Building2,
  Phone,
  Mail,
  Play
} from "lucide-react";

import Solutions from "@/components/Solutions";
import PlatformFeatures from "@/components/PlatformFeatures";
import AIAnalytics from "@/components/AIAnalytics";
import SportsSupported from "@/components/SportsSupported";
import MembershipPlans from "@/components/MembershipPlans";
import CustomerTestimonials from "@/components/CustomerTestimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const sampleTeams = [
    { name: "Lincoln High Eagles", sport: "Soccer", division: "Varsity" },
    { name: "Pacific State University", sport: "Basketball", division: "NCAA D1" },
    { name: "London FC Academy", sport: "Soccer", division: "Youth U19" },
    { name: "Bay Area Volleyball Club", sport: "Volleyball", division: "Club Elite" },
    { name: "Metro City Football", sport: "American Football", division: "Semi-Pro" }
  ];

  const filteredTeams = searchQuery
    ? sampleTeams.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.sport.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleTeams;

  const menuItems = [
    {
      name: "Solutions",
      badge: "4 Portals",
      items: [
        {
          title: "By Organization Level",
          links: [
            { name: "High School & Athletic Depts", desc: "Operations & roster analysis for school programs.", href: "#solutions" },
            { name: "Club & Academy Programs", desc: "Automated match capture, team sharing & development.", href: "#solutions" },
            { name: "Colleges & Universities (D1/D2)", desc: "Deep analytical telemetry on unified cloud platform.", href: "#solutions" },
            { name: "Professional Franchises", desc: "End-to-end tactical vectors & custom data feeds.", href: "#solutions" }
          ]
        },
        {
          title: "Specialized Role Portals",
          links: [
            { name: "Coach Tactical Portal", desc: "Formation fit, xG metrics & player video clips.", href: "#solutions" },
            { name: "Analyst Hotkey Workspace", desc: "Rapid video timeline tagging with custom keymaps.", href: "#solutions" },
            { name: "QA Verification Queue", desc: "Human-in-the-loop accuracy discrepancy audits.", href: "#solutions" },
            { name: "Team Lead Roster Management", desc: "Subscription licensing, billing & staff assignments.", href: "#solutions" }
          ]
        }
      ]
    },
    {
      name: "Products",
      badge: "AI Powered",
      items: [
        {
          title: "Hardware & Vision Capture",
          links: [
            { name: "ScoutVision Focus", desc: "Autonomous 4K smart cameras for stadiums and gyms.", href: "#features" },
            { name: "ScoutVision Analyst", desc: "Sub-second timeline event tagging & playlist creator.", href: "#features" }
          ]
        },
        {
          title: "Intelligence & Services",
          links: [
            { name: "ScoutVision Assist (QA Service)", desc: "12-hour turnaround certified tagging service.", href: "#features" },
            { name: "ScoutVision AI Scout", desc: "Real-time YOLOv8 optical tracking & radar telemetry.", href: "#ai-analytics" }
          ]
        }
      ]
    },
    {
      name: "Resources & Support",
      badge: "Docs & Help",
      items: [
        {
          title: "Knowledge Base",
          links: [
            { name: "Technical Documentation", desc: "Video codecs, HLS streaming & API specifications.", href: "#faq" },
            { name: "Frequently Answered Questions", desc: "Everything regarding security, licensing & SLA.", href: "#faq" }
          ]
        },
        {
          title: "Engineering Support",
          links: [
            { name: "Consult Our Engineers", desc: "Custom stadium setups, RTSP streaming & integrations.", href: "#contact" },
            { name: "System Telemetry & Status", desc: "99.98% platform uptime & AWS cloud infrastructure.", href: "#contact" }
          ]
        }
      ]
    },
    {
      name: "Company",
      badge: "About Us",
      items: [
        {
          title: "About ScoutVision",
          links: [
            { name: "Our Mission & Leadership", desc: "Democratizing elite AI sports intelligence worldwide.", href: "#company" },
            { name: "40+ Supported Sports", desc: "Soccer, Basketball, Football, Volleyball & more.", href: "#sports" }
          ]
        },
        {
          title: "Join & Partner",
          links: [
            { name: "Pricing & Membership Plans", desc: "Flexible tiers for clubs, schools & enterprises.", href: "#pricing" },
            { name: "Customer Testimonials", desc: "Trusted by NCAA, academy & club performance coaches.", href: "#testimonials" },
            { name: "Contact Headquarters", desc: "Direct sales, support & institutional inquiries.", href: "#contact" }
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#191f24] text-white font-sans antialiased scroll-smooth">
      
      {/* -------------------- STICKY HEADER CONTAINER -------------------- */}
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        
        {/* A. COMPACT NAVIGATION HEADER */}
        <div className="w-full bg-[#191F24] border-b border-neutral-900 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between min-h-[58px]">
            
            {/* Logo segment */}
            <div className="flex items-center gap-8 h-full">
              <Link href="/" className="flex items-center gap-2 group h-full">
                <svg className="w-7 h-7 text-[#ff6300] transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z" stroke="#ff6300" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="4.2" stroke="white" strokeWidth="2.2" />
                  <circle cx="12" cy="12" r="1.5" fill="#ff6300" />
                </svg>
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  Scout<span className="text-[#ff6300]">Vision</span>
                </span>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-6 h-full mt-1">
                {menuItems.map((item) => (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer py-2">
                      {item.name}
                      <ChevronDown className="w-3 h-3 text-slate-400 transition-transform group-hover:rotate-180" />
                    </button>

                    {/* Rich Megamenu Dropdown */}
                    {activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-1 w-[540px] p-5 rounded-lg bg-[#14191d] border border-neutral-800 shadow-2xl grid grid-cols-2 gap-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {item.items.map((col, colIdx) => (
                          <div key={colIdx} className="flex flex-col gap-2.5">
                            <span className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-wider border-b border-neutral-800 pb-1.5">
                              {col.title}
                            </span>
                            <div className="flex flex-col gap-2">
                              {col.links.map((link, lIdx) => (
                                <a
                                  key={lIdx}
                                  href={link.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className="group/link p-2 rounded-md hover:bg-neutral-800/70 transition-all text-left block"
                                >
                                  <div className="text-xs font-semibold text-white group-hover/link:text-orange-500 transition-colors flex items-center justify-between">
                                    {link.name}
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity text-orange-500" />
                                  </div>
                                  <p className="text-[11px] text-slate-400 font-light leading-snug mt-0.5">
                                    {link.desc}
                                  </p>
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Right Header items */}
            <div className="hidden lg:flex items-center gap-4 h-full mt-1">
              
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="px-4 py-2 border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 hover:border-neutral-700 text-[11.5px] text-slate-300 font-medium tracking-wide transition-all flex items-center gap-2 rounded-full cursor-pointer shadow-sm"
              >
                <Search className="w-3.5 h-3.5 text-orange-500" />
                <span>Search Teams & Athletes</span>
              </button>

              {/* Log In Dropdown */}
              <div className="relative group flex items-center h-full">
                <Link
                  href="/auth/login"
                  className="px-5 py-2.5 bg-[#009ce3] hover:bg-[#0082b2] text-white text-[12px] font-bold transition-all flex items-center gap-1.5 rounded-sm shadow-md"
                >
                  Log In
                  <ChevronDown className="w-3 h-3 text-white" />
                </Link>
                <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex flex-col bg-[#14191d] border border-neutral-800 rounded-md shadow-2xl py-2 w-48 text-left text-xs z-50">
                  <div className="px-4 py-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-wider border-b border-neutral-800">
                    Direct Portals
                  </div>
                  <Link href="/auth/login" className="px-4 py-2 hover:bg-neutral-800 text-slate-300 hover:text-white transition-colors">Coach Tactical Portal</Link>
                  <Link href="/auth/login" className="px-4 py-2 hover:bg-neutral-800 text-slate-300 hover:text-white transition-colors">Analyst Workspace</Link>
                  <Link href="/auth/login" className="px-4 py-2 hover:bg-neutral-800 text-slate-300 hover:text-white transition-colors">QA Verification Queue</Link>
                  <div className="h-px bg-neutral-800 my-1" />
                  <Link href="/dashboard" className="px-4 py-2 hover:bg-orange-500/10 text-orange-500 font-semibold transition-colors flex items-center justify-between">
                    Live Demo Workspace →
                  </Link>
                </div>
              </div>

              {/* Get Started Button */}
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-[12px] font-bold rounded-sm transition-all shadow-md"
              >
                Get Started
              </Link>

            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* B. TOP ANNOUNCEMENT BANNER */}
        <div
          className="w-full text-white py-2.5 px-6 md:px-12 relative z-40 flex items-center justify-between border-b border-neutral-900 text-xs shadow-md"
          style={{ background: "linear-gradient(90deg, #a13c06 0%, #0082b2 100%)" }}
        >
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex-1 text-left">
              <span className="font-extrabold text-xs md:text-sm mr-2 tracking-tight">
                ⚡ Enterprise AI Sports Intelligence Live:
              </span>
              <span className="font-light text-slate-100 text-[11.5px] md:text-xs">
                Empowering coaches, analysts, and athletes with real-time video tagging, optical player tracking, and certified QA accuracy.
              </span>
            </div>
            <a
              href="#solutions"
              className="px-3.5 py-1.5 bg-white text-neutral-900 hover:bg-slate-100 text-[11px] font-bold rounded-sm shadow transition-colors flex-shrink-0"
            >
              Explore Solutions →
            </a>
          </div>
        </div>

      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#14191d] border-t border-neutral-800 py-6 px-6 flex flex-col gap-6 text-white text-sm font-semibold fixed top-[102px] left-0 right-0 bottom-0 z-50 overflow-y-auto shadow-2xl">
          {menuItems.map((item) => (
            <div key={item.name} className="flex flex-col gap-2">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{item.name}</span>
              <div className="flex flex-col gap-2 pl-3">
                {item.items.flatMap((c) => c.links).map((sub, idx) => (
                  <a
                    key={idx}
                    href={sub.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xs text-slate-300 hover:text-white py-1"
                  >
                    {sub.name}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <div className="h-px bg-slate-800 my-2" />
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="py-2.5 rounded text-center border border-neutral-700 text-slate-200 text-xs font-semibold"
            >
              Search Teams & Athletes
            </button>
            <Link
              href="/auth/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 rounded text-center bg-[#009ce3] text-white text-xs font-bold"
            >
              Log In
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 rounded text-center bg-orange-500 text-white text-xs font-bold"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}

      {/* Interactive Search Teams & Athletes Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#191f24] border border-neutral-800 rounded-xl w-full max-w-lg p-6 shadow-2xl text-left relative">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-bold text-white">Search Teams, Athletes & Matches</h3>
            </div>

            <input
              type="text"
              placeholder="Search by team, sport, or athlete name (e.g. Lincoln High, Soccer)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-[#12161a] border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500 transition-colors mb-4"
              autoFocus
            />

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team, idx) => (
                  <Link
                    key={idx}
                    href="/dashboard"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-3 rounded-lg bg-[#20272e] hover:bg-[#2a333d] border border-neutral-800 flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">
                        {team.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {team.sport} • {team.division}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-orange-500 font-semibold">
                      View Analytics →
                    </span>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No matching teams found. Try searching for "Soccer" or "High School".
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-slate-400">
              <span>Looking for match video tagger?</span>
              <Link
                href="/dashboard"
                onClick={() => setIsSearchOpen(false)}
                className="text-orange-500 font-bold hover:underline"
              >
                Open Demo Dashboard →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MAIN PAGE CONTENT FLOW -------------------- */}
      <main className="flex-1 mt-[105px]">
        
        {/* 1. HERO SECTION */}
        <section className="relative bg-[#191f24] text-white min-h-[85vh] flex items-center overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 z-0">
            <video
              className="w-full h-full object-cover opacity-35"
              src="https://sc.hudl.com/cms/assets/images/homepage/hudl_homepage_hero_20240112_720p.mp4"
              poster="https://sc.hudl.com/cms/assets/images/homepage/hudl_homepage_hero_20240112_poster.webp"
              loop
              playsInline
              muted
              autoPlay
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-45 mix-blend-overlay"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "6px 6px"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#a13c06]/85 via-[#7a2c04]/70 to-[#0082b2]/85 mix-blend-multiply" />
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[11px] font-mono font-bold tracking-wider text-orange-400 uppercase">
                  Next-Gen Sports Analytics Architecture
                </span>
              </div>

              <h1 className="text-4xl md:text-[64px] font-extrabold tracking-tighter leading-[1.0] text-white font-sans">
                Change the Way<br />
                You See the Game.
              </h1>
              
              <p className="text-sm md:text-base text-slate-100 font-normal leading-relaxed max-w-xl">
                Powered by autonomous video capture, optical AI telemetry, and certified QA tagging—ScoutVision gives athletic directors, coaches, analysts, and players the ultimate tactical advantage.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/auth/register"
                  className="px-7 py-3.5 rounded bg-[#ff6300] hover:bg-[#e05700] text-white font-bold text-xs inline-flex items-center gap-2 transition-all shadow-lg hover:scale-105"
                >
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#solutions"
                  className="px-6 py-3.5 rounded border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold text-xs inline-flex items-center gap-2 transition-all backdrop-blur-sm"
                >
                  Explore Solutions
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
              <a
                href="#solutions"
                className="p-5 rounded-lg bg-[#0b0d0e]/70 hover:bg-[#0b0d0e]/90 border border-neutral-800 border-l-4 border-l-[#ff6300] backdrop-blur-md transition-all text-left flex flex-col gap-1 cursor-pointer group shadow-xl"
              >
                <span className="text-[10px] font-mono tracking-wider font-extrabold text-[#ff6300] uppercase block">
                  FOR COACHES & ANALYSTS
                </span>
                <span className="text-base font-extrabold text-white group-hover:text-orange-400 transition-colors block mt-0.5">
                  Launch Tactical Performance Portals &gt;
                </span>
                <span className="text-xs text-slate-400 font-light">
                  Explore player radar, formation fits, and xG analytics.
                </span>
              </a>

              <a
                href="#features"
                className="p-5 rounded-lg bg-[#0b0d0e]/70 hover:bg-[#0b0d0e]/90 border border-neutral-800 border-l-4 border-l-[#009ce3] backdrop-blur-md transition-all text-left flex flex-col gap-1 cursor-pointer group shadow-xl"
              >
                <span className="text-[10px] font-mono tracking-wider font-extrabold text-[#009ce3] uppercase block">
                  PRODUCTS & HARDWARE
                </span>
                <span className="text-base font-extrabold text-white group-hover:text-blue-400 transition-colors block mt-0.5">
                  ScoutVision Focus 4K Smart Camera &gt;
                </span>
                <span className="text-xs text-slate-400 font-light">
                  Hands-free panoramic auto-tracking for gyms & stadiums.
                </span>
              </a>
            </div>

          </div>
        </section>

        {/* 2. SOLUTIONS SECTION (#solutions) */}
        <section id="solutions" className="scroll-mt-24">
          <Solutions />
        </section>

        {/* 3. PRODUCTS SECTION (#features) */}
        <section id="features" className="scroll-mt-24">
          <PlatformFeatures />
        </section>

        {/* 4. AI ANALYTICS & TELEMETRY (#ai-analytics) */}
        <section id="ai-analytics" className="scroll-mt-24">
          <AIAnalytics />
        </section>

        {/* 5. MULTI-SPORT COVERAGE (#sports) */}
        <section id="sports" className="scroll-mt-24">
          <SportsSupported />
        </section>

        {/* 6. DEDICATED COMPANY SECTION (#company) */}
        <section id="company" className="py-24 bg-[#14191d] border-t border-neutral-800 text-white scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
                ABOUT SCOUTVISION
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-3 mb-6">
                Engineering the Future of Sports Intelligence
              </h2>
              <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed">
                Founded by sports technologists, video engineers, and machine learning researchers, ScoutVision bridges the gap between raw match footage and game-winning tactical decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="p-8 rounded-xl bg-[#191f24] border border-neutral-800 text-left flex flex-col gap-4 shadow-lg hover:border-orange-500/40 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Sub-Second Processing</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Our GPU-accelerated pipelines ingest high-bitrate video streams and extract player coordinates at 60 FPS in real-time, eliminating hours of manual review.
                </p>
              </div>

              <div className="p-8 rounded-xl bg-[#191f24] border border-neutral-800 text-left flex flex-col gap-4 shadow-lg hover:border-blue-500/40 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#009ce3]">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Human QA Guarantee</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  AI generates the foundation; our certified sports analysts verify every ambiguous tag. Coaches receive clean, trustworthy, audit-ready performance datasets.
                </p>
              </div>

              <div className="p-8 rounded-xl bg-[#191f24] border border-neutral-800 text-left flex flex-col gap-4 shadow-lg hover:border-amber-500/40 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Institutional Scalability</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  From high school athletic conferences to top-flight professional academies, our multi-tenant cloud architecture supports unlimited teams with bank-grade security.
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-xl bg-[#1d242a] border border-neutral-800 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-orange-500 font-mono">40+</div>
                <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Sports Disciplines</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-white font-mono">&lt; 12 hrs</div>
                <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">QA Tag Turnaround</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-[#009ce3] font-mono">99.98%</div>
                <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Platform Uptime</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-amber-400 font-mono">10,000+</div>
                <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">Matches Analyzed</div>
              </div>
            </div>

          </div>
        </section>

        {/* 7. PRICING & MEMBERSHIP (#pricing) */}
        <section id="pricing" className="scroll-mt-24">
          <MembershipPlans />
        </section>

        {/* 8. TESTIMONIALS (#testimonials) */}
        <section id="testimonials" className="scroll-mt-24">
          <CustomerTestimonials />
        </section>

        {/* 9. FAQ / RESOURCES (#faq) */}
        <section id="faq" className="scroll-mt-24">
          <FAQ />
        </section>

        {/* 10. CONTACT & CONSULTATION (#contact) */}
        <section id="contact" className="scroll-mt-24">
          <Contact />
        </section>

      </main>

      {/* -------------------- FOOTER -------------------- */}
      <footer className="bg-[#14191d] border-t border-neutral-800 text-[#a0aec0] py-16 text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <svg className="w-6 h-6 text-[#ff6300]" viewBox="0 0 24 24" fill="none">
                <path d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z" stroke="#ff6300" strokeWidth="2.2" />
                <circle cx="12" cy="12" r="4.2" stroke="white" strokeWidth="2.2" />
                <circle cx="12" cy="12" r="1.5" fill="#ff6300" />
              </svg>
              <span className="text-lg font-bold text-white tracking-tight">
                Scout<span className="text-[#ff6300]">Vision</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Enterprise AI sports intelligence, autonomous 4K stadium capture, and precision video performance telemetry.
            </p>
            <div className="text-xs text-slate-400 flex flex-col gap-1">
              <span>support@scoutvision.ai</span>
              <span>+1 (800) 555-SCOUT</span>
            </div>
          </div>

          {/* Solutions */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Solutions</h4>
            <nav className="flex flex-col gap-2 text-xs">
              <a href="#solutions" className="hover:text-orange-500 transition-colors">High School</a>
              <a href="#solutions" className="hover:text-orange-500 transition-colors">Club & Academies</a>
              <a href="#solutions" className="hover:text-orange-500 transition-colors">Collegiate Programs</a>
              <a href="#solutions" className="hover:text-orange-500 transition-colors">Professional Teams</a>
              <a href="#solutions" className="hover:text-orange-500 transition-colors">Coach Portal</a>
            </nav>
          </div>

          {/* Products */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Products</h4>
            <nav className="flex flex-col gap-2 text-xs">
              <a href="#features" className="hover:text-orange-500 transition-colors">ScoutVision Focus (4K)</a>
              <a href="#features" className="hover:text-orange-500 transition-colors">ScoutVision Analyst</a>
              <a href="#features" className="hover:text-orange-500 transition-colors">ScoutVision Assist (QA)</a>
              <a href="#ai-analytics" className="hover:text-orange-500 transition-colors">Optical Tracking</a>
              <a href="#ai-analytics" className="hover:text-orange-500 transition-colors">xG & Spacing Radar</a>
            </nav>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
            <nav className="flex flex-col gap-2 text-xs">
              <a href="#faq" className="hover:text-orange-500 transition-colors">Frequently Answered Questions</a>
              <a href="#faq" className="hover:text-orange-500 transition-colors">Security & Compliance</a>
              <a href="#faq" className="hover:text-orange-500 transition-colors">Video Codecs & HLS</a>
              <a href="#sports" className="hover:text-orange-500 transition-colors">Supported Sports</a>
              <a href="#pricing" className="hover:text-orange-500 transition-colors">Membership Pricing</a>
            </nav>
          </div>

          {/* Company & Portals */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company & Portals</h4>
            <nav className="flex flex-col gap-2 text-xs">
              <a href="#company" className="hover:text-orange-500 transition-colors">About Us</a>
              <a href="#testimonials" className="hover:text-orange-500 transition-colors">Client Testimonials</a>
              <a href="#contact" className="hover:text-orange-500 transition-colors">Contact Sales</a>
              <Link href="/auth/login" className="text-orange-500 font-semibold hover:underline">Log In</Link>
              <Link href="/dashboard" className="text-[#009ce3] font-semibold hover:underline">Demo Dashboard</Link>
            </nav>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="h-px bg-neutral-800 mb-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} ScoutVision Technologies, Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> for elite athletic performance.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
