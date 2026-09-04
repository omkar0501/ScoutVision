"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Users, Video } from "lucide-react";

interface FocusSection {
  id: string;
  label: string;
  title: string;
  desc: string;
  image: string;
  accent: string;
  ctaText: string;
  icon: any;
  borderGlow: string;
}

const focusSections: FocusSection[] = [
  {
    id: "teams",
    label: "SCOUTVISION FOR SQUADS",
    title: "Elite Tools for Coaches & Teams",
    desc: "Tag matches, deconstruct set formations, compile playlists, and share instant video feedback directly to the roster.",
    image: "/soccer_field.jpg",
    accent: "hover:border-orange-500/50 hover:shadow-orange-500/10",
    ctaText: "Explore Team Solutions",
    icon: Video,
    borderGlow: "rgba(255, 99, 0, 0.4)"
  },
  {
    id: "athletes",
    label: "SCOUTVISION FOR ATHLETES",
    title: "Highlight Reels & Player Scouting",
    desc: "Generate professional clip highlight reels, track physical statistics, share metrics, and get discovered by top college scouts.",
    image: "/basketball_court.jpg",
    accent: "hover:border-blue-500/50 hover:shadow-blue-500/10",
    ctaText: "Build Your Profile",
    icon: Users,
    borderGlow: "rgba(0, 156, 227, 0.4)"
  }
];

export default function Hero() {
  const [activeSection, setActiveSection] = useState(0);

  // Auto rotate background if not hovered
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % focusSections.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-neutral-950 pt-36">
      
      {/* Background Slideshow with AnimatePresence */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.35, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${focusSections[activeSection].image})` }}
          />
        </AnimatePresence>
        
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/75 to-neutral-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/50 to-transparent" />
      </div>

      {/* Hero Central Header */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex-1 flex flex-col justify-center items-start py-12">
        <div className="max-w-3xl flex flex-col gap-6 text-left">
          
          <div className="inline-flex">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-mono font-bold tracking-widest text-orange-500">
              THE LEADER IN SPORTS TECH
            </div>
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
            We're here to help<br />
            your team <span className="text-gradient-orange">win.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-xl font-light leading-relaxed">
            ScoutVision's sports technology software, automated cameras, and data insights help athletes, coaches, and recruiters perform at every level.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <a
              href="#pricing"
              className="px-8 py-3.5 rounded bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#features"
              className="px-8 py-3.5 rounded text-sm font-bold text-slate-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 backdrop-blur-md transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              Watch Video
            </a>
          </div>

        </div>
      </div>

      {/* Hudl-style Bottom Split Panels */}
      <div className="relative z-10 bg-gradient-to-t from-neutral-950 to-transparent pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {focusSections.map((sec, idx) => {
            const Icon = sec.icon;
            const isActive = activeSection === idx;
            return (
              <button
                key={sec.id}
                onMouseEnter={() => setActiveSection(idx)}
                className={`p-8 rounded border text-left transition-all duration-500 flex flex-col justify-between min-h-[220px] cursor-pointer ${
                  isActive
                    ? "bg-neutral-900/90 border-orange-500/40 shadow-2xl"
                    : "bg-neutral-900/40 border-neutral-900 hover:bg-neutral-900/60"
                } ${sec.accent}`}
                style={{
                  boxShadow: isActive ? `0 10px 30px -10px ${sec.borderGlow}` : "none"
                }}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase block mb-2">
                    {sec.label}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-orange-500" />
                    {sec.title}
                  </h3>
                  <p className="text-slate-400 text-xs md:text-sm font-light leading-relaxed max-w-lg">
                    {sec.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-500 inline-flex items-center gap-1.5">
                    {sec.ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <div className="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-slate-400">
                    →
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </section>
  );
}
