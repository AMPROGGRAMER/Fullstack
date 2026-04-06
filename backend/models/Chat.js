import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const chatSchema = new mongoose.Schema(
  {
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 2,
        message: "Chat must have exactly two participants"
      }
    },
    lastMessageAt: { type: Date, default: Date.now },
    messages: { type: [chatMessageSchema], default: [] }
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });
chatSchema.index({ lastMessageAt: -1 });

export default mongoose.model("Chat", chatSchema);
