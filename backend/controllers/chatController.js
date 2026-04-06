import Chat from "../models/Chat.js";
import User from "../models/User.js";

const normalizePair = (a, b) => {
  const s1 = String(a);
  const s2 = String(b);
  return s1 < s2 ? [s1, s2] : [s2, s1];
};

export const getMyThreads = async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.user._id }).sort({ lastMessageAt: -1 }).limit(200);

    const otherIds = chats.map((c) => c.participants.find((p) => String(p) !== String(req.user._id)));
    const others = await User.find({ _id: { $in: otherIds } }).select("name email role");
    const byId = new Map(others.map((u) => [String(u._id), u]));

    // Filter out chats where the other user has been deleted
    const validChats = chats.filter((c) => {
      const other = c.participants.find((p) => String(p) !== String(req.user._id));
      return byId.has(String(other));
    });

    res.json(
      validChats.map((c) => {
        const other = c.participants.find((p) => String(p) !== String(req.user._id));
        const last = c.messages?.[c.messages.length - 1];
        return {
          _id: c._id,
          otherUser: byId.get(String(other)),
          lastMessage: last ? { text: last.text, createdAt: last.createdAt } : null,
          lastMessageAt: c.lastMessageAt
        };
      })
    );
  } catch (err) {
    next(err);
  }
};

export const getOrCreateThread = async (req, res, next) => {
  try {
    const { otherUserId } = req.params;
    if (String(otherUserId) === String(req.user._id)) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const otherUser = await User.findById(otherUserId).select("name email role");
    if (!otherUser) return res.status(404).json({ message: "User not found" });

    const [p1, p2] = normalizePair(req.user._id, otherUser._id);

    let chat = await Chat.findOne({ participants: { $all: [p1, p2] } });
    if (!chat) {
      chat = await Chat.create({ participants: [p1, p2], messages: [], lastMessageAt: new Date() });
    }

    res.json({ _id: chat._id, otherUser });
  } catch (err) {
    next(err);
  }
};

export const getThreadMessages = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    const isParticipant = chat.participants.some((p) => String(p) === String(req.user._id));
    if (!isParticipant) return res.status(403).json({ message: "Forbidden" });

    res.json(chat.messages || []);
  } catch (err) {
    next(err);
  }
};
