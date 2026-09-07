"use client";

import { useState } from "react";
import Link from "next/link";
import ScoutVisionLogo from "@/components/ScoutVisionLogo";
import ContactModal from "@/components/ContactModal";
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Eye, 
  CheckCircle2, 
  Cookie, 
  Scale, 
  Building, 
  Mail,
  Heart
} from "lucide-react";

export default function PrivacyPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#191f24] text-white font-sans antialiased">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#191F24]/95 backdrop-blur-md border-b border-neutral-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between w-full min-h-[58px]">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <ScoutVisionLogo iconSize={40} />
            </Link>
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
              <Link href="/privacy" className="text-[#ff6300] py-1 border-b-2 border-[#ff6300]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/careers" className="hover:text-white transition-colors">
                Careers
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-[#009ce3] hover:bg-[#0082b2] text-white text-xs font-bold rounded-sm transition-all"
            >
              Log In
            </Link>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-4 py-2 bg-[#ff6300] hover:bg-[#e05700] text-white text-xs font-bold rounded-sm transition-all shadow"
            >
              Contact Privacy Team
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 mt-[58px] py-16">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Header Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6300]/10 border border-[#ff6300]/30 text-[#ff6300] text-xs font-semibold w-fit mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Legal Document</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            ScoutVision Privacy Policy
          </h1>
          
          <div className="text-xs text-slate-400 font-mono mb-8 pb-6 border-b border-neutral-800 flex flex-wrap items-center gap-4">
            <span>Last Updated: January 15, 2026</span>
            <span>•</span>
            <span>Effective: Immediate</span>
            <span>•</span>
            <span>Version 3.2</span>
          </div>

          {/* Quick Notice Card */}
          <div className="p-5 rounded-lg bg-[#14181c] border border-neutral-800 mb-12 flex items-start gap-4">
            <Lock className="w-5 h-5 text-[#ff6300] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-1">Our Fundamental Privacy Commitment:</strong>
              ScoutVision Technologies, Inc. does not sell, rent, or monetize student-athlete personal data or private game film. Teams, schools, and federations retain 100% ownership of their video and statistical content.
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-12 text-sm text-slate-300 leading-relaxed font-light">
            
            {/* Section 1 */}
            <section id="overview" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#ff6300] font-mono">1.</span> Overview and Scope
              </h2>
              <p>
                This Privacy Policy describes how ScoutVision Technologies, Inc. ("ScoutVision", "we", "us", or "our") collects, uses, protects, and discloses information gathered through our sports analytics web platform, ScoutVision Focus smart cameras, mobile applications, and breakdown tagging services (collectively, the "Service").
              </p>
              <p className="mt-3">
                This policy applies to coaches, athletic directors, student-athletes, professional players, performance analysts, and school administrators who use our platform globally.
              </p>
            </section>

            {/* Section 2 */}
            <section id="student-data" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#ff6300] font-mono">2.</span> Student-Athlete & Youth Privacy (FERPA & COPPA)
              </h2>
              <p>
                We recognize the sensitive nature of student records and youth athlete information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3 text-slate-400 text-xs">
                <li>
                  <strong className="text-white">FERPA Compliance:</strong> When providing services to educational institutions, ScoutVision acts as an authorized "school official" with legitimate educational interests under the Family Educational Rights and Privacy Act (FERPA).
                </li>
                <li>
                  <strong className="text-white">COPPA Compliance:</strong> For athletes under the age of 13, accounts must be created and supervised by authorized school officials, club directors, or verified parents/guardians in accordance with COPPA.
                </li>
                <li>
                  <strong className="text-white">No Commercial Exploitation:</strong> Student-athlete biometric telemetry, roster numbers, and academic notes are never used for third-party behavioral advertising.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="video-ownership" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#ff6300] font-mono">3.</span> Match Video Ownership & Intellectual Property
              </h2>
              <p>
                You retain complete and exclusive ownership over all match footage, practice recordings, drill sessions, and proprietary coach voice memos uploaded to ScoutVision.
              </p>
              <p className="mt-3">
                ScoutVision is granted only a limited, non-exclusive license strictly necessary to store, transcode, tag, and deliver the footage back to your team or authorized league exchange partners pursuant to your athletic department settings.
              </p>
            </section>

            {/* Section 4 */}
            <section id="security" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#ff6300] font-mono">4.</span> Security Infrastructure & Data Protection
              </h2>
              <p>
                We implement enterprise-grade technical and organizational safeguards:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
                <div className="p-4 rounded bg-[#14181c] border border-neutral-800">
                  <span className="font-bold text-white block mb-1">Encryption In-Transit</span>
                  <span className="text-slate-400">All data transferred between client browsers, Focus cameras, and cloud servers is secured via TLS 1.3 with SHA-256 certificates.</span>
                </div>
                <div className="p-4 rounded bg-[#14181c] border border-neutral-800">
                  <span className="font-bold text-white block mb-1">Encryption At-Rest</span>
                  <span className="text-slate-400">Video storage buckets and PostgreSQL match databases are encrypted using AES-256 standard.</span>
                </div>
                <div className="p-4 rounded bg-[#14181c] border border-neutral-800">
                  <span className="font-bold text-white block mb-1">Role-Based Access Control</span>
                  <span className="text-slate-400">Strict organizational boundaries prevent unauthorized coaches or opposing clubs from accessing your private practice footage.</span>
                </div>
                <div className="p-4 rounded bg-[#14181c] border border-neutral-800">
                  <span className="font-bold text-white block mb-1">Regular Security Audits</span>
                  <span className="text-slate-400">Periodic vulnerability scans and penetration testing to ensure defense-in-depth across our cloud cluster.</span>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="cookies" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#ff6300] font-mono">5.</span> Cookies & Tracking Technologies
              </h2>
              <p>
                We use strictly necessary cookies to maintain user authentication sessions and prevent CSRF attacks. Performance cookies help us monitor server load times and optimize video player buffering.
              </p>
              <p className="mt-3">
                You may configure your browser to reject cookies, though certain interactive features such as live tagging code windows may require session cookies to function properly.
              </p>
            </section>

            {/* Section 6 */}
            <section id="california" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#ff6300] font-mono">6.</span> California Consumer Privacy Act (CCPA) - Do Not Sell My Info
              </h2>
              <p>
                Under the California Consumer Privacy Act (CCPA), California residents have the right to know what personal information is collected, request its deletion, and opt out of any sale of personal information.
              </p>
              <div className="p-4 rounded bg-[#14181c] border border-neutral-800 mt-3 text-xs">
                <strong className="text-[#ff6300] block mb-1">Explicit Statement:</strong>
                ScoutVision does NOT sell personal information or athlete telemetry to data brokers or advertisers. To exercise your rights of access, correction, or deletion, email us at <a href="mailto:contact.scoutvision@gmail.com" className="text-[#ff6300] hover:underline">contact.scoutvision@gmail.com</a>.
              </div>
            </section>

            {/* Section 7 */}
            <section id="contact-info" className="scroll-mt-24 pt-6 border-t border-neutral-800">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#ff6300] font-mono">7.</span> Data Protection Officer & Headquarters
              </h2>
              <p>
                If you have questions, inquiries, or requests regarding this Privacy Policy or our security protocols, please contact our Data Protection Officer:
              </p>
              <div className="p-5 rounded-lg bg-[#14181c] border border-neutral-800 mt-4 space-y-2 text-xs">
                <div className="text-white font-bold">ScoutVision Technologies, Inc.</div>
                <div className="text-slate-300">📍 Headquarters: Magarpatta City, Hadapsar, Pune, Maharashtra 411028, India</div>
                <div className="text-slate-300">✉️ Privacy Inquiries: <a href="mailto:contact.scoutvision@gmail.com" className="text-[#ff6300] hover:underline">contact.scoutvision@gmail.com</a></div>
                <div className="text-slate-400">Response SLA: Within 48 business hours.</div>
              </div>
            </section>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#14191d] border-t border-neutral-800 py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <ScoutVisionLogo iconSize={36} />
            <p className="text-slate-400 leading-relaxed">
              Enterprise sports video intelligence and secure analytics platform.
            </p>
            <div className="text-slate-300">
              📍 Magarpatta City, Hadapsar, Pune, Maharashtra 411028, India
            </div>
            <div>
              ✉️ <a href="mailto:contact.scoutvision@gmail.com" className="text-[#ff6300] hover:underline">contact.scoutvision@gmail.com</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Legal & Trust</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-[#ff6300] font-medium">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy#security" className="hover:text-white transition-colors">Security Overview</Link></li>
              <li><Link href="/privacy#california" className="hover:text-white transition-colors">Do Not Sell My Info</Link></li>
              <li><Link href="/privacy#cookies" className="hover:text-white transition-colors">Cookies Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Products</h4>
            <ul className="space-y-2">
              <li><Link href="/products/volleymetrics" className="hover:text-white transition-colors">Volleymetrics Pro</Link></li>
              <li><Link href="/products/focus" className="hover:text-white transition-colors">Focus Smart Camera</Link></li>
              <li><Link href="/products/assist" className="hover:text-white transition-colors">ScoutVision Assist</Link></li>
              <li><Link href="/products/analyst" className="hover:text-white transition-colors">ScoutVision Analyst</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Live Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">Careers & Jobs</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="/solutions/high-school" className="hover:text-white transition-colors">High School</Link></li>
              <li><Link href="/solutions/club" className="hover:text-white transition-colors">Club Volleyball</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} ScoutVision Technologies, Inc. All rights reserved.</div>
          <div className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> for elite athletic performance.
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
}
