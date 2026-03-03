import React, { useState } from "react";
import "../styles/TeamCarouselV2.css";
import { useTranslation } from "react-i18next";

const TeamCarouselV2 = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const team = [
    { name: "Esther Gérard", role: t("team.roles.president"), img: "/assets/team/esther.png", desc: t("team.descriptions.esther") },
    { name: "Florent Gérard", role: t("team.roles.vicePresident"), img: "/assets/team/florent.png", desc: t("team.descriptions.florent") },
    { name: "Maryam", role: t("team.roles.treasurer"), img: "/assets/team/maeva.png", desc: t("team.descriptions.maeva") },
    { name: "Aziz", role: t("team.roles.logistics"), img: "/assets/team/aziz.png", desc: t("team.descriptions.aziz") },
    { name: "Jules BILLONG", role: t("team.roles.admin"), img: "/assets/team/jules.png", desc: t("team.descriptions.jules") },
    { name: "Odette NGO BIHAÏ", role: t("team.roles.projectManager"), img: "/assets/team/odette.png", desc: t("team.descriptions.odette") },
    { name: "Margault", role: t("team.roles.nurse"), img: "/assets/team/margault.png", desc: t("team.descriptions.margault") },
    { name: "Marie", role: t("team.roles.nurse"), img: "/assets/team/marie.png", desc: t("team.descriptions.marie") },
    { name: "Mélanie", role: t("team.roles.nurse"), img: "/assets/team/melanie.png", desc: t("team.descriptions.melanie") },
    { name: "Jane DOE", role: t("team.roles.socialMedia"), img: "/assets/team/jane-doe.png", desc: t("team.descriptions.jane") },
  ];

  const goTo = (dir) => {
    setActive((prev) => (prev + dir + team.length) % team.length);
  };

  const getPosClass = (index) => {
    const diff = (index - active + team.length) % team.length;
    if (diff === 0) return "v2-center";
    if (diff === 1) return "v2-right-1";
    if (diff === 2) return "v2-right-2";
    if (diff === team.length - 1) return "v2-left-1";
    if (diff === team.length - 2) return "v2-left-2";
    return "v2-hidden";
  };

  return (
    <section className="v2-team-carousel-section">
      <div className="v2-container">
        <div className="v2-section-header">
          <span className="v2-subtitle">{t("v2.team.subtitle")}</span>
          <h2 className="v2-title">{t("v2.team.title")}</h2>
        </div>

        <div className="v2-carousel-wrapper">
          <button className="v2-nav-btn v2-prev" onClick={() => goTo(-1)}>‹</button>
          <div className="v2-carousel-track">
            {team.map((m, i) => {
              const posClass = getPosClass(i);
              return (
                <div 
                  className={`v2-team-card ${posClass}`} 
                  key={i} 
                  onClick={() => posClass === 'v2-center' && setShowModal(true)}
                >
                  <div className="v2-card-inner">
                    <div className="v2-member-photo">
                      <img src={m.img} alt={m.name} />
                    </div>
                    <div className="v2-member-details">
                      <h4>{m.name}</h4>
                      <p>{m.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="v2-nav-btn v2-next" onClick={() => goTo(1)}>›</button>
        </div>

        <div className="v2-carousel-dots">
          {team.map((_, i) => (
            <div 
              key={i} 
              className={`v2-dot ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>

      {showModal && (
        <div className="v2-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="v2-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="v2-modal-close" onClick={() => setShowModal(false)}>×</button>
            <div className="v2-modal-content">
              <div className="v2-modal-img">
                <img src={team[active].img} alt={team[active].name} />
              </div>
              <div className="v2-modal-text">
                <span className="v2-modal-tag">{t("v2.team.memberTag")}</span>
                <h3>{team[active].name}</h3>
                <span className="v2-modal-role">{team[active].role}</span>
                <p>{team[active].desc || t("team.hint")}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TeamCarouselV2;
