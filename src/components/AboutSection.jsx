import React from "react";
import "./about-section.css";
import CamerounButton from "./CamerounButton";
import Divider from "./Divider";
import { useTranslation } from "react-i18next";

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <section id="aboutSection" className="about-container">
      <Divider /> {/* ligne de séparation */}
      <h2 className="about-title green-box">{t("aboutSection.title")}</h2>
      {/* Bloc principal */}
      <div className="about-content">
        <div className="about-text">
          <p className="about-description">
            {t("aboutSection.description1")}
          </p>

          <p className="about-description">
            {t("aboutSection.description2")}
          </p>
          <br />
          <br />

          {/* Lien vers la page de présentation */}
          <CamerounButton to="/about">{t("aboutSection.button")}</CamerounButton>
        </div>
        <div className="about-image">
          <img
            src="/assets/Solidarity-and-unity.png"
            alt="Solidarité et engagement"
          />
        </div>
      </div>
    </section>
  );
}
