// src/components/Navbar.jsx
import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useScrollNavbar from "../utils/navbar";
import { useTranslation } from "react-i18next";
import "../styles/components/navbar.css";

export default function Navbar({ hideDonate = false }) {
  const { t, i18n } = useTranslation();
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useScrollNavbar(navbarRef);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setMenuOpen(false);
  };

  const handleNavClick = (event, sectionId) => {
    if (location.pathname === "/") {
      event.preventDefault();
      const target = document.querySelector(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        setMenuOpen(false);
      }
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <nav className="custom-navbar" ref={navbarRef}>
      <div className="custom-navbar-container">

        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img
            className="custom-navbar-logo"
            src="/assets/logos/logo-long.png"
            alt="Logo Association"
          />
        </Link>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`custom-nav-list ${menuOpen ? "open" : ""}`}>
          <li>
            <Link
              className="custom-nav-link"
              to="/"
              onClick={(e) => handleNavClick(e, "#root")}
            >
              {t("navbar.home")}
            </Link>
          </li>

          <li>
            <Link
              className="custom-nav-link"
              to="/#aboutSection"
              onClick={(e) => handleNavClick(e, "#aboutSection")}
            >
              {t("navbar.about")}
            </Link>
          </li>

          <li>
            <Link
              className="custom-nav-link"
              to="/missions"
              onClick={() => setMenuOpen(false)}
            >
              {t("navbar.commitment")}
            </Link>
          </li>

          <li>
            <Link
              className="custom-nav-link"
              to="/#actualitySection"
              onClick={(e) => handleNavClick(e, "#actualitySection")}
            >
              {t("navbar.news")}
            </Link>
          </li>

          <li>
            <Link
              className="custom-nav-link"
              to="/contact"
              onClick={() => setMenuOpen(false)}
            >
              {t("navbar.contact")}
            </Link>
          </li>

          {!hideDonate && (
            <li className="mobile-don">
              <button
                className="don-button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/don");
                }}
              >
                {t("navbar.donate")}
              </button>
            </li>
          )}
          
          <li className="mobile-lang">
            <button 
              className="lang-btn" 
              onClick={() => changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')}
            >
              <img 
                src={i18n.language === 'fr' ? "/assets/flags/GB.svg" : "/assets/flags/FR.svg"} 
                alt="Switch Language" 
              />
              <span>{i18n.language === 'fr' ? 'English' : 'Français'}</span>
            </button>
          </li>
        </ul>

        <div className="navbar-right-actions">
          {!hideDonate && (
            <button
              className="don-button desktop-don"
              onClick={() => navigate("/don")}
            >
              {t("navbar.donate")}
            </button>
          )}

          <button 
            className="lang-btn desktop-lang" 
            onClick={() => changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')}
            title={i18n.language === 'fr' ? 'Switch to English' : 'Passer au Français'}
          >
            <img 
              src={i18n.language === 'fr' ? "/assets/flags/GB.svg" : "/assets/flags/FR.svg"} 
              alt="Switch Language" 
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
