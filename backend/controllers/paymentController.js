import crypto from "crypto";
import Razorpay from "razorpay";
import Booking from "../models/Booking.js";

const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys missing in env");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

// POST /api/payments/razorpay/order  { bookingId }
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (booking.paymentStatus === "paid") {
      return res.json({ message: "Already paid" });
    }

    const razorpay = getRazorpayClient();
    const amountPaise = Math.max(0, Math.round(Number(booking.amount || 0) * 100));
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `booking_${booking._id}`,
      notes: { bookingId: String(booking._id) }
    });

    booking.razorpay.orderId = order.id;
    await booking.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/payments/razorpay/verify
// { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    booking.paymentStatus = "paid";
    booking.razorpay.orderId = razorpay_order_id;
    booking.razorpay.paymentId = razorpay_payment_id;
    booking.razorpay.signature = razorpay_signature;
    // Once paid, auto-confirm booking
    if (booking.status === "pending") booking.status = "confirmed";
    await booking.save();

    res.json({ message: "Payment verified", booking });
  } catch (err) {
    next(err);
  }
};

