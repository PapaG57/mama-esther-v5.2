// Fichier de configuration dynamique
(function() {
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  
  window.APP_CONFIG = {
    // Si on est en local, on tape sur le port 5000, sinon sur Render
    API_URL: isLocal 
      ? "http://localhost:5000/api" 
      : "https://mama-esther-backend.onrender.com/api"
  };

  console.log("🔧 Configuration API chargée :", window.APP_CONFIG.API_URL);
})();
