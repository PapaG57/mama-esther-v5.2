import React, { useState, useRef } from "react"; // Ajout de useState et useRef
import "../styles/HomeV2.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ActualityV2 from "./ActualityV2";
import NewsletterV2 from "./NewsletterV2";
import DonationCounter from "../components/DonationCounter";
import BibleVerse from "../components/BibleVerse";

const HomeV2 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // États pour la modale de chat
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const aiResponseRef = useRef(null); // Réf pour la zone de réponse de l'IA

  // Fonction pour envoyer un message (simulée pour l'exemple)
  const handleSendMessage = () => {
    if (currentInput.trim() === "") return;

    const newUserMessage = { sender: "user", text: currentInput };
    setChatMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setCurrentInput("");

    // Simulation d'une réponse de l'IA
    setTimeout(() => {
      const aiResponse = { sender: "ai", text: `Bonjour ! Vous avez dit : "${newUserMessage.text}". Comment puis-je vous aider avec votre article ?` };
      setChatMessages((prevMessages) => [...prevMessages, aiResponse]);
    }, 1000);
  };

  // Fonction pour copier le contenu de la dernière réponse de l'IA
  const handleCopy = () => {
    const lastAiMessage = chatMessages.filter(msg => msg.sender === 'ai').pop();
    if (lastAiMessage && aiResponseRef.current) {
      navigator.clipboard.writeText(lastAiMessage.text)
        .then(() => alert("Contenu copié !"))
        .catch(err => console.error("Erreur lors de la copie :", err));
    }
  };

  // Fonction pour fermer la modale
  const handleCloseModal = () => {
    setShowChatModal(false);
    setChatMessages([]); // Réinitialiser les messages à la fermeture
    setCurrentInput("");
  };

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />

      {/* 1. HERO SECTION - STORYTELLING & CTA */}
      <section className="v2-hero">
        <div className="v2-hero-overlay">
          <div className="v2-hero-container v2-container">
            <div className="v2-hero-content">
              <h1 className="v2-hero-title">
                {t("v2.hero.mainTitle")} <span>{t("v2.hero.location")}</span>
              </h1>
              <p className="v2-hero-text">
                {t("v2.hero.subtext")}
              </p>
              <div className="v2-hero-btns">
                <button className="v2-btn v2-btn-primary" onClick={() => navigate('/don')}>{t("v2.btns.donate")}</button>
                <button className="v2-btn v2-btn-outline" onClick={() => navigate('/about')}>{t("v2.btns.discover")}</button>
              </div>
            </div>
            
            <div className="v2-hero-aside">
              <BibleVerse 
                text="bibleVerses.matthew25_40.text" 
                reference="bibleVerses.matthew25_40.ref" 
              />
            </div>
          </div>
        </div>
        <div className="v2-scroll-indicator"></div>
      </section>

      {/* Bouton pour ouvrir la modale de chat AI */}
      <section className="v2-container" style={{ textAlign: 'center', padding: '40px 0' }}>
        <button className="v2-btn v2-btn-primary" onClick={() => setShowChatModal(true)}>
          Ouvrir Chat AI
        </button>
      </section>

      {/* Modale de chat AI */}
      {showChatModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '600px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '80vh',
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Gemini 2.5-flash</h3>
            
            <div style={{
              flexGrow: 1,
              overflowY: 'auto',
              border: '1px solid #e0e0e0',
              borderRadius: '5px',
              padding: '15px',
              marginBottom: '15px',
              backgroundColor: '#f9f9f9',
            }}>
              {chatMessages.map((msg, index) => (
                <p key={index} style={{
                  margin: '5px 0',
                  textAlign: msg.sender === 'user' ? 'right' : 'left',
                  color: msg.sender === 'user' ? '#007a5e' : '#333',
                  fontWeight: msg.sender === 'ai' ? 'bold' : 'normal',
                }}>
                  {msg.sender === 'user' ? 'Vous: ' : 'Gemini: '}
                  <span ref={msg.sender === 'ai' ? aiResponseRef : null}>{msg.text}</span>
                </p>
              ))}
            </div>

            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
              placeholder="Écrivez votre message ici..."
              style={{
                width: 'calc(100% - 20px)',
                minHeight: '80px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                marginBottom: '15px',
                resize: 'vertical',
                fontSize: '1rem',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="v2-btn v2-btn-outline" onClick={handleCopy} style={{ backgroundColor: '#f0f0f0', color: '#333' }}>Copier</button>
              <button className="v2-btn v2-btn-primary" onClick={handleCloseModal} style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. IMPACT STATS - Masqué temporairement car l'association est en construction
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
      */}

      {/* 3. MISSIONS GRID - ACTION ORIENTED */}
      <section id="engagement" className="v2-missions">
        <div className="v2-container">
          <div className="v2-section-header">
            <span className="v2-subtitle">{t("v2.missions.subtitle")}</span>
            <h2 className="v2-title">{t("v2.missions.title")}</h2>
          </div>
          
          <div className="v2-missions-grid">
            {/* Mission 1: Trust */}
            <div className="v2-mission-card">
              <div className="v2-mission-img">
                <img src="/assets/missions/human-dignity.webp" alt="Transparence" />
                <span className="v2-mission-tag">{t("v2.tags.transparency")}</span>
              </div>
              <div className="v2-mission-body">
                <h4>{t("v2.missions.transTitle")}</h4>
                <p>{t("v2.missions.transDesc")}</p>
                <button className="v2-link-btn" onClick={() => navigate('/missions#trust')}>{t("v2.btns.learnMore")} →</button>
              </div>
            </div>

            {/* Mission 2: Education */}
            <div className="v2-mission-card">
              <div className="v2-mission-img">
                <img src="/assets/missions/thriving-children.webp" alt="Education" />
                <span className="v2-mission-tag">{t("v2.tags.education")}</span>
              </div>
              <div className="v2-mission-body">
                <h4>{t("v2.missions.eduTitle")}</h4>
                <p>{t("v2.missions.eduDesc")}</p>
                <button className="v2-link-btn" onClick={() => navigate('/missions#edu')}>{t("v2.btns.learnMore")} →</button>
              </div>
            </div>

            {/* Mission 3: Infrastructure */}
            <div className="v2-mission-card">
              <div className="v2-mission-img">
                <img src="/assets/missions/infrastructure.webp" alt="Infrastructure" />
                <span className="v2-mission-tag">{t("v2.tags.infrastructure")}</span>
              </div>
              <div className="v2-mission-body">
                <h4>{t("v2.missions.infraTitle")}</h4>
                <p>{t("v2.missions.infraDesc")}</p>
                <button className="v2-link-btn" onClick={() => navigate('/missions#infra')}>{t("v2.btns.learnMore")} →</button>
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
            <button className="v2-btn v2-btn-yellow" onClick={() => navigate('/don')}>{t("v2.btns.makeImpact")}</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomeV2;
