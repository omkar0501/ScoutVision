"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuItems = [
    {
      name: "Solutions",
      href: "/solutions/club",
      dropdown: [
        { name: "Club (Volleyball)", href: "/solutions/club" },
        { name: "High School", href: "/solutions/club" },
        { name: "Collegiate", href: "/solutions/club" },
        { name: "Professional", href: "/solutions/club" }
      ]
    },
    {
      name: "Products",
      dropdown: [
        { name: "ScoutVision Focus", href: "/auth/login" },
        { name: "ScoutVision Analyst", href: "/auth/login" },
        { name: "ScoutVision Assist", href: "/auth/login" }
      ]
    },
    {
      name: "Resources & Support",
      dropdown: [
        { name: "Support Center", href: "/auth/login" },
        { name: "Release Notes", href: "/auth/login" }
      ]
    },
    {
      name: "Company",
      dropdown: [
        { name: "About Us", href: "/auth/login" },
        { name: "Careers", href: "/auth/login" }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#191f24] text-white font-sans antialiased">
      
      {/* -------------------- STICKY HEADER CONTAINER -------------------- */}
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        
        {/* A. COMPACT NAVIGATION HEADER (AT THE VERY TOP) */}
        <div className="w-full bg-[#191F24] border-b border-neutral-900">
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between min-h-[56px]">
            
            {/* Logo segment */}
            <div className="flex items-center gap-8 h-full">
              <Link href="/" className="flex items-center gap-2 group h-full">
                {/* Premium Eye + Iris Targeting Lens Logo for ScoutVision */}
                <svg className="w-7 h-7 text-[#ff6300] transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer Eye Shape */}
                  <path d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z" stroke="#ff6300" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Inner Lens Iris Circle */}
                  <circle cx="12" cy="12" r="4.2" stroke="white" strokeWidth="2.2" />
                  {/* Central Target Pupil Dot */}
                  <circle cx="12" cy="12" r="1.5" fill="#ff6300" />
                </svg>
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  Scout<span className="text-[#ff6300]">Vision</span>
                </span>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-6 h-full mt-1.5">
                {menuItems.map((item) => (
                  <div
                    key={item.name}
                    className="relative group/menu py-2"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href || (item.name === "Solutions" ? "/solutions/club" : "#")}
                      className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-300 hover:text-orange-400 transition-colors cursor-pointer"
                    >
                      {item.name}
                      <svg className={`w-2.5 h-2.5 text-slate-400 mt-0.5 transition-transform duration-150 ${activeDropdown === item.name ? "rotate-180 text-orange-400" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </Link>

                    {activeDropdown === item.name && (
                      <div className="absolute top-full left-0 pt-1 z-[100]">
                        <div className="w-52 p-2 rounded-lg bg-[#1e252b] border border-neutral-700 shadow-2xl flex flex-col gap-1 backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-150">
                          {item.dropdown.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              href={sub.href}
                              onClick={() => setActiveDropdown(null)}
                              className="text-xs font-medium text-slate-200 hover:text-orange-400 hover:bg-[#28323b] transition-all py-2 px-3 rounded flex items-center justify-between"
                            >
                              <span>{sub.name}</span>
                              <span className="text-[10px] text-orange-400 opacity-0 group-hover:opacity-100">→</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Right Header items */}
            <div className="hidden lg:flex items-center gap-4.5 h-full mt-1.5">
              
              {/* Globe icon */}
              <button className="text-slate-300 hover:text-white cursor-pointer px-1 flex items-center justify-center h-full" aria-label="Language Select">
                <svg className="w-[18px] h-[18px] fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </button>

              {/* Search outline bar */}
              <Link
                href="/auth/login"
                className="px-4 py-2 border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-950 text-[11px] text-slate-300 font-semibold tracking-wide transition-colors flex items-center justify-center"
                style={{ borderRadius: "500px" }}
              >
                Search Teams & Athletes
              </Link>

              {/* Blue Log In Dropdown */}
              <div className="relative group flex items-center h-full">
                <Link
                  href="/auth/login"
                  className="px-5 py-2.5 bg-[#009ce3] hover:bg-[#0082b2] text-white text-[11.5px] font-bold transition-all flex items-center gap-1.5"
                  style={{ borderRadius: "2px" }}
                >
                  Log In
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </Link>
                <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex flex-col bg-[#1e252b] border border-neutral-700 rounded-lg shadow-2xl py-2 w-48 text-left text-xs text-slate-200 z-[100] backdrop-blur-md">
                  <Link href="/auth/login" className="px-4 py-2 hover:bg-neutral-800 hover:text-white">Coach Portal</Link>
                  <Link href="/auth/login" className="px-4 py-2 hover:bg-neutral-800 hover:text-white">Analyst Portal</Link>
                  <Link href="/auth/login" className="px-4 py-2 hover:bg-neutral-800 hover:text-white">QA Portal</Link>
                </div>
              </div>

            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>

          </div>
        </div>

        {/* B. TOP BANNER (PLACED UNDER THE BLACK LINE NAV HEADER) */}
        <div
          className="w-full text-white py-3 px-6 md:px-12 relative z-20 flex items-center justify-between border-b border-neutral-900"
          style={{ background: "linear-gradient(90deg, #a13c06 0%, #0082b2 100%)" }}
        >
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 text-left">
              <span className="font-extrabold text-sm md:text-[15px] block md:inline mr-2 tracking-tight">
                A faster way to fund your season.
              </span>
              <span className="text-xs md:text-[13px] font-normal text-slate-100">
                Introducing ScoutVision Fundraising from Team Up. Help fund your season in as little as an hour with a format that's fun for athletes and easy for coaches.
              </span>
            </div>
            <Link
              href="/auth/login"
              className="px-5 py-2.5 bg-white text-black hover:bg-slate-100 text-xs font-bold rounded-sm shadow transition-colors flex-shrink-0"
            >
              Read more
            </Link>
          </div>
        </div>

      </header>

      {/* Mobile Nav menu drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#191f24] border-t border-neutral-800 py-6 px-6 flex flex-col gap-6 text-white text-sm font-semibold absolute top-[56px] left-0 right-0 z-50 max-h-[85vh] overflow-y-auto shadow-2xl">
          {menuItems.map((item) => (
            <div key={item.name} className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{item.name}</span>
              <div className="flex flex-col gap-2 pl-3">
                {item.dropdown.map((sub, idx) => (
                  <Link key={idx} href={sub.href} onClick={() => setIsMobileMenuOpen(false)} className="text-slate-300 hover:text-white">
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="h-px bg-slate-800" />
          <div className="flex flex-col gap-3">
            <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 rounded text-center border border-[#ff6300] text-slate-200">
              Search Teams & Athletes
            </Link>
            <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 rounded text-center bg-[#009ce3] text-white">
              Log In
            </Link>
          </div>
        </div>
      )}

      {/* -------------------- 3. HERO CONTAINER SECTION -------------------- */}
      <main className="flex-1 mt-[112px]">
        
        <section className="relative bg-[#191f24] text-white min-h-[88vh] flex items-center overflow-hidden py-16 md:py-24">
          
          {/* Loop Video layer */}
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
            {/* Dotted Grid Overlay to match the Halftone texture on Screenshot 1 */}
            <div
              className="absolute inset-0 pointer-events-none opacity-45 mix-blend-overlay"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "6px 6px"
              }}
            />
            {/* Color Overlay: Red/Orange on the left transitioning to blue on the right */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#a13c06]/85 via-[#7a2c04]/70 to-[#0082b2]/85 mix-blend-multiply" />
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Block: Change the Way You See the Game */}
            <div className="lg:col-span-7 flex flex-col gap-5 text-left">
              <h1 className="text-4xl md:text-[66px] font-extrabold tracking-tighter leading-[0.98] text-white font-sans">
                Change the Way<br />
                You See the Game
              </h1>
              
              <p className="text-sm md:text-base text-slate-100 font-normal leading-relaxed max-w-xl">
                Powered by video, data and AI—we help millions of athletes, coaches and fans get more out of every moment.
              </p>
              
              <p className="text-xs md:text-sm text-slate-200">
                Want ScoutVision for your program?{" "}
                <Link href="/auth/register" className="underline font-bold text-white hover:text-orange-500">
                  Talk to our team
                </Link>
                .
              </p>
            </div>

            {/* Right Block: Double CTA Card panels */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              {/* Card 1: Coaches and Teams (Orange side border) */}
              <Link
                href="/auth/login"
                className="p-5 rounded bg-[#0b0d0e]/60 hover:bg-[#0b0d0e]/85 border border-neutral-800 border-l-4 border-l-[#ff6300] backdrop-blur-sm transition-all text-left flex flex-col gap-1 cursor-pointer"
              >
                <span className="text-[10px] font-mono tracking-wider font-extrabold text-[#ff6300] uppercase block">
                  FOR COACHES AND TEAMS
                </span>
                <span className="text-base font-extrabold text-white block mt-0.5">
                  Search Team Performance Solutions &gt;
                </span>
              </Link>

              {/* Card 2: Fans and Families (Blue side border) */}
              <Link
                href="/auth/login"
                className="p-5 rounded bg-[#0b0d0e]/60 hover:bg-[#0b0d0e]/85 border border-neutral-800 border-l-4 border-l-[#009ce3] backdrop-blur-sm transition-all text-left flex flex-col gap-1 cursor-pointer"
              >
                <span className="text-[10px] font-mono tracking-wider font-extrabold text-[#009ce3] uppercase block">
                  FOR FANS AND FAMILIES
                </span>
                <span className="text-base font-extrabold text-white block mt-0.5">
                  Watch Your Favorite Teams & Athletes &gt;
                </span>
              </Link>

            </div>

          </div>
        </section>

        {/* 4. EXPLORE CARDS GRID SECTION */}
        <section className="bg-[#191f24] text-white py-16 border-t border-[#2d3748]/20">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Card 1 - Capture Every Moment */}
            <div className="flex flex-col justify-between bg-[#232a31] rounded-sm overflow-hidden border border-[#2d3748]/50 min-h-[360px] p-6">
              <div>
                <div
                  className="h-36 bg-cover bg-center rounded-sm mb-6"
                  style={{ backgroundImage: `url('/volleyball_stadium.jpg')` }}
                />
                <h2 className="text-xl font-bold text-white mb-2 leading-tight">
                  Capture Every Moment
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Our hands-free cameras use AI for livestreams, performance analysis and more.
                </p>
              </div>
              <Link href="/auth/login" className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-1 mt-6">
                Explore Focus Cameras →
              </Link>
            </div>

            {/* Card 2 - See Your Sport Differently */}
            <div className="flex flex-col justify-between bg-[#232a31] rounded-sm overflow-hidden border border-[#2d3748]/50 min-h-[360px] p-6">
              <div>
                <div
                  className="h-36 bg-cover bg-center rounded-sm mb-6"
                  style={{ backgroundImage: `url('/volleyball_spike.jpg')` }}
                />
                <h2 className="text-xl font-bold text-white mb-2 leading-tight">
                  See Your Sport Differently
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  With AI-powered video and data, ScoutVision delivers deeper insights for athletes and coaches at every level.
                </p>
              </div>
              <Link href="/auth/login" className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-1 mt-6">
                Find Your Sport →
              </Link>
            </div>

            {/* Card 3 - Watch Live Games */}
            <div className="flex flex-col justify-between bg-[#232a31] rounded-sm overflow-hidden border border-[#2d3748]/50 min-h-[360px] p-6">
              <div>
                <div
                  className="h-36 bg-cover bg-center rounded-sm mb-6"
                  style={{ backgroundImage: `url('/volleyball_court.jpg')` }}
                />
                <h2 className="text-xl font-bold text-white mb-2 leading-tight">
                  Watch Live Games and Highlights
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Your favorite athletes and teams are all on ScoutVision — from livestreams to can't-miss moments.
                </p>
              </div>
              <Link href="/auth/login" className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-1 mt-6">
                Launch Fan Experience →
              </Link>
            </div>

            {/* Card 4 - Explore the Platform */}
            <div className="flex flex-col justify-between bg-[#232a31] rounded-sm overflow-hidden border border-[#2d3748]/50 min-h-[360px] p-6">
              <div>
                <div
                  className="h-36 bg-cover bg-center rounded-sm mb-6"
                  style={{ backgroundImage: `url('/volleyball_stadium.jpg')` }}
                />
                <h2 className="text-xl font-bold text-white mb-2 leading-tight">
                  Explore the Platform
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Everything an athlete or a team needs to reach their potential is here. And we bring it all together.
                </p>
              </div>
              <Link href="/auth/login" className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-1 mt-6">
                View All Products →
              </Link>
            </div>

          </div>
        </section>

        {/* 5. PERFORMANCE DEVICES SECTION */}
        <section className="bg-slate-50 text-[#191f24] py-20 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="flex flex-col gap-6 text-left">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
                The Trusted Sports Technology Platform for Performance
              </h2>
              <p className="text-slate-600 text-base leading-relaxed font-light max-w-xl">
                Video, AI insights and deep analytical experience come together to deliver insights anyone can use. This is how ScoutVision runs organizations at every level of sport.
              </p>
              <div className="mt-2">
                <Link
                  href="/auth/login"
                  className="px-6 py-3 rounded bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs inline-flex items-center gap-1 transition-colors"
                >
                  Explore Performance Solutions →
                </Link>
              </div>
            </div>

            {/* Right: Custom ScoutVision High-Performance Telemetry UI Mockup */}
            <div className="relative rounded-xl border border-neutral-800 overflow-hidden shadow-2xl bg-[#14191d] p-6 text-left">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff6300] animate-pulse" />
                  <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">ScoutVision Focus 4K Ingestion</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30">60 FPS UHD</span>
              </div>
              
              <div className="relative rounded-lg overflow-hidden h-52 bg-cover bg-center mb-4 border border-neutral-800" style={{ backgroundImage: "url('/volleyball_court.jpg')" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-white font-bold">CAM-01: COURT HIGH REAR</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/80 text-[10px] font-mono text-white font-bold">AUTO-TRACK ACTIVE</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="font-bold drop-shadow">Eagles Volleyball vs Metro Club</span>
                  <span className="font-mono text-orange-400 drop-shadow">R4 • 21-19 (Set 3)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded bg-[#191f24] border border-neutral-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Ball Speed</span>
                  <span className="text-sm font-extrabold text-white">88 km/h</span>
                </div>
                <div className="p-2.5 rounded bg-[#191f24] border border-neutral-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Spike Height</span>
                  <span className="text-sm font-extrabold text-orange-400">2.94 m</span>
                </div>
                <div className="p-2.5 rounded bg-[#191f24] border border-neutral-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Passing (0-3)</span>
                  <span className="text-sm font-extrabold text-emerald-400">2.68 Rating</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 6. FAN ENGAGEMENT SECTION */}
        <section className="bg-white text-[#191f24] py-20 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Custom ScoutVision Athletic Portal UI Mockup (100% Rebranded) */}
            <div className="order-2 lg:order-1 relative rounded-xl border border-neutral-800 overflow-hidden shadow-2xl bg-[#14191d] p-6 text-left">
              {/* Laptop device top bar */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="text-xs font-bold text-white font-mono ml-2">SCOUTVISION ATHLETIC PORTAL</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-slate-300">scoutvision.cybix.live</span>
              </div>

              {/* Header inside device */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-[#a13c06]/90 to-[#0082b2]/90 text-white mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-orange-200 block">CLUB & HIGH SCHOOL CENTRAL</span>
                  <h3 className="text-lg font-extrabold">Eagles Volleyball Academy</h3>
                </div>
                <span className="px-3 py-1 rounded bg-white/20 backdrop-blur-md text-xs font-bold">18-National Open</span>
              </div>

              {/* Athlete spotlight card inside mockup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="p-3.5 rounded-lg bg-[#191f24] border border-neutral-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-sm">
                    MS
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Megan Smith #7</div>
                    <div className="text-[10px] text-slate-400">Outside Hitter • Class of 2026</div>
                    <div className="text-[10px] font-mono text-emerald-400 mt-0.5">24 Kills • .385 Hitting %</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#191f24] border border-neutral-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#009ce3] flex items-center justify-center font-bold text-white text-sm">
                    AR
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Alex Rivera #12</div>
                    <div className="text-[10px] text-slate-400">Setter • 38 Assists / Match</div>
                    <div className="text-[10px] font-mono text-orange-400 mt-0.5">92% In-System Pass Conversion</div>
                  </div>
                </div>
              </div>

              {/* Match Highlights preview bar */}
              <div className="p-3 rounded-lg bg-[#191f24] border border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span>State Championship Highlights Reel</span>
                </div>
                <span className="text-[11px] text-orange-500 font-bold">Watch Video &gt;</span>
              </div>
            </div>

            {/* Right content */}
            <div className="order-1 lg:order-2 flex flex-col gap-6 text-left">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
                Connect With Athletes, Teams and Communities
              </h2>
              <p className="text-slate-600 text-base leading-relaxed font-light max-w-xl">
                Looking to follow your favorite athlete or team? Whether it's scores, schedules, stats, livestreams or anything in between… it's on ScoutVision.
              </p>
              <div className="mt-2">
                <a
                  href="/auth/login"
                  className="px-6 py-3 rounded bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs inline-flex items-center gap-1 transition-colors"
                >
                  Search Teams & Athletes →
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* 7. BRAND PROMISE SECTION */}
        <section className="bg-[#191f24] text-white py-24 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col gap-6 items-center">
            
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-3xl text-balance">
              We believe in sports. And teams believe in ScoutVision.
            </h3>
            
            <p className="text-slate-300 text-base md:text-lg font-light leading-relaxed max-w-2xl mt-4">
              We're here to help athletes, coaches, teams and programs grow every day by giving them easy access to the right information. That's why millions, across 40 sports, trust ScoutVision to maximize their potential.
            </p>

          </div>
        </section>

        {/* 8. BLOG / STORIES / NEWS SECTION */}
        <section className="bg-slate-50 text-[#191f24] py-20 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-left mb-12">
              <h3 className="text-3xl font-bold text-neutral-900 font-display">
                How ScoutVision changes the game.
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Story 1 */}
              <div className="bg-white rounded border border-neutral-200 p-6 flex flex-col justify-between min-h-[220px] hover:border-orange-500/50 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 mb-4 leading-snug">
                    ScoutVision Focus Point—A Coaching Catalyst for Valor Christian
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase">
                  Jun 27 / 2025
                </span>
              </div>

              {/* Story 2 */}
              <div className="bg-white rounded border border-neutral-200 p-6 flex flex-col justify-between min-h-[220px] hover:border-orange-500/50 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 mb-4 leading-snug">
                    How AI Is Transforming Volleyball Coaching & Analysis
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase">
                  Jul 28 / 2025
                </span>
              </div>

              {/* Story 3 */}
              <div className="bg-white rounded border border-neutral-200 p-6 flex flex-col justify-between min-h-[220px] hover:border-orange-500/50 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 mb-4 leading-snug">
                    Fulham FC Selects ScoutVision to be Official Player Performance Insights Partner
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase">
                  May 20 / 2025
                </span>
              </div>

              {/* Story 4 */}
              <div className="bg-white rounded border border-neutral-200 p-6 flex flex-col justify-between min-h-[220px] hover:border-orange-500/50 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 mb-4 leading-snug">
                    Titan GPS + ScoutVision: Bringing Physical Performance Data to Teams at Every Level
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase">
                  Jun 3 / 2025
                </span>
              </div>

            </div>

          </div>
        </section>

        {/* 9. FINAL CTA IN ACTION SECTION */}
        <section className="bg-white text-[#191f24] py-20 text-center border-t border-neutral-200">
          <div className="max-w-3xl mx-auto px-6 flex flex-col gap-6 items-center">
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-none">
              See ScoutVision in action.
            </h2>
            
            <div className="mt-4">
              <Link
                href="/auth/register"
                className="px-8 py-3.5 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-md"
              >
                Get Started
              </Link>
            </div>

          </div>
        </section>

      </main>

      {/* -------------------- FOOTER (SCOUTVISION PLATFORM NAVIGATION) -------------------- */}
      <footer className="bg-[#191f24] border-t border-[#2d3748]/30 text-[#a0aec0] py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12 text-left">
          
          {/* Solutions Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Solutions</h4>
            <nav className="flex flex-col gap-2 text-xs">
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">High School</Link>
              <Link href="/solutions/club" className="hover:text-orange-500 transition-colors">Club</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Collegiate</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Division I Colleges</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Fan Engagement</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Operations</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Youth Football</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Professional</Link>
            </nav>
          </div>

          {/* Products Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Products</h4>
            <nav className="flex flex-col gap-2 text-xs">
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">ScoutVision Focus</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">ScoutVision Analyst</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">ScoutVision Assist</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">ScoutVision Recruit</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Statsbomb</Link>
            </nav>
          </div>

          {/* Athletes and Fans Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Athletes and Fans</h4>
            <nav className="flex flex-col gap-2 text-xs">
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">ScoutVision Highlights</Link>
            </nav>
          </div>

          {/* About Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">About</h4>
            <nav className="flex flex-col gap-2 text-xs">
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Advertise</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Press</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Company News</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Careers</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Events</Link>
            </nav>
          </div>

          {/* Contact Us Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact Us</h4>
            <nav className="flex flex-col gap-2 text-xs">
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Support</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Blog</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Pay by Credit Card</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Accessories Store</Link>
            </nav>
          </div>

          {/* Login / Sales Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Logins</h4>
            <nav className="flex flex-col gap-2 text-xs">
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Login</Link>
              <Link href="/auth/login" className="hover:text-orange-500 transition-colors">Contact Sales</Link>
            </nav>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="h-px bg-slate-800 mb-8" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-slate-500 font-light text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Link href="/auth/login" className="hover:underline">Privacy Policy</Link>
              <span>|</span>
              <Link href="/auth/login" className="hover:underline">Terms & Conditions</Link>
              <span>|</span>
              <Link href="/auth/login" className="hover:underline">Software License Agreement</Link>
              <span>|</span>
              <Link href="/auth/login" className="hover:underline">Do Not Sell My Info</Link>
              <span>|</span>
              <Link href="/auth/login" className="hover:underline">Cookies</Link>
              <span>|</span>
              <Link href="/auth/login" className="hover:underline">Security</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <span>© {new Date().getFullYear()} ScoutVision, Inc. All rights reserved.</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> for performance.
              </span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
