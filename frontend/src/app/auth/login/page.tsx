"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function LoginPage() {
  const { login, changePassword, user } = useAuth();
  const router = useRouter();
  
  // Steps: 1 = Email Input, 2 = Password Input, 3 = Force Change Password
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Force Reset password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [showDemoAccess, setShowDemoAccess] = useState(false);

  useEffect(() => {
    if (user && step !== 3) {
      router.push("/dashboard");
    }
  }, [user, step, router]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setStep(2);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);
    try {
      const result = await login(email, password);
      if (result.forcePasswordChange) {
        setStep(3);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      if (err.message === "Account not found") {
        setError("Account not found. Please contact your administrator.");
      } else if (err.message === "Deactivated") {
        setError("Your account has been deactivated. Access is denied.");
      } else {
        setError("Invalid password credentials. Please try again.");
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleForceResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsPending(true);
    try {
      await changePassword(newPassword);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Failed to save new password. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setError("");
    setIsPending(true);
    try {
      const result = await login(demoEmail, "password");
      if (result.forcePasswordChange) {
        setStep(3);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError("Failed to run demo login.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#111518] text-white px-6 py-12 font-sans selection:bg-orange-500 selection:text-white relative overflow-hidden">
      
      {/* BACKGROUND LIVE SPORT WALLPAPER LAYER */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          className="w-full h-full object-cover opacity-20"
          src="https://sc.hudl.com/cms/assets/images/homepage/hudl_homepage_hero_20240112_720p.mp4"
          poster="https://sc.hudl.com/cms/assets/images/homepage/hudl_homepage_hero_20240112_poster.webp"
          loop
          playsInline
          muted
          autoPlay
        />
        {/* Dotted Grid Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "6px 6px"
          }}
        />
        {/* Dark radial overlay for text focus */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(17,21,24,0.3) 0%, rgba(17,21,24,0.92) 100%)"
          }}
        />
      </div>

      {/* 1. BRAND LOGO SEGMENT */}
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

      {/* 2. CENTERED CREDENTIALS WRAPPER */}
      <div className="w-full max-w-[400px] flex flex-col gap-6 relative z-10 bg-neutral-950/40 p-6 md:p-8 rounded-md border border-neutral-900/60 backdrop-blur-md">
        
        <h2 className="text-xl font-bold text-center text-white">
          {step === 3 ? "Set New Password" : "Log In"}
        </h2>

        {error && (
          <div className="p-3.5 rounded bg-red-950/40 border border-red-500/40 text-xs font-semibold text-red-400 text-center">
            {error}
          </div>
        )}

        {/* STEP 1: EMAIL IDENTIFIER FORM */}
        {step === 1 && (
          <form onSubmit={handleContinue} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] text-slate-300 font-normal">
                Email<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#191f24] border border-neutral-800 focus:border-[#009ce3] rounded px-3 py-3 text-white text-sm focus:outline-none transition-colors"
                placeholder="Enter your email address"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#009ce3] hover:bg-[#0082b2] text-white font-bold text-sm transition-colors rounded-sm flex items-center justify-center cursor-pointer"
            >
              Continue
            </button>
          </form>
        )}

        {/* STEP 2: PASSWORD INPUT ONLY (AUTO ROUTING) */}
        {step === 2 && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            
            {/* Show active email and button to edit it */}
            <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Email Address</span>
                <span className="text-xs text-slate-200 truncate max-w-[200px]">{email}</span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#009ce3] hover:underline"
              >
                Change
              </button>
            </div>

            {/* Password input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[13px] text-slate-300 font-normal">
                  Password<span className="text-red-500 ml-0.5">*</span>
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-[#009ce3] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#191f24] border border-neutral-800 focus:border-[#009ce3] rounded px-3 py-3 text-white text-sm focus:outline-none transition-colors"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-3 bg-[#009ce3] hover:bg-[#0082b2] text-white font-bold text-sm transition-colors rounded-sm flex items-center justify-center disabled:opacity-50 cursor-pointer"
            >
              {isPending ? "Connecting..." : "Log In"}
            </button>
          </form>
        )}

        {/* STEP 3: FORCE PASSWORD RESET (ONE-TIME PASSWORD INTERCEPT) */}
        {step === 3 && (
          <form onSubmit={handleForceResetSubmit} className="flex flex-col gap-4">
            
            <div className="p-3 bg-orange-950/30 border border-orange-500/20 rounded text-xs text-orange-300 leading-relaxed">
              <strong>First Login Notice:</strong> You are currently using a temporary password. You must change your password before accessing the dashboard.
            </div>

            {/* New Password input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-slate-300 font-normal">
                New Password<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#191f24] border border-neutral-800 focus:border-[#009ce3] rounded px-3 py-3 text-white text-sm focus:outline-none transition-colors"
                placeholder="Minimum 6 characters"
              />
            </div>

            {/* Confirm Password input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-slate-300 font-normal">
                Confirm Password<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#191f24] border border-neutral-800 focus:border-[#009ce3] rounded px-3 py-3 text-white text-sm focus:outline-none transition-colors"
                placeholder="Re-type new password"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-3 bg-[#ff6300] hover:bg-[#e05700] text-white font-bold text-sm transition-colors rounded-sm flex items-center justify-center disabled:opacity-50 cursor-pointer"
            >
              {isPending ? "Saving..." : "Change Password & Log In"}
            </button>
          </form>
        )}

        {/* DON'T HAVE AN ACCOUNT / CREATE ACCOUNT */}
        {step !== 3 && (
          <div className="text-center text-xs text-slate-350 mt-1">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-[#009ce3] hover:underline font-medium">
              Create Account
            </Link>
          </div>
        )}

        {/* 3. SOCIAL LOGINS (DEMO ACCESS BYPASS TRIGGERS) */}
        {step !== 3 && (
          <div className="flex flex-col gap-3">
            
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-850"></div>
              <span className="flex-shrink mx-4 text-xs font-normal text-slate-500">Or</span>
              <div className="flex-grow border-t border-neutral-850"></div>
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={() => handleQuickLogin("coach@scoutvision.ai")} 
              className="w-full py-3 bg-white text-black hover:bg-slate-100 transition-colors rounded-sm font-bold text-sm flex items-center justify-center gap-3 cursor-pointer shadow-md"
            >
              {/* Google colored G icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Continue with Facebook */}
            <button
              type="button"
              onClick={() => handleQuickLogin("analyst@scoutvision.ai")}
              className="w-full py-3 bg-[#1877f2] hover:bg-[#166fe5] text-white transition-colors rounded-sm font-bold text-sm flex items-center justify-center gap-3 cursor-pointer shadow-md"
            >
              {/* Facebook F logo */}
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
              Continue with Facebook
            </button>

            {/* Continue with Apple */}
            <button
              type="button"
              onClick={() => handleQuickLogin("qa@scoutvision.ai")}
              className="w-full py-3 bg-black text-white hover:bg-neutral-900 transition-colors rounded-sm font-bold text-sm flex items-center justify-center gap-3 cursor-pointer shadow-md"
            >
              {/* Apple Logo */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.79 16.32 3.1 9.94 6.7 6.48c1.8-1.74 3.9-1.6 5.1-.9 1 .58 1.48.58 2.5 0 1.5-.82 3.3-.98 4.7.74-3.1 3.52-2.6 8.76.6 9.98-2.6 6.54-5.34 9.18-8.2 10.46zM12.03 5.4c.16-2.28 1.76-4.14 3.88-4.4.26 2.56-1.5 4.74-3.88 4.4z" />
              </svg>
              Continue with Apple
            </button>

          </div>
        )}

        {/* 4. DEMO ACCOUNT DROPDOWN TOGGLE (TO RUN REVIEW CHECKS EASILY) */}
        {step !== 3 && (
          <div className="mt-4 border-t border-neutral-900 pt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setShowDemoAccess(!showDemoAccess)}
              className="text-center text-xs text-slate-500 hover:text-slate-400 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{showDemoAccess ? "Hide" : "Show"} Developer Demo Portals</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDemoAccess ? "rotate-180" : ""}`} />
            </button>

            {showDemoAccess && (
              <div className="p-3 bg-neutral-900/40 border border-neutral-850 rounded flex flex-col gap-2 animate-fadeIn">
                <span className="text-[10px] text-slate-450 block font-sans mb-1 text-center">
                  Select a test account to log in instantly (password: <code className="bg-neutral-850 text-slate-200 px-1 py-0.5 rounded">password</code>, admin: <code className="bg-neutral-850 text-slate-200 px-1 py-0.5 rounded">Omkar0501@</code>):
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("omkar.jadhav7804@gmail.com")}
                    className="px-3 py-2 border rounded-sm text-left text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors border-orange-500/30 text-orange-400 bg-orange-950/20"
                  >
                    <span>Super Admin</span>
                    <span className="text-[9px] opacity-75 font-mono">omkar.jadhav7804@gmail.com</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("teamlead@scoutvision.ai")}
                    className="px-3 py-2 border rounded-sm text-left text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors border-purple-500/30 text-purple-400 bg-purple-950/20"
                  >
                    <span>Demo Team Lead</span>
                    <span className="text-[9px] opacity-75 font-mono">teamlead@scoutvision.ai</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("analyst@scoutvision.ai")}
                    className="px-3 py-2 border rounded-sm text-left text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors border-blue-500/30 text-blue-400 bg-blue-950/20"
                  >
                    <span>Demo Analyst</span>
                    <span className="text-[9px] opacity-75 font-mono">analyst@scoutvision.ai</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. PRIVACY DISCLAIMER FOOTER */}
        <div className="text-center text-[11px] text-slate-500 leading-relaxed mt-4">
          By continuing, you agree to our{" "}
          <Link href="/auth/login" className="underline text-[#009ce3] hover:text-[#0082b2]">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/auth/login" className="underline text-[#009ce3] hover:text-[#0082b2]">
            Terms of Service
          </Link>
          .
        </div>

      </div>

    </div>
  );
}
