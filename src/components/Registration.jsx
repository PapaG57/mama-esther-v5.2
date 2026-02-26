import React, { useState } from "react";
import "./Registration.css";
import { useTranslation } from "react-i18next";
import { newsletterService } from "../api/services";

const Registration = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isHuman, setIsHuman] = useState(false);
  const [status, setStatus] = useState(null); // 'idle', 'sending', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isHuman) {
      setErrorMsg(t("registration.errorCheck"));
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      await newsletterService.subscribe(email);
      setStatus("success");
      setEmail("");
      setIsHuman(false);
    } catch (err) {
      setStatus("error");
      if (err.response?.status === 400) {
        setErrorMsg(t("registration.duplicateAlert"));
      } else {
        setErrorMsg(t("registration.error"));
      }
    }
  };

  return (
    <section className="registration-section">
      <div className="registration-container">
        <h3>{t("registration.title")}</h3>
        <p>{t("registration.subtitle")}</p>
        
        <form onSubmit={handleSubmit} className="registration-form">
          <input 
            type="email" 
            placeholder={t("registration.placeholder")} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <div className="human-check">
            <input 
              type="checkbox" 
              id="humanCheck" 
              checked={isHuman}
              onChange={(e) => setIsHuman(e.target.checked)}
            />
            <label htmlFor="humanCheck">{t("registration.humanCheck")}</label>
          </div>

          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? t("registration.sending") : t("registration.send")}
          </button>
        </form>

        {status === "success" && <p className="success-msg">{t("registration.success")}</p>}
        {status === "error" && <p className="error-msg">{errorMsg}</p>}
      </div>
    </section>
  );
};

export default Registration;
