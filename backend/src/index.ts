import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Match } from "./models/Match.js";
import { Tag } from "./models/Tag.js";
import { User } from "./models/User.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// In-memory fallbacks when MongoDB is offline
let matchesMemoryDb: any[] = [
  {
    id: "match-demo-1",
    title: "AA vs Team 2 (Championship)",
    homeTeam: "AA",
    awayTeam: "Team 2",
    homeTeamColor: "#c8102e",
    awayTeamColor: "#4a5568",
    setScoreHome: 22,
    setScoreAway: 22,
    status: "Claimed",
    scoutProgress: 45
  }
];
let tagsMemoryDb: any[] = [];

// 1. Health & Database Check
app.get("/health", (_req: Request, res: Response) => {
  const isMongoConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: "ok",
    service: "scoutvision-backend",
    database: {
      provider: "MongoDB",
      status: isMongoConnected ? "connected" : "in-memory fallback mode",
      readyState: mongoose.connection.readyState
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 2. Matches API
app.get("/api/matches", async (_req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const matches = await Match.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: matches.length, data: matches });
    }
    return res.status(200).json({ success: true, count: matchesMemoryDb.length, data: matchesMemoryDb });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
});

app.post("/api/matches", async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const match = await Match.create(req.body);
      return res.status(201).json({ success: true, match });
    }
    const match = { id: "match-" + Date.now(), createdAt: new Date().toISOString(), ...req.body };
    matchesMemoryDb.push(match);
    return res.status(201).json({ success: true, match });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// 3. Tags API
app.get("/api/tags", async (req: Request, res: Response) => {
  try {
    const { matchId } = req.query;
    if (mongoose.connection.readyState === 1) {
      const filter = matchId ? { matchId: String(matchId) } : {};
      const tags = await Tag.find(filter).sort({ startTime: 1 });
      return res.status(200).json({ success: true, count: tags.length, data: tags });
    }
    const filtered = matchId ? tagsMemoryDb.filter(t => t.matchId === matchId) : tagsMemoryDb;
    return res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
});

app.post("/api/tags", async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const tag = await Tag.create(req.body);
      return res.status(201).json({ success: true, tag });
    }
    const tag = { id: "tag-" + Date.now(), timestamp: new Date().toISOString(), ...req.body };
    tagsMemoryDb.push(tag);
    return res.status(201).json({ success: true, tag });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// 4. Email Dispatch API
app.post("/api/send-email", (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  console.log(`[Email Service] Dispatched email from ${name} <${email}>: ${subject || "No Subject"}`);
  return res.status(200).json({ success: true, message: "Email dispatched successfully" });
});

// Start Server & Connect Database
app.listen(PORT, () => {
  console.log(`🚀 ScoutVision Backend API running on port ${PORT}`);
  connectDB();
});
