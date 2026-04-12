import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Provider from "../models/Provider.js";
import { protect } from "../middleware/authMiddleware.js";
import { sendPasswordResetEmail, sendWelcomeEmail } from "../utils/emailService.js";

const router = express.Router();

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Generate random reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    // Prevent self-registering as admin
    const safeRole = role === "provider" ? "provider" : "user";

    const user = await User.create({ name, email, password, role: safeRole });
    
    // If registering as provider, create a Provider profile
    if (safeRole === "provider") {
      await Provider.create({
        user: user._id,
        name: name,
        category: "general",
        status: "pending"
      });
    }
    
    const token = generateToken(user._id, user.role);
    
    // Send welcome email (async, don't block response)
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const ok = user ? await user.matchPassword(password) : false;
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", protect, async (req, res) => {
  res.json({ user: req.user });
});

// Setup endpoint to create admin account (one-time use)
router.post("/setup-admin", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists. Cannot create another." });
    }
    
    const admin = await User.create({
      name: name || "Admin",
      email,
      password,
      role: "admin"
    });
    
    res.json({
      message: "Admin created successfully",
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (err) {
    next(err);
  }
});

// Forgot password - send reset email
router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Don't reveal if email exists or not (security)
    if (!user) {
      return res.json({ message: "If an account exists, a reset email has been sent" });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // Send email
    await sendPasswordResetEmail(user.email, resetToken, user.name);

    res.json({ message: "If an account exists, a reset email has been sent" });
  } catch (err) {
    next(err);
  }
});

// Reset password with token
router.post("/reset-password", async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
});

export default router;

