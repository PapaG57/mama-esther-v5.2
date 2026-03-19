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
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUnsubscribe = async () => {
    if (!email) {
      toast.warning(t("unsubscribe.alertEmail"));
      return;
    }

    setLoading(true);
    try {
      await newsletterService.unsubscribe(email);
      setIsUnsubscribed(true);
      toast.success(t("unsubscribe.successMessage"));
    } catch (error) {
      console.error(error);
      toast.error(t("unsubscribe.alertError"));
    } finally {
      setLoading(false);
    }
  };

  const handleReSubscribe = async () => {
    setLoading(true);
    try {
      // On utilise le service d'abonnement classique
      await newsletterService.subscribe({ email });
      setIsUnsubscribed(false);
      toast.success(t("registration.success"));
    } catch (error) {
      console.error(error);
      toast.error(t("registration.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      <section className="unsubscribe-v2">
        <div className="v2-container">
          <div className="unsubscribe-v2-card">
            <img
              src="/assets/covers/banner-news.webp"
              alt="Mama Esther"
              className="unsubscribe-v2-image"
            />

            {!isUnsubscribed ? (
              <>
                <h1>{t("unsubscribe.sadTitle")}</h1>
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
                    <button onClick={handleUnsubscribe} className="v2-btn v2-btn-red" disabled={loading}>
                      {loading ? t("registration.sending") : t("unsubscribe.buttonYes")}
                    </button>
                    <button onClick={() => navigate("/")} className="v2-btn v2-btn-outline-green">
                      {t("unsubscribe.buttonStay")}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="unsubscribe-success-content">
                <h1 style={{color: "var(--color-red)"}}>{t("unsubscribe.sadTitle")}</h1>
                <h2 style={{fontSize: "2rem", fontWeight: "700", marginBottom: "30px", color: "var(--color-dark)"}}>
                  {t("unsubscribe.successMessage")}
                </h2>
                
                <div style={{marginTop: "50px", padding: "30px", background: "#f9f9f9", borderRadius: "20px"}}>
                  <p style={{marginBottom: "20px", fontWeight: "600"}}>
                    {t("unsubscribe.changeMind")}
                  </p>
                  <div className="unsubscribe-v2-btns">
                    <button onClick={handleReSubscribe} className="v2-btn v2-btn-green" disabled={loading}>
                      {loading ? t("registration.sending") : t("unsubscribe.reSubscribe")}
                    </button>
                    <button onClick={() => navigate("/")} className="v2-btn v2-btn-outline-green">
                      {t("unsubscribe.backHome")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Unsubscribe;
