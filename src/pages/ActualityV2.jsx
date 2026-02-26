import React from "react";
import "../styles/ActualityV2.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ActualityV2 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // On peut réutiliser les assets existants
  const newsItems = [
    { img: "/assets/actualities/actuality1.png", title: t("actuality.articles.article1.title") },
    { img: "/assets/actualities/actuality2.png", title: t("actuality.articles.article2.title") },
    { img: "/assets/actualities/news.png", title: t("actuality.articles.article3.title") },
    { img: "/assets/actualities/actuality1.png", title: t("actuality.articles.article1.title") },
  ];

  return (
    <section className="v2-news">
      <div className="v2-container">
        <div className="v2-section-header">
          <span className="v2-subtitle">{t("actuality.title")}</span>
          <h2 className="v2-title">{t("actualitySection.title")}</h2>
        </div>

        <div className="v2-news-slider">
          <div className="v2-news-track">
            {/* On double les items pour l'effet infini fluide */}
            {[...newsItems, ...newsItems].map((item, index) => (
              <div className="v2-news-card" key={index} onClick={() => navigate('/actualities')}>
                <div className="v2-news-img-wrapper">
                  <img src={item.img} alt={item.title} />
                  <div className="v2-news-overlay">
                    <span>{t("v2.common.seeMore")}</span>
                  </div>
                </div>
                <div className="v2-news-info">
                  <h4>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActualityV2;
