import React, { useState, useEffect } from "react";
import "../styles/NewsletterV2.css";
import { useTranslation } from "react-i18next";
import { newsletterService } from "../api/services";
import { newsletters as staticNewsletters } from "../data/newsletters";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import HandSpinner from "../components/HandSpinner";

import NewsletterGallery from "../components/NewsletterGallery";

const NewsletterV2 = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await newsletterService.subscribe(email);
      toast.success(t("registration.success"));
      setEmail("");
    } catch (error) {
      toast.error(t("registration.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="v2-newsletter">
      <div className="v2-container">
        <div className="v2-newsletter-flex">
          
          <div className="v2-newsletter-text">
            <span className="v2-subtitle">{t("actuality.pdfTitle")}</span>
            <h2 className="v2-title">{t("v2.actuality.subscribeTitle")}</h2>
            <p>{t("v2.actuality.subscribeText")}</p>
            
            <form className="v2-subscribe-form" onSubmit={handleSubscribe}>
              <FontAwesomeIcon icon={faEnvelope} className="v2-form-icon" style={{margin: 'auto 0 auto 20px', color: '#ccc'}} />
              <input 
                type="email" 
                placeholder={t("v2.actuality.emailPlaceholder")} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={isSubmitting} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {isSubmitting ? <HandSpinner /> : t("v2.btns.subscribe")}
              </button>
            </form>
          </div>

          <div className="v2-newsletter-right-side">
            <NewsletterGallery />
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsletterV2;
