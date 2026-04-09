import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

app.get("/test", (req, res) => res.json({ message: "server works" }));
app.use((req, res) => {
    console.log("❌ Route not found:", req.method, req.url);
    res.status(404).json({ error: "Route not found" });
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected with database");

    // ✅ Use Render's PORT or fallback to 5000 locally
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.log("❌ Database connection failed:", err);
  }
};

connectDB();


