import api from "./api.js";

export const createBooking = async (payload) => {
  const { data } = await api.post("/bookings", payload);
  return data;
};

export const fetchMyBookings = async () => {
  const { data } = await api.get("/bookings/my");
  return data;
};

