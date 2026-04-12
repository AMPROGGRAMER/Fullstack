import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
      index: true
    },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    serviceName: { type: String, required: true, trim: true },
    date: { type: Date, required: true, index: true },
    // store time separately for easier UI binding, even though date includes time
    time: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "confirmed", "completed", "cancelled"],
      default: "pending",
      index: true
    },
    amount: { type: Number, default: 0 },
    city: { type: String, trim: true },
    notes: { type: String, default: "" },
    address: { type: String, default: "" },
    coordinates: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid"
    },
    paymentProvider: { type: String, default: "razorpay" },
    razorpay: {
      orderId: { type: String, default: "" },
      paymentId: { type: String, default: "" },
      signature: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);

