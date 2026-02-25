import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/unsubscribe.css";
import { useTranslation } from "react-i18next";

export default function Unsubscribe() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fonction appelée lorsqu’on clique sur “Oui, je me désinscris”
  const handleUnsubscribe = async () => {
    if (!email) {
      alert(t("unsubscribe.alertEmail"));
      return;
    }

    try {
      // Requête vers le serveur Express (MAMA ESTHER BACKEND)
      const response = await fetch("http://localhost:5000/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Si le serveur répond avec succès
      if (response.ok) {
        setShowModal(true); // Affichage de la modale de confirmation
      } else {
        alert(t("unsubscribe.alertError"));
      }
    } catch (error) {
      console.error(error);
      alert(t("unsubscribe.alertFail"));
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/"); // Redirection vers la page d’accueil après fermeture
  };

  return (
    <section className="unsubscribe-section">
      <div className="unsubscribe-container">
        <img
          src="/assets/unsubscribe.png"
          alt="Mama Esther vous salue"
          className="unsubscribe-image"
        />

        <h1>{t("unsubscribe.title")}</h1>

        <p>
          {t("unsubscribe.subtitle")}
        </p>

        {/* Champ pour saisir l’email */}
        <label
          htmlFor="email-input"
          style={{ fontWeight: "bold", marginBottom: "8px" }}
        >
          {t("unsubscribe.emailLabel")}
        </label>
        <input
          id="email-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("unsubscribe.placeholder")}
          required
          className="unsubscribe-input"
        />

        {/* Boutons d’action */}
        <div className="unsubscribe-buttons">
          <button onClick={handleUnsubscribe} className="about-button">
            {t("unsubscribe.buttonYes")}
          </button>
          <button onClick={() => navigate("/")} className="about-button">
            {t("unsubscribe.buttonStay")}
          </button>
        </div>
      </div>

      {/* Modale de confirmation affichée après désinscription */}
      {showModal && (
        <div className="success-modal-overlay">
          <div className="success-modal-content">
            <img
              src="/assets/icons/check-green.png"
              alt="Succès"
              className="success-modal-icon"
            />
            <h2>{t("unsubscribe.successModal")}</h2>
            <button onClick={handleModalClose} className="success-modal-button">
              {t("unsubscribe.backHome")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
