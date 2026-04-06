import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// POST /api/bookings - create a new booking for the logged-in user
export const createBooking = async (req, res, next) => {
  try {
    const { providerId, serviceId, serviceName, date, time, amount, city, notes, address, coordinates } =
      req.body;

    console.log("Creating booking with coordinates:", coordinates);

    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    const bookingDate = date ? new Date(date) : new Date();

    const amt = Number(amount || 0);
    const user = await User.findById(req.user._id);

    let paymentStatus = "unpaid";
    if (amt > 0 && Number(user.walletBalance || 0) >= amt) {
      user.walletBalance = Number(user.walletBalance || 0) - amt;
      user.walletTransactions.unshift({
        type: "debit",
        amount: amt,
        reason: "Booking payment"
      });
      await user.save();
      paymentStatus = "paid";
    }

    const booking = await Booking.create({
      user: req.user._id,
      provider: provider._id,
      service: serviceId || undefined,
      serviceName: serviceName || provider.category || "Service",
      date: bookingDate,
      time: time || "",
      amount: amt,
      city,
      notes,
      address: address || "",
      coordinates: coordinates || { lat: null, lng: null },
      paymentStatus
    });

    // Notify provider about new booking request (booking-only notification)
    const providerUserId = provider.user;
    if (providerUserId) {
      const exists = await Notification.findOne({
        user: providerUserId,
        type: "booking_status",
        "meta.bookingId": String(booking._id),
        "meta.status": "pending"
      });

      if (!exists) {
        const n = await Notification.create({
          user: providerUserId,
          type: "booking_status",
          message: `New booking request for ${booking.serviceName}`,
          meta: { bookingId: String(booking._id), status: "pending", role: "provider" },
          read: false
        });

        const io = req.app.get("io");
        io?.to(`user:${String(providerUserId)}`).emit("notification:new", n);
      }
    }

    // Emit booking created to customer
    const io = req.app.get("io");
    io?.to(`user:${String(req.user._id)}`).emit("booking:created", booking);

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/my - all bookings for logged-in user (customer)
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("provider", "name category city location priceFrom priceUnit emoji")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/provider - bookings for the logged-in provider
export const getProviderBookings = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });

    const bookings = await Booking.find({ provider: provider._id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/bookings/:id/status - provider accepts/rejects a booking
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "accepted", "rejected", "confirmed", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });

    const existing = await Booking.findOne({ _id: req.params.id, provider: provider._id });
    if (!existing) return res.status(404).json({ message: "Booking not found" });

    // Hybrid payment rule: provider cannot confirm unpaid bookings (but can accept)
    if (status === "confirmed" && existing.paymentStatus !== "paid") {
      return res.status(400).json({ message: "Payment required before confirmation" });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, provider: provider._id },
      { status },
      { new: true }
    );

    // Update provider stats on completion
    if (existing.status !== "completed" && status === "completed") {
      provider.completedJobs = Number(provider.completedJobs || 0) + 1;
      provider.earnings = Number(provider.earnings || 0) + Number(existing.amount || 0);
      await provider.save();
    }

    // Booking-only notification to customer on status change (deduped)
    const existsNotif = await Notification.findOne({
      user: booking.user,
      type: "booking_status",
      "meta.bookingId": String(booking._id),
      "meta.status": status
    });

    if (!existsNotif) {
      const n = await Notification.create({
        user: booking.user,
        type: "booking_status",
        message: `Your booking is now ${status}`,
        meta: { bookingId: String(booking._id), status },
        read: false
      });

      const io = req.app.get("io");
      io?.to(`user:${String(booking.user)}`).emit("notification:new", n);
    }

    // Emit booking update to both parties
    const io = req.app.get("io");
    io?.to(`user:${String(booking.user)}`).emit("booking:updated", booking);
    io?.to(`user:${String(provider.user)}`).emit("booking:updated", booking);

    res.json(booking);
  } catch (err) {
    next(err);
  }
};

// POST /api/bookings/:id/pay/wallet - user pays an existing booking using wallet balance
export const payBookingWithWallet = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (booking.paymentStatus === "paid") {
      return res.json({ message: "Already paid", booking });
    }

    const amt = Number(booking.amount || 0);
    const user = await User.findById(req.user._id);
    if (amt > 0 && Number(user.walletBalance || 0) < amt) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    if (amt > 0) {
      user.walletBalance = Number(user.walletBalance || 0) - amt;
      user.walletTransactions.unshift({
        type: "debit",
        amount: amt,
        reason: "Booking payment",
        booking: booking._id
      });
      await user.save();
    }

    booking.paymentStatus = "paid";
    await booking.save();

    // Notify provider that booking is paid (booking-only, deduped)
    const provider = await Provider.findById(booking.provider);
    const providerUserId = provider?.user;
    if (providerUserId) {
      const exists = await Notification.findOne({
        user: providerUserId,
        type: "booking_status",
        "meta.bookingId": String(booking._id),
        "meta.status": "paid"
      });

      if (!exists) {
        const n = await Notification.create({
          user: providerUserId,
          type: "booking_status",
          message: `Booking payment received for ${booking.serviceName}`,
          meta: { bookingId: String(booking._id), status: "paid", role: "provider" },
          read: false
        });
        const io = req.app.get("io");
        io?.to(`user:${String(providerUserId)}`).emit("notification:new", n);
      }
    }

    const io = req.app.get("io");
    io?.to(`user:${String(req.user._id)}`).emit("booking:updated", booking);
    if (providerUserId) io?.to(`user:${String(providerUserId)}`).emit("booking:updated", booking);

    res.json({ message: "Paid via wallet", booking });
  } catch (err) {
    next(err);
  }
};

