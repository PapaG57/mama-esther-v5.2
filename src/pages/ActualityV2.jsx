import React from "react";
import "../styles/ActualityV2.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ActualityV2 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const newsItems = [
    { 
      slug: "visite-terrain",
      img: "/assets/actualities/actuality1.png", 
      title: t("actuality.articles.article2.title") 
    },
    { 
      slug: "signature-agrement",
      img: "/assets/actualities/actuality2.png", 
      title: t("actuality.articles.article1.title") 
    },
    { 
      slug: "premier-coup-de-pelle",
      img: "/assets/actualities/actuality3.png", 
      title: t("actuality.articles.article3.title") 
    },
    { 
      slug: "cameroun",
      img: "/assets/actualities/cameroun-village.jpg", 
      title: t("actuality.articles.article4.title"), 
      isNeutral: true 
    },
  ];

  const handleNavigate = (slug) => {
    // Naviguer vers la page avec le hash qui déclenchera l'ouverture de la modale
    navigate(`/actualities#${slug}`);
  };

  return (
    <section className="v2-news">
      <div className="v2-container">
        <div className="v2-section-header">
          <span className="v2-subtitle">{t("actuality.title")}</span>
          <h2 className="v2-title">{t("actualitySection.title")}</h2>
        </div>

        <div className="v2-news-slider">
          <div className="v2-news-track">
            {[...newsItems, ...newsItems].map((item, index) => (
              <div 
                className={`v2-news-card ${item.isNeutral ? "is-neutral" : ""}`} 
                key={index} 
                onClick={() => !item.isNeutral && handleNavigate(item.slug)}
                style={{ cursor: item.isNeutral ? "default" : "pointer" }}
              >
                <div className="v2-news-img-wrapper">
                  <img src={item.img} alt={item.title} />
                  {!item.isNeutral && (
                    <div className="v2-news-overlay">
                      <span>{t("v2.common.seeMore")}</span>
                    </div>
                  )}
                </div>
                {!item.isNeutral && (
                  <div className="v2-news-info">
                    <h4>{item.title}</h4>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActualityV2;
