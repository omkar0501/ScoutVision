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
  startSec: number;
  durationSec: number;
  trackIndex: 0 | 1 | 2 | 3;
  theme: "light" | "dark";
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
  const [homeRoster, setHomeRoster] = useState<Athlete[]>(defaultMHSRoster);
  const [awayRoster, setAwayRoster] = useState<Athlete[]>(defaultTeam2Roster);
  const [editingHomeNum, setEditingHomeNum] = useState("");
  const [editingHomeName, setEditingHomeName] = useState("");
  const [editingAwayNum, setEditingAwayNum] = useState("");
  const [editingAwayName, setEditingAwayName] = useState("");

  // Video & Playback State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(5448); // 01:30:48 in video
  const [totalDuration, setTotalDuration] = useState(10800); // 3:00:00
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [timelineHeight, setTimelineHeight] = useState<number>(180);

  // Modals
  const [showCoachNotes, setShowCoachNotes] = useState(false);
  const [coachNotesText, setCoachNotesText] = useState("");
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showProblemReportModal, setShowProblemReportModal] = useState(false);
  const [problemReportCategory, setProblemReportCategory] = useState("Camera Angle Issue");
  const [problemReportNotes, setProblemReportNotes] = useState("");
  const [showEndSetMenu, setShowEndSetMenu] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);

  // Modes: "DUAL_KEYPAD" | "WATERFALL_TOUCHES" | "ATTACK_KILL_PROMPT" | "SERVE_ERROR_PROMPT"
  const [taggerMode, setTaggerMode] = useState<"DUAL_KEYPAD" | "WATERFALL_TOUCHES" | "ATTACK_KILL_PROMPT" | "SERVE_ERROR_PROMPT">("DUAL_KEYPAD");

  // Attack Kill selections
  const [attackKillPlayer, setAttackKillPlayer] = useState<Athlete>({ num: 18, name: "Unknown" });
  const [attackLocation, setAttackLocation] = useState<{ x: number; y: number } | null>(null);

  // Base timestamp for current rally (e.g. 01:30:22 = 5422s)
  const [rallyBaseTime, setRallyBaseTime] = useState<number>(5422);

  // Multi-track timeline tags (Exact match from the 61s reference video)
  const [timelineTags, setTimelineTags] = useState<TimelineTag[]>([
    // === RALLY 1 (01:29:30 - 01:30:00) ===
    // Track 0 (Row 1): Serves, Sets, Aces, Serve Errors
    { id: "r1_1", label: "Serve #10", startSec: 5370, durationSec: 7.5, trackIndex: 0, theme: "light", team: "home" },
    { id: "r1_2", label: "Dig #9", startSec: 5377.5, durationSec: 6.5, trackIndex: 0, theme: "light", team: "home" },
    { id: "r1_3", label: "Free Ball #1", startSec: 5384, durationSec: 6.5, trackIndex: 0, theme: "dark", team: "away" },
    { id: "r1_4", label: "Dig #18", startSec: 5390.5, durationSec: 6.5, trackIndex: 0, theme: "dark", team: "away" },
    { id: "r1_5", label: "Set #2", startSec: 5397, durationSec: 6.5, trackIndex: 0, theme: "light", team: "home" },
    
    // Track 1 (Row 2): Serve Receives, Attacks, Kills
    { id: "r1_6", label: "Serve Receive #1", startSec: 5373.5, durationSec: 7.0, trackIndex: 1, theme: "dark", team: "away" },
    { id: "r1_7", label: "Set #9", startSec: 5380.5, durationSec: 6.5, trackIndex: 1, theme: "light", team: "home" },
    { id: "r1_8", label: "Free Ball Receive #7", startSec: 5387, durationSec: 6.5, trackIndex: 1, theme: "light", team: "home" },
    { id: "r1_9", label: "Set #10", startSec: 5393.5, durationSec: 5.5, trackIndex: 1, theme: "dark", team: "away" },
    { id: "r1_10", label: "Attack Kill #13", startSec: 5399, durationSec: 7.0, trackIndex: 1, theme: "light", team: "home" },

    // Track 2 (Row 3): Free Balls, Digs
    { id: "r1_11", label: "Set #18", startSec: 5375.5, durationSec: 6.5, trackIndex: 2, theme: "dark", team: "away" },
    { id: "r1_12", label: "Dig #10", startSec: 5382, durationSec: 6.5, trackIndex: 2, theme: "light", team: "home" },
    { id: "r1_13", label: "Set #2", startSec: 5391.5, durationSec: 6.5, trackIndex: 2, theme: "light", team: "home" },
    { id: "r1_14", label: "Attack #5", startSec: 5398, durationSec: 6.5, trackIndex: 2, theme: "dark", team: "away" },

    // Track 3 (Row 4): Free Ball Receives, Covers, Defense
    { id: "r1_15", label: "Attack #1", startSec: 5377, durationSec: 6.5, trackIndex: 3, theme: "dark", team: "away" },
    { id: "r1_16", label: "Attack #13", startSec: 5383.5, durationSec: 6.5, trackIndex: 3, theme: "light", team: "home" },
    { id: "r1_17", label: "Attack #18", startSec: 5393, durationSec: 6.5, trackIndex: 3, theme: "light", team: "home" },
    { id: "r1_18", label: "Dig #10", startSec: 5399.5, durationSec: 6.5, trackIndex: 3, theme: "dark", team: "away" }
  ]);

  // Active Caliper State (when tagging a live touch)
  const [activeCaliper, setActiveCaliper] = useState<{
    visible: boolean;
    label: string;
    startSec: number;
    durationSec: number;
    trackIndex: 0 | 1 | 2 | 3;
  } | null>({
    visible: true,
    label: "Serve",
    startSec: 5422,
    durationSec: 6.5,
    trackIndex: 0
  });

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
        timelineTags: [...timelineTags],
        activeCaliper: activeCaliper ? { ...activeCaliper } : null,
        rallyBaseTime,
        currentTime
      }
    ]);
  };

  // Undo (U) handler
  const handleUndo = () => {
    if (historyStack.length === 0) {
      triggerAlert("info", "Nothing to undo.");
      return;
    }
    const last = historyStack[historyStack.length - 1];
    setHistoryStack(prev => prev.slice(0, -1));
    setHomeScore(last.homeScore);
    setAwayScore(last.awayScore);
    setServingTeam(last.servingTeam);
    setTaggerMode(last.taggerMode);
    setTimelineTags(last.timelineTags);
    setActiveCaliper(last.activeCaliper);
    setRallyBaseTime(last.rallyBaseTime);
    setCurrentTime(last.currentTime);
    triggerAlert("info", "Action undone (U).");
  };

  // =========================================================================
  // WATERFALL TAGGING ACTIONS (Clicks on right panel immediately drop tags below)
  // =========================================================================

  // Action 1: Analyst clicks "Serve Receive"
  const handleTriggerServeReceive = () => {
    saveHistorySnapshot();
    const serverAth = homeRoster.find(a => a.num === 9) || { num: 9, name: "K. Sable" };
    const receiverAth = awayRoster.find(a => a.num === 15) || { num: 15, name: "Unknown" };

    // Step 1: Lock Serve tag on Track 0 (Row 1)
    const serveTag: TimelineTag = {
      id: `tag_serve_${Date.now()}`,
      label: `Serve #${serverAth.num}`,
      startSec: rallyBaseTime,
      durationSec: 7.0,
      trackIndex: 0,
      theme: servingTeam === "home" ? "light" : "dark",
      team: servingTeam
    };

    // Step 2: Drop Serve Receive on Track 1 (Row 2) - stepped forward by 2 seconds
    const receiveTag: TimelineTag = {
      id: `tag_receive_${Date.now() + 1}`,
      label: `Serve Receive #${receiverAth.num}`,
      startSec: rallyBaseTime + 2.0,
      durationSec: 6.0,
      trackIndex: 1,
      theme: servingTeam === "home" ? "dark" : "light",
      team: servingTeam === "home" ? "away" : "home"
    };

    setTimelineTags(prev => [...prev, serveTag, receiveTag]);

    // Update Caliper to indicate receiving touch
    setActiveCaliper({
      visible: true,
      label: `Serve Receive #${receiverAth.num}`,
      startSec: rallyBaseTime + 2.0,
      durationSec: 6.0,
      trackIndex: 1
    });

    setTaggerMode("WATERFALL_TOUCHES");
    setCurrentTime(rallyBaseTime + 4);
    triggerAlert("info", `Serve #${serverAth.num} locked. Serve Receive #${receiverAth.num} tagged on timeline.`);
  };

  // Action 2: Analyst clicks "Free Ball" / "Dig"
  const handleTriggerFreeBall = () => {
    saveHistorySnapshot();
    const fbAth = awayRoster.find(a => a.num === 2) || { num: 2, name: "M. Barfield" };

    // Step 3: Drop Free Ball on Track 2 (Row 3) - stepped forward by 4 seconds
    const freeBallTag: TimelineTag = {
      id: `tag_fb_${Date.now()}`,
      label: `Free Ball #${fbAth.num}`,
      startSec: rallyBaseTime + 4.0,
      durationSec: 5.5,
      trackIndex: 2,
      theme: servingTeam === "home" ? "dark" : "light",
      team: servingTeam === "home" ? "away" : "home"
    };

    setTimelineTags(prev => [...prev, freeBallTag]);

    setActiveCaliper({
      visible: true,
      label: `Free Ball #${fbAth.num}`,
      startSec: rallyBaseTime + 4.0,
      durationSec: 5.5,
      trackIndex: 2
    });

    setCurrentTime(rallyBaseTime + 5.5);
    triggerAlert("info", `Free Ball #${fbAth.num} dropped on Track 3.`);
  };

  // Action 3: Analyst clicks "Free Ball Receive" / "Cover"
  const handleTriggerFreeBallReceive = () => {
    saveHistorySnapshot();
    const fbrAth = homeRoster.find(a => a.num === 9) || { num: 9, name: "K. Sable" };

    // Step 4: Drop Free Ball Receive on Track 3 (Row 4) - stepped forward by 5.5 seconds
    const fbrTag: TimelineTag = {
      id: `tag_fbr_${Date.now()}`,
      label: `Free Ball Receive #${fbrAth.num}`,
      startSec: rallyBaseTime + 5.5,
      durationSec: 6.0,
      trackIndex: 3,
      theme: servingTeam === "home" ? "light" : "dark",
      team: servingTeam
    };

    setTimelineTags(prev => [...prev, fbrTag]);

    setActiveCaliper({
      visible: true,
      label: `Free Ball Receive #${fbrAth.num}`,
      startSec: rallyBaseTime + 5.5,
      durationSec: 6.0,
      trackIndex: 3
    });

    setCurrentTime(rallyBaseTime + 7);
    triggerAlert("info", `Free Ball Receive #${fbrAth.num} dropped on Track 4.`);
  };

  // Action 4: Analyst clicks "Set"
  const handleTriggerSet = () => {
    saveHistorySnapshot();
    const setAth = homeRoster.find(a => a.num === 2) || { num: 2, name: "A. Bragg" };

    // Step 5: Step back to Track 0 (Row 1) - starts right where Serve ended!
    const setTag: TimelineTag = {
      id: `tag_set_${Date.now()}`,
      label: `Set #${setAth.num}`,
      startSec: rallyBaseTime + 7.0,
      durationSec: 7.0,
      trackIndex: 0,
      theme: servingTeam === "home" ? "light" : "dark",
      team: servingTeam
    };

    setTimelineTags(prev => [...prev, setTag]);

    setActiveCaliper({
      visible: true,
      label: `Set #${setAth.num}`,
      startSec: rallyBaseTime + 7.0,
      durationSec: 7.0,
      trackIndex: 0
    });

    setCurrentTime(rallyBaseTime + 8);
    triggerAlert("info", `Set #${setAth.num} dropped on Track 1.`);
  };

  // Action 5: Analyst clicks "Attack Kill"
  const handleTriggerAttackKill = () => {
    saveHistorySnapshot();
    const killAth = homeRoster.find(a => a.num === 18) || { num: 18, name: "Unknown" };
    setAttackKillPlayer(killAth);

    // Show full Caliper on timeline
    setActiveCaliper({
      visible: true,
      label: `Attack Kill ${killAth.num}`,
      startSec: rallyBaseTime + 8.0,
      durationSec: 7.5,
      trackIndex: 1
    });

    setTaggerMode("ATTACK_KILL_PROMPT");
    setCurrentTime(rallyBaseTime + 9);
    triggerAlert("info", "Attack Kill selected. Click court location to complete tag.");
  };

  // Action 6: Analyst clicks 2D Court to place (+) and complete rally
  const handleCourtClick = (e: React.MouseEvent<SVGSVGElement>) => {
    saveHistorySnapshot();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.round(e.clientX - rect.left);
    const clickY = Math.round(e.clientY - rect.top);
    setAttackLocation({ x: clickX, y: clickY });

    // Lock Attack Kill tag onto Track 1 (Row 2)
    const killTag: TimelineTag = {
      id: `tag_kill_${Date.now()}`,
      label: `Attack Kill #${attackKillPlayer.num}`,
      startSec: rallyBaseTime + 8.0,
      durationSec: 7.5,
      trackIndex: 1,
      theme: servingTeam === "home" ? "light" : "dark",
      team: servingTeam
    };

    setTimelineTags(prev => [...prev, killTag]);

    // Point awarded (10 -> 11)
    if (servingTeam === "home") {
      setHomeScore(prev => prev + 1);
    } else {
      setAwayScore(prev => prev + 1);
    }

    // Advance rally base timestamp for next serve
    const nextBase = rallyBaseTime + 38;
    setRallyBaseTime(nextBase);
    setCurrentTime(nextBase);

    // Reset active caliper to Serve for next rally
    setActiveCaliper({
      visible: true,
      label: "Serve",
      startSec: nextBase,
      durationSec: 6.5,
      trackIndex: 0
    });

    setTaggerMode("DUAL_KEYPAD");
    triggerAlert("success", `Point ${servingTeam === "home" ? homeTeam : awayTeam}! Attack Kill #${attackKillPlayer.num} logged.`);
  };

  // Action 7: Ace
  const handleAce = () => {
    saveHistorySnapshot();
    const serverAth = homeRoster.find(a => a.num === 9) || { num: 9, name: "K. Sable" };

    const aceTag: TimelineTag = {
      id: `tag_ace_${Date.now()}`,
      label: `Ace #${serverAth.num}`,
      startSec: rallyBaseTime,
      durationSec: 7.0,
      trackIndex: 0,
      theme: servingTeam === "home" ? "light" : "dark",
      team: servingTeam
    };

    setTimelineTags(prev => [...prev, aceTag]);

    if (servingTeam === "home") {
      setHomeScore(prev => prev + 1);
    } else {
      setAwayScore(prev => prev + 1);
    }

    const nextBase = rallyBaseTime + 30;
    setRallyBaseTime(nextBase);
    setCurrentTime(nextBase);

    setActiveCaliper({
      visible: true,
      label: "Serve",
      startSec: nextBase,
      durationSec: 6.5,
      trackIndex: 0
    });

    setTaggerMode("DUAL_KEYPAD");
    triggerAlert("success", `Ace #${serverAth.num}! Point ${servingTeam === "home" ? homeTeam : awayTeam}.`);
  };

  // Action 8: Serve Error
  const handleServeErrorClick = () => {
    saveHistorySnapshot();

    // Show full-height caliper for Serve Error
    setActiveCaliper({
      visible: true,
      label: "Serve Error",
      startSec: rallyBaseTime,
      durationSec: 6.6,
      trackIndex: 0
    });

    setTaggerMode("SERVE_ERROR_PROMPT");
    triggerAlert("info", "Select who served the error.");
  };

  // Action 9: Analyst selects who served error
  const handleSelectServeErrorAthlete = (ath: Athlete) => {
    saveHistorySnapshot();
    const receivingTeam = servingTeam === "home" ? "away" : "home";

    // Lock tag on Track 0 as Serve Error #[num]
    const errorTag: TimelineTag = {
      id: `tag_error_${Date.now()}`,
      label: `Serve Error #${ath.num}`,
      startSec: rallyBaseTime,
      durationSec: 7.0,
      trackIndex: 0,
      theme: servingTeam === "home" ? "light" : "dark",
      team: servingTeam
    };

    setTimelineTags(prev => [...prev, errorTag]);

    // Side-out point to receiver (5 -> 6)
    if (receivingTeam === "home") {
      setHomeScore(prev => prev + 1);
    } else {
      setAwayScore(prev => prev + 1);
    }

    // Side-out: serving turns to other team
    setServingTeam(receivingTeam);

    const nextBase = rallyBaseTime + 32;
    setRallyBaseTime(nextBase);
    setCurrentTime(nextBase);

    setActiveCaliper({
      visible: true,
      label: "Serve",
      startSec: nextBase,
      durationSec: 6.5,
      trackIndex: 0
    });

    setTaggerMode("DUAL_KEYPAD");
    triggerAlert("success", `Serve Error #${ath.num}. Point ${receivingTeam === "home" ? homeTeam : awayTeam}! Side-out.`);
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

  // Timeline coordinate mapping
  // Visible window: 01:29:20 (5360s) to 01:31:50 (5510s) = 150 seconds span
  const windowStartSec = 5360;
  const totalWindowSec = 150;

  const getLeftPct = (sec: number) => {
    return ((sec - windowStartSec) / totalWindowSec) * 100;
  };

  const getWidthPct = (durationSec: number) => {
    return (durationSec / totalWindowSec) * 100;
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
                  End Current Set
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEndSetMenu(false);
                    triggerAlert("success", `Match completed.`);
                    handleSaveAndExit();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-orange-500 hover:text-white transition-colors"
                >
                  End Match
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowCoachNotes(true)}
            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-slate-200 rounded text-xs flex items-center gap-1.5 border border-neutral-700 cursor-pointer font-medium"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>Coach Notes</span>
          </button>

          <button
            type="button"
            onClick={() => setShowOptionsModal(true)}
            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-slate-200 rounded text-xs flex items-center gap-1.5 border border-neutral-700 cursor-pointer font-medium"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Options</span>
          </button>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN WORKSPACE (Left: Video & Timeline, Right: Options)    */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* =========================================================== */}
        {/* LEFT COLUMN: MATCH VIDEO + WATERFALL 4-TRACK TIMELINE       */}
        {/* =========================================================== */}
        <div className="flex-1 flex flex-col bg-black overflow-hidden relative">
          
          {/* A. Live Running Video Frame */}
          <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              src="/demo.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-contain pointer-events-none"
            />

            {/* Score Bug Overlay */}
            <div className="absolute top-3 left-4 bg-black/85 backdrop-blur-xs border border-neutral-800 rounded px-3 py-1.5 flex items-center gap-4 text-xs font-mono shadow-lg pointer-events-none">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-slate-400">HOME</span>
                <span className="font-extrabold text-orange-400 text-base">{homeScore}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] uppercase tracking-widest text-slate-400">SET {period}</span>
                <span className="font-bold text-slate-200 text-xs">1:00</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-wider text-slate-400">GUESTS</span>
                <span className="font-extrabold text-blue-400 text-base">{awayScore}</span>
              </div>
            </div>
          </div>

          {/* B. Video Scrubber Bar (Orange Line) */}
          <div 
            className="h-1.5 bg-[#2a313a] w-full relative cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              setCurrentTime(pct * totalDuration);
            }}
          >
            <div 
              className="h-full bg-orange-500 relative"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* C. Transport Playback Controls */}
          <div className="h-8 bg-[#161a1e] border-t border-neutral-900 px-3 flex items-center justify-between text-xs flex-shrink-0 text-slate-300">
            {/* Left Playback Buttons */}
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
                className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-white cursor-pointer shadow transition-colors"
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
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

          {/* D. Multi-Track Waterfall Timeline (Exact Geometry from Reference Video) */}
          <div 
            style={{ height: `${timelineHeight}px` }} 
            className="bg-[#14181c] border-t border-neutral-900 flex flex-col justify-between flex-shrink-0 relative overflow-hidden transition-all"
          >
            {/* Top Empty Workspace with Center Splitter Resize Handle */}
            <div className="flex-1 w-full relative bg-[#13171c] flex flex-col justify-end">
              
              {/* Splitter Line with Centered ≡ Handle */}
              <div 
                onClick={() => setTimelineHeight(prev => prev === 180 ? 250 : 180)}
                className="w-full h-3 border-t border-[#222831] bg-[#161a20] flex items-center justify-center cursor-ns-resize select-none"
                title="Click to toggle timeline height"
              >
                <span className="text-[10px] text-neutral-500 font-bold tracking-widest leading-none">≡</span>
              </div>
            </div>

            {/* 4-Track Ribbon Container (Exactly 4 rows of 14px = 56px height) */}
            <div className="relative w-full h-[56px] bg-[#161a20] border-y border-[#232932] overflow-visible select-none">
              
              {/* Row Guidelines (4 Contiguous Tracks) */}
              <div className="absolute inset-x-0 top-0 h-[14px] border-b border-[#232932]" />
              <div className="absolute inset-x-0 top-[14px] h-[14px] border-b border-[#232932]" />
              <div className="absolute inset-x-0 top-[28px] h-[14px] border-b border-[#232932]" />
              <div className="absolute inset-x-0 top-[42px] h-[14px]" />

              {/* Subtle Vertical Time Tick Guidelines (every 30s) */}
              {[5370, 5400, 5430, 5460, 5490].map(tickSec => (
                <div 
                  key={tickSec} 
                  className="absolute top-0 bottom-0 w-[1px] bg-neutral-800/50 pointer-events-none"
                  style={{ left: `${getLeftPct(tickSec)}%` }}
                />
              ))}

              {/* Render Finalized Waterfall Tags (Contiguous solid rectangular blocks) */}
              {timelineTags.map((tag) => {
                const left = getLeftPct(tag.startSec);
                const width = Math.max(4.5, getWidthPct(tag.durationSec));

                // Don't render out of view
                if (left + width < -10 || left > 110) return null;

                const isPreviousRally = tag.startSec < 5410;

                return (
                  <div
                    key={tag.id}
                    onClick={() => {
                      setCurrentTime(tag.startSec);
                      setActiveCaliper({
                        visible: true,
                        label: tag.label,
                        startSec: tag.startSec,
                        durationSec: tag.durationSec,
                        trackIndex: tag.trackIndex
                      });
                    }}
                    className={`absolute rounded-none text-[10px] leading-[14px] font-sans font-medium px-1 truncate cursor-pointer transition-colors flex items-center border-r select-none ${
                      tag.theme === "light"
                        ? `bg-[#cbd2d9] text-[#111827] border-[#8e9aa8] hover:bg-white ${isPreviousRally ? "opacity-75" : "opacity-100"}`
                        : `bg-[#374151] text-[#ffffff] border-[#1e242b] hover:bg-[#4b5563] ${isPreviousRally ? "opacity-75" : "opacity-100"}`
                    }`}
                    style={{
                      top: `${tag.trackIndex * 14}px`,
                      height: "14px",
                      left: `${left}%`,
                      width: `${width}%`
                    }}
                    title={`${tag.label} (${tag.durationSec}s)`}
                  >
                    <span className="truncate">{tag.label}</span>
                  </div>
                );
              })}

              {/* Active Caliper (Spans ALL 4 TRACKS - exactly as in the reference video!) */}
              {activeCaliper && activeCaliper.visible && (
                <div 
                  className="absolute top-0 bottom-0 bg-[#d3d2d5] text-[#111827] z-30 shadow-md border-y border-[#94a3b8] pointer-events-auto"
                  style={{
                    left: `${getLeftPct(activeCaliper.startSec)}%`,
                    width: `${Math.max(5.0, getWidthPct(activeCaliper.durationSec))}%`,
                    height: "56px"
                  }}
                >
                  {/* Left Grab Handle (Vertical Pill with || Slits) */}
                  <div className="absolute -left-1 top-[-2px] bottom-[-2px] w-2 bg-[#89888b] border border-[#555a63] rounded-[1px] shadow flex items-center justify-center cursor-ew-resize">
                    <div className="flex gap-[1px]">
                      <div className="w-[1px] h-3.5 bg-[#23272e]" />
                      <div className="w-[1px] h-3.5 bg-[#23272e]" />
                    </div>
                  </div>

                  {/* Inside Top-Left Label */}
                  <div className="absolute top-0.5 left-1 text-[9px] font-bold text-neutral-900 leading-none select-none">
                    {activeCaliper.label}
                  </div>

                  {/* Center Vertical Playhead Line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-white shadow pointer-events-none" />

                  {/* Right Grab Handle (Vertical Pill with || Slits) */}
                  <div className="absolute -right-1 top-[-2px] bottom-[-2px] w-2 bg-[#89888b] border border-[#555a63] rounded-[1px] shadow flex items-center justify-center cursor-ew-resize">
                    <div className="flex gap-[1px]">
                      <div className="w-[1px] h-3.5 bg-[#23272e]" />
                      <div className="w-[1px] h-3.5 bg-[#23272e]" />
                    </div>
                  </div>
                </div>
              )}

              {/* Running White Playhead with Center Pill Handle (when no active caliper) */}
              {!activeCaliper?.visible && (
                <div 
                  className="absolute top-[-4px] bottom-[-4px] w-[1.5px] bg-white z-40 pointer-events-none flex items-center justify-center shadow"
                  style={{ left: `${getLeftPct(currentTime)}%` }}
                >
                  <div className="w-2.5 h-3.5 rounded-xs bg-white text-black text-[7px] flex items-center justify-center font-bold shadow -ml-[0.5px]">
                    ≡
                  </div>
                </div>
              )}

            </div>

            {/* Timecode Marks Ruler (01:29:30, 01:30:00, 01:30:30, 01:31:00, 01:31:30, 01:32:00) */}
            <div className="h-[18px] bg-[#13161a] border-t border-neutral-900 flex justify-between items-center text-[9px] font-mono text-slate-400 px-3 select-none flex-shrink-0">
              <span style={{ position: "relative", left: `${getLeftPct(5370)}%` }}>01:29:30</span>
              <span style={{ position: "relative", left: `${getLeftPct(5400) - 25}%` }}>01:30:00</span>
              <span className="text-slate-300 font-bold" style={{ position: "relative", left: `${getLeftPct(5430) - 45}%` }}>01:30:30</span>
              <span className="text-slate-300 font-bold" style={{ position: "relative", left: `${getLeftPct(5460) - 65}%` }}>01:31:00</span>
              <span style={{ position: "relative", left: `${getLeftPct(5490) - 85}%` }}>01:31:30</span>
              <span>01:32:00</span>
            </div>
          </div>

        </div>

        {/* =========================================================== */}
        {/* RIGHT COLUMN: TAGGING PANEL WITH INTERACTIVE OPTIONS        */}
        {/* =========================================================== */}
        <div className="w-[430px] bg-[#161a1e] border-l border-neutral-800 flex flex-col justify-between flex-shrink-0 z-30">
          
          {/* ========================================================= */}
          {/* OPTION SET 1: DUAL COLUMN KEYPAD (Serve State)            */}
          {/* ========================================================= */}
          {taggerMode === "DUAL_KEYPAD" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 flex flex-col">
                
                {/* Subheader: Team Serve */}
                <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between text-neutral-900 font-bold text-xs flex-shrink-0">
                  <span className="font-extrabold text-sm">
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

                {/* Dual Columns (Home vs Away) */}
                <div className="flex-1 grid grid-cols-2">
                  
                  {/* Left Column: Home Team (White / Light Column) */}
                  <div className="bg-[#f0f2f5] border-r border-neutral-300 flex flex-col">
                    <div className="p-3 font-extrabold text-neutral-900 text-sm border-b border-neutral-300 bg-white">
                      {homeTeam}
                    </div>

                    <div className="p-3 flex flex-col gap-2.5">
                      <button
                        type="button"
                        onClick={handleAce}
                        className="w-full text-left font-bold text-neutral-900 text-sm hover:text-orange-600 transition-colors cursor-pointer py-1.5 px-2 rounded hover:bg-white"
                      >
                        Ace
                      </button>

                      <button
                        type="button"
                        onClick={handleServeErrorClick}
                        className="w-full text-left font-bold text-neutral-900 text-sm hover:text-red-600 transition-colors cursor-pointer py-1.5 px-2 rounded hover:bg-white"
                      >
                        Serve Error
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          saveHistorySnapshot();
                          triggerAlert("info", "Violation recorded.");
                        }}
                        className="w-full text-left font-bold text-neutral-900 text-sm hover:text-amber-600 transition-colors cursor-pointer py-1.5 px-2 rounded hover:bg-white"
                      >
                        Violation
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Away Team (Dark Charcoal Column) */}
                  <div className="bg-[#3c444c] flex flex-col text-white">
                    <div className="p-3 font-extrabold text-white text-sm border-b border-neutral-600 bg-[#343b42]">
                      {awayTeam}
                    </div>

                    <div className="p-3 flex flex-col gap-2.5">
                      <button
                        type="button"
                        onClick={handleTriggerServeReceive}
                        className="w-full text-left font-bold text-white text-sm hover:text-orange-400 transition-colors cursor-pointer py-1.5 px-2 rounded hover:bg-[#464f58]"
                      >
                        Serve Receive
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          saveHistorySnapshot();
                          handleTriggerFreeBall();
                        }}
                        className="w-full text-left font-bold text-white text-sm hover:text-orange-400 transition-colors cursor-pointer py-1.5 px-2 rounded hover:bg-[#464f58]"
                      >
                        Over Pass
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          saveHistorySnapshot();
                          triggerAlert("info", "Violation recorded.");
                        }}
                        className="w-full text-left font-bold text-white text-sm hover:text-amber-400 transition-colors cursor-pointer py-1.5 px-2 rounded hover:bg-[#464f58]"
                      >
                        Violation
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Buttons */}
              <div className="p-3 border-t border-neutral-800 bg-[#161a1e] flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowProblemReportModal(true)}
                  className="w-full py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  Problem Report
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndExit}
                  className="w-full py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  Save and Exit
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* OPTION SET 2: WATERFALL TOUCHES (Free Ball, Set, Kill)    */}
          {/* ========================================================= */}
          {taggerMode === "WATERFALL_TOUCHES" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 flex flex-col">
                
                {/* Subheader */}
                <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between text-neutral-900 font-bold text-xs flex-shrink-0">
                  <span className="font-extrabold text-sm">Rally in Progress</span>
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
                  
                  {/* Left Column: Home Team Actions */}
                  <div className="bg-[#f0f2f5] border-r border-neutral-300 flex flex-col">
                    <div className="p-3 font-extrabold text-neutral-900 text-sm border-b border-neutral-300 bg-white">
                      {homeTeam}
                    </div>

                    <div className="p-3 flex flex-col gap-2.5">
                      <button
                        type="button"
                        onClick={handleTriggerSet}
                        className="w-full text-left font-bold text-neutral-900 text-sm hover:text-orange-600 transition-colors cursor-pointer py-1.5 px-2 rounded hover:bg-white"
                      >
                        Set
                      </button>

                      <button
                        type="button"
                        onClick={handleTriggerAttackKill}
                        className="w-full text-left font-bold text-neutral-900 text-sm hover:text-orange-600 transition-colors cursor-pointer py-1.5 px-2 rounded hover:bg-white bg-white shadow-xs border border-neutral-300"
                      >
                        Attack Kill
                      </button>

                      <button
                        type="button"
                        onClick={handleTriggerFreeBallReceive}
                        className="w-full text-left font-bold text-neutral-900 text-sm hover:text-orange-600 transition-colors cursor-pointer py-1.5 px-2 rounded hover:bg-white"
                      >
                        Free Ball Receive
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Away Team Actions */}
                  <div className="bg-[#3c444c] flex flex-col text-white">
                    <div className="p-3 font-extrabold text-white text-sm border-b border-neutral-600 bg-[#343b42]">
                      {awayTeam}
                    </div>

                    <div className="p-3 flex flex-col gap-2.5">
                      <button
                        type="button"
                        onClick={handleTriggerFreeBall}
                        className="w-full text-left font-bold text-white text-sm hover:text-orange-400 transition-colors cursor-pointer py-1.5 px-2 rounded hover:bg-[#464f58]"
                      >
                        Free Ball
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          saveHistorySnapshot();
                          handleTriggerFreeBall();
                        }}
                        className="w-full text-left font-bold text-white text-sm hover:text-orange-400 transition-colors cursor-pointer py-1.5 px-2 rounded hover:bg-[#464f58]"
                      >
                        Dig
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          saveHistorySnapshot();
                          triggerAlert("info", "Violation recorded.");
                        }}
                        className="w-full text-left font-bold text-white text-sm hover:text-amber-400 transition-colors cursor-pointer py-1.5 px-2 rounded hover:bg-[#464f58]"
                      >
                        Violation
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Buttons */}
              <div className="p-3 border-t border-neutral-800 bg-[#161a1e] flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowProblemReportModal(true)}
                  className="w-full py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  Problem Report
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndExit}
                  className="w-full py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
                >
                  Save and Exit
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* OPTION SET 3: ATTACK KILL PROMPT (2D Court + Athlete)     */}
          {/* ========================================================= */}
          {taggerMode === "ATTACK_KILL_PROMPT" && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white text-neutral-900">
              
              {/* Header */}
              <div className="h-9 bg-[#111417] border-b border-neutral-800 px-4 flex items-center justify-center flex-shrink-0">
                <span className="font-extrabold text-xs tracking-wider text-slate-100 font-sans">
                  Complete the Tag
                </span>
              </div>

              {/* Subheader */}
              <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between font-bold text-xs flex-shrink-0">
                <span className="font-extrabold text-sm">{servingTeam === "home" ? `${homeTeam} Attack Kill` : `${awayTeam} Attack Kill`}</span>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="flex items-center gap-1 text-[11px] text-neutral-700 hover:text-black cursor-pointer font-semibold"
                >
                  <Undo className="w-3.5 h-3.5" />
                  <span>Undo (U)</span>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
                <div className="flex flex-col gap-4">
                  
                  {/* Athlete Question */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between font-bold text-neutral-900 text-xs pb-1 border-b border-neutral-200">
                      <span>Who had the attack kill?</span>
                      <ChevronUp className="w-4 h-4 text-neutral-500" />
                    </div>

                    <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-neutral-900 text-xs">
                      {currentServerRoster.map(ath => (
                        <button
                          key={ath.num}
                          type="button"
                          onClick={() => setAttackKillPlayer(ath)}
                          className={`p-1.5 text-left font-sans text-[11px] rounded transition-colors cursor-pointer border ${
                            attackKillPlayer.num === ath.num
                              ? "bg-orange-500 text-white font-extrabold border-orange-600 shadow-sm"
                              : "hover:bg-neutral-100 border-transparent text-neutral-800"
                          }`}
                        >
                          <span className="font-bold mr-1">{ath.num}</span> {ath.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2D Court */}
                  <div className="flex flex-col gap-2 items-center">
                    <div className="text-xs font-bold text-neutral-800 self-start">
                      Where did the ball land?
                    </div>

                    <div className="w-[240px] h-[130px] border-2 border-neutral-800 bg-[#eef1f6] relative cursor-crosshair shadow-inner rounded-xs overflow-hidden">
                      <svg 
                        className="w-full h-full" 
                        viewBox="0 0 240 130"
                        onClick={handleCourtClick}
                      >
                        {/* Center Net Line */}
                        <line x1="120" y1="0" x2="120" y2="130" stroke="#000000" strokeWidth="2" strokeDasharray="3 3" />
                        {/* 3m Attack Lines */}
                        <line x1="80" y1="0" x2="80" y2="130" stroke="#94a3b8" strokeWidth="1" />
                        <line x1="160" y1="0" x2="160" y2="130" stroke="#94a3b8" strokeWidth="1" />

                        {/* Court Mark (+) */}
                        {attackLocation ? (
                          <g transform={`translate(${attackLocation.x}, ${attackLocation.y})`}>
                            <line x1="-8" y1="0" x2="8" y2="0" stroke="#000000" strokeWidth="3" />
                            <line x1="0" y1="-8" x2="0" y2="8" stroke="#000000" strokeWidth="3" />
                          </g>
                        ) : (
                          <g transform="translate(180, 65)">
                            <line x1="-8" y1="0" x2="8" y2="0" stroke="#000000" strokeWidth="3" />
                            <line x1="0" y1="-8" x2="0" y2="8" stroke="#000000" strokeWidth="3" />
                          </g>
                        )}
                      </svg>
                    </div>

                    <div className="text-[11px] text-neutral-500 text-center italic">
                      Click inside court to place (+) mark & award point
                    </div>
                  </div>

                </div>

                <div className="pt-3 border-t border-neutral-200 flex justify-between text-[11px] text-neutral-600">
                  <button type="button" onClick={() => setAttackKillPlayer({ num: 0, name: "Unknown" })} className="hover:underline">
                    Unknown Athlete
                  </button>
                  <button type="button" onClick={() => setShowRosterModal(true)} className="flex items-center gap-1 hover:underline">
                    <Pencil className="w-3 h-3" /> Edit Roster
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* OPTION SET 4: SERVE ERROR PROMPT                          */}
          {/* ========================================================= */}
          {taggerMode === "SERVE_ERROR_PROMPT" && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white text-neutral-900">
              
              {/* Header */}
              <div className="h-9 bg-[#111417] border-b border-neutral-800 px-4 flex items-center justify-center flex-shrink-0">
                <span className="font-extrabold text-xs tracking-wider text-slate-100 font-sans">
                  Complete the Tag
                </span>
              </div>

              {/* Subheader */}
              <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between font-bold text-xs flex-shrink-0">
                <span className="font-extrabold text-sm">{servingTeam === "home" ? `${homeTeam} Serve Error` : `${awayTeam} Serve Error`}</span>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="flex items-center gap-1 text-[11px] text-neutral-700 hover:text-black cursor-pointer font-semibold"
                >
                  <Undo className="w-3.5 h-3.5" />
                  <span>Undo (U)</span>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
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
          <div className="w-full max-w-md bg-[#1a1f24] border border-neutral-700 rounded-lg shadow-2xl p-5 flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
              <h3 className="font-bold text-sm text-slate-100">Coach Notes</h3>
              <button type="button" onClick={() => setShowCoachNotes(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={coachNotesText}
              onChange={(e) => setCoachNotesText(e.target.value)}
              placeholder="Type observations, tactical notes, or specific feedback for coaches..."
              className="w-full h-32 p-3 bg-[#111417] border border-neutral-700 rounded text-xs text-white focus:outline-hidden focus:border-orange-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCoachNotes(false)}
                className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCoachNotes(false);
                  triggerAlert("success", "Coach note saved successfully.");
                }}
                className="px-4 py-1.5 rounded bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Problem Report Modal */}
      {showProblemReportModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1a1f24] border border-neutral-700 rounded-lg shadow-2xl p-5 flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Problem Report
              </h3>
              <button type="button" onClick={() => setShowProblemReportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-300 font-semibold">Category</label>
              <select
                value={problemReportCategory}
                onChange={(e) => setProblemReportCategory(e.target.value)}
                className="w-full p-2 bg-[#111417] border border-neutral-700 rounded text-xs text-white"
              >
                <option value="Camera Angle Issue">Camera Angle Issue</option>
                <option value="Out of Focus / Glare">Out of Focus / Glare</option>
                <option value="Missing Jersey Number">Missing Jersey Number</option>
                <option value="Scoreboard Mismatch">Scoreboard Mismatch</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-300 font-semibold">Details</label>
              <textarea
                value={problemReportNotes}
                onChange={(e) => setProblemReportNotes(e.target.value)}
                placeholder="Describe the issue at timestamp..."
                className="w-full h-24 p-3 bg-[#111417] border border-neutral-700 rounded text-xs text-white focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowProblemReportModal(false)}
                className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProblemReportModal(false);
                  triggerAlert("success", "Problem report filed.");
                }}
                className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-xs font-bold text-white"
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
          <div className="w-full max-w-sm bg-[#1a1f24] border border-neutral-700 rounded-lg shadow-2xl p-5 flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
              <h3 className="font-bold text-sm text-slate-100">Tagging Options</h3>
              <button type="button" onClick={() => setShowOptionsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Playback Speed</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => {
                    const spd = parseFloat(e.target.value);
                    setPlaybackSpeed(spd);
                    if (videoRef.current) videoRef.current.playbackRate = spd;
                  }}
                  className="bg-[#111417] border border-neutral-700 rounded px-2 py-1 text-xs"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1.0}>1.0x (Normal)</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2.0}>2.0x</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Timeline Height</span>
                <button
                  type="button"
                  onClick={() => setTimelineHeight(prev => prev === 180 ? 250 : 180)}
                  className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs font-semibold"
                >
                  {timelineHeight === 180 ? "Default (180px)" : "Expanded (250px)"}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Team Rosters</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowOptionsModal(false);
                    setShowRosterModal(true);
                  }}
                  className="px-2 py-1 bg-orange-500 hover:bg-orange-600 rounded text-xs font-bold text-white"
                >
                  Edit Rosters
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-neutral-700">
              <button
                type="button"
                onClick={() => setShowOptionsModal(false)}
                className="px-4 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Roster Management Modal */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#1a1f24] border border-neutral-700 rounded-lg shadow-2xl p-5 flex flex-col gap-4 text-white max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Pencil className="w-4 h-4 text-orange-400" />
                Manage Team Rosters
              </h3>
              <button type="button" onClick={() => setShowRosterModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4 overflow-y-auto pr-1 text-xs">
              {/* Home Team Roster */}
              <div className="bg-[#12161a] p-3 rounded border border-neutral-800 flex flex-col gap-2">
                <span className="font-bold text-orange-400 text-sm">{homeTeam} (Home)</span>
                
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="#"
                    value={editingHomeNum}
                    onChange={(e) => setEditingHomeNum(e.target.value)}
                    className="w-14 p-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Athlete Name"
                    value={editingHomeName}
                    onChange={(e) => setEditingHomeName(e.target.value)}
                    className="flex-1 p-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingHomeNum || !editingHomeName) return;
                      setHomeRoster(prev => [...prev, { num: parseInt(editingHomeNum), name: editingHomeName }]);
                      setEditingHomeNum("");
                      setEditingHomeName("");
                    }}
                    className="px-3 py-1 bg-orange-500 rounded font-bold hover:bg-orange-600"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-col gap-1 max-h-56 overflow-y-auto">
                  {homeRoster.map(ath => (
                    <div key={ath.num} className="flex items-center justify-between py-1 px-2 bg-neutral-900 rounded border border-neutral-800">
                      <span><b className="text-orange-400 mr-2">#{ath.num}</b> {ath.name}</span>
                      <button
                        type="button"
                        onClick={() => setHomeRoster(prev => prev.filter(a => a.num !== ath.num))}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Away Team Roster */}
              <div className="bg-[#12161a] p-3 rounded border border-neutral-800 flex flex-col gap-2">
                <span className="font-bold text-blue-400 text-sm">{awayTeam} (Away)</span>
                
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="#"
                    value={editingAwayNum}
                    onChange={(e) => setEditingAwayNum(e.target.value)}
                    className="w-14 p-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Athlete Name"
                    value={editingAwayName}
                    onChange={(e) => setEditingAwayName(e.target.value)}
                    className="flex-1 p-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingAwayNum || !editingAwayName) return;
                      setAwayRoster(prev => [...prev, { num: parseInt(editingAwayNum), name: editingAwayName }]);
                      setEditingAwayNum("");
                      setEditingAwayName("");
                    }}
                    className="px-3 py-1 bg-blue-500 rounded font-bold hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-col gap-1 max-h-56 overflow-y-auto">
                  {awayRoster.map(ath => (
                    <div key={ath.num} className="flex items-center justify-between py-1 px-2 bg-neutral-900 rounded border border-neutral-800">
                      <span><b className="text-blue-400 mr-2">#{ath.num}</b> {ath.name}</span>
                      <button
                        type="button"
                        onClick={() => setAwayRoster(prev => prev.filter(a => a.num !== ath.num))}
                        className="text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
