import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    priceType: { type: String, enum: ["fixed", "hourly", "starting"], default: "fixed" },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    images: { type: [String], default: [] },
    duration: { type: String, default: "" },
    requirements: { type: [String], default: [] },
    features: { type: [String], default: [] },
    whatsIncluded: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1, price: 1, active: 1 });
serviceSchema.index({ provider: 1, active: 1 });

export default mongoose.model("Service", serviceSchema);
