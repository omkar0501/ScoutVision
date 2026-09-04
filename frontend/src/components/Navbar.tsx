"use client";

import { useState, useEffect } from "react";
import { Menu, X, Activity, ChevronDown, Monitor, Sparkles, Video, Users, HelpCircle, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownHover = (name: string | null) => {
    setActiveDropdown(name);
  };

  const navItems = [
    {
      name: "Solutions",
      dropdown: [
        {
          category: "Browse by Organization",
          links: [
            { name: "Club and Youth Sports", desc: "Elevate clubs with automated match capture & sharing.", href: "#solutions" },
            { name: "High School & Athletic Depts", desc: "Simplify operations across every squad.", href: "#solutions" },
            { name: "Colleges & Universities", desc: "Advanced data solutions on a unified platform.", href: "#solutions" },
            { name: "Professional Teams", desc: "End-to-end telemetry analytics for elite organizations.", href: "#solutions" }
          ]
        },
        {
          category: "Browse by Sport",
          links: [
            { name: "Soccer Analytics", desc: "Heatmaps, passing routes, and xG stats.", href: "#sports" },
            { name: "Basketball Telemetry", desc: "Court tracking & spacing efficiency.", href: "#sports" },
            { name: "American Football", desc: "Play-by-play spreadsheet breaking coverage.", href: "#sports" },
            { name: "Volleyball Spikes", desc: "Set angles and rotation trajectories.", href: "#sports" }
          ]
        }
      ]
    },
    {
      name: "Products",
      dropdown: [
        {
          category: "Capture & Analysis",
          links: [
            { name: "ScoutVision Focus", desc: "Autonomous smart camera for stadiums and gyms.", href: "#features", icon: Monitor },
            { name: "ScoutVision Analyst", desc: "High-speed timeline video tagger workspace.", href: "#features", icon: Video },
            { name: "ScoutVision Assist", desc: "Professional QA tagging service for verified logs.", href: "#features", icon: ShieldCheck }
          ]
        },
        {
          category: "Scouting & Recruiting",
          links: [
            { name: "ScoutVision Recruit", desc: "Shareable highlight clips and player radar statistics.", href: "#ai-analytics", icon: Sparkles }
          ]
        }
      ]
    },
    {
      name: "Resources",
      dropdown: [
        {
          category: "Help & Learning",
          links: [
            { name: "Blog & Insights", desc: "Read recent tactical play breakdowns.", href: "#faq" },
            { name: "Help Center", desc: "Get help setting up cameras & hotkeys.", href: "#faq" }
          ]
        },
        {
          category: "Documentation",
          links: [
            { name: "System Status", desc: "Monitor EKS cluster uptime metrics.", href: "#contact" }
          ]
        }
      ]
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      
      {/* Announcement Banner */}
      <div className="bg-neutral-950 border-b border-neutral-900 py-2.5 px-6 text-center text-xs font-light text-slate-300 relative z-50">
        <span className="inline-flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[9px] font-mono font-bold text-orange-500">
            NEW LAUNCH
          </span>
          Introducing ScoutVision Focus 4K: Autonomous Stadium & Gym Ingestion Cameras.
          <a href="#features" className="text-orange-500 hover:text-orange-400 font-semibold hover:underline inline-flex items-center gap-1">
            Learn More <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-neutral-950/95 backdrop-blur-md border-b border-neutral-900 shadow-lg py-3"
            : "bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-900/45 py-4.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Logo - Orange Shield icon matching Hudl */}
          <a href="#home" className="flex items-center gap-2 group">
            <svg className="w-8 h-8 text-orange-500 group-hover:scale-105 transition-transform" viewBox="0 0 87.2 28.5" fill="currentColor">
              <path d="M14.5 4.6c-1.8-1.5-4-2.6-6.4-3q-.9.45-1.8 1.2h-.1C4.1 2.2 1.8 3.1.7 5c-1.2 2-.7 4.5.8 6v.1c-.1.6-.1 1.2-.1 1.8 0 3.5 1.4 6.6 3.7 9 .1.1.2 0 .2-.1-.5-1.4-.8-2.8-.8-4.4 0-1.8.4-3.4 1-4.9 0 0 0-.1.1-.1 1.4-.2 2.8-1 3.6-2.4.5-1 .6-2 .5-3v-.1c1.4-1 3-1.7 4.7-2.1.2 0 .2-.2.1-.2" />
              <path d="M6.9 16.7c-.5 2.3-.3 4.8.6 7.1.6.4 1.3.7 1.9.9l.1.1c.5 2.1 2.4 3.7 4.7 3.7s4.2-1.6 4.7-3.7c0 0 0-.1.1-.1.5-.2 1.1-.5 1.6-.8 3-1.7 5.1-4.5 5.9-7.6 0-.1-.1-.2-.2-.1-.9 1.1-2.1 2.1-3.4 2.9-1.5.9-3.1 1.4-4.8 1.6H18c-.9-1.1-2.3-1.9-3.8-1.9-1.1 0-2 .3-2.8.9h-.1q-2.4-1.05-4.2-3c0-.1-.1-.1-.2 0" />
              <path d="M21.2 17.2c2.2-.8 4.3-2.2 5.8-4.1 0-.7 0-1.4-.1-2.1v-.1c1.6-1.5 2-4 .8-5.9-1.1-2-3.5-2.8-5.6-2.2H22c-.5-.4-1-.7-1.5-1C17.5.1 14-.3 10.9.5c-.1 0-.1.2 0 .2q2.1.45 4.2 1.5c1.5.9 2.8 2 3.8 3.3v.1c-.5 1.3-.5 2.9.3 4.3.5.9 1.3 1.6 2.2 2 0 0 .1 0 .1.1.2 1.7 0 3.4-.5 5.1.1.1.1.1.2.1" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-white font-sans ml-1">
              Scout<span className="text-orange-500">Vision</span>
            </span>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => handleDropdownHover(item.name)}
                onMouseLeave={() => handleDropdownHover(null)}
              >
                <button className="flex items-center gap-1 text-sm font-semibold text-slate-300 hover:text-orange-500 transition-colors py-2 cursor-pointer">
                  {item.name}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    activeDropdown === item.name ? "rotate-180 text-orange-500" : ""
                  }`} />
                </button>

                {/* Dropdown Menu Overlay */}
                <AnimatePresence>
                  {activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[550px] p-6 rounded-xl border border-neutral-800 bg-neutral-950 shadow-2xl grid grid-cols-2 gap-6"
                    >
                      {item.dropdown.map((sub, sIdx) => (
                        <div key={sIdx} className="flex flex-col gap-3">
                          <h4 className="text-[10px] font-mono font-bold tracking-widest text-orange-500 uppercase">
                            {sub.category}
                          </h4>
                          <div className="flex flex-col gap-2">
                            {sub.links.map((link, lIdx) => (
                              <a
                                key={lIdx}
                                href={link.href}
                                onClick={() => setActiveDropdown(null)}
                                className="p-2 rounded hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all text-left flex flex-col gap-0.5"
                              >
                                <span className="text-xs font-semibold text-white block hover:text-orange-500 transition-colors">
                                  {link.name}
                                </span>
                                <span className="text-[10px] text-slate-500 leading-normal font-light">
                                  {link.desc}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            
            <a href="#pricing" className="text-sm font-semibold text-slate-300 hover:text-orange-500 transition-colors py-2">
              Pricing
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="/auth/login" className="text-sm font-semibold text-slate-300 hover:text-orange-500 transition-colors">
              Login
            </a>
            <a
              href="#pricing"
              className="px-5 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md"
            >
              Start Free Trial
            </a>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded text-slate-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-b border-neutral-900 bg-neutral-950 absolute top-full left-0 right-0 overflow-y-auto max-h-[80vh] shadow-2xl"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navItems.map((item) => (
                <div key={item.name} className="flex flex-col gap-2">
                  <span className="text-xs font-mono font-bold text-orange-500 uppercase tracking-widest">
                    {item.name}
                  </span>
                  <div className="grid grid-cols-1 gap-2 pl-3">
                    {item.dropdown.flatMap(sub => sub.links).map((link, idx) => (
                      <a
                        key={idx}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              <div className="h-px bg-slate-900" />
              <div className="flex flex-col gap-4">
                <a
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center py-3 rounded text-sm font-semibold text-slate-300 hover:bg-neutral-900 border border-neutral-800 transition-colors"
                >
                  Login
                </a>
                <a
                  href="#pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center py-3 rounded text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
                >
                  Start Free Trial
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
