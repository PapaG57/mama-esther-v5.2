import React, { useState, useRef } from "react";
import { newsletters } from "../data/newsletters";
import VerifiedLink from "./VerifiedLink"; // Bouton lien intelligent
import "./NewsletterCarousel.css";
import { useTranslation } from "react-i18next";

// Composant principal du carrousel
function NewsletterCarousel() {
  const { t } = useTranslation();
  const [selectedTag, setSelectedTag] = useState("all"); // Tag sélectionné
  const carouselRef = useRef(null); // Référence du carrousel

  // Extrait tous les tags uniques présents dans les newsletters
  const allTags = [...new Set(newsletters.flatMap((nl) => nl.tags))];

  // Filtrage des newsletters selon le tag sélectionné
  const filteredNewsletters =
    selectedTag === "all"
      ? newsletters
      : newsletters.filter((nl) => nl.tags.includes(selectedTag));

  // Scroll vers la gauche
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Scroll vers la droite
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="carousel-container">
      {/* Filtres par tags */}
      <div className="tag-filter">
        <button
          onClick={() => setSelectedTag("all")}
          className={selectedTag === "all" ? "active" : ""}
        >
          {t("newsletters.filterAll")}
        </button>
        {allTags.map((tagKey) => (
          <button
            key={tagKey}
            onClick={() => setSelectedTag(tagKey)}
            className={selectedTag === tagKey ? "active" : ""}
          >
            {t(tagKey)}
          </button>
        ))}
      </div>

      {/* Carrousel horizontal avec flèches */}
      <div className="carousel-wrapper">
        <button className="arrow-news arrow-left" onClick={scrollLeft}>
          ⬅️
        </button>

        <div className="carousel-track-news" ref={carouselRef}>
          {filteredNewsletters.map((nl) => (
            <div className="card-news" key={nl.id}>
              <img src={nl.coverImage} alt={`Couverture ${t(nl.titleKey)}`} />
              <div className="card-content-news">
                <h3>{t(nl.titleKey)}</h3>
                <p>{t(nl.summaryKey)}</p>

                <div className="spacer"></div>

                <div className="card-footer-news">
                  <div className="links-footer">
                    {/* 🌐 Lien vérifié vers la version en ligne */}
                    <VerifiedLink href={nl.htmlPath}>
                      {t("newsletters.viewOnline")}
                    </VerifiedLink>{" "}
                    • {/* 📄 Lien vers le PDF */}
                    <a href={nl.pdfPath} target="_blank" rel="noreferrer">
                      {t("newsletters.viewPdf")}
                    </a>
                  </div>

                  {/* Tags associés */}
                  <div className="tags-footer">
                    {nl.tags.map((tagKey) => (
                      <span key={tagKey}>#{t(tagKey)}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="arrow-news arrow-right" onClick={scrollRight}>
          ➡️
        </button>
      </div>
    </section>
  );
}

export default NewsletterCarousel;
