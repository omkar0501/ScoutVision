"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import ScoutVisionLogo from "@/components/ScoutVisionLogo";

export default function Footer() {
  const socialLinks = [
    {
      name: "Twitter",
      href: "https://x.com/ScoutVision",
      svg: (
        <svg className="w-4 h-4 fill-current hover:text-[#ff6300]" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: "GitHub",
      href: "https://github.com/ScoutVision",
      svg: (
        <svg className="w-4 h-4 fill-current hover:text-[#ff6300]" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/scoutvision-technology",
      svg: (
        <svg className="w-4 h-4 fill-current hover:text-[#ff6300]" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@ScoutVision",
      svg: (
        <svg className="w-4 h-4 fill-current hover:text-[#ff6300]" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-[#14191d] border-t border-neutral-800 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
        
        {/* Brand Segment */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Link href="/" className="flex items-center gap-2 group">
            <ScoutVisionLogo iconSize={36} />
          </Link>
          
          <p className="text-sm font-light leading-relaxed max-w-sm text-slate-300">
            ScoutVision is an enterprise Sports Analytics SaaS platform. We deliver real-time tagging, AI-driven player tracking, and robust validation tools to coaching teams and athletic departments globally.
          </p>
          <div className="text-xs text-slate-400 space-y-1">
            <div className="text-slate-300">📍 Magarpatta City, Hadapsar, Pune, Maharashtra 411028, India</div>
            <div>✉️ <a href="mailto:contact.scoutvision@gmail.com" className="text-[#ff6300] hover:underline">contact.scoutvision@gmail.com</a></div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((soc, idx) => {
              return (
                <a
                  key={idx}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-900 flex items-center justify-center text-slate-400 hover:text-[#ff6300] transition-all"
                  aria-label={soc.name}
                >
                  {soc.svg}
                </a>
              );
            })}
          </div>
        </div>

        {/* Company Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
            Company
          </h4>
          <nav className="flex flex-col gap-2.5 text-sm font-light">
            <Link href="/about" className="hover:text-[#ff6300] transition-colors">About Us</Link>
            <Link href="/careers" className="hover:text-[#ff6300] transition-colors">Careers & Jobs</Link>
            <Link href="/solutions/high-school" className="hover:text-[#ff6300] transition-colors">High School</Link>
            <Link href="/solutions/club" className="hover:text-[#ff6300] transition-colors">Club Volleyball</Link>
          </nav>
        </div>

        {/* Products & Resources */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
            Products
          </h4>
          <nav className="flex flex-col gap-2.5 text-sm font-light">
            <Link href="/products/volleymetrics" className="hover:text-[#ff6300] transition-colors">Volleymetrics Pro</Link>
            <Link href="/products/focus" className="hover:text-[#ff6300] transition-colors">Focus Smart Camera</Link>
            <Link href="/products/assist" className="hover:text-[#ff6300] transition-colors">ScoutVision Assist</Link>
            <Link href="/products/analyst" className="hover:text-[#ff6300] transition-colors">ScoutVision Analyst</Link>
            <Link href="/dashboard" className="hover:text-[#ff6300] transition-colors">Live Dashboard</Link>
          </nav>
        </div>

        {/* Support & Legal */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
            Support & Legal
          </h4>
          <nav className="flex flex-col gap-2.5 text-sm font-light">
            <Link href="/contact" className="hover:text-[#ff6300] transition-colors">Contact Support</Link>
            <Link href="/privacy" className="hover:text-[#ff6300] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#ff6300] transition-colors">Terms of Service</Link>
            <Link href="/privacy#security" className="hover:text-[#ff6300] transition-colors">Security Overview</Link>
          </nav>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-neutral-900 mb-8" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light">
          <span>
            © {new Date().getFullYear()} ScoutVision Technologies, Inc. All rights reserved.
          </span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-[#ff6300] fill-[#ff6300]" /> for elite athletic performance.
          </span>
        </div>
      </div>
    </footer>
  );
}
