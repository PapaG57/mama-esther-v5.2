// src/components/Navbar.jsx
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import useScrollNavbar from "../utils/navbar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./navbar.css";

export default function Navbar({ hideDonate = false }) {
  const { t } = useTranslation();
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useScrollNavbar(navbarRef);

  const scrollToSection = (event, sectionId) => {
    event.preventDefault();
    const target = document.querySelector(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <nav className="custom-navbar" ref={navbarRef}>
      <div className="custom-navbar-container">

        {/* Logo */}
        <img
          className="custom-navbar-logo"
          src="/assets/logos/logo-long.png"
          alt="Logo Association"
        />

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Liens */}
        <ul className={`custom-nav-list ${menuOpen ? "open" : ""}`}>
          <li>
            <a
              className="custom-nav-link"
              href="#root"
              onClick={(e) => scrollToSection(e, "#root")}
            >
              {t("navbar.home")}
            </a>
          </li>

          <li>
            <a
              className="custom-nav-link"
              href="#aboutSection"
              onClick={(e) => scrollToSection(e, "#aboutSection")}
            >
              {t("navbar.about")}
            </a>
          </li>

          <li>
            <a
              className="custom-nav-link"
              href="#engagement"
              onClick={(e) => scrollToSection(e, "#engagement")}
            >
              {t("navbar.commitment")}
            </a>
          </li>

          <li>
            <a
              className="custom-nav-link"
              href="#actualitySection"
              onClick={(e) => scrollToSection(e, "#actualitySection")}
            >
              {t("navbar.news")}
            </a>
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

          {/* Bouton Don dans le menu mobile */}
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
        </ul>

        {/* Bouton Don desktop */}
        {!hideDonate && (
          <button
            className="don-button desktop-don"
            onClick={() => navigate("/don")}
          >
            {t("navbar.donate")}
          </button>
        )}
      </div>
    </nav>
  );
}