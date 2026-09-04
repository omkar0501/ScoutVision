"use client";

import { motion } from "framer-motion";
import { CircleDot, Target, Zap, TrendingUp, Sparkles } from "lucide-react";

interface SportCard {
  name: string;
  image: string;
  icon: any;
  metric: string;
  metricLabel: string;
  accent: string;
  features: string[];
}

const sports: SportCard[] = [
  {
    name: "Soccer",
    image: "/soccer_field.jpg",
    icon: CircleDot,
    metric: "60 FPS Ingestion",
    metricLabel: "Video Tag Velocity",
    accent: "border-neutral-200 text-orange-500 hover:border-orange-500/50 shadow-sm",
    features: [
      "Expected goals (xG) projections",
      "Pass route network vectors",
      "Dynamic field heatmaps",
      "Team defensive block spacing"
    ]
  },
  {
    name: "Basketball",
    image: "/basketball_court.jpg",
    icon: Target,
    metric: "0.1m Accuracy",
    metricLabel: "Spatial Spacing Resolution",
    accent: "border-neutral-200 text-orange-500 hover:border-orange-500/50 shadow-sm",
    features: [
      "Optimal shot pocket zones",
      "Pick & Roll speed logs",
      "Defensive close-out telemetry",
      "Lineup efficiency indexes"
    ]
  },
  {
    name: "Football",
    image: "/football_field.jpg",
    icon: Zap,
    metric: "98.4% Accuracy",
    metricLabel: "AI Route Verification",
    accent: "border-neutral-200 text-orange-500 hover:border-orange-500/50 shadow-sm",
    features: [
      "Receiver separation vectors",
      "Pass pocket duration clocks",
      "Roster defensive route mappings",
      "Kick distance trajectories"
    ]
  },
  {
    name: "Volleyball",
    image: "/volleyball_court.jpg",
    icon: TrendingUp,
    metric: "120 FPS Capture",
    metricLabel: "Spike Angle Indexing",
    accent: "border-neutral-200 text-orange-500 hover:border-orange-500/50 shadow-sm",
    features: [
      "Server angle projections",
      "Set-to-spike trajectory lines",
      "Rotation coverage overlays",
      "Receive quality analytics"
    ]
  }
];

export default function SportsSupported() {
  return (
    <section id="sports" className="py-24 border-t border-neutral-200 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            MULTI-SPORT PLATFORM
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mt-3 mb-6 tracking-tight">
            Engineered for Elite Disciplines
          </h2>
          <p className="text-slate-600 text-lg font-light leading-relaxed">
            ScoutVision delivers custom analytics panels engineered to fit the unique tactical rules of the major team sports.
          </p>
        </div>

        {/* Sports Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sports.map((sport, index) => {
            const Icon = sport.icon;
            return (
              <motion.div
                key={sport.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group rounded border bg-white transition-all duration-300 overflow-hidden flex flex-col ${sport.accent}`}
              >
                {/* Background Image Layer */}
                <div className="relative h-44 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-103 transition-transform duration-500"
                    style={{ backgroundImage: `url(${sport.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  
                  {/* Dynamic overlay label */}
                  <div className="absolute top-4 left-4 p-2 rounded bg-neutral-950/80 border border-white/5 backdrop-blur-md text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Card Content Segment */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-orange-500 transition-colors">
                      {sport.name}
                    </h3>
                    
                    {/* Performance Metric Row */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono text-slate-500 block tracking-widest uppercase mb-0.5">
                        {sport.metricLabel}
                      </span>
                      <span className="text-base font-bold text-neutral-950 font-mono flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                        {sport.metric}
                      </span>
                    </div>

                    <div className="h-px bg-slate-100 mb-4" />

                    <ul className="flex flex-col gap-2.5">
                      {sport.features.map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs text-slate-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50" />
                          <span className="font-light">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                    <span className="text-xs font-mono font-semibold tracking-wider text-orange-500 group-hover:translate-x-1 transition-transform cursor-pointer">
                      Explore Dashboard →
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
