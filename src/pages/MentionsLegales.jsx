import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import CamerounButton from "../components/CamerounButton";
import "../styles/mentions.css";
import { useTranslation } from "react-i18next";

export default function MentionsLegales() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <main className="mentions">
      <section className="mentions-container">
        <div className="mentions-header">
          <img
            src="/assets/mentions/logo-mama.png"
            alt="Logo Mama Esther"
            className="mentions-logo"
          />

          <img
            src="/assets/mentions/president-mama.png"
            alt="Photo de la Présidente"
            className="mentions-president"
          />
        </div>
        <h1 className="mentions-title">{t("mentions.title")}</h1>
        <h2 className="mentions-date">{t("mentions.date")}</h2>

        <h3 className="mentions-section-title">{t("mentions.edition.title")}</h3>
        <p>
          {t("mentions.edition.text")}
        </p>

        <h3 className="mentions-section-title">{t("mentions.host.title")}</h3>
        <p>
          {t("mentions.host.text")}
        </p>

        <h3 className="mentions-section-title">{t("mentions.access.title")}</h3>
        <p>
          {t("mentions.access.text")}
        </p>

        <h3 className="mentions-section-title">
          {t("mentions.property.title")}
        </h3>
        <p>
          {t("mentions.property.text")}
        </p>

        <h3 className="mentions-section-title">{t("mentions.cookies.title")}</h3>
        <p>
          {t("mentions.cookies.text")}
        </p>

        <h3 className="mentions-section-title">
          {t("mentions.contact.title")}
        </h3>
        <p>
          {t("mentions.contact.text")}
        </p>

        <h3 className="mentions-section-title">{t("mentions.newsletter.title")}</h3>
        <p>
          {t("mentions.newsletter.text")}
        </p>

        <h3 className="mentions-section-title">{t("mentions.links.title")}</h3>
        <p>
          {t("mentions.links.text")}
        </p>

        <h3 className="mentions-section-title">{t("mentions.rss.title")}</h3>
        <p>
          {t("mentions.rss.text")}
        </p>
        <h3 className="mentions-section-title">
          {t("mentions.privacy.title")}
        </h3>
        <p>
          {t("mentions.privacy.text")}{" "}
          <Link to="/contact#contact-form">association@mamaesther.org</Link>
        </p>

        <h3 className="mentions-section-title">
          {t("mentions.signature.title")}
        </h3>
        <p>
          {t("mentions.signature.text")}
        </p>
        <div className="mentions-button-group">
          <CamerounButton onClick={() => navigate(-1)} className="about-button">
            <FontAwesomeIcon
              icon={faHandPointLeft}
              style={{ marginRight: "8px" }}
            />
            {t("mentions.back")}
          </CamerounButton>

          <CamerounButton to="/contact#contact-form" className="about-button">
            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: "8px" }} />
            {t("mentions.writeUs")}
          </CamerounButton>
        </div>
      </section>
    </main>
  );
}
