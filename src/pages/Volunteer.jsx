import React from "react";
import "../styles/VolunteerV2.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faGlobeAfrica, 
  faLaptopHouse, 
  faUserTie, 
  faHandHoldingHeart,
  faEnvelopeOpenText,
  faUsers,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

const Volunteer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const engagementTypes = [
    {
      icon: faGlobeAfrica,
      title: t("v2.volunteer.types.field.title"),
      desc: t("v2.volunteer.types.field.desc"),
      color: "#007a5e" // Vert
    },
    {
      icon: faLaptopHouse,
      title: t("v2.volunteer.types.remote.title"),
      desc: t("v2.volunteer.types.remote.desc"),
      color: "#fcd116" // Jaune
    },
    {
      icon: faUserTie,
      title: t("v2.volunteer.types.pro.title"),
      desc: t("v2.volunteer.types.pro.desc"),
      color: "#ce1126" // Rouge
    }
  ];

  return (
    <div className="v2-layout">
      <Navbar hideDonate={false} />
      
      {/* 1. HERO */}
      <section className="volunteer-hero">
        <div className="v2-container">
          <div className="volunteer-hero-content">
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>
              {t("v2.volunteer.heroSubtitle")}
            </span>
            <h1 className="v2-title" style={{color: "white"}}>
              {t("v2.volunteer.heroTitle")}
            </h1>
            <p className="hero-text">
              {t("v2.volunteer.heroText")}
            </p>
            <div className="hero-btns">
              <button className="v2-btn v2-btn-primary" onClick={() => navigate('/contact')}>
                {t("v2.volunteer.cta.btn")}
              </button>
              <button className="v2-btn v2-btn-outline-white" onClick={() => {
                const element = document.getElementById('opportunities');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}>
                {t("v2.volunteer.opportunitiesTitle")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OPPORTUNITÉS */}
      <section id="opportunities" className="volunteer-opportunities">
        <div className="v2-container">
          <div className="v2-section-header">
            <span className="v2-subtitle">{t("v2.volunteer.opportunitiesTitle")}</span>
            <h2 className="v2-title">{t("v2.volunteer.opportunitiesText")}</h2>
          </div>
          
          <div className="opp-grid">
            {engagementTypes.map((type, index) => (
              <div className="opp-card" key={index}>
                <div className="opp-icon" style={{ backgroundColor: type.color }}>
                  <FontAwesomeIcon icon={type.icon} />
                </div>
                <h3>{type.title}</h3>
                <p>{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MANIFESTE / POURQUOI NOUS ? */}
      <section className="volunteer-manifesto">
        <div className="v2-container">
          <div className="manifesto-box">
            <div className="manifesto-image">
               <div className="experience-badge">
                  <span className="number">100%</span>
                  <span className="text">Humain</span>
               </div>
            </div>
            <div className="manifesto-content">
              <span className="v2-subtitle">Notre Philosophie</span>
              <h2>Pourquoi s'engager avec nous ?</h2>
              <p>
                Rejoindre Mama Esther, c'est intégrer une famille unie par la volonté d'agir. 
                Chaque bénévole est écouté, valorisé et accompagné dans sa mission. Nous croyons 
                que l'échange humain est aussi précieux que l'aide matérielle.
              </p>
              <ul className="manifesto-list">
                <li>
                  <FontAwesomeIcon icon={faHandHoldingHeart} className="li-icon" />
                  <span>Une cause transparente et concrète</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faUsers} className="li-icon" />
                  <span>Une équipe soudée et bienveillante</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faEnvelopeOpenText} className="li-icon" />
                  <span>Un suivi personnalisé de votre impact</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA FINAL */}
      <section className="volunteer-cta">
        <div className="v2-container">
          <div className="cta-box">
            <h2>{t("v2.volunteer.cta.title")}</h2>
            <p>{t("v2.volunteer.cta.text")}</p>
            <button className="v2-btn v2-btn-yellow" onClick={() => navigate('/contact')}>
              <FontAwesomeIcon icon={faEnvelopeOpenText} style={{marginRight: '10px'}} />
              {t("v2.volunteer.cta.btn")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Volunteer;
