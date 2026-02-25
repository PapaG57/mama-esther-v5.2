import React from "react";
import "./DonV2.css";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";

const DonV2 = () => {
  const { t } = useTranslation();

  const impacts = [
    { amount: "20€", label: "Fournitures scolaires pour un enfant", icon: "📚" },
    { amount: "50€", label: "Soins médicaux et nutritionnels", icon: "🍎" },
    { amount: "100€", label: "Participation aux travaux de l'orphelinat", icon: "🏗️" },
  ];

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      {/* 1. HERO DON */}
      <section className="don-v2-hero">
        <div className="v2-container">
          <div className="don-v2-hero-content">
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>Votre générosité en action</span>
            <h1 className="v2-title" style={{color: "white"}}>Chaque don est une promesse d'avenir</h1>
            <p className="v2-hero-text">
              100% de votre don est affecté directement aux projets sur le terrain au Cameroun.
            </p>
          </div>
        </div>
      </section>

      {/* 2. IMPACT CARDS */}
      <section className="don-v2-impact-grid">
        <div className="v2-container">
          <div className="impact-cards-wrapper">
            {impacts.map((item, idx) => (
              <div className="impact-card" key={idx}>
                <span className="impact-icon">{item.icon}</span>
                <h3>Avec {item.amount}</h3>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FORM SECTION */}
      <section className="don-v2-form-section">
        <div className="v2-container">
          <div className="don-v2-split">
            <div className="don-v2-info">
              <h2>Comment nous soutenir ?</h2>
              <p>Vous pouvez faire un don ponctuel ou devenir parrain d'un enfant pour un soutien sur le long terme.</p>
              
              <div className="trust-points">
                <div className="trust-item">
                  <span className="trust-icon">🔒</span>
                  <div>
                    <h4>Paiement Sécurisé</h4>
                    <p>Vos données sont protégées via HelloAsso, plateforme leader du secteur associatif.</p>
                  </div>
                </div>
                <div className="trust-item">
                  <span className="trust-icon">📄</span>
                  <div>
                    <h4>Déduction Fiscale</h4>
                    <p>Bénéficiez d'une réduction d'impôt de 66% du montant de votre don.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="don-v2-form-card">
              <div className="form-header">
                <h3>Faire un don maintenant</h3>
              </div>
              <div className="form-body">
                <p className="form-instruction">Choisissez votre moyen de soutien :</p>
                <div className="donation-options">
                  <button className="v2-btn v2-btn-primary" onClick={() => window.open('https://www.helloasso.com/associations/association-mama-esther/formulaires/1', '_blank')}>
                    Via HelloAsso
                  </button>
                  <button className="v2-btn v2-btn-outline" style={{borderColor: "var(--color-green)", color: "var(--color-green)"}} onClick={() => window.location.href='/contact'}>
                    Par Virement / Chèque
                  </button>
                </div>
                <p className="form-footer">Vous allez être redirigé vers notre partenaire de paiement sécurisé.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonV2;
