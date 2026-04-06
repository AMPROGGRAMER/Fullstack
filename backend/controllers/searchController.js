import Provider from "../models/Provider.js";

// GET /api/search/providers?name=&location=&category=
export const searchProviders = async (req, res, next) => {
  try {
    const { name, location, category } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    if (location) {
      // match either city or location field
      filter.$or = [
        { city: { $regex: location, $options: "i" } },
        { location: { $regex: location, $options: "i" } }
      ];
    }
    if (category) {
      filter.category = category;
    }

    // Only show approved & available providers in search
    filter.approved = true;
    filter.available = true;

    const providers = await Provider.find(filter).sort({ rating: -1 }).limit(200);
    res.json(providers);
  } catch (err) {
    next(err);
  }
};

