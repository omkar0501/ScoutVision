"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  Video, 
  Camera, 
  BarChart3, 
  GraduationCap, 
  Users, 
  Tv, 
  Heart, 
  Globe2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Target, 
  Zap, 
  Compass, 
  CheckCircle2, 
  Flame, 
  Eye, 
  Award, 
  Layers, 
  Cpu, 
  Mail
} from "lucide-react";

export default function AboutPage() {
  const [activeValue, setActiveValue] = useState<number>(0);

  const stats = [
    { value: "10M+", label: "Video Rallies & Plays Analyzed", sub: "Powered by Computer Vision" },
    { value: "< 12h", label: "Breakdown Turnaround", sub: "Guaranteed Film Delivery" },
    { value: "10+", label: "Sports Supported", sub: "Volleyball, Basketball, Soccer & more" },
    { value: "99.4%", label: "Ball & Player Tracking Precision", sub: "Sub-pixel Court Accuracy" }
  ];

  const coreValues = [
    {
      title: "Play to Win",
      icon: Flame,
      summary: "If it's worth doing, it's worth being the best.",
      description: "We set ambitious goals, take bold technical swings, and push the boundaries of sports video AI. We aren't afraid of complex mathematical challenges or tough deadlines."
    },
    {
      title: "Win Together",
      icon: Heart,
      summary: "We're teammates first. We default to trust.",
      description: "Great sports teams succeed because of chemistry, not individual egos. We take care of each other, collaborate cross-functionally, and celebrate shared milestones."
    },
    {
      title: "Thrive on the Front Lines",
      icon: Target,
      summary: "Stay close to the court, the field, and the bench.",
      description: "We build empathy for coaches and athletes by testing our software courtside in noisy gyms and freezing stadiums. We build what actually works under game pressure."
    },
    {
      title: "Humble, Curious & Listening",
      icon: Compass,
      summary: "We listen to truly understand, not just to reply.",
      description: "Sports evolve constantly. We stay humble, solicit unvarnished feedback from athletic directors and analysts, and iterate rapidly based on real match data."
    },
    {
      title: "Respectfully Direct",
      icon: Zap,
      summary: "Clarity over ambiguity. Constructive feedback drives growth.",
      description: "High-performance coaching requires honesty. We communicate clearly, transparently, and constructively to solve problems before they reach the game."
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "The Vision Takes Flight",
      desc: "Founded by computer vision researchers and volleyball analysts to solve slow, manual match tagging with deep neural networks."
    },
    {
      year: "2024",
      title: "Sub-Second Optical Tracking",
      desc: "Launched our proprietary ball trajectory and court homography engine, achieving 99.4% detection accuracy on standard single-camera video."
    },
    {
      year: "2025",
      title: "ScoutVision Volleymetrics & Focus",
      desc: "Expanded into permanent gymnasium smart camera capture, sub-12-hour Assist breakdowns, and interactive 3D rotation spray charts."
    },
    {
      year: "2026",
      title: "The All-School High School Ecosystem",
      desc: "Rolled out department-wide video, digital ticketing, and collegiate recruiting networks for thousands of high schools and athletic clubs."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#191f24] text-white font-sans antialiased selection:bg-[#ff6300] selection:text-white">
      
      {/* ----------------- HEADER / NAVBAR ----------------- */}
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-[#191F24] border-b border-neutral-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between w-full min-h-[58px]">
          
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/logos/scoutvision_icon.png"
                alt="ScoutVision Logo"
                className="w-10 h-10 object-contain transition-transform group-hover:scale-105 drop-shadow-[0_0_12px_rgba(255,99,0,0.6)]"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                Scout<span className="text-[#ff6300]">Vision</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/about" className="text-xs font-semibold text-[#ff6300] py-1 border-b-2 border-[#ff6300]">
                About Us
              </Link>
              <Link href="/products/volleymetrics" className="text-xs font-semibold text-slate-300 hover:text-orange-400 transition-colors">
                Volleymetrics
              </Link>
              <Link href="/solutions/high-school" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                High School Solutions
              </Link>
              <Link href="/solutions/club" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                Club Volleyball
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/register"
              className="px-4 py-2 text-xs font-bold rounded-sm bg-[#ff6300] text-white hover:bg-[#e05700] transition-all shadow-md shadow-orange-950/40 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#14181c] via-[#191f24] to-[#12161a]">
        
        {/* Glow ambient background elements */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[850px] h-[360px] bg-[#ff6300]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute -top-20 right-16 w-[350px] h-[350px] bg-amber-600/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[#ff6300] text-xs font-semibold uppercase tracking-wider mb-6">
            <Eye className="w-3.5 h-3.5" />
            <span>Changing How the World Sees Sports</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] max-w-4xl mx-auto">
            ScoutVision is how modern teams <br />
            <span className="bg-gradient-to-r from-white via-slate-200 to-[#ff6300] bg-clip-text text-transparent">
              capture, learn and win.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed">
            We are building the future of sports technology—combining automated smart camera capture, artificial intelligence, and deep tactical analytics to unlock the true potential of every athlete and coach.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href="/products/volleymetrics"
              className="px-7 py-3.5 text-sm font-bold rounded-sm bg-[#ff6300] text-white hover:bg-[#e05700] transition-all shadow-lg shadow-orange-950/40 hover:shadow-orange-900/60 flex items-center gap-2"
            >
              <span>Explore Our Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#values"
              className="px-7 py-3.5 text-sm font-semibold rounded-sm bg-neutral-800/80 border border-neutral-700 text-slate-200 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Our Core Values
            </Link>
          </div>

          {/* Key Metric Numbers Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-neutral-800/80">
            {stats.map((st, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/60 text-center">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  <span className="text-[#ff6300]">{st.value.split(" ")[0]}</span> {st.value.split(" ").slice(1).join(" ")}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-200 mt-1">{st.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{st.sub}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ----------------- WHAT WE DO SECTION ----------------- */}
      <section className="py-24 bg-[#161a1e] border-y border-neutral-800/80 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#ff6300] tracking-widest uppercase mb-2 block">
              What We Do
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From the first serve to the championship trophy.
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              ScoutVision bridges raw video footage and game-winning tactical decisions with an end-to-end intelligent sports operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. Automated Capture */}
            <div className="p-8 rounded-xl bg-[#191f24] border border-neutral-800 hover:border-orange-500/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6300] mb-6 group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Cameras That Never Miss a Moment</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Our permanently mounted ScoutVision Focus smart cameras automatically detect play action, pan, zoom, and livestream games without requiring human operators or tripods.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-neutral-800/80 flex items-center text-xs font-semibold text-[#ff6300]">
                <span>Automated 1080p Cloud Ingestion</span>
              </div>
            </div>

            {/* 2. Organized Film & Video Indexing */}
            <div className="p-8 rounded-xl bg-[#191f24] border border-neutral-800 hover:border-orange-500/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6300] mb-6 group-hover:scale-110 transition-transform">
                  <Layers className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Every Play. Every Athlete. Indexed.</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Within hours of a match finishing, ScoutVision organizes and timestamps every rally. Coaches and players can filter film by rotation, player touches, attack zones, or error type with a single click.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-neutral-800/80 flex items-center text-xs font-semibold text-[#ff6300]">
                <span>12-Hour Turnaround Guarantee</span>
              </div>
            </div>

            {/* 3. AI Predictive Analytics */}
            <div className="p-8 rounded-xl bg-[#191f24] border border-neutral-800 hover:border-orange-500/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6300] mb-6 group-hover:scale-110 transition-transform">
                  <Cpu className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Analytics That Give Teams the Edge</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  It's more than raw video; it's deep tactical intelligence. Our computer vision models extract setter tendencies, defensive heatmaps, and kill efficiency to build visual game plans players grasp immediately.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-neutral-800/80 flex items-center text-xs font-semibold text-[#ff6300]">
                <span>AI Models + Certified Sport Analysts</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------- CORE VALUES SECTION ----------------- */}
      <section id="values" className="py-24 bg-[#191f24] relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#ff6300] tracking-widest uppercase mb-2 block">
              How We Work
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our core values guide every line of code we write.
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              Building game-changing sports technology takes relentless focus, deep customer empathy, and a high-trust culture.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Values Navigation */}
            <div className="lg:col-span-5 space-y-3">
              {coreValues.map((val, idx) => {
                const IconComponent = val.icon;
                const isActive = activeValue === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveValue(idx)}
                    className={`w-full text-left p-5 rounded-xl border transition-all flex items-center justify-between ${
                      isActive 
                        ? "bg-[#1c2229] border-[#ff6300] shadow-lg shadow-orange-950/30" 
                        : "bg-[#14181c] border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isActive ? "bg-[#ff6300] text-white" : "bg-neutral-800 text-slate-400"
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-base font-bold text-white">{val.title}</div>
                        <div className="text-xs text-slate-400">{val.summary}</div>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-transform ${
                      isActive ? "text-[#ff6300] translate-x-1" : "text-neutral-600"
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Active Value Spotlight Card */}
            <div className="lg:col-span-7">
              <div className="p-8 lg:p-12 rounded-2xl bg-gradient-to-br from-[#1c2229] to-[#14181c] border border-neutral-700/80 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6300]/10 rounded-full blur-[90px] pointer-events-none" />
                
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-[#ff6300] text-xs font-bold uppercase tracking-wider">
                    <span>ScoutVision Guiding Principle #{activeValue + 1}</span>
                  </div>

                  <h3 className="text-3xl font-extrabold text-white tracking-tight">
                    {coreValues[activeValue].title}
                  </h3>

                  <p className="text-lg text-slate-200 font-medium italic leading-relaxed">
                    "{coreValues[activeValue].summary}"
                  </p>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {coreValues[activeValue].description}
                  </p>

                  <div className="pt-6 border-t border-neutral-700/60 grid grid-cols-2 gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#ff6300]" />
                      <span>Authentic sports empathy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#ff6300]" />
                      <span>Radical focus on reliability</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------- COMPANY MILESTONES ----------------- */}
      <section className="py-24 bg-[#161a1e] border-y border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#ff6300] tracking-widest uppercase mb-2 block">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How ScoutVision became a sports analytics powerhouse.
            </h2>
            <p className="text-slate-400 mt-3 text-sm">
              From pioneering computer vision tracking algorithms to equipping thousands of athletic programs worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-[#191f24] border border-neutral-800 relative">
                <div className="text-2xl font-black text-[#ff6300] font-mono mb-2">
                  {m.year}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{m.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ----------------- CALL TO ACTION ----------------- */}
      <section className="py-20 bg-gradient-to-r from-[#e64a00] via-[#ff6300] to-[#ff7a00] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Join the teams who refuse to settle for ordinary.
          </h2>
          <p className="text-white/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Whether you are coaching a championship volleyball squad, directing a high school athletic program, or building a club dynasty, ScoutVision is ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/auth/register"
              className="px-8 py-3.5 bg-neutral-950 text-white text-sm font-bold rounded-sm hover:bg-neutral-900 transition-all shadow-xl hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              href="/solutions/high-school"
              className="px-8 py-3.5 bg-white/20 hover:bg-white/30 text-white text-sm font-bold rounded-sm transition-all backdrop-blur-sm"
            >
              View School Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="bg-[#12161a] border-t border-neutral-900 py-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10">
          
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/logos/scoutvision_icon.png"
                alt="ScoutVision Logo"
                className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(255,99,0,0.5)]"
              />
              <span className="text-lg font-bold text-white tracking-tight">
                Scout<span className="text-[#ff6300]">Vision</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Empowering coaches, athletic directors, and athletes with intelligent automated video analytics, verified stats, and seamless live broadcasting.
            </p>
            <div className="text-[11px] text-slate-400 pt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span>📍</span>
                <span>Magarpatta City, Hadapsar, Pune, Maharashtra 411028, India</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>✉️</span>
                <a href="mailto:contact.scoutvision@gmail.com" className="text-[#ff6300] hover:underline">contact.scoutvision@gmail.com</a>
              </div>
              <div className="text-slate-500 pt-1">© {new Date().getFullYear()} ScoutVision Technology, Inc. All rights reserved.</div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/solutions/high-school" className="hover:text-white transition-colors">High School Solutions</Link></li>
              <li><Link href="/solutions/club" className="hover:text-white transition-colors">Club Volleyball</Link></li>
              <li><Link href="/products/volleymetrics" className="hover:text-white transition-colors">Volleymetrics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Products</h4>
            <ul className="space-y-2">
              <li><Link href="/products/volleymetrics" className="hover:text-white transition-colors">Volleymetrics</Link></li>
              <li><Link href="/solutions/club" className="hover:text-white transition-colors">Club Volleyball</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Focus Smart Camera</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">ScoutVision Assist</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Support & Account</h4>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Coach Sign In</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Create Free Account</Link></li>
              <li><Link href="/auth/forgot-password" className="hover:text-white transition-colors">Reset Password</Link></li>
              <li><a href="mailto:contact.scoutvision@gmail.com" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}
