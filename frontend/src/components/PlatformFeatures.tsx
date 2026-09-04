"use client";

import { motion } from "framer-motion";
import { Monitor, Video, ShieldCheck, Sparkles, Clock, Users2 } from "lucide-react";

interface ProductFeature {
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  metric: string;
  href: string;
}

const productFeatures: ProductFeature[] = [
  {
    title: "ScoutVision Focus",
    subtitle: "AUTONOMOUS CAPTURE",
    description: "Install smart 4K cameras directly in your gym or stadium. Focus detects play starts, follows the ball, and uploads HLS segments automatically.",
    icon: Monitor,
    metric: "4K Panoramic Auto-Tracking",
    href: "#features"
  },
  {
    title: "ScoutVision Analyst",
    subtitle: "VIDEO ANALYSIS WORKSPACE",
    description: "Deconstruct play-by-play timelines. Build playlist clips, assign player tracking IDs, draw vector routes, and log tags via custom keyboard keymaps.",
    icon: Video,
    metric: "Custom Hotkeys Mapping Engine",
    href: "#features"
  },
  {
    title: "ScoutVision Assist",
    subtitle: "QA DATA SERVICE",
    description: "Outsource match tagging to our certified QA Specialists. Receive verified down, distance, gain, and spatial coordinate logs back in under 12 hours.",
    icon: ShieldCheck,
    metric: "Certified QA Discrepancy Audits",
    href: "#features"
  },
  {
    title: "ScoutVision Recruit",
    subtitle: "HIGHLIGHT REELS & PROFILES",
    description: "Help athletes get discovered. Compile tactical play clips, build physical stats radar charts, and share recruiting dossiers with college coaches.",
    icon: Sparkles,
    metric: "Scouting Profile Share Links",
    href: "#features"
  },
  {
    title: "Live Tag Sync",
    subtitle: "WEBSOCKETS FEED",
    description: "Synchronize tactical tagging logs in real-time across multiple analyst screens. Broadcast live coordinate charts via websocket feeds.",
    icon: Clock,
    metric: "Low-Latency WebSocket Mesh",
    href: "#features"
  },
  {
    title: "Enterprise SSO Directory",
    subtitle: "ACCESS CONTROL",
    description: "Manage organizational budgets and credential permissions. Protect database schematics using OIDC SAML 2.0 (Okta, Azure AD) integrations.",
    icon: Users2,
    metric: "Role-Based Directory (Okta)",
    href: "#features"
  }
];

export default function PlatformFeatures() {
  return (
    <section id="features" className="py-24 border-t border-neutral-200 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            PRODUCT SUITE
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mt-3 mb-6 tracking-tight">
            The Complete Sports Analytics Ecosystem
          </h2>
          <p className="text-slate-600 text-lg font-light leading-relaxed">
            From smart panoramic cameras to professional QA tagging services, ScoutVision offers everything you need to win at every level.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productFeatures.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group p-6 rounded border border-neutral-200 hover:border-orange-500/50 bg-slate-55/40 hover:bg-white transition-all duration-300 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-orange-500 font-bold block mb-1">
                    {feat.subtitle}
                  </span>
                  
                  {/* Icon Block */}
                  <div className="w-12 h-12 rounded bg-orange-500/10 border border-orange-500/20 group-hover:border-orange-500/40 flex items-center justify-center mb-6 transition-colors">
                    <Icon className="w-5 h-5 text-orange-500" />
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 mb-3 group-hover:text-orange-500 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed font-light mb-6">
                    {feat.description}
                  </p>
                </div>

                <div>
                  <div className="h-px bg-slate-100 mb-4" />
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">
                      Technology
                    </span>
                    <span className="text-[10px] font-mono text-orange-500 font-bold">
                      {feat.metric}
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
