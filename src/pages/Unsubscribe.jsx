import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UnsubscribeV2.css";
import { useTranslation } from "react-i18next";
import { newsletterService } from "../api/services";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const Unsubscribe = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleUnsubscribe = async () => {
    if (!email) {
      toast.warning(t("unsubscribe.alertEmail"));
      return;
    }

    try {
      await newsletterService.unsubscribe(email);
      setShowModal(true);
      toast.success(t("unsubscribe.successModal"));
    } catch (error) {
      console.error(error);
      toast.error(t("unsubscribe.alertError"));
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      <section className="unsubscribe-v2">
        <div className="v2-container">
          <div className="unsubscribe-v2-card">
            <img
              src="/assets/unsubscribe.webp"
              alt="Mama Esther"
              className="unsubscribe-v2-image"
            />

            <h1>{t("unsubscribe.title")}</h1>

            <p>{t("unsubscribe.subtitle")}</p>

            <div className="unsubscribe-v2-form">
              <label htmlFor="email-input" className="unsubscribe-v2-label">
                {t("unsubscribe.emailLabel")}
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("unsubscribe.placeholder")}
                required
                className="unsubscribe-v2-input"
              />

              <div className="unsubscribe-v2-btns">
                <button onClick={handleUnsubscribe} className="v2-btn v2-btn-red">
                  {t("unsubscribe.buttonYes")}
                </button>
                <button onClick={() => navigate("/")} className="v2-btn v2-btn-outline-green">
                  {t("unsubscribe.buttonStay")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="v2-modal-overlay">
          <div className="v2-modal">
            <img
              src="/assets/icons/check-green.webp"
              alt="Succès"
              style={{ width: '80px', marginBottom: '30px' }}
            />
            <h2 style={{fontSize: "2rem", fontWeight: "900", marginBottom: "20px"}}>{t("unsubscribe.successModal")}</h2>
            <button onClick={handleModalClose} className="v2-btn v2-btn-primary">
              {t("unsubscribe.backHome")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Unsubscribe;
