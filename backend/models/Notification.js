import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["booking_status"],
      required: true
    },
    message: { type: String, required: true },
    meta: { type: Object, default: {} },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ type: 1, "meta.bookingId": 1, "meta.status": 1, user: 1 });

export default mongoose.model("Notification", notificationSchema);
