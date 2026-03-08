import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "../styles/MentionsV2.css";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";

const MentionsLegales = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />

      {/* 1. HERO MENTIONS */}
      <section className="mentions-v2-hero">
        <div className="v2-container">
          <h1>{t("mentions.title")}</h1>
        </div>
      </section>

      {/* 2. CONTENT MENTIONS */}
      <section className="mentions-v2-content">
        <div className="v2-container">
          <div className="mentions-v2-card">
            <div className="mentions-v2-header-images">
              <img
                src="/assets/mentions/logo-mama.webp"
                alt="Logo Mama Esther"
                className="mentions-v2-logo"
              />
              <img
                src="/assets/mentions/president-mama.webp"
                alt="Photo de la Présidente"
                className="mentions-v2-president"
              />
            </div>
            
            <h2>{t("mentions.date")}</h2>

            <div className="mentions-v2-section">
              <h3>{t("mentions.edition.title")}</h3>
              <p>{t("mentions.edition.text")}</p>
            </div>

            <div className="mentions-v2-section">
              <h3>{t("mentions.host.title")}</h3>
              <p>{t("mentions.host.text")}</p>
            </div>

            <div className="mentions-v2-section">
              <h3>{t("mentions.access.title")}</h3>
              <p>{t("mentions.access.text")}</p>
            </div>

            <div className="mentions-v2-section">
              <h3>{t("mentions.property.title")}</h3>
              <p>{t("mentions.property.text")}</p>
            </div>

            <div className="mentions-v2-section">
              <h3>{t("mentions.cookies.title")}</h3>
              <p>{t("mentions.cookies.text")}</p>
            </div>

            <div className="mentions-v2-section">
              <h3>{t("mentions.contact.title")}</h3>
              <p>{t("mentions.contact.text")}</p>
            </div>

            <div className="mentions-v2-section">
              <h3>{t("mentions.newsletter.title")}</h3>
              <p>{t("mentions.newsletter.text")}</p>
            </div>

            <div className="mentions-v2-section">
              <h3>{t("mentions.links.title")}</h3>
              <p>{t("mentions.links.text")}</p>
            </div>

            <div className="mentions-v2-section">
              <h3>{t("mentions.rss.title")}</h3>
              <p>{t("mentions.rss.text")}</p>
            </div>

            <div className="mentions-v2-section">
              <h3>{t("mentions.privacy.title")}</h3>
              <p>
                {t("mentions.privacy.text")}{" "}
                <Link to="/contact#contact-form" style={{color: "var(--color-green)", fontWeight: "bold"}}>
                  association@mamaesther.org
                </Link>
              </p>
            </div>

            <div className="mentions-v2-section">
              <h3>{t("mentions.signature.title")}</h3>
              <p>{t("mentions.signature.text")}</p>
            </div>

            <div className="mentions-v2-footer-btns">
              <button onClick={() => navigate(-1)} className="v2-btn v2-btn-outline-green">
                <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: "10px" }} />
                {t("mentions.back")}
              </button>
              <button onClick={() => navigate("/contact#contact-form")} className="v2-btn v2-btn-primary">
                <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: "10px" }} />
                {t("mentions.writeUs")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MentionsLegales;
