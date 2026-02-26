import React, { useState } from "react";
import "../styles/components/Registration.css";
import { useTranslation } from "react-i18next";
import { newsletterService } from "../api/services";
import { toast } from "react-toastify";

const Registration = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isHuman, setIsHuman] = useState(false);
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isHuman) {
      toast.warning(t("registration.errorCheck"));
      return;
    }

    setStatus("sending");
    try {
      await newsletterService.subscribe(email);
      toast.success(t("registration.success"));
      setEmail("");
      setIsHuman(false);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      if (err.response?.status === 409) {
        toast.info(t("registration.duplicateAlert"));
      } else {
        toast.error(t("registration.error"));
      }
    }
  };

  return (
    <section className="registration-section">
      <div className="registration-container v2-container">
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

          <button type="submit" className="v2-btn v2-btn-primary" disabled={status === "sending"}>
            {status === "sending" ? t("registration.sending") : t("registration.send")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Registration;
