"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye, Navigation, Cpu, Network, Info } from "lucide-react";

interface TrackMode {
  id: string;
  name: string;
  description: string;
  icon: any;
  metric: string;
  visualData: {
    players: { x: number; y: number; id: string; role: string; focus?: boolean }[];
    lines: { x1: number; y1: number; x2: number; y2: number; label?: string }[];
    heatmapGlows?: { x: number; y: number; r: number; color: string }[];
  };
}

const trackModes: TrackMode[] = [
  {
    id: "optical",
    name: "Optical Tracking",
    description: "Detect and track player coordinates ($x, y$) in real-time. Automatically assigns a unique tracking index to each athlete.",
    icon: Eye,
    metric: "YOLOv8 Active Detection (60 FPS)",
    visualData: {
      players: [
        { x: 30, y: 35, id: "P-04", role: "DEFENDER" },
        { x: 52, y: 48, id: "P-09", role: "STRIKER", focus: true },
        { x: 75, y: 65, id: "P-10", role: "MIDFIELDER" },
        { x: 22, y: 70, id: "P-02", role: "DEFENDER" },
      ],
      lines: []
    }
  },
  {
    id: "spacing",
    name: "Passing & Spacing Vectors",
    description: "Projects passing routes, triangulation angles, and separation statistics dynamically to highlight spacing discrepancies.",
    icon: Navigation,
    metric: "Coordinate Vector Estimation Models",
    visualData: {
      players: [
        { x: 30, y: 35, id: "P-04", role: "DEFENDER" },
        { x: 52, y: 48, id: "P-09", role: "STRIKER", focus: true },
        { x: 75, y: 65, id: "P-10", role: "MIDFIELDER" },
        { x: 22, y: 70, id: "P-02", role: "DEFENDER" },
      ],
      lines: [
        { x1: 30, y1: 35, x2: 52, y2: 48, label: "Pass Prob: 94%" },
        { x1: 52, y1: 48, x2: 75, y2: 65, label: "Dangerous Path" },
        { x1: 22, y1: 70, x2: 30, y2: 35, label: "Supporting Link" }
      ]
    }
  },
  {
    id: "heatmap",
    name: "Density Heatmaps",
    description: "Generate spatial probability logs highlighting court occupancy density. Tracks areas of maximum pressure during play.",
    icon: Network,
    metric: "Gaussian Density Mapping Models",
    visualData: {
      players: [],
      lines: [],
      heatmapGlows: [
        { x: 35, y: 38, r: 70, color: "rgba(255, 99, 0, 0.4)" },
        { x: 52, y: 48, r: 110, color: "rgba(255, 99, 0, 0.45)" },
        { x: 70, y: 62, r: 85, color: "rgba(255, 99, 0, 0.35)" }
      ]
    }
  }
];

export default function AIAnalytics() {
  const [activeMode, setActiveMode] = useState(0);

  return (
    <section id="ai-analytics" className="py-24 border-t border-neutral-200 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-mono font-bold tracking-widest text-orange-500">
            <Sparkles className="w-3.5 h-3.5" />
            AI PERFORMANCE ENGINE
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mt-4 mb-6 tracking-tight">
            AI Optical Telemetry Tracker
          </h2>
          <p className="text-slate-600 text-lg font-light leading-relaxed">
            Extract high-frequency match insights directly from video recordings. No sensor vests or court chips needed.
          </p>
        </div>

        {/* Feature Interactive Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left panel: Mode Controls */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {trackModes.map((mode, index) => {
              const Icon = mode.icon;
              const isSelected = activeMode === index;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(index)}
                  className={`p-6 rounded border text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-slate-50 border-orange-500 text-orange-500 shadow-sm"
                      : "bg-white border-neutral-200 text-slate-500 hover:text-slate-950 hover:border-slate-350"
                  }`}
                >
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className={`w-10 h-10 rounded flex items-center justify-center border transition-colors ${
                      isSelected ? "bg-orange-500/10 border-orange-500" : "bg-slate-50 border-neutral-200"
                    }`}>
                      <Icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="text-lg font-bold text-neutral-900">{mode.name}</span>
                  </div>

                  <p className="text-slate-600 text-sm font-light leading-relaxed mb-4">
                    {mode.description}
                  </p>

                  <div className="h-px bg-slate-100 mb-3" />
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                    AI Layer: <strong className="text-orange-500 font-bold">{mode.metric}</strong>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right panel: Graphic Interactive Pitch Visualization */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] rounded border border-neutral-200 bg-neutral-900 overflow-hidden p-6 shadow-2xl">
              
              {/* Pitch Outlines */}
              <div className="absolute inset-4 border border-white/10 rounded pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] aspect-square rounded-full border border-white/5" />
                <div className="absolute top-0 bottom-0 left-1/2 border-l border-white/5" />
                <div className="absolute top-1/4 bottom-1/4 left-0 w-[15%] border-y border-r border-white/5" />
                <div className="absolute top-1/4 bottom-1/4 right-0 w-[15%] border-y border-l border-white/5" />
              </div>

              {/* Dynamic Interactive Renderings */}
              <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMode}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    {/* Render Heatmaps */}
                    {trackModes[activeMode].visualData.heatmapGlows?.map((glow, idx) => (
                      <div
                        key={idx}
                        style={{
                          left: `${glow.x}%`,
                          top: `${glow.y}%`,
                          width: `${glow.r}px`,
                          height: `${glow.r}px`,
                          backgroundColor: glow.color,
                          filter: "blur(24px)",
                        }}
                        className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-60 animate-pulse"
                      />
                    ))}

                    {/* Render Vector Lines */}
                    {trackModes[activeMode].visualData.lines.map((line, idx) => (
                      <svg key={idx} className="absolute inset-0 w-full h-full pointer-events-none">
                        <motion.line
                          x1={`${line.x1}%`}
                          y1={`${line.y1}%`}
                          x2={`${line.x2}%`}
                          y2={`${line.y2}%`}
                          stroke="#ff6300"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          initial={{ strokeDashoffset: 100 }}
                          animate={{ strokeDashoffset: 0 }}
                          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        />
                        <text
                          x={`${(line.x1 + line.x2) / 2}%`}
                          y={`${(line.y1 + line.y2) / 2 - 2}%`}
                          fill="#ff6300"
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {line.label}
                        </text>
                      </svg>
                    ))}

                    {/* Render Player Boxes & ID Tracking overlays */}
                    {trackModes[activeMode].visualData.players.map((p, idx) => (
                      <motion.div
                        key={p.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
                        style={{ left: `${p.x}%`, top: `${p.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5"
                      >
                        {/* Player Bounding Box */}
                        <div className={`relative w-9 h-9 border rounded flex items-center justify-center transition-all ${
                          p.focus ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20" : "border-white/20 bg-white/5"
                        }`}>
                          <span className="text-[9px] font-mono font-bold text-white">{p.id}</span>
                          
                          <div className={`absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full flex items-center justify-center text-[7px] font-mono font-bold border ${
                            p.focus ? "bg-orange-500 border-orange-500 text-white" : "bg-neutral-950 border-white/20 text-orange-500"
                          }`}>
                            ●
                          </div>
                        </div>

                        <div className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-white/10 backdrop-blur-md text-[8px] font-mono tracking-widest text-slate-300">
                          {p.role}
                        </div>
                      </motion.div>
                    ))}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Telemetry Detail Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded border border-white/10 bg-slate-950/95 backdrop-blur-md flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-5 h-5 text-orange-500" />
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 block tracking-widest uppercase">
                      Inference Engine Status
                    </span>
                    <span className="text-xs font-bold text-white font-mono">
                      CUDA Core Node Ingestion - Latency: 4.8ms
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-orange-500 font-mono">
                  <Info className="w-3.5 h-3.5" />
                  <span>Real-time Ingest Active</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
