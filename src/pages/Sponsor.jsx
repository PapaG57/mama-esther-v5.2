import React from "react";
import "../styles/SponsorV2.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandshake, faChartLine, faCertificate, faBoxOpen, faUsers, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const SponsorV2 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const partners = [
    { name: "Partenaire 1", logo: "/uploads/sponsor1.png", url: "#" },
    { name: "Partenaire 2", logo: "/uploads/sponsor2.png", url: "#" },
    { name: "Partenaire 3", logo: "/uploads/sponsor3.png", url: "#" }
  ];

  const benefits = [
    {
      icon: faChartLine,
      title: t("v2.sponsor.benefits.impactTitle"),
      desc: t("v2.sponsor.benefits.impactDesc")
    },
    /* Masqué temporairement en attente de confirmation juridique
    {
      icon: faCertificate,
      title: t("v2.sponsor.benefits.taxTitle"),
      desc: t("v2.sponsor.benefits.taxDesc")
    },
    */
    {
      icon: faHandshake,
      title: t("v2.sponsor.benefits.imageTitle"),
      desc: t("v2.sponsor.benefits.imageDesc")
    }
  ];

  const types = [
    {
      title: t("v2.sponsor.types.financial"),
      desc: t("v2.sponsor.types.financialDesc"),
      icon: faHandshake
    },
    {
      title: t("v2.sponsor.types.material"),
      desc: t("v2.sponsor.types.materialDesc"),
      icon: faBoxOpen
    },
    {
      title: t("v2.sponsor.types.skills"),
      desc: t("v2.sponsor.types.skillsDesc"),
      icon: faUsers
    }
  ];

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      {/* 1. HERO SPONSOR (Plein écran en haut) */}
      <section className="sponsor-v2-hero">
        <div className="v2-container">
          <div className="sponsor-v2-hero-content">
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>{t("v2.sponsor.heroSubtitle")}</span>
            <h1 className="v2-title" style={{color: "white"}}>{t("v2.sponsor.heroTitle")}</h1>
            <p className="sponsor-hero-text">
              {t("v2.sponsor.heroText")}
            </p>
            <button className="v2-btn v2-btn-yellow v2-btn-multi" onClick={() => navigate('/contact')}>
              <span className="btn-main-text">{t("v2.sponsor.heroBtn")}</span>
              <span className="btn-sub-text">{t("v2.sponsor.heroBtnSub")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* CONTENEUR GLOBAL : Colonne principale à gauche + Aside sticky à droite */}
      <div className="v2-container sponsor-content-layout">
        
        {/* COLONNE DE GAUCHE : TOUTES LES SECTIONS */}
        <div className="sponsor-main-sections">

          {/* 1bis. MANIFESTE ÉMOTIONNEL */}
          <section className="sponsor-v2-manifesto">
            <div className="manifesto-card">
              <div className="manifesto-content">
                <p className="manifesto-lead">{t("v2.sponsor.manifesto.lead")}</p>
                <p>{t("v2.sponsor.manifesto.p1")}</p>
                <p>{t("v2.sponsor.manifesto.p2")}</p>
                
                <div className="manifesto-highlight">
                  <p><strong>{t("v2.sponsor.manifesto.highlight")}</strong></p>
                  <p>{t("v2.sponsor.manifesto.intro")}</p>
                  <ul className="manifesto-list">
                    <li>{t("v2.sponsor.manifesto.list1")}</li>
                    <li>{t("v2.sponsor.manifesto.list2")}</li>
                    <li>{t("v2.sponsor.manifesto.list3")}</li>
                  </ul>
                </div>

                <p>{t("v2.sponsor.manifesto.p3")}</p>
                <p>{t("v2.sponsor.manifesto.p4")}</p>
                
                <div className="manifesto-footer">
                  <p className="final-call">{t("v2.sponsor.manifesto.call1")}</p>
                  <p>{t("v2.sponsor.manifesto.call2")}</p>
                  <h3>{t("v2.sponsor.manifesto.footer")}</h3>
                </div>
              </div>
            </div>
          </section>

          {/* 2. POURQUOI NOUS SOUTENIR ? */}
          <section className="sponsor-v2-benefits">
            <div className="v2-section-header">
              <span className="v2-subtitle">{t("v2.sponsor.benefits.subtitle")}</span>
              <h2 className="v2-title">{t("v2.sponsor.benefits.title")}</h2>
            </div>
            
            <div className="benefits-grid">
              {benefits.map((item, index) => (
                <div className="benefit-card" key={index}>
                  <div className="benefit-icon">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. TYPES DE PARTENARIATS */}
          <section className="sponsor-v2-types">
            <div className="types-white-box">
              <div className="v2-section-header">
                <h2 className="v2-title">{t("v2.sponsor.types.title")}</h2>
                <p>{t("v2.sponsor.types.text")}</p>
              </div>
              
              <div className="types-grid">
                {types.map((type, index) => (
                  <div className="type-item" key={index}>
                    <div className="type-icon-circle">
                      <FontAwesomeIcon icon={type.icon} />
                    </div>
                    <div className="type-text">
                      <h4>{type.title}</h4>
                      <p>{type.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. CTA FINAL */}
          <section className="sponsor-v2-cta">
            <div className="sponsor-cta-card">
              <div className="cta-content">
                <h2>{t("v2.sponsor.cta.title")}</h2>
                <p>{t("v2.sponsor.cta.text")}</p>
                <button className="v2-btn v2-btn-primary" onClick={() => navigate('/contact')}>
                  <FontAwesomeIcon icon={faEnvelope} style={{marginRight: '10px'}} />
                  {t("v2.sponsor.cta.btn")}
                </button>
              </div>
            </div>
          </section>

        </div>

        {/* ASIDE DES PARTENAIRES : COMMENCE EN HAUT ET SUIT LE SCROLL */}
        <aside className="sponsor-sidebar">
          <div className="sponsor-sidebar-box">
            <h3>Nos Partenaires</h3>
            <div className="sponsor-logos-list">
              {partners.map((partner, index) => (
                <a key={index} href={partner.url} target="_blank" rel="noopener noreferrer" className="sponsor-logo-item">
                  <img src={partner.logo} alt={partner.name} />
                </a>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default SponsorV2;