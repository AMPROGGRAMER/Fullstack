import api from "./api.js";

export const fetchProviders = async (params = {}) => {
  const { data } = await api.get("/providers", { params });
  return data;
};

export const fetchProviderById = async (id) => {
  const { data } = await api.get(`/providers/${id}`);
  return data;
};

