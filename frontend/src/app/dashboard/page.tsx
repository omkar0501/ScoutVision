"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole, User, AuditLog, InvitationEmail, Match } from "@/context/AuthContext";
import Link from "next/link";
import VolleyballTaggerWorkspace from "@/components/VolleyballTaggerWorkspace";
import {
  Users,
  Settings,
  LogOut,
  FolderOpen,
  Upload,
  Plus,
  Play,
  Cpu,
  Sliders,
  Home,
  ShieldAlert,
  Search,
  Mail,
  UserPlus,
  Edit2,
  Trash2,
  RefreshCw,
  FileText,
  UserCheck,
  CheckCircle2,
  Info,
  Calendar,
  Phone,
  Bookmark,
  ChevronDown,
  Activity,
  Layers,
  Pause,
  AlertTriangle
} from "lucide-react";

export default function DashboardPage() {
  const {
    user,
    logout,
    isLoading,
    getUsers,
    createUser,
    updateUser,
    deactivateUser,
    reactivateUser,
    resetPassword,
    getAuditLogs,
    getSentEmails,
    getMatches,
    claimNextMatch,
    assignMatchManually,
    unassignMatch,
    updateMatchStatus,
    createMatch
  } = useAuth();
  
  const router = useRouter();

  // Sidebar navigations & active views
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  
  // Real-time tick state
  const [nowTime, setNowTime] = useState(new Date());

  // Simulation database state
  const [userList, setUserList] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [sentEmails, setSentEmails] = useState<InvitationEmail[]>([]);
  const [matchesList, setMatchesList] = useState<Match[]>([]);
  
  // Admin search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Queue search & filter states
  const [queueSearch, setQueueSearch] = useState("");
  const [queueSport, setQueueSport] = useState("ALL");
  const [queueOrg, setQueueOrg] = useState("ALL");
  const [queuePkg, setQueuePkg] = useState("ALL");
  const [queueStatus, setQueueStatus] = useState("ALL");
  const [queueAssign, setQueueAssign] = useState("ALL");

  // Create User Wizard
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [selectedRoleToCreate, setSelectedRoleToCreate] = useState<UserRole>("ANALYST");
  const [createdUser, setCreatedUser] = useState<User | null>(null);

  // Create User Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState(""); 
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [sportsAccess, setSportsAccess] = useState<string[]>([]); 
  const [teamLeadId, setTeamLeadId] = useState(""); 
  const [tenantName, setTenantName] = useState("");

  // Edit User State
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Manual Match Assignment Modal State
  const [assigningMatch, setAssigningMatch] = useState<Match | null>(null);
  const [selectedAnalystForAssign, setSelectedAnalystForAssign] = useState("");

  // Team Lead: Onboard analyst modal states
  const [showOnboardAnalystModal, setShowOnboardAnalystModal] = useState(false);
  const [selectedAnalystToOnboard, setSelectedAnalystToOnboard] = useState("");

  // Analyst Rejection Modal State
  const [rejectingMatch, setRejectingMatch] = useState<Match | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionDetail, setRejectionDetail] = useState("");

  // Analyst workspace dynamic filter & resume states
  const [selectedSportFilter, setSelectedSportFilter] = useState("ALL");
  const [hasStartedTagging, setHasStartedTagging] = useState(false);

  // Team Lead: Analyst sports access management states
  const [managingAccessAnalyst, setManagingAccessAnalyst] = useState<User | null>(null);
  const [managingSportsList, setManagingSportsList] = useState<string[]>([]);

  // Active Tagging Workspace Overlay State
  const [activeTaggingMatch, setActiveTaggingMatch] = useState<Match | null>(null);
  const [selectedPlay, setSelectedPlay] = useState<number>(2);
  const [videoProgress, setVideoProgress] = useState(12);
  const [isPlaying, setIsPlaying] = useState(false);

  interface CompletingTagData {
    actionName: string;
    teamName: string;
    whoServed: string;
    whoReceived: string;
    whoAttacked?: string;
    serveRating: number | null;
    attackStart: { x: number; y: number } | null;
    attackEnd: { x: number; y: number } | null;
    deflected: boolean;
    activeStep: "whoServed" | "whoReceived" | "serveRating" | "whoAttacked" | "attackLocation";
  }

  const [completingTagData, setCompletingTagData] = useState<CompletingTagData | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
    interface TimelineEvent {
    id: string;
    team: "home" | "away";
    title: string;
    startTime: number; // in seconds
    endTime: number;   // in seconds
    lineIndex: number; // 0, 1, 2, 3
  }

  const [currentVideoSeconds, setCurrentVideoSeconds] = useState(75);
  const [activeTimelineTag, setActiveTimelineTag] = useState<{
    id: string;
    team: "home" | "away";
    title: string;
    startTime: number;
    lineIndex: number;
  } | null>(null);

  // Initial demo rally matching photo 1 and photo 2
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([
    { id: "e1", team: "home", title: "Serve Error #22", startTime: 15, endTime: 45, lineIndex: 0 },
    { id: "e2", team: "home", title: "Serve #12", startTime: 75, endTime: 98, lineIndex: 0 },
    { id: "e3", team: "home", title: "Set", startTime: 98, endTime: 125, lineIndex: 0 },
    { id: "e4", team: "away", title: "Serve Receive", startTime: 82, endTime: 102, lineIndex: 1 },
    { id: "e5", team: "away", title: "Dig", startTime: 102, endTime: 120, lineIndex: 1 },
    { id: "e6", team: "away", title: "Set #2", startTime: 90, endTime: 112, lineIndex: 2 },
    { id: "e7", team: "away", title: "Attack Error #15", startTime: 112, endTime: 140, lineIndex: 2 },
    { id: "e8", team: "home", title: "Attack #25", startTime: 96, endTime: 124, lineIndex: 3 },
    { id: "e9", team: "home", title: "Serve Error #20", startTime: 165, endTime: 195, lineIndex: 0 },
    { id: "e10", team: "away", title: "Serve Error #8", startTime: 225, endTime: 255, lineIndex: 0 },
  ]);

  const handleStartTimelineTag = (title: string, team: "home" | "away", lineIndex: number = 0) => {
    const video = document.getElementById("tagger-video-player") as HTMLVideoElement;
    const curTime = video ? video.currentTime : currentVideoSeconds;

    // Stop active tag if any
    if (activeTimelineTag) {
      setTimelineEvents(prev => [
        ...prev,
        {
          id: activeTimelineTag.id,
          team: activeTimelineTag.team,
          title: activeTimelineTag.title,
          startTime: activeTimelineTag.startTime,
          endTime: Math.max(activeTimelineTag.startTime + 2, curTime),
          lineIndex: activeTimelineTag.lineIndex
        }
      ]);
    }

    // Start new active tag at current video time on its corresponding line
    setActiveTimelineTag({
      id: "tag-" + Date.now(),
      team,
      title,
      startTime: curTime,
      lineIndex
    });
  };

  const handleStopTimelineTag = (finalTitle?: string, team?: "home" | "away") => {
    const video = document.getElementById("tagger-video-player") as HTMLVideoElement;
    const curTime = video ? video.currentTime : currentVideoSeconds;

    if (activeTimelineTag) {
      setTimelineEvents(prev => [
        ...prev,
        {
          id: activeTimelineTag.id,
          team: team || activeTimelineTag.team,
          title: finalTitle || activeTimelineTag.title,
          startTime: activeTimelineTag.startTime,
          endTime: Math.max(activeTimelineTag.startTime + 2, curTime),
          lineIndex: activeTimelineTag.lineIndex
        }
      ]);
      setActiveTimelineTag(null);
    } else if (finalTitle) {
      setTimelineEvents(prev => [
        ...prev,
        {
          id: "tag-" + Date.now(),
          team: team || "home",
          title: finalTitle,
          startTime: Math.max(0, curTime - 5),
          endTime: curTime,
          lineIndex: 0
        }
      ]);
    }
  };

  const [taggingState, setTaggingState] = useState<"Initial_Serve" | "G0_Serve" | "Team2_Serve" | "G0_Serve_Receive" | "Team2_Serve_Receive" | "G0_OverPass" | "Team2_OverPass" | "G0_FreeBall" | "Team2_FreeBall" | "G0_Cover" | "Team2_Cover" | "G0_Attack" | "Team2_Attack">("Initial_Serve");
  const [showProblemReportModal, setShowProblemReportModal] = useState(false);
  const [problemReportType, setProblemReportType] = useState("Camera Angle Issue");
  const [problemReportNote, setProblemReportNote] = useState("");

  const [setScoreHome, setSetScoreHome] = useState(14);
  const [setScoreAway, setSetScoreAway] = useState(7);
  const [taggerPhase, setTaggerPhase] = useState<"serve-select" | "served-result" | "in-play">("serve-select");
  const [servingTeam, setServingTeam] = useState<"Home" | "Away" | null>(null);

  // Success / Error alerts
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // QA review approval state inputs
  const [qaApprovingMatch, setQaApprovingMatch] = useState<Match | null>(null);
  const [qaInputQualityScore, setQaInputQualityScore] = useState("95");
  const [qaInputCoachRating, setQaInputCoachRating] = useState("5");
  const [qaInputCoachMessage, setQaInputCoachMessage] = useState("");

  // Coach feedback form states
  const [coachFeedbackMatch, setCoachFeedbackMatch] = useState<Match | null>(null);
  const [coachInputOverall, setCoachInputOverall] = useState(5);
  const [coachInputAccuracy, setCoachInputAccuracy] = useState(5);
  const [coachInputTagging, setCoachInputTagging] = useState(5);
  const [coachInputDelivery, setCoachInputDelivery] = useState(5);
  const [coachInputComment, setCoachInputComment] = useState("");

  // Coach upload form & replace video states
  const [uploadSport, setUploadSport] = useState("Football");
  const [uploadTournament, setUploadTournament] = useState("");
  const [uploadCompetition, setUploadCompetition] = useState("");
  const [uploadHomeTeam, setUploadHomeTeam] = useState("");
  const [uploadAwayTeam, setUploadAwayTeam] = useState("");
  const [uploadHomeTeamColor, setUploadHomeTeamColor] = useState("Blue");
  const [uploadAwayTeamColor, setUploadAwayTeamColor] = useState("Red");
  const [uploadSourceType, setUploadSourceType] = useState<"device" | "google" | "dropbox" | "s3" | null>(null);
  const [uploadCloudUrl, setUploadCloudUrl] = useState("");
  const [showCloudBrowser, setShowCloudBrowser] = useState<"google" | "dropbox" | null>(null);
  const [cloudSearchQuery, setCloudSearchQuery] = useState("");
  const [selectedCloudFile, setSelectedCloudFile] = useState("");
  const [uploadRoster, setUploadRoster] = useState<{ jersey: string; name: string }[]>([{ jersey: "", name: "" }]);
  const [taggedEvents, setTaggedEvents] = useState<{ id: string; timestamp: string; event: string; player?: string; jersey?: string }[]>([]);
  const [selectedTaggerPlayer, setSelectedTaggerPlayer] = useState<string>("");
  const [taggerTab, setTaggerTab] = useState<"coach-notes" | "end-set" | "options">("coach-notes");
  const [uploadMatchDate, setUploadMatchDate] = useState("");
  const [uploadAgeGroup, setUploadAgeGroup] = useState("U-18");
  const [uploadGender, setUploadGender] = useState("Male");
  const [uploadPackage, setUploadPackage] = useState("Standard – 12 Hours");
  const [uploadNotes, setUploadNotes] = useState("");
  const [uploadVideoName, setUploadVideoName] = useState("");
  const [uploadedMatchResult, setUploadedMatchResult] = useState<Match | null>(null);
  const [replaceVideoMatch, setReplaceVideoMatch] = useState<Match | null>(null);
  const [selectedReportMatch, setSelectedReportMatch] = useState<any>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackCommentText, setFeedbackCommentText] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [billingCurrency, setBillingCurrency] = useState<"USD" | "INR">("USD");

  // Coach custom theme settings & wallpapers (Saffron and Gold colors themed from Maharashtra Forts)
  const coachPrimaryColor = (user?.role === "COACH" && user?.primaryColor) || "#e55b0d";
  const coachSecondaryColor = (user?.role === "COACH" && user?.secondaryColor) || "#d4af37";

  const getCoachWallpaper = () => {
    if (user?.role === "COACH" && activeTab !== "Upload Match") {
      return "/maharashtra_fort_bg.jpg";
    }
    const sport = activeTab === "Upload Match" ? uploadSport : "Football";
    switch (sport) {
      case "Soccer": return "/soccer_field.jpg";
      case "Basketball": return "/basketball_court.jpg";
      case "Volleyball": return "/volleyball_court.jpg";
      case "Football":
      default:
        return "/football_field.jpg";
    }
  };
  const coachWallpaperUrl = getCoachWallpaper();

  // SMTP Config states
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("465");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [smtpSecure, setSmtpSecure] = useState(true);
  const [isSendingTest, setIsSendingTest] = useState(false);

  const refreshDbData = () => {
    setUserList(getUsers());
    setAuditLogs(getAuditLogs());
    setSentEmails(getSentEmails());
    setMatchesList(getMatches());
  };

  // 1-second interval timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date());
      // Pull fresh data if matches lists are active
      if (user) {
        setMatchesList(getMatches());
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [user]);

  const calculateVolleyballStats = (tags: any[]) => {
    let totalAttacks = 0;
    let attackKills = 0;
    let totalPasses = 0;
    let passTotalScore = 0;
    let totalServes = 0;
    let serveSuccesses = 0;
    
    const rosterStats: Record<string, { name: string; digs: number; attacks: number; kills: number; aces: number; blocks: number; passes: number }> = {};

    (tags || []).forEach(t => {
      const eventName = (t.event || "").toLowerCase();
      const jersey = t.jersey || "—";
      const playerName = t.player || "Player";

      if (jersey !== "—" && !rosterStats[jersey]) {
        rosterStats[jersey] = { name: playerName, digs: 0, attacks: 0, kills: 0, aces: 0, blocks: 0, passes: 0 };
      }

      if (jersey !== "—") {
        if (eventName.includes("attack") || eventName.includes("hit") || eventName.includes("kill")) {
          totalAttacks++;
          rosterStats[jersey].attacks++;
          if (eventName.includes("kill") || !eventName.includes("error")) {
            attackKills++;
            rosterStats[jersey].kills++;
          }
        }
        
        if (eventName.includes("dig")) {
          rosterStats[jersey].digs++;
        }

        if (eventName.includes("block")) {
          rosterStats[jersey].blocks++;
        }

        if (eventName.includes("pass") || eventName.includes("receive")) {
          totalPasses++;
          rosterStats[jersey].passes++;
          const qualityScore = eventName.includes("perfect") ? 3 : eventName.includes("good") ? 2 : 1;
          passTotalScore += qualityScore;
        }

        if (eventName.includes("serve")) {
          totalServes++;
          if (eventName.includes("ace") || !eventName.includes("error")) {
            serveSuccesses++;
          }
        }

        if (eventName.includes("ace")) {
          rosterStats[jersey].aces++;
        }
      }
    });

    const attackKillPct = totalAttacks > 0 ? Math.round((attackKills / totalAttacks) * 100) : 42;
    const passAverage = totalPasses > 0 ? (passTotalScore / totalPasses).toFixed(1) : "2.2";
    const serveSuccessPct = totalServes > 0 ? Math.round((serveSuccesses / totalServes) * 100) : 86;

    return {
      attackKillPct,
      passAverage,
      serveSuccessPct,
      rosterStats: Object.entries(rosterStats).map(([jersey, stats]) => ({
        jersey,
        ...stats
      }))
    };
  };

  // Video tagging progress animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && activeTaggingMatch) {
      timer = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeTaggingMatch]);

  useEffect(() => {
    const video = document.getElementById("tagger-video-player") as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  }, [isPlaying, activeTaggingMatch]);

  useEffect(() => {
    if (activeTaggingMatch) {
      setTaggedEvents(activeTaggingMatch.tags || []);
      setSelectedTaggerPlayer("");
      setTaggingState("Initial_Serve");
    } else {
      setTaggedEvents([]);
    }
  }, [activeTaggingMatch]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    } else if (user) {
      refreshDbData();
      if (user.role === "ANALYST") {
        setActiveTab("General");
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === "COACH" && user?.tenantName && !uploadHomeTeam) {
      setUploadHomeTeam(user.tenantName);
    }
  }, [user, uploadHomeTeam]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("scoutvision_smtp_config");
      if (stored) {
        try {
          const config = JSON.parse(stored);
          setSmtpHost(config.host || "smtp.gmail.com");
          setSmtpPort(config.port || "465");
          setSmtpUser(config.user || "");
          setSmtpPass(config.pass || "");
          setSmtpSecure(config.secure ?? true);
        } catch (e) {}
      }
    }
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-400 font-mono">
        <img
                  src="/logos/scoutvision_icon.png"
                  alt="ScoutVision Logo"
                  className="w-10 h-10 object-contain transition-transform group-hover:scale-105 drop-shadow-[0_0_12px_rgba(255,99,0,0.6)]"
                />
        <span className="text-[10px] tracking-widest uppercase">Connecting Workspace Access...</span>
      </div>
    );
  }

  // SLA Calculation Helpers
  const getRemainingSeconds = (expirationIso: string) => {
    const exp = new Date(expirationIso).getTime();
    const now = nowTime.getTime();
    return Math.max(0, Math.floor((exp - now) / 1000));
  };

  const formatSlaCountdown = (seconds: number) => {
    if (seconds <= 0) return "00:00:00 (EXPIRED)";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const triggerAlert = (type: "success" | "error", text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const sendRealEmail = async (to: string, subject: string, body: string) => {
    if (typeof window === "undefined") return false;
    const savedConfig = localStorage.getItem("scoutvision_smtp_config");
    if (!savedConfig) {
      return false;
    }
    try {
      const config = JSON.parse(savedConfig);
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body, smtpConfig: config })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Mail relay failed.");
      return true;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const handleSaveSmtpConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      pass: smtpPass,
      secure: smtpSecure
    };
    localStorage.setItem("scoutvision_smtp_config", JSON.stringify(config));
    triggerAlert("success", "SMTP Mail Server credentials saved successfully.");
  };

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    try {
      const success = await sendRealEmail(
        user.email,
        "ScoutVision SMTP Test Email",
        `Hello ${user.firstName},\n\nThis is a test email confirming that your ScoutVision outgoing SMTP server configuration is correct.\n\nTime sent: ${new Date().toLocaleString()}`
      );
      if (success) {
        triggerAlert("success", `Test email sent successfully to ${user.email}!`);
      } else {
        triggerAlert("error", "SMTP not configured. Please save settings first.");
      }
    } catch (err: any) {
      triggerAlert("error", err.message || "Failed to send test email.");
    } finally {
      setIsSendingTest(false);
    }
  };

  // Onboarding Create User submit
  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !firstName || !lastName) {
      triggerAlert("error", "First name, Last name and Email are required.");
      return;
    }
    try {
      const newUser = await createUser({
        firstName,
        lastName,
        email: newEmail,
        phone,
        role: selectedRoleToCreate,
        status,
        department: selectedRoleToCreate === "TEAM_LEAD" ? department : undefined,
        sportsAccess: (selectedRoleToCreate === "ANALYST" || selectedRoleToCreate === "COACH") ? sportsAccess : undefined,
        teamLeadId: selectedRoleToCreate === "ANALYST" ? teamLeadId : undefined,
        tenantName: tenantName || user.tenantName
      });
      setCreatedUser(newUser);
      
      // Trigger background SMTP dispatch
      sendRealEmail(
        newUser.email,
        "Welcome to ScoutVision - Account Registration",
        `Welcome to ScoutVision!\n\nAn account has been created for you by the System Admin.\n\nLogin URL: http://localhost:3000/auth/login\nRegistered Email: ${newUser.email}\nOne-Time Temporary Password: ${newUser.password}\n\nNote: This temporary password is single-use only. You will be prompted to choose a new password upon your first login.`
      ).then((sent) => {
        if (sent) {
          triggerAlert("success", `User created & invitation email sent to ${newUser.email}.`);
        } else {
          triggerAlert("success", `User Account for ${newEmail} created. (Mock outbox registered).`);
        }
      }).catch((err) => {
        triggerAlert("error", `Account created, but SMTP dispatch failed: ${err.message}`);
      });

      setWizardStep(3);
      refreshDbData();
    } catch (err: any) {
      triggerAlert("error", err.message || "Failed to create user account.");
    }
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        phone: editingUser.phone,
        status: editingUser.status,
        department: editingUser.department,
        sportsAccess: editingUser.sportsAccess,
        teamLeadId: editingUser.teamLeadId
      });
      triggerAlert("success", "User profile updated successfully.");
      setEditingUser(null);
      refreshDbData();
    } catch (err: any) {
      triggerAlert("error", "Failed to update user profile.");
    }
  };

  const handleDeactivate = async (userId: string) => {
    if (userId === user.id) {
      triggerAlert("error", "You cannot deactivate your own administrative account.");
      return;
    }
    try {
      await deactivateUser(userId);
      triggerAlert("success", "User account deactivated (Soft Deleted).");
      refreshDbData();
    } catch (err: any) {
      triggerAlert("error", "Failed to deactivate account.");
    }
  };

  const handleReactivate = async (userId: string) => {
    try {
      await reactivateUser(userId);
      triggerAlert("success", "User account reactivated successfully.");
      refreshDbData();
    } catch (err: any) {
      triggerAlert("error", "Failed to reactivate account.");
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      await resetPassword(userId);
      triggerAlert("success", "Password reset. Temporary password sent to Outbox Logs.");
      refreshDbData();
    } catch (err: any) {
      triggerAlert("error", "Failed to reset password.");
    }
  };

  const resetWizardForm = () => {
    setWizardStep(1);
    setFirstName("");
    setLastName("");
    setNewEmail("");
    setPhone("");
    setDepartment("");
    setStatus("Active");
    setSportsAccess([]);
    setTeamLeadId("");
    setTenantName("");
  };

  const handleSportToggle = (sport: string) => {
    setSportsAccess(prev =>
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  const handleOnboardAnalystSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnalystToOnboard || !user) return;

    try {
      const targetAnalyst = userList.find(u => u.id === selectedAnalystToOnboard);
      if (!targetAnalyst) throw new Error("Analyst not found");

      await updateUser(selectedAnalystToOnboard, {
        teamLeadId: user.id
      });
      triggerAlert("success", `${targetAnalyst.name} onboarded to your team roster successfully!`);
      setShowOnboardAnalystModal(false);
      setSelectedAnalystToOnboard("");
      refreshDbData();
    } catch (err: any) {
      triggerAlert("error", err.message || "Failed to onboard analyst.");
    }
  };

  const handleSaveSportsAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingAccessAnalyst) return;

    try {
      await updateUser(managingAccessAnalyst.id, {
        sportsAccess: managingSportsList
      });
      triggerAlert("success", `Updated sports access permissions for ${managingAccessAnalyst.name}.`);
      setManagingAccessAnalyst(null);
      refreshDbData();
    } catch (err: any) {
      triggerAlert("error", err.message || "Failed to update sports access permissions.");
    }
  };

  // ==========================================
  // INGESTION QUEUE WORKFLOW SUBMIT HANDLERS
  // ==========================================
  const handleManualAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningMatch || !selectedAnalystForAssign) return;

    try {
      await assignMatchManually(assigningMatch.id, selectedAnalystForAssign);
      triggerAlert("success", `Match ${assigningMatch.id} manually assigned.`);
      setAssigningMatch(null);
      setSelectedAnalystForAssign("");
      refreshDbData();
    } catch (err: any) {
      triggerAlert("error", "Failed to assign match.");
    }
  };

  const handleUnassign = async (matchId: string) => {
    try {
      await unassignMatch(matchId);
      triggerAlert("success", "Assignment revoked. Match returned to waiting queue.");
      refreshDbData();
    } catch (err: any) {
      triggerAlert("error", "Failed to unassign match.");
    }
  };

  // Analyst Claims
  const handleClaimNextMatch = async () => {
    if (!user.sportsAccess || user.sportsAccess.length === 0) {
      triggerAlert("error", "You have no sport permissions assigned. Contact Admin.");
      return;
    }

    try {
      const sportsToClaim = selectedSportFilter === "ALL" ? user.sportsAccess : [selectedSportFilter];
      const claimed = await claimNextMatch(user.id, sportsToClaim);
      if (claimed) {
        triggerAlert("success", `Highest priority match (${claimed.id}) claimed!`);
        setHasStartedTagging(false); // Reset tagging start tracking for new claim
        refreshDbData();
      } else {
        triggerAlert("error", "No waiting games available matching your sport permissions.");
      }
    } catch (err: any) {
      triggerAlert("error", err.message || "Failed to claim next match.");
    }
  };

  const handleIdleToggle = async (match: Match) => {
    try {
      const isIdle = !match.isIdle;
      await updateMatchStatus(match.id, "Claimed", { isIdle });
      triggerAlert("success", isIdle ? "Tagging paused (Idle mode)" : "Tagging session resumed");
      refreshDbData();
    } catch (err) {
      triggerAlert("error", "Failed to update match tracking.");
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingMatch || !rejectionReason) return;

    try {
      await updateMatchStatus(rejectingMatch.id, "Rejected", {
        rejectionReason,
        rejectionDetail
      });
      triggerAlert("success", `Match ${rejectingMatch.id} rejected. Reason saved.`);
      setRejectingMatch(null);
      setRejectionReason("");
      setRejectionDetail("");
      refreshDbData();
    } catch (err) {
      triggerAlert("error", "Failed to reject match.");
    }
  };

  const handleIngestSubmit = async (matchId: string, tagsToSave?: any[]) => {
    try {
      await updateMatchStatus(matchId, "QA Review", { 
        scoutProgress: 100, 
        isTagging: false,
        tags: tagsToSave
      });
      triggerAlert("success", "Match tagged content submitted to QA Review.");
      refreshDbData();
    } catch (err) {
      triggerAlert("error", "Failed to submit match.");
    }
  };

  // QA Review Approval
  const handleQAReview = async (matchId: string, approve: boolean) => {
    try {
      if (approve) {
        const target = matchesList.find(m => m.id === matchId);
        if (target) {
          setQaInputQualityScore("95");
          setQaInputCoachRating("5");
          setQaInputCoachMessage("");
          setQaApprovingMatch(target);
        }
      } else {
        // Return to analyst: status goes back to 'Claimed', assignedAnalyst remains the same
        await updateMatchStatus(matchId, "Claimed", { scoutProgress: 80, qaNotes: "QA returned match. Please correct plays tags." });
        triggerAlert("success", "Match returned to the analyst for corrections.");
        refreshDbData();
      }
    } catch (err) {
      triggerAlert("error", "Failed to review match.");
    }
  };

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaApprovingMatch) return;

    try {
      const qScore = qaInputQualityScore.trim().endsWith("%") ? qaInputQualityScore.trim() : `${qaInputQualityScore.trim()}%`;
      const duration = qaApprovingMatch.tagTime || "1:54:38";

      await updateMatchStatus(qaApprovingMatch.id, "Completed", {
        qualityScore: qScore,
        coachRating: qaInputCoachRating,
        coachMessage: qaInputCoachMessage,
        tagTime: duration
      });
      triggerAlert("success", "Ingest completed! Match status marked Completed.");
      setQaApprovingMatch(null);
      setQaInputCoachMessage("");
      refreshDbData();
    } catch (err) {
      triggerAlert("error", "Failed to approve match.");
    }
  };

  const handleCoachFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachFeedbackMatch) return;

    try {
      const fb = {
        overallRating: coachInputOverall,
        accuracyRating: coachInputAccuracy,
        taggingRating: coachInputTagging,
        deliveryRating: coachInputDelivery,
        comment: coachInputComment.trim(),
        submittedAt: new Date().toISOString()
      };

      await updateMatchStatus(coachFeedbackMatch.id, "Completed", {
        feedback: fb,
        coachRating: String(coachInputOverall),
        coachMessage: coachInputComment.trim()
      });

      triggerAlert("success", "Thank you! Your feedback has been submitted successfully.");
      setCoachFeedbackMatch(null);
      setCoachInputComment("");
      refreshDbData();
    } catch (err: any) {
      triggerAlert("error", err.message || "Failed to submit feedback.");
    }
  };

  const addTagEvent = (eventType: string) => {
    const video = document.getElementById("tagger-video-player") as HTMLVideoElement;
    const timeSec = video ? video.currentTime : 0;
    const mins = Math.floor(timeSec / 60).toString().padStart(2, "0");
    const secs = Math.floor(timeSec % 60).toString().padStart(2, "0");
    const timestampStr = `${mins}:${secs}`;

    let pName = "Unknown Player";
    let pJersey = "";
    if (selectedTaggerPlayer) {
      const parts = selectedTaggerPlayer.split("|");
      pJersey = parts[0] || "";
      pName = parts[1] || "";
    }

    const newTag = {
      id: `tag_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: timestampStr,
      event: eventType,
      player: pName,
      jersey: pJersey
    };

    setTaggedEvents([...taggedEvents, newTag]);
    triggerAlert("success", `Logged Event: ${eventType} by ${pName}`);
  };



  const handleCourtClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!completingTagData) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    if (!completingTagData.attackStart) {
      setCompletingTagData({
        ...completingTagData,
        attackStart: { x, y },
        activeStep: "attackLocation"
      });
    } else if (!completingTagData.attackEnd) {
      setCompletingTagData({
        ...completingTagData,
        attackEnd: { x, y }
      });
    }
  };

  const handleCourtMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (completingTagData?.attackStart && !completingTagData?.attackEnd) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
      setHoverPos({ x, y });
    }
  };

  const handleCourtMouseLeave = () => {
    setHoverPos(null);
  };

  const handleCompleteTagSave = () => {
    if (!completingTagData) return;

    const updatedTags = [...taggedEvents];

    // 1. Who Served (find last Serve tag)
    for (let i = updatedTags.length - 1; i >= 0; i--) {
      if (updatedTags[i].event.endsWith("Serve")) {
        updatedTags[i].jersey = completingTagData.whoServed;
        let pName = "Opponent Player";
        const servingRoster = activeTaggingMatch?.roster || [];
        const found = servingRoster.find(p => p.jersey === completingTagData.whoServed);
        if (found) pName = found.name;
        updatedTags[i].player = pName;
        break;
      }
    }

    // 2. Who Received / Serve Rating (find last Reception or Receive tag)
    for (let i = updatedTags.length - 1; i >= 0; i--) {
      const ev = updatedTags[i].event;
      if (ev.endsWith("Reception") || ev.endsWith("Receive") || ev.endsWith("Overpass") || ev.endsWith("Over Pass")) {
        updatedTags[i].jersey = completingTagData.whoReceived;
        let pName = "Opponent Player";
        const receivingRoster = activeTaggingMatch?.roster || [];
        const found = receivingRoster.find(p => p.jersey === completingTagData.whoReceived);
        if (found) pName = found.name;
        updatedTags[i].player = pName;
        (updatedTags[i] as any).rating = completingTagData.serveRating;
        break;
      }
    }

    // 3. Attack Details
    if (completingTagData.actionName.includes("Attack")) {
      for (let i = updatedTags.length - 1; i >= 0; i--) {
        const ev = updatedTags[i].event;
        if (ev.endsWith("Attack") || ev.endsWith("Attack Kill") || ev.endsWith("Attack Error")) {
          (updatedTags[i] as any).attackStart = completingTagData.attackStart;
          (updatedTags[i] as any).attackEnd = completingTagData.attackEnd;
          (updatedTags[i] as any).deflected = completingTagData.deflected;
          break;
        }
      }
    }

    setTaggedEvents(updatedTags);
    setCompletingTagData(null);
    
    // Award score
    if (completingTagData.actionName.includes("Kill")) {
      if (completingTagData.teamName === "Home") {
        setSetScoreHome(prev => prev + 1);
      } else {
        setSetScoreAway(prev => prev + 1);
      }
    } else if (completingTagData.actionName.includes("Error")) {
      if (completingTagData.teamName === "Home") {
        setSetScoreAway(prev => prev + 1);
      } else {
        setSetScoreHome(prev => prev + 1);
      }
    }

    setTaggerPhase("serve-select");
    triggerAlert("success", "Rally tagging data finalized successfully!");
  };

  const deleteTagEvent = (tagId: string) => {
    setTaggedEvents(taggedEvents.filter(t => t.id !== tagId));
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadVideoName(e.target.files[0].name);
      triggerAlert("success", `Video file selected: ${e.target.files[0].name}`);
    }
  };

  const addRosterRow = () => {
    setUploadRoster([...uploadRoster, { jersey: "", name: "" }]);
  };

  const removeRosterRow = (index: number) => {
    setUploadRoster(uploadRoster.filter((_, idx) => idx !== index));
  };

  const updateRosterRow = (index: number, key: "jersey" | "name", value: string) => {
    const updated = [...uploadRoster];
    updated[index][key] = value;
    setUploadRoster(updated);
  };

  const handleMatchUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadHomeTeam || !uploadAwayTeam || !uploadVideoName) {
      triggerAlert("error", "Please fill in teams and upload a mock video file.");
      return;
    }

    setIsPending(true);
    // Simulate short network delay for uploading video file
    setTimeout(async () => {
      try {
        let hours = 12;
        let pkgCode: Match["deliveryPackage"] = "Standard";
        if (uploadPackage.startsWith("Express")) { hours = 5; pkgCode = "Express"; }
        else if (uploadPackage.startsWith("Priority")) { hours = 8; pkgCode = "Premium"; }
        else if (uploadPackage.startsWith("Standard")) { hours = 12; pkgCode = "Standard"; }
        else if (uploadPackage.startsWith("Economy")) { hours = 20; pkgCode = "Standard"; }

        const slaExpiration = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

        const newMatch = await createMatch({
          sport: uploadSport as any,
          tournament: "",
          homeTeam: uploadHomeTeam,
          awayTeam: uploadAwayTeam,
          homeTeamColor: uploadHomeTeamColor,
          awayTeamColor: uploadAwayTeamColor,
          deliveryPackage: pkgCode,
          slaExpiration,
          notes: `Notes: ${uploadNotes} | Video: ${uploadVideoName}`,
          roster: uploadRoster.filter(p => p.name.trim() !== "")
        });

        const storedNotes = localStorage.getItem("scoutvision_coach_notifications") || "[]";
        const notifs = JSON.parse(storedNotes);
        notifs.unshift({
          id: `ntf_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          coachEmail: user.email,
          text: `Your match ${newMatch.id} (${newMatch.homeTeam} vs ${newMatch.awayTeam}) has been uploaded successfully.`
        });
        localStorage.setItem("scoutvision_coach_notifications", JSON.stringify(notifs));

        setUploadedMatchResult(newMatch);
        setUploadRoster([{ jersey: "", name: "" }]);
        setUploadTournament("");
        setUploadCompetition("");
        setUploadHomeTeam("");
        setUploadAwayTeam("");
        setUploadMatchDate("");
        setUploadNotes("");
        setUploadVideoName("");
        refreshDbData();
      } catch (err: any) {
        triggerAlert("error", err.message || "Failed to upload match.");
      } finally {
        setIsPending(false);
      }
    }, 1200);
  };

  const handleReplaceVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replaceVideoMatch || !uploadVideoName) {
      triggerAlert("error", "Please choose a video file to replace.");
      return;
    }

    setIsPending(true);
    setTimeout(async () => {
      try {
        await updateMatchStatus(replaceVideoMatch.id, "Waiting", {
          assignedAnalystId: null,
          assignedAnalystName: null,
          scoutProgress: 0,
          notes: `${replaceVideoMatch.notes || ""} | Video Replaced: ${uploadVideoName}`
        });

        const storedNotes = localStorage.getItem("scoutvision_coach_notifications") || "[]";
        const notifs = JSON.parse(storedNotes);
        notifs.unshift({
          id: `ntf_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          coachEmail: user.email,
          text: `A replacement video for match ${replaceVideoMatch.id} has been submitted and is processing.`
        });
        localStorage.setItem("scoutvision_coach_notifications", JSON.stringify(notifs));

        triggerAlert("success", "Replacement video uploaded. Match returned to waiting queue.");
        setReplaceVideoMatch(null);
        setUploadVideoName("");
        refreshDbData();
      } catch (err: any) {
        triggerAlert("error", err.message || "Failed to replace video.");
      } finally {
        setIsPending(false);
      }
    }, 1200);
  };

  // Coach feedback calculations
  const getFeedbackStats = (analystId?: string) => {
    const matchesWithFeedback = matchesList.filter(m => 
      m.feedback && 
      (analystId ? m.assignedAnalystId === analystId : true)
    );

    const totalReviews = matchesWithFeedback.length;
    if (totalReviews === 0) {
      return { avgRating: 0, totalReviews: 0, csat: 0 };
    }

    const sumRating = matchesWithFeedback.reduce((acc, m) => acc + (m.feedback?.overallRating || 0), 0);
    const avgRating = Math.round((sumRating / totalReviews) * 10) / 10;

    const positiveReviews = matchesWithFeedback.filter(m => (m.feedback?.overallRating || 0) >= 4).length;
    const csat = Math.round((positiveReviews / totalReviews) * 100);

    return { avgRating, totalReviews, csat };
  };

  const getTeamFeedbackStats = () => {
    const teamAnalystIds = userList
      .filter(u => u.role === "ANALYST" && u.teamLeadId === user.id)
      .map(u => u.id);

    const matchesWithFeedback = matchesList.filter(m => 
      m.feedback && m.assignedAnalystId && teamAnalystIds.includes(m.assignedAnalystId)
    );

    const totalReviews = matchesWithFeedback.length;
    if (totalReviews === 0) {
      return { avgRating: 0, totalReviews: 0, csat: 0 };
    }

    const sumRating = matchesWithFeedback.reduce((acc, m) => acc + (m.feedback?.overallRating || 0), 0);
    const avgRating = Math.round((sumRating / totalReviews) * 10) / 10;

    const positiveReviews = matchesWithFeedback.filter(m => (m.feedback?.overallRating || 0) >= 4).length;
    const csat = Math.round((positiveReviews / totalReviews) * 100);

    return { avgRating, totalReviews, csat };
  };

  const getLowRatingAlertMatches = () => {
    if (!user) return [];
    if (user.role === "ADMIN") {
      return matchesList.filter(m => m.feedback && m.feedback.overallRating <= 2);
    }
    if (user.role === "TEAM_LEAD") {
      const teamAnalystIds = userList
        .filter(u => u.role === "ANALYST" && u.teamLeadId === user.id)
        .map(u => u.id);
      return matchesList.filter(m => 
        m.feedback && 
        m.feedback.overallRating <= 2 && 
        m.assignedAnalystId && 
        teamAnalystIds.includes(m.assignedAnalystId)
      );
    }
    return [];
  };

  const lowRatingAlertMatches = getLowRatingAlertMatches();

  const getCoachNotifications = () => {
    if (typeof window === "undefined" || !user) return [];
    const stored = localStorage.getItem("scoutvision_coach_notifications");
    if (stored) {
      try {
        const list = JSON.parse(stored);
        return list.filter((n: any) => n.coachEmail === user.email);
      } catch (e) { }
    }
    const initial = [
      { id: "ntf_seed_1", timestamp: new Date(Date.now() - 3600000).toISOString(), coachEmail: user?.email, text: "Welcome to ScoutVision. Get started by uploading your first game recording." }
    ];
    localStorage.setItem("scoutvision_coach_notifications", JSON.stringify(initial));
    return initial;
  };

  // Filtered computed lists
  const filteredUsers = userList.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.tenantName && u.tenantName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch && (filterRole === "ALL" || u.role === filterRole) && (filterStatus === "ALL" || u.status === filterStatus);
  });

  const activeTeamLeads = userList.filter(u => u.role === "TEAM_LEAD" && u.status === "Active");
  const activeAnalysts = userList.filter(u => u.role === "ANALYST" && u.status === "Active");

  // Sorted Queue (Lowest SLA first, waiting/claimed/QA first)
  const getSortedQueue = () => {
    const activeStates = ["Waiting", "Claimed", "In Progress", "QA Review"];
    const activeMatches = matchesList.filter(m => activeStates.includes(m.status));
    
    // Sort active matches by SLA remaining seconds
    activeMatches.sort((a, b) => {
      const remA = getRemainingSeconds(a.slaExpiration);
      const remB = getRemainingSeconds(b.slaExpiration);
      return remA - remB;
    });

    // Append completed/rejected matches at the bottom
    const otherMatches = matchesList.filter(m => !activeStates.includes(m.status));
    return [...activeMatches, ...otherMatches];
  };

  const getFilteredQueue = () => {
    const sorted = getSortedQueue();
    return sorted.filter(m => {
      const matchSearch =
        m.id.toLowerCase().includes(queueSearch.toLowerCase()) ||
        m.coachName.toLowerCase().includes(queueSearch.toLowerCase()) ||
        m.homeTeam.toLowerCase().includes(queueSearch.toLowerCase()) ||
        m.awayTeam.toLowerCase().includes(queueSearch.toLowerCase()) ||
        m.organization.toLowerCase().includes(queueSearch.toLowerCase());

      const matchSport = queueSport === "ALL" || m.sport === queueSport;
      const matchOrg = queueOrg === "ALL" || m.organization === queueOrg;
      const matchPkg = queuePkg === "ALL" || m.deliveryPackage === queuePkg;
      const matchStatusVal = queueStatus === "ALL" || m.status === queueStatus;
      
      let matchAssignVal = true;
      if (queueAssign === "Assigned") matchAssignVal = m.assignedAnalystId !== null;
      if (queueAssign === "Unassigned") matchAssignVal = m.assignedAnalystId === null;

      return matchSearch && matchSport && matchOrg && matchPkg && matchStatusVal && matchAssignVal;
    });
  };

  // SLA Alert notifications count for Admin/TL
  const criticalSlaMatches = matchesList.filter(m => 
    m.status !== "Completed" && 
    m.status !== "Rejected" &&
    getRemainingSeconds(m.slaExpiration) <= 9000
  );

  // Analyst workspace match retrieval
  const currentAnalystMatch = matchesList.find(m => 
    m.assignedAnalystId === user.id && 
    (m.status === "Claimed" || m.status === "In Progress")
  );

  // Available games count matching Analyst Sports Permissions
  const getAvailableMatchesCount = (sport?: string) => {
    return matchesList.filter(m => {
      const isWaiting = m.status === "Waiting";
      const matchesSport = sport ? m.sport === sport : user.sportsAccess?.includes(m.sport);
      return isWaiting && matchesSport;
    }).length;
  };

  return (
    <div className="min-h-screen bg-[#111518] text-white flex flex-col font-sans relative selection:bg-orange-500 selection:text-white">
      
      {/* ⚠️ RED PRIORITY ALERTS BANNER FOR ADMIN & TEAM LEAD */}
      {criticalSlaMatches.length > 0 && (user.role === "ADMIN" || user.role === "TEAM_LEAD") && (
        <div className="w-full bg-red-650 text-white font-mono text-[11px] font-bold py-2.5 px-6 flex items-center justify-center gap-2 animate-pulse border-b border-red-800 z-50">
          <AlertTriangle className="w-4 h-4 text-white" />
          <span>ALERT: {criticalSlaMatches.length} ACTIVE GAME(S) ARE UNDER CRITICAL SLA WARNING (LESS THAN 02h 30m REMAINING)!</span>
        </div>
      )}

      {/* -------------------- MAIN APP HEADER -------------------- */}
      <header className="bg-[#191F24] border-b border-neutral-900 py-3.5 px-6 flex items-center justify-between z-40">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Custom eye shutter target logo */}
            <img
                  src="/logos/scoutvision_icon.png"
                  alt="ScoutVision Logo"
                  className="w-10 h-10 object-contain transition-transform group-hover:scale-105 drop-shadow-[0_0_12px_rgba(255,99,0,0.6)]"
                />
            <span className="text-lg font-bold tracking-tight text-white">
              Scout<span className="text-[#ff6300]">Vision</span>
            </span>
          </Link>
          <div className="h-4 w-px bg-neutral-800 hidden md:block" />
          <span className="text-xs text-slate-400 font-mono hidden md:block">
            {user.role === "ADMIN" ? "System Administration Portal" : `${user.role} workspace`}
          </span>
        </div>

        {/* User context & log out */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-white block uppercase">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-[10px] text-[#ff6300] font-mono block uppercase tracking-widest font-bold">
              {user.role}
            </span>
          </div>
          <button
            onClick={logout}
            className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded border border-neutral-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* -------------------- WORKSPACE BOARD CONTENT -------------------- */}
      <div className="flex-grow flex">
        
        {/* ==================== A. SUPER ADMIN / TEAM LEAD PORTALS (FULL QUEUE ACCESS) ==================== */}
        {(user.role === "ADMIN" || user.role === "TEAM_LEAD") && (
          <div className="flex-grow flex flex-col md:flex-row">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-60 bg-[#191F24] border-r border-neutral-900 p-4 flex flex-col justify-between flex-shrink-0">
              <div className="flex flex-col gap-6">
                
                <div className="p-3.5 rounded bg-neutral-950/40 border border-neutral-850">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider mb-1">Roster Team Group</span>
                  <span className="text-xs text-slate-200 block truncate font-bold">{user.tenantName}</span>
                </div>

                <nav className="flex flex-col gap-1 text-xs font-bold text-slate-400">
                  <button
                    onClick={() => setActiveTab("Dashboard")}
                    className={`flex items-center gap-3 px-3 py-3 rounded transition-colors text-left cursor-pointer ${
                      activeTab === "Dashboard"
                        ? "bg-[#ff6300]/10 text-[#ff6300] border-l-2 border-[#ff6300]"
                        : "hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    Global Ingest Queue
                  </button>

                  {user.role === "ADMIN" && (
                    <>
                      <button
                        onClick={() => setActiveTab("User Management")}
                        className={`flex items-center gap-3 px-3 py-3 rounded transition-colors text-left cursor-pointer ${
                          activeTab === "User Management"
                            ? "bg-[#ff6300]/10 text-[#ff6300] border-l-2 border-[#ff6300]"
                            : "hover:bg-neutral-900 hover:text-white"
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        User Directory
                      </button>

                      <button
                        onClick={() => setActiveTab("Audit Logs")}
                        className={`flex items-center gap-3 px-3 py-3 rounded transition-colors text-left cursor-pointer ${
                          activeTab === "Audit Logs"
                            ? "bg-[#ff6300]/10 text-[#ff6300] border-l-2 border-[#ff6300]"
                            : "hover:bg-neutral-900 hover:text-white"
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        Audit Logs
                      </button>

                      <button
                        onClick={() => setActiveTab("Invitation Logs")}
                        className={`flex items-center gap-3 px-3 py-3 rounded transition-colors text-left cursor-pointer ${
                          activeTab === "Invitation Logs"
                            ? "bg-[#ff6300]/10 text-[#ff6300] border-l-2 border-[#ff6300]"
                            : "hover:bg-neutral-900 hover:text-white"
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        Outbox Invites
                      </button>
                    </>
                  )}

                  {user.role === "TEAM_LEAD" && (
                    <button
                      onClick={() => setActiveTab("My Team Analysts")}
                      className={`flex items-center gap-3 px-3 py-3 rounded transition-colors text-left cursor-pointer ${
                        activeTab === "My Team Analysts"
                          ? "bg-[#ff6300]/10 text-[#ff6300] border-l-2 border-[#ff6300]"
                          : "hover:bg-neutral-900 hover:text-white"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      My Team Analysts
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab("Settings")}
                    className={`flex items-center gap-3 px-3 py-3 rounded transition-colors text-left cursor-pointer ${
                      activeTab === "Settings"
                        ? "bg-[#ff6300]/10 text-[#ff6300] border-l-2 border-[#ff6300]"
                        : "hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </nav>
              </div>
              <div className="text-[10px] text-slate-600 font-mono p-2 border-t border-neutral-900 mt-6">
                ScoutVision Operations v1.1
              </div>
            </aside>

            {/* Main Content Pane */}
            <main className="flex-1 p-6 md:p-8 bg-[#111518] overflow-y-auto relative">
              
              {/* Status Alert Banner */}
              {alertMessage && (
                <div className={`fixed bottom-6 right-6 p-4 rounded shadow-2xl border z-50 flex items-center gap-2.5 animate-fadeIn text-xs font-semibold ${
                  alertMessage.type === "success" 
                    ? "bg-emerald-950/90 text-emerald-400 border-emerald-500/30" 
                    : "bg-red-950/90 text-red-400 border-red-500/30"
                }`}>
                  <Info className="w-4 h-4" />
                  {alertMessage.text}
                </div>
              )}

              {/* 1. VIEW: GLOBAL INGEST QUEUE WORKSPACE */}
              {activeTab === "Dashboard" && (
                <div className="flex flex-col gap-6 text-left">
                  
                  {/* Low Rating Warning Alert Banners */}
                  {lowRatingAlertMatches.length > 0 && (
                    <div className="flex flex-col gap-2.5 p-4 rounded bg-red-950/40 border border-red-500/30 text-xs text-red-400 font-mono animate-fadeIn">
                      <div className="flex items-center gap-2 font-bold text-red-200 uppercase">
                        <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                        <span>Critical Review Required: Low Coach Ratings (1-2 Stars) Detected</span>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-1">
                        {lowRatingAlertMatches.map(m => (
                          <div key={m.id} className="p-2.5 rounded bg-black/30 border border-red-900/30 flex justify-between items-start gap-4">
                            <div>
                              <span className="font-bold text-white uppercase">{m.id}</span> ({m.homeTeam} vs {m.awayTeam} — {m.sport})
                              <div className="text-[10px] text-slate-400 mt-1">Coach: <span className="text-white font-bold">{m.coachName}</span> | Organization: {m.organization}</div>
                              {m.feedback?.comment && (
                                <div className="text-[11px] text-red-200 bg-red-950/20 border-l border-red-500 pl-2 mt-2 py-1">Comment: &ldquo;{m.feedback.comment}&rdquo;</div>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-0.5 rounded bg-red-500 text-white font-bold text-[9px] uppercase tracking-wider">{m.feedback?.overallRating} Stars</span>
                              <div className="text-[9px] text-slate-500 mt-1">{new Date(m.feedback?.submittedAt || "").toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Global Ingestion Queue</h1>
                    <p className="text-slate-400 text-xs mt-1">Review matches uploaded by coaches, monitor SLA countdowns, and assign Analysts.</p>
                  </div>

                  {/* Coach Feedback statistics metrics header grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-5 rounded bg-[#191F24] border border-neutral-850">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Average Coach Rating</span>
                      <span className="text-2xl font-extrabold font-mono mt-1.5 block text-white">
                        {user.role === "ADMIN" 
                          ? (getFeedbackStats().avgRating > 0 ? "⭐️ " + getFeedbackStats().avgRating + " / 5" : "—")
                          : (getTeamFeedbackStats().avgRating > 0 ? "⭐️ " + getTeamFeedbackStats().avgRating + " / 5" : "—")
                        }
                      </span>
                    </div>

                    <div className="p-5 rounded bg-[#191F24] border border-neutral-850">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Total Reviews</span>
                      <span className="text-2xl font-extrabold font-mono mt-1.5 block text-emerald-400 font-bold">
                        {user.role === "ADMIN" 
                          ? getFeedbackStats().totalReviews
                          : getTeamFeedbackStats().totalReviews
                        }
                      </span>
                    </div>

                    <div className="p-5 rounded bg-[#191F24] border border-neutral-850">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">CSAT (Satisfaction)</span>
                      <span className="text-2xl font-extrabold font-mono mt-1.5 block text-[#0070f3] font-bold">
                        {user.role === "ADMIN"
                          ? (getFeedbackStats().totalReviews > 0 ? `${getFeedbackStats().csat}%` : "—")
                          : (getTeamFeedbackStats().totalReviews > 0 ? `${getTeamFeedbackStats().csat}%` : "—")
                        }
                      </span>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="p-4 rounded bg-[#191F24] border border-neutral-850 flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Search */}
                      <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                        <input
                          type="text"
                          value={queueSearch}
                          onChange={(e) => setQueueSearch(e.target.value)}
                          className="w-full bg-[#111518] border border-neutral-850 rounded-sm pl-9 pr-4 py-2 text-xs text-white placeholder-slate-550 focus:border-[#ff6300] focus:outline-none transition-colors"
                          placeholder="Search Match ID, Coach, Team, Organization..."
                        />
                      </div>

                      {/* Filter Row */}
                      <div className="flex flex-wrap items-center gap-3">
                        
                        {/* Sport */}
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-500 text-[10px] uppercase font-mono">Sport:</span>
                          <select
                            value={queueSport}
                            onChange={(e) => setQueueSport(e.target.value)}
                            className="bg-[#111518] border border-neutral-850 rounded p-1 text-[11px] text-slate-300"
                          >
                            <option value="ALL">All Sports</option>
                            <option value="Football">Football</option>
                            <option value="Basketball">Basketball</option>
                            <option value="Volleyball">Volleyball</option>
                            <option value="Soccer">Soccer</option>
                          </select>
                        </div>

                        {/* Package */}
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-500 text-[10px] uppercase font-mono">Package:</span>
                          <select
                            value={queuePkg}
                            onChange={(e) => setQueuePkg(e.target.value)}
                            className="bg-[#111518] border border-neutral-850 rounded p-1 text-[11px] text-slate-300"
                          >
                            <option value="ALL">All Packages</option>
                            <option value="Express">Express</option>
                            <option value="Premium">Premium</option>
                            <option value="Standard">Standard</option>
                          </select>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-500 text-[10px] uppercase font-mono">Status:</span>
                          <select
                            value={queueStatus}
                            onChange={(e) => setQueueStatus(e.target.value)}
                            className="bg-[#111518] border border-neutral-850 rounded p-1 text-[11px] text-slate-300"
                          >
                            <option value="ALL">All Status</option>
                            <option value="Waiting">Waiting</option>
                            <option value="Claimed">Claimed</option>
                            <option value="QA Review">QA Review</option>
                            <option value="Completed">Completed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>

                        {/* Assignment */}
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-500 text-[10px] uppercase font-mono">Assignee:</span>
                          <select
                            value={queueAssign}
                            onChange={(e) => setQueueAssign(e.target.value)}
                            className="bg-[#111518] border border-neutral-850 rounded p-1 text-[11px] text-slate-300"
                          >
                            <option value="ALL">All Assignments</option>
                            <option value="Assigned">Assigned Only</option>
                            <option value="Unassigned">Unassigned Only</option>
                          </select>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Grid Layout: Sorted by remaining SLA countdown (Lowest to Highest) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredQueue().map((m) => {
                      const remSec = getRemainingSeconds(m.slaExpiration);
                      const isCritical = remSec <= 9000 && m.status !== "Completed" && m.status !== "Rejected";
                      
                      return (
                        <div
                          key={m.id}
                          className={`p-5 rounded bg-[#191F24] border relative flex flex-col justify-between min-h-[300px] transition-all ${
                            isCritical 
                              ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse" 
                              : "border-neutral-850"
                          }`}
                        >
                          {/* SLA Critical Warning label */}
                          {isCritical && (
                            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-red-600 text-white font-mono text-[9px] font-bold rounded animate-bounce">
                              CRITICAL SLA
                            </span>
                          )}

                          {/* Card Header */}
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase">
                              <span>{m.id}</span>
                              <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded font-bold text-slate-300">{m.sport}</span>
                            </div>

                            <h3 className="text-sm font-bold text-white mt-3 truncate">{m.homeTeam} vs {m.awayTeam}</h3>
                            <span className="text-[10px] text-slate-400 block font-mono mt-0.5 truncate">{m.tournament}</span>

                            <div className="h-px bg-neutral-850 my-3" />

                            <div className="flex flex-col gap-1.5 text-xs text-slate-300 font-normal">
                              <div>Coach: <strong className="text-white">{m.coachName}</strong></div>
                              <div>Org: <strong className="text-white">{m.organization}</strong></div>
                              <div>Delivery Package: <strong className={`font-mono ${m.deliveryPackage === "Express" ? "text-orange-400" : "text-sky-400"}`}>{m.deliveryPackage}</strong></div>
                              <div className="mt-2 text-[10px] text-slate-500">Uploaded: {new Date(m.uploadDateTime).toLocaleString()}</div>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="mt-6 border-t border-neutral-850/60 pt-3">
                            {/* Live Countdown Clock */}
                            {m.status !== "Completed" && m.status !== "Rejected" ? (
                              <div className="flex flex-col gap-1 mb-3 text-left">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Remaining SLA Countdown</span>
                                <span className={`text-base font-extrabold font-mono ${isCritical ? "text-red-500" : "text-emerald-400"}`}>
                                  {formatSlaCountdown(remSec)}
                                </span>
                              </div>
                            ) : (
                              <div className="mb-3 text-xs font-mono text-slate-500 uppercase">SLA Finalized</div>
                            )}

                            {/* Status and Action Buttons */}
                            <div className="flex items-center justify-between gap-2 mt-2">
                              <div className="flex flex-col gap-1 items-start">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  m.status === "Waiting" ? "bg-slate-800 text-slate-300" :
                                  m.status === "Claimed" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                  m.status === "QA Review" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                                  m.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                  "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}>
                                  {m.status}
                                </span>
                                {(user.role === "TEAM_LEAD" || user.role === "ADMIN") && (
                                  <button
                                    type="button"
                                    onClick={() => setActiveTaggingMatch(m)}
                                    className="px-2 py-0.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[#ff6300] hover:text-white rounded text-[9px] font-bold transition-all cursor-pointer font-mono mt-1"
                                  >
                                    🔍 Inspect
                                  </button>
                                )}
                              </div>

                              {/* Manual assignment control actions for TL / Super Admin */}
                              {m.status === "Waiting" && (
                                <button
                                  onClick={() => setAssigningMatch(m)}
                                  className="px-3 py-1.5 bg-[#ff6300] hover:bg-[#e05700] rounded-sm text-[10px] font-bold transition-all cursor-pointer text-white"
                                >
                                  Assign Analyst
                                </button>
                              )}

                              {m.status === "Claimed" && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-slate-450 truncate max-w-[80px]">{m.assignedAnalystName}</span>
                                  <button
                                    onClick={() => handleUnassign(m.id)}
                                    className="px-2 py-1 bg-red-950/40 text-red-400 border border-red-500/30 rounded hover:bg-red-900/20 text-[9px] font-bold"
                                    title="Unassign Claim"
                                  >
                                    Revoke
                                  </button>
                                </div>
                              )}

                              {m.status === "QA Review" && (
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => handleQAReview(m.id, true)}
                                    className="px-2 py-1 bg-emerald-950/40 text-emerald-450 border border-emerald-500/30 rounded hover:bg-emerald-900/20 text-[9px] font-bold"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleQAReview(m.id, false)}
                                    className="px-2 py-1 bg-rose-950/40 text-rose-400 border border-rose-500/30 rounded hover:bg-rose-900/20 text-[9px] font-bold"
                                  >
                                    Return
                                  </button>
                                </div>
                              )}

                              {m.status === "Rejected" && m.rejectionReason && (
                                <span className="text-[10px] text-rose-400 italic">Reason: {m.rejectionReason}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* 2. VIEW: USER MANAGEMENT (ADMIN ONLY) */}
              {activeTab === "User Management" && user.role === "ADMIN" && (
                <div className="flex flex-col gap-6 text-left">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-850 pb-4">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-white">System User Directory</h1>
                      <p className="text-slate-400 text-xs mt-0.5">Create, edit, reset passwords, and toggle access rights of ScoutVision users.</p>
                    </div>
                    <button
                      onClick={() => { resetWizardForm(); setShowCreateModal(true); }}
                      className="px-4.5 py-2.5 bg-[#ff6300] hover:bg-[#e05700] text-white rounded-sm text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md self-start"
                    >
                      <UserPlus className="w-4 h-4" />
                      Create User Account
                    </button>
                  </div>

                  {/* Filter and Search controls */}
                  <div className="p-4 rounded bg-[#191F24] border border-neutral-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-grow max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111518] border border-neutral-850 rounded-sm pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-550 focus:border-[#ff6300] focus:outline-none transition-colors"
                        placeholder="Search users by name, email, or tenant..."
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Role:</span>
                        <select
                          value={filterRole}
                          onChange={(e) => setFilterRole(e.target.value)}
                          className="bg-[#111518] border border-neutral-850 rounded p-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#ff6300]"
                        >
                          <option value="ALL">All Roles</option>
                          <option value="TEAM_LEAD">Team Lead</option>
                          <option value="ANALYST">Analyst</option>
                          <option value="QA">QA Specialist</option>
                          <option value="COACH">Coach</option>
                          <option value="ADMIN">System Admin</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Status:</span>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="bg-[#111518] border border-neutral-850 rounded p-1.5 text-xs text-slate-300 focus:outline-none focus:border-[#ff6300]"
                        >
                          <option value="ALL">All Status</option>
                          <option value="Active">Active Only</option>
                          <option value="Inactive">Inactive Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="border border-neutral-850 rounded overflow-hidden shadow-xl bg-[#191F24]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-neutral-850 bg-neutral-950 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Organization / Tenant</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Assigned Team Lead</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-slate-500 font-mono uppercase tracking-wider">
                                No registered users found matching the filter options.
                              </td>
                            </tr>
                          ) : (
                            filteredUsers.map((u) => {
                              const leadUser = u.teamLeadId ? userList.find(lead => lead.id === u.teamLeadId) : null;
                              return (
                                <tr key={u.id} className="border-b border-neutral-850 hover:bg-neutral-900 text-slate-300 transition-colors">
                                  <td className="p-4 font-bold text-white uppercase">{u.name}</td>
                                  <td className="p-4 font-mono">{u.email}</td>
                                  <td className="p-4 font-bold">
                                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                                      u.role === "ADMIN" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                      u.role === "TEAM_LEAD" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                                      u.role === "ANALYST" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                                      "bg-slate-800 text-slate-400"
                                    }`}>
                                      {u.role}
                                    </span>
                                  </td>
                                  <td className="p-4 text-slate-400">{u.tenantName || "—"}</td>
                                  <td className="p-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                      u.status === "Active" 
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                                    }`}>
                                      {u.status}
                                    </span>
                                    {u.isTempPassword && (
                                      <span className="ml-1 text-[9px] text-orange-400 font-mono font-bold block mt-1 uppercase">Pending reset</span>
                                    )}
                                  </td>
                                  <td className="p-4 font-mono text-slate-400">
                                    {leadUser ? leadUser.name : "—"}
                                  </td>
                                  <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2.5">
                                      <button
                                        onClick={() => setEditingUser(u)}
                                        className="p-1.5 rounded hover:bg-neutral-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                        title="Edit User Profile"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleResetPassword(u.id)}
                                        className="p-1.5 rounded hover:bg-neutral-800 text-slate-400 hover:text-orange-400 transition-colors cursor-pointer"
                                        title="Reset Password Invitation"
                                      >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                      </button>
                                      {u.status === "Active" ? (
                                        <button
                                          onClick={() => handleDeactivate(u.id)}
                                          className="p-1.5 rounded hover:bg-neutral-800 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                                          title="Deactivate Account (Soft Delete)"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleReactivate(u.id)}
                                          className="p-1.5 rounded hover:bg-neutral-800 text-slate-400 hover:text-emerald-450 transition-colors cursor-pointer"
                                          title="Reactivate Account"
                                        >
                                          <UserCheck className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* 3. VIEW: MY TEAM ANALYSTS (TEAM LEAD ROLE ONLY) */}
              {activeTab === "My Team Analysts" && user.role === "TEAM_LEAD" && (
                <div className="flex flex-col gap-6 text-left max-w-3xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-850 pb-4">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-white">My Team Analysts</h1>
                      <p className="text-slate-400 text-xs mt-0.5">Analysts registered under your supervision group.</p>
                    </div>
                    <button
                      onClick={() => setShowOnboardAnalystModal(true)}
                      className="px-4 py-2 bg-[#ff6300] hover:bg-[#e05700] text-white rounded-sm text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <UserPlus className="w-4 h-4" />
                      Onboard Analyst to Team
                    </button>
                  </div>

                  <div className="border border-neutral-850 rounded overflow-hidden bg-[#191F24]">
                    <div className="p-3 bg-neutral-950 border-b border-neutral-850 text-[10px] text-slate-500 font-mono">
                       Roster analysts list
                    </div>
                    <div className="divide-y divide-neutral-850">
                      {userList.filter(u => u.role === "ANALYST" && u.teamLeadId === user.id).length === 0 ? (
                        <div className="p-6 text-center text-slate-500 text-xs">
                          No Analyst accounts are currently assigned to your team group. Let the Admin assign them to you.
                        </div>
                      ) : (
                        userList.filter(u => u.role === "ANALYST" && u.teamLeadId === user.id).map(analyst => {
                          const activeMatch = matchesList.find(
                            m => m.assignedAnalystId === analyst.id && ["Claimed", "In Progress"].includes(m.status)
                          );
                          const statusText = activeMatch
                            ? activeMatch.isTagging
                              ? `Tagging (${activeMatch.id})`
                              : `Idle (${activeMatch.id})`
                            : "Empty";

                          const statusColor = activeMatch
                            ? activeMatch.isTagging
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-neutral-800 text-slate-400 border border-neutral-700";

                          return (
                            <div key={analyst.id} className="p-4 flex items-center justify-between hover:bg-neutral-900 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold font-mono">
                                  AN
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-white block uppercase">{analyst.name}</span>
                                  <span className="text-[10px] text-slate-500 font-mono">{analyst.email}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 text-xs font-mono">
                                {analyst.sportsAccess && analyst.sportsAccess.length > 0 && (
                                  <span className="text-[10px] text-slate-500">
                                    Sports: {analyst.sportsAccess.join(", ")}
                                  </span>
                                )}
                                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase flex items-center gap-1.5 ${statusColor}`}>
                                  {activeMatch && activeMatch.isTagging && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-ping inline-block" />
                                  )}
                                  {statusText}
                                </span>

                                <button
                                  onClick={() => {
                                    setManagingAccessAnalyst(analyst);
                                    setManagingSportsList(analyst.sportsAccess || []);
                                  }}
                                  className="px-2 py-1 bg-[#0070f3]/10 hover:bg-[#0070f3]/20 text-[#0070f3] border border-[#0070f3]/25 rounded text-[9px] font-bold cursor-pointer transition-colors ml-1"
                                >
                                  Manage Access
                                </button>

                                {activeMatch && (
                                  <button
                                    onClick={() => setActiveTaggingMatch(activeMatch)}
                                    className="px-2 py-1 bg-[#0070f3]/10 hover:bg-[#0070f3]/20 text-[#0070f3] border border-[#0070f3]/25 rounded text-[9px] font-bold cursor-pointer transition-colors"
                                  >
                                    Backdoor Open
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. VIEW: AUDIT LOGS */}
              {activeTab === "Audit Logs" && user.role === "ADMIN" && (
                <div className="flex flex-col gap-6 text-left">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">Live System Audit Logs</h1>
                    <p className="text-slate-400 text-xs mt-0.5">Chronological record of system configuration and database access events.</p>
                  </div>

                  <div className="border border-neutral-850 rounded overflow-hidden shadow-xl bg-[#191F24]">
                    <div className="p-4 bg-neutral-950 font-bold uppercase tracking-wider text-[10px] text-slate-400 border-b border-neutral-850">
                      System Action Registries
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px] font-mono">
                        <thead>
                          <tr className="border-b border-neutral-850 bg-neutral-900 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">Actor</th>
                            <th className="p-4">Action Event</th>
                            <th className="p-4">Log Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {auditLogs.map((log) => (
                            <tr key={log.id} className="border-b border-neutral-850 hover:bg-neutral-900 text-slate-300 transition-colors">
                              <td className="p-4 font-mono text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                              <td className="p-4 font-bold text-white">{log.actor}</td>
                              <td className="p-4 text-[#ff6300] font-bold">{log.event}</td>
                              <td className="p-4 text-slate-400 font-sans italic">{log.details}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. VIEW: INVITATION LOGS */}
              {activeTab === "Invitation Logs" && user.role === "ADMIN" && (
                <div className="flex flex-col gap-6 text-left">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">Outbox Invitation Logs</h1>
                    <p className="text-slate-400 text-xs mt-0.5">Review credentials and temporary passwords dispatched to newly onboarded users.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {sentEmails.map((mail) => (
                      <div key={mail.id} className="p-5 border border-neutral-850 rounded bg-[#191F24] flex flex-col gap-3">
                        <div className="flex justify-between items-center border-b border-neutral-850 pb-2 text-[11px] font-mono text-slate-400">
                          <div>
                            <span>Recipient: </span>
                            <strong className="text-white">{mail.recipient}</strong>
                          </div>
                          <span>Sent: {new Date(mail.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#ff6300] block">{mail.subject}</span>
                          <pre className="mt-3 p-3 bg-neutral-950 rounded text-[10px] text-slate-300 font-mono whitespace-pre-line leading-relaxed text-left">
                            {mail.content}
                          </pre>
                        </div>
                        <div className="flex justify-end mt-3">
                          <a
                            href={`mailto:${encodeURIComponent(mail.recipient)}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.content)}`}
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            Send Invitation via Email Client
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. VIEW: SETTINGS */}
              {activeTab === "Settings" && (
                <div className="flex flex-col gap-6 text-left">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">Global Settings</h1>
                    <p className="text-slate-400 text-xs mt-0.5">Configure authentication profiles and tenant policies.</p>
                  </div>
                  <div className="p-6 rounded border border-neutral-850 bg-[#191F24] flex flex-col gap-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Cluster Metrics */}
                    <div className="p-6 rounded border border-neutral-850 bg-[#191F24] flex flex-col gap-4">
                      <h3 className="text-sm font-bold text-white mb-2">Cluster Metrics</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="p-3.5 bg-neutral-950 border border-neutral-900 rounded">
                          <span className="text-[10px] text-slate-500 block font-bold">LOCAL ENGINE STATUS</span>
                          <span className="text-emerald-400 font-bold block mt-1">● Online & Syncing</span>
                        </div>
                        <div className="p-3.5 bg-neutral-950 border border-neutral-900 rounded">
                          <span className="text-[10px] text-slate-500 block font-bold">JWT DECRYPT VERIFICATION</span>
                          <span className="text-emerald-400 font-bold block mt-1">● Active & Secure</span>
                        </div>
                      </div>
                    </div>

                    {/* SMTP Mailer Server form settings */}
                    <form onSubmit={handleSaveSmtpConfig} className="p-6 rounded border border-neutral-850 bg-[#191F24] flex flex-col gap-4">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-bold text-white">SMTP Outgoing Mail Server</h3>
                        <button
                          type="button"
                          onClick={handleSendTestEmail}
                          disabled={isSendingTest || !smtpUser || !smtpPass}
                          className="px-3 py-1.5 bg-neutral-955 border border-neutral-850 rounded text-[10px] font-bold text-[#ff6300] hover:bg-neutral-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isSendingTest ? "Sending Test..." : "Send Test Email"}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-350">SMTP Host</label>
                          <input
                            type="text"
                            required
                            value={smtpHost}
                            onChange={(e) => setSmtpHost(e.target.value)}
                            className="bg-neutral-955 border border-neutral-850 focus:border-[#ff6300] rounded p-2 text-white focus:outline-none"
                            placeholder="smtp.gmail.com"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-350">SMTP Port</label>
                          <input
                            type="text"
                            required
                            value={smtpPort}
                            onChange={(e) => setSmtpPort(e.target.value)}
                            className="bg-neutral-955 border border-neutral-850 focus:border-[#ff6300] rounded p-2 text-white focus:outline-none"
                            placeholder="465"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-350">Username / Gmail Address</label>
                          <input
                            type="email"
                            required
                            value={smtpUser}
                            onChange={(e) => setSmtpUser(e.target.value)}
                            className="bg-neutral-955 border border-neutral-850 focus:border-[#ff6300] rounded p-2 text-white focus:outline-none"
                            placeholder="e.g. email@gmail.com"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-350">App Password / SMTP Password</label>
                          <input
                            type="password"
                            required
                            value={smtpPass}
                            onChange={(e) => setSmtpPass(e.target.value)}
                            className="bg-neutral-955 border border-neutral-850 focus:border-[#ff6300] rounded p-2 text-white focus:outline-none"
                            placeholder="App Password"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs mt-2 border-t border-neutral-850/65 pt-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={smtpSecure}
                            onChange={(e) => setSmtpSecure(e.target.checked)}
                            className="accent-[#ff6300]"
                          />
                          <span>Use SSL/TLS Connection (port 465)</span>
                        </label>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#ff6300] hover:bg-[#e05700] text-white rounded text-[11px] font-bold cursor-pointer"
                        >
                          Save SMTP Config
                        </button>
                      </div>
                    </form>
                  </div>
                  </div>
                </div>
              )}

            </main>

            {/* Modal: Create User Wizard */}
            {showCreateModal && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-center p-4">
                <div className="w-full max-w-lg bg-[#191F24] border border-neutral-800 rounded-md shadow-2xl overflow-hidden animate-fadeIn text-left">
                  
                  {/* Modal Header */}
                  <div className="px-6 py-4.5 border-b border-neutral-850 bg-neutral-950 flex items-center justify-between text-white">
                    <span className="text-sm font-bold tracking-tight">Onboard New Team Member</span>
                    <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white cursor-pointer text-xs font-bold">✕</button>
                  </div>

                  {/* Wizard Step 1: Select Role */}
                  {wizardStep === 1 && (
                    <div className="p-6 flex flex-col gap-4">
                      <span className="text-xs text-slate-400 block mb-2 font-mono uppercase tracking-wider">Step 1: Choose Account Role Access</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { role: "TEAM_LEAD" as UserRole, name: "Team Lead", desc: "Manages analytical queues and roster operations." },
                          { role: "ANALYST" as UserRole, name: "Analyst", desc: "Handles video tagging, data compilation, and schemas." },
                          { role: "QA" as UserRole, name: "QA Specialist", desc: "Runs assist jobs queue validations." },
                          { role: "COACH" as UserRole, name: "Coach", desc: "Reviews libraries, metrics, and highlight reels." }
                        ].map((c) => (
                          <button
                            key={c.role}
                            onClick={() => { setSelectedRoleToCreate(c.role); setWizardStep(2); }}
                            className={`p-4 rounded border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                              selectedRoleToCreate === c.role 
                                ? "border-[#ff6300] bg-[#ff6300]/5" 
                                : "border-neutral-800 bg-neutral-950/40 hover:border-neutral-700"
                            }`}
                          >
                            <span className="text-xs font-extrabold text-white">{c.name}</span>
                            <span className="text-[10px] text-slate-400 font-light leading-relaxed mt-0.5">{c.desc}</span>
                          </button>
                        ))}
                      </div>

                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() => setWizardStep(2)}
                          className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-sm text-xs font-bold transition-all cursor-pointer border border-neutral-800"
                        >
                          Next Step →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Wizard Step 2: Form Input */}
                  {wizardStep === 2 && (
                    <form onSubmit={handleCreateUserSubmit} className="p-6 flex flex-col gap-4.5 max-h-[80vh] overflow-y-auto">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-neutral-850 pb-2 mb-2">
                        <span>Step 2: Enter Profile Parameters</span>
                        <button type="button" onClick={() => setWizardStep(1)} className="text-[#ff6300] hover:underline">← Change Role ({selectedRoleToCreate})</button>
                      </div>

                      {/* Name fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-350">First Name *</label>
                          <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="bg-neutral-950 border border-neutral-800 focus:border-[#ff6300] rounded p-2.5 text-xs text-white focus:outline-none"
                            placeholder="e.g. John"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-350">Last Name *</label>
                          <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="bg-neutral-950 border border-neutral-800 focus:border-[#ff6300] rounded p-2.5 text-xs text-white focus:outline-none"
                            placeholder="e.g. Doe"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="bg-neutral-950 border border-neutral-800 focus:border-[#ff6300] rounded p-2.5 text-xs text-white focus:outline-none"
                          placeholder="e.g. email@scoutvision.ai"
                        />
                      </div>

                      {/* Phone and Tenant */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-350">Phone Number</label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-neutral-950 border border-neutral-800 focus:border-[#ff6300] rounded p-2.5 text-xs text-white focus:outline-none"
                            placeholder="+15550199"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-350">Organization / Tenant</label>
                          <input
                            type="text"
                            value={tenantName}
                            onChange={(e) => setTenantName(e.target.value)}
                            className="bg-neutral-950 border border-neutral-800 focus:border-[#ff6300] rounded p-2.5 text-xs text-white focus:outline-none"
                            placeholder="e.g. London FC Academy"
                          />
                        </div>
                      </div>

                      {/* If Team Lead: Department */}
                      {selectedRoleToCreate === "TEAM_LEAD" && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] text-slate-350">Department *</label>
                          <input
                            type="text"
                            required
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="bg-neutral-950 border border-neutral-800 focus:border-[#ff6300] rounded p-2.5 text-xs text-white focus:outline-none"
                            placeholder="e.g. Ingestion QA Management"
                          />
                        </div>
                      )}

                      {/* If Analyst: Sports Access & Team Lead Group */}
                      {selectedRoleToCreate === "ANALYST" && (
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] text-slate-350">Assign Team Lead Group *</label>
                            <select
                              value={teamLeadId}
                              onChange={(e) => setTeamLeadId(e.target.value)}
                              required
                              className="bg-neutral-950 border border-neutral-800 focus:border-[#ff6300] rounded p-2.5 text-xs text-white focus:outline-none"
                            >
                              <option value="">-- Choose Active Team Lead --</option>
                              {activeTeamLeads.map(lead => (
                                <option key={lead.id} value={lead.id}>{lead.name} ({lead.email})</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[11px] text-slate-350">Sports Access Options</label>
                            <div className="grid grid-cols-2 gap-2">
                              {["Football", "Basketball", "Volleyball", "Soccer"].map((s) => (
                                <label key={s} className="flex items-center gap-2 px-3 py-2 rounded bg-neutral-950 border border-neutral-850 cursor-pointer text-xs">
                                  <input
                                    type="checkbox"
                                    checked={sportsAccess.includes(s)}
                                    onChange={() => handleSportToggle(s)}
                                    className="accent-[#ff6300]"
                                  />
                                  <span>{s}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* If Coach: Sports Access */}
                      {selectedRoleToCreate === "COACH" && (
                        <div className="flex flex-col gap-2">
                          <label className="text-[11px] text-slate-350">Sports Access</label>
                          <div className="grid grid-cols-2 gap-2">
                            {["Football", "Basketball", "Volleyball", "Soccer"].map((s) => (
                              <label key={s} className="flex items-center gap-2 px-3 py-2 rounded bg-neutral-950 border border-neutral-850 cursor-pointer text-xs">
                                <input
                                  type="checkbox"
                                  checked={sportsAccess.includes(s)}
                                  onChange={() => handleSportToggle(s)}
                                  className="accent-[#ff6300]"
                                />
                                <span>{s}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Status */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350">Account Status</label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                          className="bg-neutral-950 border border-neutral-800 focus:border-[#ff6300] rounded p-2.5 text-xs text-white focus:outline-none"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-850">
                        <button
                          type="button"
                          onClick={() => setWizardStep(1)}
                          className="px-4.5 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-sm text-xs font-bold transition-all cursor-pointer border border-neutral-800"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-[#ff6300] hover:bg-[#e05700] text-white rounded-sm text-xs font-bold transition-all cursor-pointer shadow-md"
                        >
                          Create Account
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Wizard Step 3: Success details */}
                  {wizardStep === 3 && createdUser && (
                    <div className="p-6 flex flex-col gap-4 text-slate-350">
                      <div className="flex flex-col items-center justify-center gap-2 mb-2 text-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Account Created Successfully!</h3>
                        <span className="text-[11px] text-slate-400">Invitation Email Dispatched (Simulated Outbox Log)</span>
                      </div>

                      <div className="p-4 bg-neutral-950 rounded border border-neutral-850 flex flex-col gap-3 font-mono text-xs text-left">
                        <div>
                          <span className="text-slate-500 text-[10px] block uppercase font-mono">Assigned Role</span>
                          <strong className="text-[#ff6300] uppercase font-bold">{createdUser.role}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block uppercase font-mono">Registered Email Address</span>
                          <strong className="text-white font-bold">{createdUser.email}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block uppercase font-mono">One-Time Temporary Password</span>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <code className="bg-neutral-900 border border-neutral-800 text-orange-400 font-extrabold px-2 py-1 rounded text-sm select-all">
                              {createdUser.password}
                            </code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(createdUser.password || "");
                                triggerAlert("success", "Temporary password copied to clipboard.");
                              }}
                              className="px-2 py-1 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-slate-400 hover:text-white rounded text-[10px] cursor-pointer"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block uppercase font-mono">Login URL</span>
                          <span className="text-sky-400 select-all font-semibold">http://localhost:3000/auth/login</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-orange-950/20 border border-orange-500/20 rounded text-[11px] text-orange-300 leading-relaxed text-left flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Security Note:</strong> This temporary credentials password can only be used once. The system will force a password change upon their first login.
                        </span>
                      </div>

                      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-850">
                        {/* Send via SMTP */}
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const success = await sendRealEmail(
                                createdUser.email,
                                "Welcome to ScoutVision - Account Registration",
                                `Welcome to ScoutVision!\n\nAn account has been created for you by the System Admin.\n\nLogin URL: http://localhost:3000/auth/login\nRegistered Email: ${createdUser.email}\nOne-Time Temporary Password: ${createdUser.password}\n\nNote: This temporary password is single-use only. You will be prompted to choose a new password upon your first login.`
                              );
                              if (success) {
                                triggerAlert("success", `Invitation email sent via SMTP successfully to ${createdUser.email}!`);
                              } else {
                                triggerAlert("error", "SMTP is not configured in Settings. Please use Open Mail Client option.");
                              }
                            } catch (e: any) {
                              triggerAlert("error", e.message || "Failed to dispatch email.");
                            }
                          }}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                        >
                          <Mail className="w-4 h-4" />
                          Send via SMTP
                        </button>
                        <a
                          href={`mailto:${encodeURIComponent(createdUser.email)}?subject=${encodeURIComponent("Welcome to ScoutVision - Account Registration")}&body=${encodeURIComponent(
                            `Welcome to ScoutVision!\n\nAn account has been created for you by the System Admin.\n\nLogin URL: http://localhost:3000/auth/login\nRegistered Email: ${createdUser.email}\nOne-Time Temporary Password: ${createdUser.password}\n\nNote: This temporary password is single-use only. You will be prompted to choose a new password upon your first login.`
                          )}`}
                          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-sm text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                        >
                          <Layers className="w-4 h-4" />
                          Open Mail Client
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCreateModal(false);
                            resetWizardForm();
                            setCreatedUser(null);
                          }}
                          className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-sm text-xs font-bold transition-all cursor-pointer border border-neutral-800"
                        >
                          Finish & Close
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Modal: Edit User Form */}
            {editingUser && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-center p-4">
                <form onSubmit={handleEditUserSubmit} className="w-full max-w-md bg-[#191F24] border border-neutral-800 rounded-md shadow-2xl overflow-hidden animate-fadeIn text-left">
                  
                  <div className="px-6 py-4.5 border-b border-neutral-850 bg-neutral-950 flex items-center justify-between text-white">
                    <span className="text-sm font-bold tracking-tight">Edit Profile - {editingUser.email}</span>
                    <button type="button" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white cursor-pointer text-xs font-bold">✕</button>
                  </div>

                  <div className="p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350">First Name</label>
                        <input
                          type="text"
                          required
                          value={editingUser.firstName}
                          onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                          className="bg-neutral-950 border border-neutral-800 focus:border-[#ff6300] rounded p-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350">Last Name</label>
                        <input
                          type="text"
                          required
                          value={editingUser.lastName}
                          onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                          className="bg-neutral-950 border border-neutral-800 focus:border-[#ff6300] rounded p-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-350">Phone Number</label>
                      <input
                        type="text"
                        value={editingUser.phone}
                        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                        className="bg-neutral-950 border border-neutral-800 focus:border-[#ff6300] rounded p-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>

                    {editingUser.role === "TEAM_LEAD" && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350">Department</label>
                        <input
                          type="text"
                          required
                          value={editingUser.department || ""}
                          onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                          className="bg-neutral-950 border border-neutral-800 focus:border-[#ff6300] rounded p-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    )}

                    {editingUser.role === "ANALYST" && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-350">Assign Team Lead Group</label>
                        <select
                          value={editingUser.teamLeadId || ""}
                          onChange={(e) => setEditingUser({ ...editingUser, teamLeadId: e.target.value })}
                          className="bg-neutral-950 border border-neutral-800 focus:border-[#ff6300] rounded p-2.5 text-xs text-white focus:outline-none"
                        >
                          <option value="">-- Choose Team Lead --</option>
                          {activeTeamLeads.map(lead => (
                            <option key={lead.id} value={lead.id}>{lead.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-350">Status</label>
                      <select
                        value={editingUser.status}
                        onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as "Active" | "Inactive" })}
                        className="bg-neutral-950 border border-neutral-800 focus:border-[#ff6300] rounded p-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-850">
                      <button
                        type="button"
                        onClick={() => setEditingUser(null)}
                        className="px-4.5 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white rounded-sm text-xs font-bold transition-all cursor-pointer border border-neutral-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#ff6300] hover:bg-[#e05700] text-white rounded-sm text-xs font-bold transition-all cursor-pointer shadow-md"
                      >
                        Save Changes
                      </button>
                    </div>

                  </div>

                </form>
              </div>
            )}

            {/* Modal: Manual Assignment Modal Selector */}
            {assigningMatch && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-center p-4">
                <form onSubmit={handleManualAssignmentSubmit} className="w-full max-w-sm bg-[#191F24] border border-neutral-800 rounded shadow-2xl overflow-hidden animate-fadeIn text-left">
                  <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-850 text-white flex items-center justify-between">
                    <span className="text-xs font-bold font-mono">Assign Match - {assigningMatch.id}</span>
                    <button type="button" onClick={() => setAssigningMatch(null)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-300">Choose Active Analyst</label>
                      <select
                        value={selectedAnalystForAssign}
                        onChange={(e) => setSelectedAnalystForAssign(e.target.value)}
                        required
                        className="bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#ff6300]"
                      >
                        <option value="">-- Choose Analyst --</option>
                        {activeAnalysts
                          .filter(analyst => {
                            const sportMatch = analyst.sportsAccess?.includes(assigningMatch.sport);
                            if (user.role === "TEAM_LEAD") {
                              return sportMatch && analyst.teamLeadId === user.id;
                            }
                            return sportMatch;
                          })
                          .map(analyst => (
                            <option key={analyst.id} value={analyst.id}>
                              {analyst.name} ({analyst.email})
                            </option>
                          ))
                        }
                      </select>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {user.role === "TEAM_LEAD" 
                          ? `Only analysts inside your team group with ${assigningMatch.sport} permissions are displayed.`
                          : `Only analysts with ${assigningMatch.sport} permissions are displayed.`
                        }
                      </span>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-850">
                      <button
                        type="button"
                        onClick={() => setAssigningMatch(null)}
                        className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#ff6300] hover:bg-[#e05700] rounded-sm text-xs font-bold text-white"
                      >
                        Assign Game
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Modal: Onboard Analyst to Team Lead Group */}
            {showOnboardAnalystModal && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-center p-4">
                <form onSubmit={handleOnboardAnalystSubmit} className="w-full max-w-md bg-[#191F24] border border-neutral-800 rounded shadow-2xl overflow-hidden animate-fadeIn text-left">
                  
                  <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-850 text-white flex items-center justify-between">
                    <span className="text-xs font-bold font-mono">Onboard Analyst to Team</span>
                    <button type="button" onClick={() => setShowOnboardAnalystModal(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-300">Select Analyst Account</label>
                      <select
                        value={selectedAnalystToOnboard}
                        onChange={(e) => setSelectedAnalystToOnboard(e.target.value)}
                        required
                        className="bg-neutral-955 border border-neutral-850 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#ff6300]"
                      >
                        <option value="">-- Choose Analyst to Assign --</option>
                        {userList
                          .filter(u => u.role === "ANALYST")
                          .map(analyst => {
                            const lead = analyst.teamLeadId ? userList.find(l => l.id === analyst.teamLeadId) : null;
                            const leadText = lead ? `Assigned to: ${lead.name}` : "Unassigned";
                            return (
                              <option key={analyst.id} value={analyst.id}>
                                {analyst.name} ({analyst.email}) — [{leadText}]
                              </option>
                            );
                          })
                        }
                      </select>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Selecting an Analyst will claim/transfer them directly under your team lead roster group.
                      </span>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-850">
                      <button
                        type="button"
                        onClick={() => {
                          setShowOnboardAnalystModal(false);
                          setSelectedAnalystToOnboard("");
                        }}
                        className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-xs font-bold text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#ff6300] hover:bg-[#e05700] rounded-sm text-xs font-bold text-white shadow"
                      >
                        Add to my Roster
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Modal: Manage Analyst Sports Access */}
            {managingAccessAnalyst && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-center p-4 text-xs">
                <form onSubmit={handleSaveSportsAccess} className="w-full max-w-sm bg-[#191F24] border border-neutral-800 rounded shadow-2xl overflow-hidden animate-fadeIn text-left">
                  
                  <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-850 text-white flex items-center justify-between">
                    <span className="text-xs font-bold font-mono">Manage Sports Access - {managingAccessAnalyst.name}</span>
                    <button type="button" onClick={() => setManagingAccessAnalyst(null)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-slate-350 font-bold block mb-2 uppercase font-mono">Permitted Sports Checklist</label>
                      <div className="flex flex-col gap-2">
                        {["Football", "Basketball", "Volleyball", "Soccer"].map((sport) => {
                          const isChecked = managingSportsList.includes(sport);
                          return (
                            <label key={sport} className="flex items-center gap-2.5 p-2.5 rounded bg-neutral-950/40 border border-neutral-850 cursor-pointer hover:bg-neutral-950 transition-colors text-xs font-mono text-slate-300">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setManagingSportsList(prev => prev.filter(s => s !== sport));
                                  } else {
                                    setManagingSportsList(prev => [...prev, sport]);
                                  }
                                }}
                                className="accent-[#0070f3] w-4 h-4 cursor-pointer"
                              />
                              <span>{sport}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-850">
                      <button
                        type="button"
                        onClick={() => setManagingAccessAnalyst(null)}
                        className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-xs font-bold text-slate-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#0070f3] hover:bg-[#0051a8] rounded-sm text-xs font-bold text-white shadow cursor-pointer"
                      >
                        Save Permissions
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Modal: QA Approval Metrics Input Dialog */}
            {qaApprovingMatch && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-center p-4 text-xs">
                <form onSubmit={handleApproveSubmit} className="w-full max-w-sm bg-[#191F24] border border-neutral-800 rounded shadow-2xl overflow-hidden animate-fadeIn text-left">
                  
                  <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-850 text-white flex items-center justify-between">
                    <span className="text-xs font-bold font-mono">Approve Game Release - {qaApprovingMatch.id}</span>
                    <button type="button" onClick={() => setQaApprovingMatch(null)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-355 font-bold uppercase font-mono">Quality Score (%)</label>
                      <input
                        type="text"
                        required
                        value={qaInputQualityScore}
                        onChange={(e) => setQaInputQualityScore(e.target.value)}
                        className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none focus:border-[#0070f3]"
                        placeholder="e.g. 98.5%"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-355 font-bold uppercase font-mono">Coach Rating (Stars)</label>
                      <select
                        value={qaInputCoachRating}
                        onChange={(e) => setQaInputCoachRating(e.target.value)}
                        className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none focus:border-[#0070f3]"
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-355 font-bold uppercase font-mono">Coach Message (appears in Errors)</label>
                      <textarea
                        value={qaInputCoachMessage}
                        onChange={(e) => setQaInputCoachMessage(e.target.value)}
                        rows={3}
                        className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none focus:border-[#0070f3]"
                        placeholder="Add review summary, errors details, or comments..."
                      />
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-850">
                      <button
                        type="button"
                        onClick={() => setQaApprovingMatch(null)}
                        className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-xs font-bold text-slate-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#0070f3] hover:bg-[#0051a8] rounded-sm text-xs font-bold text-white shadow cursor-pointer"
                      >
                        Approve & Release
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Modal: Coach Feedback Input Dialog */}
            {coachFeedbackMatch && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-center p-4 text-xs font-sans">
                <form onSubmit={handleCoachFeedbackSubmit} className="w-full max-w-sm bg-[#191F24] border border-neutral-800 rounded shadow-2xl overflow-hidden animate-fadeIn text-left">
                  
                  <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-850 text-white flex items-center justify-between">
                    <span className="text-xs font-bold font-mono">Submit Game Feedback - {coachFeedbackMatch.id}</span>
                    <button type="button" onClick={() => setCoachFeedbackMatch(null)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-3.5">
                    {/* Overall Rating */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-355 font-bold uppercase font-mono">Overall Rating</label>
                      <div className="flex gap-1.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setCoachInputOverall(star)}
                            className="text-lg focus:outline-none transition-transform hover:scale-110"
                          >
                            {star <= coachInputOverall ? "⭐️" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Accuracy Rating */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-355 font-bold uppercase font-mono">Analysis Accuracy Rating</label>
                      <div className="flex gap-1.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setCoachInputAccuracy(star)}
                            className="text-lg focus:outline-none transition-transform hover:scale-110"
                          >
                            {star <= coachInputAccuracy ? "⭐️" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tagging Quality Rating */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-355 font-bold uppercase font-mono">Tagging Quality Rating</label>
                      <div className="flex gap-1.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setCoachInputTagging(star)}
                            className="text-lg focus:outline-none transition-transform hover:scale-110"
                          >
                            {star <= coachInputTagging ? "⭐️" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Time Rating */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-355 font-bold uppercase font-mono">Delivery Time Rating</label>
                      <div className="flex gap-1.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setCoachInputDelivery(star)}
                            className="text-lg focus:outline-none transition-transform hover:scale-110"
                          >
                            {star <= coachInputDelivery ? "⭐️" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="flex flex-col gap-1 mt-1">
                      <label className="text-[10px] text-slate-355 font-bold uppercase font-mono">Optional Comment</label>
                      <textarea
                        value={coachInputComment}
                        onChange={(e) => setCoachInputComment(e.target.value)}
                        rows={2}
                        className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none focus:border-[#0070f3]"
                        placeholder="Add your review details, notes, or suggestions..."
                      />
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-850">
                      <button
                        type="button"
                        onClick={() => setCoachFeedbackMatch(null)}
                        className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-xs font-bold text-slate-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#0070f3] hover:bg-[#0051a8] rounded-sm text-xs font-bold text-white shadow cursor-pointer"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* ==================== B. TEAM LEAD DASHBOARD (TEAM_LEAD ROLE) - DEPRECATED ==================== */}
        {false && null}

        {/* ==================== C. ANALYST PORTAL (ANALYST ROLE - DYNAMIC CLAY WORKFLOW) ==================== */}
        {user.role === "ANALYST" && (
          <div className="flex-grow flex flex-col md:flex-row">
            
            {/* Sidebar */}
            <aside className="w-full md:w-60 bg-[#191F24] border-r border-neutral-900 p-4 flex flex-col justify-between flex-shrink-0">
              <div className="flex flex-col gap-6">
                
                <div className="p-3.5 rounded bg-neutral-950/40 border border-neutral-850">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider mb-1">Roster Workspace</span>
                  <span className="text-xs text-slate-200 block truncate font-bold">{user.tenantName}</span>
                </div>

                <nav className="flex flex-col gap-1 text-xs font-bold text-slate-400">
                  <button
                    onClick={() => setActiveTab("Dashboard")}
                    className={`flex items-center gap-3 px-3 py-3 rounded transition-colors text-left cursor-pointer ${
                      activeTab === "Dashboard"
                        ? "bg-[#ff6300]/10 text-[#ff6300] border-l-2 border-[#ff6300]"
                        : "hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </button>

                  <button
                    onClick={() => setActiveTab("General")}
                    className={`flex items-center gap-3 px-3 py-3 rounded transition-colors text-left cursor-pointer ${
                      activeTab === "General"
                        ? "bg-[#ff6300]/10 text-[#ff6300] border-l-2 border-[#ff6300]"
                        : "hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    General
                  </button>

                  <button
                    onClick={() => setActiveTab("Auto-Submission")}
                    className={`flex items-center gap-3 px-3 py-3 rounded transition-colors text-left cursor-pointer ${
                      activeTab === "Auto-Submission"
                        ? "bg-[#ff6300]/10 text-[#ff6300] border-l-2 border-[#ff6300]"
                        : "hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    Auto-Submission
                  </button>

                  <button
                    onClick={() => setActiveTab("Training")}
                    className={`flex items-center gap-3 px-3 py-3 rounded transition-colors text-left cursor-pointer ${
                      activeTab === "Training"
                        ? "bg-[#ff6300]/10 text-[#ff6300] border-l-2 border-[#ff6300]"
                        : "hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                    Training
                  </button>

                  <button
                    onClick={() => setActiveTab("Advanced Process")}
                    className={`flex items-center gap-3 px-3 py-3 rounded transition-colors text-left cursor-pointer ${
                      activeTab === "Advanced Process"
                        ? "bg-[#ff6300]/10 text-[#ff6300] border-l-2 border-[#ff6300]"
                        : "hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    Advanced Process...
                  </button>

                  <button
                    onClick={() => setActiveTab("Settings")}
                    className={`flex items-center gap-3 px-3 py-3 rounded transition-colors text-left cursor-pointer ${
                      activeTab === "Settings"
                        ? "bg-[#ff6300]/10 text-[#ff6300] border-l-2 border-[#ff6300]"
                        : "hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </nav>
              </div>
              <div className="text-[10px] text-slate-600 font-mono p-2 border-t border-neutral-900 mt-6">
                Analyst Workdesk
              </div>
            </aside>

            {/* Main Content Pane */}
            <main className="flex-1 p-6 md:p-8 bg-[#111518] text-left overflow-y-auto relative">
              
              {alertMessage && (
                <div className={`fixed bottom-6 right-6 p-4 rounded shadow-2xl border z-50 flex items-center gap-2.5 text-xs font-semibold ${
                  alertMessage.type === "success" ? "bg-emerald-950 text-emerald-400 border-emerald-500/30" : "bg-red-950 text-red-400 border-red-500/30"
                }`}>
                  <Info className="w-4 h-4" />
                  {alertMessage.text}
                </div>
              )}

              <div className="flex flex-col gap-6">
                
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white">Analyst Workdesk</h1>
                  <p className="text-slate-400 text-xs mt-1">Claim available games, log tagging event timestamps, and review comments.</p>
                </div>



                {/* 1. VIEW: HOME SUMMARY TAB */}
                {activeTab === "Dashboard" && !currentAnalystMatch && (
                  <div className="min-h-[400px] flex items-center justify-center text-slate-550 font-mono uppercase text-[10px] tracking-wider">
                    {/* Blank page as requested */}
                  </div>
                )}

                {/* 2. VIEW: GENERAL TABS (MATCHING SCREENSHOT) */}
                {activeTab === "General" && !currentAnalystMatch && (
                  <div className="flex flex-col gap-6 text-left animate-fadeIn">
                    
                    {/* Coach Feedback Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="p-4 rounded bg-[#191F24] border border-neutral-850">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Average Coach Rating</span>
                        <span className="text-xl font-extrabold font-mono mt-1.5 block text-white">
                          {getFeedbackStats(user.id).avgRating > 0 ? "⭐️ " + getFeedbackStats(user.id).avgRating + " / 5" : "—"}
                        </span>
                      </div>

                      <div className="p-4 rounded bg-[#191F24] border border-neutral-850">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total Reviews</span>
                        <span className="text-xl font-extrabold font-mono mt-1.5 block text-emerald-400 font-bold">
                          {getFeedbackStats(user.id).totalReviews}
                        </span>
                      </div>

                      <div className="p-4 rounded bg-[#191F24] border border-neutral-850">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">CSAT (Satisfaction)</span>
                        <span className="text-xl font-extrabold font-mono mt-1.5 block text-[#0070f3] font-bold">
                          {getFeedbackStats(user.id).totalReviews > 0 ? `${getFeedbackStats(user.id).csat}%` : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Filters dropdown block */}
                    <div className="p-4 bg-[#191F24] border border-neutral-850 rounded flex items-center justify-between gap-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs font-mono">Filters</span>
                        <select
                          value={selectedSportFilter}
                          onChange={(e) => setSelectedSportFilter(e.target.value)}
                          className="bg-neutral-950 border border-neutral-850 rounded px-3 py-1.5 text-xs text-white focus:outline-none min-w-[220px] font-mono"
                        >
                          <option value="ALL">All Assist Jobs</option>
                          {user.sportsAccess?.map(sport => (
                            <option key={sport} value={sport}>{sport}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Assist Jobs Claim header */}
                    <div className="p-6 bg-[#191F24] border border-neutral-850 rounded flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-md">
                      <div className="text-left">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Assist Jobs</h2>
                        <span className="text-sm font-mono font-bold mt-1.5 block text-slate-350">
                          Available: {getAvailableMatchesCount(selectedSportFilter === "ALL" ? undefined : selectedSportFilter)}
                        </span>
                      </div>
                      <button
                        onClick={handleClaimNextMatch}
                        className="px-6 py-2.5 bg-[#0070f3] hover:bg-[#0051a8] text-white font-bold text-xs rounded transition-colors shadow-lg cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Request Assist Job
                      </button>
                    </div>

                    {/* Available Jobs Queue Table */}
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Available Jobs Queue</h3>
                      <div className="border border-neutral-850 rounded overflow-hidden bg-[#191F24] shadow-xl">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs text-slate-300">
                            <thead>
                              <tr className="border-b border-neutral-850 bg-neutral-950 text-slate-400 font-bold uppercase text-[9px] tracking-wider font-mono">
                                <th className="p-4">Game ID</th>
                                <th className="p-4">Sport</th>
                                <th className="p-4">Game Details</th>
                                <th className="p-4">SLA Countdown</th>
                                <th className="p-4 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {matchesList.filter(m => {
                                const isWaiting = m.status === "Waiting";
                                const matchesSport = selectedSportFilter === "ALL" 
                                  ? user.sportsAccess?.includes(m.sport) 
                                  : m.sport === selectedSportFilter;
                                return isWaiting && matchesSport;
                              }).length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="p-8 text-center text-slate-500 font-mono uppercase tracking-wider">
                                    No waiting jobs in the queue matching your sports access.
                                  </td>
                                </tr>
                              ) : (
                                matchesList
                                  .filter(m => {
                                    const isWaiting = m.status === "Waiting";
                                    const matchesSport = selectedSportFilter === "ALL" 
                                      ? user.sportsAccess?.includes(m.sport) 
                                      : m.sport === selectedSportFilter;
                                    return isWaiting && matchesSport;
                                  })
                                  .map(m => {
                                    const remSec = getRemainingSeconds(m.slaExpiration);
                                    return (
                                      <tr key={m.id} className="border-b border-neutral-850 hover:bg-neutral-900 transition-colors font-sans text-xs">
                                        <td className="p-4 font-mono font-bold text-white uppercase">{m.id}</td>
                                        <td className="p-4">
                                          <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] text-slate-350 font-mono font-bold">
                                            {m.sport}
                                          </span>
                                        </td>
                                        <td className="p-4 font-bold text-slate-200">
                                          {m.homeTeam} vs {m.awayTeam}
                                        </td>
                                        <td className="p-4 font-mono">
                                          <span className={remSec <= 9000 ? "text-red-500 font-bold animate-pulse" : "text-emerald-450 font-bold"}>
                                            {formatSlaCountdown(remSec)}
                                          </span>
                                        </td>
                                        <td className="p-4 text-right">
                                          <button
                                            onClick={async () => {
                                              try {
                                                const alreadyHasClaimed = matchesList.some(activeM =>
                                                  activeM.assignedAnalystId === user.id &&
                                                  (activeM.status === "Claimed" || activeM.status === "In Progress")
                                                );
                                                if (alreadyHasClaimed) {
                                                  triggerAlert("error", "One active match limit reached. Complete your active job first.");
                                                  return;
                                                }
                                                await updateMatchStatus(m.id, "Claimed", {
                                                  assignedAnalystId: user.id,
                                                  assignedAnalystName: user.name,
                                                  scoutProgress: 0
                                                });
                                                triggerAlert("success", `Match ${m.id} claimed successfully!`);
                                                setHasStartedTagging(false);
                                                refreshDbData();
                                              } catch (err: any) {
                                                triggerAlert("error", err.message || "Failed to claim match.");
                                              }
                                            }}
                                            className="px-4 py-1.5 bg-[#ff6300] hover:bg-[#e05700] text-white text-[10px] font-bold rounded-sm cursor-pointer transition-colors"
                                          >
                                            Claim Job
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Previous Jobs Table */}
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Previous Jobs</h3>
                      <div className="border border-neutral-850 rounded overflow-hidden bg-[#191F24] shadow-xl">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs text-slate-300">
                            <thead>
                              <tr className="border-b border-neutral-850 bg-neutral-950 text-slate-400 font-bold uppercase text-[9px] tracking-wider font-mono">
                                <th className="p-4">Date</th>
                                <th className="p-4">Game — Job</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Tag Time</th>
                                <th className="p-4">Coach Rating</th>
                                <th className="p-4">Quality Score</th>
                                <th className="p-4">Errors</th>
                                <th className="p-4 text-center">More</th>
                              </tr>
                            </thead>
                            <tbody>
                                     {matchesList
                                 .filter(m => m.assignedAnalystId === user.id && ["Completed", "QA Review"].includes(m.status))
                                 .length === 0 ? (
                                   <tr>
                                     <td colSpan={8} className="p-8 text-center text-slate-500 font-mono uppercase tracking-wider">
                                       No previous completed or submitted jobs found.
                                     </td>
                                   </tr>
                                 ) : (
                                   matchesList
                                     .filter(m => m.assignedAnalystId === user.id && ["Completed", "QA Review"].includes(m.status))
                                     .map(m => {
                                       const uploadDate = new Date(m.uploadDateTime);
                                       const formattedDate = uploadDate.toLocaleDateString("en-US", { day: 'numeric', month: 'short' });
                                       const formattedTime = uploadDate.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
                                       const isQC = m.status === "QA Review";
                                       return (
                                         <tr key={m.id} className="border-b border-neutral-850 hover:bg-neutral-900 transition-colors font-sans text-xs">
                                           <td className="p-4 text-slate-400 font-mono">{formattedDate}, {formattedTime}</td>
                                           <td className="p-4 font-bold text-white">
                                             {m.homeTeam} vs {m.awayTeam} — {m.sport} ({m.id})
                                           </td>
                                           <td className="p-4">
                                             {isQC ? (
                                               <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-extrabold uppercase">
                                                 Submitted QC Pending
                                               </span>
                                             ) : (
                                               <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold uppercase">
                                                 Completed
                                               </span>
                                             )}
                                           </td>
                                           <td className="p-4 font-mono text-slate-400">{isQC ? "—" : (m.tagTime || "1:54:38")}</td>
                                           <td className="p-4 text-slate-350">{isQC ? "—" : (m.coachRating ? `${m.coachRating} ★` : "—")}</td>
                                           <td className="p-4 font-mono text-slate-350">{isQC ? "—" : (m.qualityScore || "—")}</td>
                                           <td className="p-4 text-slate-300 font-mono truncate max-w-[120px]" title={m.coachMessage || m.errors || ""}>
                                             {m.coachMessage || m.errors || "—"}
                                           </td>
                                           <td className="p-4 text-center text-slate-450 hover:text-white cursor-pointer font-bold">•••</td>
                                         </tr>
                                       );
                                     })
                                )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* 3. OTHER TABS PLACEHOLDERS */}
                {(activeTab === "Auto-Submission" || activeTab === "Training" || activeTab === "Advanced Process" || activeTab === "Settings") && !currentAnalystMatch && (
                  <div className="p-6 bg-[#191F24] border border-neutral-850 rounded text-center text-xs text-slate-400 font-mono uppercase tracking-wider animate-fadeIn">
                    {activeTab} Workshop panel coming soon.
                  </div>
                )}

                {/* 4. ACTIVE CASE: CLAIMED MATCH BOARD VIEW */}
                {currentAnalystMatch && (
                  <div className="flex flex-col gap-6 max-w-3xl animate-fadeIn">
                    
                    <div className="p-6 rounded border border-[#ff6300]/20 bg-[#191F24] flex flex-col gap-4 relative">
                      
                      {/* Idle indicator tag */}
                      {currentAnalystMatch.isIdle && (
                        <span className="absolute top-4 right-4 px-2 py-0.5 bg-neutral-800 border border-neutral-700 text-slate-400 font-mono text-[9px] font-bold rounded">
                          SESSION IDLE (PAUSED)
                        </span>
                      )}

                      <div>
                        <span className="text-[10px] font-mono text-[#ff6300] uppercase tracking-widest block mb-1">Current Claimed Match</span>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 mt-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full border border-neutral-750 inline-block" style={{ backgroundColor: currentAnalystMatch.homeTeamColor || '#0070f3' }} />
                            <span className="text-white font-extrabold text-md uppercase">{currentAnalystMatch.homeTeam}</span>
                          </div>
                          <span className="text-slate-500 font-bold font-mono text-xs">vs</span>
                          <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full border border-neutral-750 inline-block" style={{ backgroundColor: currentAnalystMatch.awayTeamColor || '#e11d48' }} />
                            <span className="text-white font-extrabold text-md uppercase">{currentAnalystMatch.awayTeam}</span>
                          </div>
                          <span className="text-xs font-mono text-slate-550 ml-1">({currentAnalystMatch.id})</span>
                        </div>
                        <span className="text-[10px] text-slate-450 font-mono block mt-1">Sport: {currentAnalystMatch.sport} / Tournament: {currentAnalystMatch.tournament}</span>
                      </div>

                      <div className="h-px bg-neutral-850 my-2" />

                      {/* SLA remaining Countdown */}
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Remaining SLA Countdown (Active ticking)</span>
                        <span className="text-2xl font-extrabold font-mono text-red-500">
                          {formatSlaCountdown(getRemainingSeconds(currentAnalystMatch.slaExpiration))}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans italic">SLA countdown continues even if the session is set to Idle or logged out.</span>
                      </div>

                      {/* QA notes if returned */}
                      {currentAnalystMatch.qaNotes && (
                        <div className="p-3 bg-red-950/20 border border-red-500/20 rounded text-xs text-red-300">
                          <strong>QA Review Notes:</strong> {currentAnalystMatch.qaNotes}
                        </div>
                      )}

                      {/* Progress Percentage bar */}
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                          <span>Tagging Progress</span>
                          <span>{currentAnalystMatch.scoutProgress || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-neutral-950 rounded overflow-hidden">
                          <div style={{ width: `${currentAnalystMatch.scoutProgress || 0}%` }} className="h-full bg-[#ff6300] transition-all" />
                        </div>
                      </div>

                      {/* Action workflow triggers */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        
                        {/* Start / Resume Tagging */}
                        <button
                          onClick={async () => {
                            try {
                              await updateMatchStatus(currentAnalystMatch.id, "Claimed", { isTagging: true });
                              setActiveTaggingMatch(currentAnalystMatch);
                              refreshDbData();
                            } catch (err) {
                              triggerAlert("error", "Failed to update tagging status.");
                            }
                          }}
                          className="px-5 py-2.5 bg-[#0070f3] hover:bg-[#0051a8] text-white rounded-sm text-xs font-bold cursor-pointer"
                        >
                          {hasStartedTagging ? "Resume Tagging" : "Start Tagging"}
                        </button>

                        {/* Reject */}
                        <button
                          onClick={() => setRejectingMatch(currentAnalystMatch)}
                          className="px-4 py-2.5 bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-900/20 rounded-sm text-xs font-bold cursor-pointer ml-auto"
                        >
                          Reject Match
                        </button>

                        {/* Finish Game (Submit to QA review) */}
                        <button
                          onClick={() => handleIngestSubmit(currentAnalystMatch.id)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-bold cursor-pointer"
                        >
                          Finish Game
                        </button>

                      </div>

                    </div>

                  </div>
                )}

              </div>

            </main>

          </div>
        )}

        {/* ==================== D. QA SPECIALIST PORTAL (QA ROLE) ==================== */}
        {user.role === "QA" && (
          <div className="flex-grow flex flex-col md:flex-row">
            
            {/* Sidebar */}
            <aside className="w-full md:w-60 bg-[#191F24] border-r border-neutral-900 p-4 flex flex-col justify-between flex-shrink-0">
              <div className="flex flex-col gap-6">
                
                <div className="p-3.5 rounded bg-neutral-950/40 border border-neutral-850">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider mb-1">Roster Team Group</span>
                  <span className="text-xs text-slate-200 block truncate font-bold">{user.tenantName}</span>
                </div>

                <nav className="flex flex-col gap-1 text-xs font-bold text-slate-400">
                  <button
                    onClick={() => setActiveTab("Dashboard")}
                    className={`flex items-center gap-3 px-3 py-3 rounded transition-colors text-left cursor-pointer ${
                      activeTab === "Dashboard"
                        ? "bg-[#ff6300]/10 text-[#ff6300] border-l-2 border-[#ff6300]"
                        : "hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    QA Validation Queue
                  </button>

                  <button
                    onClick={() => setActiveTab("Settings")}
                    className={`flex items-center gap-3 px-3 py-3 rounded transition-colors text-left cursor-pointer ${
                      activeTab === "Settings"
                        ? "bg-[#ff6300]/10 text-[#ff6300] border-l-2 border-[#ff6300]"
                        : "hover:bg-neutral-900 hover:text-white"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </nav>
              </div>
              <div className="text-[10px] text-slate-650 font-mono p-2 border-t border-neutral-900 mt-6">
                QC Portal
              </div>
            </aside>

            {/* Main Content Pane */}
            <main className="flex-1 p-6 md:p-8 bg-[#111518] text-left overflow-y-auto relative">
              
              {alertMessage && (
                <div className={`fixed bottom-6 right-6 p-4 rounded shadow-2xl border z-50 flex items-center gap-2.5 text-xs font-semibold ${
                  alertMessage.type === "success" ? "bg-emerald-950 text-emerald-400 border-emerald-500/30" : "bg-red-950 text-red-400 border-red-500/30"
                }`}>
                  <Info className="w-4 h-4" />
                  {alertMessage.text}
                </div>
              )}

              {activeTab === "Dashboard" && (
                <div className="flex flex-col gap-6">
                  
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Quality Control (QC) Desk</h1>
                    <p className="text-slate-400 text-xs mt-1">Review game recording metadata clips and verify tagging accuracy before completion release.</p>
                  </div>

                  {/* KPI Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 rounded bg-[#191F24] border border-neutral-850">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Pending QC Review</span>
                      <span className="text-3xl font-extrabold font-mono mt-2 block text-white">
                        {matchesList.filter(m => m.status === "QA Review").length}
                      </span>
                    </div>

                    <div className="p-6 rounded bg-[#191F24] border border-neutral-850">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Completed Games</span>
                      <span className="text-3xl font-extrabold font-mono mt-2 block text-emerald-400">
                        {matchesList.filter(m => m.status === "Completed").length}
                      </span>
                    </div>

                    <div className="p-6 rounded bg-[#191F24] border border-neutral-850">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Rejection Rate</span>
                      <span className="text-3xl font-extrabold font-mono mt-2 block text-red-400">
                        {matchesList.length > 0 
                          ? `${Math.round((matchesList.filter(m => m.status === "Rejected").length / matchesList.length) * 105)}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>

                  {/* QA Review Table */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">QC Review Queue</h3>
                    <div className="border border-neutral-850 rounded overflow-hidden bg-[#191F24] shadow-xl">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs text-slate-300">
                          <thead>
                            <tr className="border-b border-neutral-850 bg-neutral-950 text-slate-400 font-bold uppercase text-[9px] tracking-wider font-mono">
                              <th className="p-4">Game ID</th>
                              <th className="p-4">Sport</th>
                              <th className="p-4">Game Details</th>
                              <th className="p-4">Assigned Analyst</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {matchesList.filter(m => m.status === "QA Review").length === 0 ? (
                              <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500 font-mono uppercase tracking-wider">
                                  No matches pending QC review.
                                </td>
                              </tr>
                            ) : (
                              matchesList
                                .filter(m => m.status === "QA Review")
                                .map(m => (
                                  <tr key={m.id} className="border-b border-neutral-850 hover:bg-neutral-900 transition-colors font-sans text-xs">
                                    <td className="p-4 font-mono font-bold text-white">{m.id}</td>
                                    <td className="p-4">
                                      <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] text-slate-350 font-mono">
                                        {m.sport}
                                      </span>
                                    </td>
                                    <td className="p-4 font-sans">
                                      <div className="font-bold text-white">{m.homeTeam} vs {m.awayTeam}</div>
                                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{m.tournament}</div>
                                    </td>
                                    <td className="p-4 text-slate-450 font-mono">
                                      {m.assignedAnalystName || "—"}
                                    </td>
                                    <td className="p-4 text-right">
                                      <div className="flex justify-end gap-2 font-mono">
                                        <button
                                          onClick={() => handleQAReview(m.id, true)}
                                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-[10px] font-bold cursor-pointer transition-colors"
                                        >
                                          Approve Game
                                        </button>
                                        <button
                                          onClick={() => handleQAReview(m.id, false)}
                                          className="px-3 py-1.5 bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-900/20 rounded-sm text-[10px] font-bold cursor-pointer transition-colors font-sans"
                                        >
                                          Return to Analyst
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {activeTab === "Settings" && (
                <div className="p-6 bg-[#191F24] border border-neutral-850 rounded text-center text-xs text-slate-455 font-mono uppercase tracking-wider animate-fadeIn">
                  Settings configuration panel.
                </div>
              )}

            </main>
          </div>
        )}

        {/* ==================== E. COACH PORTAL (COACH ROLE) ==================== */}
        {user.role === "COACH" && (
          <div className="flex-grow flex flex-col md:flex-row relative">
            
            {/* Live game background wallpaper overlay */}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.14] pointer-events-none transition-all duration-700 ease-in-out"
              style={{ backgroundImage: `url('${coachWallpaperUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#111518]/90 via-[#111518]/60 to-[#111518]/95 z-0 pointer-events-none" />

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-60 bg-[#191F24]/95 border-r border-neutral-900/40 p-4 flex flex-col justify-between flex-shrink-0 z-10 relative backdrop-blur-md">
              <div className="flex flex-col gap-6">
                
                {/* Org Card */}
                <div className="p-3.5 rounded bg-neutral-950/40 border border-neutral-850" style={{ borderLeftColor: coachPrimaryColor, borderLeftWidth: 3 }}>
                  <span className="text-[10px] font-mono block uppercase tracking-widest mb-1 font-bold flex items-center gap-1.5" style={{ color: coachPrimaryColor }}>🚩 Coach Citadel</span>
                  <span className="text-xs text-slate-200 block truncate font-bold uppercase">{user.tenantName || "Elite Sports Club"}</span>
                  <span className="text-[9px] text-slate-500 block font-mono uppercase mt-0.5">{user.firstName} {user.lastName}</span>
                </div>

                <nav className="flex flex-col gap-1 text-xs font-bold text-slate-400">
                  {[
                    { id: "Dashboard", label: "Dashboard", icon: Home },
                    { id: "Upload Match", label: "Upload Match", icon: Plus },
                    { id: "My Matches", label: "My Matches", icon: Layers },
                    { id: "Reports", label: "Reports", icon: FileText },
                    { id: "Membership", label: "Membership", icon: UserCheck },
                    { id: "Billing", label: "Billing", icon: Sliders },
                    { id: "Notifications", label: "Notifications", icon: Mail },
                    { id: "Profile", label: "Profile", icon: Users },
                    { id: "Settings", label: "Settings", icon: Settings },
                  ].map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setUploadedMatchResult(null);
                          setReplaceVideoMatch(null);
                          setActiveTab(tab.id);
                        }}
                        className={`flex items-center gap-3 px-3 py-3 rounded transition-all text-left cursor-pointer ${
                          isActive ? "" : "hover:bg-neutral-900 hover:text-white"
                        }`}
                        style={{
                          backgroundColor: isActive ? `${coachPrimaryColor}15` : undefined,
                          color: isActive ? coachPrimaryColor : undefined,
                          borderLeft: isActive ? `2.5px solid ${coachPrimaryColor}` : undefined
                        }}
                      >
                        <IconComponent className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                  
                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-3 mt-4 rounded text-left hover:bg-red-950/20 hover:text-red-400 transition-colors text-slate-500 font-bold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </nav>
              </div>
              <div className="text-[10px] text-slate-650 font-mono p-2 border-t border-neutral-900 mt-6">
                Client Portal v1.2
              </div>
            </aside>

            {/* Main Content Pane */}
            <main className="flex-1 p-6 md:p-8 bg-[#111518]/90 text-left overflow-y-auto z-10 relative">
              
              {alertMessage && (
                <div className={`fixed bottom-6 right-6 p-4 rounded shadow-2xl border z-50 flex items-center gap-2.5 text-xs font-semibold ${
                  alertMessage.type === "success" ? "bg-emerald-950 text-emerald-400 border-emerald-500/30" : "bg-red-950 text-red-400 border-red-500/30"
                }`}>
                  <Info className="w-4 h-4" />
                  {alertMessage.text}
                </div>
              )}

              {/* A. VIEW: DASHBOARD */}
              {activeTab === "Dashboard" && (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  
                  {/* Live Game Wallpaper Header Card */}
                  <div className="relative w-full h-[180px] rounded-lg overflow-hidden border border-neutral-850 shadow-2xl flex items-center p-8 bg-neutral-950/40">
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none transition-all duration-700 ease-in-out"
                      style={{ backgroundImage: `url('${coachWallpaperUrl}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#111518] via-[#111518]/95 to-transparent pointer-events-none" />
                    <div className="relative z-10 text-left">
                      <span className="text-[10px] font-mono uppercase font-bold tracking-widest" style={{ color: coachPrimaryColor }}>Live Game Analytics</span>
                      <h2 className="text-xl font-bold text-white mt-1.5 uppercase font-sans">ScoutVision Coaching Suite</h2>
                      <p className="text-slate-400 text-xs mt-1.5 max-w-sm font-light leading-relaxed">Submit game recordings to obtain interactive breakdowns, tagged play videos, XML schema sheets, and player rating scorecards.</p>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { 
                        label: "Pending Matches", 
                        value: matchesList.filter(m => m.coachEmail === user.email && ["Waiting", "Claimed"].includes(m.status)).length,
                        color: "text-amber-400"
                      },
                      { 
                        label: "In Progress", 
                        value: matchesList.filter(m => m.coachEmail === user.email && ["In Progress", "QA Review"].includes(m.status)).length,
                        color: "text-sky-400"
                      },
                      { 
                        label: "Completed Reports", 
                        value: matchesList.filter(m => m.coachEmail === user.email && m.status === "Completed").length,
                        color: "text-emerald-400"
                      },
                      { 
                        label: "Rejected Matches", 
                        value: matchesList.filter(m => m.coachEmail === user.email && m.status === "Rejected").length,
                        color: "text-rose-400"
                      }
                    ].map((card, idx) => (
                      <div key={idx} className="p-5 rounded bg-[#191F24]/80 border border-neutral-850 flex flex-col shadow-sm backdrop-blur-sm relative overflow-hidden" style={{ borderTop: `3.5px solid ${coachPrimaryColor}` }}>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{card.label}</span>
                        <span className={`text-2xl font-extrabold font-mono mt-1 ${card.color}`}>{card.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Membership & Credits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded bg-[#191F24]/80 border border-neutral-850 flex flex-col justify-between shadow-md backdrop-blur-sm" style={{ borderTop: `3px solid ${coachPrimaryColor}` }}>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest block font-bold" style={{ color: coachPrimaryColor }}>Current Plan</span>
                        <h3 className="text-lg font-bold text-white mt-1">Pro Analytics Tier Plan</h3>
                        <p className="text-slate-400 text-xs mt-1 max-w-sm">Enjoy 12-hour Standard SLA priority and download access for all tag formats (CSV, XML, MP4).</p>
                      </div>
                      <div className="h-px bg-neutral-850 my-4" />
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-500">Remaining Ingest Credits:</span>
                        <span className="text-white font-bold">15 Matches</span>
                      </div>
                    </div>

                    {/* Recent Notifications */}
                    <div className="p-6 rounded bg-[#191F24]/80 border border-neutral-850 shadow-md backdrop-blur-sm">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-3">Recent Notifications</span>
                      <div className="flex flex-col gap-2.5 max-h-[120px] overflow-y-auto pr-1">
                        {getCoachNotifications().slice(0, 3).map((n: any) => (
                          <div key={n.id} className="text-xs p-2 rounded bg-neutral-950/40 border border-neutral-850 text-slate-300">
                            <span className="text-[9px] text-slate-550 block font-mono">{new Date(n.timestamp).toLocaleDateString()}</span>
                            <span className="font-light">{n.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* B. VIEW: UPLOAD MATCH */}
              {activeTab === "Upload Match" && (
                <div className="flex flex-col gap-6 animate-fadeIn text-left max-w-2xl">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Upload Match Recording</h1>
                    <p className="text-slate-400 text-xs mt-1">Provide match details and video source. Analysis will begin immediately upon submission.</p>
                  </div>

                  {uploadedMatchResult ? (
                    <div className="p-6 rounded border border-emerald-500/20 bg-[#191F24]/80 flex flex-col gap-4 backdrop-blur-sm">
                      <div className="w-12 h-12 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-450">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-md font-bold text-white">Your match has been uploaded successfully!</h3>
                        <p className="text-xs text-slate-450 mt-0.5">The game recording is registered and queued for ingest review.</p>
                      </div>
                      
                      <div className="p-4 rounded bg-neutral-950/60 border border-neutral-850 flex flex-col gap-2.5 text-xs font-mono">
                        <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                          <span className="text-slate-500">Match ID:</span>
                          <strong className="text-white uppercase">{uploadedMatchResult.id}</strong>
                        </div>
                        <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                          <span className="text-slate-500">Selected Package:</span>
                          <strong style={{ color: coachPrimaryColor }}>{uploadedMatchResult.deliveryPackage} Plan</strong>
                        </div>
                        <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                          <span className="text-slate-500">Estimated Delivery:</span>
                          <strong className="text-white">{new Date(uploadedMatchResult.slaExpiration).toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Current Status:</span>
                          <strong className="text-amber-450">Pending Ingest</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => setUploadedMatchResult(null)}
                        className="px-4 py-2 text-white rounded text-xs font-bold font-mono self-start cursor-pointer transition-colors"
                        style={{ backgroundColor: coachPrimaryColor }}
                      >
                        Upload Another Match
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleMatchUploadSubmit} className="p-6 rounded bg-[#191F24]/80 border border-neutral-850 flex flex-col gap-4.5 shadow-xl backdrop-blur-sm">
                      
                      {/* Sport */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Sport *</label>
                        <select
                          value={uploadSport}
                          onChange={(e) => setUploadSport(e.target.value)}
                          className="bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-white focus:outline-none"
                          style={{ borderColor: activeTab === "Upload Match" ? coachPrimaryColor : undefined }}
                        >
                          <option value="Football">Football</option>
                          <option value="Soccer">Soccer</option>
                          <option value="Basketball">Basketball</option>
                          <option value="Volleyball">Volleyball</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Home Team */}
                        <div className="flex flex-col gap-1.5 col-span-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Home Team (Your Club) *</label>
                          <input
                            type="text"
                            required
                            value={uploadHomeTeam}
                            onChange={(e) => setUploadHomeTeam(e.target.value)}
                            className="bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-white focus:outline-none mb-1"
                            placeholder="Home squad"
                            style={{ borderColor: coachPrimaryColor }}
                          />
                          
                          <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Home Jersey Color *</label>
                          <select
                            value={uploadHomeTeamColor}
                            onChange={(e) => setUploadHomeTeamColor(e.target.value)}
                            className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none"
                          >
                            <option value="Blue">🔵 Blue</option>
                            <option value="Red">🔴 Red</option>
                            <option value="Green">🟢 Green</option>
                            <option value="Yellow">🟡 Yellow</option>
                            <option value="White">⚪ White</option>
                            <option value="Black">⚫ Black</option>
                            <option value="Purple">🟣 Purple</option>
                            <option value="Orange">🟠 Orange</option>
                          </select>
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col gap-1.5 col-span-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Away Team *</label>
                          <input
                            type="text"
                            required
                            value={uploadAwayTeam}
                            onChange={(e) => setUploadAwayTeam(e.target.value)}
                            className="bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-white focus:outline-none mb-1"
                            placeholder="Away squad"
                          />

                          <label className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Away Jersey Color *</label>
                          <select
                            value={uploadAwayTeamColor}
                            onChange={(e) => setUploadAwayTeamColor(e.target.value)}
                            className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none"
                          >
                            <option value="Red">🔴 Red</option>
                            <option value="Blue">🔵 Blue</option>
                            <option value="Green">🟢 Green</option>
                            <option value="Yellow">🟡 Yellow</option>
                            <option value="White">⚪ White</option>
                            <option value="Black">⚫ Black</option>
                            <option value="Purple">🟣 Purple</option>
                            <option value="Orange">🟠 Orange</option>
                          </select>
                        </div>

                        {/* Date */}
                        <div className="flex flex-col gap-1.5 col-span-1">
                          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Match Date *</label>
                          <input
                            type="date"
                            required
                            value={uploadMatchDate}
                            onChange={(e) => setUploadMatchDate(e.target.value)}
                            className="bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-white focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* Delivery Package */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Select Delivery Package Tier *</label>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          {[
                            { name: "Express – 5 Hours", label: "Express priority SLA breakdown" },
                            { name: "Priority – 8 Hours", label: "Standard rapid tactical tagging" },
                            { name: "Standard – 12 Hours", label: "Default high precision breakdown" },
                            { name: "Economy – 20 Hours", label: "Discount cost-efficiency SLA tier" },
                          ].map((pkg) => {
                            const isSel = uploadPackage === pkg.name;
                            return (
                              <button
                                key={pkg.name}
                                type="button"
                                onClick={() => setUploadPackage(pkg.name)}
                                className="p-3 rounded border text-left flex flex-col gap-0.5 cursor-pointer transition-all"
                                style={{
                                  backgroundColor: isSel ? `${coachPrimaryColor}15` : "rgba(10, 10, 10, 0.4)",
                                  borderColor: isSel ? coachPrimaryColor : "rgba(255, 255, 255, 0.15)",
                                  color: isSel ? coachPrimaryColor : undefined
                                }}
                              >
                                <span className="text-xs font-bold text-white">{pkg.name}</span>
                                <span className="text-[9px] text-slate-550 leading-relaxed font-light">{pkg.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Additional Notes</label>
                        <textarea
                          value={uploadNotes}
                          onChange={(e) => setUploadNotes(e.target.value)}
                          rows={2.5}
                          className="bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-white focus:outline-none"
                          placeholder="Focus on specific player action tags..."
                        />
                      </div>

                      {/* Team Roster (Optional) */}
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Match Day Roster (Optional)</label>
                          <span className="text-[9px] font-mono text-slate-500">Jersey numbers are not mandatory</span>
                        </div>
                        
                        <div className="flex flex-col gap-2.5 bg-neutral-950/40 p-4 border border-neutral-850 rounded">
                          {uploadRoster.map((player, idx) => (
                            <div key={idx} className="flex gap-3 items-center">
                              <div className="w-20 flex flex-col gap-1">
                                <input
                                  type="text"
                                  value={player.jersey}
                                  onChange={(e) => updateRosterRow(idx, "jersey", e.target.value)}
                                  placeholder="No. (Opt)"
                                  className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white text-center focus:outline-none"
                                />
                              </div>
                              <div className="flex-1 flex flex-col gap-1">
                                <input
                                  type="text"
                                  value={player.name}
                                  onChange={(e) => updateRosterRow(idx, "name", e.target.value)}
                                  placeholder="Player Name"
                                  className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none"
                                />
                              </div>
                              {uploadRoster.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeRosterRow(idx)}
                                  className="text-slate-500 hover:text-white px-2 py-1 cursor-pointer text-xs"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                          
                          <button
                            type="button"
                            onClick={addRosterRow}
                            className="mt-2 py-1.5 px-3 bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-slate-350 hover:text-white rounded text-[10px] font-bold self-start cursor-pointer transition-colors"
                          >
                            + Add Player to Roster
                          </button>
                        </div>
                      </div>

                      {/* Video upload */}
                      <div className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Select Upload Source *</label>
                        <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                          {[
                            { id: "device", label: "Local Device" },
                            { id: "google", label: "Google Drive" },
                            { id: "dropbox", label: "Dropbox" },
                            { id: "s3", label: "AWS S3 URI" }
                          ].map((src) => {
                            const isSel = uploadSourceType === src.id;
                            return (
                              <button
                                key={src.id}
                                type="button"
                                onClick={() => {
                                  setUploadSourceType(src.id as any);
                                  setUploadVideoName("");
                                  setUploadCloudUrl("");
                                }}
                                className="p-2 rounded border text-center font-bold cursor-pointer transition-all"
                                style={{
                                  backgroundColor: isSel ? `${coachPrimaryColor}15` : "rgba(10, 10, 10, 0.4)",
                                  borderColor: isSel ? coachPrimaryColor : "rgba(255, 255, 255, 0.12)",
                                  color: isSel ? coachPrimaryColor : undefined
                                }}
                              >
                                {src.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Uploader Box based on sourceType selection */}
                        {uploadSourceType === null ? (
                          <div className="p-6 rounded border-2 border-dashed border-neutral-800 bg-neutral-950/40 text-center flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-colors">
                            <Play className="w-8 h-8 mb-2 animate-bounce" style={{ color: coachPrimaryColor }} />
                            <span className="text-xs text-slate-300 font-bold block mb-1">Choose a file upload source above</span>
                            <span className="text-[9px] text-slate-550">Select device or cloud storage to select match recording video source.</span>
                          </div>
                        ) : (
                          <div className="p-5 rounded border border-neutral-800 bg-neutral-950/60 flex flex-col gap-3">
                            
                            {uploadSourceType === "device" && (
                              <div className="flex flex-col gap-2.5">
                                <span className="text-[10px] text-slate-450 font-mono uppercase tracking-wider">Local Device Storage</span>
                                <span className="text-[9px] text-slate-500 leading-normal">Select a match recording file directly from your system file explorer.</span>
                                
                                <input 
                                  type="file" 
                                  accept="video/*" 
                                  id="local-device-video-picker" 
                                  onChange={handleLocalFileChange} 
                                  className="hidden" 
                                />
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    const picker = document.getElementById("local-device-video-picker");
                                    if (picker) picker.click();
                                  }}
                                  className="py-3 px-4 bg-neutral-900 hover:bg-neutral-850 border border-neutral-750 text-slate-350 hover:text-white rounded font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-colors"
                                >
                                  <Upload className="w-4 h-4" />
                                  Choose Video from System Explorer
                                </button>
                                
                                {uploadVideoName && (
                                  <div className="p-3.5 rounded bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-xs font-mono text-emerald-450 mt-1">
                                    <span>✔ Selected Local File: <strong>{uploadVideoName}</strong></span>
                                    <button type="button" onClick={() => setUploadVideoName("")} className="text-slate-500 hover:text-white">✕</button>
                                  </div>
                                )}
                              </div>
                            )}

                            {uploadSourceType === "google" && (
                              <div className="flex flex-col gap-2.5">
                                <span className="text-[10px] text-[#34A853] font-mono uppercase tracking-wider flex items-center gap-1.5 font-bold">Google Drive Storage Connection</span>
                                <span className="text-[9px] text-slate-550 leading-normal">Access your Google Drive storage to search and select your match recordings.</span>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCloudSearchQuery("");
                                    setSelectedCloudFile("");
                                    setShowCloudBrowser("google");
                                  }}
                                  className="py-3 px-4 bg-[#34A853]/10 hover:bg-[#34A853]/20 border border-[#34A853]/30 text-[#34A853] rounded font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-colors"
                                >
                                  <FolderOpen className="w-4 h-4" />
                                  Open Google Drive Selector
                                </button>

                                {uploadVideoName && (
                                  <div className="p-3.5 rounded bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-xs font-mono text-emerald-450 mt-1">
                                    <span>✔ Selected Google Drive File: <strong>{uploadVideoName}</strong></span>
                                    <button type="button" onClick={() => setUploadVideoName("")} className="text-slate-500 hover:text-white">✕</button>
                                  </div>
                                )}
                              </div>
                            )}

                            {uploadSourceType === "dropbox" && (
                              <div className="flex flex-col gap-2.5">
                                <span className="text-[10px] text-[#0061FE] font-mono uppercase tracking-wider flex items-center gap-1.5 font-bold">Dropbox Storage Connection</span>
                                <span className="text-[9px] text-slate-550 leading-normal">Access your Dropbox account files to browse and select match video streams.</span>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCloudSearchQuery("");
                                    setSelectedCloudFile("");
                                    setShowCloudBrowser("dropbox");
                                  }}
                                  className="py-3 px-4 bg-[#0061FE]/10 hover:bg-[#0061FE]/20 border border-[#0061FE]/30 text-[#0061FE] rounded font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-colors"
                                >
                                  <FolderOpen className="w-4 h-4" />
                                  Open Dropbox File Selector
                                </button>

                                {uploadVideoName && (
                                  <div className="p-3.5 rounded bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-xs font-mono text-emerald-450 mt-1">
                                    <span>✔ Selected Dropbox File: <strong>{uploadVideoName}</strong></span>
                                    <button type="button" onClick={() => setUploadVideoName("")} className="text-slate-500 hover:text-white">✕</button>
                                  </div>
                                )}
                              </div>
                            )}

                            {uploadSourceType === "s3" && (
                              <div className="flex flex-col gap-2 font-mono text-[10px]">
                                <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider block">AWS S3 Bucket URI link</span>
                                <span className="text-[9px] text-slate-500 leading-normal">Provide raw S3 path link e.g. s3://scoutvision-ingest/raw_video/game_401.mp4</span>
                                <div className="flex gap-2.5">
                                  <input
                                    type="text"
                                    value={uploadCloudUrl}
                                    onChange={(e) => setUploadCloudUrl(e.target.value)}
                                    placeholder="s3://my-bucket/video.mp4"
                                    className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white flex-1 focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (uploadCloudUrl.trim().startsWith("s3://")) {
                                        const parts = uploadCloudUrl.split("/");
                                        const fileName = parts[parts.length - 1] || "s3_cloud_feed.mp4";
                                        setUploadVideoName(fileName);
                                        triggerAlert("success", `Resolved S3 URL to source filename: ${fileName}`);
                                      } else {
                                        triggerAlert("error", "S3 Path must start with s3:// protocol.");
                                      }
                                    }}
                                    className="px-3.5 bg-neutral-900 border border-neutral-750 text-slate-300 hover:text-white rounded font-bold cursor-pointer font-sans"
                                  >
                                    Connect
                                  </button>
                                </div>
                                {uploadVideoName && (
                                  <div className="text-emerald-450 font-bold mt-1 text-[9px]">
                                    ✔ Resolved Connected Source: {uploadVideoName}
                                  </div>
                                )}
                              </div>
                            )}

                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isPending}
                        className="w-full mt-2 py-3 rounded text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        style={{ backgroundColor: coachPrimaryColor }}
                      >
                        {isPending ? "Ingesting Match Data..." : "Submit"}
                      </button>
                    </form>
                  )}

                </div>
              )}

              {/* C. VIEW: MY MATCHES */}
              {activeTab === "My Matches" && (
                <div className="flex flex-col gap-6 animate-fadeIn text-left">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white font-sans font-bold">My Matches</h1>
                    <p className="text-slate-400 text-xs mt-1">Review active delivery schedules, track processing progress, and access tactical reports.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matchesList.filter(m => m.coachEmail === user.email).length === 0 ? (
                      <div className="p-8 rounded bg-[#191F24]/80 border border-neutral-850 text-center text-slate-500 font-mono uppercase tracking-wider col-span-2 backdrop-blur-sm">
                        No matches uploaded yet.
                      </div>
                    ) : (
                      matchesList
                        .filter(m => m.coachEmail === user.email)
                        .map(m => {
                          const uploadDate = new Date(m.uploadDateTime);
                          const formattedDate = uploadDate.toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' });
                          
                          let friendlyStatus = "Pending";
                          let statusColor = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                          
                          if (m.status === "Waiting" || m.status === "Claimed") {
                            friendlyStatus = "Pending";
                            statusColor = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                          } else if (m.status === "In Progress") {
                            friendlyStatus = "In Progress";
                            statusColor = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
                          } else if (m.status === "QA Review") {
                            friendlyStatus = "Under Review";
                            statusColor = "bg-purple-500/10 text-purple-400 border border-purple-500/20";
                          } else if (m.status === "Completed") {
                            friendlyStatus = "Completed";
                            statusColor = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                          } else if (m.status === "Rejected") {
                            friendlyStatus = "Rejected";
                            statusColor = "bg-red-500/10 text-red-450 border border-red-500/20";
                          }

                          return (
                            <div key={m.id} className="p-5 rounded bg-[#191F24]/80 border border-neutral-850 shadow flex flex-col justify-between min-h-[240px] backdrop-blur-sm">
                              <div>
                                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                                  <span>{m.id}</span>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${statusColor}`}>{friendlyStatus}</span>
                                </div>

                                <div className="h-px bg-neutral-850 my-3" />
                                
                                {/* Home Team Always Displayed on the Left Side */}
                                <div className="flex justify-between items-center text-xs font-mono mb-2">
                                  <div className="text-left">
                                    <span className="text-[10px] text-slate-550 uppercase block font-bold">Home (Your Club)</span>
                                    <span className="text-white font-bold">{m.homeTeam}</span>
                                    {m.homeTeam === user.tenantName && (
                                      <span className="ml-1.5 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold inline-block"
                                        style={{ backgroundColor: `${coachPrimaryColor}10`, color: coachPrimaryColor, border: `1px solid ${coachPrimaryColor}20` }}
                                      >
                                        Club
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] text-slate-550 uppercase block">Away Team</span>
                                    <span className="text-white font-bold">{m.awayTeam}</span>
                                  </div>
                                </div>

                                <div className="text-[10px] text-slate-455 mt-1 font-mono">{m.sport} | Tournament: {m.tournament}</div>
                                
                                <div className="h-px bg-neutral-850 my-3.5" />

                                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                                  <div>
                                    <span className="text-[9px] text-slate-500 uppercase block">Upload Date:</span>
                                    <span className="text-slate-300 font-bold">{formattedDate}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-slate-500 uppercase block">Estimated Delivery:</span>
                                    <span className="font-bold" style={{ color: coachPrimaryColor }}>{m.deliveryPackage} ({new Date(m.slaExpiration).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })})</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end gap-2 mt-4 pt-3.5 border-t border-neutral-900 font-mono text-[10px]">
                                {m.status === "Completed" && (
                                  <>
                                    {!m.feedback && (
                                      <button
                                        onClick={() => {
                                          setCoachInputOverall(5);
                                          setCoachInputAccuracy(5);
                                          setCoachInputTagging(5);
                                          setCoachInputDelivery(5);
                                          setCoachInputComment("");
                                          setCoachFeedbackMatch(m);
                                        }}
                                        className="px-3 py-1.5 text-white rounded font-bold cursor-pointer transition-colors"
                                        style={{ backgroundColor: coachPrimaryColor }}
                                      >
                                        Submit Feedback
                                      </button>
                                    )}
                                    <button
                                      onClick={() => setActiveTab("Reports")}
                                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-slate-300 hover:text-white rounded font-bold cursor-pointer transition-colors font-sans"
                                    >
                                      View Downloads
                                    </button>
                                  </>
                                )}

                                {m.status === "Rejected" && (
                                  <button
                                    onClick={() => {
                                      setUploadVideoName("");
                                      setReplaceVideoMatch(m);
                                    }}
                                    className="px-3 py-1.5 bg-red-650 hover:bg-red-750 text-white rounded font-bold cursor-pointer transition-all"
                                  >
                                    Replace Video
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>

                </div>
              )}

              {/* D. VIEW: REPORTS */}
              {activeTab === "Reports" && (
                <div className="flex flex-col gap-6 animate-fadeIn text-left">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white font-sans font-bold">Reports</h1>
                    <p className="text-slate-400 text-xs mt-1">Download analysis reports, play timeline CSV logs, XML schema sheets, and tagged videos.</p>
                  </div>

                  <div className="border border-neutral-850 rounded overflow-hidden bg-[#191F24]/80 shadow-xl backdrop-blur-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs text-slate-300">
                        <thead>
                          <tr className="border-b border-neutral-850 bg-neutral-950 text-slate-400 font-bold uppercase text-[9px] tracking-wider font-mono">
                            <th className="p-4">Match ID</th>
                            <th className="p-4">Teams (Your Club on Left)</th>
                            <th className="p-4 font-mono text-center">Quality score</th>
                            <th className="p-4 text-right">Downloads</th>
                          </tr>
                        </thead>
                        <tbody>
                          {matchesList.filter(m => m.coachEmail === user.email && m.status === "Completed").length === 0 ? (
                            <tr>
                              <td colSpan={4} className="p-8 text-center text-slate-500 font-mono uppercase tracking-wider">
                                No completed analysis reports available yet.
                              </td>
                            </tr>
                          ) : (
                            matchesList
                              .filter(m => m.coachEmail === user.email && m.status === "Completed")
                              .map(m => (
                                <tr key={m.id} className="border-b border-neutral-850 hover:bg-neutral-900 transition-colors">
                                  <td className="p-4 font-mono font-bold text-white uppercase">{m.id}</td>
                                  <td className="p-4 font-bold text-slate-200">
                                    <span style={{ color: coachPrimaryColor }}>{m.homeTeam}</span> vs {m.awayTeam} — {m.sport}
                                  </td>
                                  <td className="p-4 font-mono text-slate-350 text-center">{m.qualityScore || "—"}</td>
                                  <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 text-[10px] font-mono">
                                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold uppercase mr-2">Completed</span>
                                      <a
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); triggerAlert("success", `Downloading PDF Report for match ${m.id}`); }}
                                        className="px-2 py-1.5 rounded font-bold transition-all"
                                        style={{ backgroundColor: `${coachPrimaryColor}15`, border: `1px solid ${coachPrimaryColor}25`, color: coachPrimaryColor }}
                                      >
                                        Download Report
                                      </a>
                                      <a
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); triggerAlert("success", `Downloading Tagged Video for match ${m.id}`); }}
                                        className="px-2 py-1.5 rounded font-bold transition-all"
                                        style={{ backgroundColor: `${coachPrimaryColor}15`, border: `1px solid ${coachPrimaryColor}25`, color: coachPrimaryColor }}
                                      >
                                        Download Tagged Video
                                      </a>
                                      <a
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); triggerAlert("success", `Downloading CSV play logs for match ${m.id}`); }}
                                        className="px-2 py-1.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 text-slate-350 hover:text-white rounded font-bold transition-all"
                                      >
                                        Download CSV
                                      </a>
                                      <a
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); triggerAlert("success", `Downloading XML schema sheet for match ${m.id}`); }}
                                        className="px-2 py-1.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 text-slate-355 hover:text-white rounded font-bold transition-all"
                                      >
                                        Download XML
                                      </a>
                                      <a
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setSelectedReportMatch(m);
                                          setFeedbackRating(m.rating || 0);
                                          setFeedbackCommentText(m.feedbackComment || "");
                                        }}
                                        className="px-2 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold transition-all"
                                      >
                                        View Match Analysis
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {selectedReportMatch && (() => {
                    const stats = calculateVolleyballStats(selectedReportMatch.tags || []);
                    return (
                      <div className="border border-neutral-850 rounded bg-[#191F24]/90 shadow-2xl p-6 flex flex-col gap-6 animate-fadeIn mt-2 text-left">
                        {/* Title Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-850 pb-4 gap-4">
                          <div>
                            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Completed Match Details</span>
                            <h2 className="text-lg font-bold text-white font-sans mt-0.5 uppercase">
                              <span style={{ color: coachPrimaryColor }}>{selectedReportMatch.homeTeam}</span> vs {selectedReportMatch.awayTeam} — {selectedReportMatch.sport}
                            </h2>
                            <p className="text-[10px] text-slate-450 font-mono mt-0.5">Match ID: {selectedReportMatch.id} | Date: {selectedReportMatch.date || "—"}</p>
                          </div>
                          
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                // Set activeTaggingMatch to open the full seekable tagger viewer
                                setActiveTaggingMatch(selectedReportMatch);
                              }}
                              className="px-4 py-2 bg-[#0070f3] hover:bg-[#0051a8] text-white rounded font-sans text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                            >
                              ▶ Launch Video Tagger Viewer
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedReportMatch(null)}
                              className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 rounded font-sans text-xs text-slate-450 cursor-pointer"
                            >
                              Close Details
                            </button>
                          </div>
                        </div>

                        {/* Volleyball Stats Dials Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Attack Kill % */}
                          <div className="bg-neutral-950/60 border border-neutral-900 rounded p-4 flex flex-col items-center justify-center text-center gap-1.5">
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">Attack Kill %</span>
                            <span className="text-3xl font-extrabold text-[#ff6300] font-mono">{stats.attackKillPct}%</span>
                            <span className="text-[9px] text-slate-450 font-sans">Percentage of attacks resulting in Kills</span>
                          </div>

                          {/* Pass Average */}
                          <div className="bg-neutral-950/60 border border-neutral-900 rounded p-4 flex flex-col items-center justify-center text-center gap-1.5">
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">Pass Average</span>
                            <span className="text-3xl font-extrabold text-[#0070f3] font-mono">{stats.passAverage} <span className="text-xs text-slate-500 font-normal">/ 3.0</span></span>
                            <span className="text-[9px] text-slate-450 font-sans">Weighted average of pass quality ratings</span>
                          </div>

                          {/* Serve Success % */}
                          <div className="bg-neutral-950/60 border border-neutral-900 rounded p-4 flex flex-col items-center justify-center text-center gap-1.5">
                            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">Serve Success %</span>
                            <span className="text-3xl font-extrabold text-emerald-400 font-mono">{stats.serveSuccessPct}%</span>
                            <span className="text-[9px] text-slate-450 font-sans">Percentage of error-free serve attempts</span>
                          </div>
                        </div>

                        {/* Player performance report table */}
                        <div className="flex flex-col gap-2.5 mt-2">
                          <span className="text-[10px] text-slate-400 uppercase font-sans font-bold tracking-wider">Player Performance Report (Jersey-wise)</span>
                          <div className="border border-neutral-850 rounded overflow-hidden bg-neutral-950/30">
                            <table className="w-full text-left border-collapse text-[11px] text-slate-350">
                              <thead>
                                <tr className="border-b border-neutral-850 bg-neutral-950 text-slate-550 font-bold uppercase text-[9px] tracking-wider font-mono">
                                  <th className="p-3">Jersey</th>
                                  <th className="p-3">Player Name</th>
                                  <th className="p-3 text-center">Digs</th>
                                  <th className="p-3 text-center">Attacks (Kills)</th>
                                  <th className="p-3 text-center">Aces</th>
                                  <th className="p-3 text-center">Blocks</th>
                                  <th className="p-3 text-center">Passes</th>
                                </tr>
                              </thead>
                              <tbody>
                                {stats.rosterStats.length === 0 ? (
                                  <tr>
                                    <td colSpan={7} className="p-6 text-center text-slate-600 italic text-[10px]">
                                      No roster tracking data available for this match.
                                    </td>
                                  </tr>
                                ) : (
                                  stats.rosterStats.map(row => (
                                    <tr key={row.jersey} className="border-b border-neutral-900/60 hover:bg-neutral-900/30">
                                      <td className="p-3 font-mono font-bold text-white">#{row.jersey}</td>
                                      <td className="p-3 font-semibold text-slate-200">{row.name}</td>
                                      <td className="p-3 text-center font-mono">{row.digs}</td>
                                      <td className="p-3 text-center font-mono">{row.attacks} ({row.kills})</td>
                                      <td className="p-3 text-center font-mono">{row.aces}</td>
                                      <td className="p-3 text-center font-mono">{row.blocks}</td>
                                      <td className="p-3 text-center font-mono">{row.passes}</td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Analyst Review & Feedback Rating Form */}
                        <div className="border-t border-neutral-850 pt-4 mt-2">
                          <span className="text-[10px] text-slate-400 uppercase font-sans font-bold tracking-wider block mb-3">Analyst Review & Rating</span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950/20 border border-neutral-850/60 p-4 rounded">
                            <div className="flex flex-col gap-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-[10.5px] text-slate-350 font-medium">Rate Tagging Quality (Optional)</label>
                                <div className="flex items-center gap-1.5 mt-1">
                                  {[1, 2, 3, 4, 5].map(star => {
                                    const isSelected = star <= (feedbackRating || selectedReportMatch.rating || 0);
                                    return (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFeedbackRating(star)}
                                        className="text-lg transition-transform hover:scale-110 cursor-pointer"
                                      >
                                        {isSelected ? "★" : "☆"}
                                      </button>
                                    );
                                  })}
                                  <span className="text-[10px] text-slate-500 font-mono ml-2">
                                    {(feedbackRating || selectedReportMatch.rating || 0)} / 5 stars
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col gap-1 mt-1.5">
                                <label className="text-[10.5px] text-slate-355 font-medium">Comments & Feedback (Optional)</label>
                                <textarea
                                  value={feedbackCommentText}
                                  onChange={(e) => setFeedbackCommentText(e.target.value)}
                                  rows={2.5}
                                  placeholder="Provide feedback on analyst performance, tagging accuracy, or issues found..."
                                  className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-[#ff6300] font-sans mt-1"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col justify-between items-start text-left">
                              <div className="text-[10px] text-slate-500 leading-relaxed font-sans">
                                <p className="font-bold text-slate-400">Why rate your analyst?</p>
                                <p className="mt-1">Your ratings directly influence analyst profile metrics and quality scores. If there are errors or missed tags, detail them here so we can optimize future games.</p>
                              </div>
                              
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await updateMatchStatus(selectedReportMatch.id, "Completed", {
                                      rating: feedbackRating || selectedReportMatch.rating || 5,
                                      feedbackComment: feedbackCommentText || selectedReportMatch.feedbackComment || ""
                                    });
                                    triggerAlert("success", "Analyst review submitted successfully!");
                                    refreshDbData();
                                    // Update locally selected match object data reference
                                    setSelectedReportMatch({
                                      ...selectedReportMatch,
                                      rating: feedbackRating || selectedReportMatch.rating || 5,
                                      feedbackComment: feedbackCommentText || selectedReportMatch.feedbackComment || ""
                                    });
                                  } catch (err) {
                                    triggerAlert("error", "Failed to save rating feedback.");
                                  }
                                }}
                                className="px-4 py-2 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-sans text-xs font-bold cursor-pointer"
                              >
                                Submit Analyst Review
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                </div>
              )}

              {/* E. VIEW: MEMBERSHIP */}
              {activeTab === "Membership" && (
                <div className="flex flex-col gap-6 animate-fadeIn text-left max-w-xl font-mono text-xs">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white font-sans font-bold">Membership</h1>
                    <p className="text-slate-400 text-xs mt-1">Review tactical breakdown allocations, credits quotas, and priority SLAs.</p>
                  </div>

                  <div className="p-6 rounded border border-neutral-850 bg-[#191F24]/80 flex flex-col gap-4 shadow-md backdrop-blur-sm" style={{ borderTop: `3px solid ${coachPrimaryColor}` }}>
                    <div>
                      <span className="px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold inline-block font-bold"
                        style={{ backgroundColor: `${coachPrimaryColor}10`, color: coachPrimaryColor, border: `1px solid ${coachPrimaryColor}20` }}
                      >
                        Current Membership
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2">PRO ANALYTICS TIER</h3>
                      <p className="text-slate-400 text-[11px] mt-1 font-sans font-light leading-relaxed">Perfect for professional leagues and regional club operations looking for structured video analytics pipelines.</p>
                    </div>

                    <div className="h-px bg-neutral-850 my-2" />

                    <div className="flex flex-col gap-3 font-mono">
                      <div className="flex justify-between border-b border-neutral-900 pb-1">
                        <span className="text-slate-500">Remaining Ingest Credits:</span>
                        <strong className="text-white">15 Matches</strong>
                      </div>
                      <div className="flex justify-between border-b border-neutral-900 pb-1">
                        <span className="text-slate-500">Total Credits Allocated:</span>
                        <strong className="text-slate-350">30 Matches / month</strong>
                      </div>
                      <div className="flex justify-between border-b border-neutral-900 pb-1">
                        <span className="text-slate-500">Standard Delivery SLA:</span>
                        <strong style={{ color: coachPrimaryColor }}>12-Hour Priority Queue</strong>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* F. VIEW: BILLING */}
              {activeTab === "Billing" && (
                <div className="flex flex-col gap-6 animate-fadeIn text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-white font-sans font-bold">Billing & Pricing Plans</h1>
                      <p className="text-slate-400 text-xs mt-1">Manage game analysis credits, subscribe to monthly packages, and toggle currency preferences.</p>
                    </div>

                    {/* Currency selector toggle */}
                    <div className="bg-neutral-950 p-1 rounded-sm border border-neutral-850 flex items-center font-mono text-[10px] uppercase font-bold">
                      <button
                        type="button"
                        onClick={() => setBillingCurrency("USD")}
                        className={`px-3 py-1.5 rounded-sm transition-all cursor-pointer ${billingCurrency === "USD" ? "bg-[#ff6300] text-white" : "text-slate-400 hover:text-slate-200"}`}
                      >
                        USD ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingCurrency("INR")}
                        className={`px-3 py-1.5 rounded-sm transition-all cursor-pointer ${billingCurrency === "INR" ? "bg-[#ff6300] text-white" : "text-slate-400 hover:text-slate-200"}`}
                      >
                        INR (₹)
                      </button>
                    </div>
                  </div>

                  {/* Plan Cards Side-by-Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pay Per Game Plan */}
                    <div className="bg-[#191F24]/80 border border-neutral-850 p-6 rounded-lg shadow-xl flex flex-col justify-between backdrop-blur-sm relative overflow-hidden" style={{ borderTop: `4px solid ${coachPrimaryColor}` }}>
                      <div className="absolute top-3 right-3 bg-neutral-950 border border-neutral-850 text-slate-500 font-mono text-[9px] uppercase px-2 py-0.5 rounded-full font-bold">Flexible</div>
                      
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Game-Wise Pack</span>
                        <h2 className="text-2xl font-extrabold text-white font-mono mt-1">
                          {billingCurrency === "USD" ? "$15.00" : "₹1,250.00"} <span className="text-xs text-slate-400 font-normal font-sans">/ match</span>
                        </h2>
                        <p className="text-slate-400 text-xs mt-1.5 font-sans leading-relaxed">Perfect for teams needing analytics on demand. No commitments, pay only when you upload match videos.</p>
                      </div>

                      <div className="flex flex-col gap-2.5 my-6 text-[11px] text-slate-350 border-t border-neutral-900 pt-4">
                        <div className="flex items-center gap-2">✔ Full Volleyball Play Tagging Logs</div>
                        <div className="flex items-center gap-2">✔ Individual Player Jersey Reports</div>
                        <div className="flex items-center gap-2">✔ Interactive Seekable Video Timeline Player</div>
                        <div className="flex items-center gap-2">✔ Standard 12-Hour SLA Delivery</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => triggerAlert("success", `Opening payment window for Game-wise plan (${billingCurrency === "USD" ? "$15" : "₹1,250"})`)}
                        className="w-full py-2.5 rounded font-sans text-xs font-bold text-center text-white cursor-pointer shadow transition-all"
                        style={{ backgroundColor: coachPrimaryColor }}
                      >
                        Buy 1 Game Credit
                      </button>
                    </div>

                    {/* Monthly Subscription Plan */}
                    <div className="bg-[#191F24]/80 border border-neutral-850 p-6 rounded-lg shadow-xl flex flex-col justify-between backdrop-blur-sm relative overflow-hidden" style={{ borderTop: `4px solid #ff6300` }}>
                      <div className="absolute top-3 right-3 bg-[#ff6300]/10 border border-[#ff6300]/30 text-[#ff6300] font-mono text-[9px] uppercase px-2 py-0.5 rounded-full font-bold">Best Value</div>
                      
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Tactical Club Membership</span>
                        <h2 className="text-2xl font-extrabold text-white font-mono mt-1">
                          {billingCurrency === "USD" ? "$99.00" : "₹7,900.00"} <span className="text-xs text-slate-400 font-normal font-sans">/ month</span>
                        </h2>
                        <p className="text-slate-400 text-xs mt-1.5 font-sans leading-relaxed">Best for active teams playing weekly games. Process up to 10 completed match uploads each month.</p>
                      </div>

                      <div className="flex flex-col gap-2.5 my-6 text-[11px] text-slate-350 border-t border-neutral-900 pt-4">
                        <div className="flex items-center gap-2">✔ Includes 10 Matches Tagging quota / month</div>
                        <div className="flex items-center gap-2">✔ Priority SLA Processing (Fastest queue status)</div>
                        <div className="flex items-center gap-2">✔ Dedicated Analyst Assignments & Branding Setup</div>
                        <div className="flex items-center gap-2">✔ XML sheets & visual metrics logs exports</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => triggerAlert("success", `Opening subscription checkout for Club Membership (${billingCurrency === "USD" ? "$99/mo" : "₹7,900/mo"})`)}
                        className="w-full py-2.5 rounded font-sans text-xs font-bold text-center text-white cursor-pointer shadow hover:bg-orange-600 transition-all bg-[#ff6300]"
                      >
                        Subscribe to Membership
                      </button>
                    </div>
                  </div>

                  {/* Mock Payment Drawer / Form Panel */}
                  <div className="p-6 rounded border border-neutral-850 bg-[#191F24]/80 shadow-md text-xs font-sans max-w-lg backdrop-blur-sm mt-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold mb-3">Stripe Secure checkout</span>
                    <form onSubmit={(e) => { e.preventDefault(); triggerAlert("success", "Mock checkout completed! Pricing credits have been applied."); }} className="flex flex-col gap-4 text-left">
                      <div className="grid grid-cols-2 gap-3 text-slate-300">
                        <div className="flex flex-col gap-1.5 col-span-2">
                          <label className="text-[10.5px]">Cardholder Name *</label>
                          <input required type="text" placeholder="John Doe" className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none focus:border-[#ff6300]" />
                        </div>
                        <div className="flex flex-col gap-1.5 col-span-2">
                          <label className="text-[10.5px]">Card Number *</label>
                          <input required type="text" placeholder="4242 4242 4242 4242" className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none focus:border-[#ff6300] font-mono" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10.5px]">Expiry Date *</label>
                          <input required type="text" placeholder="MM/YY" className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none focus:border-[#ff6300] font-mono" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10.5px]">CVV Code *</label>
                          <input required type="password" placeholder="***" className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none focus:border-[#ff6300] font-mono" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-900">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-500 font-mono">SELECTED PACKAGE</span>
                          <span className="text-white font-bold text-xs uppercase">{billingCurrency === "USD" ? "Game credit — $15.00" : "Game credit — ₹1,250.00"}</span>
                        </div>
                        <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold cursor-pointer font-sans text-xs">
                          Secure Pay
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Previous Billing Invoices Table */}
                  <div className="border border-neutral-850 rounded overflow-hidden bg-[#191F24]/80 shadow-xl backdrop-blur-sm mt-4">
                    <div className="p-3 bg-neutral-950/80 border-b border-neutral-850">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">Billing Invoice History</span>
                    </div>
                    <table className="w-full text-left border-collapse text-xs text-slate-300">
                      <thead>
                        <tr className="border-b border-neutral-850 bg-neutral-950/40 text-slate-400 font-bold uppercase text-[9px] tracking-wider font-mono">
                          <th className="p-4">Invoice ID</th>
                          <th className="p-4">Billing Date</th>
                          <th className="p-4">Plan Item</th>
                          <th className="p-4 font-mono text-center">Amount</th>
                          <th className="p-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-neutral-850 hover:bg-neutral-900 text-slate-355 font-mono">
                          <td className="p-4 text-white font-bold">INV-4820-A</td>
                          <td className="p-4">Aug 1, 2026</td>
                          <td className="p-4 font-sans">Pro Analytics Plan - 30 Credits</td>
                          <td className="p-4 text-center text-white">
                            {billingCurrency === "USD" ? "$450.00" : "₹37,500.00"}
                          </td>
                          <td className="p-4 text-right"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 text-[9px] font-extrabold uppercase">Paid</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* G. VIEW: NOTIFICATIONS */}
              {activeTab === "Notifications" && (
                <div className="flex flex-col gap-6 animate-fadeIn text-left max-w-xl">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white font-sans font-bold">Notifications</h1>
                    <p className="text-slate-400 text-xs mt-1">Review matching processes, queue deliveries alerts, and uploads acknowledgements.</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {getCoachNotifications().length === 0 ? (
                      <div className="p-8 rounded bg-[#191F24]/80 border border-neutral-850 text-center text-slate-500 font-mono uppercase tracking-wider backdrop-blur-sm">
                        No recent notifications found.
                      </div>
                    ) : (
                      getCoachNotifications().map((n: any) => (
                        <div key={n.id} className="p-4 border border-neutral-850 rounded bg-[#191F24]/80 flex justify-between items-start gap-4 backdrop-blur-sm">
                          <div>
                            <span className="text-[10px] text-slate-550 font-mono block mb-1">{new Date(n.timestamp).toLocaleString()}</span>
                            <span className="text-xs text-slate-200 font-light">{n.text}</span>
                          </div>
                          <button
                            onClick={() => {
                              const list = getCoachNotifications();
                              const updated = list.filter((item: any) => item.id !== n.id);
                              localStorage.setItem("scoutvision_coach_notifications", JSON.stringify(updated));
                              refreshDbData();
                            }}
                            className="text-slate-555 hover:text-white cursor-pointer text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}

              {/* H. VIEW: PROFILE */}
              {activeTab === "Profile" && (
                <div className="flex flex-col gap-6 animate-fadeIn text-left max-w-md">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white font-sans font-bold">Profile</h1>
                    <p className="text-slate-400 text-xs mt-1">Update name parameters, contact numbers, and configure login security passwords.</p>
                  </div>

                  <form 
                    onSubmit={(e) => { e.preventDefault(); triggerAlert("success", "Profile settings saved successfully."); }}
                    className="p-6 rounded bg-[#191F24]/80 border border-neutral-850 flex flex-col gap-4 shadow-xl text-xs font-mono backdrop-blur-sm"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-550 uppercase font-bold">Coach Name:</span>
                      <strong className="text-white text-sm uppercase">{user.name}</strong>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-550 uppercase font-bold">Organization:</span>
                      <strong className="text-white text-sm uppercase">{user.tenantName}</strong>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-450 uppercase">Email Address</label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="bg-neutral-950/60 border border-neutral-850 rounded p-2 text-slate-550 cursor-not-allowed outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-450 uppercase">Phone Number</label>
                      <input
                        type="text"
                        defaultValue={user.phone}
                        className="bg-neutral-950 border border-neutral-800 rounded p-2 text-white outline-none focus:border-[#0070f3]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-455 uppercase">Country</label>
                      <input
                        type="text"
                        defaultValue={user.country || "United States"}
                        className="bg-neutral-950 border border-neutral-800 rounded p-2 text-white outline-none focus:border-[#0070f3]"
                      />
                    </div>

                    <div className="h-px bg-neutral-850 my-2" />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-450 uppercase">Change Password</label>
                      <input
                        type="password"
                        placeholder="New Password (min 6 chars)"
                        className="bg-neutral-950 border border-neutral-800 rounded p-2 text-white outline-none focus:border-[#0070f3]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 text-white rounded font-bold text-xs uppercase self-start cursor-pointer transition-colors shadow-md animate-pulse"
                      style={{ backgroundColor: coachPrimaryColor }}
                    >
                      Save Profile
                    </button>
                  </form>

                </div>
              )}

              {/* I. VIEW: SETTINGS */}
              {activeTab === "Settings" && (
                <div className="flex flex-col gap-6 animate-fadeIn text-left max-w-md">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white font-sans font-bold">Settings</h1>
                    <p className="text-slate-400 text-xs mt-1">Configure workspace localization, dashboard preferences, and security tags.</p>
                  </div>

                  <form 
                    onSubmit={(e) => { e.preventDefault(); triggerAlert("success", "Preferences saved successfully."); }}
                    className="p-6 rounded bg-[#191F24]/80 border border-neutral-850 flex flex-col gap-4 shadow-xl text-xs font-mono backdrop-blur-sm"
                  >
                    {/* Club Theme Selector presets */}
                    <div className="flex flex-col gap-2 p-3.5 rounded bg-neutral-950/60 border border-neutral-850">
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest font-bold">Select Club Theme Color</span>
                      <div className="flex gap-3.5 mt-2">
                        {[
                          { name: "Royal Blue", value: "#0070f3" },
                          { name: "Crimson Red", value: "#e11d48" },
                          { name: "Forest Green", value: "#16a34a" },
                          { name: "Deep Purple", value: "#7c3aed" },
                          { name: "Golden Amber", value: "#d97706" }
                        ].map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={async () => {
                              try {
                                await updateUser(user.id, { primaryColor: color.value });
                                triggerAlert("success", `Club theme branding set to ${color.name}!`);
                                refreshDbData();
                              } catch (err) {
                                triggerAlert("error", "Failed to update branding colors.");
                              }
                            }}
                            className="w-7 h-7 rounded-full border border-neutral-750 transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          >
                            {coachPrimaryColor === color.value && (
                              <span className="text-white text-[10px] font-bold">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-neutral-850 my-2" />

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Notification Preferences</label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" style={{ accentColor: coachPrimaryColor }} />
                        <span className="text-slate-300">Notify me immediately when report is complete</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer mt-1">
                        <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" style={{ accentColor: coachPrimaryColor }} />
                        <span className="text-slate-300">Notify me if match requires a replacement video</span>
                      </label>
                    </div>

                    <div className="h-px bg-neutral-850 my-2" />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-450 uppercase font-mono">Language</label>
                      <select className="bg-neutral-950 border border-neutral-800 rounded p-2 text-white outline-none">
                        <option value="en">English (US)</option>
                        <option value="es">Español</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-450 uppercase font-mono">Dark Mode</label>
                      <select className="bg-neutral-950 border border-neutral-800 rounded p-2 text-white outline-none">
                        <option value="dark">Dark Theme Enabled</option>
                        <option value="light" disabled>Light Theme Disabled</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-455 uppercase font-mono">Security</label>
                      <select className="bg-neutral-950 border border-neutral-800 rounded p-2 text-white outline-none">
                        <option value="high">Two-Factor Authentication (Recommended)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 text-white rounded font-bold text-xs uppercase self-start cursor-pointer transition-colors shadow-md"
                      style={{ backgroundColor: coachPrimaryColor }}
                    >
                      Save Preferences
                    </button>
                  </form>

                </div>
              )}

            </main>

            {/* Sub Modal: Submit Coach Feedback Form (Self-contained in Block E) */}
            {coachFeedbackMatch && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-center p-4 text-xs font-sans">
                <form onSubmit={handleCoachFeedbackSubmit} className="w-full max-w-sm bg-[#191F24] border border-neutral-850 rounded shadow-2xl overflow-hidden animate-fadeIn text-left">
                  
                  <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-850 text-white flex items-center justify-between">
                    <span className="text-xs font-bold font-mono">Submit Game Feedback - {coachFeedbackMatch.id}</span>
                    <button type="button" onClick={() => setCoachFeedbackMatch(null)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-3.5">
                    {/* Overall Rating */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">★★★★★ Overall Rating</label>
                      <div className="flex gap-1.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={(e) => { e.preventDefault(); setCoachInputOverall(star); }}
                            className="text-lg focus:outline-none transition-transform hover:scale-110"
                          >
                            {star <= coachInputOverall ? "⭐️" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Accuracy Rating */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">Analysis Quality Rating</label>
                      <div className="flex gap-1.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={(e) => { e.preventDefault(); setCoachInputAccuracy(star); }}
                            className="text-lg focus:outline-none transition-transform hover:scale-110"
                          >
                            {star <= coachInputAccuracy ? "⭐️" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Time Rating */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">Delivery Time Rating</label>
                      <div className="flex gap-1.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={(e) => { e.preventDefault(); setCoachInputDelivery(star); }}
                            className="text-lg focus:outline-none transition-transform hover:scale-110"
                          >
                            {star <= coachInputDelivery ? "⭐️" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Overall Experience Rating */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">Overall Experience Rating</label>
                      <div className="flex gap-1.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={(e) => { e.preventDefault(); setCoachInputTagging(star); }}
                            className="text-lg focus:outline-none transition-transform hover:scale-110"
                          >
                            {star <= coachInputTagging ? "⭐️" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="flex flex-col gap-1 mt-1">
                      <label className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">Comment Box</label>
                      <textarea
                        value={coachInputComment}
                        onChange={(e) => setCoachInputComment(e.target.value)}
                        rows={2}
                        className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none"
                        placeholder="Add review details, notes, or tactical remarks..."
                      />
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-850">
                      <button
                        type="button"
                        onClick={() => setCoachFeedbackMatch(null)}
                        className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-xs font-bold text-slate-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white rounded-sm text-xs font-bold shadow cursor-pointer"
                        style={{ backgroundColor: coachPrimaryColor }}
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Sub Modal: Replace Video Input Form (Self-contained in Block E) */}
            {replaceVideoMatch && (
              <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-center p-4 text-xs font-sans">
                <form onSubmit={handleReplaceVideoSubmit} className="w-full max-w-sm bg-[#191F24] border border-neutral-850 rounded shadow-2xl overflow-hidden animate-fadeIn text-left font-mono">
                  
                  <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-850 text-white flex items-center justify-between">
                    <span className="text-xs font-bold">Replace Video - {replaceVideoMatch.id}</span>
                    <button type="button" onClick={() => setReplaceVideoMatch(null)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-4">
                    <div className="bg-red-950/30 border border-red-500/20 text-red-400 p-3 rounded text-[11px] font-mono leading-relaxed">
                      <strong>Reason:</strong> &ldquo;{replaceVideoMatch.rejectionReason || "Video file corrupted or incomplete."}&rdquo;
                    </div>

                    <div className="flex flex-col gap-1.5 mt-1">
                      <label className="text-[10px] text-slate-450 uppercase">Select Replacement Video File (.MP4 / .MOV) *</label>
                      <select
                        value={uploadVideoName}
                        onChange={(e) => setUploadVideoName(e.target.value)}
                        required
                        className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none"
                      >
                        <option value="">-- Choose New Recording Video --</option>
                        <option value="match_rec_replace_final.mp4">match_rec_replace_final.mp4 (4.5 GB)</option>
                        <option value="wide_angle_correct_feed.mp4">wide_angle_correct_feed.mp4 (5.2 GB)</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-850">
                      <button
                        type="button"
                        onClick={() => setReplaceVideoMatch(null)}
                        className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-xs font-bold text-slate-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white rounded-sm text-xs font-bold shadow cursor-pointer animate-pulse"
                        style={{ backgroundColor: coachPrimaryColor }}
                      >
                        Submit Replacement
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Mock Cloud File Selector overlay Browser Modal */}
            {showCloudBrowser && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 font-sans text-xs">
                <div className="w-full max-w-md bg-[#191F24] border border-neutral-850 rounded-lg shadow-2xl overflow-hidden animate-fadeIn text-left">
                  
                  {/* Header */}
                  <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-850 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {showCloudBrowser === "google" ? (
                        <span className="text-[#34A853] font-extrabold uppercase font-mono tracking-wider flex items-center gap-1.5 font-bold">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] inline-block animate-ping" />
                          Google Drive Selector
                        </span>
                      ) : (
                        <span className="text-[#0061FE] font-extrabold uppercase font-mono tracking-wider flex items-center gap-1.5 font-bold">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0061FE] inline-block animate-ping" />
                          Dropbox Selector
                        </span>
                      )}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowCloudBrowser(null)} 
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-slate-455 uppercase font-mono tracking-wide">Search & Filter Files</span>
                      <input
                        type="text"
                        value={cloudSearchQuery}
                        onChange={(e) => setCloudSearchQuery(e.target.value)}
                        placeholder="Search recordings, games, cams..."
                        className="bg-neutral-950 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none focus:border-[#0070f3]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-slate-455 uppercase font-mono tracking-wide">Available Cloud Files</span>
                      <div className="border border-neutral-850 rounded bg-neutral-950/40 max-h-[180px] overflow-y-auto pr-1 flex flex-col gap-1.5 p-2">
                        {[
                          { name: "london_derby_cup_final_raw.mov", size: "8.7 GB", path: "/Match_Ingest/Soccer/" },
                          { name: "gdrive_tactical_feed_wide.mp4", size: "5.0 GB", path: "/Recordings/Wide_Cam/" },
                          { name: "court_camera_feed_east.mp4", size: "3.8 GB", path: "/Basketball/State_Varsity/" },
                          { name: "match_rec_first_half.mp4", size: "4.2 GB", path: "/Match_Ingest/Football/" },
                          { name: "volleyball_varsity_finals.mov", size: "6.1 GB", path: "/Recordings/Volleyball/" },
                          { name: "wide_angle_correct_feed.mp4", size: "5.2 GB", path: "/Corrupted_Replacements/" }
                        ]
                        .filter(file => file.name.toLowerCase().includes(cloudSearchQuery.toLowerCase()))
                        .map((file) => {
                          const isSelected = selectedCloudFile === file.name;
                          return (
                            <button
                              key={file.name}
                              type="button"
                              onClick={() => setSelectedCloudFile(file.name)}
                              className="p-2.5 rounded border text-left flex justify-between items-center cursor-pointer transition-all"
                              style={{
                                backgroundColor: isSelected ? `${coachPrimaryColor}15` : "rgba(10, 10, 10, 0.4)",
                                borderColor: isSelected ? coachPrimaryColor : "rgba(255, 255, 255, 0.08)",
                                color: isSelected ? coachPrimaryColor : undefined
                              }}
                            >
                              <div className="flex flex-col gap-0.5 max-w-[280px]">
                                <span className="text-xs font-bold text-slate-200 truncate">{file.name}</span>
                                <span className="text-[9px] text-slate-500 font-mono">{file.path}</span>
                              </div>
                              <span className="text-[9px] text-slate-450 font-mono font-light">{file.size}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-850">
                      <button
                        type="button"
                        onClick={() => setShowCloudBrowser(null)}
                        className="px-4 py-2 bg-neutral-900 border border-neutral-850 rounded-sm text-xs font-bold text-slate-350 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={!selectedCloudFile}
                        onClick={() => {
                          setUploadVideoName(selectedCloudFile);
                          triggerAlert("success", `Cloud file chosen: ${selectedCloudFile}`);
                          setShowCloudBrowser(null);
                        }}
                        className="px-4 py-2 text-white rounded-sm text-xs font-bold shadow cursor-pointer disabled:opacity-50"
                        style={{ backgroundColor: coachPrimaryColor }}
                      >
                        Select & Import Video
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* FULL TAGGER WORKSPACE MODAL OVERLAY */}
      {/* ========================================== */}
      {activeTaggingMatch && (
        <VolleyballTaggerWorkspace
          match={activeTaggingMatch}
          user={user}
          onClose={() => setActiveTaggingMatch(null)}
          onSave={async (tags) => {
            if (user?.role === "ANALYST") {
              try {
                await updateMatchStatus(activeTaggingMatch.id, "Claimed", {
                  scoutProgress: Math.min(100, (activeTaggingMatch.scoutProgress || 0) + 15),
                  isTagging: false,
                  tags
                });
                setHasStartedTagging(true);
                setActiveTaggingMatch(null);
                refreshDbData();
              } catch (err) {
                triggerAlert("error", "Failed to save tagging progress.");
              }
            } else {
              setActiveTaggingMatch(null);
            }
          }}
          triggerAlert={triggerAlert}
        />
      )}

      {/* Modal: Problem Report Modal */}
      {showProblemReportModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="w-full max-w-sm bg-[#191F24] border border-neutral-800 rounded shadow-2xl overflow-hidden animate-fadeIn text-left text-xs">
            <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-850 text-white flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider font-mono">Problem Report - Match Issue</span>
              <button type="button" onClick={() => setShowProblemReportModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 font-normal">Issue Category *</label>
                <select
                  value={problemReportType}
                  onChange={(e) => setProblemReportType(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#ff6300]"
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
                <label className="text-slate-300 font-normal">Details / Timestamp Notes</label>
                <textarea
                  value={problemReportNote}
                  onChange={(e) => setProblemReportNote(e.target.value)}
                  rows={3}
                  className="bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#ff6300] font-sans"
                  placeholder="Describe the issue at current playback timestamp..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-850">
                <button
                  type="button"
                  onClick={() => setShowProblemReportModal(false)}
                  className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerAlert("success", `Problem report submitted: ${problemReportType}`);
                    setShowProblemReportModal(false);
                    setProblemReportNote("");
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-sm text-xs font-bold text-white cursor-pointer"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Analyst Rejection Modal reason input */}
      {rejectingMatch && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-center items-center p-4">
          <form onSubmit={handleRejectSubmit} className="w-full max-w-sm bg-[#191F24] border border-neutral-800 rounded shadow-2xl overflow-hidden animate-fadeIn text-left text-xs">
            <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-850 text-white flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider font-mono">Reject Match - {rejectingMatch.id}</span>
              <button type="button" onClick={() => setRejectingMatch(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 font-normal">Rejection Reason *</label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                  className="bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#ff6300]"
                >
                  <option value="">-- Choose Reason --</option>
                  <option value="Poor Video Quality">Poor Video Quality</option>
                  <option value="Wrong Sport">Wrong Sport</option>
                  <option value="Half Missing">Half Missing</option>
                  <option value="Corrupted Video">Corrupted Video</option>
                  <option value="Camera Angle Issue">Camera Angle Issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 font-normal">Details / Explanations</label>
                <textarea
                  value={rejectionDetail}
                  onChange={(e) => setRejectionDetail(e.target.value)}
                  rows={3}
                  className="bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#ff6300] font-sans"
                  placeholder="Explain why this match is rejected..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-850">
                <button
                  type="button"
                  onClick={() => setRejectingMatch(null)}
                  className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-650 hover:bg-red-700 rounded-sm text-xs font-bold text-white cursor-pointer"
                >
                  Reject & Return Game
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
