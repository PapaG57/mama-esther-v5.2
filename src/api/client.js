import axios from "axios";

// URL de l'API moderne : Utilise d'abord la config externe (modifiable post-build), sinon l'env, sinon le fallback local
const API_BASE_URL = window.APP_CONFIG?.API_URL || import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // Augmenté à 60s pour laisser le temps à Render de se réveiller
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

    // Message lisible pour l'UI, adapté si le serveur ou la base sort de veille
    let msg = error.response?.data?.error;
    if (!msg) {
      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        msg = "Le serveur était en veille et met du temps à démarrer. Veuillez réinstaller votre connexion dans 10 secondes.";
      } else if (error.message === "Network Error") {
        msg = "Impossible de contacter le serveur (Serveur ou base de données en veille). Réessayez dans quelques secondes.";
      } else {
        msg = error.message || "Erreur réseau";
      }
    }

    const customError = {
      message: msg,
      status: error.response?.status,
      original: error
    };

    return Promise.reject(customError);
  }
);

export default apiClient;
