import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const walletTransactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true, min: 0 },
    reason: { type: String, default: "" },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user",
      index: true
    },
    phone: String,
    city: String,
    avatarUrl: String,
    favorites: { type: [mongoose.Schema.Types.ObjectId], ref: "Provider", default: [] },
    walletBalance: { type: Number, default: 0, min: 0 },
    walletTransactions: { type: [walletTransactionSchema], default: [] },
    resetPasswordToken: { type: String, default: null, index: true },
    resetPasswordExpires: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);

