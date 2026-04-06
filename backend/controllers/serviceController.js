import Provider from "../models/Provider.js";
import Service from "../models/Service.js";

// Helper to get provider ID from user
const getProviderId = async (userId) => {
  const provider = await Provider.findOne({ user: userId });
  return provider?._id;
};

export const getPublicServices = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, providerId, active } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (providerId) filter.provider = providerId;

    if (active === "false") filter.active = false;
    else filter.active = true;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const services = await Service.find(filter)
      .populate("provider", "name category city location rating ratingCount approved available")
      .sort({ createdAt: -1 })
      .limit(300);

    res.json(services);
  } catch (err) {
    next(err);
  }
};

export const getProviderServices = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });

    const services = await Service.find({ provider: provider._id }).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
};

export const createService = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });

    const { title, category, price, priceType, description, shortDescription, images, duration, requirements, features, whatsIncluded, tags, active } = req.body;

    const service = await Service.create({
      provider: provider._id,
      title,
      category,
      price,
      priceType: priceType || "fixed",
      description: description || "",
      shortDescription: shortDescription || "",
      images: Array.isArray(images) ? images : [],
      duration: duration || "",
      requirements: Array.isArray(requirements) ? requirements : [],
      features: Array.isArray(features) ? features : [],
      whatsIncluded: Array.isArray(whatsIncluded) ? whatsIncluded : [],
      tags: Array.isArray(tags) ? tags : [],
      active: active !== false
    });

    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });

    const service = await Service.findOne({ _id: req.params.id, provider: provider._id });
    if (!service) return res.status(404).json({ message: "Service not found" });

    Object.assign(service, req.body);
    const updated = await service.save();

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });

    const service = await Service.findOne({ _id: req.params.id, provider: provider._id });
    if (!service) return res.status(404).json({ message: "Service not found" });

    await service.deleteOne();
    res.json({ message: "Service deleted" });
  } catch (err) {
    next(err);
  }
};

// Admin: Delete any service
export const deleteServiceAdmin = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    await service.deleteOne();
    res.json({ message: "Service deleted by admin" });
  } catch (err) {
    next(err);
  }
};
