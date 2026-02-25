import React, { useEffect, useState } from "react";
import CamerounButton from "./CamerounButton";
import { useTranslation } from "react-i18next";

// Bouton flottant qui remonte la page
export default function ScrollToTopButton() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  // Affiche le bouton après un certain scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Si le bouton ne doit pas apparaître, on ne l'affiche pas
  if (!isVisible) return null;

  // Bouton stylisé avec CamerounButton
  return (
    <CamerounButton onClick={scrollToTop} className="scroll-top-button">
      ⬆️ {t("topbar.backToTop")}
    </CamerounButton>
  );
}
