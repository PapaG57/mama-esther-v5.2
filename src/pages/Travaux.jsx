import React from "react";
import "../styles/TravauxV2.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHammer, faEnvelope, faArrowLeft, faTools } from "@fortawesome/free-solid-svg-icons";

const TravauxV2 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      <main className="construction-v2-container">
        <div className="v2-container">
          <div className="construction-v2-content">
            
            {/* Icône animée */}
            <div className="construction-icon-wrapper">
              <div className="icon-circle-bg"></div>
              <FontAwesomeIcon icon={faTools} className="main-construction-icon" />
            </div>

            <span className="v2-subtitle">{t("construction.title")}</span>
            <h1 className="v2-title">Cette page se refait une beauté</h1>
            
            <p className="construction-text">
              {t("construction.subtitle")}
            </p>

            <div className="construction-btns">
              <button className="v2-btn v2-btn-outline-green" onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faArrowLeft} style={{marginRight: '10px'}} />
                {t("v2.common.back")}
              </button>
              <button className="v2-btn v2-btn-primary" onClick={() => navigate("/contact")}>
                <FontAwesomeIcon icon={faEnvelope} style={{marginRight: '10px'}} />
                {t("construction.writeUs")}
              </button>
            </div>

            {/* Décoration discrète */}
            <div className="construction-decoration">
              <div className="deco-line"></div>
              <span>Association Mama Esther</span>
              <div className="deco-line"></div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default TravauxV2;
