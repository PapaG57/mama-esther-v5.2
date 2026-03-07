import React from "react";
import "../styles/FundraisingMaterialsV2.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faGraduationCap, 
  faStethoscope, 
  faTruck, 
  faMapMarkerAlt, 
  faEnvelope,
  faHeart,
  faGlasses,
  faBoxOpen
} from "@fortawesome/free-solid-svg-icons";

const FundraisingMaterials = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const materialNeeds = [
    {
      icon: faStethoscope,
      title: t("v2.fundraising.items.health.title"),
      desc: t("v2.fundraising.items.health.desc"),
      color: "#007a5e" // Vert
    },
    {
      icon: faGraduationCap,
      title: t("v2.fundraising.items.education.title"),
      desc: t("v2.fundraising.items.education.desc"),
      color: "#fcd116" // Jaune
    },
    {
      icon: faGlasses,
      title: t("v2.fundraising.items.medical.title"),
      desc: t("v2.fundraising.items.medical.desc"),
      color: "#ce1126" // Rouge
    }
  ];

  return (
    <div className="v2-layout">
      <Navbar hideDonate={false} />
      
      {/* 1. HERO */}
      <section className="fundraising-hero">
        <div className="v2-container">
          <div className="fundraising-hero-content">
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>
              {t("v2.fundraising.heroSubtitle")}
            </span>
            <h1 className="v2-title" style={{color: "white"}}>
              {t("v2.fundraising.heroTitle")}
            </h1>
            <p className="hero-text">
              {t("v2.fundraising.heroText")}
            </p>
            <div className="hero-btns">
              <button className="v2-btn v2-btn-primary" onClick={() => navigate('/don')}>
                {t("v2.btns.donate")}
              </button>
              <button className="v2-btn v2-btn-outline-white" onClick={() => {
                const element = document.getElementById('how-to-help');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}>
                {t("v2.fundraising.howToHelp.btn")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BESOINS MATÉRIELS */}
      <section className="fundraising-needs">
        <div className="v2-container">
          <div className="v2-section-header">
            <span className="v2-subtitle">{t("v2.fundraising.materialTitle")}</span>
            <h2 className="v2-title">{t("v2.fundraising.materialText")}</h2>
          </div>
          
          <div className="needs-grid">
            {materialNeeds.map((need, index) => (
              <div className="need-card" key={index}>
                <div className="need-icon" style={{ backgroundColor: need.color }}>
                  <FontAwesomeIcon icon={need.icon} />
                </div>
                <h3>{need.title}</h3>
                <p>{need.desc}</p>
              </div>
            ))}
          </div>

          <div className="special-donation-prompt">
            <h3>{t("v2.fundraising.specialDonation.title")}</h3>
            <p>
              {t("v2.fundraising.specialDonation.text")}{" "}
              <button className="special-contact-btn" onClick={() => navigate('/contact')}>
                {t("v2.fundraising.specialDonation.btn")}
              </button>
            </p>
          </div>

          <div className="shipping-note-box">
            <FontAwesomeIcon icon={faBoxOpen} className="note-icon" />
            <p>{t("v2.fundraising.shippingNote")}</p>
          </div>
        </div>
      </section>

      {/* 3. COMMENT AIDER / LOGISTIQUE */}
      <section id="how-to-help" className="fundraising-logistics">
        <div className="v2-container">
          <div className="logistics-card">
            <div className="logistics-content">
              <div className="logistics-header">
                <FontAwesomeIcon icon={faTruck} className="main-icon" />
                <h2>{t("v2.fundraising.howToHelp.title")}</h2>
                <p>{t("v2.fundraising.howToHelp.text")}</p>
              </div>

              <div className="logistics-details">
                <div className="address-box">
                  <div className="address-icon">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <div className="address-text">
                    <h4>{t("v2.fundraising.postalAddress")}</h4>
                    <p>
                      <strong>Association Mama-Esther</strong><br />
                      1, Rue des Troènes<br />
                      57700 HAYANGE St-NICOLAS EN FORÊT<br />
                      🇫🇷 FRANCE
                    </p>
                  </div>
                </div>

                <div className="contact-prompt">
                  <FontAwesomeIcon icon={faHeart} className="heart-icon" />
                  <p>{t("v2.fundraising.contactUs")}</p>
                  <button className="v2-btn v2-btn-primary" onClick={() => navigate('/contact')}>
                    <FontAwesomeIcon icon={faEnvelope} style={{marginRight: '10px'}} />
                    {t("contact.writeUs")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA FINAL */}
      <section className="fundraising-cta">
        <div className="v2-container">
          <div className="cta-box">
            <h2>{t("v2.cta.title")}</h2>
            <p>{t("v2.cta.text")}</p>
            <button className="v2-btn v2-btn-yellow" onClick={() => navigate('/don')}>
              {t("v2.btns.makeImpact")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FundraisingMaterials;
