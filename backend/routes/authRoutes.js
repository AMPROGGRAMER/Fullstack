import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Provider from "../models/Provider.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

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

export default router;

