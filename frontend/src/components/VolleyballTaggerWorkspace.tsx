"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Settings, 
  Maximize, 
  Undo, 
  ChevronDown, 
  ChevronUp, 
  Pencil, 
  AlertCircle, 
  MessageSquare, 
  SlidersHorizontal,
  MoveHorizontal
} from "lucide-react";

export interface Athlete {
  num: number;
  name: string;
}

const defaultMHSRoster: Athlete[] = [
  { num: 1, name: "S. Franklin" },
  { num: 2, name: "A. Bragg" },
  { num: 3, name: "E. Walker" },
  { num: 4, name: "M. Walker" },
  { num: 5, name: "J. Walker" },
  { num: 6, name: "N. Bosland" },
  { num: 7, name: "K. Lipford" },
  { num: 9, name: "K. Sable" },
  { num: 10, name: "E. Littig" },
  { num: 13, name: "L. DeLoach" },
  { num: 18, name: "Unknown" },
  { num: 19, name: "A. Christmas" }
];

const defaultTeam2Roster: Athlete[] = [
  { num: 1, name: "C. Smith" },
  { num: 2, name: "M. Barfield" },
  { num: 4, name: "A. Carter" },
  { num: 5, name: "M. Bellamy" },
  { num: 7, name: "E. Evans" },
  { num: 8, name: "M. Hallwood" },
  { num: 10, name: "J. Copeland" },
  { num: 12, name: "J. Sims" },
  { num: 13, name: "K. Fleck" },
  { num: 15, name: "Unknown" },
  { num: 17, name: "Unknown" },
  { num: 18, name: "B. Neel" }
];

interface TimelineTag {
  id: string;
  label: string;
  timeSec: number;
  trackIndex: 0 | 1 | 2 | 3;
  theme: "light" | "dark" | "highlight";
  team: "home" | "away";
}

interface VolleyballTaggerWorkspaceProps {
  match?: any;
  user?: any;
  onClose: () => void;
  onSave?: (data: any) => void;
  triggerAlert?: (type: any, msg: string) => void;
}

export default function VolleyballTaggerWorkspace({
  match,
  user,
  onClose,
  onSave,
  triggerAlert = () => {}
}: VolleyballTaggerWorkspaceProps) {
  // Match state
  const [homeTeam, setHomeTeam] = useState("MHS");
  const [awayTeam, setAwayTeam] = useState("Team 2");
  const [homeScore, setHomeScore] = useState(10);
  const [awayScore, setAwayScore] = useState(5);
  const [period, setPeriod] = useState("3rd");

  // Rosters
  const [mhsRoster, setMhsRoster] = useState<Athlete[]>(defaultMHSRoster);
  const [team2Roster, setTeam2Roster] = useState<Athlete[]>(defaultTeam2Roster);

  // Video playback states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(5420); // 1:30:20 in seconds
  const [totalDuration, setTotalDuration] = useState(10800); // 3:00:00 in seconds
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Modals
  const [showCoachNotes, setShowCoachNotes] = useState(false);
  const [coachNotesText, setCoachNotesText] = useState("");
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showProblemReportModal, setShowProblemReportModal] = useState(false);
  const [problemReportCategory, setProblemReportCategory] = useState("Camera Angle Issue");
  const [problemReportNotes, setProblemReportNotes] = useState("");
  const [showEndSetMenu, setShowEndSetMenu] = useState(false);

  // =========================================================================
  // TAGGER MODES:
  // 1. "DUAL_INITIAL"    -> Frame 0 (00s): MHS Serve (Ace, Serve Error, Violation vs Serve Receive, Over Pass, Violation)
  // 2. "COMPLETE_TAG"    -> Frame 1-8 (05s - 42s): Complete the Tag Accordion (Attack Kill sequence)
  // 3. "POST_KILL"       -> Frame 10 (50s): MHS won point (11-5), MHS Serve / Violation vs Team 2 Violation
  // 4. "SERVE_ERROR"     -> Frame 11 (55s): MHS Serve Error prompt (Who served the error?)
  // 5. "POST_ERROR"      -> Frame 12 (60s): Team 2 won side-out (11-6), Team 2 gets Serve!
  // =========================================================================
  const [taggerMode, setTaggerMode] = useState<"DUAL_INITIAL" | "COMPLETE_TAG" | "POST_KILL" | "SERVE_ERROR" | "POST_ERROR">("DUAL_INITIAL");
  const [currentActionTitle, setCurrentActionTitle] = useState("MHS Serve");

  // Accordion active step
  const [activeStep, setActiveStep] = useState<string>("whoServed");
  
  // Accordion answers
  const [selectedServer, setSelectedServer] = useState<Athlete | null>(null);
  const [selectedReceiver, setSelectedReceiver] = useState<Athlete | null>(null);
  const [serveRating, setServeRating] = useState<number | null>(null);
  const [freeBallSender, setFreeBallSender] = useState<Athlete | null>(null);
  const [freeBallReceiver, setFreeBallReceiver] = useState<Athlete | null>(null);
  const [assistingPlayer, setAssistingPlayer] = useState<Athlete | null>(null);
  const [killingPlayer, setKillingPlayer] = useState<Athlete | null>(null);
  const [errorServer, setErrorServer] = useState<Athlete | null>(null);

  // 2D Court Mark (Single black cross +)
  const [attackLocation, setAttackLocation] = useState<{ x: number; y: number } | null>(null);
  const [attackDeflected, setAttackDeflected] = useState(false);

  // Active focused tag on timeline
  const [activeFocusedTagId, setActiveFocusedTagId] = useState<string>("");

  // Multi-track timeline tags
  const [timelineTags, setTimelineTags] = useState<TimelineTag[]>([
    // === RALLY 1 (01:29:30 - 01:30:00) ===
    { id: "r1_1", label: "Serve #10", timeSec: 5370, trackIndex: 0, theme: "light", team: "home" },
    { id: "r1_2", label: "Dig #9", timeSec: 5378, trackIndex: 0, theme: "light", team: "away" },
    { id: "r1_3", label: "Free Ball #1", timeSec: 5384, trackIndex: 0, theme: "dark", team: "away" },
    { id: "r1_4", label: "Dig #18", timeSec: 5390, trackIndex: 0, theme: "dark", team: "home" },
    { id: "r1_5", label: "Set #2", timeSec: 5396, trackIndex: 0, theme: "light", team: "home" },
    
    { id: "r1_6", label: "Serve Receive #1", timeSec: 5373, trackIndex: 1, theme: "dark", team: "away" },
    { id: "r1_7", label: "Set #9", timeSec: 5380, trackIndex: 1, theme: "light", team: "away" },
    { id: "r1_8", label: "Free Ball Receive #7", timeSec: 5386, trackIndex: 1, theme: "light", team: "home" },
    { id: "r1_9", label: "Set #10", timeSec: 5392, trackIndex: 1, theme: "dark", team: "home" },
    { id: "r1_10", label: "Attack Kill #13", timeSec: 5398, trackIndex: 1, theme: "light", team: "home" },

    { id: "r1_11", label: "Set #18", timeSec: 5376, trackIndex: 2, theme: "dark", team: "home" },
    { id: "r1_12", label: "Dig #10", timeSec: 5382, trackIndex: 2, theme: "dark", team: "away" },
    { id: "r1_13", label: "Set #2", timeSec: 5391, trackIndex: 2, theme: "light", team: "home" },
    { id: "r1_14", label: "Attack #5", timeSec: 5397, trackIndex: 2, theme: "dark", team: "away" },

    { id: "r1_15", label: "Attack #1", timeSec: 5379, trackIndex: 3, theme: "dark", team: "away" },
    { id: "r1_16", label: "Attack #13", timeSec: 5387, trackIndex: 3, theme: "dark", team: "home" },
    { id: "r1_17", label: "Attack #18", timeSec: 5393, trackIndex: 3, theme: "dark", team: "home" },
    { id: "r1_18", label: "Dig #10", timeSec: 5399, trackIndex: 3, theme: "dark", team: "away" }
  ]);

  // Format seconds to H:MM:SS
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Keyboard shortcut listener for (U)ndo and Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "u" || e.key === "U") {
        handleUndo();
      } else if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, taggerMode]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (delta: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime + delta);
    }
    setCurrentTime(prev => Math.max(0, prev + delta));
  };

  const handleUndo = () => {
    if (taggerMode === "POST_ERROR") {
      setTaggerMode("SERVE_ERROR");
      setAwayScore(5);
      setTimelineTags(prev => prev.filter(t => !t.label.includes("Serve Error")));
      triggerAlert("info", "Undid Serve Error");
    } else if (taggerMode === "SERVE_ERROR") {
      setTaggerMode("POST_KILL");
      triggerAlert("info", "Returned to Post-Kill");
    } else if (taggerMode === "POST_KILL") {
      setTaggerMode("COMPLETE_TAG");
      setHomeScore(10);
      triggerAlert("info", "Undid Attack Kill");
    } else if (taggerMode === "COMPLETE_TAG") {
      setTaggerMode("DUAL_INITIAL");
      setCurrentActionTitle("MHS Serve");
      triggerAlert("info", "Returned to initial Serve Keypad");
    } else {
      triggerAlert("info", "Last action undone (U)");
    }
  };

  // 1. Analyst clicks "Serve Receive" in Dual Column Keypad
  const handleStartServeReceiveFlow = () => {
    setTaggerMode("COMPLETE_TAG");
    setCurrentActionTitle("MHS Attack Kill");
    setActiveStep("whoServed");
    // Pre-populate with realistic starting defaults from the video, but allow full interactive selection
    setSelectedServer({ num: 9, name: "K. Sable" });
    setSelectedReceiver({ num: 15, name: "Unknown" });
    setServeRating(1);
    setFreeBallSender({ num: 2, name: "M. Barfield" });
    setFreeBallReceiver({ num: 9, name: "K. Sable" });
    setAssistingPlayer({ num: 2, name: "A. Bragg" });
    setKillingPlayer({ num: 18, name: "Unknown" });
    setActiveStep("attackLocation");
    setActiveFocusedTagId("t_kill18");
  };

  // 2. Clicking court location in "Where did the attack occur?"
  // Directly marks '+' and AUTOMATICALLY completes tag (NO save button, exactly like the video at 42s!)
  const handleCourtClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 240);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 120);

    setAttackLocation({ x, y });

    // Instantly add Rally 2 tags to the timeline
    const rally2Tags: TimelineTag[] = [
      { id: "t_serve9", label: `Serve #${selectedServer?.num || 9}`, timeSec: 5420, trackIndex: 0, theme: "light", team: "home" },
      { id: "t_set2", label: `Set #${assistingPlayer?.num || 2}`, timeSec: 5428, trackIndex: 0, theme: "light", team: "home" },
      { id: "t_sr15", label: `Serve Receive #${selectedReceiver?.num || 15}`, timeSec: 5422, trackIndex: 1, theme: "dark", team: "away" },
      { id: "t_kill18", label: `Attack Kill #${killingPlayer?.num || 18}`, timeSec: 5430, trackIndex: 1, theme: "highlight", team: "home" },
      { id: "t_fb2", label: `Free Ball #${freeBallSender?.num || 2}`, timeSec: 5424, trackIndex: 2, theme: "dark", team: "away" },
      { id: "t_fbr9", label: `Free Ball Receive #${freeBallReceiver?.num || 9}`, timeSec: 5426, trackIndex: 3, theme: "dark", team: "home" }
    ];

    setTimelineTags(prev => [
      ...prev.filter(t => !t.id.startsWith("t_")),
      ...rally2Tags
    ]);

    // Update score from 10 to 11
    setHomeScore(11);
    setCurrentTime(5444);
    if (videoRef.current) {
      videoRef.current.currentTime = 24;
    }

    // Auto-advance directly to Post Kill panel (Frame 10 at 50s)
    setTimeout(() => {
      setTaggerMode("POST_KILL");
      setCurrentActionTitle("MHS Attack Kill");
      setActiveFocusedTagId("");
      triggerAlert("success", "Point MHS! Attack Kill confirmed (11 - 5).");
    }, 200);
  };

  // 3. Clicking "Serve" in Post Kill panel
  const handleStartMhsServeError = () => {
    setCurrentTime(5448);
    if (videoRef.current) {
      videoRef.current.currentTime = 28;
    }

    setTaggerMode("SERVE_ERROR");
    setCurrentActionTitle("MHS Serve Error");
    setActiveFocusedTagId("t_error_pending");
  };

  // 4. Selecting athlete who served the error (e.g. #10 E. Littig)
  const handleSelectServeErrorAthlete = (ath: Athlete) => {
    setErrorServer(ath);
    // Team 2 gets side-out point (11 - 6)
    setAwayScore(6);
    setCurrentTime(5451);
    if (videoRef.current) {
      videoRef.current.currentTime = 31;
    }

    const newTag: TimelineTag = {
      id: "t_error_10",
      label: `Serve Error #${ath.num}`,
      timeSec: 5451,
      trackIndex: 0,
      theme: "light",
      team: "home"
    };
    setTimelineTags(prev => [...prev, newTag]);
    setActiveFocusedTagId("t_error_10");

    // Automatically transition to Post Error panel (Frame 12 at 60s)
    setTaggerMode("POST_ERROR");
    setCurrentActionTitle("MHS Serve Error");
    triggerAlert("success", `Point Team 2! Serve Error #${ath.num} (11 - 6). Team 2 serves next.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#12161a] text-white flex flex-col font-sans select-none overflow-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER MATCH BAR                                       */}
      {/* ------------------------------------------------------------- */}
      <div className="h-10 bg-[#191F24] border-b border-neutral-800 px-4 flex items-center justify-between text-xs flex-shrink-0 z-40">
        
        {/* Left: Exit */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white flex items-center gap-1.5 px-2 py-1 rounded hover:bg-neutral-800 transition-colors font-medium cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>

        {/* Center: Live Scoreboard (MHS 10  3rd  5  Team 2) */}
        <div className="flex items-center gap-3 font-mono text-sm tracking-wide bg-[#14181c] px-4 py-1 rounded border border-neutral-800 shadow-inner">
          <span className="font-bold text-slate-200">{homeTeam}</span>
          <span className="font-extrabold text-orange-400 text-base">{homeScore}</span>
          <span className="text-[11px] text-slate-400 font-sans px-1.5 py-0.5 rounded bg-neutral-800 uppercase font-semibold">
            {period}
          </span>
          <span className="font-extrabold text-blue-400 text-base">{awayScore}</span>
          <span className="font-bold text-slate-200">{awayTeam}</span>
        </div>

        {/* Right: End Set Menu, Coach Notes, Options */}
        <div className="flex items-center gap-2 relative">
          
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEndSetMenu(!showEndSetMenu)}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-slate-200 rounded text-xs flex items-center gap-1 border border-neutral-700 cursor-pointer font-medium"
            >
              <span>End Set or Match</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showEndSetMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-[#1e2328] border border-neutral-700 rounded shadow-xl py-1 text-xs z-50 animate-fadeIn">
                <button
                  type="button"
                  onClick={() => {
                    setShowEndSetMenu(false);
                    setPeriod("4th");
                    triggerAlert("success", "Set 3 concluded. Set 4 started.");
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-orange-500 hover:text-white transition-colors"
                >
                  End Current Set ({period})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEndSetMenu(false);
                    triggerAlert("info", "Match concluded.");
                    if (onSave) onSave(timelineTags);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-neutral-700 transition-colors"
                >
                  End Full Match
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowCoachNotes(true)}
            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-slate-200 rounded text-xs border border-neutral-700 cursor-pointer font-medium"
          >
            Coach Notes
          </button>

          <button
            type="button"
            onClick={() => setShowOptionsModal(true)}
            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-slate-200 rounded text-xs border border-neutral-700 cursor-pointer font-medium"
          >
            Options
          </button>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN BODY: VIDEO + TIMELINE (LEFT) & TAGGING PANEL (RIGHT) */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* =========================================================== */}
        {/* LEFT COLUMN: VIDEO PLAYER + SCRUBBER + MULTI-TRACK TIMELINE */}
        {/* =========================================================== */}
        <div className="flex-1 flex flex-col min-w-0 bg-black relative">
          
          {/* A. Video Container */}
          <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
            
            <video
              ref={videoRef}
              src="/videos/volleyball_match.mp4"
              className="w-full h-full object-contain"
              playsInline
              loop
              muted={isMuted}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  const base = taggerMode === "POST_ERROR" ? 5451 : taggerMode === "SERVE_ERROR" ? 5448 : taggerMode === "POST_KILL" ? 5444 : 5420;
                  setCurrentTime(base + Math.floor(videoRef.current.currentTime));
                }
              }}
            />

            {/* B. LED Digital Scoreboard Graphic Overlay */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none select-none">
              <div className="bg-black/95 border-2 border-neutral-700 rounded-xs p-2 text-amber-500 font-mono shadow-2xl flex flex-col gap-1 w-32 backdrop-blur-xs">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold border-b border-neutral-800 pb-0.5 uppercase">
                  <span>Home</span>
                  <span>Guests</span>
                </div>
                <div className="flex justify-between text-xl font-extrabold text-amber-400">
                  <span>{homeScore}</span>
                  <span className="text-red-500 text-xs self-center">1:00</span>
                  <span>{awayScore}</span>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-semibold pt-0.5">
                  <span>WON {homeScore > awayScore ? 1 : 0}</span>
                  <span>SET {period}</span>
                  <span>WON {awayScore > homeScore ? 1 : 0}</span>
                </div>
              </div>
            </div>

          </div>

          {/* C. Scrubber Bar with Bright Orange Progress Line */}
          <div className="h-10 bg-[#14181c] border-t border-neutral-800 px-4 flex items-center justify-between text-xs text-slate-300 flex-shrink-0 z-10 relative">
            
            {/* Orange Scrubber line */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-neutral-800">
              <div 
                className="h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, ((currentTime - 5350) / 150) * 100))}%` }}
              />
            </div>

            {/* Left Transport Controls */}
            <div className="flex items-center gap-2.5">
              <button type="button" onClick={() => handleSeek(-100)} className="hover:text-white cursor-pointer" title="To Start">
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => handleSeek(-1)} className="hover:text-white cursor-pointer text-[11px] font-bold font-mono" title="Frame Back">
                ◀◀
              </button>
              <button type="button" onClick={() => handleSeek(-0.2)} className="hover:text-white cursor-pointer text-[11px] font-bold font-mono" title="Step Back">
                ◀
              </button>
              <button type="button" onClick={() => handleSeek(-5)} className="hover:text-white cursor-pointer flex items-center" title="Replay 5s">
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono ml-0.5">5</span>
              </button>
              
              <button 
                type="button" 
                onClick={togglePlay} 
                className="w-7 h-7 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white cursor-pointer shadow transition-colors"
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>

              <button type="button" onClick={() => handleSeek(5)} className="hover:text-white cursor-pointer flex items-center" title="Skip 5s">
                <RotateCw className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono ml-0.5">5</span>
              </button>
              <button type="button" onClick={() => handleSeek(0.2)} className="hover:text-white cursor-pointer text-[11px] font-bold font-mono" title="Step Forward">
                ▶
              </button>
              <button type="button" onClick={() => handleSeek(1)} className="hover:text-white cursor-pointer text-[11px] font-bold font-mono" title="Frame Forward">
                ▶▶
              </button>
              <button type="button" onClick={() => handleSeek(15)} className="hover:text-white cursor-pointer" title="Next Clip">
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono text-xs text-slate-300 ml-2 font-bold">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>

            {/* Right Quick Controls */}
            <div className="flex items-center gap-3 text-slate-400">
              <button type="button" onClick={() => setIsMuted(!isMuted)} className="hover:text-white cursor-pointer">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button type="button" onClick={() => setShowOptionsModal(true)} className="hover:text-white cursor-pointer">
                <Settings className="w-4 h-4" />
              </button>
              <button 
                type="button" 
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    document.documentElement.requestFullscreen();
                  }
                }} 
                className="hover:text-white cursor-pointer"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* D. Multi-Track Timeline (4 Tracks, exact sharp blocks, resize handle) */}
          <div className="h-44 bg-[#14181c] border-t border-neutral-900 px-4 py-2 flex flex-col justify-between flex-shrink-0 relative overflow-hidden">
            
            {/* Splitter / Resize Grip Header */}
            <div className="w-full flex items-center justify-center pb-1">
              <div className="w-8 h-1 rounded bg-neutral-700/60 cursor-ns-resize" />
            </div>

            {/* Timeline Viewport */}
            <div className="relative w-full flex-1 overflow-hidden">
              
              {/* Vertical Playhead Cursor (White Line with Center Handle) */}
              <div 
                className="absolute top-0 bottom-0 w-[1.5px] bg-white z-30 pointer-events-none flex items-center justify-center"
                style={{ 
                  left: taggerMode === "POST_ERROR" ? "70%" : taggerMode === "SERVE_ERROR" ? "62%" : "48%" 
                }}
              >
                <div className="w-3 h-4 rounded-xs bg-white text-black text-[8px] flex items-center justify-center font-bold shadow -ml-[0.5px]">
                  ≡
                </div>
              </div>

              {/* 4 Track Dividers */}
              <div className="absolute inset-x-0 top-[25%] h-[1px] bg-neutral-900/60" />
              <div className="absolute inset-x-0 top-[50%] h-[1px] bg-neutral-900/60" />
              <div className="absolute inset-x-0 top-[75%] h-[1px] bg-neutral-900/60" />

              {/* Render Tag Blocks */}
              {timelineTags.map((tag) => {
                const baseTime = 5420;
                const offsetSec = tag.timeSec - baseTime;
                const windowOffset = taggerMode === "POST_ERROR" ? -20 : taggerMode === "SERVE_ERROR" ? -12 : 0;
                const leftPercent = 48 + ((offsetSec + windowOffset) * 1.8);

                if (leftPercent < -15 || leftPercent > 115) return null;

                const isFocused = activeFocusedTagId === tag.id;
                const isPreviousRally = tag.timeSec < 5410;

                return (
                  <div
                    key={tag.id}
                    onClick={() => {
                      setCurrentTime(tag.timeSec);
                      setActiveFocusedTagId(tag.id);
                    }}
                    className={`absolute text-[10px] font-sans px-1.5 py-0.5 cursor-pointer whitespace-nowrap transition-all border select-none ${
                      isFocused
                        ? "bg-white text-black border-2 border-white font-extrabold shadow-[0_0_10px_rgba(255,255,255,0.7)] z-20 scale-105"
                        : tag.theme === "dark"
                        ? `bg-[#242b33] text-slate-100 border-neutral-700 ${isPreviousRally ? "opacity-50" : "opacity-95"}`
                        : `bg-[#e6ebf0] text-neutral-950 border-neutral-300 font-semibold ${isPreviousRally ? "opacity-50" : "opacity-100"}`
                    }`}
                    style={{
                      top: `${tag.trackIndex * 24}px`,
                      left: `${leftPercent}%`,
                      height: "21px",
                      lineHeight: "15px"
                    }}
                  >
                    {tag.label}
                  </div>
                );
              })}

              {/* Active Pending Tag placeholder when in SERVE_ERROR */}
              {taggerMode === "SERVE_ERROR" && (
                <div
                  className="absolute bg-white text-black border-2 border-white text-[10px] font-extrabold px-2 py-0.5 shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20"
                  style={{
                    top: "0px",
                    left: "60%",
                    height: "21px",
                    lineHeight: "15px"
                  }}
                >
                  <span className="animate-pulse mr-1">●</span> Serve Error
                </div>
              )}
            </div>

            {/* Timecode Marks */}
            <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 pt-1 border-t border-neutral-900 select-none">
              <span>01:29:30</span>
              <span>01:30:00</span>
              <span className="text-slate-400">01:30:30</span>
              <span className="text-slate-400">01:31:00</span>
              <span>01:31:30</span>
              <span>01:32:00</span>
            </div>
          </div>

        </div>

        {/* =========================================================== */}
        {/* RIGHT COLUMN: TAGGING PANEL                                 */}
        {/* =========================================================== */}
        <div className="w-[430px] bg-[#161a1e] border-l border-neutral-800 flex flex-col justify-between flex-shrink-0 z-30">
          
          {/* ========================================================= */}
          {/* MODE 1: DUAL INITIAL KEYPAD (Frame 0 at 00s)              */}
          {/* ========================================================= */}
          {taggerMode === "DUAL_INITIAL" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 flex flex-col">
                
                {/* Subheader */}
                <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between text-neutral-900 font-bold text-xs flex-shrink-0">
                  <span className="font-extrabold">MHS Serve</span>
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="flex items-center gap-1 text-[11px] text-neutral-700 hover:text-black cursor-pointer font-semibold"
                  >
                    <Undo className="w-3.5 h-3.5" />
                    <span>Undo (U)</span>
                  </button>
                </div>

                {/* Dual Columns: MHS (White) vs Team 2 (Dark Charcoal) */}
                <div className="flex-1 grid grid-cols-2">
                  
                  {/* Left Column: MHS */}
                  <div className="bg-[#f0f2f5] border-r border-neutral-300 flex flex-col">
                    <div className="p-3 font-extrabold text-neutral-900 text-sm border-b border-neutral-300 bg-white">
                      MHS
                    </div>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => {
                          setHomeScore(prev => prev + 1);
                          triggerAlert("success", "Point MHS! Ace logged.");
                        }}
                        className="w-full text-left px-4 py-3 bg-white hover:bg-slate-100 text-neutral-900 font-bold border-b border-neutral-300 cursor-pointer transition-colors shadow-2xs"
                      >
                        Ace
                      </button>
                      <button
                        type="button"
                        onClick={handleStartMhsServeError}
                        className="w-full text-left px-4 py-3 bg-white hover:bg-slate-100 text-neutral-900 font-bold border-b border-neutral-300 cursor-pointer transition-colors"
                      >
                        Serve Error
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerAlert("info", "Violation logged for MHS")}
                        className="w-full text-left px-4 py-3 bg-white hover:bg-slate-100 text-neutral-900 font-bold border-b border-neutral-300 cursor-pointer transition-colors"
                      >
                        Violation
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Team 2 */}
                  <div className="bg-[#9da3a8] flex flex-col">
                    <div className="p-3 font-extrabold text-white text-sm bg-[#4a5259] border-b border-neutral-600">
                      Team 2
                    </div>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={handleStartServeReceiveFlow}
                        className="w-full text-left px-4 py-3 bg-[#6b757e] hover:bg-[#78838d] text-white font-bold border-b border-neutral-600 cursor-pointer transition-colors"
                      >
                        Serve Receive
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerAlert("info", "Over Pass logged for Team 2")}
                        className="w-full text-left px-4 py-3 bg-[#4a5259] hover:bg-[#565e66] text-white font-bold border-b border-neutral-600 cursor-pointer transition-colors"
                      >
                        Over Pass
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerAlert("info", "Violation logged for Team 2")}
                        className="w-full text-left px-4 py-3 bg-[#4a5259] hover:bg-[#565e66] text-white font-bold border-b border-neutral-600 cursor-pointer transition-colors"
                      >
                        Violation
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Button */}
              <div className="bg-[#1b2025] border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    if (onSave) onSave(timelineTags);
                    onClose();
                  }}
                  className="w-full py-3 bg-[#262d35] hover:bg-[#323a44] text-white font-bold text-xs transition-colors text-center cursor-pointer"
                >
                  Save and Exit
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* MODE 2: "COMPLETE THE TAG" ACCORDION FLOW                 */}
          {/* ========================================================= */}
          {taggerMode === "COMPLETE_TAG" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="h-9 bg-[#111417] border-b border-neutral-800 px-4 flex items-center justify-center flex-shrink-0">
                <span className="font-extrabold text-xs tracking-wider text-slate-100 font-sans">
                  Complete the Tag
                </span>
              </div>

              {/* Subheader */}
              <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between text-neutral-900 font-bold text-xs flex-shrink-0 shadow-2xs">
                <span className="font-extrabold tracking-wide">{currentActionTitle}</span>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="flex items-center gap-1 text-[11px] text-neutral-700 hover:text-black cursor-pointer font-semibold"
                >
                  <Undo className="w-3.5 h-3.5" />
                  <span>Undo (U)</span>
                </button>
              </div>

              {/* Color-Coded Accordion Steps */}
              <div className="flex-1 overflow-y-auto bg-neutral-900 divide-y divide-neutral-800 text-xs">
                
                {/* 1. Who served? (MHS - White) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep === "whoServed" ? "" : "whoServed")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who served? <span className="font-normal ml-2 font-mono text-neutral-700">{selectedServer ? `#${selectedServer.num} ${selectedServer.name}` : ""}</span></span>
                    {activeStep === "whoServed" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeStep === "whoServed" && (
                    <div className="p-3 bg-white text-neutral-900 border-t border-neutral-200">
                      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                        {mhsRoster.map(ath => (
                          <button
                            key={ath.num}
                            type="button"
                            onClick={() => {
                              setSelectedServer(ath);
                              setActiveStep("whoReceived");
                            }}
                            className={`p-1.5 text-left font-sans text-[11px] rounded cursor-pointer ${selectedServer?.num === ath.num ? "bg-orange-500 text-white font-bold" : "hover:bg-neutral-100"}`}
                          >
                            <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Who received the serve? (Team 2 - Dark Charcoal) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep === "whoReceived" ? "" : "whoReceived")}
                    className="w-full bg-[#3c444c] text-white px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-[#464f58] transition-colors"
                  >
                    <span>Who received the serve? <span className="font-normal ml-2 font-mono text-slate-200">{selectedReceiver ? `#${selectedReceiver.num}` : ""}</span></span>
                    {activeStep === "whoReceived" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {activeStep === "whoReceived" && (
                    <div className="p-3 bg-[#3c444c] text-white border-t border-neutral-700">
                      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                        {team2Roster.map(ath => (
                          <button
                            key={ath.num}
                            type="button"
                            onClick={() => {
                              setSelectedReceiver(ath);
                              setActiveStep("rateReceive");
                            }}
                            className={`p-1.5 text-left font-sans text-[11px] rounded cursor-pointer ${selectedReceiver?.num === ath.num ? "bg-orange-500 text-white font-bold" : "hover:bg-neutral-600"}`}
                          >
                            <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Rate the serve receive. (Team 2 - Dark Charcoal) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep === "rateReceive" ? "" : "rateReceive")}
                    className="w-full bg-[#3c444c] text-white px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-[#464f58] transition-colors"
                  >
                    <span>Rate the serve receive. <span className="font-normal ml-2 font-mono text-slate-200">{serveRating !== null ? serveRating : ""}</span></span>
                    {activeStep === "rateReceive" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {activeStep === "rateReceive" && (
                    <div className="p-3 bg-[#2b3137] flex justify-around">
                      {[0, 1, 2, 3].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setServeRating(r);
                            setActiveStep("whoSentFreeBall");
                          }}
                          className={`w-12 h-10 rounded font-bold text-sm transition-all cursor-pointer ${serveRating === r ? "bg-orange-500 text-white shadow-lg" : "bg-neutral-800 text-slate-300 hover:bg-neutral-700"}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Who sent the free ball? (Team 2 - Dark Charcoal) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep === "whoSentFreeBall" ? "" : "whoSentFreeBall")}
                    className="w-full bg-[#3c444c] text-white px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-[#464f58] transition-colors"
                  >
                    <span>Who sent the free ball? <span className="font-normal ml-2 font-mono text-slate-200">{freeBallSender ? `#${freeBallSender.num} ${freeBallSender.name}` : ""}</span></span>
                    {activeStep === "whoSentFreeBall" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {activeStep === "whoSentFreeBall" && (
                    <div className="p-3 bg-[#3c444c] text-white">
                      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                        {team2Roster.map(ath => (
                          <button
                            key={ath.num}
                            type="button"
                            onClick={() => {
                              setFreeBallSender(ath);
                              setActiveStep("whoReceivedFreeBall");
                            }}
                            className={`p-1.5 text-left font-sans text-[11px] rounded cursor-pointer ${freeBallSender?.num === ath.num ? "bg-orange-500 text-white font-bold" : "hover:bg-neutral-600"}`}
                          >
                            <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Who received the free ball? (MHS - White) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep === "whoReceivedFreeBall" ? "" : "whoReceivedFreeBall")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who received the free ball? <span className="font-normal ml-2 font-mono text-neutral-700">{freeBallReceiver ? `#${freeBallReceiver.num} ${freeBallReceiver.name}` : ""}</span></span>
                    {activeStep === "whoReceivedFreeBall" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeStep === "whoReceivedFreeBall" && (
                    <div className="p-3 bg-white text-neutral-900">
                      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                        {mhsRoster.map(ath => (
                          <button
                            key={ath.num}
                            type="button"
                            onClick={() => {
                              setFreeBallReceiver(ath);
                              setActiveStep("whoAssisted");
                            }}
                            className={`p-1.5 text-left font-sans text-[11px] rounded cursor-pointer ${freeBallReceiver?.num === ath.num ? "bg-orange-500 text-white font-bold" : "hover:bg-neutral-100"}`}
                          >
                            <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Who assisted? (MHS - White) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep === "whoAssisted" ? "" : "whoAssisted")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who assisted? <span className="font-normal ml-2 font-mono text-neutral-700">{assistingPlayer ? `#${assistingPlayer.num} ${assistingPlayer.name}` : ""}</span></span>
                    {activeStep === "whoAssisted" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeStep === "whoAssisted" && (
                    <div className="p-3 bg-white text-neutral-900">
                      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                        {mhsRoster.map(ath => (
                          <button
                            key={ath.num}
                            type="button"
                            onClick={() => {
                              setAssistingPlayer(ath);
                              setActiveStep("whoGotKill");
                            }}
                            className={`p-1.5 text-left font-sans text-[11px] rounded cursor-pointer ${assistingPlayer?.num === ath.num ? "bg-orange-500 text-white font-bold" : "hover:bg-neutral-100"}`}
                          >
                            <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 7. Who got the kill? (MHS - White) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep === "whoGotKill" ? "" : "whoGotKill")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who got the kill? <span className="font-normal ml-2 font-mono text-neutral-700">{killingPlayer ? `#${killingPlayer.num}` : ""}</span></span>
                    {activeStep === "whoGotKill" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeStep === "whoGotKill" && (
                    <div className="p-3 bg-white text-neutral-900">
                      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                        {mhsRoster.map(ath => (
                          <button
                            key={ath.num}
                            type="button"
                            onClick={() => {
                              setKillingPlayer(ath);
                              setActiveStep("attackLocation");
                            }}
                            className={`p-1.5 text-left font-sans text-[11px] rounded cursor-pointer ${killingPlayer?.num === ath.num ? "bg-orange-500 text-white font-bold" : "hover:bg-neutral-100"}`}
                          >
                            <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 8. Where did the attack occur? (MHS - White) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep === "attackLocation" ? "" : "attackLocation")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Where did the attack occur?</span>
                    {activeStep === "attackLocation" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  
                  {activeStep === "attackLocation" && (
                    <div className="p-4 bg-white text-neutral-900 flex flex-col gap-3">
                      
                      {/* Deflected Checkbox */}
                      <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={attackDeflected}
                            onChange={(e) => setAttackDeflected(e.target.checked)}
                            className="w-4 h-4 rounded text-orange-500 focus:ring-0 cursor-pointer"
                          />
                          <span className="font-semibold text-neutral-800">Attack was deflected</span>
                        </label>
                        <MoveHorizontal className="w-4 h-4 text-neutral-500" />
                      </div>

                      {/* 2D Court SVG with Frontcourt grey fill, Solid 3m lines, Dashed zone lines */}
                      <div className="relative rounded-lg bg-[#cfd4dc] p-3 shadow-inner">
                        <svg
                          viewBox="0 0 240 120"
                          className="w-full h-36 cursor-crosshair select-none bg-[#cfd4dc]"
                          onClick={handleCourtClick}
                        >
                          {/* Left Half Court */}
                          <rect x="20" y="15" width="95" height="90" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                          {/* Left Frontcourt (between 3m line and net) */}
                          <rect x="83" y="15" width="32" height="90" fill="#e8ecef" stroke="#000000" strokeWidth="2" />

                          {/* Right Half Court */}
                          <rect x="125" y="15" width="95" height="90" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                          {/* Right Frontcourt (between net and 3m line) */}
                          <rect x="125" y="15" width="32" height="90" fill="#e8ecef" stroke="#000000" strokeWidth="2" />

                          {/* Thick Center Net (extending slightly beyond court top and bottom) */}
                          <line x1="120" y1="8" x2="120" y2="112" stroke="#000000" strokeWidth="4" />

                          {/* Dashed Zone Lines (2 horizontal across the whole diagram) */}
                          <line x1="0" y1="45" x2="240" y2="45" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="0" y1="75" x2="240" y2="75" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

                          {/* Dashed Zone Lines (Vertical across each 3m section) */}
                          <line x1="51" y1="0" x2="51" y2="120" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="83" y1="0" x2="83" y2="120" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="157" y1="0" x2="157" y2="120" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="189" y1="0" x2="189" y2="120" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

                          {/* Landing Black Cross (+) */}
                          {attackLocation ? (
                            <g transform={`translate(${attackLocation.x}, ${attackLocation.y})`}>
                              <line x1="-7" y1="0" x2="7" y2="0" stroke="#000000" strokeWidth="2.5" />
                              <line x1="0" y1="-7" x2="0" y2="7" stroke="#000000" strokeWidth="2.5" />
                            </g>
                          ) : (
                            <g transform="translate(104, 52)">
                              <line x1="-7" y1="0" x2="7" y2="0" stroke="#000000" strokeWidth="2.5" />
                              <line x1="0" y1="-7" x2="0" y2="7" stroke="#000000" strokeWidth="2.5" />
                            </g>
                          )}
                        </svg>
                      </div>

                      <div className="text-[11px] text-neutral-500 text-center italic">
                        Click on the court to place the landing mark (+) and complete tag
                      </div>

                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* MODE 3: "POST ATTACK KILL" PANEL (Video Frame 10 at 50s)  */}
          {/* ========================================================= */}
          {taggerMode === "POST_KILL" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 flex flex-col">
                
                {/* Subheader */}
                <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between text-neutral-900 font-bold text-xs flex-shrink-0">
                  <span className="font-extrabold">{currentActionTitle}</span>
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="flex items-center gap-1 text-[11px] text-neutral-700 hover:text-black cursor-pointer font-semibold"
                  >
                    <Undo className="w-3.5 h-3.5" />
                    <span>Undo (U)</span>
                  </button>
                </div>

                {/* Dual Columns: MHS (White) vs Team 2 (Dark) */}
                <div className="flex-1 grid grid-cols-2">
                  
                  {/* Left Column: MHS */}
                  <div className="bg-[#f0f2f5] border-r border-neutral-300 flex flex-col">
                    <div className="p-3 font-extrabold text-neutral-900 text-sm border-b border-neutral-300 bg-white">
                      MHS
                    </div>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={handleStartMhsServeError}
                        className="w-full text-left px-4 py-3 bg-white hover:bg-slate-100 text-neutral-900 font-bold border-b border-neutral-300 cursor-pointer transition-colors shadow-2xs"
                      >
                        Serve
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerAlert("info", "Violation logged for MHS")}
                        className="w-full text-left px-4 py-3 bg-white hover:bg-slate-100 text-neutral-900 font-bold border-b border-neutral-300 cursor-pointer transition-colors"
                      >
                        Violation
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Team 2 */}
                  <div className="bg-[#9da3a8] flex flex-col">
                    <div className="p-3 font-extrabold text-white text-sm bg-[#4a5259] border-b border-neutral-600">
                      Team 2
                    </div>
                    <div className="flex flex-col">
                      <div className="h-12 border-b border-neutral-500/40" />
                      <button
                        type="button"
                        onClick={() => triggerAlert("info", "Violation logged for Team 2")}
                        className="w-full text-left px-4 py-3 bg-[#4a5259] hover:bg-[#565e66] text-white font-bold border-b border-neutral-600 cursor-pointer transition-colors"
                      >
                        Violation
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Buttons: Problem Report & Save and Exit */}
              <div className="p-3 bg-[#111417] border-t border-neutral-800 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowProblemReportModal(true)}
                  className="w-full py-2 bg-[#262c33] hover:bg-[#323942] text-slate-300 font-bold text-xs rounded transition-colors"
                >
                  Problem Report
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onSave) onSave(timelineTags);
                    onClose();
                  }}
                  className="w-full py-2 bg-[#1b2025] hover:bg-[#252c33] text-slate-200 font-bold text-xs rounded border border-neutral-700 transition-colors"
                >
                  Save and Exit
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* MODE 4: "SERVE ERROR" FLOW (Video Frame 11 at 55s)        */}
          {/* ========================================================= */}
          {taggerMode === "SERVE_ERROR" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="h-9 bg-[#111417] border-b border-neutral-800 px-4 flex items-center justify-center flex-shrink-0">
                <span className="font-extrabold text-xs tracking-wider text-slate-100 font-sans">
                  Complete the Tag
                </span>
              </div>

              {/* Subheader */}
              <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between text-neutral-900 font-bold text-xs flex-shrink-0">
                <span className="font-extrabold">{currentActionTitle}</span>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="flex items-center gap-1 text-[11px] text-neutral-700 hover:text-black cursor-pointer font-semibold"
                >
                  <Undo className="w-3.5 h-3.5" />
                  <span>Undo (U)</span>
                </button>
              </div>

              {/* Question: Who served the error? */}
              <div className="flex-1 bg-white p-4 flex flex-col justify-between overflow-y-auto">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between font-bold text-neutral-900 text-xs pb-2 border-b border-neutral-200">
                    <span>Who served the error?</span>
                    <ChevronUp className="w-4 h-4 text-neutral-500" />
                  </div>

                  {/* 3-Column Roster Grid */}
                  <div className="grid grid-cols-3 gap-y-3 gap-x-1 text-neutral-900 text-xs">
                    {mhsRoster.map(ath => (
                      <button
                        key={ath.num}
                        type="button"
                        onClick={() => handleSelectServeErrorAthlete(ath)}
                        className={`p-1.5 text-left font-sans text-[11px] rounded transition-colors cursor-pointer ${ath.num === 10 ? "bg-orange-100 font-bold border border-orange-400" : "hover:bg-neutral-100"}`}
                      >
                        <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex justify-between text-[11px] text-neutral-700">
                  <button type="button" className="hover:underline">Unknown Athlete</button>
                  <button type="button" className="flex items-center gap-1 hover:underline"><Pencil className="w-3 h-3" /> Edit Roster</button>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* MODE 5: "POST SERVE ERROR" PANEL (Video Frame 12 at 60s)  */}
          {/* ========================================================= */}
          {taggerMode === "POST_ERROR" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 flex flex-col">
                
                {/* Subheader */}
                <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between text-neutral-900 font-bold text-xs flex-shrink-0">
                  <span className="font-extrabold">{currentActionTitle}</span>
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="flex items-center gap-1 text-[11px] text-neutral-700 hover:text-black cursor-pointer font-semibold"
                  >
                    <Undo className="w-3.5 h-3.5" />
                    <span>Undo (U)</span>
                  </button>
                </div>

                {/* Two Columns: Team 2 Serves Next! */}
                <div className="flex-1 grid grid-cols-2">
                  
                  {/* Left Column: MHS */}
                  <div className="bg-[#f0f2f5] border-r border-neutral-300 flex flex-col">
                    <div className="p-3 font-extrabold text-neutral-900 text-sm border-b border-neutral-300 bg-white">
                      MHS
                    </div>
                    <div className="flex flex-col">
                      <div className="h-12 border-b border-neutral-300/40" />
                      <button
                        type="button"
                        onClick={() => triggerAlert("info", "Violation logged for MHS")}
                        className="w-full text-left px-4 py-3 bg-white hover:bg-slate-100 text-neutral-900 font-bold border-b border-neutral-300 cursor-pointer transition-colors"
                      >
                        Violation
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Team 2 (Gets Serve!) */}
                  <div className="bg-[#9da3a8] flex flex-col">
                    <div className="p-3 font-extrabold text-white text-sm bg-[#4a5259] border-b border-neutral-600">
                      Team 2
                    </div>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => {
                          setTaggerMode("DUAL_INITIAL");
                          setCurrentActionTitle("Team 2 Serve");
                          triggerAlert("info", "Team 2 Serve flow initiated");
                        }}
                        className="w-full text-left px-4 py-3 bg-white hover:bg-slate-100 text-neutral-900 font-bold border-b border-neutral-600 cursor-pointer transition-colors"
                      >
                        Serve
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerAlert("info", "Violation logged for Team 2")}
                        className="w-full text-left px-4 py-3 bg-[#4a5259] hover:bg-[#565e66] text-white font-bold border-b border-neutral-600 cursor-pointer transition-colors"
                      >
                        Violation
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Buttons */}
              <div className="p-3 bg-[#111417] border-t border-neutral-800 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowProblemReportModal(true)}
                  className="w-full py-2 bg-[#262c33] hover:bg-[#323942] text-slate-300 font-bold text-xs rounded transition-colors"
                >
                  Problem Report
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onSave) onSave(timelineTags);
                    onClose();
                  }}
                  className="w-full py-2 bg-[#1b2025] hover:bg-[#252c33] text-slate-200 font-bold text-xs rounded border border-neutral-700 transition-colors"
                >
                  Save and Exit
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. MODALS                                                     */}
      {/* ------------------------------------------------------------- */}

      {/* A. Coach Notes Modal */}
      {showCoachNotes && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#191F24] border border-neutral-800 rounded-lg p-5 flex flex-col gap-4 text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-500" />
                Coach Tactical Notes
              </h3>
              <button type="button" onClick={() => setShowCoachNotes(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <textarea
              value={coachNotesText}
              onChange={(e) => setCoachNotesText(e.target.value)}
              rows={4}
              placeholder="Enter rotation notes or specific coaching observations..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-sans"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowCoachNotes(false)}
                className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCoachNotes(false);
                  triggerAlert("success", "Coach notes saved successfully.");
                }}
                className="px-4 py-1.5 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. Problem Report Modal */}
      {showProblemReportModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#191F24] border border-neutral-800 rounded-lg p-5 flex flex-col gap-4 text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Problem Report - Match Issue
              </h3>
              <button type="button" onClick={() => setShowProblemReportModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1">Issue Category *</label>
                <select
                  value={problemReportCategory}
                  onChange={(e) => setProblemReportCategory(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-white"
                >
                  <option value="Camera Angle Issue">Camera Angle Issue</option>
                  <option value="Video Stutter / Corrupted">Video Stutter / Corrupted</option>
                  <option value="Wrong Jersey Color / Number">Wrong Jersey Color / Number</option>
                  <option value="Scoreboard Out of Sync">Scoreboard Out of Sync</option>
                  <option value="Audio / Whistle Inaudible">Audio / Whistle Inaudible</option>
                  <option value="Other">Other Problem</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Details / Timestamp Notes</label>
                <textarea
                  value={problemReportNotes}
                  onChange={(e) => setProblemReportNotes(e.target.value)}
                  rows={3}
                  placeholder="Describe the issue at current playback timestamp..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowProblemReportModal(false)}
                className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProblemReportModal(false);
                  triggerAlert("success", "Problem report filed to QA review queue.");
                }}
                className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* C. Options Modal */}
      {showOptionsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#191F24] border border-neutral-800 rounded-lg p-5 flex flex-col gap-4 text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                Tagging Preferences & Hotkeys
              </h3>
              <button type="button" onClick={() => setShowOptionsModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-slate-300">
              <div className="flex justify-between items-center">
                <span>Playback Speed</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => {
                    const spd = parseFloat(e.target.value);
                    setPlaybackSpeed(spd);
                    if (videoRef.current) videoRef.current.playbackRate = spd;
                  }}
                  className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-white"
                >
                  <option value="0.5">0.5x Slow</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1.0x Normal</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x Fast</option>
                  <option value="2">2.0x</option>
                </select>
              </div>

              <div className="p-3 rounded bg-neutral-900 border border-neutral-800 space-y-1.5 font-mono text-[11px]">
                <div className="font-bold text-white font-sans mb-1 text-xs">Keyboard Shortcuts</div>
                <div className="flex justify-between"><span>Play / Pause</span><span className="text-orange-400 font-bold">Space</span></div>
                <div className="flex justify-between"><span>Undo Action</span><span className="text-orange-400 font-bold">U</span></div>
                <div className="flex justify-between"><span>Step Frame Back</span><span className="text-slate-400">◀ Arrow</span></div>
                <div className="flex justify-between"><span>Step Frame Fwd</span><span className="text-slate-400">▶ Arrow</span></div>
                <div className="flex justify-between"><span>Save and Exit</span><span className="text-slate-400">Esc</span></div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowOptionsModal(false)}
                className="px-5 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
