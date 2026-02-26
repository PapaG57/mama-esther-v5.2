import React from "react";
import "../styles/AboutV2.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TeamCarouselV2 from "./TeamCarouselV2";

const AboutV2 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const values = [
    { title: "Intégrité", desc: "Chaque centime est utilisé pour la cause.", icon: "💎" },
    { title: "Engagement", desc: "Une présence constante sur le terrain.", icon: "🤝" },
    { title: "Amour", desc: "Placer l'humain au cœur de chaque projet.", icon: "❤️" },
  ];

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      {/* 1. HERO ABOUT */}
      <section className="about-v2-hero">
        <div className="v2-container">
          <div className="about-v2-hero-content">
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>{t("v2.about.heroSubtitle")}</span>
            <h1 className="v2-title" style={{color: "white"}}>{t("v2.about.heroTitle")} <br/><span>{t("v2.about.heroTitleSpan")}</span></h1>
          </div>
        </div>
      </section>

      {/* 2. THE MISSION (MANIFESTO) */}
      <section className="about-v2-manifesto">
        <div className="v2-container">
          <div className="manifesto-grid">
            <div className="manifesto-text">
              <span className="v2-subtitle">{t("v2.about.manifestoSubtitle")}</span>
              <h2>{t("v2.about.manifestoTitle")}</h2>
              <p className="lead">{t("v2.about.manifestoLead")}</p>
              <p>{t("v2.about.manifestoText")}</p>
              <div className="manifesto-stats">
                <div className="stat-box">
                  <strong>2025</strong>
                  <span>{t("v2.about.statYearDesc")}</span>
                </div>
                <div className="stat-box">
                  <strong>100%</strong>
                  <span>{t("v2.about.statVolunteerDesc")}</span>
                </div>
              </div>
            </div>
            <div className="manifesto-image">
              <img src="/assets/mentions/president-mama.png" alt="Esther Gérard" />
              <div className="image-caption">
                <strong>{t("footer.contactPresident").split(' - ')[0]}</strong>
                <span>{t("v2.about.presidentTitle")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR VALUES */}
      <section className="about-v2-values">
        <div className="v2-container">
          <div className="v2-section-header">
            <span className="v2-subtitle">{t("v2.about.valuesSubtitle")}</span>
            <h2 className="v2-title">{t("v2.about.valuesTitle")}</h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div className="v2-value-card" key={i}>
                <span className="v2-value-icon">{v.icon}</span>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TeamCarouselV2 />

      {/* 4. TEAM CALL TO ACTION */}
      <section className="about-v2-team-cta">
        <div className="v2-container">
          <div className="team-cta-box">
            <div className="team-cta-content">
              <h2>{t("v2.about.teamCtaTitle")}</h2>
              <p>{t("v2.about.teamCtaText")}</p>
              <button className="v2-btn v2-btn-yellow" onClick={() => navigate('/contact')}>{t("v2.btns.becomeVolunteer")}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutV2;
