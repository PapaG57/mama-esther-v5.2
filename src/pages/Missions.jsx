import React from "react";
import "../styles/MissionsV2.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Missions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const missionList = [
    {
      id: "trust",
      titleKey: "v2.missions.transTitle",
      descKey: "v2.missions.transFull",
      img: "/assets/trust.jpg",
      tagKey: "v2.tags.transparency"
    },
    {
      id: "edu",
      titleKey: "v2.missions.eduTitle",
      descKey: "v2.missions.eduFull",
      img: "/assets/education.jpg",
      tagKey: "v2.tags.education"
    },
    {
      id: "infra",
      titleKey: "v2.missions.infraTitle",
      descKey: "v2.missions.infraFull",
      img: "/assets/infrastructure.jpg",
      tagKey: "v2.tags.infrastructure"
    }
  ];

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      {/* 1. HERO MISSIONS */}
      <section className="missions-v2-hero">
        <div className="v2-container">
          <div className="missions-v2-hero-content">
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>{t("v2.missions.subtitle")}</span>
            <h1 className="v2-title" style={{color: "white"}}>{t("v2.missions.heroTitle")} <br/><span>{t("v2.missions.heroTitleSpan")}</span></h1>
          </div>
        </div>
      </section>

      {/* 2. MISSION BLOCKS */}
      <section className="missions-v2-content">
        <div className="v2-container">
          {missionList.map((m, index) => (
            <div id={m.id} className={`mission-row ${index % 2 !== 0 ? "reverse" : ""}`} key={m.id}>
              <div className="mission-image">
                <img src={m.img} alt={t(m.titleKey)} />
                <span className="mission-tag-label">{t(m.tagKey)}</span>
              </div>
              <div className="mission-text">
                <h2>{t(m.titleKey)}</h2>
                <p>{t(m.descKey)}</p>
                <div className="mission-accent-line"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CTA SUPPORT */}
      <section className="missions-v2-cta">
        <div className="v2-container">
          <div className="missions-cta-card">
            <h2>{t("v2.cta.title")}</h2>
            <p>{t("v2.cta.text")}</p>
            <div className="missions-cta-btns">
              <button className="v2-btn v2-btn-yellow" onClick={() => navigate('/don')}>{t("v2.btns.donate")}</button>
              <button className="v2-btn v2-btn-outline" onClick={() => navigate('/contact')}>{t("v2.btns.becomeVolunteer")}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Missions;
