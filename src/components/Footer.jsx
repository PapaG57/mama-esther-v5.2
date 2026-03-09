import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMobileAlt,
  faEnvelopeOpenText,
  faAt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faWhatsapp,
  faLinkedin,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import "../styles/components/footer.css";
import PasswordField from "../components/PasswordField";
import { useTranslation } from "react-i18next";
import { adminService } from "../api/services";

function Footer() {
  const { t } = useTranslation();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const navigate = useNavigate();

  const handleCloseAdminModal = () => {
    setShowAdminModal(false);
    setIdentifiant("");
    setMotDePasse("");
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await adminService.login({ identifiant, motDePasse });

      if (res.data && res.data.token) {
        sessionStorage.setItem("adminToken", res.data.token);
        navigate("/admin");
        setShowAdminModal(false);
      } else {
        alert("Identifiants incorrects");
      }
    } catch (err) {
      console.error("Erreur de connexion admin :", err);
      alert(err.response?.data?.error || "Erreur réseau");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-container">
          {/* Logo & Slogan */}
          <div className="footer-logo">
            <div className="logo-3d-container">
              {[...Array(8)].map((_, i) => (
                <img
                  key={i}
                  src="/assets/logos/footer_logoME.png"
                  alt="Association Mama-Esther"
                  className={`logo-layer layer-${i}`}
                />
              ))}
            </div>
            <p className="slogan">
              {t("footer.slogan")}
            </p>
            <div className="social-icons">
              <FontAwesomeIcon icon={faFacebookF} className="social-icon" />
              <FontAwesomeIcon icon={faWhatsapp} className="social-icon" />
              <FontAwesomeIcon icon={faLinkedin} className="social-icon" />
              <FontAwesomeIcon icon={faInstagram} className="social-icon" />
              <FontAwesomeIcon icon={faYoutube} className="social-icon" />
            </div>
          </div>

          {/* Services */}
          <div className="footer-services">
            <h3>{t("footer.servicesTitle")}</h3>
            <ul className="footer-list">
              <li>
                <Link to="/don">{t("footer.serviceDon")}</Link>
              </li>
              <li>
                <Link to="/sponsors">{t("footer.serviceSponsor")}</Link>
              </li>
              <li>
                <Link to="/collecte-fonds-materiels">{t("footer.serviceFundraising")}</Link>
              </li>
              <li>
                <Link to="/volontariat-emploi">{t("footer.serviceVolunteer")}</Link>
              </li>
              <li>
                <Link to="/mentions-legales">{t("footer.serviceLegal")}</Link>
              </li>
              <li>
                <Link to="/contact">{t("footer.serviceIssue")}</Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="footer-contact">
            <h3>{t("footer.contactsTitle")}</h3>
            <div className="footer-card">
              <FontAwesomeIcon
                icon={faEnvelopeOpenText}
                className="footer-icon"
              />
              <div className="footer-text">
                <strong>Association Mama-Esther</strong>
                <br />
                1, Rue des Troènes
                <br />
                57700 HAYANGE St-NICOLAS EN FORÊT
                <br />
                🇫🇷 FRANCE
              </div>
            </div>
            <div className="footer-card">
              <FontAwesomeIcon icon={faMobileAlt} className="footer-icon" />
              <div className="footer-text">
                {t("footer.contactPresident")}
                <br />
                {t("footer.contactVicePresident")}
              </div>
            </div>
            <div className="footer-card">
              <FontAwesomeIcon icon={faAt} className="footer-icon" />
              <div className="footer-text">
                <Link to="/contact#contact-form" className="footer-link">
                  {t("footer.contactWriteUs")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Flags */}
        <div className="flag-container">
          <p>{t("footer.actionCountries")}</p>
          <div className="flag-icons">
            <img
              className="flag-icon"
              src="/assets/flags/FR.svg"
              alt="France"
              title="France"
            />
            <img
              className="flag-icon"
              src="/assets/flags/CM.svg"
              alt="Cameroun"
              title="Cameroun"
            />
            <img
              className="flag-icon"
              src="/assets/flags/RCA.svg"
              alt="Centrafrique"
              title="Centrafrique"
            />
            <img
              className="flag-icon"
              src="/assets/flags/LU.svg"
              alt="Luxembourg"
              title="Luxembourg"
            />
            <img
              className="flag-icon flag-blur"
              src="/assets/flags/BE.svg"
              alt="Belgique"
              title={t("footer.belgiumComing")}
            />
            <img
              className="flag-icon flag-blur"
              src="/assets/flags/DE.svg"
              alt="Allemagne"
              title={t("footer.germanyComing")}
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>
            {t("footer.copyright", { year: new Date().getFullYear() })}
            <a
              href="https://www.fgdeveloppement.com/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/assets/logos/footer-logoFGDEV.png"
                alt="logo de la société FG Développement"
                title="Cliquez pour visiter le site"
              />
            </a>
          </p>
        </div>

        {/* Accès administrateur */}
        <div className="footer-admin">
          <button
            className="admin-access-button"
            onClick={() => setShowAdminModal(true)}
          >
            {t("footer.adminAccess")}
          </button>
        </div>

        {/* Modale d'authentification */}
        {showAdminModal && (
          <div className="admin-modal-overlay" onClick={handleCloseAdminModal}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <h2>{t("footer.adminModalTitle")}</h2>
              <form onSubmit={handleAdminLogin}>
                <input
                  type="text"
                  className="input-standard"
                  placeholder={t("footer.adminPlaceholderId")}
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  required
                />

                <PasswordField
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder={t("footer.adminPlaceholderPassword")}
                  required
                />

                <div className="admin-modal-buttons">
                  <button type="submit">{t("footer.adminLogin")}</button>
                  <button type="button" onClick={handleCloseAdminModal}>
                    {t("footer.adminCancel")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}

export default Footer;
