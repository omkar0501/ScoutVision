import mongoose, { Schema, Document } from "mongoose";

export interface IMatch extends Document {
  title: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamColor: string;
  awayTeamColor: string;
  setScoreHome: number;
  setScoreAway: number;
  status: "Pending" | "Claimed" | "Completed";
  videoUrl?: string;
  scoutProgress?: number;
  tags?: any[];
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    title: { type: String, required: true },
    homeTeam: { type: String, required: true, default: "Home Team" },
    awayTeam: { type: String, required: true, default: "Away Team" },
    homeTeamColor: { type: String, default: "#0040ff" },
    awayTeamColor: { type: String, default: "#ff0000" },
    setScoreHome: { type: Number, default: 0 },
    setScoreAway: { type: Number, default: 0 },
    status: { type: String, enum: ["Pending", "Claimed", "Completed"], default: "Pending" },
    videoUrl: { type: String },
    scoutProgress: { type: Number, default: 0 },
    tags: { type: [Schema.Types.Mixed], default: [] }
  },
  { timestamps: true }
);

export const Match = mongoose.model<IMatch>("Match", MatchSchema);
