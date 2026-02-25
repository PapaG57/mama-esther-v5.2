import React from "react";
import "./header.css";
import BibleVerse from "../components/BibleVerse";
import { useTranslation } from "react-i18next";

function Header() {
  const { t } = useTranslation();
  return (
    <header>
      <div className="header-wrapper">
        <div className="header-main">
          <div className="header-overlay"></div>

          <div className="header-container">
            <div className="header-text-block">
              <h2 className="header-subtitle">
                {t("header.welcome")}
              </h2>

              <h1 className="header-title">
                {t("header.title")}
              </h1>

              <p className="header-text">
                {t("header.subtitle")}
              </p>
            </div>

            <div className="bible-card">
              <BibleVerse
                text="bibleVerses.matthew25_40.text"
                reference="bibleVerses.matthew25_40.ref"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
