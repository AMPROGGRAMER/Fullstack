import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    location: { type: String, trim: true },
    emoji: { type: String, default: "🔧" },
    priceFrom: { type: Number, default: 499 },
    priceUnit: { type: String, default: "visit" },
    tags: { type: [String], default: [] },
    bio: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    available: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Provider", providerSchema);

