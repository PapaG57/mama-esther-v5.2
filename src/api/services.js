import apiClient from "./client";

export const adminService = {
  login: (credentials) => apiClient.post("/admin/login", credentials),
  register: (data) => apiClient.post("/admin/register", data),
  getDons: () => apiClient.get("/admin/dons"),
  deleteDon: (id) => apiClient.delete(`/admin/dons/${id}`),
  addManualDonation: (data) => apiClient.post("/donations/manual", data),
};

export const donationService = {
  getCount: () => apiClient.get("/donations/count"),
  getAnnual: () => apiClient.get("/donations/annee"),
  getMonthly: () => apiClient.get("/donations/mois"),
};

export const newsletterService = {
  subscribe: (email) => apiClient.post("/subscribe", { email }),
  unsubscribe: (email) => apiClient.post("/unsubscribe", { email }),
};

export const contactService = {
  sendMessage: (data) => apiClient.post("/contact", data),
};
