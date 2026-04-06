import Provider from "../models/Provider.js";
import User from "../models/User.js";

export const updateMyProfile = async (req, res, next) => {
  try {
    const allowed = ["name", "phone", "city", "avatarUrl"]; // keep it minimal
    const updates = {};
    for (const k of allowed) {
      if (typeof req.body[k] !== "undefined") updates[k] = req.body[k];
    }

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true }).select(
      "-password"
    );
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const getMyFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user?.favorites || []);
  } catch (err) {
    next(err);
  }
};

export const toggleFavoriteProvider = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    const user = await User.findById(req.user._id);
    const exists = user.favorites.some((id) => String(id) === String(provider._id));

    if (exists) {
      user.favorites = user.favorites.filter((id) => String(id) !== String(provider._id));
    } else {
      user.favorites.push(provider._id);
    }

    await user.save();
    const populated = await User.findById(req.user._id).populate("favorites");
    res.json({ favorites: populated?.favorites || [] });
  } catch (err) {
    next(err);
  }
};

export const getMyWallet = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("walletBalance walletTransactions");
    res.json({ walletBalance: user.walletBalance, walletTransactions: user.walletTransactions });
  } catch (err) {
    next(err);
  }
};

export const uploadAvatarController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Construct the URL for the uploaded file
    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`;

    // Update user with new avatar URL
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatarUrl } },
      { new: true }
    ).select("-password");

    res.json({ avatarUrl, user });
  } catch (err) {
    next(err);
  }
};

export const addWalletFunds = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount || 0);
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(req.user._id);
    user.walletBalance = Number(user.walletBalance || 0) + amount;
    user.walletTransactions.unshift({ type: "credit", amount, reason: "Wallet top-up" });
    await user.save();

    res.json({ walletBalance: user.walletBalance, walletTransactions: user.walletTransactions });
  } catch (err) {
    next(err);
  }
};
