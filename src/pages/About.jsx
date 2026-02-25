import React from "react";
import "./AboutV2.css";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import TeamCarouselV2 from "./TeamCarouselV2";

const AboutV2 = () => {
  const { t } = useTranslation();

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
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>Notre Histoire, Votre Impact</span>
            <h1 className="v2-title" style={{color: "white"}}>Donner de l'espoir là où <br/><span>le besoin est grand</span></h1>
          </div>
        </div>
      </section>

      {/* 2. THE MISSION (MANIFESTO) */}
      <section className="about-v2-manifesto">
        <div className="v2-container">
          <div className="manifesto-grid">
            <div className="manifesto-text">
              <span className="v2-subtitle">Qui sommes-nous ?</span>
              <h2>Une mission née du cœur, portée par l'action</h2>
              <p className="lead">L'Association Mama Esther est née d'une volonté simple : ne plus rester spectateur face à la détresse des orphelins au Cameroun.</p>
              <p>Depuis notre création, nous œuvrons sans relâche pour offrir non seulement un toit et de la nourriture, mais surtout une éducation et un avenir digne à chaque enfant que nous rencontrons.</p>
              <div className="manifesto-stats">
                <div className="stat-box">
                  <strong>2025</strong>
                  <span>Année charnière</span>
                </div>
                <div className="stat-box">
                  <strong>100%</strong>
                  <span>Bénévolat</span>
                </div>
              </div>
            </div>
            <div className="manifesto-image">
              <img src="/assets/mentions/president-mama.png" alt="Esther Gérard" />
              <div className="image-caption">
                <strong>Esther Gérard</strong>
                <span>Fondatrice & Présidente</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR VALUES */}
      <section className="about-v2-values">
        <div className="v2-container">
          <div className="v2-section-header">
            <span className="v2-subtitle">Nos Piliers</span>
            <h2 className="v2-title">Ce qui guide nos actions</h2>
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
              <h2>Rejoignez l'aventure humaine</h2>
              <p>Que vous soyez bénévole, donateur ou simple sympathisant, votre place est parmi nous.</p>
              <button className="v2-btn v2-btn-yellow" onClick={() => window.location.href='/contact'}>Devenir bénévole</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutV2;

