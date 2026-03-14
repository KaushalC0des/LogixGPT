import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes); 
app.use("/api/auth", authRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected with database");

    app.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000");
    });

  } catch (err) {
    console.log("❌ Database connection failed:", err);
  }
};

connectDB();


