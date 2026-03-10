import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    icon: String,
    color: String,
    count: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);

