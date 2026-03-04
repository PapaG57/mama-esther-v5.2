import axios from "axios";

// URL de l'API moderne : Utilise une variable d'environnement ou le fallback local
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Sécurité : on évite les requêtes qui tournent à l'infini
});

// 1. INTERCEPTEUR DE REQUÊTE : On injecte le jeton s'il existe
apiClient.interceptors.request.use((config) => {
  // Utilisation de sessionStorage pour une sécurité moderne et volatile
  const token = sessionStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. INTERCEPTEUR DE RÉPONSE : Gestion centralisée des erreurs (401, 500, etc.)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si l'erreur est un 401 (Jeton expiré ou invalide)
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("adminToken");
      // Si on n'est pas déjà sur l'accueil, on y renvoie pour forcer la reconnexion
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }

    // On transforme l'erreur brute en quelque chose de plus lisible pour l'UI
    const customError = {
      message: error.response?.data?.error || error.message || "Erreur réseau",
      status: error.response?.status,
      original: error
    };

    return Promise.reject(customError);
  }
);

export default apiClient;
