import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
  connectDB();
});

const connectDB = async() => {
  try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("connected with database");
  } catch(err) {
    console.log(err);
  }
}


