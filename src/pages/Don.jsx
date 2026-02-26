import React from "react";
import "../styles/DonV2.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const DonV2 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const impactPoints = [
    { icon: "🥣", title: t("v2.don.impact.nutrition.title"), desc: t("v2.don.impact.nutrition.desc") },
    { icon: "📚", title: t("v2.don.impact.education.title"), desc: t("v2.don.impact.education.desc") },
    { icon: "🩺", title: t("v2.don.impact.health.title"), desc: t("v2.don.impact.health.desc") }
  ];

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      {/* HERO DON */}
      <section className="don-v2-hero">
        <div className="v2-container">
          <div className="don-v2-hero-content">
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>{t("v2.don.heroSubtitle")}</span>
            <h1 className="v2-title" style={{color: "white"}}>{t("v2.don.heroTitle")}</h1>
          </div>
        </div>
      </section>

      {/* 1. IMPACT PREVIEW - MAKES IT LESS AUSTERE */}
      <section className="don-v2-impact">
        <div className="v2-container">
          <div className="don-impact-grid">
            {impactPoints.map((item, index) => (
              <div className="don-impact-card" key={index}>
                <span className="don-impact-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. DON CONTENT & TRUST */}
      <section className="don-v2-section">
        <div className="v2-container">
          <div className="don-v2-grid">
            
            {/* TEXT SIDE */}
            <div className="don-info-side">
              <h2>{t("v2.don.supportTitle")}</h2>
              <p>{t("v2.don.supportText")}</p>
              
              <div className="don-trust-cards">
                <div className="trust-card">
                  <div className="trust-icon">🔒</div>
                  <div className="trust-text">
                    <h4>{t("v2.don.secureTitle")}</h4>
                    <p>{t("v2.don.secureText")}</p>
                  </div>
                </div>
                <div className="trust-card">
                  <div className="trust-icon">📄</div>
                  <div className="trust-text">
                    <h4>{t("v2.don.taxTitle")}</h4>
                    <p>{t("v2.don.taxText")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION CARD */}
            <div className="don-form-side">
              <div className="don-form-card">
                <h3>{t("v2.don.makeDonation")}</h3>
                <p className="form-instruction">{t("v2.don.formInstruction")}</p>
                
                <div className="placeholder-btns">
                  <button 
                    className="v2-btn v2-btn-primary" 
                    onClick={() => window.open('https://www.helloasso.com/associations/association-mama-esther/formulaires/1/widget', '_blank')}
                  >
                    {t("v2.don.donateViaHelloAsso")}
                  </button>
                  
                  <button 
                    className="v2-btn v2-btn-outline" 
                    style={{borderColor: "var(--color-green)", color: "var(--color-green)"}} 
                    onClick={() => navigate('/contact')}
                  >
                    {t("navbar.contact")}
                  </button>
                </div>
                
                <p className="form-footer">{t("v2.don.formFooter")}</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default DonV2;
