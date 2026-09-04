"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, UserCheck, Video, CheckCircle, Settings, Users, Database } from "lucide-react";

interface Portal {
  id: string;
  name: string;
  icon: any;
  roleDescription: string;
  features: string[];
  mockWidget: {
    title: string;
    details: { label: string; value: string; trend?: string }[];
    visualType: "chart" | "tags" | "logs" | "gauge";
  };
}

const portals: Portal[] = [
  {
    id: "coach",
    name: "Coach Portal",
    icon: UserCheck,
    roleDescription: "Oversee tactical blueprints, analyze overall team progression, and deliver shareable coaching clips straight to the rosters.",
    features: [
      "Access tactical radar dashboards",
      "Draft and send custom video clips directly to players",
      "Oversee expected goals (xG) metrics and squad fatigue levels",
      "Deploy custom defensive spacing instructions"
    ],
    mockWidget: {
      title: "Coach Roster Analysis",
      details: [
        { label: "Squad Tactical Execution", value: "88%", trend: "+3.2%" },
        { label: "Optimal Formation Fit", value: "4-3-3 Attacking" },
        { label: "Pending Tactical Shares", value: "3 Clips Active" }
      ],
      visualType: "chart"
    }
  },
  {
    id: "teamlead",
    name: "Team Lead Portal",
    icon: Users,
    roleDescription: "Manage organizational parameters, assign roster lists, manage analyst tasks, and review historical performance archives.",
    features: [
      "Control organization billing models and subscription licenses",
      "Assign roster lists and manage coach credentials",
      "Review tactical analytics reports across the entire club",
      "Analyze analyst workload efficiency and timelines"
    ],
    mockWidget: {
      title: "Club Resource Operations",
      details: [
        { label: "Active Coaches / Rosters", value: "14 / 320" },
        { label: "Platform Usage Index", value: "92.4%" },
        { label: "Monthly Analytics Cost", value: "$420.00" }
      ],
      visualType: "gauge"
    }
  },
  {
    id: "analyst",
    name: "Analyst Portal",
    icon: Video,
    roleDescription: "Process high-speed match video, tag event timelines, map player coordinates, and run complex tactical tagging patterns.",
    features: [
      "Configure fast custom hotkey tagging arrays",
      "Trace spatial coordinate tags ($x$, $y$) on live streams",
      "Integrate automated camera frame tracking logs",
      "Process offline uploads with automatic HLS segmenting"
    ],
    mockWidget: {
      title: "Timeline Tagging Queue",
      details: [
        { label: "Pass Timeline Tags", value: "412 Tags Generated" },
        { label: "Average Time / Tag", value: "1.2 seconds" },
        { label: "Pending Uploads Queue", value: "1 Match Processing" }
      ],
      visualType: "tags"
    }
  },
  {
    id: "qa",
    name: "QA Portal",
    icon: ShieldCheck,
    roleDescription: "Validate AI-tagged events against human inputs, review discrepancies, and issue performance certification audits.",
    features: [
      "Verify coordinate tags accuracy against optical tracking telemetry",
      "Manage discrepancy queues and validation workflows",
      "Publish verified data directly to the clickhouse stats db",
      "Review AI tag discrepancies with side-by-side video views"
    ],
    mockWidget: {
      title: "QA Discrepancy Audits",
      details: [
        { label: "Total Open Discrepancies", value: "2 Claims Pending" },
        { label: "Audited Matches (Today)", value: "8 Matches Verified" },
        { label: "Error Frequency Index", value: "0.2%" }
      ],
      visualType: "logs"
    }
  },
  {
    id: "admin",
    name: "Admin Portal",
    icon: Settings,
    roleDescription: "Monitor system health metrics, manage global data pipelines, configure microservices, and review access control logs.",
    features: [
      "Track container clusters and CPU/GPU load limits",
      "Deploy custom AI model configuration endpoints",
      "Audit API activity logs across all system tenants",
      "Manage global schema changes and data updates"
    ],
    mockWidget: {
      title: "System Microservices Load",
      details: [
        { label: "EKS Cluster Node Status", value: "Active (99.98% uptime)" },
        { label: "API Gateway Traffic Rate", value: "1.2k req/sec" },
        { label: "Database Connection Pool", value: "84/1000 open" }
      ],
      visualType: "logs"
    }
  }
];

export default function Solutions() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="solutions" className="py-24 border-t border-neutral-200 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            ENTERPRISE PORTALS
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mt-3 mb-6 tracking-tight">
            Role-Based Solutions for Roster Success
          </h2>
          <p className="text-slate-600 text-lg font-light leading-relaxed">
            ScoutVision provides dedicated workspace interfaces tailored to every contributor in your team.
            Each portal leverages customized access boundaries.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {portals.map((portal, idx) => {
            const Icon = portal.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={portal.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-lg border text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-orange-500/10 border-orange-500 text-orange-500 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {portal.name}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left panel: features list */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                    {(() => {
                      const ActiveIcon = portals[activeTab].icon;
                      return <ActiveIcon className="w-6 h-6 text-orange-500" />;
                    })()}
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900">
                    {portals[activeTab].name}
                  </h3>
                </div>

                <p className="text-slate-600 leading-relaxed font-light text-base md:text-lg">
                  {portals[activeTab].roleDescription}
                </p>

                <div className="h-px bg-slate-200 my-2" />

                <ul className="flex flex-col gap-3.5">
                  {portals[activeTab].features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-slate-700 font-light">{feat}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right panel: Portal Interface mockup preview */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg p-6 rounded border border-neutral-200 bg-slate-50 relative overflow-hidden"
              >
                {/* Header of mockup */}
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    LIVE PREVIEW
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-slate-700 mb-6 flex items-center gap-2">
                  <Database className="w-4 h-4 text-orange-500" />
                  {portals[activeTab].mockWidget.title}
                </h4>

                {/* Displaying mockup data based on visualType */}
                <div className="flex flex-col gap-4">
                  {portals[activeTab].mockWidget.details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded border border-neutral-200 bg-white flex items-center justify-between"
                    >
                      <span className="text-sm text-slate-500">{detail.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-900 font-mono">{detail.value}</span>
                        {detail.trend && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-mono font-bold">
                            {detail.trend}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mockup graphical element at the bottom */}
                {portals[activeTab].mockWidget.visualType === "chart" && (
                  <div className="mt-6 p-4 rounded border border-neutral-200 bg-neutral-900/5 h-28 flex items-end justify-between gap-1">
                    {[35, 45, 60, 48, 70, 85, 90].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          style={{ height: `${h}%` }}
                          className="w-full rounded-t bg-orange-500 relative"
                        />
                        <span className="text-[9px] text-slate-500 font-mono mt-2">P{i + 1}</span>
                      </div>
                    ))}
                  </div>
                )}

                {portals[activeTab].mockWidget.visualType === "tags" && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["PASS", "SHOT (GOAL)", "CORNER", "FOUL", "CROSS", "KEY PASS", "TACTICAL SHIFT"].map((t, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2.5 py-1 rounded border font-mono ${
                          idx === 1
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                            : "bg-white border-neutral-200 text-slate-600"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {portals[activeTab].mockWidget.visualType === "logs" && (
                  <div className="mt-6 p-3 rounded border border-neutral-200 bg-white font-mono text-[10px] text-slate-600 flex flex-col gap-1.5 max-h-28 overflow-y-auto">
                    <div>[16:21:04] Fetching EKS cluster active instances...</div>
                    <div className="text-orange-500">[16:21:05] ClickHouse ingest thread OK.</div>
                    <div className="text-emerald-600">[16:21:08] Database sync completed. 0 warnings.</div>
                  </div>
                )}

                {portals[activeTab].mockWidget.visualType === "gauge" && (
                  <div className="mt-6 flex items-center justify-center p-4 rounded border border-neutral-200 bg-white">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="32" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="#ff6300"
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray="200"
                          strokeDashoffset="35"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xs font-bold text-neutral-900 font-mono">92%</span>
                    </div>
                    <span className="text-xs text-slate-500 max-w-[180px] ml-4 leading-relaxed font-light">
                      Billing tier tracking: limits reset in 12 days. Data limits fully monitored.
                    </span>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
