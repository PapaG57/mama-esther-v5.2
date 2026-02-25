import React, { useState, useEffect, useCallback, useRef } from "react";
import "./TeamCarouselV2.css";
import { useTranslation } from "react-i18next";

const teamMembers = [
  { id: "esther", name: "Esther GERARD", roleKey: "team.roles.president", img: "/assets/team/esther.png", descKey: "team.descriptions.esther" },
  { id: "florent", name: "Florent GERARD", roleKey: "team.roles.vicePresident", img: "/assets/team/florent.png", descKey: "team.descriptions.florent" },
  { id: "maeva", name: "Maeva DAHER-KHATER", roleKey: "team.roles.treasurer", img: "/assets/team/maeva.png", descKey: "team.descriptions.maeva" },
  { id: "aziz", name: "Aziz DAHER-KHATER", roleKey: "team.roles.logistics", img: "/assets/team/aziz.png", descKey: "team.descriptions.aziz" },
  { id: "margault", name: "Margault WILLEMS", roleKey: "team.roles.nurse", img: "/assets/team/margault.png", descKey: "team.descriptions.margault" },
  { id: "marie", name: "Marie JADDAOUI", roleKey: "team.roles.nurse", img: "/assets/team/marie.png", descKey: "team.descriptions.marie" },
  { id: "melanie", name: "Melanie LOPES", roleKey: "team.roles.nurse", img: "/assets/team/melanie.png", descKey: "team.descriptions.melanie" },
  { id: "jules", name: "Jules BILLONG", roleKey: "team.roles.admin", img: "/assets/team/jules.png", descKey: "" },
  { id: "odette", name: "Odette NGO BIHAÏ", roleKey: "team.roles.projectManager", img: "/assets/team/odette.png", descKey: "" },
];

const TeamCarouselV2 = () => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeMember, setActiveMember] = useState(null);
  const touch = useRef({ startX: 0, endX: 0 });

  const goTo = useCallback((delta) => {
    if (animating) return;
    setAnimating(true);
    setIndex((prev) => (prev + delta + teamMembers.length) % teamMembers.length);
    setTimeout(() => setAnimating(false), 500);
  }, [animating]);

  const openModal = (member) => {
    setActiveMember(member);
    setShowModal(true);
  };

  const onTouchStart = (e) => { touch.current.startX = e.changedTouches[0].screenX; };
  const onTouchEnd = (e) => {
    touch.current.endX = e.changedTouches[0].screenX;
    const delta = touch.current.startX - touch.current.endX;
    if (Math.abs(delta) > 50) goTo(delta > 0 ? 1 : -1);
  };

  const getPositionClass = (i) => {
    const offset = (i - index + teamMembers.length) % teamMembers.length;
    if (offset === 0) return "v2-center";
    if (offset === 1) return "v2-right-1";
    if (offset === 2) return "v2-right-2";
    if (offset === teamMembers.length - 1) return "v2-left-1";
    if (offset === teamMembers.length - 2) return "v2-left-2";
    return "v2-hidden";
  };

  return (
    <section className="v2-team-carousel-section">
      <div className="v2-container">
        <div className="v2-section-header">
          <span className="v2-subtitle">Notre Équipe</span>
          <h2 className="v2-title">Les visages de l'engagement</h2>
        </div>

        <div className="v2-carousel-wrapper" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <button className="v2-nav-btn v2-prev" onClick={() => goTo(-1)}>‹</button>
          
          <div className="v2-carousel-track">
            {teamMembers.map((member, i) => (
              <div 
                key={i} 
                className={`v2-team-card ${getPositionClass(i)}`}
                onClick={() => i === index && openModal(member)}
              >
                <div className="v2-card-inner">
                  <div className="v2-member-photo">
                    <img src={member.img} alt={member.name} />
                  </div>
                  <div className="v2-member-details">
                    <h4>{member.name}</h4>
                    <p>{t(member.roleKey)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="v2-nav-btn v2-next" onClick={() => goTo(1)}>›</button>
        </div>

        <div className="v2-carousel-dots">
          {teamMembers.map((_, i) => (
            <span 
              key={i} 
              className={`v2-dot ${i === index ? "active" : ""}`}
              onClick={() => {
                const diff = i - index;
                if (diff !== 0) goTo(diff);
              }}
            ></span>
          ))}
        </div>
      </div>

      {/* MODALE V2 */}
      {showModal && activeMember && (
        <div className="v2-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="v2-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="v2-modal-close" onClick={() => setShowModal(false)}>×</button>
            <div className="v2-modal-grid">
              <div className="v2-modal-img">
                <img src={activeMember.img} alt={activeMember.name} />
              </div>
              <div className="v2-modal-text">
                <span className="v2-modal-tag">Membre de l'équipe</span>
                <h2>{activeMember.name}</h2>
                <h4 className="v2-modal-role">{t(activeMember.roleKey)}</h4>
                <div className="v2-modal-divider"></div>
                <p>{activeMember.descKey ? t(activeMember.descKey) : "Dévoué à la cause des enfants orphelins au Cameroun."}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TeamCarouselV2;
