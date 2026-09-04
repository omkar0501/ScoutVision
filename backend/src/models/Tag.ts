import mongoose, { Schema, Document } from "mongoose";

export interface ITag extends Document {
  matchId?: string;
  team: "home" | "away";
  title: string;
  startTime: number;
  endTime: number;
  lineIndex: number;
  server?: string;
  receiver?: string;
  serveRating?: number;
  attacker?: string;
  vector?: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
  deflected?: boolean;
  createdAt: Date;
}

const TagSchema = new Schema<ITag>(
  {
    matchId: { type: String },
    team: { type: String, enum: ["home", "away"], required: true },
    title: { type: String, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    lineIndex: { type: Number, default: 0 },
    server: { type: String },
    receiver: { type: String },
    serveRating: { type: Number },
    attacker: { type: String },
    vector: {
      startX: Number,
      startY: Number,
      endX: Number,
      endY: Number
    },
    deflected: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Tag = mongoose.model<ITag>("Tag", TagSchema);
