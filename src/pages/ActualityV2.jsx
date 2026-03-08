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
      img: "/assets/actualities/actuality1.webp", 
      title: t("actuality.articles.article2.title") 
    },
    { 
      slug: "signature-agrement",
      img: "/assets/actualities/actuality2.webp", 
      title: t("actuality.articles.article1.title") 
    },
    { 
      slug: "preparation-parpaings",
      img: "/assets/actualities/actuality3.webp", 
      title: t("actuality.articles.article3.title") 
    },
    { 
      slug: "abattage-arbres",
      img: "/assets/actualities/actuality4.webp", 
      title: t("actuality.articles.article4.title") 
    },
    { 
      slug: "delimitation-terrain",
      img: "/assets/actualities/actuality5.webp", 
      title: t("actuality.articles.article5.title") 
    },
    { 
      slug: "pose-premiere-pierre",
      img: "/assets/actualities/actuality6.webp", 
      title: t("actuality.articles.article6.title") 
    },
    { 
      slug: "elevation-murs",
      img: "/assets/actualities/actuality7.webp", 
      title: t("actuality.articles.article7.title") 
    },
    { 
      slug: "derniers-moellons",
      img: "/assets/actualities/actuality8.webp", 
      title: t("actuality.articles.article8.title") 
    },
    { 
      slug: "cameroun",
      img: "/assets/actualities/cameroun-village.webp", 
      title: t("actuality.articles.article9.title"), 
      isNeutral: true 
    },
  ];

  const handleNavigate = (slug) => {
    navigate(`/actualities#${slug}`);
  };

  // Doubler la liste pour créer l'effet de boucle infinie sans saut
  const infiniteItems = [...newsItems, ...newsItems];

  return (
    <section className="v2-news">
      <div className="v2-container">
        <div className="v2-section-header">
          <span className="v2-subtitle">{t("actuality.title")}</span>
          <h2 className="v2-title">{t("actualitySection.title")}</h2>
        </div>

        <div className="v2-news-slider">
          <div className="v2-news-track">
            {infiniteItems.map((item, index) => (
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
