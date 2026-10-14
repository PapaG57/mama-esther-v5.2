import axios from "axios";

/**
 * Service pour interroger l'API Pixabay (Photos et Vidéos)
 */
export const fetchPixabayMedia = async (query, type = "photo") => {
  const apiKey = import.meta.env.VITE_PIXABY_API_KEY;

  if (!apiKey) {
    console.error("Erreur : La clé VITE_PIXABY_API_KEY est introuvable dans le fichier .env");
    throw new Error("Clé API Pixabay manquante.");
  }

  // Pixabay possède deux endpoints différents pour les images et les vidéos
  const endpoint = type === "video" ? "https://pixabay.com/api/videos/" : "https://pixabay.com/api/";

  try {
    const response = await axios.get(endpoint, {
      params: {
        key: apiKey,
        q: encodeURIComponent(query),
        lang: "fr",
        per_page: 18, // Nombre de résultats souhaités
        safesearch: true,
      },
    });

    // Normalisation des résultats pour que le front s'y retrouve facilement
    const hits = response.data.hits || [];

    return hits.map((item) => {
      if (type === "video") {
        return {
          id: item.id,
          type: "video",
          // On récupère une URL de vidéo correcte (ex: format medium ou large)
          url: item.videos?.medium?.url || item.videos?.small?.url,
          preview: item.videos?.tiny?.thumbnail || "",
        };
      } else {
        return {
          id: item.id,
          type: "photo",
          url: item.largeImageURL || item.webformatURL,
          preview: item.webformatURL,
        };
      }
    });
  } catch (error) {
    console.error("Erreur lors de l'appel Pixabay :", error);
    throw new Error("Impossible de récupérer les médias Pixabay.");
  }
};
