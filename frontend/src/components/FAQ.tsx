"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does ScoutVision secure organizational data across different portals?",
    answer: "We enforce strict row-level security (RLS) policies at the PostgreSQL database tier, isolating tenant records dynamically. Furthermore, role permissions map access parameters directly to specific scopes: Coaches, Analysts, and QA Specialists can only access records matching their organizational assignments."
  },
  {
    question: "What video formats and codecs are supported for match uploads?",
    answer: "We support major codecs including H.264, H.265 (HEVC), MP4, and MOV formats. Uploads are processed asynchronously through our transcoding pipeline, converting raw recordings into optimized HTTP Live Streaming (HLS) segments for low-latency player streaming."
  },
  {
    question: "How long does the AI engine take to run tracking on a standard match?",
    answer: "Our GPU-accelerated EKS workers process video footage at approximately 2x actual velocity. A standard 90-minute match is fully analyzed, isolated, and coordinate logs populated in under 45 minutes."
  },
  {
    question: "Can our analysts configure custom keyboard hotkeys for tagging?",
    answer: "Yes. The Analyst portal includes a fully custom tagging board configuration tool. Analysts can bind specific game actions (e.g. Pass, Shot, interception) to custom keyboard keys, allowing rapid event logging."
  },
  {
    question: "What is the purpose of the QA Portal verification queue?",
    answer: "The QA portal bridges the gap between AI extraction models and final coaching briefs. QA Analysts review discrepancies highlighted by the model (e.g. mismatched jersey IDs or trajectory collisions) and verify the final statistics before publishing to the ClickHouse analytical datastore."
  },
  {
    question: "Do you support Single Sign-On (SSO) for enterprise clients?",
    answer: "Yes. Our Enterprise tier includes unified authentication integrations matching OIDC and SAML 2.0 standards, linking seamlessly with major providers such as Okta, Azure AD, and Ping Identity."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 border-t border-neutral-200 bg-slate-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-orange-500 uppercase">
            COMMON INQUIRIES
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mt-3 mb-6 tracking-tight">
            Frequently Answered Questions
          </h2>
          <p className="text-slate-650 text-lg font-light leading-relaxed">
            Everything you need to know about our enterprise sports performance architecture, models, and licensing terms.
          </p>
        </div>

        {/* FAQs list */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded border border-neutral-200 bg-white overflow-hidden transition-all duration-300 hover:border-slate-350"
              >
                {/* Trigger Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="font-bold text-sm md:text-base text-neutral-900 flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  )}
                </button>

                {/* Content block */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-2 text-xs md:text-sm text-slate-650 leading-relaxed font-light border-t border-slate-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
