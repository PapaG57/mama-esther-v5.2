import React from "react";
import "../styles/ContactV2.css";
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
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>{t("v2.contact.heroSubtitle")}</span>
            <h1 className="v2-title" style={{color: "white"}}>{t("v2.contact.heroTitle")}</h1>
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
                <h2>{t("v2.contact.infoTitle")}</h2>
                <p>{t("v2.contact.infoText")}</p>
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
                    <h4>{t("contact.phoneTitle")}</h4>
                    <p>+33 06 XX XX XX XX</p>
                  </div>
                </div>
                <div className="method-item">
                  <div className="method-icon"><FontAwesomeIcon icon={faMapMarkerAlt} /></div>
                  <div className="method-text">
                    <h4>{t("contact.addressTitle")}</h4>
                    <p>1, Rue des Troènes, 57700 Hayange, France</p>
                  </div>
                </div>
              </div>

              <div className="contact-socials">
                <h4>{t("v2.contact.followUs")}</h4>
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
              <form id="contact-form" className="v2-contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t("v2.contact.formName")}</label>
                    <input type="text" placeholder={t("v2.contact.formNamePlaceholder")} required />
                  </div>
                  <div className="form-group">
                    <label>{t("v2.contact.formEmail")}</label>
                    <input type="email" placeholder={t("v2.contact.formEmailPlaceholder")} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>{t("v2.contact.formSubject")}</label>
                  <select>
                    <option>{t("v2.contact.formSubjectOptions.volunteer")}</option>
                    <option>{t("v2.contact.formSubjectOptions.donation")}</option>
                    <option>{t("v2.contact.formSubjectOptions.partnership")}</option>
                    <option>{t("v2.contact.formSubjectOptions.other")}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{t("v2.contact.formMessage")}</label>
                  <textarea rows="5" placeholder={t("v2.contact.formMessagePlaceholder")}></textarea>
                </div>
                <button type="submit" className="v2-btn v2-btn-primary">{t("v2.btns.send")}</button>
              </form>
            </div>

          </div>
        </div>
      </section>


    </div>
  );
};

export default ContactV2;
