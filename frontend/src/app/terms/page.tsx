"use client";

import { useState } from "react";
import Link from "next/link";
import ScoutVisionLogo from "@/components/ScoutVisionLogo";
import ContactModal from "@/components/ContactModal";
import { 
  FileText, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Building, 
  Mail,
  Heart
} from "lucide-react";

export default function TermsPage() {
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
              <Link href="/terms" className="text-[#ff6300] py-1 border-b-2 border-[#ff6300]">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
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
              Contact Legal
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 mt-[58px] py-16">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6300]/10 border border-[#ff6300]/30 text-[#ff6300] text-xs font-semibold w-fit mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Master Services Agreement</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            ScoutVision Terms of Service
          </h1>
          
          <div className="text-xs text-slate-400 font-mono mb-8 pb-6 border-b border-neutral-800 flex flex-wrap items-center gap-4">
            <span>Last Updated: January 15, 2026</span>
            <span>•</span>
            <span>Effective Date: Immediate</span>
            <span>•</span>
            <span>Version 2.8</span>
          </div>

          <div className="space-y-12 text-sm text-slate-300 leading-relaxed font-light">
            
            {/* 1. Acceptance */}
            <section id="acceptance" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#ff6300] font-mono">1.</span> Acceptance of Terms
              </h2>
              <p>
                By creating an account, accessing, or subscribing to ScoutVision web services, ScoutVision Focus hardware, or ScoutVision Assist breakdown services (the "Services"), you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a high school, university athletic department, club, or professional federation, you represent that you have the legal authority to bind that entity.
              </p>
            </section>

            {/* 2. Software License */}
            <section id="license" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#ff6300] font-mono">2.</span> Software License Agreement
              </h2>
              <p>
                Subject to timely payment of subscription fees, ScoutVision grants you a non-exclusive, non-transferable, revocable license to use the ScoutVision SaaS platform and associated desktop applications during the subscription term for internal team preparation, player development, and league exchange operations.
              </p>
              <p className="mt-3">
                You may not reverse engineer, decompile, or attempt to extract the source code or proprietary neural tracking models of the ScoutVision Focus cameras or analytical engine.
              </p>
            </section>

            {/* 3. Team Content & Ownership */}
            <section id="content-ownership" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#ff6300] font-mono">3.</span> Team Video Content & Ownership
              </h2>
              <p>
                All match video footage, training sessions, tactical telestration, and coach voice notes uploaded to your account remain your sole and exclusive property. ScoutVision does not claim ownership over any video content provided by your institution.
              </p>
              <p className="mt-3">
                You represent and warrant that you possess all necessary permissions, including athlete image consents, to capture and upload team video to the platform.
              </p>
            </section>

            {/* 4. SLA & Uptime */}
            <section id="sla" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#ff6300] font-mono">4.</span> Service Level Agreement (SLA) & Uptime
              </h2>
              <div className="p-4 rounded bg-[#14181c] border border-neutral-800 text-xs text-slate-300">
                <strong className="text-white block mb-1">99.9% Cloud Availability Guarantee:</strong>
                ScoutVision strives to maintain 99.9% uptime for cloud video streaming and analytics dashboards. Scheduled maintenance is conducted during low-traffic off-peak hours with advance notification posted to our status channel.
              </div>
            </section>

            {/* 5. Subscriptions & Billing */}
            <section id="billing" className="scroll-mt-24">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#ff6300] font-mono">5.</span> Subscriptions, Invoicing & Renewals
              </h2>
              <p>
                Subscriptions are billed on an annual season or multi-year athletic department contract basis. Official purchase orders from accredited schools and universities are accepted with Net-30 payment terms.
              </p>
              <p className="mt-3">
                Invoices may be settled via bank wire, ACH, or credit card. Inquiries regarding invoices can be addressed to our finance team at <a href="mailto:contact.scoutvision@gmail.com" className="text-[#ff6300] hover:underline">contact.scoutvision@gmail.com</a>.
              </p>
            </section>

            {/* 6. Jurisdiction */}
            <section id="disputes" className="scroll-mt-24 pt-6 border-t border-neutral-800">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-[#ff6300] font-mono">6.</span> Governing Law & Legal Contact
              </h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of India. Any disputes arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts in Pune, Maharashtra, India.
              </p>
              <div className="p-5 rounded-lg bg-[#14181c] border border-neutral-800 mt-4 space-y-2 text-xs">
                <div className="text-white font-bold">ScoutVision Technologies, Inc. Legal Department</div>
                <div className="text-slate-300">📍 Magarpatta City, Hadapsar, Pune, Maharashtra 411028, India</div>
                <div className="text-slate-300">✉️ Legal Inquiries: <a href="mailto:contact.scoutvision@gmail.com" className="text-[#ff6300] hover:underline">contact.scoutvision@gmail.com</a></div>
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
              Enterprise sports video intelligence and performance analytics platform.
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
              <li><Link href="/terms" className="text-[#ff6300] font-medium">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms#license" className="hover:text-white transition-colors">License Agreement</Link></li>
              <li><Link href="/terms#sla" className="hover:text-white transition-colors">Uptime SLA</Link></li>
              <li><Link href="/terms#billing" className="hover:text-white transition-colors">Billing & Invoicing</Link></li>
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
