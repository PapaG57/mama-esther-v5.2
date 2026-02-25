import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faHandPointLeft } from "@fortawesome/free-solid-svg-icons";
import CamerounButton from "../components/CamerounButton";
import "../styles/404.css";
import { useTranslation } from "react-i18next";

export default function Page404() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <main className="page404">
      <section className="page404-hero">
        <img
          src="/assets/404-illustration.png"
          alt="Illustration Mama Esther"
          className="page404-banner"
        />
        <h1 className="page404-title">{t("error404.title")}</h1>
        <p className="page404-subtitle">
          {t("error404.subtitle")}
        </p>
        <div className="page404-button-group">
          <CamerounButton onClick={() => navigate(-1)} className="about-button">
            <FontAwesomeIcon
              icon={faHandPointLeft}
              style={{ marginRight: "8px" }}
            />
            {t("error404.back")}
          </CamerounButton>

          <CamerounButton to="/contact#contact-form" className="about-button">
            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: "8px" }} />
            {t("error404.contact")}
          </CamerounButton>
        </div>
      </section>
    </main>
  );
}
