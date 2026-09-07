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
  Briefcase, 
  Code2, 
  Cpu, 
  Laptop, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Send, 
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  DollarSign,
  Coffee,
  Plane,
  Award
} from "lucide-react";

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const perks = [
    {
      title: "Work From Anywhere",
      desc: "Flexible remote-first culture with vibrant tech hubs in Pune (Magarpatta City HQ), and global remote opportunities.",
      icon: Laptop
    },
    {
      title: "Competitive Compensation & Equity",
      desc: "Industry-leading salary packages, performance bonuses, and meaningful stock options in a fast-growing sports tech company.",
      icon: Award
    },
    {
      title: "Health & Comprehensive Wellness",
      desc: "Full premium health insurance for you and your family, mental health support, and wellness stipends.",
      icon: Heart
    },
    {
      title: "Continuous Learning & Equipment",
      desc: "Top-tier M3 Max MacBook Pros, 4K multi-monitors, plus an annual $2,000 learning budget for conferences and courses.",
      icon: Cpu
    },
    {
      title: "Flexible Time Off & Sabbaticals",
      desc: "Take the time you need to recharge with generous paid leave, parental leave, and paid company holidays.",
      icon: Plane
    },
    {
      title: "Game Day Tickets & Sports Culture",
      desc: "Access to live professional, collegiate, and high school sporting events, team tournaments, and annual company retreats.",
      icon: Trophy
    }
  ];

  const jobs = [
    {
      id: "cv-engineer",
      title: "Senior Computer Vision / Deep Learning Engineer",
      dept: "Engineering",
      location: "Hybrid / Remote (Pune (Magarpatta City HQ))",
      type: "Full-Time",
      experience: "4+ years",
      desc: "Architect and deploy real-time ball trajectory estimation, player pose detection, and court homography models on edge smart cameras and cloud video pipelines.",
      skills: ["PyTorch", "TensorRT", "YOLO / Transformers", "C++", "Python", "OpenCV"]
    },
    {
      id: "fullstack-lead",
      title: "Lead Full Stack Engineer (Next.js & Node.js)",
      dept: "Engineering",
      location: "Remote (Global)",
      type: "Full-Time",
      experience: "5+ years",
      desc: "Lead the frontend architecture of ScoutVision's interactive video platform, 3D court rotation viewers, and real-time collaborative tagging systems.",
      skills: ["Next.js", "TypeScript", "TailwindCSS", "Node.js", "WebSockets", "Docker"]
    },
    {
      id: "backend-video",
      title: "Video Streaming & Infrastructure Engineer",
      dept: "Engineering",
      location: "Remote (India / US)",
      type: "Full-Time",
      experience: "3+ years",
      desc: "Build ultra-low-latency HLS/WebRTC streaming infrastructure capable of broadcasting and transcoding thousands of high school games simultaneously.",
      skills: ["FFmpeg", "AWS MediaLive", "Go / Rust", "Docker", "Kubernetes", "WebRTC"]
    },
    {
      id: "ios-developer",
      title: "Senior iOS Developer (ScoutVision Sideline Replay)",
      dept: "Engineering",
      location: "Remote (Global)",
      type: "Full-Time",
      experience: "3+ years",
      desc: "Craft high-performance iPad and iPhone applications used by coaches on the sideline for instant video scrubbing, multi-angle sync, and telestration.",
      skills: ["Swift", "SwiftUI", "AVFoundation", "Metal", "Local Wi-Fi P2P"]
    },
    {
      id: "lead-volleyball-analyst",
      title: "Lead Volleyball Performance Analyst",
      dept: "Sports Operations",
      location: "Hybrid / Remote",
      type: "Full-Time",
      experience: "2+ years",
      desc: "Oversee match breakdown protocols, serve-receive rating QA (0-3 scale), rotation analytics, and train our AI models on collegiate and international volleyball standards.",
      skills: ["DataVolley", "Volleymetrics", "Coaching Experience", "Statistical Modeling"]
    },
    {
      id: "assist-qa-specialist",
      title: "Sports Data Verification Specialist (ScoutVision Assist)",
      dept: "Sports Operations",
      location: "Pune / Remote",
      type: "Full-Time / Shifts",
      experience: "1+ years",
      desc: "Verify automated box scores, kill efficiency, and defensive rally logs for high school and club games under a strict 12-hour turnaround window.",
      skills: ["Sports Knowledge", "Attention to Detail", "Fast Tagging", "Video Review"]
    },
    {
      id: "ae-high-school",
      title: "Athletic Account Executive (High School & Club)",
      dept: "Sales & Partnerships",
      location: "Remote",
      type: "Full-Time",
      experience: "2+ years",
      desc: "Introduce ScoutVision's Focus smart cameras, Assist breakdowns, and all-school packages to Athletic Directors, booster clubs, and head coaches.",
      skills: ["SaaS Sales", "Sports Athletic Connections", "CRM", "Presentation Skills"]
    },
    {
      id: "cv-intern",
      title: "Computer Vision & AI Research Intern",
      dept: "Internships",
      location: "Pune (On-site / Hybrid)",
      type: "Internship (Summer 2026)",
      experience: "Students / Recent Grads",
      desc: "Work alongside our PhD computer vision researchers on cutting-edge player segmentation, action recognition, and multi-camera spatial calibration.",
      skills: ["Python", "Machine Learning Basics", "Linear Algebra", "Passion for Sports"]
    }
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesDept = selectedDept === "all" || job.dept.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#191f24] text-white font-sans antialiased selection:bg-[#ff6300] selection:text-white">
      
      {/* ----------------- TOP NAVBAR ----------------- */}
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
              <Link href="/careers" className="text-xs font-semibold text-[#ff6300] py-1 border-b-2 border-[#ff6300]">
                Careers
              </Link>
              <Link href="/about" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/products/volleymetrics" className="text-xs font-semibold text-slate-300 hover:text-orange-400 transition-colors">
                Volleymetrics
              </Link>
              <Link href="/solutions/high-school" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                High School
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
            <a 
              href="#openings"
              className="px-4 py-2 text-xs font-bold rounded-sm bg-[#ff6300] text-white hover:bg-[#e05700] transition-all shadow-md shadow-orange-950/40 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>View Open Roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#14181c] via-[#191f24] to-[#12161a]">
        
        {/* Glow ambient background */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#ff6300]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-24 right-10 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[#ff6300] text-xs font-semibold uppercase tracking-wider mb-6">
            <Briefcase className="w-3.5 h-3.5" />
            <span>We're Hiring • Build the Future of Sports Tech</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] max-w-4xl mx-auto">
            The best tech for sports. <br />
            <span className="bg-gradient-to-r from-white via-slate-200 to-[#ff6300] bg-clip-text text-transparent">
              Built by the best team in tech.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed">
            At ScoutVision, we are creating intelligent video pipelines and AI computer vision systems that empower millions of coaches and athletes worldwide. Join our world-class team of engineers, researchers, and sports enthusiasts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <a
              href="#openings"
              className="px-7 py-3.5 text-sm font-bold rounded-sm bg-[#ff6300] text-white hover:bg-[#e05700] transition-all shadow-lg shadow-orange-950/40 hover:shadow-orange-900/60 flex items-center gap-2"
            >
              <span>Explore {jobs.length} Open Positions</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/scoutvision-technology"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 text-sm font-semibold rounded-sm bg-neutral-800/80 border border-neutral-700 text-slate-200 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              <span>Follow on LinkedIn</span>
              <ExternalLink className="w-4 h-4 text-[#ff6300]" />
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-neutral-800/80">
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
              <div className="text-3xl font-black text-white">Top 1%</div>
              <div className="text-xs text-slate-400 mt-1">Global AI Engineering Talent</div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
              <div className="text-3xl font-black text-[#ff6300]">Remote-First</div>
              <div className="text-xs text-slate-400 mt-1">With Tech Hubs in Pune & Mumbai</div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
              <div className="text-3xl font-black text-white">4.9 / 5.0</div>
              <div className="text-xs text-slate-400 mt-1">Employee Satisfaction Rating</div>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
              <div className="text-3xl font-black text-[#ff6300]">100%</div>
              <div className="text-xs text-slate-400 mt-1">Transparent Trust & Equity</div>
            </div>
          </div>

        </div>
      </section>

      {/* ----------------- PERKS & BENEFITS ----------------- */}
      <section className="py-24 bg-[#161a1e] border-y border-neutral-800/80 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#ff6300] tracking-widest uppercase mb-2 block">
              Why Work at ScoutVision
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Benefits you'll actually brag about.
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              When we trust great people with challenging problems, incredible things happen. Here is how we invest in you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {perks.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <div 
                  key={idx} 
                  className="p-7 rounded-xl bg-[#191f24] border border-neutral-800 hover:border-orange-500/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6300] mb-5 group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ----------------- OPEN POSITIONS ----------------- */}
      <section id="openings" className="py-24 bg-[#191f24] relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold text-[#ff6300] tracking-widest uppercase mb-2 block">
                Join Our Roster
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Current Openings
              </h2>
              <p className="text-slate-400 mt-2 text-sm">
                Explore engineering, operations, and leadership opportunities across our teams.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by role or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs rounded bg-neutral-900 border border-neutral-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff6300] w-full sm:w-64"
                />
              </div>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-2 text-xs rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]"
              >
                <option value="all">All Departments</option>
                <option value="engineering">Engineering & AI</option>
                <option value="operations">Sports Operations</option>
                <option value="sales">Sales & Partnerships</option>
                <option value="internships">Internships</option>
              </select>
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 rounded-xl bg-[#14181c] border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 text-[#ff6300] text-[10px] font-bold uppercase tracking-wider">
                        {job.dept}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-neutral-800 text-slate-300 text-[10px] font-semibold">
                        {job.type}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-neutral-800 text-slate-300 text-[10px] font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-[#ff6300] transition-colors">
                      {job.title}
                    </h3>

                    <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                      {job.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {job.skills.map((sk, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-slate-400 font-mono">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setIsApplyModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-sm bg-[#ff6300] text-white font-bold text-xs hover:bg-[#e05700] transition-colors flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-[#14181c] rounded-xl border border-neutral-800">
                <p className="text-slate-400 text-sm">No openings matching your current search criteria.</p>
                <button
                  onClick={() => {
                    setSelectedDept("all");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs font-semibold text-[#ff6300] hover:underline"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>

          {/* General Application Callout */}
          <div className="mt-12 p-8 rounded-xl bg-gradient-to-r from-[#1c2229] to-[#161a1e] border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-white">Don't see your specific role?</h3>
              <p className="text-xs text-slate-400 max-w-xl">
                We are always seeking exceptional talent in AI computer vision, sports biomechanics, and cloud infrastructure. Drop us your portfolio.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedJob({ title: "General Talent Application", dept: "General Roster" });
                setIsApplyModalOpen(true);
              }}
              className="px-6 py-3 rounded-sm bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs font-bold transition-all whitespace-nowrap"
            >
              Send General Application
            </button>
          </div>

        </div>
      </section>

      {/* ----------------- APPLY MODAL ----------------- */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-xl bg-[#191f24] border border-neutral-800 p-8 shadow-2xl">
            
            <button
              onClick={() => {
                setIsApplyModalOpen(false);
                setFormSubmitted(false);
                setSelectedJob(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>

            {!formSubmitted ? (
              <div>
                <div className="flex items-center gap-2 text-[#ff6300] text-xs font-bold uppercase tracking-wider mb-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Job Application</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {selectedJob?.title || "Apply to ScoutVision"}
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  {selectedJob?.dept} • Submit your details and our talent team will review within 48 hours.
                </p>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSubmitted(true);
                  }}
                  className="space-y-4 text-xs"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Alex Sharma" 
                        className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="alex@example.com" 
                        className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Phone Number *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+91 98765 43210" 
                        className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Location / City *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Pune / Remote" 
                        className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">LinkedIn Profile or Portfolio URL *</label>
                    <input 
                      type="url" 
                      required 
                      placeholder="https://linkedin.com/in/username or github.com" 
                      className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Why do you want to build ScoutVision?</label>
                    <textarea 
                      rows={3} 
                      placeholder="Tell us about your background in computer vision, sports, or engineering..."
                      className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-sm bg-[#ff6300] text-white font-bold hover:bg-[#e05700] transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Application</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Application Submitted!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you for applying to ScoutVision! Our engineering and talent acquisition team will review your profile and reach out via email.
                </p>
                <button
                  onClick={() => {
                    setIsApplyModalOpen(false);
                    setFormSubmitted(false);
                    setSelectedJob(null);
                  }}
                  className="px-5 py-2 rounded bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700"
                >
                  Close Window
                </button>
              </div>
            )}

          </div>
        </div>
      )}

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
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers & Jobs</Link></li>
              <li><Link href="/solutions/high-school" className="hover:text-white transition-colors">High School Solutions</Link></li>
              <li><Link href="/solutions/club" className="hover:text-white transition-colors">Club Volleyball</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Products</h4>
            <ul className="space-y-2">
              <li><Link href="/products/volleymetrics" className="hover:text-white transition-colors">Volleymetrics</Link></li>
              <li><Link href="/solutions/club" className="hover:text-white transition-colors">Club Solutions</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Focus Smart Camera</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">ScoutVision Assist</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Support & Connect</h4>
            <ul className="space-y-2">
              <li><a href="https://www.linkedin.com/company/scoutvision-technology" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">LinkedIn <ExternalLink className="w-3 h-3 text-[#ff6300]" /></a></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">Coach Sign In</Link></li>
              <li><Link href="/auth/register" className="hover:text-white transition-colors">Create Free Account</Link></li>
              <li><a href="mailto:contact.scoutvision@gmail.com" className="hover:text-white transition-colors">contact.scoutvision@gmail.com</a></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}
