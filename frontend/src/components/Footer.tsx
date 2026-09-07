"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    {
      name: "Twitter",
      href: "#",
      svg: (
        <svg className="w-4 h-4 fill-current animate-pulse hover:text-orange-500" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: "GitHub",
      href: "#",
      svg: (
        <svg className="w-4 h-4 fill-current hover:text-orange-500" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "#",
      svg: (
        <svg className="w-4 h-4 fill-current hover:text-orange-500" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )
    },
    {
      name: "YouTube",
      href: "#",
      svg: (
        <svg className="w-4 h-4 fill-current hover:text-orange-500" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
        
        {/* Brand Segment */}
        <div className="lg:col-span-2 flex flex-col gap-5">
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
          
          <p className="text-sm font-light leading-relaxed max-w-sm">
            ScoutVision is an enterprise Sports Analytics SaaS platform. We deliver real-time tagging, AI-driven player tracking, and robust validation tools to professional coaching teams globally.
          </p>
          <div className="text-xs text-slate-400 space-y-1">
            <div className="text-slate-300">📍 Magarpatta City, Hadapsar, Pune, Maharashtra 411028, India</div>
            <div>✉️ <a href="mailto:contact.scoutvision@gmail.com" className="text-orange-500 hover:underline">contact.scoutvision@gmail.com</a></div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((soc, idx) => {
              return (
                <a
                  key={idx}
                  href={soc.href}
                  className="w-9 h-9 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-900 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all"
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
            <a href="#" className="hover:text-orange-500 transition-colors">About Us</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Careers</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Integrations</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Partners</a>
          </nav>
        </div>

        {/* Resources & Docs */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
            Resources
          </h4>
          <nav className="flex flex-col gap-2.5 text-sm font-light">
            <a href="#" className="hover:text-orange-500 transition-colors">Documentation</a>
            <a href="#" className="hover:text-orange-500 transition-colors">API Schemas</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Tagging Guides</a>
            <a href="#" className="hover:text-orange-500 transition-colors">System Status</a>
          </nav>
        </div>

        {/* Support & Legal */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-mono font-bold tracking-widest text-white uppercase">
            Support & Legal
          </h4>
          <nav className="flex flex-col gap-2.5 text-sm font-light">
            <a href="#" className="hover:text-orange-500 transition-colors">Help Center</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Security Audits</a>
          </nav>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-neutral-900 mb-8" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light">
          <span>
            © {new Date().getFullYear()} ScoutVision Inc. All rights reserved.
          </span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> for elite athletic performance.
          </span>
        </div>
      </div>
    </footer>
  );
}
