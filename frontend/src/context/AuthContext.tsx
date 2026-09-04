"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "ADMIN" | "TEAM_LEAD" | "COACH" | "ANALYST" | "QA";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: "Active" | "Inactive";
  department?: string; // For Team Lead
  sportsAccess?: string[]; // For Analyst / Coach
  teamLeadId?: string; // For Analyst assigned to a Team Lead group
  password?: string;
  isTempPassword?: boolean;
  tenantName: string;
  tenantId: string;
  country?: string;
  primaryColor?: string;
  secondaryColor?: string;
  createdAt: string;
}

export interface Match {
  id: string;
  sport: "Football" | "Basketball" | "Volleyball" | "Soccer";
  tournament: string;
  homeTeam: string;
  awayTeam: string;
  coachName: string;
  coachEmail: string;
  organization: string;
  uploadDateTime: string; // ISO String
  deliveryPackage: "Standard" | "Express" | "Premium";
  slaExpiration: string; // ISO String when SLA expires
  status: "Waiting" | "Claimed" | "In Progress" | "QA Review" | "Completed" | "Rejected";
  assignedAnalystId: string | null;
  assignedAnalystName: string | null;
  qaReviewerId?: string | null;
  qaReviewerName?: string | null;
  qcTimestamp?: string | null;
  rejectionReason?: string;
  rejectionDetail?: string;
  qaNotes?: string;
  scoutProgress?: number;
  isIdle?: boolean;
  isTagging?: boolean;
  notes?: string;
  tagTime?: string;
  qualityScore?: string;
  errors?: string;
  coachRating?: string;
  coachMessage?: string;
  homeTeamColor?: string;
  awayTeamColor?: string;
  setsWonHome?: number;
  setsWonAway?: number;
  rotations?: { setNumber: number; home: string; away: string }[];
  feedback?: CoachFeedback;
  roster?: { jersey?: string; name: string }[];
  tags?: { id: string; timestamp: string; event: string; player?: string; jersey?: string }[];
  rating?: number;
  feedbackComment?: string;
}

export interface CoachFeedback {
  overallRating: number;
  accuracyRating: number;
  taggingRating: number;
  deliveryRating: number;
  comment: string;
  submittedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  event: string;
  details: string;
}

export interface InvitationEmail {
  id: string;
  timestamp: string;
  recipient: string;
  subject: string;
  content: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ forcePasswordChange: boolean }>;
  logout: () => void;
  changePassword: (newPassword: string) => Promise<void>;
  
  getUsers: () => User[];
  createUser: (userData: Partial<User>) => Promise<User>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<void>;
  deactivateUser: (userId: string) => Promise<void>;
  reactivateUser: (userId: string) => Promise<void>;
  resetPassword: (userId: string) => Promise<void>;
  getAuditLogs: () => AuditLog[];
  getSentEmails: () => InvitationEmail[];

  // Global Ingestion Queue Management API
  getMatches: () => Match[];
  claimNextMatch: (analystId: string, sportsPermissions: string[]) => Promise<Match | null>;
  assignMatchManually: (matchId: string, analystId: string) => Promise<void>;
  unassignMatch: (matchId: string) => Promise<void>;
  updateMatchStatus: (matchId: string, status: Match["status"], extra?: Partial<Match>) => Promise<void>;
  createMatch: (matchData: Partial<Match>) => Promise<Match>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to determine SLA hours from delivery package
const getSlaHours = (pkg: "Standard" | "Express" | "Premium"): number => {
  if (pkg === "Express") return 12;
  if (pkg === "Premium") return 24;
  return 48; // Standard
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Client Side Databases
  const getDbUsers = (): User[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("scoutvision_db_users");
    if (stored) {
      try {
        let users: User[] = JSON.parse(stored);
        let updated = false;
        users = users.map(u => {
          if (u.id === "usr_analyst") {
            const currentAccess = u.sportsAccess || [];
            if (!currentAccess.includes("Volleyball")) {
              u.sportsAccess = [...currentAccess, "Volleyball"];
              updated = true;
            }
          }
          if (u.id === "usr_teamlead") {
            const currentAccess = u.sportsAccess || [];
            if (!currentAccess.includes("Volleyball")) {
              u.sportsAccess = ["Football", "Soccer", "Basketball", "Volleyball"];
              updated = true;
            }
          }
          return u;
        });
        if (updated) {
          localStorage.setItem("scoutvision_db_users", JSON.stringify(users));
        }
        return users;
      } catch (e) { }
    }
    
    const initialUsers: User[] = [
      {
        id: "usr_admin",
        firstName: "Omkar",
        lastName: "Jadhav",
        name: "OMKAR JADHAV",
        email: "omkar.jadhav7804@gmail.com",
        phone: "+15550190",
        role: "ADMIN",
        status: "Active",
        password: "Omkar0501@",
        isTempPassword: false,
        tenantName: "ScoutVision System Admin",
        tenantId: "ten_admin",
        createdAt: new Date().toISOString()
      },
      {
        id: "usr_coach",
        firstName: "Demo",
        lastName: "Coach",
        name: "DEMO COACH",
        email: "coach@scoutvision.ai",
        phone: "+15550191",
        role: "COACH",
        status: "Active",
        password: "password",
        isTempPassword: false,
        tenantName: "London FC Academy",
        tenantId: "ten_london",
        createdAt: new Date().toISOString()
      },
      {
        id: "usr_teamlead",
        firstName: "Demo",
        lastName: "Team Lead",
        name: "DEMO TEAM LEAD",
        email: "teamlead@scoutvision.ai",
        phone: "+15550192",
        role: "TEAM_LEAD",
        status: "Active",
        password: "password",
        isTempPassword: false,
        tenantName: "London FC Academy",
        tenantId: "ten_london",
        sportsAccess: ["Football", "Soccer", "Basketball", "Volleyball"],
        createdAt: new Date().toISOString()
      },
      {
        id: "usr_analyst",
        firstName: "Demo",
        lastName: "Analyst",
        name: "DEMO ANALYST",
        email: "analyst@scoutvision.ai",
        phone: "+15550193",
        role: "ANALYST",
        status: "Active",
        password: "password",
        isTempPassword: false,
        tenantName: "London FC Academy",
        tenantId: "ten_london",
        teamLeadId: "usr_teamlead",
        sportsAccess: ["Football", "Basketball", "Soccer", "Volleyball"],
        createdAt: new Date().toISOString()
      },
      {
        id: "usr_qa",
        firstName: "Demo",
        lastName: "QA",
        name: "DEMO QA",
        email: "qa@scoutvision.ai",
        phone: "+15550194",
        role: "QA",
        status: "Active",
        password: "password",
        isTempPassword: false,
        tenantName: "QA Audits Division",
        tenantId: "ten_qa",
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem("scoutvision_db_users", JSON.stringify(initialUsers));
    return initialUsers;
  };

  const getDbLogs = (): AuditLog[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("scoutvision_db_logs");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { }
    }
    const initialLogs: AuditLog[] = [
      { id: "log_1", timestamp: new Date().toISOString(), actor: "System", event: "SYSTEM_INITIALIZE", details: "ScoutVision local DB initialized with 5 seeded accounts" }
    ];
    localStorage.setItem("scoutvision_db_logs", JSON.stringify(initialLogs));
    return initialLogs;
  };

  const getDbEmails = (): InvitationEmail[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("scoutvision_db_emails");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { }
    }
    localStorage.setItem("scoutvision_db_emails", JSON.stringify([]));
    return [];
  };

  // NEW: Ingestion Queue database
  const getDbMatches = (): Match[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("scoutvision_db_matches");
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { }
    }

    const now = new Date();
    
    // Seed initial matches with calculated SLA dates
    const initialMatches: Match[] = [
      {
        id: "MCH-201",
        sport: "Football",
        tournament: "District Cup Ingest",
        homeTeam: "Lincoln Tigers",
        awayTeam: "Westside Hawks",
        coachName: "Coach Dave",
        coachEmail: "coach@scoutvision.ai",
        organization: "Lincoln Academy",
        uploadDateTime: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
        deliveryPackage: "Express",
        slaExpiration: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(), // expires in 8h (12h total)
        status: "Waiting",
        assignedAnalystId: null,
        assignedAnalystName: null,
        scoutProgress: 0
      },
      {
        id: "MCH-202",
        sport: "Basketball",
        tournament: "Varsity Regionals",
        homeTeam: "Oakland Warriors",
        awayTeam: "South Bay Celtics",
        coachName: "Coach Dave",
        coachEmail: "coach@scoutvision.ai",
        organization: "Lincoln Academy",
        uploadDateTime: new Date(now.getTime() - 21.5 * 60 * 60 * 1000).toISOString(), // 21.5h ago
        deliveryPackage: "Premium",
        // Expires in 2.5h (total 24h) -> Turns RED Priority instantly!
        slaExpiration: new Date(now.getTime() + 2.5 * 60 * 60 * 1000).toISOString(), 
        status: "Waiting",
        assignedAnalystId: null,
        assignedAnalystName: null,
        scoutProgress: 0
      },
      {
        id: "MCH-203",
        sport: "Volleyball",
        tournament: "State Girls Open",
        homeTeam: "Trinity High",
        awayTeam: "Owensboro Catholic",
        coachName: "Coach Dave",
        coachEmail: "coach@scoutvision.ai",
        organization: "Owensboro Sports Group",
        uploadDateTime: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1h ago
        deliveryPackage: "Standard",
        slaExpiration: new Date(now.getTime() + 47 * 60 * 60 * 1000).toISOString(), // expires in 47h (48h total)
        status: "Waiting",
        assignedAnalystId: null,
        assignedAnalystName: null,
        scoutProgress: 0,
        setsWonHome: 2,
        setsWonAway: 1,
        rotations: [
          { setNumber: 1, home: "unknown", away: "unknown" },
          { setNumber: 2, home: "unknown", away: "unknown" },
          { setNumber: 3, home: "unknown", away: "unknown" }
        ],
        roster: [
          { jersey: "17", name: "Sarah" },
          { jersey: "2", name: "Olivia" },
          { jersey: "10", name: "Sarah" },
          { jersey: "12", name: "Emily" },
          { jersey: "5", name: "Jessica" },
          { jersey: "22", name: "Ashley" }
        ]
      },
      {
        id: "MCH-204",
        sport: "Soccer",
        tournament: "Youth Soccer Cup",
        homeTeam: "Pohaku FC",
        awayTeam: "Puget Girls Academy",
        coachName: "Coach Sarah",
        coachEmail: "sarah@scoutvision.ai",
        organization: "Puget Sports Club",
        uploadDateTime: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString(), // 10h ago
        deliveryPackage: "Standard",
        slaExpiration: new Date(now.getTime() + 38 * 60 * 60 * 1000).toISOString(), // expires in 38h (48h total)
        status: "Waiting",
        assignedAnalystId: null,
        assignedAnalystName: null,
        scoutProgress: 0
      },
      {
        id: "MCH-205",
        sport: "Football",
        tournament: "Pre-season Scrimmage",
        homeTeam: "Valparaiso Vikings",
        awayTeam: "Crown Point Bulldogs",
        coachName: "Coach Sarah",
        coachEmail: "sarah@scoutvision.ai",
        organization: "Valparaiso Athletics",
        uploadDateTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        deliveryPackage: "Express",
        slaExpiration: new Date(now.getTime() + 10 * 60 * 60 * 1000).toISOString(),
        status: "Claimed",
        assignedAnalystId: "usr_analyst",
        assignedAnalystName: "DEMO ANALYST",
        scoutProgress: 35
      },
      {
        id: "MCH-206",
        sport: "Soccer",
        tournament: "Championship Round 1",
        homeTeam: "Fulham FC Academy",
        awayTeam: "Chelsea Youth",
        coachName: "Coach Sara",
        coachEmail: "sarah@scoutvision.ai",
        organization: "Fulham FC Club",
        uploadDateTime: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        deliveryPackage: "Premium",
        slaExpiration: new Date(now.getTime() + 18 * 60 * 60 * 1000).toISOString(),
        status: "QA Review",
        assignedAnalystId: "usr_analyst",
        assignedAnalystName: "DEMO ANALYST",
        scoutProgress: 100
      },
      {
        id: "MCH-207",
        sport: "Basketball",
        tournament: "Invitational Finals",
        homeTeam: "NJ Team Sharp",
        awayTeam: "Midwest Select",
        coachName: "Coach Dave",
        coachEmail: "coach@scoutvision.ai",
        organization: "NJ Elite Sports",
        uploadDateTime: new Date(now.getTime() - 30 * 60 * 60 * 1000).toISOString(),
        deliveryPackage: "Premium",
        slaExpiration: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(), // Expired
        status: "Completed",
        assignedAnalystId: "usr_analyst",
        assignedAnalystName: "DEMO ANALYST",
        scoutProgress: 100,
        tagTime: "1:13:21",
        qualityScore: "96.3%",
        errors: "—"
      },
      {
        id: "MCH-208",
        sport: "Volleyball",
        tournament: "District Open Finals",
        homeTeam: "Trinity High",
        awayTeam: "Owensboro Catholic",
        coachName: "Coach Dave",
        coachEmail: "coach@scoutvision.ai",
        organization: "Owensboro Sports Group",
        uploadDateTime: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
        deliveryPackage: "Standard",
        slaExpiration: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        status: "Completed",
        assignedAnalystId: "usr_analyst",
        assignedAnalystName: "DEMO ANALYST",
        scoutProgress: 100,
        tagTime: "1:54:38",
        qualityScore: "98.5%",
        errors: "—"
      }
    ];

    localStorage.setItem("scoutvision_db_matches", JSON.stringify(initialMatches));
    return initialMatches;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("scoutvision_user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const currentDb = getDbUsers();
        const freshUser = currentDb.find(u => u.email.toLowerCase() === parsed.email.toLowerCase());
        if (freshUser && freshUser.status === "Active") {
          setUser(freshUser);
        } else {
          localStorage.removeItem("scoutvision_user");
        }
      } catch (e) {
        localStorage.removeItem("scoutvision_user");
      }
    }
    // Initialize DB lists on mount
    getDbUsers();
    getDbLogs();
    getDbEmails();
    getDbMatches();
    setIsLoading(false);
  }, []);

  const writeLogs = (event: string, actor: string, details: string) => {
    const logs = getDbLogs();
    const newLog: AuditLog = {
      id: `log_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      actor,
      event,
      details
    };
    localStorage.setItem("scoutvision_db_logs", JSON.stringify([newLog, ...logs]));
  };

  const login = async (email: string, passwordInput: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const dbUsers = getDbUsers();
    const matched = dbUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!matched) {
      writeLogs("LOGIN_FAILED", email, "Email address not found in system directory");
      setIsLoading(false);
      throw new Error("Account not found");
    }

    if (matched.status === "Inactive") {
      writeLogs("LOGIN_FAILED", email, "Attempted to login to a deactivated account");
      setIsLoading(false);
      throw new Error("Deactivated");
    }

    if (matched.password !== passwordInput) {
      writeLogs("LOGIN_FAILED", email, "Invalid password credentials submitted");
      setIsLoading(false);
      throw new Error("Invalid password");
    }

    writeLogs("LOGIN_SUCCESS", email, `Logged in successfully as role ${matched.role}`);
    
    setUser(matched);
    localStorage.setItem("scoutvision_user", JSON.stringify(matched));
    setIsLoading(false);

    return { forcePasswordChange: !!matched.isTempPassword };
  };

  const logout = () => {
    if (user) {
      writeLogs("LOGOUT", user.email, "Session terminated by user logout");
    }
    setUser(null);
    localStorage.removeItem("scoutvision_user");
  };

  const changePassword = async (newPassword: string) => {
    if (!user) throw new Error("No active session");
    
    const dbUsers = getDbUsers();
    const updated = dbUsers.map(u => {
      if (u.id === user.id) {
        return { ...u, password: newPassword, isTempPassword: false };
      }
      return u;
    });

    localStorage.setItem("scoutvision_db_users", JSON.stringify(updated));
    
    const current = updated.find(u => u.id === user.id)!;
    setUser(current);
    localStorage.setItem("scoutvision_user", JSON.stringify(current));

    writeLogs("PASSWORD_CHANGED", user.email, "Forced password reset completed successfully");
  };

  // SUPER ADMIN API
  const getUsers = () => getDbUsers();

  const createUser = async (userData: Partial<User>): Promise<User> => {
    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized");

    const dbUsers = getDbUsers();
    const exists = dbUsers.some(u => u.email.toLowerCase() === userData.email?.toLowerCase());
    if (exists) throw new Error("User email already registered");

    const tempPassword = `sv-${Math.random().toString(36).substr(2, 6)}`;
    const newUserId = `usr_${Math.random().toString(36).substr(2, 9)}`;

    const newUser: User = {
      id: newUserId,
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim().toUpperCase(),
      email: userData.email || "",
      phone: userData.phone || "",
      role: userData.role || "ANALYST",
      status: userData.status || "Active",
      department: userData.department,
      sportsAccess: userData.sportsAccess,
      teamLeadId: userData.teamLeadId,
      password: tempPassword,
      isTempPassword: true,
      tenantName: userData.tenantName || "ScoutVision Elite Athletics",
      tenantId: userData.tenantId || `ten_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("scoutvision_db_users", JSON.stringify([...dbUsers, newUser]));

    const emails = getDbEmails();
    const inviteEmail: InvitationEmail = {
      id: `mail_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      recipient: newUser.email,
      subject: "Welcome to ScoutVision - Account Registration",
      content: `Welcome to ScoutVision!\n\nAn account has been created for you by the System Admin.\n\nLogin URL: http://localhost:3000/auth/login\nRegistered Email: ${newUser.email}\nOne-Time Temporary Password: ${tempPassword}\n\nNote: This temporary password is single-use only. You will be prompted to choose a new password upon your first login.`
    };
    localStorage.setItem("scoutvision_db_emails", JSON.stringify([inviteEmail, ...emails]));

    writeLogs("USER_CREATED", user.email, `Created user ${newUser.email} with role ${newUser.role}`);
    return newUser;
  };

  const updateUser = async (userId: string, userData: Partial<User>) => {
    if (!user || (user.role !== "ADMIN" && user.role !== "TEAM_LEAD")) throw new Error("Unauthorized");

    const dbUsers = getDbUsers();
    const updated = dbUsers.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          firstName: userData.firstName ?? u.firstName,
          lastName: userData.lastName ?? u.lastName,
          name: `${userData.firstName ?? u.firstName} ${userData.lastName ?? u.lastName}`.trim().toUpperCase(),
          phone: userData.phone ?? u.phone,
          status: userData.status ?? u.status,
          department: userData.department ?? u.department,
          sportsAccess: userData.sportsAccess ?? u.sportsAccess,
          teamLeadId: userData.teamLeadId ?? u.teamLeadId
        };
      }
      return u;
    });

    localStorage.setItem("scoutvision_db_users", JSON.stringify(updated));
    writeLogs("USER_UPDATED", user.email, `Updated fields for user ID ${userId}`);
  };

  const deactivateUser = async (userId: string) => {
    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized");
    const dbUsers = getDbUsers();
    const target = dbUsers.find(u => u.id === userId);
    if (!target) throw new Error("User not found");

    const updated = dbUsers.map(u => {
      if (u.id === userId) return { ...u, status: "Inactive" as const };
      return u;
    });
    localStorage.setItem("scoutvision_db_users", JSON.stringify(updated));
    writeLogs("USER_DEACTIVATED", user.email, `Soft-deleted user ${target.email}`);
  };

  const reactivateUser = async (userId: string) => {
    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized");
    const dbUsers = getDbUsers();
    const target = dbUsers.find(u => u.id === userId);
    if (!target) throw new Error("User not found");

    const updated = dbUsers.map(u => {
      if (u.id === userId) return { ...u, status: "Active" as const };
      return u;
    });
    localStorage.setItem("scoutvision_db_users", JSON.stringify(updated));
    writeLogs("USER_REACTIVATED", user.email, `Reactivated user ${target.email}`);
  };

  const resetPassword = async (userId: string) => {
    if (!user || user.role !== "ADMIN") throw new Error("Unauthorized");
    const dbUsers = getDbUsers();
    const target = dbUsers.find(u => u.id === userId);
    if (!target) throw new Error("User not found");

    const newTempPassword = `sv-${Math.random().toString(36).substr(2, 6)}`;
    const updated = dbUsers.map(u => {
      if (u.id === userId) return { ...u, password: newTempPassword, isTempPassword: true };
      return u;
    });
    localStorage.setItem("scoutvision_db_users", JSON.stringify(updated));

    const emails = getDbEmails();
    const inviteEmail: InvitationEmail = {
      id: `mail_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      recipient: target.email,
      subject: "ScoutVision - Password Reset Invitation",
      content: `Your ScoutVision password has been reset by the System Admin.\n\nLogin URL: http://localhost:3000/auth/login\nRegistered Email: ${target.email}\nOne-Time Temporary Password: ${newTempPassword}\n\nNote: This temporary password is single-use only. You will be prompted to choose a new password upon logging in.`
    };
    localStorage.setItem("scoutvision_db_emails", JSON.stringify([inviteEmail, ...emails]));
    writeLogs("PASSWORD_RESET_TRIGGERED", user.email, `Reset password for user ${target.email}`);
  };

  const getAuditLogs = () => getDbLogs();
  const getSentEmails = () => getDbEmails();

  // ==========================================
  // NEW: INGESTION QUEUE MANAGEMENT DATABASE API
  // ==========================================
  const getMatches = (): Match[] => getDbMatches();

  // Concurrency locking Claim logic
  let claimMutexLock = false;

  const claimNextMatch = async (analystId: string, sportsPermissions: string[]): Promise<Match | null> => {
    if (claimMutexLock) {
      // Simulate wait if concurrent calls occur
      await new Promise(r => setTimeout(r, 200));
    }
    claimMutexLock = true;

    try {
      const matches = getDbMatches();
      const dbUsers = getDbUsers();
      const analyst = dbUsers.find(u => u.id === analystId);
      if (!analyst) throw new Error("Analyst profile not found");

      // Verify one active match rule: does this analyst already have a claimed match?
      const alreadyHasClaimed = matches.some(m => 
        m.assignedAnalystId === analystId && 
        (m.status === "Claimed" || m.status === "In Progress")
      );
      if (alreadyHasClaimed) {
        throw new Error("One active match limit reached");
      }

      // Filter unassigned matches matching analyst sports permissions
      const eligible = matches.filter(m => 
        m.status === "Waiting" && 
        sportsPermissions.includes(m.sport)
      );

      if (eligible.length === 0) {
        return null;
      }

      // Sort by SLA remaining (lowest remaining SLA expiration first)
      eligible.sort((a, b) => new Date(a.slaExpiration).getTime() - new Date(b.slaExpiration).getTime());
      
      const targetMatch = eligible[0];

      // Mutate status and assign properties
      const updated = matches.map(m => {
        if (m.id === targetMatch.id) {
          return {
            ...m,
            status: "Claimed" as const,
            assignedAnalystId: analystId,
            assignedAnalystName: analyst.name,
            scoutProgress: 0
          };
        }
        return m;
      });

      localStorage.setItem("scoutvision_db_matches", JSON.stringify(updated));
      writeLogs("MATCH_CLAIMED", analyst.email, `Claimed match ${targetMatch.id} (${targetMatch.homeTeam} vs ${targetMatch.awayTeam})`);
      
      return updated.find(m => m.id === targetMatch.id)!;
    } finally {
      claimMutexLock = false;
    }
  };

  const assignMatchManually = async (matchId: string, analystId: string) => {
    if (!user || (user.role !== "ADMIN" && user.role !== "TEAM_LEAD")) {
      throw new Error("Unauthorized");
    }

    const matches = getDbMatches();
    const dbUsers = getDbUsers();
    const analyst = dbUsers.find(u => u.id === analystId);
    if (!analyst) throw new Error("Analyst not found");

    const updated = matches.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          status: "Claimed" as const,
          assignedAnalystId: analyst.id,
          assignedAnalystName: analyst.name,
          scoutProgress: 0
        };
      }
      return m;
    });

    localStorage.setItem("scoutvision_db_matches", JSON.stringify(updated));
    writeLogs("MATCH_ASSIGNED", user.email, `Manually assigned match ${matchId} to Analyst ${analyst.email}`);
  };

  const unassignMatch = async (matchId: string) => {
    if (!user || (user.role !== "ADMIN" && user.role !== "TEAM_LEAD")) {
      throw new Error("Unauthorized");
    }

    const matches = getDbMatches();
    const target = matches.find(m => m.id === matchId);
    if (!target) throw new Error("Match not found");

    const updated = matches.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          status: "Waiting" as const,
          assignedAnalystId: null,
          assignedAnalystName: null,
          scoutProgress: 0
        };
      }
      return m;
    });

    localStorage.setItem("scoutvision_db_matches", JSON.stringify(updated));
    writeLogs("MATCH_UNASSIGNED", user.email, `Revoked analyst assignment for match ${matchId}`);
  };

  const updateMatchStatus = async (matchId: string, status: Match["status"], extra?: Partial<Match>) => {
    if (!user) throw new Error("Unauthorized");

    const matches = getDbMatches();
    const updated = matches.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          status,
          ...extra
        };
      }
      return m;
    });

    localStorage.setItem("scoutvision_db_matches", JSON.stringify(updated));
    writeLogs("MATCH_STATUS_UPDATE", user.email, `Updated match ${matchId} status to ${status}`);
  };

  const createMatch = async (matchData: Partial<Match>): Promise<Match> => {
    if (!user) throw new Error("Unauthorized");

    const matches = getDbMatches();
    const newMatchId = Math.floor(100000 + Math.random() * 900000).toString();

    const newMatch: Match = {
      id: newMatchId,
      sport: matchData.sport || "Football",
      tournament: matchData.tournament || "",
      homeTeam: matchData.homeTeam || "",
      awayTeam: matchData.awayTeam || "",
      coachName: user.name || `${user.firstName} ${user.lastName}`,
      coachEmail: user.email,
      organization: user.tenantName || "",
      uploadDateTime: new Date().toISOString(),
      deliveryPackage: matchData.deliveryPackage || "Standard",
      slaExpiration: matchData.slaExpiration || new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      status: "Waiting",
      assignedAnalystId: null,
      assignedAnalystName: null,
      scoutProgress: 0,
      notes: matchData.notes,
      ...matchData
    };

    const updated = [newMatch, ...matches];
    localStorage.setItem("scoutvision_db_matches", JSON.stringify(updated));
    writeLogs("MATCH_CREATED", user.email, `Uploaded match ${newMatchId} (${newMatch.homeTeam} vs ${newMatch.awayTeam})`);
    return newMatch;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        changePassword,
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
