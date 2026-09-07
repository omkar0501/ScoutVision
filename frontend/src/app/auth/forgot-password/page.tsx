"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#111518] text-white px-6 py-12 font-sans relative overflow-hidden">
      
      {/* Background live sport wallpaper layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "url('/football_field.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111518] via-transparent to-[#111518] z-0 pointer-events-none" />
      </div>

      {/* Brand logo header */}
      <div className="flex flex-col items-center mb-8 relative z-10">
        <Link href="/" className="flex flex-col items-center group">
          {/* ScoutVision Targeted Eye Logo */}
          <img
                src="/logos/scoutvision_icon.png"
                alt="ScoutVision Logo"
                className="w-14 h-14 object-contain transition-transform group-hover:scale-105 mb-2 drop-shadow-[0_0_12px_rgba(255,99,0,0.5)]"
              />
          <span className="text-2xl font-bold tracking-tight text-white">
            Scout<span className="text-[#ff6300]">Vision</span>
          </span>
        </Link>
      </div>

      {/* Centered Credentials Wrapper */}
      <div className="w-full max-w-[400px] flex flex-col gap-6 relative z-10 bg-neutral-950/40 p-6 md:p-8 rounded border border-neutral-900/60 backdrop-blur-md">
        
        <div className="mb-2 flex items-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors font-mono"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Login
          </Link>
        </div>

        {isSubmitted ? (
          <div className="py-4 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-md font-bold text-white mb-2">Reset Link Dispatched</h3>
            <p className="text-slate-400 text-xs font-light leading-relaxed mb-6 font-sans">
              If the email address <strong>{email}</strong> is associated with an active organizational account, you will receive a secure credential recovery link shortly.
            </p>
            <Link
              href="/auth/login"
              className="w-full py-2.5 bg-[#0070f3] hover:bg-[#0051a8] text-white rounded font-bold text-xs uppercase tracking-wider text-center transition-colors shadow"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-white mb-1.5 text-left">Recover Password</h2>
            <p className="text-slate-400 text-xs font-light leading-relaxed mb-6 text-left">
              Enter your workspace email address, and we will send you a secure credential recovery link.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-slate-450 uppercase tracking-wider block">
                  Organization Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded bg-neutral-950 border border-neutral-850 text-white text-xs placeholder-slate-600 focus:border-[#ff6300] focus:outline-none transition-colors"
                    placeholder="e.g. coach@londonfc.com"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-2 py-3 rounded bg-[#ff6300] hover:bg-[#e05700] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "Sending secure link..." : "Send Reset Link"}
                {!isPending && <Send className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
