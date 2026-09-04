"use client";

import { useState } from "react";
import { Check, BadgeInfo } from "lucide-react";

interface Plan {
  name: string;
  hours: number;
  priceMonthly: number;
  description: string;
  features: string[];
  recommended?: boolean;
}

const plans: Plan[] = [
  {
    name: "Starter Performance",
    hours: 5,
    priceMonthly: 99,
    description: "Ideal for local academies, school teams, and individual sports coaches starting video tagging.",
    features: [
      "5 Hours Video Upload Ingestion / mo",
      "Standard Match Event Tagging Interface",
      "Unified Coach & Analyst Portals access",
      "Exportable tactical PDF reports",
      "720p HLS Video Player playback"
    ]
  },
  {
    name: "Pro Analytics",
    hours: 8,
    priceMonthly: 159,
    description: "Designed for professional clubs and dedicated coaches requiring extensive tactical tracking.",
    features: [
      "8 Hours Video Upload Ingestion / mo",
      "Advanced Roster heatmaps and spatial vectors",
      "QA Portal validation access (2 tickets)",
      "1080p Full HD HLS Streaming playback",
      "Custom tagging hotkey maps config",
      "Priority system ticket support"
    ],
    recommended: true
  },
  {
    name: "Elite Tactical",
    hours: 12,
    priceMonthly: 229,
    description: "Engineered for elite clubs requiring top-tier AI automated telemetry tracking metrics.",
    features: [
      "12 Hours Video Upload Ingestion / mo",
      "AI-Powered Auto-Tagging pipeline",
      "Unlimited QA Portal access & logs",
      "Expected goals (xG) projections",
      "Team Lead Portal org settings & SSO logs",
      "Dedicated Slack support channel"
    ]
  },
  {
    name: "Enterprise Roster",
    hours: 20,
    priceMonthly: 349,
    description: "For leagues and organizations requiring high-volume uploads and customized settings.",
    features: [
      "20 Hours Video Upload Ingestion / mo",
      "Custom YOLO model endpoints",
      "Dedicated Multi-AZ Database instance",
      "Unified SAML/SSO directory integrations",
      "Custom SLA & Priority QA validation queue",
      "Direct API integrations access"
    ]
  }
];

export default function MembershipPlans() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 border-t border-neutral-200 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            MEMBERSHIP PLANS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mt-3 mb-6 tracking-tight">
            Predictable Pricing for Elite Teams
          </h2>
          <p className="text-slate-600 text-lg font-light leading-relaxed">
            Select the monthly match processing allocation that fits your coaching schedule. 
            No hidden fees. Switch tiers anytime.
          </p>

          {/* Toggle for billing frequency */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm ${!isAnnual ? "text-neutral-950 font-semibold" : "text-slate-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 rounded-full bg-slate-200 border border-slate-350 p-1 flex items-center relative transition-colors cursor-pointer"
              aria-label="Toggle Billing Frequency"
            >
              <div
                className={`w-5.5 h-5.5 rounded-full bg-orange-500 shadow transform transition-transform duration-300 ${
                  isAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm flex items-center gap-1.5 ${isAnnual ? "text-neutral-950 font-semibold" : "text-slate-500"}`}>
              Annual
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-mono font-bold">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const monthlyPrice = isAnnual ? plan.priceMonthly * 0.8 : plan.priceMonthly;
            return (
              <div
                key={plan.name}
                className={`relative rounded p-6 border flex flex-col justify-between transition-all duration-300 ${
                  plan.recommended
                    ? "bg-white border-orange-500 shadow-xl scale-105 z-10"
                    : "bg-white border-neutral-200 hover:border-slate-350 shadow-sm"
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded bg-orange-500 text-white text-[9px] font-mono font-bold tracking-widest uppercase">
                    RECOMMENDED
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    {plan.name}
                  </h3>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-xs font-mono font-bold text-orange-600 mb-4">
                    {plan.hours} Ingest Hours / mo
                  </div>

                  <p className="text-slate-500 text-xs font-light leading-relaxed mb-6 min-h-[48px]">
                    {plan.description}
                  </p>

                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-neutral-900 font-mono">
                      ${Math.floor(monthlyPrice)}
                    </span>
                    <span className="text-sm text-slate-500 font-light">
                      / mo
                    </span>
                  </div>

                  <div className="h-px bg-slate-100 mb-6" />

                  <ul className="flex flex-col gap-3">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4.5 h-4.5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-600 font-light leading-snug">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <a
                    href="#contact"
                    className={`block text-center py-3 rounded text-xs font-bold transition-all duration-300 ${
                      plan.recommended
                        ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md"
                        : "bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-700"
                    }`}
                  >
                    Start Free Trial
                  </a>
                  
                  <div className="flex items-center gap-1 mt-3 justify-center text-[9px] text-slate-500">
                    <BadgeInfo className="w-3.5 h-3.5" />
                    <span>Cancel or switch anytime</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
