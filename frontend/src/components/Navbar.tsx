"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Monitor, Video, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScoutVisionLogo from "@/components/ScoutVisionLogo";

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
            { name: "Club and Youth Sports", desc: "Elevate clubs with automated match capture & sharing.", href: "/solutions/club" },
            { name: "High School & Athletic Depts", desc: "Simplify operations across every squad.", href: "/solutions/high-school" },
            { name: "Colleges & Universities", desc: "Advanced data solutions on a unified platform.", href: "/solutions/collegiate" },
            { name: "Professional Teams", desc: "End-to-end telemetry analytics for elite organizations.", href: "/solutions/professional" }
          ]
        },
        {
          category: "Browse by Sport",
          links: [
            { name: "Volleyball Spikes", desc: "Set angles, hit zones, and rotation trajectories.", href: "/products/volleymetrics" },
            { name: "Basketball Telemetry", desc: "Court tracking & spacing efficiency.", href: "/solutions/high-school" },
            { name: "Soccer Analytics", desc: "Heatmaps, passing routes, and xG stats.", href: "/solutions/club" },
            { name: "Multi-Sport Department", desc: "Unified library for athletic directors.", href: "/solutions/high-school" }
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
            { name: "ScoutVision Focus", desc: "Autonomous smart camera for stadiums and gyms.", href: "/products/focus", icon: Monitor },
            { name: "ScoutVision Analyst", desc: "High-speed timeline video tagger workspace.", href: "/products/analyst", icon: Video },
            { name: "ScoutVision Assist", desc: "Professional QA tagging service for verified logs.", href: "/products/assist", icon: ShieldCheck },
            { name: "Volleymetrics Pro", desc: "Collegiate & Olympic volleyball analytics portal.", href: "/products/volleymetrics", icon: Sparkles }
          ]
        },
        {
          category: "Scouting & Recruiting",
          links: [
            { name: "Live Analytics Dashboard", desc: "Unified match library and player statistics.", href: "/dashboard", icon: Sparkles }
          ]
        }
      ]
    },
    {
      name: "Company & Resources",
      dropdown: [
        {
          category: "Resources",
          links: [
            { name: "About Us", desc: "Our mission, innovation, and leadership.", href: "/about" },
            { name: "Careers & Jobs", desc: "Join our computer vision and sports team in Pune.", href: "/careers" },
            { name: "Contact Support", desc: "Reach out to our customer engineering staff.", href: "/contact" }
          ]
        },
        {
          category: "Legal & Trust",
          links: [
            { name: "Privacy Policy", desc: "Student athlete data protection & FERPA compliance.", href: "/privacy" },
            { name: "Terms of Service", desc: "Master service agreement and 99.9% uptime SLA.", href: "/terms" }
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
          <Link href="/products/focus" className="text-orange-500 hover:text-orange-400 font-semibold hover:underline inline-flex items-center gap-1">
            Learn More <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </span>
      </div>

      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#191F24]/95 backdrop-blur-md border-b border-neutral-800 py-3 shadow-2xl"
            : "bg-[#191F24] border-b border-neutral-800/80 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <ScoutVisionLogo iconSize={36} />
          </Link>

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

                <AnimatePresence>
                  {activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-[560px] bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl p-6 grid grid-cols-2 gap-6 z-50"
                    >
                      {item.dropdown.map((col, idx) => (
                        <div key={idx} className="flex flex-col gap-3">
                          <h4 className="text-[10px] font-mono font-bold tracking-wider text-orange-500 uppercase">
                            {col.category}
                          </h4>
                          <div className="flex flex-col gap-2">
                            {col.links.map((link, lIdx) => (
                              <Link
                                key={lIdx}
                                href={link.href}
                                className="group/item flex items-start gap-2.5 p-2 rounded hover:bg-neutral-800 transition-colors"
                              >
                                <div>
                                  <div className="text-xs font-semibold text-white group-hover/item:text-orange-500 transition-colors">
                                    {link.name}
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-light leading-tight mt-0.5">
                                    {link.desc}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-semibold text-slate-300 hover:text-orange-500 transition-colors">
              Log In
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-sm shadow-md transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-orange-500" />}
          </button>
        </div>
      </div>
    </header>
  );
}
