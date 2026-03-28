import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTools, faExclamationTriangle, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../styles/components/maintenance-notice.css";

const MaintenanceNotice = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // On vérifie si l'utilisateur a déjà vu le message durant cette session
    const hasSeenNotice = sessionStorage.getItem("maintenanceNoticeSeen");
    if (!hasSeenNotice) {
      // Petit délai pour laisser le site charger visuellement
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("maintenanceNoticeSeen", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="maintenance-overlay">
      <div className="maintenance-modal">
        <button className="maintenance-close-btn" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <div className="maintenance-icon">
          <FontAwesomeIcon icon={faTools} />
        </div>
        
        <h2>{t("v2.maintenance.title")}</h2>
        <p>{t("v2.maintenance.text")}</p>
        
        <div className="maintenance-footer">
           <button className="v2-btn v2-btn-primary" onClick={handleClose}>
             {t("v2.maintenance.close")}
           </button>
        </div>
        
        <div className="maintenance-badge">
          <FontAwesomeIcon icon={faExclamationTriangle} /> EN COURS
        </div>
      </div>
    </div>
  );
};

export default MaintenanceNotice;
