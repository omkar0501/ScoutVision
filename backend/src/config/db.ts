import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/scoutvision";

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1500, // Quick timeout for seamless local & container startup
    });
    console.log(`🍃 MongoDB Connected successfully to ${mongoUri}`);
  } catch (error) {
    console.warn("⚠️ MongoDB not connected yet. Running with in-memory fallback mode.");
  }
};
