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
  MoveHorizontal,
  Plus,
  Trash2
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

export interface TimelineTag {
  id: string;
  label: string;
  timeSec: number;
  trackIndex: 0 | 1 | 2 | 3;
  theme: "light" | "dark" | "caliper";
  team: "home" | "away";
  isCaliper?: boolean;
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
  // 1. Match State
  const [homeTeam, setHomeTeam] = useState(match?.homeTeam || "MHS");
  const [awayTeam, setAwayTeam] = useState(match?.awayTeam || "Team 2");
  const [homeScore, setHomeScore] = useState(10);
  const [awayScore, setAwayScore] = useState(5);
  const [period, setPeriod] = useState("3rd");
  const [servingTeam, setServingTeam] = useState<"home" | "away">("home");

  // Rosters
  const [homeRoster, setHomeRoster] = useState<Athlete[]>(() => {
    if (match?.roster && match.roster.length > 0) {
      return match.roster.map((r: any, idx: number) => ({
        num: parseInt(r.jersey || `${idx + 1}`),
        name: r.name || `Player ${r.jersey || idx + 1}`
      }));
    }
    return defaultMHSRoster;
  });

  const [awayRoster, setAwayRoster] = useState<Athlete[]>(defaultTeam2Roster);

  // Video playback states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(5420); // 1:30:20
  const [totalDuration, setTotalDuration] = useState(10800); // 3:00:00
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Timeline resize height
  const [timelineHeight, setTimelineHeight] = useState(170);

  // Modals
  const [showCoachNotes, setShowCoachNotes] = useState(false);
  const [coachNotesText, setCoachNotesText] = useState("");
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showProblemReportModal, setShowProblemReportModal] = useState(false);
  const [problemReportCategory, setProblemReportCategory] = useState("Camera Angle Issue");
  const [problemReportNotes, setProblemReportNotes] = useState("");
  const [showEndSetMenu, setShowEndSetMenu] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);

  // Modes: "DUAL_KEYPAD" | "WATERFALL_RALLY" | "SERVE_ERROR_PROMPT"
  const [taggerMode, setTaggerMode] = useState<"DUAL_KEYPAD" | "WATERFALL_RALLY" | "SERVE_ERROR_PROMPT">("DUAL_KEYPAD");
  
  // Waterfall Step: "whoServed" | "whoReceived" | "rateReceive" | "whoSentFreeBall" | "whoReceivedFreeBall" | "whoAssisted" | "whoGotKill" | "attackLocation"
  const [activeWaterfallStep, setActiveWaterfallStep] = useState<string>("whoServed");

  // Current Waterfall Rally Selections
  const [rallySelections, setRallySelections] = useState<{
    server: Athlete | null;
    receiver: Athlete | null;
    receiveRating: number | null;
    freeBallSender: Athlete | null;
    freeBallReceiver: Athlete | null;
    assistingPlayer: Athlete | null;
    killingPlayer: Athlete | null;
    attackLocation: { x: number; y: number } | null;
    attackDeflected: boolean;
  }>({
    server: null,
    receiver: null,
    receiveRating: null,
    freeBallSender: null,
    freeBallReceiver: null,
    assistingPlayer: null,
    killingPlayer: null,
    attackLocation: null,
    attackDeflected: false
  });

  // Base timestamp for current rally
  const [rallyBaseTime, setRallyBaseTime] = useState<number>(5420);

  // Multi-track timeline tags (Pre-populated with Rally 1 from the video)
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

  // Active highlighted tag ID
  const [activeCaliperTagId, setActiveCaliperTagId] = useState<string>("");

  // History stack for Undo
  const [historyStack, setHistoryStack] = useState<any[]>([]);

  // Format seconds to H:MM:SS
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "u" || e.key === "U") {
        handleUndo();
      } else if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowLeft") {
        handleSeek(-1);
      } else if (e.key === "ArrowRight") {
        handleSeek(1);
      } else if (e.key === "Escape") {
        handleSaveAndExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, taggerMode, historyStack]);

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

  const saveHistorySnapshot = () => {
    setHistoryStack(prev => [
      ...prev,
      {
        homeScore,
        awayScore,
        servingTeam,
        taggerMode,
        activeWaterfallStep,
        rallySelections: { ...rallySelections },
        timelineTags: [...timelineTags]
      }
    ]);
  };

  const handleUndo = () => {
    if (historyStack.length === 0) {
      triggerAlert("info", "No actions to undo (U)");
      return;
    }
    const last = historyStack[historyStack.length - 1];
    setHistoryStack(prev => prev.slice(0, -1));
    setHomeScore(last.homeScore);
    setAwayScore(last.awayScore);
    setServingTeam(last.servingTeam);
    setTaggerMode(last.taggerMode);
    setActiveWaterfallStep(last.activeWaterfallStep);
    setRallySelections(last.rallySelections);
    setTimelineTags(last.timelineTags);
    triggerAlert("info", "Last action undone (U)");
  };

  // =========================================================================
  // WATERFALL MODEL: CLICK RIGHT OPTION -> TAG DROPS IMMEDIATELY BELOW
  // =========================================================================

  // 1. Initiate Rally Waterfall from Keypad
  const handleStartWaterfallRally = () => {
    saveHistorySnapshot();
    setRallyBaseTime(currentTime);
    setRallySelections({
      server: null,
      receiver: null,
      receiveRating: null,
      freeBallSender: null,
      freeBallReceiver: null,
      assistingPlayer: null,
      killingPlayer: null,
      attackLocation: null,
      attackDeflected: false
    });
    setTaggerMode("WATERFALL_RALLY");
    setActiveWaterfallStep("whoServed");
    setActiveCaliperTagId("");
  };

  // STEP 1: Who Served? -> DROPS TAG ON TRACK 1 (Row 1)
  const handleSelectServer = (ath: Athlete) => {
    saveHistorySnapshot();
    setRallySelections(prev => ({ ...prev, server: ath }));

    // Drop Tag on Track 0 (Row 1)
    const newTagId = `tag_srv_${Date.now()}`;
    const newTag: TimelineTag = {
      id: newTagId,
      label: `Serve #${ath.num}`,
      timeSec: rallyBaseTime,
      trackIndex: 0,
      theme: servingTeam === "home" ? "light" : "dark",
      team: servingTeam
    };

    setTimelineTags(prev => [...prev, newTag]);
    setActiveCaliperTagId(newTagId);

    // Auto-advance to Step 2
    setActiveWaterfallStep("whoReceived");
  };

  // STEP 2: Who Received? -> DROPS TAG ON TRACK 2 (Row 2, right below Serve!)
  const handleSelectReceiver = (ath: Athlete) => {
    saveHistorySnapshot();
    setRallySelections(prev => ({ ...prev, receiver: ath }));

    // Drop Tag on Track 1 (Row 2 - WATERFALL STEP DOWN)
    const newTagId = `tag_rec_${Date.now()}`;
    const receivingTeam = servingTeam === "home" ? "away" : "home";
    const newTag: TimelineTag = {
      id: newTagId,
      label: `Serve Receive #${ath.num}`,
      timeSec: rallyBaseTime + 2,
      trackIndex: 1,
      theme: receivingTeam === "home" ? "light" : "dark",
      team: receivingTeam
    };

    setTimelineTags(prev => [...prev, newTag]);
    setActiveCaliperTagId(newTagId);

    // Auto-advance to Step 3
    setActiveWaterfallStep("rateReceive");
  };

  // STEP 3: Rate Receive -> Attaches rating, advances to Free Ball Sender
  const handleRateReceive = (rating: number) => {
    saveHistorySnapshot();
    setRallySelections(prev => ({ ...prev, receiveRating: rating }));
    setActiveWaterfallStep("whoSentFreeBall");
  };

  // STEP 4: Who sent Free Ball? -> DROPS TAG ON TRACK 3 (Row 3, right below Receive!)
  const handleSelectFreeBallSender = (ath: Athlete) => {
    saveHistorySnapshot();
    setRallySelections(prev => ({ ...prev, freeBallSender: ath }));

    // Drop Tag on Track 2 (Row 3 - WATERFALL STEP DOWN)
    const newTagId = `tag_fb_${Date.now()}`;
    const senderTeam = servingTeam === "home" ? "away" : "home";
    const newTag: TimelineTag = {
      id: newTagId,
      label: `Free Ball #${ath.num}`,
      timeSec: rallyBaseTime + 4,
      trackIndex: 2,
      theme: senderTeam === "home" ? "light" : "dark",
      team: senderTeam
    };

    setTimelineTags(prev => [...prev, newTag]);
    setActiveCaliperTagId(newTagId);

    // Auto-advance to Step 5
    setActiveWaterfallStep("whoReceivedFreeBall");
  };

  // STEP 5: Who received Free Ball? -> DROPS TAG ON TRACK 4 (Row 4, right below Free Ball!)
  const handleSelectFreeBallReceiver = (ath: Athlete) => {
    saveHistorySnapshot();
    setRallySelections(prev => ({ ...prev, freeBallReceiver: ath }));

    // Drop Tag on Track 3 (Row 4 - WATERFALL STEP DOWN)
    const newTagId = `tag_fbr_${Date.now()}`;
    const receiverTeam = servingTeam;
    const newTag: TimelineTag = {
      id: newTagId,
      label: `Free Ball Receive #${ath.num}`,
      timeSec: rallyBaseTime + 6,
      trackIndex: 3,
      theme: receiverTeam === "home" ? "light" : "dark",
      team: receiverTeam
    };

    setTimelineTags(prev => [...prev, newTag]);
    setActiveCaliperTagId(newTagId);

    // Auto-advance to Step 6
    setActiveWaterfallStep("whoAssisted");
  };

  // STEP 6: Who Assisted? -> DROPS TAG ON TRACK 1 (Row 1, next to Serve!)
  const handleSelectAssistingPlayer = (ath: Athlete) => {
    saveHistorySnapshot();
    setRallySelections(prev => ({ ...prev, assistingPlayer: ath }));

    // Drop Tag on Track 0 (Row 1 - Set)
    const newTagId = `tag_set_${Date.now()}`;
    const newTag: TimelineTag = {
      id: newTagId,
      label: `Set #${ath.num}`,
      timeSec: rallyBaseTime + 8,
      trackIndex: 0,
      theme: servingTeam === "home" ? "light" : "dark",
      team: servingTeam
    };

    setTimelineTags(prev => [...prev, newTag]);
    setActiveCaliperTagId(newTagId);

    // Auto-advance to Step 7
    setActiveWaterfallStep("whoGotKill");
  };

  // STEP 7: Who Got Kill? -> DROPS TAG ON TRACK 2 (Row 2, next to Receive with CALIPER HANDLES!)
  const handleSelectKillingPlayer = (ath: Athlete) => {
    saveHistorySnapshot();
    setRallySelections(prev => ({ ...prev, killingPlayer: ath }));

    // Drop Tag on Track 1 (Row 2 - Attack Kill with Caliper Handles!)
    const newTagId = `tag_kill_${Date.now()}`;
    const newTag: TimelineTag = {
      id: newTagId,
      label: `Attack Kill #${ath.num}`,
      timeSec: rallyBaseTime + 10,
      trackIndex: 1,
      theme: "caliper",
      team: servingTeam,
      isCaliper: true
    };

    setTimelineTags(prev => [...prev, newTag]);
    setActiveCaliperTagId(newTagId);

    // Auto-advance to Step 8 (Court Click)
    setActiveWaterfallStep("attackLocation");
  };

  // STEP 8: Court Click -> Places '+', LOCKS CALIPER, INCREMENTS SCORE (10 -> 11), FINISHES RALLY!
  const handleCourtClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 240);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 120);

    setRallySelections(prev => ({ ...prev, attackLocation: { x, y } }));

    // 1. Lock Caliper (remove grab handles)
    setTimelineTags(prev => prev.map(t => t.id === activeCaliperTagId ? { ...t, theme: servingTeam === "home" ? "light" : "dark", isCaliper: false } : t));
    setActiveCaliperTagId("");

    // 2. Increment Score (Point MHS: 10 -> 11!)
    if (servingTeam === "home") {
      setHomeScore(prev => prev + 1);
    } else {
      setAwayScore(prev => prev + 1);
    }

    // 3. Advance Video Timestamp (to 1:30:44)
    setCurrentTime(prev => prev + 15);
    if (videoRef.current) {
      videoRef.current.currentTime = (videoRef.current.currentTime + 15) % (videoRef.current.duration || 60);
    }

    // 4. Return to Dual Keypad ready for next serve!
    setTaggerMode("DUAL_KEYPAD");
    triggerAlert("success", `Point ${servingTeam === "home" ? homeTeam : awayTeam}! Rally Waterfall completed (11 - 5).`);
  };

  // SERVE ERROR INITIATION
  const handleInitiateServeError = (erringTeam: "home" | "away") => {
    saveHistorySnapshot();
    
    // Add pending Caliper on Track 0 for Serve Error
    const errorTagId = `tag_err_${Date.now()}`;
    const newTag: TimelineTag = {
      id: errorTagId,
      label: "Serve Error",
      timeSec: currentTime,
      trackIndex: 0,
      theme: "caliper",
      team: erringTeam,
      isCaliper: true
    };
    setTimelineTags(prev => [...prev, newTag]);
    setActiveCaliperTagId(errorTagId);

    setTaggerMode("SERVE_ERROR_PROMPT");
  };

  // SERVE ERROR PLAYER SELECTED -> FINALIZES TAG, AWARDS POINT TO OPPONENT (11 -> 12 or 5 -> 6), TRANSFERS SERVE!
  const handleSelectServeErrorAthlete = (ath: Athlete) => {
    const receivingTeam = servingTeam === "home" ? "away" : "home";
    
    // Update Tag on timeline to finalized block
    setTimelineTags(prev => prev.map(t => t.id === activeCaliperTagId ? {
      ...t,
      label: `Serve Error #${ath.num}`,
      theme: servingTeam === "home" ? "light" : "dark",
      isCaliper: false
    } : t));
    setActiveCaliperTagId("");

    // Opponent gets side-out point (11 - 6)
    if (receivingTeam === "home") {
      setHomeScore(prev => prev + 1);
    } else {
      setAwayScore(prev => prev + 1);
    }

    // Side-out: serving turns to other team!
    setServingTeam(receivingTeam);

    // Advance video clock
    setCurrentTime(prev => prev + 7);
    if (videoRef.current) {
      videoRef.current.currentTime = (videoRef.current.currentTime + 7) % (videoRef.current.duration || 60);
    }

    setTaggerMode("DUAL_KEYPAD");
    triggerAlert("success", `Point ${receivingTeam === "home" ? homeTeam : awayTeam}! Serve Error #${ath.num}. ${receivingTeam === "home" ? homeTeam : awayTeam} serves next.`);
  };

  // Save and Exit
  const handleSaveAndExit = () => {
    if (onSave) {
      onSave(timelineTags);
    }
    triggerAlert("success", "Tagging progress saved successfully.");
    onClose();
  };

  const currentServerRoster = servingTeam === "home" ? homeRoster : awayRoster;
  const currentReceiverRoster = servingTeam === "home" ? awayRoster : homeRoster;

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

        {/* Center: Live Scoreboard ([Home] [Score] [Set] [Score] [Away]) */}
        <div className="flex items-center gap-3 font-mono text-sm tracking-wide bg-[#14181c] px-4 py-1 rounded border border-neutral-800 shadow-inner">
          <span className={`font-bold ${servingTeam === "home" ? "text-orange-400 font-extrabold" : "text-slate-300"}`}>
            {homeTeam} {servingTeam === "home" && "🏐"}
          </span>
          <span className="font-extrabold text-orange-400 text-base">{homeScore}</span>
          <span className="text-[11px] text-slate-400 font-sans px-1.5 py-0.5 rounded bg-neutral-800 uppercase font-semibold">
            {period}
          </span>
          <span className="font-extrabold text-blue-400 text-base">{awayScore}</span>
          <span className={`font-bold ${servingTeam === "away" ? "text-blue-400 font-extrabold" : "text-slate-300"}`}>
            {servingTeam === "away" && "🏐"} {awayTeam}
          </span>
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
                    setPeriod(prev => prev === "1st" ? "2nd" : prev === "2nd" ? "3rd" : prev === "3rd" ? "4th" : "5th");
                    triggerAlert("success", `Set concluded. Next set started.`);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-orange-500 hover:text-white transition-colors"
                >
                  End Current Set ({period})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEndSetMenu(false);
                    handleSaveAndExit();
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
      {/* 2. MAIN BODY: VIDEO + RUNNING TIMELINE & WATERFALL PANEL      */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* =========================================================== */}
        {/* LEFT: RUNNING VIDEO PLAYER + MULTI-TRACK WATERFALL TIMELINE */}
        {/* =========================================================== */}
        <div className="flex-1 flex flex-col min-w-0 bg-black relative">
          
          {/* A. Running Video Container */}
          <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
            
            <video
              ref={videoRef}
              src="/videos/volleyball_match.mp4"
              className="w-full h-full object-contain"
              playsInline
              loop
              autoPlay
              muted={isMuted}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  // Keep timeline clock running in sync with video
                  setCurrentTime(5420 + Math.floor(videoRef.current.currentTime));
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

          {/* C. Transport Scrubber Bar */}
          <div className="h-10 bg-[#14181c] border-t border-neutral-800 px-4 flex items-center justify-between text-xs text-slate-300 flex-shrink-0 z-10 relative">
            
            {/* Orange Progress Scrubber line */}
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

            {/* Right Controls */}
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

          {/* D. Multi-Track Waterfall Timeline (Running Live) */}
          <div 
            style={{ height: `${timelineHeight}px` }} 
            className="bg-[#14181c] border-t border-neutral-900 px-4 py-2 flex flex-col justify-between flex-shrink-0 relative overflow-hidden transition-all"
          >
            {/* Splitter Resize Handle */}
            <div 
              onClick={() => setTimelineHeight(prev => prev === 170 ? 240 : 170)}
              className="w-full flex items-center justify-center pb-1 cursor-ns-resize"
              title="Click to toggle timeline height"
            >
              <div className="w-8 h-1 rounded bg-neutral-700/60 hover:bg-neutral-500 transition-colors" />
            </div>

            {/* Timeline Tracks Area */}
            <div className="relative w-full flex-1 overflow-hidden">
              
              {/* Running White Playhead with Center Pill Handle */}
              <div 
                className="absolute top-0 bottom-0 w-[1.5px] bg-white z-30 pointer-events-none flex items-center justify-center"
                style={{ 
                  left: `${Math.min(95, Math.max(15, 48 + ((currentTime - 5420) * 0.4)))}%` 
                }}
              >
                <div className="w-3 h-4 rounded-xs bg-white text-black text-[8px] flex items-center justify-center font-bold shadow -ml-[0.5px]">
                  ≡
                </div>
              </div>

              {/* 4 Waterfall Tracks (Row 1: Serve/Set, Row 2: Receive/Kill, Row 3: Freeball/Dig, Row 4: Defense/Cover) */}
              <div className="absolute inset-x-0 top-[25%] h-[1px] bg-neutral-900/60" />
              <div className="absolute inset-x-0 top-[50%] h-[1px] bg-neutral-900/60" />
              <div className="absolute inset-x-0 top-[75%] h-[1px] bg-neutral-900/60" />

              {/* Render Tag Blocks in Waterfall Order */}
              {timelineTags.map((tag) => {
                const baseTime = 5420;
                const offsetSec = tag.timeSec - baseTime;
                const leftPercent = 48 + (offsetSec * 1.8);

                if (leftPercent < -20 || leftPercent > 120) return null;

                const isCaliper = tag.isCaliper || activeCaliperTagId === tag.id;
                const isPreviousRally = tag.timeSec < 5410;

                return (
                  <div
                    key={tag.id}
                    onClick={() => {
                      setCurrentTime(tag.timeSec);
                      setActiveCaliperTagId(tag.id);
                    }}
                    className={`absolute text-[10px] font-sans px-1.5 py-0.5 cursor-pointer whitespace-nowrap transition-all select-none flex items-center ${
                      isCaliper
                        ? "bg-white text-black border-y-2 border-white font-extrabold z-30 shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                        : tag.theme === "dark"
                        ? `bg-[#242b33] text-slate-100 border border-neutral-700 ${isPreviousRally ? "opacity-50" : "opacity-95"}`
                        : `bg-[#e6ebf0] text-neutral-950 border border-neutral-300 font-semibold ${isPreviousRally ? "opacity-50" : "opacity-100"}`
                    }`}
                    style={{
                      top: `${tag.trackIndex * 26}px`,
                      left: `${leftPercent}%`,
                      height: "22px",
                      lineHeight: "16px"
                    }}
                  >
                    {/* Left Caliper Grab Handle */}
                    {isCaliper && (
                      <div className="w-1.5 h-full bg-white border-r border-neutral-400 flex items-center justify-center mr-1 text-[7px] font-bold text-neutral-700">
                        |||
                      </div>
                    )}

                    <span>{tag.label}</span>

                    {/* Right Caliper Grab Handle */}
                    {isCaliper && (
                      <div className="w-1.5 h-full bg-white border-l border-neutral-400 flex items-center justify-center ml-1 text-[7px] font-bold text-neutral-700">
                        |||
                      </div>
                    )}
                  </div>
                );
              })}
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
        {/* RIGHT COLUMN: TAGGING PANEL WITH INTERACTIVE OPTIONS        */}
        {/* =========================================================== */}
        <div className="w-[430px] bg-[#161a1e] border-l border-neutral-800 flex flex-col justify-between flex-shrink-0 z-30">
          
          {/* ========================================================= */}
          {/* OPTION SET 1: DUAL COLUMN KEYPAD                          */}
          {/* ========================================================= */}
          {taggerMode === "DUAL_KEYPAD" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 flex flex-col">
                
                {/* Subheader */}
                <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between text-neutral-900 font-bold text-xs flex-shrink-0">
                  <span className="font-extrabold">
                    {servingTeam === "home" ? `${homeTeam} Serve` : `${awayTeam} Serve`}
                  </span>
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
                  
                  {/* Left Column: Home Team */}
                  <div className="bg-[#f0f2f5] border-r border-neutral-300 flex flex-col">
                    <div className="p-3 font-extrabold text-neutral-900 text-sm border-b border-neutral-300 bg-white">
                      {homeTeam}
                    </div>
                    
                    {servingTeam === "home" ? (
                      // Home is Serving (Light Buttons)
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => {
                            setHomeScore(prev => prev + 1);
                            const tag: TimelineTag = { id: `ace_${Date.now()}`, label: "Ace #9", timeSec: currentTime, trackIndex: 0, theme: "light", team: "home" };
                            setTimelineTags(prev => [...prev, tag]);
                            triggerAlert("success", "Point MHS! Ace logged.");
                          }}
                          className="w-full text-left px-4 py-3 bg-white hover:bg-slate-100 text-neutral-900 font-bold border-b border-neutral-300 cursor-pointer transition-colors shadow-2xs"
                        >
                          Ace
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInitiateServeError("home")}
                          className="w-full text-left px-4 py-3 bg-white hover:bg-slate-100 text-neutral-900 font-bold border-b border-neutral-300 cursor-pointer transition-colors"
                        >
                          Serve Error
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInitiateServeError("home")}
                          className="w-full text-left px-4 py-3 bg-white hover:bg-slate-100 text-neutral-900 font-bold border-b border-neutral-300 cursor-pointer transition-colors"
                        >
                          Violation
                        </button>
                      </div>
                    ) : (
                      // Home is Receiving
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={handleStartWaterfallRally}
                          className="w-full text-left px-4 py-3 bg-[#6b757e] hover:bg-[#78838d] text-white font-bold border-b border-neutral-600 cursor-pointer transition-colors"
                        >
                          Serve Receive
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerAlert("info", `Over Pass logged for ${homeTeam}`)}
                          className="w-full text-left px-4 py-3 bg-[#4a5259] hover:bg-[#565e66] text-white font-bold border-b border-neutral-600 cursor-pointer transition-colors"
                        >
                          Over Pass
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInitiateServeError("home")}
                          className="w-full text-left px-4 py-3 bg-[#4a5259] hover:bg-[#565e66] text-white font-bold border-b border-neutral-600 cursor-pointer transition-colors"
                        >
                          Violation
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Away Team */}
                  <div className="bg-[#9da3a8] flex flex-col">
                    <div className="p-3 font-extrabold text-white text-sm bg-[#4a5259] border-b border-neutral-600">
                      {awayTeam}
                    </div>

                    {servingTeam === "away" ? (
                      // Away is Serving
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => {
                            setAwayScore(prev => prev + 1);
                            const tag: TimelineTag = { id: `ace_${Date.now()}`, label: "Ace #1", timeSec: currentTime, trackIndex: 0, theme: "dark", team: "away" };
                            setTimelineTags(prev => [...prev, tag]);
                            triggerAlert("success", `Point ${awayTeam}! Ace logged.`);
                          }}
                          className="w-full text-left px-4 py-3 bg-white hover:bg-slate-100 text-neutral-900 font-bold border-b border-neutral-600 cursor-pointer transition-colors shadow-2xs"
                        >
                          Ace
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInitiateServeError("away")}
                          className="w-full text-left px-4 py-3 bg-white hover:bg-slate-100 text-neutral-900 font-bold border-b border-neutral-600 cursor-pointer transition-colors"
                        >
                          Serve Error
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInitiateServeError("away")}
                          className="w-full text-left px-4 py-3 bg-[#4a5259] hover:bg-[#565e66] text-white font-bold border-b border-neutral-600 cursor-pointer transition-colors"
                        >
                          Violation
                        </button>
                      </div>
                    ) : (
                      // Away is Receiving (Clicking Serve Receive starts the Waterfall!)
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={handleStartWaterfallRally}
                          className="w-full text-left px-4 py-3 bg-[#6b757e] hover:bg-[#78838d] text-white font-bold border-b border-neutral-600 cursor-pointer transition-colors"
                        >
                          Serve Receive
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerAlert("info", `Over Pass logged for ${awayTeam}`)}
                          className="w-full text-left px-4 py-3 bg-[#4a5259] hover:bg-[#565e66] text-white font-bold border-b border-neutral-600 cursor-pointer transition-colors"
                        >
                          Over Pass
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInitiateServeError("away")}
                          className="w-full text-left px-4 py-3 bg-[#4a5259] hover:bg-[#565e66] text-white font-bold border-b border-neutral-600 cursor-pointer transition-colors"
                        >
                          Violation
                        </button>
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* Bottom Actions */}
              <div className="p-3 bg-[#111417] border-t border-neutral-800 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowProblemReportModal(true)}
                  className="w-full py-2 bg-[#262c33] hover:bg-[#323942] text-slate-300 font-bold text-xs rounded transition-colors cursor-pointer"
                >
                  Problem Report
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndExit}
                  className="w-full py-2.5 bg-[#262d35] hover:bg-[#323a44] text-white font-bold text-xs rounded transition-colors text-center cursor-pointer border border-neutral-700"
                >
                  Save and Exit
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* OPTION SET 2: WATERFALL RALLY ACCORDION                   */}
          {/* ========================================================= */}
          {taggerMode === "WATERFALL_RALLY" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="h-9 bg-[#111417] border-b border-neutral-800 px-4 flex items-center justify-center flex-shrink-0">
                <span className="font-extrabold text-xs tracking-wider text-slate-100 font-sans">
                  Complete the Tag
                </span>
              </div>

              {/* Subheader */}
              <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between text-neutral-900 font-bold text-xs flex-shrink-0 shadow-2xs">
                <span className="font-extrabold tracking-wide">
                  {servingTeam === "home" ? `${homeTeam} Attack Kill` : `${awayTeam} Attack Kill`}
                </span>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="flex items-center gap-1 text-[11px] text-neutral-700 hover:text-black cursor-pointer font-semibold"
                >
                  <Undo className="w-3.5 h-3.5" />
                  <span>Undo (U)</span>
                </button>
              </div>

              {/* Step Options (Clicking each option drops tag in Waterfall below!) */}
              <div className="flex-1 overflow-y-auto bg-neutral-900 divide-y divide-neutral-800 text-xs">
                
                {/* 1. Who served? (Drops Tag on Row 1) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveWaterfallStep(activeWaterfallStep === "whoServed" ? "" : "whoServed")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who served? <span className="font-normal ml-2 font-mono text-neutral-700">{rallySelections.server ? `#${rallySelections.server.num} ${rallySelections.server.name}` : ""}</span></span>
                    {activeWaterfallStep === "whoServed" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeWaterfallStep === "whoServed" && (
                    <div className="p-3 bg-white text-neutral-900 border-t border-neutral-200">
                      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                        {currentServerRoster.map(ath => (
                          <button
                            key={ath.num}
                            type="button"
                            onClick={() => handleSelectServer(ath)}
                            className={`p-1.5 text-left font-sans text-[11px] rounded cursor-pointer ${rallySelections.server?.num === ath.num ? "bg-orange-500 text-white font-bold" : "hover:bg-neutral-100"}`}
                          >
                            <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Who received the serve? (Drops Tag on Row 2 - Waterfall!) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveWaterfallStep(activeWaterfallStep === "whoReceived" ? "" : "whoReceived")}
                    className="w-full bg-[#3c444c] text-white px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-[#464f58] transition-colors"
                  >
                    <span>Who received the serve? <span className="font-normal ml-2 font-mono text-slate-200">{rallySelections.receiver ? `#${rallySelections.receiver.num}` : ""}</span></span>
                    {activeWaterfallStep === "whoReceived" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {activeWaterfallStep === "whoReceived" && (
                    <div className="p-3 bg-[#3c444c] text-white border-t border-neutral-700">
                      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                        {currentReceiverRoster.map(ath => (
                          <button
                            key={ath.num}
                            type="button"
                            onClick={() => handleSelectReceiver(ath)}
                            className={`p-1.5 text-left font-sans text-[11px] rounded cursor-pointer ${rallySelections.receiver?.num === ath.num ? "bg-orange-500 text-white font-bold" : "hover:bg-neutral-600"}`}
                          >
                            <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Rate the serve receive. */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveWaterfallStep(activeWaterfallStep === "rateReceive" ? "" : "rateReceive")}
                    className="w-full bg-[#3c444c] text-white px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-[#464f58] transition-colors"
                  >
                    <span>Rate the serve receive. <span className="font-normal ml-2 font-mono text-slate-200">{rallySelections.receiveRating !== null ? rallySelections.receiveRating : ""}</span></span>
                    {activeWaterfallStep === "rateReceive" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {activeWaterfallStep === "rateReceive" && (
                    <div className="p-3 bg-[#2b3137] flex justify-around">
                      {[0, 1, 2, 3].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleRateReceive(r)}
                          className={`w-12 h-10 rounded font-bold text-sm transition-all cursor-pointer ${rallySelections.receiveRating === r ? "bg-orange-500 text-white shadow-lg" : "bg-neutral-800 text-slate-300 hover:bg-neutral-700"}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Who sent the free ball? (Drops Tag on Row 3 - Waterfall!) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveWaterfallStep(activeWaterfallStep === "whoSentFreeBall" ? "" : "whoSentFreeBall")}
                    className="w-full bg-[#3c444c] text-white px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-[#464f58] transition-colors"
                  >
                    <span>Who sent the free ball? <span className="font-normal ml-2 font-mono text-slate-200">{rallySelections.freeBallSender ? `#${rallySelections.freeBallSender.num} ${rallySelections.freeBallSender.name}` : ""}</span></span>
                    {activeWaterfallStep === "whoSentFreeBall" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {activeWaterfallStep === "whoSentFreeBall" && (
                    <div className="p-3 bg-[#3c444c] text-white">
                      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                        {currentReceiverRoster.map(ath => (
                          <button
                            key={ath.num}
                            type="button"
                            onClick={() => handleSelectFreeBallSender(ath)}
                            className={`p-1.5 text-left font-sans text-[11px] rounded cursor-pointer ${rallySelections.freeBallSender?.num === ath.num ? "bg-orange-500 text-white font-bold" : "hover:bg-neutral-600"}`}
                          >
                            <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. Who received the free ball? (Drops Tag on Row 4 - Waterfall!) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveWaterfallStep(activeWaterfallStep === "whoReceivedFreeBall" ? "" : "whoReceivedFreeBall")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who received the free ball? <span className="font-normal ml-2 font-mono text-neutral-700">{rallySelections.freeBallReceiver ? `#${rallySelections.freeBallReceiver.num} ${rallySelections.freeBallReceiver.name}` : ""}</span></span>
                    {activeWaterfallStep === "whoReceivedFreeBall" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeWaterfallStep === "whoReceivedFreeBall" && (
                    <div className="p-3 bg-white text-neutral-900">
                      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                        {currentServerRoster.map(ath => (
                          <button
                            key={ath.num}
                            type="button"
                            onClick={() => handleSelectFreeBallReceiver(ath)}
                            className={`p-1.5 text-left font-sans text-[11px] rounded cursor-pointer ${rallySelections.freeBallReceiver?.num === ath.num ? "bg-orange-500 text-white font-bold" : "hover:bg-neutral-100"}`}
                          >
                            <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Who assisted? (Drops Tag on Row 1) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveWaterfallStep(activeWaterfallStep === "whoAssisted" ? "" : "whoAssisted")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who assisted? <span className="font-normal ml-2 font-mono text-neutral-700">{rallySelections.assistingPlayer ? `#${rallySelections.assistingPlayer.num} ${rallySelections.assistingPlayer.name}` : ""}</span></span>
                    {activeWaterfallStep === "whoAssisted" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeWaterfallStep === "whoAssisted" && (
                    <div className="p-3 bg-white text-neutral-900">
                      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                        {currentServerRoster.map(ath => (
                          <button
                            key={ath.num}
                            type="button"
                            onClick={() => handleSelectAssistingPlayer(ath)}
                            className={`p-1.5 text-left font-sans text-[11px] rounded cursor-pointer ${rallySelections.assistingPlayer?.num === ath.num ? "bg-orange-500 text-white font-bold" : "hover:bg-neutral-100"}`}
                          >
                            <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 7. Who got the kill? (Drops Tag on Row 2 with Caliper Handles!) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveWaterfallStep(activeWaterfallStep === "whoGotKill" ? "" : "whoGotKill")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who got the kill? <span className="font-normal ml-2 font-mono text-neutral-700">{rallySelections.killingPlayer ? `#${rallySelections.killingPlayer.num}` : ""}</span></span>
                    {activeWaterfallStep === "whoGotKill" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeWaterfallStep === "whoGotKill" && (
                    <div className="p-3 bg-white text-neutral-900">
                      <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                        {currentServerRoster.map(ath => (
                          <button
                            key={ath.num}
                            type="button"
                            onClick={() => handleSelectKillingPlayer(ath)}
                            className={`p-1.5 text-left font-sans text-[11px] rounded cursor-pointer ${rallySelections.killingPlayer?.num === ath.num ? "bg-orange-500 text-white font-bold" : "hover:bg-neutral-100"}`}
                          >
                            <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 8. Where did the attack occur? (2D Court Canvas) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveWaterfallStep(activeWaterfallStep === "attackLocation" ? "" : "attackLocation")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Where did the attack occur?</span>
                    {activeWaterfallStep === "attackLocation" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  
                  {activeWaterfallStep === "attackLocation" && (
                    <div className="p-4 bg-white text-neutral-900 flex flex-col gap-3">
                      
                      {/* Deflected Checkbox */}
                      <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={rallySelections.attackDeflected}
                            onChange={(e) => setRallySelections(prev => ({ ...prev, attackDeflected: e.target.checked }))}
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
                          <rect x="83" y="15" width="32" height="90" fill="#e8ecef" stroke="#000000" strokeWidth="2" />

                          {/* Right Half Court */}
                          <rect x="125" y="15" width="95" height="90" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                          <rect x="125" y="15" width="32" height="90" fill="#e8ecef" stroke="#000000" strokeWidth="2" />

                          {/* Thick Center Net */}
                          <line x1="120" y1="8" x2="120" y2="112" stroke="#000000" strokeWidth="4" />

                          {/* Dashed Zone Lines */}
                          <line x1="0" y1="45" x2="240" y2="45" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="0" y1="75" x2="240" y2="75" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

                          <line x1="51" y1="0" x2="51" y2="120" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="83" y1="0" x2="83" y2="120" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="157" y1="0" x2="157" y2="120" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="189" y1="0" x2="189" y2="120" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

                          {/* Landing Black Cross (+) */}
                          {rallySelections.attackLocation ? (
                            <g transform={`translate(${rallySelections.attackLocation.x}, ${rallySelections.attackLocation.y})`}>
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
                        Click court location to place (+) mark & complete rally
                      </div>

                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* OPTION SET 3: SERVE ERROR ATHLETE PROMPT                  */}
          {/* ========================================================= */}
          {taggerMode === "SERVE_ERROR_PROMPT" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="h-9 bg-[#111417] border-b border-neutral-800 px-4 flex items-center justify-center flex-shrink-0">
                <span className="font-extrabold text-xs tracking-wider text-slate-100 font-sans">
                  Complete the Tag
                </span>
              </div>

              <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between text-neutral-900 font-bold text-xs flex-shrink-0">
                <span className="font-extrabold">{servingTeam === "home" ? `${homeTeam} Serve Error` : `${awayTeam} Serve Error`}</span>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="flex items-center gap-1 text-[11px] text-neutral-700 hover:text-black cursor-pointer font-semibold"
                >
                  <Undo className="w-3.5 h-3.5" />
                  <span>Undo (U)</span>
                </button>
              </div>

              <div className="flex-1 bg-white p-4 flex flex-col justify-between overflow-y-auto">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between font-bold text-neutral-900 text-xs pb-2 border-b border-neutral-200">
                    <span>Who served the error?</span>
                    <ChevronUp className="w-4 h-4 text-neutral-500" />
                  </div>

                  <div className="grid grid-cols-3 gap-y-3 gap-x-1 text-neutral-900 text-xs">
                    {currentServerRoster.map(ath => (
                      <button
                        key={ath.num}
                        type="button"
                        onClick={() => handleSelectServeErrorAthlete(ath)}
                        className="p-1.5 text-left font-sans text-[11px] rounded transition-colors cursor-pointer hover:bg-orange-100 hover:font-bold border border-transparent hover:border-orange-300"
                      >
                        <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex justify-between text-[11px] text-neutral-700">
                  <button type="button" onClick={() => handleSelectServeErrorAthlete({ num: 0, name: "Unknown" })} className="hover:underline">Unknown Athlete</button>
                  <button type="button" onClick={() => setShowRosterModal(true)} className="flex items-center gap-1 hover:underline"><Pencil className="w-3 h-3" /> Edit Roster</button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. MODALS (Coach Notes, Problem Report, Options, Rosters)     */}
      {/* ------------------------------------------------------------- */}

      {/* Coach Notes Modal */}
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
              placeholder="Enter rotation notes or coaching feedback..."
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

      {/* Problem Report Modal */}
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

      {/* Options Modal */}
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

      {/* Roster Edit Modal */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#191F24] border border-neutral-800 rounded-lg p-5 flex flex-col gap-4 text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-orange-500" />
                Edit Match Rosters
              </h3>
              <button type="button" onClick={() => setShowRosterModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 max-h-72 overflow-y-auto">
              <div>
                <h4 className="font-bold text-slate-200 mb-2">{homeTeam} Athletes</h4>
                <div className="space-y-1.5">
                  {homeRoster.map((ath, idx) => (
                    <div key={idx} className="flex gap-1.5">
                      <input
                        type="number"
                        value={ath.num}
                        onChange={(e) => {
                          const n = parseInt(e.target.value) || 0;
                          setHomeRoster(prev => prev.map((a, i) => i === idx ? { ...a, num: n } : a));
                        }}
                        className="w-10 bg-neutral-900 border border-neutral-800 rounded px-1.5 py-1 text-center font-bold text-white"
                      />
                      <input
                        type="text"
                        value={ath.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHomeRoster(prev => prev.map((a, i) => i === idx ? { ...a, name: val } : a));
                        }}
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 mb-2">{awayTeam} Athletes</h4>
                <div className="space-y-1.5">
                  {awayRoster.map((ath, idx) => (
                    <div key={idx} className="flex gap-1.5">
                      <input
                        type="number"
                        value={ath.num}
                        onChange={(e) => {
                          const n = parseInt(e.target.value) || 0;
                          setAwayRoster(prev => prev.map((a, i) => i === idx ? { ...a, num: n } : a));
                        }}
                        className="w-10 bg-neutral-900 border border-neutral-800 rounded px-1.5 py-1 text-center font-bold text-white"
                      />
                      <input
                        type="text"
                        value={ath.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAwayRoster(prev => prev.map((a, i) => i === idx ? { ...a, name: val } : a));
                        }}
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowRosterModal(false)}
                className="px-4 py-1.5 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold cursor-pointer"
              >
                Save Rosters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
