import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign(
    { userId: newUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
    );

    res.json({ message: "User created successfully", token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Signup failed" });
  }
});


// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login failed" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        // ✅ Only send what you need
        res.json({ name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ message: "Failed to get user" });
    }
});

export default router;