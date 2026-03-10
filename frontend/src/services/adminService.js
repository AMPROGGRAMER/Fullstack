import api from "./api.js";

export const fetchAdminSummary = async () => {
  const { data } = await api.get("/admin/summary");
  return data;
};

export const fetchAdminUsers = async () => {
  const { data } = await api.get("/admin/users");
  return data;
};

export const fetchAdminProviders = async () => {
  const { data } = await api.get("/admin/providers");
  return data;
};

export const fetchAdminBookings = async () => {
  const { data } = await api.get("/admin/bookings");
  return data;
};

