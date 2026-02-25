import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Registration.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser } from "@fortawesome/free-solid-svg-icons";
import confetti from "canvas-confetti"; // Ajout confetti
import HandSpinner from "../components/HandSpinner"; // Import du spinner
import { useTranslation } from "react-i18next";

export default function Registration({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // 'success', 'error', 'duplicate'
  const [closing, setClosing] = useState(false);
  const [isHuman, setIsHuman] = useState(false); // checkbox
  const [showEmojiAlert, setShowEmojiAlert] = useState(false); // alerte emoji
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false); // alerte duplication
  const [sending, setSending] = useState(false); // Ajout loading spinner

  const clearEmail = () => {
    setEmail(""); // efface le champ email
    setIsHuman(false); // décocher la case automatiquement
    setShowDuplicateAlert(false); // cache l’alerte duplication
    setShowEmojiAlert(false); // désactive l’alerte emoji (si active)
  };

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setStatus(null);
      setIsHuman(false);
      setShowEmojiAlert(false);
      setShowDuplicateAlert(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isHuman) {
      setShowEmojiAlert(true);
      return;
    }

    setSending(true); // Active le spinner

    try {
      const res = await axios.post("http://localhost:5000/api/subscribe", {
        email,
      });

      if (res.status === 201) {
        setStatus("success");
        setEmail("");
        setIsHuman(false);
        setShowEmojiAlert(false);
        setShowDuplicateAlert(false);
        confetti({
          // Lancement de l'effet feu d'artifice
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setStatus("duplicate");
        setShowDuplicateAlert(true);
      } else {
        setStatus("error");
      }
    } finally {
      setSending(false); // Désactive le spinner
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 300);
  };

  return (
    <div className="registration-overlay">
      <div
        className={`registration-content ${closing ? "fade-out" : "fade-in"}`}
      >
        <button className="registration-close" onClick={handleClose}>
          &times;
        </button>
        <h2>{t("registration.title")}</h2>
        <p>{t("registration.subtitle")}</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={t("registration.placeholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setShowDuplicateAlert(false); // cache l’alerte si on modifie
            }}
            required
          />
          {/* Champ honeypot anti-bot (invisible pour les humains) */}
          <input
            type="text"
            name="extraField"
            style={{ display: "none" }}
            autoComplete="off"
          />
          {/* Ajout de la checkbox sécurité */}
          <div>
            <div className="checkbox-wrapper">
              <label>
                <input
                  type="checkbox"
                  checked={isHuman}
                  onChange={(e) => {
                    setIsHuman(e.target.checked);
                    if (e.target.checked) {
                      setShowEmojiAlert(false); // Masque l’alerte si la case est cochée
                    }
                  }}
                  className={showEmojiAlert ? "shake-checkbox" : ""}
                />
                <span>{t("registration.humanCheck")}</span>
              </label>
            </div>
          </div>
          {/* Animation d’alerte si la case n'est pas cochée */}
          {showEmojiAlert && (
            <div className="emoji-alert">
              🙈{" "}
              <span>{t("registration.errorCheck")}</span>
            </div>
          )}
          {/* Alerte duplication d’adresse avec bouton "Effacer" */}
          {showDuplicateAlert && (
            <div className="emoji-alert">
              📨{" "}
              <span>
                {t("registration.duplicateAlert")}
              </span>
              <button className="btn-clear-email" onClick={clearEmail}>
                <FontAwesomeIcon icon={faEraser} /> {t("registration.clearButton")}
              </button>
            </div>
          )}

          {/* Bouton d’envoi + main impatiente */}
          <div style={{ position: "relative" }}>
            <button
              type="submit"
              className="contact-send-button"
              disabled={sending}
            >
              {sending ? (
                <div className="loading-content">
                  <span>{t("registration.sending")}</span>
                  <HandSpinner />
                </div>
              ) : (
                t("registration.send")
              )}
            </button>
          </div>
        </form>

        {status === "success" && (
          <>
            {/* Animation de feux d'artifice */}
            <div id="confetti-target"></div>
            <p className="form-feedback success">{t("registration.success")}</p>
          </>
        )}
        {status === "error" && (
          <p className="form-feedback error">{t("registration.error")}</p>
        )}

        <button className="btn-fermer" onClick={handleClose}>
          {t("registration.close")}
        </button>
      </div>
    </div>
  );
}
