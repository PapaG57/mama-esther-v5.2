import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/unsubscribe.css";
import { useTranslation } from "react-i18next";
import { newsletterService } from "../api/services";
import { toast } from "react-toastify";

export default function Unsubscribe() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fonction appelée lorsqu’on clique sur “Oui, je me désinscris”
  const handleUnsubscribe = async () => {
    if (!email) {
      toast.warning(t("unsubscribe.alertEmail"));
      return;
    }

    try {
      await newsletterService.unsubscribe(email);
      setShowModal(true); // Affichage de la modale de confirmation
      toast.info(t("unsubscribe.successModal"));
    } catch (error) {
      console.error(error);
      toast.error(t("unsubscribe.alertError"));
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/"); // Redirection vers la page d’accueil après fermeture
  };

  return (
    <section className="unsubscribe-section v2-layout">
      <div className="unsubscribe-container v2-container">
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
          <button onClick={handleUnsubscribe} className="v2-btn v2-btn-primary">
            {t("unsubscribe.buttonYes")}
          </button>
          <button onClick={() => navigate("/")} className="v2-btn v2-btn-outline">
            {t("unsubscribe.buttonStay")}
          </button>
        </div>
      </div>

      {/* Modale de confirmation affichée après désinscription */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <img
              src="/assets/icons/check-green.png"
              alt="Succès"
              style={{ width: '60px', marginBottom: '20px' }}
            />
            <h2>{t("unsubscribe.successModal")}</h2>
            <button onClick={handleModalClose} className="v2-btn v2-btn-primary">
              {t("unsubscribe.backHome")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
