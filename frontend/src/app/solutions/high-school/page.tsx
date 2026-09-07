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
  Ticket, 
  DollarSign, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  Layers, 
  Clock, 
  Award,
  Activity,
  FileSpreadsheet,
  Check,
  Send
} from "lucide-react";

export default function HighSchoolSolutionPage() {
  const [activeRoleTab, setActiveRoleTab] = useState<"directors" | "coaches" | "athletes">("directors");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const roleData = {
    directors: {
      title: "For Athletic Directors & Administrators",
      badge: "DEPARTMENT-WIDE MANAGEMENT",
      description: "Elevate your entire athletic department with unified video, automated gym cameras, centralized budgeting, and streamlined booster club revenue.",
      highlights: [
        {
          title: "All-School Video Ecosystem",
          desc: "Connect all varsity, junior varsity, and freshman sports teams under one intuitive administrative dashboard."
        },
        {
          title: "Automated Focus Smart Cameras",
          desc: "Permanently mounted HD cameras in your main gymnasium and stadium automatically record and stream games without requiring parent volunteers."
        },
        {
          title: "Digital Ticketing & Booster Monetization",
          desc: "Generate sustainable revenue with frictionless mobile ticketing and premium 1080p livestreams for alumni and traveling families."
        },
        {
          title: "Title IX & Compliance Assurance",
          desc: "Equal capture quality and verified analytics access across all boys' and girls' sports programs in your high school."
        }
      ],
      quote: {
        text: "ScoutVision gave our high school athletic department a single home for video, stats, and livestreaming across all 14 sports. Our coaches save hours every week, and parents love the stream quality.",
        author: "Marcus Vance",
        role: "Athletic Director, Oakridge High School"
      }
    },
    coaches: {
      title: "For High School Head Coaches & Assistants",
      badge: "GAME PREP & PLAYER DEVELOPMENT",
      description: "Spend less time scrubbing raw video and more time coaching. Receive full match breakdowns, rotation stats, and shot charts in under 12 hours.",
      highlights: [
        {
          title: "12-Hour ScoutVision Assist Turnaround",
          desc: "Upload game film right after the match and get box scores, kill efficiency, attack zones, and rotation breakdowns back before breakfast."
        },
        {
          title: "Sideline Instant Replay on iPads",
          desc: "Give your bench immediate multi-angle feedback during timeouts and between sets to adjust tactics in real-time."
        },
        {
          title: "Opponent Scouting & Film Exchange",
          desc: "Exchange game film securely with conference rivals and build visual game plans that your players can understand in minutes."
        },
        {
          title: "Practice Rep Tagger & Visual Feedback",
          desc: "Tag serve-receive reps, setter-hitter timing, and defensive transitions during practice to accelerate player skill growth."
        }
      ],
      quote: {
        text: "The rotation breakdown and attack spray charts gave us the edge in our state championship run. Our student-athletes actually watch film now because the clips are indexed by player.",
        author: "Coach Elena Rossi",
        role: "Head Volleyball Coach, Westlake Prep"
      }
    },
    athletes: {
      title: "For Student-Athletes & High School Parents",
      badge: "COLLEGE RECRUITING & FAN EXPERIENCE",
      description: "Empower athletes to build verified recruiting profiles, create viral highlight reels, and share every memorable moment with family nationwide.",
      highlights: [
        {
          title: "Automated Player Highlight Reels",
          desc: "Our AI automatically flags every ace, kill, block, and defensive dig for each athlete, making highlight reel creation take minutes instead of hours."
        },
        {
          title: "Verified Athletic Recruiting Profiles",
          desc: "Connect recruiting profiles directly to collegiate scouts with verified stats, athletic measurements, and academic transcripts."
        },
        {
          title: "Live HD Streaming with Scoreboard",
          desc: "Grandparents, alumni, and traveling fans can watch high-definition livestreams from any smartphone, tablet, or smart TV."
        },
        {
          title: "Digital Memory Vault",
          desc: "Every game, ceremony, and championship moment is archived in full 1080p resolution for athletes and families to keep forever."
        }
      ],
      quote: {
        text: "Having verified ScoutVision stats linked directly to my recruiting highlight tape helped me secure scholarship offers from three Division I programs.",
        author: "Jordan Miller",
        role: "High School All-American & D1 Collegiate Commit"
      }
    }
  };

  const sportsList = [
    { id: "volleyball", name: "Volleyball", icon: "🏐", description: "Rotation analytics, serve receive passing ratings (0-3), attack spray charts, and setter distribution." },
    { id: "basketball", name: "Basketball", icon: "🏀", description: "Interactive shot charts, turnover-to-points conversions, lineup +/- efficiency, and defensive stops." },
    { id: "soccer", name: "Soccer", icon: "⚽", description: "Passing progression maps, attacking 3rd entries, set-piece breakdowns, and high-press tracking." },
    { id: "football", name: "Football", icon: "🏈", description: "Down & distance tendencies, formation card diagrams, defensive blitz pickup, and sideline iPad replay." },
    { id: "baseball", name: "Baseball & Softball", icon: "⚾", description: "Pitch velocity, spray charts, count-by-count batter tendencies, and defensive fielding metrics." },
    { id: "wrestling", name: "Wrestling & Track", icon: "🤼", description: "Takedown efficiency, escape timing, round-by-round point trends, and event video logs." }
  ];

  const packages = [
    {
      name: "Single Sport Varsity",
      tagline: "For individual high school teams wanting pro-tier film & analytics.",
      badge: "TEAM SPECIFIC",
      popular: false,
      features: [
        "1 Varsity + 1 JV Team Roster Access",
        "Unlimited 1080p Match & Practice Video Storage",
        "ScoutVision Assist Breakdown (15 Games/Season)",
        "Automated Player Highlight Clips",
        "Mobile App for Coaches & Athletes",
        "Basic Conference Film Exchange"
      ],
      cta: "Get Team Pricing"
    },
    {
      name: "All-School Department Package",
      tagline: "The gold standard for high school athletic departments.",
      badge: "MOST POPULAR",
      popular: true,
      features: [
        "Every Sport in Your Athletic Program (Boys & Girls)",
        "Includes ScoutVision Focus Smart Gymnasium Camera",
        "Full ScoutVision Assist Match Breakdown for All Sports",
        "Sideline Instant Replay on iPad Devices",
        "ScoutVision TV Livestreaming & Ticket Monetization",
        "College Recruiting Network Access for Every Athlete",
        "Dedicated High School Success Manager & Staff Onboarding"
      ],
      cta: "Schedule Department Consultation"
    },
    {
      name: "District & County Enterprise",
      tagline: "Centralized governance for multi-school public & private school districts.",
      badge: "DISTRICT WIDE",
      popular: false,
      features: [
        "Multi-School Centralized Administrative Portal",
        "Bulk Hardware Discount on Gymnasium & Stadium Cameras",
        "District-Wide Title IX & Athletic Equitability Reports",
        "Single Sign-On (SSO) & Student Information System (SIS) Sync",
        "Custom District Broadcast Branding & Revenue Distribution",
        "24/7 Priority Support & On-Site Hardware Replacement"
      ],
      cta: "Contact District Sales"
    }
  ];

  const faqs = [
    {
      q: "How does the ScoutVision Focus smart camera work in high school gymnasiums?",
      a: "The ScoutVision Focus camera is mounted permanently on the wall or ceiling at center court. It connects to your school's network and automatically starts recording and livestreaming according to your athletic calendar. Coaches and athletic directors never need to assign volunteers or set up tripods."
    },
    {
      q: "How quickly do high school coaches receive stats and breakdowns after a match?",
      a: "With ScoutVision Assist, coaches simply upload their match video after the game. Our hybrid AI + certified sports analyst team returns verified box scores, player rotations, and indexed video clips in under 12 hours—guaranteed in time for morning film sessions."
    },
    {
      q: "Can our high school monetize our livestreams and digital tickets?",
      a: "Yes! With ScoutVision TV and ScoutVision Tickets, high schools keep up to 100% of the broadcast and ticket revenue after standard processing. You can offer season passes, pay-per-view games, or sponsor banners to fund athletic booster club initiatives."
    },
    {
      q: "Does ScoutVision integrate with our state high school athletic association and recruiting platforms?",
      a: "Yes. ScoutVision complies with NFHS regulations, state association film exchange bylaws, and seamlessly exports recruiting profiles and verified video to collegiate scouts nationwide."
    },
    {
      q: "What equipment do we need to get started?",
      a: "All you need is standard gym Wi-Fi or an ethernet drop. We provide the Focus Smart Camera hardware, installation guidance, and our cloud software works on any smartphone, iPad, Chromebook, or PC."
    }
  ];

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

            {/* Breadcrumb / Subnav */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/solutions/high-school" className="text-xs font-semibold text-[#ff6300] py-1 border-b-2 border-[#ff6300]">
                High School Solutions
              </Link>
              <Link href="/solutions/club" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                Club Volleyball
              </Link>
              <Link href="/products/volleymetrics" className="text-xs font-semibold text-slate-300 hover:text-orange-400 transition-colors">
                Volleymetrics
              </Link>
              <Link href="#pricing" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
                Pricing & Packages
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded transition-colors hidden sm:block"
            >
              Coach & Athlete Login
            </Link>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-sm bg-[#ff6300] text-white hover:bg-[#e05700] transition-all shadow-md shadow-orange-950/40 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>Get School Quote</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#14181c] via-[#191f24] to-[#12161a]">
        
        {/* Subtle orange ambient glow backdrop */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#ff6300]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-24 right-10 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-[#ff6300] text-xs font-semibold uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5" />
                <span>Unified High School Athletic Solutions</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Every athlete. <br />
                Every coach. <br />
                <span className="bg-gradient-to-r from-white via-slate-200 to-[#ff6300] bg-clip-text text-transparent">
                  One connected school program.
                </span>
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                Give your high school sports teams professional-grade smart camera capture, 12-hour video breakdowns, collegiate recruiting tools, and broadcast-quality livestreams—all in one seamless athletic ecosystem.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="px-6 py-3.5 text-sm font-bold rounded-sm bg-[#ff6300] text-white hover:bg-[#e05700] transition-all shadow-lg shadow-orange-950/40 hover:shadow-orange-900/60 flex items-center justify-center gap-2 group"
                >
                  <span>Request Athletic Director Demo</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <Link
                  href="#roles"
                  className="px-6 py-3.5 text-sm font-semibold rounded-sm bg-neutral-800/80 border border-neutral-700 text-slate-200 hover:text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 text-[#ff6300]" />
                  <span>See How It Works by Role</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-6 text-slate-400">
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">10+</div>
                  <div className="text-xs text-slate-400">Varsity & JV Sports</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">&lt;12h</div>
                  <div className="text-xs text-slate-400">Stat Turnaround Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#ff6300] tracking-tight">100%</div>
                  <div className="text-xs text-slate-400">Automated Smart Capture</div>
                </div>
              </div>

            </div>

            {/* Right Hero Column: Interactive High School App Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl border border-neutral-800 bg-[#14181c]/90 p-5 shadow-2xl backdrop-blur-md">
                
                {/* Header preview pill */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="text-xs font-mono text-slate-400 ml-2">highschool.scoutvision.live</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold uppercase tracking-wider">
                    Gym 1 Camera Live
                  </span>
                </div>

                {/* Simulated Video & Analysis Card */}
                <div className="relative rounded-lg overflow-hidden border border-neutral-800 aspect-video bg-neutral-900 group mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1000&q=80"
                    alt="High School Sports Video"
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Overlay HUD elements */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-600 text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      REC
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white">
                      Varsity Volleyball vs Lincoln Prep
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded border border-white/10">
                      <span className="text-white font-bold">SET 3</span>
                      <span className="text-orange-400 font-mono">21 - 19</span>
                      <span className="text-slate-400 text-[10px]">Rotation 4 (S1)</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Assist Verified</span>
                    </div>
                  </div>
                </div>

                {/* Quick high school athletic metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-neutral-800/60 border border-neutral-700/50">
                    <div className="text-slate-400 text-[11px]">Sideout Percentage</div>
                    <div className="text-lg font-bold text-white mt-0.5 flex items-baseline gap-1.5">
                      <span>68.4%</span>
                      <span className="text-[10px] text-emerald-400 font-normal">+5.2% vs avg</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-800/60 border border-neutral-700/50">
                    <div className="text-slate-400 text-[11px]">Recruiting Views</div>
                    <div className="text-lg font-bold text-[#ff6300] mt-0.5 flex items-baseline gap-1.5">
                      <span>142</span>
                      <span className="text-[10px] text-slate-300 font-normal">NCAA Scouts</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ----------------- ROLE-BASED SOLUTIONS TABS ----------------- */}
      <section id="roles" className="py-20 bg-[#161a1e] border-y border-neutral-800/80 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#ff6300] tracking-widest uppercase mb-2 block">
              Tailored For Every Role
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed for everyone in your high school sports community.
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              Whether you are managing athletic budgets, diagramming the winning play, or chasing a college scholarship, ScoutVision fits your exact workflow.
            </p>

            {/* Tab Controls */}
            <div className="flex justify-center mt-8 p-1 bg-neutral-900/90 rounded-lg border border-neutral-800 max-w-xl mx-auto">
              <button
                onClick={() => setActiveRoleTab("directors")}
                className={`flex-1 py-2.5 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeRoleTab === "directors"
                    ? "bg-[#ff6300] text-white shadow-md shadow-orange-950/50"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Athletic Directors</span>
              </button>
              
              <button
                onClick={() => setActiveRoleTab("coaches")}
                className={`flex-1 py-2.5 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeRoleTab === "coaches"
                    ? "bg-[#ff6300] text-white shadow-md shadow-orange-950/50"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Coaches</span>
              </button>

              <button
                onClick={() => setActiveRoleTab("athletes")}
                className={`flex-1 py-2.5 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeRoleTab === "athletes"
                    ? "bg-[#ff6300] text-white shadow-md shadow-orange-950/50"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Athletes & Parents</span>
              </button>
            </div>
          </div>

          {/* Active Tab Content Card */}
          <div className="bg-[#191f24] rounded-xl border border-neutral-800 p-8 lg:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-block px-3 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-[#ff6300] text-xs font-bold uppercase tracking-wider">
                  {roleData[activeRoleTab].badge}
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {roleData[activeRoleTab].title}
                </h3>
                
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {roleData[activeRoleTab].description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  {roleData[activeRoleTab].highlights.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800/80 space-y-1.5">
                      <div className="flex items-center gap-2 text-white font-semibold text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#ff6300] flex-shrink-0" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed pl-6">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setIsDemoModalOpen(true)}
                    className="px-5 py-2.5 text-xs font-bold rounded-sm bg-[#ff6300] text-white hover:bg-[#e05700] transition-colors flex items-center gap-2"
                  >
                    <span>Talk to Our High School Specialist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Role Testimonial Box */}
              <div className="lg:col-span-5">
                <div className="p-7 rounded-xl bg-gradient-to-br from-[#1c2228] to-[#14181c] border border-neutral-700/60 relative overflow-hidden shadow-xl">
                  <div className="text-orange-500/20 text-7xl font-serif absolute -top-4 -right-2 select-none">“</div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {"★".repeat(5)}
                    </div>
                    <p className="text-sm text-slate-200 italic leading-relaxed">
                      "{roleData[activeRoleTab].quote.text}"
                    </p>
                    <div className="pt-3 border-t border-neutral-700/50">
                      <div className="font-bold text-white text-sm">
                        {roleData[activeRoleTab].quote.author}
                      </div>
                      <div className="text-xs text-[#ff6300]">
                        {roleData[activeRoleTab].quote.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ----------------- CORE PRODUCTS BREAKDOWN ----------------- */}
      <section className="py-20 bg-[#191f24] relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#ff6300] tracking-widest uppercase mb-2 block">
              The High School Tech Stack
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Powerful tools seamlessly integrated under one login.
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              No more juggling separate camera systems, stat spreadsheets, DVD burners, and livestreaming links.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* 1. Focus Smart Camera */}
            <div className="p-6 rounded-xl bg-[#14181c] border border-neutral-800 hover:border-orange-500/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6300] mb-5 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ScoutVision Focus Smart Camera</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Indoor & outdoor automated cameras permanently installed in your gym and stadium. Automatically pans, zooms, and follows action without camera operators.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Hands-free automated recording</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Direct 1080p cloud upload</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Synchronized scoreboard feed</span>
                </li>
              </ul>
            </div>

            {/* 2. ScoutVision Assist Breakdown */}
            <div className="p-6 rounded-xl bg-[#14181c] border border-neutral-800 hover:border-orange-500/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6300] mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ScoutVision Assist Breakdowns</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Send us your raw match video and receive professional, verified stat breakdowns, rotation tracking, and indexed video clips in under 12 hours.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Official box score generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Rotation & tendency charts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Click any stat to view video clips</span>
                </li>
              </ul>
            </div>

            {/* 3. ScoutVision Sideline Replay */}
            <div className="p-6 rounded-xl bg-[#14181c] border border-neutral-800 hover:border-orange-500/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6300] mb-5 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ScoutVision Sideline Replay</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Instant wireless video to the bench and coaching box. Review the previous rally, drive, or possession in real-time on Apple iPads.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Sub-second local Wi-Fi latency</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Telestration drawing & slow motion</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Compliant with NFHS rules</span>
                </li>
              </ul>
            </div>

            {/* 4. ScoutVision TV & Livestreaming */}
            <div className="p-6 rounded-xl bg-[#14181c] border border-neutral-800 hover:border-orange-500/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6300] mb-5 group-hover:scale-110 transition-transform">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ScoutVision TV & Livestreaming</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Broadcast every game to fans, grandparents, and alumni. Includes automated scoreboards, sponsor graphics, and multi-camera switching.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Crystal-clear 1080p 60fps streaming</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Dedicated high school channel profile</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Available on iOS, Android, AppleTV, Roku</span>
                </li>
              </ul>
            </div>

            {/* 5. ScoutVision Tickets & Booster Revenue */}
            <div className="p-6 rounded-xl bg-[#14181c] border border-neutral-800 hover:border-orange-500/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6300] mb-5 group-hover:scale-110 transition-transform">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Digital Ticketing & Monetization</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Eliminate cash boxes and paper tickets at the gate. Fans purchase season passes and game tickets on their phones in seconds.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Contactless gate scanning app</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Keep 100% of athletic department proceeds</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Automated booster club financial reports</span>
                </li>
              </ul>
            </div>

            {/* 6. College Recruiting Network */}
            <div className="p-6 rounded-xl bg-[#14181c] border border-neutral-800 hover:border-orange-500/50 transition-all group">
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6300] mb-5 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Collegiate Recruiting Network</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Give student-athletes direct visibility to NCAA, NAIA, and Junior College scouts with verified game stats and auto-clipped highlight tapes.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Verified stat badges on athlete profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>One-click recruiter contact share</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6300]" />
                  <span>Highlight reel creator with audio overlays</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ----------------- BROWSE BY SPORT ----------------- */}
      <section className="py-20 bg-[#161a1e] border-y border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#ff6300] tracking-widest uppercase mb-2 block">
              Multi-Sport Support
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Purpose-built tools for all high school sports.
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              Each sport has unique tactical demands. ScoutVision delivers specialized tagging and analytics tailored to your sport's playbook.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sportsList.map((sport) => (
              <div 
                key={sport.id}
                className="p-5 rounded-lg bg-[#191f24] border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className="text-2xl">{sport.icon}</span>
                    <h3 className="text-base font-bold text-white">{sport.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {sport.description}
                  </p>
                </div>
                
                <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <Link 
                    href={sport.id === "volleyball" ? "/products/volleymetrics" : "/solutions/club"}
                    className="text-xs font-semibold text-[#ff6300] hover:text-orange-400 flex items-center gap-1 group"
                  >
                    <span>Learn more</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                    Varsity + JV
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ----------------- PRICING & PACKAGES ----------------- */}
      <section id="pricing" className="py-24 bg-[#191f24] relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#ff6300] tracking-widest uppercase mb-2 block">
              Transparent High School Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Flexible options built for public & private high schools.
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              Fund your athletic technology easily through booster club ticket revenue or school department budget.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {packages.map((pkg, idx) => (
              <div 
                key={idx}
                className={`rounded-xl p-8 flex flex-col justify-between relative transition-all ${
                  pkg.popular 
                    ? "bg-[#1c2229] border-2 border-[#ff6300] shadow-2xl shadow-orange-950/40 lg:-translate-y-2" 
                    : "bg-[#14181c] border border-neutral-800"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#ff6300] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                    {!pkg.popular && pkg.badge}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                    {pkg.tagline}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-neutral-800">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Included Features:
                    </div>
                    <ul className="space-y-2.5">
                      {pkg.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <Check className="w-4 h-4 text-[#ff6300] flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-neutral-800">
                  <button
                    onClick={() => setIsDemoModalOpen(true)}
                    className={`w-full py-3 text-xs font-bold rounded-sm transition-all flex items-center justify-center gap-1.5 ${
                      pkg.popular 
                        ? "bg-[#ff6300] text-white hover:bg-[#e05700] shadow-lg shadow-orange-950/50" 
                        : "bg-neutral-800 text-white hover:bg-neutral-700"
                    }`}
                  >
                    <span>{pkg.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[10px] text-center text-slate-500 mt-2">
                    PO invoice or credit card payment options available
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ----------------- FAQ SECTION ----------------- */}
      <section className="py-20 bg-[#161a1e] border-t border-neutral-800/80">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#ff6300] tracking-widest uppercase mb-2 block">
              Common Questions
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Everything Athletic Directors and coaches need to know about getting ScoutVision into their school.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-lg border border-neutral-800 bg-[#191f24] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-sm sm:text-base font-bold text-white hover:text-orange-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#ff6300] transition-transform duration-200 flex-shrink-0 ml-4 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-neutral-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ----------------- CALL TO ACTION BANNER ----------------- */}
      <section className="py-20 bg-gradient-to-r from-[#e64a00] via-[#ff6300] to-[#ff7a00] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center text-white space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-black/20 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            Fast 15-Minute School Consultation
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
            Ready to give your high school athletes the competitive edge?
          </h2>
          <p className="text-white/90 text-sm sm:text-base max-w-xl mx-auto">
            Schedule a brief call with our high school athletic specialist to review your gym camera placement and department package options.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-8 py-3.5 bg-neutral-950 text-white text-sm font-bold rounded-sm hover:bg-neutral-900 transition-all shadow-xl hover:scale-105"
            >
              Get Custom School Proposal
            </button>
            <Link
              href="/auth/register"
              className="px-8 py-3.5 bg-white/20 hover:bg-white/30 text-white text-sm font-bold rounded-sm transition-all backdrop-blur-sm"
            >
              Create Coach Account
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------- DEMO / INQUIRY MODAL ----------------- */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-xl bg-[#191f24] border border-neutral-800 p-8 shadow-2xl">
            
            <button
              onClick={() => {
                setIsDemoModalOpen(false);
                setFormSubmitted(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>

            {!formSubmitted ? (
              <div>
                <div className="flex items-center gap-2 text-[#ff6300] text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>High School Athletic Proposal</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Schedule Department Demo</h3>
                <p className="text-xs text-slate-400 mb-6">
                  Fill out your school details and our athletic specialist will reach out within 1 business day.
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
                      <label className="block text-slate-300 mb-1">First & Last Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Coach Smith" 
                        className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Your Role *</label>
                      <select className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]">
                        <option>Athletic Director</option>
                        <option>Head Coach</option>
                        <option>Assistant Coach</option>
                        <option>Booster Club President</option>
                        <option>District Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">School Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Lincoln High School" 
                      className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Work Email *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="ad@lincolnhs.edu" 
                        className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="(555) 000-0000" 
                        className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Primary Sport of Interest</label>
                    <select className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-[#ff6300]">
                      <option>All-School Department (All Sports)</option>
                      <option>Volleyball</option>
                      <option>Basketball</option>
                      <option>Soccer</option>
                      <option>Football</option>
                      <option>Wrestling</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-sm bg-[#ff6300] text-white font-bold hover:bg-[#e05700] transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Proposal Request</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Proposal Request Received!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you! Our High School Athletic Director team has received your information and will send over equipment specs and school pricing shortly.
                </p>
                <button
                  onClick={() => {
                    setIsDemoModalOpen(false);
                    setFormSubmitted(false);
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
              Empowering coaches, athletic directors, and high school student-athletes with intelligent automated video analytics, verified stats, and seamless live broadcasting.
            </p>
            <div className="text-[11px] text-slate-500 pt-2">
              © {new Date().getFullYear()} ScoutVision Technology, Inc. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">High School Solutions</h4>
            <ul className="space-y-2">
              <li><Link href="#roles" className="hover:text-white transition-colors">Athletic Directors</Link></li>
              <li><Link href="#roles" className="hover:text-white transition-colors">High School Coaches</Link></li>
              <li><Link href="#roles" className="hover:text-white transition-colors">Athletes & Recruiting</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Department Pricing</Link></li>
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
              <li><a href="mailto:support@scoutvision.live" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}
