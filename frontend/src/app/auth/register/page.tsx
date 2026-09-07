"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, User, ShieldCheck, Phone, Globe, Lock, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("United States");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [verificationStep, setVerificationStep] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    // Mock DB Email Check
    const stored = localStorage.getItem("scoutvision_db_users");
    const dbUsers = stored ? JSON.parse(stored) : [];
    const exists = dbUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setErrorMsg("Email address is already registered.");
      return;
    }

    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setVerificationStep(true);
    }, 1200);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!verifyCode.trim()) {
      setErrorMsg("Please enter the verification code.");
      return;
    }

    setIsPending(true);
    setTimeout(() => {
      try {
        const stored = localStorage.getItem("scoutvision_db_users");
        const dbUsers = stored ? JSON.parse(stored) : [];

        const newUserId = `usr_${Math.random().toString(36).substr(2, 9)}`;
        const newCoach = {
          id: newUserId,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim().toUpperCase(),
          email: email.toLowerCase(),
          phone,
          role: "COACH",
          status: "Active",
          tenantName: organization,
          tenantId: `ten_${Math.random().toString(36).substr(2, 9)}`,
          password,
          isTempPassword: false,
          country,
          createdAt: new Date().toISOString()
        };

        dbUsers.push(newCoach);
        localStorage.setItem("scoutvision_db_users", JSON.stringify(dbUsers));

        // Auto Login
        localStorage.setItem("scoutvision_user", JSON.stringify(newCoach));
        
        // Log event
        const logsStored = localStorage.getItem("scoutvision_db_logs") || "[]";
        const logs = JSON.parse(logsStored);
        logs.push({
          id: `log_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          actor: email,
          event: "COACH_REGISTER",
          details: `Registered coach account for ${firstName} ${lastName} under ${organization}`
        });
        localStorage.setItem("scoutvision_db_logs", JSON.stringify(logs));

        setIsPending(false);
        router.push("/dashboard");
      } catch (err: any) {
        setIsPending(false);
        setErrorMsg("Failed to create coach account. Please try again.");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#111518] px-6 py-12 relative overflow-hidden font-sans">
      
      {/* Premium dark game wallpaper background simulation */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "url('/football_field.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111518] via-transparent to-[#111518] z-0 pointer-events-none" />

      {/* Brand logo header */}
      <Link href="/" className="flex items-center gap-2 mb-6 group z-10">
        <img
                src="/logos/scoutvision_icon.png"
                alt="ScoutVision Logo"
                className="w-14 h-14 object-contain transition-transform group-hover:scale-105 mb-2 drop-shadow-[0_0_12px_rgba(255,99,0,0.5)]"
              />
        <span className="text-lg font-bold tracking-tight text-white">
          Scout<span className="text-[#0070f3]">Vision</span>
        </span>
      </Link>

      <div className="w-full max-w-lg z-10">
        <div className="p-8 rounded border border-neutral-850 bg-[#191F24] shadow-2xl relative">
          
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors font-mono"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to Login
            </Link>
            <span className="text-[10px] text-slate-550 font-mono uppercase tracking-widest">Premium Client Sign Up</span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded mb-5 text-left font-mono">
              ⚠️ {errorMsg}
            </div>
          )}

          {!verificationStep ? (
            <div>
              <h2 className="text-xl font-bold text-white mb-1.5 text-left">Create Coach Account</h2>
              <p className="text-slate-400 text-xs font-light leading-relaxed mb-6 text-left">
                Sign up to upload matches, track statistics, review analysis packages, and deliver reports directly to your club roster.
              </p>

              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 text-left">
                
                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">First Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded bg-neutral-950 border border-neutral-850 text-white text-xs placeholder-slate-600 focus:border-[#0070f3] focus:outline-none transition-colors"
                        placeholder="e.g. John"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Last Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded bg-neutral-950 border border-neutral-850 text-white text-xs placeholder-slate-600 focus:border-[#0070f3] focus:outline-none transition-colors"
                        placeholder="e.g. Doe"
                      />
                    </div>
                  </div>
                </div>

                {/* Organization */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Academy / Club / Org Name *</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded bg-neutral-950 border border-neutral-850 text-white text-xs placeholder-slate-600 focus:border-[#0070f3] focus:outline-none transition-colors"
                      placeholder="e.g. London FC Academy"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded bg-neutral-950 border border-neutral-850 text-white text-xs placeholder-slate-600 focus:border-[#0070f3] focus:outline-none transition-colors"
                      placeholder="e.g. coach@academy.com"
                    />
                  </div>
                </div>

                {/* Phone & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Mobile Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded bg-neutral-950 border border-neutral-850 text-white text-xs placeholder-slate-600 focus:border-[#0070f3] focus:outline-none transition-colors"
                        placeholder="e.g. +1 555-0199"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Country *</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                      <input
                        type="text"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded bg-neutral-950 border border-neutral-850 text-white text-xs placeholder-slate-600 focus:border-[#0070f3] focus:outline-none transition-colors"
                        placeholder="United States"
                      />
                    </div>
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded bg-neutral-950 border border-neutral-850 text-white text-xs placeholder-slate-600 focus:border-[#0070f3] focus:outline-none transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded bg-neutral-950 border border-neutral-850 text-white text-xs placeholder-slate-600 focus:border-[#0070f3] focus:outline-none transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full mt-3 py-3 rounded bg-[#0070f3] hover:bg-[#0051a8] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? "Validating Profile..." : "Create Account"}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-left font-mono">
              <h2 className="text-xl font-bold text-white mb-1.5">Verify Your Email Address</h2>
              <p className="text-slate-400 text-xs font-light leading-relaxed mb-6">
                We have dispatched a verification email to <strong className="text-white">{email}</strong>. Please enter the 6-digit confirmation code below to activate your portal.
              </p>

              <form onSubmit={handleVerifySubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-wider block">Verification Code *</label>
                  <input
                    type="text"
                    required
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 rounded p-3 text-center text-lg font-bold text-white tracking-[0.5em] focus:border-[#0070f3] focus:outline-none"
                    placeholder="123456"
                    maxLength={6}
                  />
                  <span className="text-[10px] text-slate-550 mt-1 block">Verification tip: You can enter any 6-digit code to simulate email confirmation.</span>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full mt-3 py-3 rounded bg-[#0070f3] hover:bg-[#0051a8] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? "Configuring Organization Schema..." : "Confirm & Verify Code"}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
