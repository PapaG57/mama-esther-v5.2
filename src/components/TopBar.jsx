import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneVolume, faAt } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faWhatsapp,
  faLinkedin,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";
import "../components/topbar.css";

export default function TopBar() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "fr" ? "en" : "fr";
    i18n.changeLanguage(newLang);
  };

  const isFrench = i18n.language === "fr";

  return (
    <div className="top-bar py-2">
      <div className="top-bar-container">
        <div className="contact-info">
          <FontAwesomeIcon icon={faPhoneVolume} className="phone-icon" />
          <span className="phone-text">+33 6 86 74 29 11</span>

          <FontAwesomeIcon icon={faPhoneVolume} className="phone-icon" />
          <span className="phone-text">+33 6 45 65 65 17</span>

          <FontAwesomeIcon icon={faAt} />
          <span>contact@mamaesther.org</span>
        </div>

        <div className="social-icons">

          {/* Bascule FR ↔ EN */}
          <img
            src={isFrench ? "/assets/flags/GB.svg" : "/assets/flags/FR.svg"}
            alt={isFrench ? t("topbar.englishVersion") : t("topbar.frenchVersion")}
            title={isFrench ? t("topbar.englishVersion") : t("topbar.frenchVersion")}
            className="flag-icon me-2"
            onClick={toggleLanguage}
            style={{ cursor: "pointer" }}
          />

          <FontAwesomeIcon icon={faFacebookF} className="social-icon me-2" />
          <FontAwesomeIcon icon={faWhatsapp} className="social-icon me-2" />
          <FontAwesomeIcon icon={faLinkedin} className="social-icon me-2" />
          <FontAwesomeIcon icon={faInstagram} className="social-icon me-2" />
          <FontAwesomeIcon icon={faYoutube} className="social-icon" />
        </div>
      </div>
    </div>
  );
}