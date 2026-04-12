import mongoose from "mongoose";

const availabilitySlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      required: true
    },
    from: { type: String, default: "" },
    to: { type: String, default: "" },
    enabled: { type: Boolean, default: true }
  },
  { _id: false }
);

const providerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    phone: { type: String, trim: true },
    experience: { type: Number, default: 0 },
    price: { type: Number },
    city: { type: String, trim: true, index: true },
    location: { type: String, trim: true },
    avatarUrl: { type: String, default: "" },
    emoji: { type: String, default: "🔧" },
    priceFrom: { type: Number, default: 499 },
    priceUnit: { type: String, default: "visit" },
    tags: { type: [String], default: [] },
    bio: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    available: { type: Boolean, default: true, index: true },
    approved: { type: Boolean, default: false, index: true },
    availability: { type: [availabilitySlotSchema], default: [] },
    portfolioImages: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Provider", providerSchema);

