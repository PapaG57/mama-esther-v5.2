import React from "react";
import "./HomeV2.css";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import ActualityV2 from "./ActualityV2";
import NewsletterV2 from "./NewsletterV2";
import DonationCounter from "../components/DonationCounter";

const HomeV2 = () => {
  const { t } = useTranslation();

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />

      {/* 1. HERO SECTION - STORYTELLING & CTA */}
      <section className="v2-hero">
        <div className="v2-hero-overlay">
          <div className="v2-hero-content">
            <span className="v2-hero-badge">{t("v2.hero.associationName")}</span>
            <h1 className="v2-hero-title">
              {t("v2.hero.mainTitle")} <span>{t("v2.hero.location")}</span>
            </h1>
            <p className="v2-hero-text">
              {t("v2.hero.subtext")}
            </p>
            <div className="v2-hero-btns">
              <button className="v2-btn v2-btn-primary" onClick={() => window.location.href='/v2/don'}>{t("v2.btns.donate")}</button>
              <button className="v2-btn v2-btn-outline" onClick={() => window.location.href='/v2/about'}>{t("v2.btns.discover")}</button>
            </div>
          </div>
        </div>
        <div className="v2-scroll-indicator"></div>
      </section>

      {/* 2. IMPACT STATS - TRUST & TRANSPARENCY */}
      <section id="aboutSection" className="v2-impact">
        <div className="v2-container">
          <div className="v2-impact-grid">
            <div className="v2-impact-item">
              <h3>200+</h3>
              <p>{t("v2.impact.children")}</p>
            </div>
            <div className="v2-impact-item">
              <h3>15+</h3>
              <p>{t("v2.impact.projects")}</p>
            </div>
            <div className="v2-impact-item">
              <h3>5</h3>
              <p>{t("v2.impact.countries")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSIONS GRID - ACTION ORIENTED */}
      <section id="engagement" className="v2-missions">
        <div className="v2-container">
          <div className="v2-section-header">
            <span className="v2-subtitle">{t("v2.missions.subtitle")}</span>
            <h2 className="v2-title">{t("v2.missions.title")}</h2>
          </div>
          
          <div className="v2-missions-grid">
            {/* Mission 1 */}
            <div className="v2-mission-card">
              <div className="v2-mission-img">
                <img src="/assets/soutien.png" alt="Soutien" />
                <span className="v2-mission-tag">{t("v2.tags.education")}</span>
              </div>
              <div className="v2-mission-body">
                <h4>{t("v2.missions.eduTitle")}</h4>
                <p>{t("v2.missions.eduDesc")}</p>
                <button className="v2-link-btn" onClick={() => window.location.href='/about'}>{t("v2.btns.learnMore")} →</button>
              </div>
            </div>

            {/* Mission 2 */}
            <div className="v2-mission-card">
              <div className="v2-mission-img">
                <img src="/assets/travaux-mama.png" alt="Travaux" />
                <span className="v2-mission-tag">{t("v2.tags.infrastructure")}</span>
              </div>
              <div className="v2-mission-body">
                <h4>{t("v2.missions.infraTitle")}</h4>
                <p>{t("v2.missions.infraDesc")}</p>
                <button className="v2-link-btn" onClick={() => window.location.href='/v2/travaux'}>{t("v2.btns.learnMore")} →</button>
              </div>
            </div>

            {/* Mission 3 */}
            <div className="v2-mission-card">
              <div className="v2-mission-img">
                <img src="/assets/comptabilite.png" alt="Transparence" />
                <span className="v2-mission-tag">{t("v2.tags.transparency")}</span>
              </div>
              <div className="v2-mission-body">
                <h4>{t("v2.missions.transTitle")}</h4>
                <p>{t("v2.missions.transDesc")}</p>
                <button className="v2-link-btn" onClick={() => window.location.href='/v2/contact'}>{t("v2.btns.learnMore")} →</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTUALITÉS - MAGAZINE LOOK */}
      <section id="actualitySection">
        <ActualityV2 />
      </section>

      {/* 5. NEWSLETTER - PUBLICATIONS LOOK */}
      <NewsletterV2 />

      {/* 6. COMPTEUR DE DONS */}
      <div className="v2-donation-wrapper">
        <DonationCounter />
      </div>

      {/* 7. DONATION CTA - MODERN CALL TO ACTION */}
      <section className="v2-cta-banner">
        <div className="v2-container">
          <div className="v2-cta-content">
            <h2>{t("v2.cta.title")}</h2>
            <p>{t("v2.cta.text")}</p>
            <button className="v2-btn v2-btn-yellow" onClick={() => window.location.href='/v2/don'}>{t("v2.btns.makeImpact")}</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomeV2;

