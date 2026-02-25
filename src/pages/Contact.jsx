import React from "react";
import "./ContactV2.css";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faWhatsapp, faLinkedin, faInstagram } from "@fortawesome/free-brands-svg-icons";

const ContactV2 = () => {
  const { t } = useTranslation();

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      {/* HERO CONTACT */}
      <section className="contact-v2-hero">
        <div className="v2-container">
          <div className="contact-v2-hero-content">
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>Parlons-nous</span>
            <h1 className="v2-title" style={{color: "white"}}>Nous sommes à <br/>votre écoute</h1>
          </div>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="contact-v2-section">
        <div className="v2-container">
          <div className="contact-v2-grid">
            
            {/* INFO SIDE */}
            <div className="contact-info-side">
              <div className="info-header">
                <h2>Envie de nous rejoindre ou de poser une question ?</h2>
                <p>Que vous soyez un particulier, une entreprise ou une autre association, chaque message compte pour nous.</p>
              </div>

              <div className="contact-methods">
                <div className="method-item">
                  <div className="method-icon"><FontAwesomeIcon icon={faEnvelope} /></div>
                  <div className="method-text">
                    <h4>Email</h4>
                    <p>contact@mama-esther.org</p>
                  </div>
                </div>
                <div className="method-item">
                  <div className="method-icon"><FontAwesomeIcon icon={faPhone} /></div>
                  <div className="method-text">
                    <h4>Téléphone</h4>
                    <p>+33 06 XX XX XX XX</p>
                  </div>
                </div>
                <div className="method-item">
                  <div className="method-icon"><FontAwesomeIcon icon={faMapMarkerAlt} /></div>
                  <div className="method-text">
                    <h4>Siège Social</h4>
                    <p>1, Rue des Troènes, 57700 Hayange, France</p>
                  </div>
                </div>
              </div>

              <div className="contact-socials">
                <h4>Suivez-nous</h4>
                <div className="social-links">
                  <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
                  <a href="#"><FontAwesomeIcon icon={faWhatsapp} /></a>
                  <a href="#"><FontAwesomeIcon icon={faLinkedin} /></a>
                  <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                </div>
              </div>
            </div>

            {/* FORM SIDE */}
            <div className="contact-form-side">
              <form className="v2-contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nom complet</label>
                    <input type="text" placeholder="Jean Dupont" required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="jean@exemple.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Sujet</label>
                  <select>
                    <option>Devenir bénévole</option>
                    <option>Faire un don / Parrainage</option>
                    <option>Partenariat entreprise</option>
                    <option>Autre question</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Votre message</label>
                  <textarea rows="5" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                </div>
                <button type="submit" className="v2-btn v2-btn-primary">Envoyer le message</button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* MAP PLACEHOLDER / TERRAIN */}
      <section className="contact-v2-map">
        <div className="v2-container">
          <div className="map-card">
            <div className="map-text">
              <h3>Notre impact est local</h3>
              <p>Nous agissons principalement dans les régions de Yaoundé et Douala au Cameroun.</p>
            </div>
            {/* Ici on pourrait mettre une vraie map Google, mais restons sur un design propre */}
            <div className="map-visual">
               <img src="/assets/flags/CM.svg" alt="Cameroun" style={{width: '100px', opacity: 0.2}} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactV2;
