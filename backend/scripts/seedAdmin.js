import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const required = ["MONGO_URI", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
for (const k of required) {
  if (!process.env[k]) {
    console.error(`Missing env var: ${k}`);
    process.exit(1);
  }
}

await mongoose.connect(process.env.MONGO_URI);

const email = String(process.env.ADMIN_EMAIL).toLowerCase().trim();
const name = process.env.ADMIN_NAME || "Admin";
const password = process.env.ADMIN_PASSWORD;

const existing = await User.findOne({ email });
if (existing) {
  existing.role = "admin";
  if (process.env.RESET_ADMIN_PASSWORD === "true") {
    existing.password = password;
  }
  existing.name = name;
  await existing.save();
  console.log("Admin updated:", existing.email);
} else {
  await User.create({ name, email, password, role: "admin" });
  console.log("Admin created:", email);
}

await mongoose.disconnect();

