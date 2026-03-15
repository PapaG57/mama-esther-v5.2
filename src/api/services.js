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
  getDonorsCount: () => apiClient.get("/donations/donors/count"),
};

export const newsletterService = {
  subscribe: (email) => apiClient.post("/subscribe", { email }),
  unsubscribe: (email) => apiClient.post("/unsubscribe", { email }),
  
  // Nouveaux services dynamiques
  getAll: () => apiClient.get("/newsletters"),
  getById: (id) => apiClient.get(`/newsletters/${id}`),
  create: (data) => apiClient.post("/newsletters", data),
  update: (id, data) => apiClient.put(`/newsletters/${id}`, data),
  delete: (id) => apiClient.delete(`/newsletters/${id}`),
  aiGenerate: (prompt, action) => apiClient.post("/newsletters/ai-generate", { prompt, action }),
  uploadPdf: (id, formData) => apiClient.post(`/newsletters/${id}/upload-pdf`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadImage: (formData) => apiClient.post("/upload-image", formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const contactService = {
  sendMessage: (data) => apiClient.post("/contact", data),
};
