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
  Check, 
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

  // Mode: "DUAL_COLUMN_INITIAL" | "COMPLETE_THE_TAG" | "POST_ATTACK_KILL" | "SERVE_ERROR" | "POST_SERVE_ERROR"
  const [taggerMode, setTaggerMode] = useState<"DUAL_COLUMN_INITIAL" | "COMPLETE_THE_TAG" | "POST_ATTACK_KILL" | "SERVE_ERROR" | "POST_SERVE_ERROR">("COMPLETE_THE_TAG");
  const [currentActionTitle, setCurrentActionTitle] = useState("MHS Attack Kill");

  // Complete the Tag Accordion state
  const [activeAccordionStep, setActiveAccordionStep] = useState<string>("attackLocation");
  
  // Accordion values (matching the exact video flow!)
  const [selectedServer, setSelectedServer] = useState<Athlete>({ num: 9, name: "K. Sable" });
  const [selectedReceiver, setSelectedReceiver] = useState<Athlete>({ num: 15, name: "Unknown" });
  const [serveRating, setServeRating] = useState<number>(1);
  const [freeBallSender, setFreeBallSender] = useState<Athlete>({ num: 2, name: "M. Barfield" });
  const [freeBallReceiver, setFreeBallReceiver] = useState<Athlete>({ num: 9, name: "K. Sable" });
  const [assistingPlayer, setAssistingPlayer] = useState<Athlete>({ num: 2, name: "A. Bragg" });
  const [killingPlayer, setKillingPlayer] = useState<Athlete>({ num: 18, name: "Unknown" });
  const [errorServer, setErrorServer] = useState<Athlete | null>(null);

  // Active focused tag on timeline
  const [activeFocusedTagId, setActiveFocusedTagId] = useState<string>("t_kill18");

  // 2D Court Vector (Origin Blue Dot -> Landing Black Cross)
  // Matching video at 41s: Attack landing cross near net on left court, origin near net right
  const [attackStart, setAttackStart] = useState<{ x: number; y: number } | null>({ x: 135, y: 50 });
  const [attackEnd, setAttackEnd] = useState<{ x: number; y: number } | null>({ x: 105, y: 50 });
  const [attackDeflected, setAttackDeflected] = useState(false);

  // Multi-track timeline tags matching the exact video frames!
  const [timelineTags, setTimelineTags] = useState<TimelineTag[]>([
    // === RALLY 1 (Previous play: 01:29:30 - 01:30:00) ===
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
    { id: "r1_18", label: "Dig #10", timeSec: 5399, trackIndex: 3, theme: "dark", team: "away" },

    // === RALLY 2 (Current play in video: 01:30:20 - 01:30:35) ===
    { id: "t_serve9", label: "Serve #9", timeSec: 5420, trackIndex: 0, theme: "light", team: "home" },
    { id: "t_set2", label: "Set #2", timeSec: 5428, trackIndex: 0, theme: "light", team: "home" },

    { id: "t_sr15", label: "Serve Receive #15", timeSec: 5422, trackIndex: 1, theme: "dark", team: "away" },
    { id: "t_kill18", label: "Attack Kill #18", timeSec: 5430, trackIndex: 1, theme: "highlight", team: "home" },

    { id: "t_fb2", label: "Free Ball #2", timeSec: 5424, trackIndex: 2, theme: "dark", team: "away" },

    { id: "t_fbr9", label: "Free Ball Receive #9", timeSec: 5426, trackIndex: 3, theme: "dark", team: "home" }
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
    if (taggerMode === "POST_SERVE_ERROR") {
      setTaggerMode("SERVE_ERROR");
      setAwayScore(5);
      setTimelineTags(prev => prev.filter(t => !t.label.includes("Serve Error")));
      triggerAlert("info", "Undid Serve Error");
    } else if (taggerMode === "SERVE_ERROR") {
      setTaggerMode("POST_ATTACK_KILL");
      triggerAlert("info", "Returned to Post-Kill options");
    } else if (taggerMode === "POST_ATTACK_KILL") {
      setTaggerMode("COMPLETE_THE_TAG");
      setHomeScore(10);
      triggerAlert("info", "Undid Attack Kill completion");
    } else if (taggerMode === "COMPLETE_THE_TAG") {
      setTaggerMode("DUAL_COLUMN_INITIAL");
      triggerAlert("info", "Undid Complete the Tag");
    } else {
      triggerAlert("info", "Last action undone (U)");
    }
  };

  // Step finishing: Save Attack Kill
  const handleFinishAttackKillTag = () => {
    // 1. Increment MHS score from 10 to 11
    setHomeScore(11);
    
    // 2. Set current time to 1:30:44 (exact timestamp in video frame 10)
    setCurrentTime(5444);
    if (videoRef.current) {
      videoRef.current.currentTime = 24;
    }

    triggerAlert("success", `Point MHS! Attack Kill #${killingPlayer.num} confirmed (11 - 5).`);

    // 3. Move to Post Attack Kill panel state (as in video frame 10 at 50s)
    setTaggerMode("POST_ATTACK_KILL");
    setCurrentActionTitle("MHS Attack Kill");
    setActiveFocusedTagId("");
  };

  // Clicking "Serve" in MHS column after Attack Kill
  const handleStartMhsServe = () => {
    // Video advances to 1:30:48 (frame 11)
    setCurrentTime(5448);
    if (videoRef.current) {
      videoRef.current.currentTime = 28;
    }

    setTaggerMode("SERVE_ERROR");
    setCurrentActionTitle("MHS Serve Error");
    setActiveAccordionStep("whoServedError");
    setActiveFocusedTagId("t_error_pending");
  };

  // Step finishing: Save Serve Error
  const handleSelectServeErrorAthlete = (ath: Athlete) => {
    setErrorServer(ath);
    // Team 2 score increments from 5 to 6 (Side-out)
    setAwayScore(6);

    // Video advances to 1:30:51 (exact timestamp in video frame 12 at 60s)
    setCurrentTime(5451);
    if (videoRef.current) {
      videoRef.current.currentTime = 31;
    }

    // Add Serve Error #10 to Track 0
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

    triggerAlert("success", `Point Team 2! Serve Error #${ath.num} logged (11 - 6). Team 2 serves next.`);

    // Move to Post Serve Error state (as in video frame 12: Team 2 gets Serve button)
    setTaggerMode("POST_SERVE_ERROR");
    setCurrentActionTitle("MHS Serve Error");
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#12161a] text-white flex flex-col font-sans select-none overflow-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER MATCH BAR                                       */}
      {/* ------------------------------------------------------------- */}
      <div className="h-10 bg-[#191F24] border-b border-neutral-800 px-4 flex items-center justify-between text-xs flex-shrink-0 z-40">
        
        {/* Left: Back / Exit */}
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

        {/* Center: Match Live Scoreboard */}
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
          
          {/* End Set or Match Dropdown */}
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
                    triggerAlert("info", "Match concluded as completed.");
                    if (onSave) onSave(timelineTags);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-neutral-700 transition-colors"
                >
                  End Full Match
                </button>
              </div>
            )}
          </div>

          {/* Coach Notes Button */}
          <button
            type="button"
            onClick={() => setShowCoachNotes(true)}
            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-slate-200 rounded text-xs border border-neutral-700 cursor-pointer font-medium"
          >
            Coach Notes
          </button>

          {/* Options Button */}
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
                  // Keep simulated timeline clock synchronized
                  const base = taggerMode === "POST_SERVE_ERROR" ? 5451 : taggerMode === "SERVE_ERROR" ? 5448 : taggerMode === "POST_ATTACK_KILL" ? 5444 : 5420;
                  setCurrentTime(base + Math.floor(videoRef.current.currentTime));
                }
              }}
            />

            {/* B. LED Digital Scoreboard Graphic Overlay (Bottom-Left Corner) */}
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

          {/* C. Orange Scrubber + Video Transport Bar */}
          <div className="h-10 bg-[#14181c] border-t border-neutral-800 px-4 flex items-center justify-between text-xs text-slate-300 flex-shrink-0 z-10 relative">
            
            {/* Bright Orange Scrubber Bar along top edge */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-neutral-800">
              <div 
                className="h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, ((currentTime - 5350) / 150) * 100))}%` }}
              />
            </div>

            {/* Left Transport Controls */}
            <div className="flex items-center gap-2.5">
              <button 
                type="button" 
                onClick={() => handleSeek(-100)} 
                className="hover:text-white cursor-pointer"
                title="To Start"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>
              <button 
                type="button" 
                onClick={() => handleSeek(-1)} 
                className="hover:text-white cursor-pointer text-[11px] font-bold font-mono"
                title="Frame Back"
              >
                ◀◀
              </button>
              <button 
                type="button" 
                onClick={() => handleSeek(-0.2)} 
                className="hover:text-white cursor-pointer text-[11px] font-bold font-mono"
                title="Step Back"
              >
                ◀
              </button>
              <button 
                type="button" 
                onClick={() => handleSeek(-5)} 
                className="hover:text-white cursor-pointer flex items-center"
                title="Replay 5s"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono ml-0.5">5</span>
              </button>
              
              {/* Play/Pause */}
              <button 
                type="button" 
                onClick={togglePlay} 
                className="w-7 h-7 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white cursor-pointer shadow transition-colors"
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>

              <button 
                type="button" 
                onClick={() => handleSeek(5)} 
                className="hover:text-white cursor-pointer flex items-center"
                title="Skip 5s"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono ml-0.5">5</span>
              </button>
              <button 
                type="button" 
                onClick={() => handleSeek(0.2)} 
                className="hover:text-white cursor-pointer text-[11px] font-bold font-mono"
                title="Step Forward"
              >
                ▶
              </button>
              <button 
                type="button" 
                onClick={() => handleSeek(1)} 
                className="hover:text-white cursor-pointer text-[11px] font-bold font-mono"
                title="Frame Forward"
              >
                ▶▶
              </button>
              <button 
                type="button" 
                onClick={() => handleSeek(15)} 
                className="hover:text-white cursor-pointer"
                title="Next Clip"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              {/* Timecode */}
              <span className="font-mono text-xs text-slate-300 ml-2 font-bold">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>

            {/* Right Quick Controls */}
            <div className="flex items-center gap-3 text-slate-400">
              <button 
                type="button" 
                onClick={() => setIsMuted(!isMuted)} 
                className="hover:text-white cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button 
                type="button" 
                onClick={() => setShowOptionsModal(true)} 
                className="hover:text-white cursor-pointer"
                title="Settings"
              >
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
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* D. Multi-Track Timeline (4 Tracks, Dimmed Past Rally, Exact Video Blocks) */}
          <div className="h-36 bg-[#0c0f12] border-t border-neutral-900 px-4 py-2 flex flex-col justify-between flex-shrink-0 relative overflow-hidden">
            
            {/* Timeline Viewport Container */}
            <div className="relative w-full flex-1 overflow-hidden">
              
              {/* Vertical Playhead Cursor (White Line with Center Handle) */}
              <div 
                className="absolute top-0 bottom-0 w-[1.5px] bg-white z-30 pointer-events-none flex items-center justify-center"
                style={{ 
                  left: taggerMode === "POST_SERVE_ERROR" ? "68%" : taggerMode === "SERVE_ERROR" ? "60%" : "48%" 
                }}
              >
                <div className="w-3 h-4 rounded-xs bg-white text-black text-[8px] flex items-center justify-center font-bold shadow -ml-[0.5px]">
                  ≡
                </div>
              </div>

              {/* 4 Track Dividing Lines */}
              <div className="absolute inset-x-0 top-[25%] h-[1px] bg-neutral-900/80" />
              <div className="absolute inset-x-0 top-[50%] h-[1px] bg-neutral-900/80" />
              <div className="absolute inset-x-0 top-[75%] h-[1px] bg-neutral-900/80" />

              {/* Render Tag Blocks on 4 Tracks */}
              {timelineTags.map((tag) => {
                // Calculation for position along 01:29:30 - 01:31:30 (120s window)
                const baseTime = 5420; // 01:30:20
                const offsetSec = tag.timeSec - baseTime;
                
                // Shift window smoothly when progressing to serve error
                const windowOffset = taggerMode === "POST_SERVE_ERROR" ? -18 : taggerMode === "SERVE_ERROR" ? -10 : 0;
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
                    className={`absolute text-[10px] font-medium px-2 py-0.5 cursor-pointer whitespace-nowrap transition-all border select-none ${
                      isFocused
                        ? "bg-white text-black border-2 border-white font-extrabold shadow-[0_0_10px_rgba(255,255,255,0.7)] z-20 scale-105"
                        : tag.theme === "dark"
                        ? `bg-[#181d24] text-slate-200 border-neutral-700 ${isPreviousRally ? "opacity-50" : "opacity-90"}`
                        : `bg-[#e2e8f0] text-neutral-950 border-neutral-300 font-semibold ${isPreviousRally ? "opacity-50" : "opacity-100"}`
                    }`}
                    style={{
                      top: `${tag.trackIndex * 22}px`,
                      left: `${leftPercent}%`,
                      height: "19px",
                      lineHeight: "13px"
                    }}
                  >
                    {isFocused && <span className="text-orange-600 font-mono mr-1">▶</span>}
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
                    left: "58%",
                    height: "19px",
                    lineHeight: "13px"
                  }}
                >
                  <span className="animate-pulse mr-1">●</span> Serve Error
                </div>
              )}
            </div>

            {/* Bottom Timecode Marks matching video (30-second intervals) */}
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
        {/* RIGHT COLUMN: TAGGING PANEL (Exact Same-To-Same UI)         */}
        {/* =========================================================== */}
        <div className="w-80 md:w-96 bg-[#161a1e] border-l border-neutral-800 flex flex-col justify-between flex-shrink-0 z-30">
          
          {/* ========================================================= */}
          {/* CASE A: "COMPLETE THE TAG" ACCORDION FLOW (Attack Kill)   */}
          {/* ========================================================= */}
          {taggerMode === "COMPLETE_THE_TAG" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Top Bar Header */}
              <div className="h-9 bg-[#111417] border-b border-neutral-800 px-4 flex items-center justify-center flex-shrink-0">
                <span className="font-extrabold text-xs tracking-wider text-slate-100 font-sans">
                  Complete the Tag
                </span>
              </div>

              {/* Action Banner + Undo */}
              <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between text-neutral-900 font-bold text-xs flex-shrink-0 shadow-xs">
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

              {/* Accordion Steps List */}
              <div className="flex-1 overflow-y-auto bg-neutral-900 divide-y divide-neutral-800 text-xs">
                
                {/* 1. Who served? */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveAccordionStep(activeAccordionStep === "whoServed" ? "" : "whoServed")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who served? <span className="font-normal ml-2 font-mono text-neutral-700">#{selectedServer.num} {selectedServer.name}</span></span>
                    {activeAccordionStep === "whoServed" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                </div>

                {/* 2. Who received the serve? */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveAccordionStep(activeAccordionStep === "whoReceived" ? "" : "whoReceived")}
                    className="w-full bg-[#3c444c] text-white px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-[#464f58] transition-colors"
                  >
                    <span>Who received the serve? <span className="font-normal ml-2 font-mono text-slate-200">#{selectedReceiver.num}</span></span>
                    {activeAccordionStep === "whoReceived" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>

                {/* 3. Rate the serve receive. */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveAccordionStep(activeAccordionStep === "rateReceive" ? "" : "rateReceive")}
                    className="w-full bg-[#3c444c] text-white px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-[#464f58] transition-colors"
                  >
                    <span>Rate the serve receive. <span className="font-normal ml-2 font-mono text-slate-200">{serveRating}</span></span>
                    {activeAccordionStep === "rateReceive" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  
                  {activeAccordionStep === "rateReceive" && (
                    <div className="p-3 bg-[#1e2329] flex justify-around">
                      {[0, 1, 2, 3].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setServeRating(r)}
                          className={`w-12 h-10 rounded font-bold text-sm transition-all ${serveRating === r ? "bg-orange-500 text-white shadow-lg" : "bg-neutral-800 text-slate-300 hover:bg-neutral-700"}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Who sent the free ball? */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveAccordionStep(activeAccordionStep === "whoSentFreeBall" ? "" : "whoSentFreeBall")}
                    className="w-full bg-[#3c444c] text-white px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-[#464f58] transition-colors"
                  >
                    <span>Who sent the free ball? <span className="font-normal ml-2 font-mono text-slate-200">#{freeBallSender.num} {freeBallSender.name}</span></span>
                    {activeAccordionStep === "whoSentFreeBall" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>

                {/* 5. Who received the free ball? */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveAccordionStep(activeAccordionStep === "whoReceivedFreeBall" ? "" : "whoReceivedFreeBall")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who received the free ball? <span className="font-normal ml-2 font-mono text-neutral-700">#{freeBallReceiver.num} {freeBallReceiver.name}</span></span>
                    {activeAccordionStep === "whoReceivedFreeBall" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  
                  {activeAccordionStep === "whoReceivedFreeBall" && (
                    <div className="p-3 bg-white text-neutral-900">
                      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                        {mhsRoster.map(ath => (
                          <button
                            key={ath.num}
                            type="button"
                            onClick={() => {
                              setFreeBallReceiver(ath);
                              setActiveAccordionStep("whoAssisted");
                            }}
                            className="p-1.5 text-left font-sans text-[11px] hover:bg-neutral-200 rounded cursor-pointer"
                          >
                            <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 pt-2 border-t border-neutral-200 flex justify-between text-[11px] text-neutral-700">
                        <button type="button" className="hover:underline">Unknown Athlete</button>
                        <button type="button" className="flex items-center gap-1 hover:underline"><Pencil className="w-3 h-3" /> Edit Roster</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Who assisted? */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveAccordionStep(activeAccordionStep === "whoAssisted" ? "" : "whoAssisted")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who assisted? <span className="font-normal ml-2 font-mono text-neutral-700">#{assistingPlayer.num} {assistingPlayer.name}</span></span>
                    {activeAccordionStep === "whoAssisted" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                </div>

                {/* 7. Who got the kill? */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveAccordionStep(activeAccordionStep === "whoGotKill" ? "" : "whoGotKill")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who got the kill? <span className="font-normal ml-2 font-mono text-neutral-700">#{killingPlayer.num}</span></span>
                    {activeAccordionStep === "whoGotKill" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  
                  {activeAccordionStep === "whoGotKill" && (
                    <div className="p-3 bg-white text-neutral-900">
                      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                        {mhsRoster.map(ath => (
                          <button
                            key={ath.num}
                            type="button"
                            onClick={() => {
                              setKillingPlayer(ath);
                              setActiveAccordionStep("attackLocation");
                            }}
                            className={`p-1.5 text-left font-sans text-[11px] rounded cursor-pointer ${killingPlayer.num === ath.num ? "bg-orange-500 text-white font-bold" : "hover:bg-neutral-200"}`}
                          >
                            <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 pt-2 border-t border-neutral-200 flex justify-between text-[11px] text-neutral-700">
                        <button type="button" className="hover:underline">Unknown Athlete</button>
                        <button type="button" className="flex items-center gap-1 hover:underline"><Pencil className="w-3 h-3" /> Edit Roster</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 8. Where did the attack occur? (2D Court Vector with Dashed Zones) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveAccordionStep(activeAccordionStep === "attackLocation" ? "" : "attackLocation")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Where did the attack occur?</span>
                    {activeAccordionStep === "attackLocation" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  
                  {activeAccordionStep === "attackLocation" && (
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

                      {/* 2D Court SVG (Rounded Grey Container, Solid Boundary, Net, 3m lines, Dashed Zones) */}
                      <div className="relative rounded-lg bg-[#cfd4dc] p-3 shadow-inner">
                        <svg
                          viewBox="0 0 240 120"
                          className="w-full h-32 cursor-crosshair select-none bg-white rounded-sm shadow-xs"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = Math.round(((e.clientX - rect.left) / rect.width) * 240);
                            const y = Math.round(((e.clientY - rect.top) / rect.height) * 120);

                            if (!attackStart) {
                              setAttackStart({ x, y });
                            } else if (!attackEnd) {
                              setAttackEnd({ x, y });
                            } else {
                              // Reset vector
                              setAttackStart({ x, y });
                              setAttackEnd(null);
                            }
                          }}
                        >
                          {/* Court Perimeter Rectangle */}
                          <rect x="15" y="15" width="210" height="90" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                          
                          {/* Center Net Line */}
                          <line x1="120" y1="10" x2="120" y2="110" stroke="#000000" strokeWidth="3.5" />
                          
                          {/* Solid 3-meter Attack Lines */}
                          <line x1="85" y1="15" x2="85" y2="105" stroke="#000000" strokeWidth="1.5" />
                          <line x1="155" y1="15" x2="155" y2="105" stroke="#000000" strokeWidth="1.5" />

                          {/* Dashed Zone Grid Lines (2 Horizontal) */}
                          <line x1="15" y1="45" x2="225" y2="45" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="15" y1="75" x2="225" y2="75" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

                          {/* Dashed Zone Grid Lines (Vertical on each side) */}
                          <line x1="50" y1="15" x2="50" y2="105" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="190" y1="15" x2="190" y2="105" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

                          {/* Marker Arrow Head */}
                          <defs>
                            <marker id="arrowhead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                              <path d="M 0 1 L 9 5 L 0 9 z" fill="#000000" />
                            </marker>
                          </defs>

                          {/* Connecting Arrow Vector */}
                          {attackStart && attackEnd && (
                            <line
                              x1={attackStart.x}
                              y1={attackStart.y}
                              x2={attackEnd.x}
                              y2={attackEnd.y}
                              stroke="#000000"
                              strokeWidth="2"
                              markerEnd="url(#arrowhead)"
                            />
                          )}

                          {/* Origin Blue Dot */}
                          {attackStart && (
                            <circle cx={attackStart.x} cy={attackStart.y} r="4.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                          )}

                          {/* Landing Black Cross (+) */}
                          {attackEnd && (
                            <g transform={`translate(${attackEnd.x}, ${attackEnd.y})`}>
                              <line x1="-5" y1="0" x2="5" y2="0" stroke="#000000" strokeWidth="2" />
                              <line x1="0" y1="-5" x2="0" y2="5" stroke="#000000" strokeWidth="2" />
                            </g>
                          )}
                        </svg>
                      </div>

                      {/* Finish & Save Tag Button */}
                      <button
                        type="button"
                        onClick={handleFinishAttackKillTag}
                        className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded text-xs cursor-pointer shadow transition-all flex items-center justify-center gap-1.5 mt-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save & Complete Attack Kill</span>
                      </button>

                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* CASE B: "POST ATTACK KILL" PANEL (Video Frame 10 at 50s)  */}
          {/* ========================================================= */}
          {taggerMode === "POST_ATTACK_KILL" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 flex flex-col">
                
                {/* Subheader with MHS Attack Kill & Undo */}
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

                {/* Two Columns: MHS (White) vs Team 2 (Dark) */}
                <div className="flex-1 grid grid-cols-2">
                  
                  {/* Left Column: MHS */}
                  <div className="bg-[#f0f2f5] border-r border-neutral-300 flex flex-col">
                    <div className="p-3 font-extrabold text-neutral-900 text-sm border-b border-neutral-300 bg-white">
                      MHS
                    </div>
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={handleStartMhsServe}
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
          {/* CASE C: "SERVE ERROR" ACCORDION FLOW (Video Frame 11 at 55s) */}
          {/* ========================================================= */}
          {taggerMode === "SERVE_ERROR" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="h-9 bg-[#111417] border-b border-neutral-800 px-4 flex items-center justify-center flex-shrink-0">
                <span className="font-extrabold text-xs tracking-wider text-slate-100 font-sans">
                  Complete the Tag
                </span>
              </div>

              {/* Action Banner + Undo */}
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

              {/* Single Expanded Item: Who served the error? */}
              <div className="flex-1 bg-white p-4 flex flex-col justify-between overflow-y-auto">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between font-bold text-neutral-900 text-xs pb-2 border-b border-neutral-200">
                    <span>Who served the error?</span>
                    <ChevronUp className="w-4 h-4 text-neutral-500" />
                  </div>

                  {/* 3-Column Roster Grid matching video exactly */}
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
          {/* CASE D: "POST SERVE ERROR" PANEL (Video Frame 12 at 60s)  */}
          {/* ========================================================= */}
          {taggerMode === "POST_SERVE_ERROR" && (
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

          {/* ========================================================= */}
          {/* CASE E: INITIAL DUAL COLUMN KEYPAD (Frame 0 at 00s)       */}
          {/* ========================================================= */}
          {taggerMode === "DUAL_COLUMN_INITIAL" && (
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

                {/* Dual Columns */}
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
                        className="w-full text-left px-4 py-3 bg-white hover:bg-slate-100 text-neutral-900 font-bold border-b border-neutral-300 cursor-pointer transition-colors"
                      >
                        Ace
                      </button>
                      <button
                        type="button"
                        onClick={handleStartMhsServe}
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
                        onClick={() => setTaggerMode("COMPLETE_THE_TAG")}
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
      {/* 3. MODALS (Coach Notes, Options, Problem Report)               */}
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
              placeholder="Enter specific rotation adjustments, blocking schemes, or server notes for coaches..."
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
