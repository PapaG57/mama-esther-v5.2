import React from "react";
import "../styles/TravauxV2.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const TravauxV2 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      title: "Rénovation du dortoir principal",
      status: "terminé",
      img: "/assets/travaux-mama.png",
      desc: "Mise aux normes électriques et réfection des peintures pour un environnement sain.",
      tags: ["Infrastructure", "Santé"]
    },
    {
      id: 2,
      title: "Installation du système de pompage",
      status: "en cours",
      img: "/assets/actualities/news.png",
      desc: "Forage d'un puits et installation d'une pompe solaire pour l'accès à l'eau potable.",
      tags: ["Eau", "Énergie Solaire"]
    },
    {
      id: 3,
      title: "Construction de la salle d'étude",
      status: "planifié",
      img: "/assets/actualities/actuality2.png",
      desc: "Création d'un espace calme et équipé pour le soutien scolaire des enfants.",
      tags: ["Éducation"]
    }
  ];

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      {/* HERO TRAVAUX */}
      <section className="travaux-v2-hero">
        <div className="v2-container">
          <div className="travaux-v2-hero-content">
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>{t("v2.travaux.heroSubtitle")}</span>
            <h1 className="v2-title" style={{color: "white"}}>{t("v2.travaux.heroTitle")}</h1>
          </div>
        </div>
      </section>

      {/* PROJECTS LIST */}
      <section className="travaux-v2-list">
        <div className="v2-container">
          <div className="projects-grid">
            {projects.map((p) => (
              <div className="project-card" key={p.id}>
                <div className="project-img">
                  <img src={p.img} alt={p.title} />
                  <span className={`status-tag ${p.status}`}>{p.status}</span>
                </div>
                <div className="project-body">
                  <div className="project-tags">
                    {p.tags.map(tag => <span key={tag}>{tag}</span>)}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="project-footer">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: p.status === 'terminé' ? '100%' : (p.status === 'en cours' ? '60%' : '5%')}}></div>
                    </div>
                    <div className="footer-meta">
                      <span>{t("v2.travaux.financing")}</span>
                      <strong>100% {t("registration.success")}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SUPPORT */}
      <section className="travaux-v2-cta">
        <div className="v2-container">
          <div className="cta-banner">
            <h2>{t("v2.cta.title")}</h2>
            <p>{t("v2.cta.text")}</p>
            <button className="v2-btn v2-btn-red" onClick={() => navigate('/don')}>{t("v2.btns.makeImpact")}</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravauxV2;
