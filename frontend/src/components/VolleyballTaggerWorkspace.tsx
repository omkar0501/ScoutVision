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
  Minimize, 
  Check, 
  Undo, 
  ChevronDown, 
  ChevronUp, 
  Pencil, 
  AlertCircle, 
  MessageSquare, 
  SlidersHorizontal 
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
  trackIndex: 0 | 1 | 2;
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

  // Mode: "DUAL_COLUMN" | "COMPLETE_THE_TAG" | "SERVE_ERROR"
  const [taggerMode, setTaggerMode] = useState<"DUAL_COLUMN" | "COMPLETE_THE_TAG" | "SERVE_ERROR">("COMPLETE_THE_TAG");
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

  // 2D Court Vector (Origin Blue Dot -> Landing Black Cross)
  // Default values set to match the video at 41s:
  // Origin near net right side (x: 185, y: 35) -> Landing in back corner left side (x: 45, y: 110)
  const [attackStart, setAttackStart] = useState<{ x: number; y: number } | null>({ x: 185, y: 35 });
  const [attackEnd, setAttackEnd] = useState<{ x: number; y: number } | null>({ x: 45, y: 110 });
  const [attackDeflected, setAttackDeflected] = useState(false);

  // Multi-track timeline tags (matching the video exact tags!)
  const [timelineTags, setTimelineTags] = useState<TimelineTag[]>([
    { id: "t1", label: "Serve #10", timeSec: 5390, trackIndex: 0, team: "home" },
    { id: "t2", label: "Dig #9", timeSec: 5398, trackIndex: 0, team: "away" },
    { id: "t3", label: "Free Ball #1", timeSec: 5404, trackIndex: 0, team: "away" },
    { id: "t4", label: "Dig #18", timeSec: 5410, trackIndex: 0, team: "home" },
    { id: "t5", label: "Set #2", timeSec: 5414, trackIndex: 0, team: "home" },
    { id: "t6", label: "Serve Receive #1", timeSec: 5393, trackIndex: 1, team: "away" },
    { id: "t7", label: "Set #9", timeSec: 5400, trackIndex: 1, team: "away" },
    { id: "t8", label: "Free Ball Receive #7", timeSec: 5406, trackIndex: 1, team: "home" },
    { id: "t9", label: "Set #10", timeSec: 5411, trackIndex: 1, team: "home" },
    { id: "t10", label: "Attack Kill #13", timeSec: 5416, trackIndex: 1, team: "home" },
    { id: "t11", label: "Attack #1", timeSec: 5402, trackIndex: 2, team: "away" },
    { id: "t12", label: "Attack #13", timeSec: 5408, trackIndex: 2, team: "home" },
    { id: "t13", label: "Attack #18", timeSec: 5415, trackIndex: 2, team: "home" },
    { id: "t14", label: "Dig #10", timeSec: 5418, trackIndex: 2, team: "away" }
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
  }, [isPlaying]);

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
    if (taggerMode === "SERVE_ERROR") {
      setTaggerMode("DUAL_COLUMN");
      triggerAlert("info", "Undid Serve Error selection");
    } else if (taggerMode === "COMPLETE_THE_TAG") {
      setTaggerMode("DUAL_COLUMN");
      triggerAlert("info", "Undid Complete the Tag");
    } else {
      triggerAlert("info", "Last action undone (U)");
    }
  };

  // Step finishing: Save Attack Kill
  const handleFinishAttackKillTag = () => {
    // 1. Increment MHS score from 10 to 11
    setHomeScore(11);
    
    // 2. Add Attack Kill #18 to timeline
    const newTag: TimelineTag = {
      id: `t_${Date.now()}`,
      label: `Attack Kill #${killingPlayer.num}`,
      timeSec: currentTime,
      trackIndex: 1,
      team: "home"
    };
    setTimelineTags(prev => [...prev, newTag]);

    triggerAlert("success", `Point MHS! Attack Kill #${killingPlayer.num} logged (11 - 5).`);

    // 3. Move to next event: Serve Error (as in video frame 11)
    setTaggerMode("SERVE_ERROR");
    setCurrentActionTitle("MHS Serve Error");
    setCurrentTime(prev => prev + 15);
  };

  // Step finishing: Save Serve Error
  const handleSelectServeErrorAthlete = (ath: Athlete) => {
    setErrorServer(ath);
    // Team 2 score increments from 5 to 6
    setAwayScore(6);

    const newTag: TimelineTag = {
      id: `t_${Date.now()}`,
      label: `Serve Error #${ath.num}`,
      timeSec: currentTime + 5,
      trackIndex: 0,
      team: "home"
    };
    setTimelineTags(prev => [...prev, newTag]);

    triggerAlert("success", `Point Team 2! Serve Error #${ath.num} logged (11 - 6).`);

    // Reset back to Dual-Column mode for next serve
    setTaggerMode("DUAL_COLUMN");
    setCurrentActionTitle("MHS Serve");
    setCurrentTime(prev => prev + 10);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#12161a] text-white flex flex-col font-sans select-none overflow-hidden">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER MATCH BAR                                       */}
      {/* ------------------------------------------------------------- */}
      <header className="h-10 bg-[#0e1215] border-b border-neutral-800 px-6 flex items-center justify-between text-xs flex-shrink-0 z-40">
        
        {/* Left: Branding & Team */}
        <div className="flex items-center gap-4">
          <span className="font-bold font-sans text-sm tracking-wide text-white">
            {homeTeam}
          </span>
        </div>

        {/* Center: Live Match Scoreboard */}
        <div className="flex items-center gap-6 font-bold text-sm tracking-widest text-slate-200">
          <span className="text-white font-extrabold text-base">{homeScore}</span>
          <span className="px-2 py-0.5 rounded bg-neutral-800/80 text-orange-400 font-mono text-xs uppercase font-semibold">
            {period}
          </span>
          <span className="text-white font-extrabold text-base">{awayScore}</span>
          <span className="text-slate-300 font-bold text-xs">{awayTeam}</span>
        </div>

        {/* Right: Controls & Menus */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
          
          {/* End Set or Match Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEndSetMenu(!showEndSetMenu)}
              className="hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>End Set or Match</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showEndSetMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-[#191F24] border border-neutral-700 rounded shadow-2xl py-1 z-50 text-left">
                <button
                  type="button"
                  onClick={() => {
                    setShowEndSetMenu(false);
                    triggerAlert("success", "Set concluded and archived.");
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-neutral-800 text-xs font-semibold text-white"
                >
                  End Set
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEndSetMenu(false);
                    triggerAlert("success", "Match officially ended.");
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-neutral-800 text-xs font-semibold text-white"
                >
                  End Match
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowCoachNotes(true)}
            className="hover:text-white cursor-pointer"
          >
            Coach Notes
          </button>

          <button
            type="button"
            onClick={() => setShowOptionsModal(true)}
            className="hover:text-white cursor-pointer"
          >
            Options
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN SPLIT CANVAS (Video + Timeline on Left, Tagging on Right) */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        
        {/* =========================================================== */}
        {/* LEFT COLUMN: Video Player + Controls + Multi-Track Timeline */}
        {/* =========================================================== */}
        <div className="flex-1 flex flex-col bg-black min-w-0 border-r border-neutral-800 relative">
          
          {/* A. Video Container */}
          <div className="flex-1 relative min-h-0 bg-black flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              src="/videos/volleyball_match.mp4"
              className="w-full h-full object-contain"
              playsInline
              loop
              muted={isMuted}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  // Offset simulation
                  setCurrentTime(5420 + Math.floor(videoRef.current.currentTime));
                }
              }}
            />

            {/* B. LED Digital Scoreboard Graphic Overlay (Bottom-Left Corner) */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none select-none">
              <div className="bg-black/90 border-2 border-neutral-700 rounded-sm p-2 text-amber-500 font-mono shadow-2xl flex flex-col gap-1 w-32 backdrop-blur-xs">
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

          {/* C. Video Playback Control Scrubber Bar */}
          <div className="h-10 bg-[#14181c] border-t border-neutral-800 px-4 flex items-center justify-between text-xs text-slate-300 flex-shrink-0 z-10">
            
            {/* Left Transport Controls */}
            <div className="flex items-center gap-3">
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
                onClick={() => handleSeek(1)} 
                className="hover:text-white cursor-pointer text-[11px] font-bold font-mono"
                title="Frame Forward"
              >
                ▶▶
              </button>

              {/* Timecode */}
              <span className="font-mono text-xs text-slate-300 ml-2 font-bold">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>

            {/* Middle Orange Scrubber Bar */}
            <div className="flex-1 mx-6 relative flex items-center">
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden relative">
                <div 
                  className="bg-[#ff6300] h-full transition-all duration-75"
                  style={{ width: `${Math.min(100, (currentTime / totalDuration) * 100)}%` }}
                />
              </div>
            </div>

            {/* Right Controls */}
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

          {/* D. Multi-Track Timeline (Bottom) */}
          <div className="h-28 bg-[#0c0f12] border-t border-neutral-900 px-4 py-2 flex flex-col justify-between flex-shrink-0 relative overflow-hidden">
            
            {/* 3 Tracks */}
            <div className="relative w-full flex-1 flex flex-col justify-around py-1">
              
              {/* Vertical Playhead Cursor */}
              <div 
                className="absolute top-0 bottom-0 w-[2px] bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] z-30 pointer-events-none"
                style={{ left: "45%" }}
              />

              {/* Track lines */}
              <div className="absolute inset-x-0 top-1/4 h-[1px] bg-neutral-900" />
              <div className="absolute inset-x-0 top-2/4 h-[1px] bg-neutral-900" />
              <div className="absolute inset-x-0 top-3/4 h-[1px] bg-neutral-900" />

              {/* Render Tag Blocks on Timeline */}
              {timelineTags.map((tag, idx) => {
                // Approximate offset relative to 5420
                const offsetSec = tag.timeSec - 5420;
                const leftPercent = 45 + (offsetSec * 1.5);

                if (leftPercent < -20 || leftPercent > 120) return null;

                const isKill = tag.label.includes("Kill");
                const isError = tag.label.includes("Error");

                return (
                  <div
                    key={tag.id}
                    onClick={() => setCurrentTime(tag.timeSec)}
                    className={`absolute rounded text-[10px] font-bold px-2 py-0.5 cursor-pointer whitespace-nowrap shadow transition-all border ${
                      isKill
                        ? "bg-white text-black border-neutral-400 font-extrabold"
                        : isError
                        ? "bg-red-950 text-red-300 border-red-800"
                        : tag.team === "home"
                        ? "bg-[#252c34] text-slate-200 border-neutral-700 hover:border-orange-500"
                        : "bg-[#1c2228] text-slate-300 border-neutral-800 hover:border-blue-500"
                    }`}
                    style={{
                      top: `${tag.trackIndex * 26}px`,
                      left: `${leftPercent}%`,
                      height: "22px"
                    }}
                  >
                    {tag.label}
                  </div>
                );
              })}
            </div>

            {/* Bottom Timecode Marks */}
            <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 pt-1 border-t border-neutral-900">
              <span>01:29:30</span>
              <span>01:30:00</span>
              <span className="text-amber-400 font-bold">01:30:20 (NOW)</span>
              <span>01:30:30</span>
              <span>01:31:00</span>
              <span>01:31:30</span>
            </div>
          </div>

        </div>

        {/* =========================================================== */}
        {/* RIGHT COLUMN: TAGGING PANEL (Exact Same-To-Same UI)         */}
        {/* =========================================================== */}
        <div className="w-80 md:w-96 bg-[#161a1e] border-l border-neutral-800 flex flex-col justify-between flex-shrink-0 z-30">
          
          {/* ========================================================= */}
          {/* CASE A: "COMPLETE THE TAG" ACCORDION FLOW                 */}
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
              <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between text-neutral-900 font-bold text-xs flex-shrink-0 shadow-sm">
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
                    <span>Who served? <span className="font-extrabold text-neutral-950 ml-1">#{selectedServer.num} {selectedServer.name}</span></span>
                    {activeAccordionStep === "whoServed" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeAccordionStep === "whoServed" && (
                    <div className="p-3 bg-[#1e2329] grid grid-cols-2 gap-2 text-white">
                      {mhsRoster.map(ath => (
                        <button
                          key={ath.num}
                          type="button"
                          onClick={() => {
                            setSelectedServer(ath);
                            setActiveAccordionStep("whoReceived");
                          }}
                          className={`p-2 rounded text-left font-mono text-xs font-semibold hover:bg-orange-500 hover:text-white transition-all ${selectedServer.num === ath.num ? "bg-orange-500 text-white font-bold" : "bg-neutral-800 text-slate-200"}`}
                        >
                          <span className="font-bold mr-1.5">{ath.num}</span> {ath.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Who received the serve? */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveAccordionStep(activeAccordionStep === "whoReceived" ? "" : "whoReceived")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who received the serve? <span className="font-extrabold text-neutral-950 ml-1">#{selectedReceiver.num}</span></span>
                    {activeAccordionStep === "whoReceived" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeAccordionStep === "whoReceived" && (
                    <div className="p-3 bg-[#1e2329] grid grid-cols-2 gap-2 text-white">
                      {team2Roster.map(ath => (
                        <button
                          key={ath.num}
                          type="button"
                          onClick={() => {
                            setSelectedReceiver(ath);
                            setActiveAccordionStep("rateServeReceive");
                          }}
                          className={`p-2 rounded text-left font-mono text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all ${selectedReceiver.num === ath.num ? "bg-blue-600 text-white font-bold" : "bg-neutral-800 text-slate-200"}`}
                        >
                          <span className="font-bold mr-1.5">{ath.num}</span> {ath.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Rate the serve receive */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveAccordionStep(activeAccordionStep === "rateServeReceive" ? "" : "rateServeReceive")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Rate the serve receive. <span className="font-extrabold text-neutral-950 ml-1">{serveRating}</span></span>
                    {activeAccordionStep === "rateServeReceive" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeAccordionStep === "rateServeReceive" && (
                    <div className="p-4 bg-[#1e2329] flex items-center justify-center gap-3">
                      {[0, 1, 2, 3].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setServeRating(r);
                            setActiveAccordionStep("freeBallSender");
                          }}
                          className={`w-12 h-12 rounded-lg font-mono font-extrabold text-base flex items-center justify-center shadow transition-all cursor-pointer ${serveRating === r ? "bg-orange-500 text-white scale-105" : "bg-neutral-800 text-slate-200 hover:bg-neutral-700"}`}
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
                    onClick={() => setActiveAccordionStep(activeAccordionStep === "freeBallSender" ? "" : "freeBallSender")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who sent the free ball? <span className="font-extrabold text-neutral-950 ml-1">#{freeBallSender.num} {freeBallSender.name}</span></span>
                    {activeAccordionStep === "freeBallSender" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeAccordionStep === "freeBallSender" && (
                    <div className="p-3 bg-[#1e2329] grid grid-cols-2 gap-2 text-white">
                      {team2Roster.map(ath => (
                        <button
                          key={ath.num}
                          type="button"
                          onClick={() => {
                            setFreeBallSender(ath);
                            setActiveAccordionStep("freeBallReceiver");
                          }}
                          className={`p-2 rounded text-left font-mono text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all ${freeBallSender.num === ath.num ? "bg-blue-600 text-white font-bold" : "bg-neutral-800 text-slate-200"}`}
                        >
                          <span className="font-bold mr-1.5">{ath.num}</span> {ath.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. Who received the free ball? */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveAccordionStep(activeAccordionStep === "freeBallReceiver" ? "" : "freeBallReceiver")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who received the free ball? <span className="font-extrabold text-neutral-950 ml-1">#{freeBallReceiver.num} {freeBallReceiver.name}</span></span>
                    {activeAccordionStep === "freeBallReceiver" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeAccordionStep === "freeBallReceiver" && (
                    <div className="p-3 bg-[#1e2329] grid grid-cols-2 gap-2 text-white">
                      {mhsRoster.map(ath => (
                        <button
                          key={ath.num}
                          type="button"
                          onClick={() => {
                            setFreeBallReceiver(ath);
                            setActiveAccordionStep("whoAssisted");
                          }}
                          className={`p-2 rounded text-left font-mono text-xs font-semibold hover:bg-orange-500 hover:text-white transition-all ${freeBallReceiver.num === ath.num ? "bg-orange-500 text-white font-bold" : "bg-neutral-800 text-slate-200"}`}
                        >
                          <span className="font-bold mr-1.5">{ath.num}</span> {ath.name}
                        </button>
                      ))}
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
                    <span>Who assisted? <span className="font-extrabold text-neutral-950 ml-1">#{assistingPlayer.num} {assistingPlayer.name}</span></span>
                    {activeAccordionStep === "whoAssisted" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeAccordionStep === "whoAssisted" && (
                    <div className="p-3 bg-[#1e2329] grid grid-cols-2 gap-2 text-white">
                      {mhsRoster.map(ath => (
                        <button
                          key={ath.num}
                          type="button"
                          onClick={() => {
                            setAssistingPlayer(ath);
                            setActiveAccordionStep("whoGotKill");
                          }}
                          className={`p-2 rounded text-left font-mono text-xs font-semibold hover:bg-orange-500 hover:text-white transition-all ${assistingPlayer.num === ath.num ? "bg-orange-500 text-white font-bold" : "bg-neutral-800 text-slate-200"}`}
                        >
                          <span className="font-bold mr-1.5">{ath.num}</span> {ath.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 7. Who got the kill? */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveAccordionStep(activeAccordionStep === "whoGotKill" ? "" : "whoGotKill")}
                    className="w-full bg-white text-neutral-900 px-4 py-2.5 flex items-center justify-between font-bold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span>Who got the kill? <span className="font-extrabold text-neutral-950 ml-1">#{killingPlayer.num}</span></span>
                    {activeAccordionStep === "whoGotKill" ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                  </button>
                  {activeAccordionStep === "whoGotKill" && (
                    <div className="p-3 bg-[#1e2329] grid grid-cols-2 gap-2 text-white">
                      {mhsRoster.map(ath => (
                        <button
                          key={ath.num}
                          type="button"
                          onClick={() => {
                            setKillingPlayer(ath);
                            setActiveAccordionStep("attackLocation");
                          }}
                          className={`p-2 rounded text-left font-mono text-xs font-semibold hover:bg-orange-500 hover:text-white transition-all ${killingPlayer.num === ath.num ? "bg-orange-500 text-white font-bold" : "bg-neutral-800 text-slate-200"}`}
                        >
                          <span className="font-bold mr-1.5">{ath.num}</span> {ath.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 8. Where did the attack occur? (The 2D Court Vector Canvas) */}
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
                    <div className="p-4 bg-[#181d22] flex flex-col gap-3">
                      
                      {/* Deflected Checkbox */}
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={attackDeflected}
                            onChange={(e) => setAttackDeflected(e.target.checked)}
                            className="w-4 h-4 rounded text-orange-500 focus:ring-0 cursor-pointer"
                          />
                          <span className="font-semibold text-white">Attack was deflected</span>
                        </label>
                        <span className="text-slate-400 text-[10px] font-mono">2-Click Vector</span>
                      </div>

                      {/* 2D Court SVG (White Court, Black Lines, Net, Arrow from Dot to Cross) */}
                      <div className="relative rounded bg-neutral-200 border-2 border-neutral-700 p-2 shadow-inner">
                        <svg
                          viewBox="0 0 240 120"
                          className="w-full h-32 cursor-crosshair select-none bg-neutral-100 rounded"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = Math.round(((e.clientX - rect.left) / rect.width) * 240);
                            const y = Math.round(((e.clientY - rect.top) / rect.height) * 120);

                            if (!attackStart) {
                              setAttackStart({ x, y });
                            } else if (!attackEnd) {
                              setAttackEnd({ x, y });
                            } else {
                              // Reset and start again
                              setAttackStart({ x, y });
                              setAttackEnd(null);
                            }
                          }}
                        >
                          {/* Court Boundary Lines */}
                          <rect x="10" y="10" width="220" height="100" fill="#f8fafc" stroke="#000000" strokeWidth="2" />
                          
                          {/* Net Line (Center Vertical Line) */}
                          <line x1="120" y1="5" x2="120" y2="115" stroke="#000000" strokeWidth="3.5" />
                          
                          {/* 3m / 10-ft Attack Lines (Dashed) */}
                          <line x1="80" y1="10" x2="80" y2="110" stroke="#000000" strokeWidth="1.5" strokeDasharray="3 3" />
                          <line x1="160" y1="10" x2="160" y2="110" stroke="#000000" strokeWidth="1.5" strokeDasharray="3 3" />

                          {/* Arrow Marker */}
                          <defs>
                            <marker id="arrowhead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                              <path d="M 0 1 L 9 5 L 0 9 z" fill="#000000" />
                            </marker>
                          </defs>

                          {/* Connecting Arrow Line */}
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

                          {/* Origin Dot (Blue Circle) */}
                          {attackStart && (
                            <circle cx={attackStart.x} cy={attackStart.y} r="5" fill="#0070f3" stroke="#ffffff" strokeWidth="1.5" />
                          )}

                          {/* Landing Cross (+) */}
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

              {/* Bottom Fixed Actions */}
              <div className="p-3 bg-[#111417] border-t border-neutral-800 flex flex-col gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowProblemReportModal(true)}
                  className="w-full py-2 bg-[#2c353d] hover:bg-[#39444e] text-slate-200 border border-slate-700/60 rounded font-sans text-xs font-bold cursor-pointer transition-colors text-center"
                >
                  Problem Report
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 bg-[#1a232a] border border-neutral-800 text-slate-300 rounded font-sans text-xs font-bold hover:bg-neutral-800 cursor-pointer transition-colors text-center"
                >
                  Save and Exit
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* CASE B: "SERVE ERROR" SELECTION (From frames 11-12)       */}
          {/* ========================================================= */}
          {taggerMode === "SERVE_ERROR" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="h-9 bg-[#111417] border-b border-neutral-800 px-4 flex items-center justify-center flex-shrink-0">
                <span className="font-extrabold text-xs tracking-wider text-slate-100 font-sans">
                  Complete the Tag
                </span>
              </div>

              <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center justify-between text-neutral-900 font-bold text-xs flex-shrink-0 shadow-sm">
                <span className="font-extrabold tracking-wide">MHS Serve Error</span>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="flex items-center gap-1 text-[11px] text-neutral-700 hover:text-black cursor-pointer font-semibold"
                >
                  <Undo className="w-3.5 h-3.5" />
                  <span>Undo (U)</span>
                </button>
              </div>

              {/* Who served the error? Step */}
              <div className="p-4 flex-1 overflow-y-auto bg-neutral-900 flex flex-col gap-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sans">
                  Who served the error?
                </h4>
                
                <div className="grid grid-cols-2 gap-2 text-white">
                  {mhsRoster.map(ath => (
                    <button
                      key={ath.num}
                      type="button"
                      onClick={() => handleSelectServeErrorAthlete(ath)}
                      className="p-2.5 rounded text-left font-mono text-xs font-semibold bg-neutral-800 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                    >
                      <span className="font-bold mr-1.5">{ath.num}</span> {ath.name}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-slate-400">
                  <button type="button" className="hover:underline cursor-pointer">Unknown Athlete</button>
                  <button type="button" className="hover:underline cursor-pointer flex items-center gap-1">
                    <Pencil className="w-3 h-3" /> Edit Roster
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-3 bg-[#111417] border-t border-neutral-800 flex flex-col gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowProblemReportModal(true)}
                  className="w-full py-2 bg-[#2c353d] hover:bg-[#39444e] text-slate-200 border border-slate-700/60 rounded font-sans text-xs font-bold cursor-pointer transition-colors text-center"
                >
                  Problem Report
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 bg-[#1a232a] border border-neutral-800 text-slate-300 rounded font-sans text-xs font-bold hover:bg-neutral-800 cursor-pointer transition-colors text-center"
                >
                  Save and Exit
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* CASE C: DUAL-COLUMN ACTION KEYPAD (MHS vs Team 2)        */}
          {/* ========================================================= */}
          {taggerMode === "DUAL_COLUMN" && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              
              {/* Header Bar */}
              <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex items-center justify-between text-white font-bold text-xs flex-shrink-0">
                <span>{currentActionTitle}</span>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white cursor-pointer font-semibold"
                >
                  <Undo className="w-3.5 h-3.5" />
                  <span>Undo (U)</span>
                </button>
              </div>

              {/* Dual Column Buttons */}
              <div className="flex-1 grid grid-cols-2 text-xs overflow-hidden">
                
                {/* Left Column: MHS (Light Background) */}
                <div className="bg-slate-200 text-neutral-900 flex flex-col justify-between border-r border-neutral-300">
                  <div className="p-2.5 bg-slate-300 font-extrabold uppercase tracking-wider text-xs border-b border-neutral-300 text-center">
                    {homeTeam}
                  </div>
                  <div className="flex-1 flex flex-col divide-y divide-slate-300">
                    <button
                      type="button"
                      onClick={() => {
                        setTaggerMode("COMPLETE_THE_TAG");
                        setCurrentActionTitle("MHS Attack Kill");
                      }}
                      className="w-full py-4 px-3 text-left font-bold hover:bg-white transition-colors cursor-pointer"
                    >
                      Ace
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTaggerMode("SERVE_ERROR");
                        setCurrentActionTitle("MHS Serve Error");
                      }}
                      className="w-full py-4 px-3 text-left font-bold hover:bg-white transition-colors cursor-pointer"
                    >
                      Serve Error
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTaggerMode("COMPLETE_THE_TAG");
                        setCurrentActionTitle("MHS Violation");
                      }}
                      className="w-full py-4 px-3 text-left font-bold hover:bg-white transition-colors cursor-pointer"
                    >
                      Violation
                    </button>
                  </div>
                  <div className="p-2 border-t border-slate-300 text-center text-[10px] text-slate-600 font-bold">
                    Home Team
                  </div>
                </div>

                {/* Right Column: Team 2 (Dark Charcoal Background) */}
                <div className="bg-[#495057] text-white flex flex-col justify-between">
                  <div className="p-2.5 bg-[#343a40] font-extrabold uppercase tracking-wider text-xs border-b border-neutral-600 text-center text-slate-200">
                    {awayTeam}
                  </div>
                  <div className="flex-1 flex flex-col divide-y divide-[#5c636a]">
                    <button
                      type="button"
                      onClick={() => {
                        setTaggerMode("COMPLETE_THE_TAG");
                        setCurrentActionTitle("Team 2 Serve Receive");
                      }}
                      className="w-full py-4 px-3 text-right font-bold hover:bg-[#5a6268] transition-colors cursor-pointer"
                    >
                      Serve Receive
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTaggerMode("COMPLETE_THE_TAG");
                        setCurrentActionTitle("Team 2 Over Pass");
                      }}
                      className="w-full py-4 px-3 text-right font-bold hover:bg-[#5a6268] transition-colors cursor-pointer"
                    >
                      Over Pass
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTaggerMode("COMPLETE_THE_TAG");
                        setCurrentActionTitle("Team 2 Violation");
                      }}
                      className="w-full py-4 px-3 text-right font-bold hover:bg-[#5a6268] transition-colors cursor-pointer"
                    >
                      Violation
                    </button>
                  </div>
                  <div className="p-2 border-t border-[#5c636a] text-center text-[10px] text-slate-400 font-bold">
                    Away Team
                  </div>
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="p-3 bg-[#111417] border-t border-neutral-800 flex flex-col gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowProblemReportModal(true)}
                  className="w-full py-2 bg-[#2c353d] hover:bg-[#39444e] text-slate-200 border border-slate-700/60 rounded font-sans text-xs font-bold cursor-pointer transition-colors text-center"
                >
                  Problem Report
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 bg-[#1a232a] border border-neutral-800 text-slate-300 rounded font-sans text-xs font-bold hover:bg-neutral-800 cursor-pointer transition-colors text-center"
                >
                  Save and Exit
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. MODALS (Coach Notes, Problem Report, Options)               */}
      {/* ------------------------------------------------------------- */}

      {/* Coach Notes Modal */}
      {showCoachNotes && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#191F24] border border-neutral-800 rounded-lg shadow-2xl p-6 flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-500" />
                Coach Notes & Match Observations
              </h3>
              <button type="button" onClick={() => setShowCoachNotes(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <textarea
              value={coachNotesText}
              onChange={(e) => setCoachNotesText(e.target.value)}
              rows={5}
              placeholder="Record tactical memos, setter rotation tendencies, or blocking adjustments..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCoachNotes(false)}
                className="px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCoachNotes(false);
                  triggerAlert("success", "Coach notes saved.");
                }}
                className="px-5 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white font-bold"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Problem Report Modal */}
      {showProblemReportModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#191F24] border border-neutral-800 rounded-lg shadow-2xl p-6 flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Problem Report - Match Issue
              </h3>
              <button type="button" onClick={() => setShowProblemReportModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-300 font-semibold">Issue Category *</label>
              <select
                value={problemReportCategory}
                onChange={(e) => setProblemReportCategory(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Camera Angle Issue">Camera Angle Issue</option>
                <option value="Video Stutter / Corrupted">Video Stutter / Corrupted</option>
                <option value="Wrong Jersey Color / Number">Wrong Jersey Color / Number</option>
                <option value="Scoreboard Out of Sync">Scoreboard Out of Sync</option>
                <option value="Audio / Whistle Inaudible">Audio / Whistle Inaudible</option>
                <option value="Other">Other Problem</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-300 font-semibold">Details & Timestamp Notes</label>
              <textarea
                value={problemReportNotes}
                onChange={(e) => setProblemReportNotes(e.target.value)}
                rows={4}
                placeholder={`Describe the problem at timestamp ${formatTime(currentTime)}...`}
                className="w-full bg-neutral-900 border border-neutral-800 rounded p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowProblemReportModal(false)}
                className="px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProblemReportModal(false);
                  triggerAlert("success", `Problem report submitted: ${problemReportCategory}`);
                  setProblemReportNotes("");
                }}
                className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Options Modal */}
      {showOptionsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#191F24] border border-neutral-800 rounded-lg shadow-2xl p-6 flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
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
