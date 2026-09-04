"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  club: string;
  avatarLetter: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote: "ScoutVision has completely redefined our analytical cadence. The ability to upload match footage and have players isolated with telemetry coordinates within minutes is a huge edge. The QA validation queue guarantees that our final reports contain zero errors.",
    name: "Marcus Vance",
    role: "Lead Performance Analyst",
    club: "London FC Academy",
    avatarLetter: "M",
    rating: 5
  },
  {
    quote: "As a D1 coach, I require rapid, detailed tactical tools. ScoutVision lets my analysts tag play outcomes in real-time, allowing me to review shot probability trajectories during post-match summaries. The coach dashboard layout is clean and extremely premium.",
    name: "Coach Dave Sterling",
    role: "Head Basketball Coach",
    club: "Pacific State University",
    avatarLetter: "D",
    rating: 5
  },
  {
    quote: "Our tracking workflows are extremely specialized. ScoutVision allowed us to customize keyboard hotkeys and map serve-to-spike angles instantly. We've seen a 40% reduction in reporting timelines, keeping our players aligned during season transitions.",
    name: "Elena Rostova",
    role: "Director of Sports Performance",
    club: "National Volleyball Team",
    avatarLetter: "E",
    rating: 5
  },
  {
    quote: "Managing roster licensing and analyst task schedules across 6 squads was an administrative nightmare. The Team Lead portal in ScoutVision keeps everything isolated, secure, and under budget. It is the gold standard of sports performance systems.",
    name: "Robert K. Miller",
    role: "General Manager",
    club: "Metropolis Warriors Football",
    avatarLetter: "R",
    rating: 5
  }
];

export default function CustomerTestimonials() {
  return (
    <section className="py-24 border-t border-neutral-200 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            TRUSTED BY ELITES
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mt-3 mb-6 tracking-tight">
            Endorsed by Top-Tier Athletics
          </h2>
          <p className="text-slate-600 text-lg font-light leading-relaxed">
            Coaches, general managers, and performance directors rely on ScoutVision to deliver data-backed match analysis.
          </p>
        </div>

        {/* Grid of Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((test, index) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="p-8 rounded border border-neutral-200 bg-slate-50 hover:bg-white transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars row */}
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: test.rating }).map((_, rIdx) => (
                    <Star key={rIdx} className="w-4 h-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-slate-700 text-sm md:text-base leading-relaxed font-light italic mb-8 relative">
                  <Quote className="w-8 h-8 text-orange-500/10 absolute -top-4 -left-4 pointer-events-none" />
                  "{test.quote}"
                </p>
              </div>

              {/* User Bio Details */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold font-mono">
                  {test.avatarLetter}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 mb-0.5">
                    {test.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-light">
                    {test.role} — <strong className="text-orange-500 font-semibold">{test.club}</strong>
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
