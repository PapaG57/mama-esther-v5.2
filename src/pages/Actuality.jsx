import React, { useState } from "react";
import "../styles/ActualityPageV2.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ActualityPageV2 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const news = [
    {
      id: 1,
      title: t("actuality.articles.article1.title"),
      date: "25 Février 2025",
      category: "institutionnel",
      img: "/assets/actualities/actuality1.png",
      excerpt: t("actuality.articles.article1.content").substring(0, 150) + "...",
      featured: true
    },
    {
      id: 2,
      title: t("actuality.articles.article2.title"),
      date: "12 Janvier 2025",
      category: "terrain",
      img: "/assets/actualities/actuality2.png",
      excerpt: t("actuality.articles.article2.content").substring(0, 150) + "..."
    },
    {
      id: 3,
      title: t("actuality.articles.article3.title"),
      date: "05 Décembre 2024",
      category: "travaux",
      img: "/assets/actualities/news.png",
      excerpt: "Le forage est terminé. C'est une nouvelle vie qui commence pour les pensionnaires et le voisinage."
    }
  ];

  const filteredNews = filter === "all" ? news : news.filter(n => n.category === filter);
  const featuredArticle = news.find(n => n.featured);
  const otherArticles = filteredNews.filter(n => !n.featured || filter !== "all");

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      {/* HERO ACTU */}
      <section className="actu-v2-hero">
        <div className="v2-container">
          <div className="actu-v2-hero-content">
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>{t("v2.actuality.heroSubtitle")}</span>
            <h1 className="v2-title" style={{color: "white"}}>{t("v2.actuality.heroTitle")}</h1>
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      {filter === "all" && featuredArticle && (
        <section className="actu-v2-featured">
          <div className="v2-container">
            <div className="featured-card" onClick={() => navigate('/actualities')}>
              <div className="featured-img">
                <img src={featuredArticle.img} alt={featuredArticle.title} />
              </div>
              <div className="featured-text">
                <span className="actu-tag featured-tag">{t("v2.actuality.featuredTag")}</span>
                <span className="actu-date">{featuredArticle.date}</span>
                <h2>{featuredArticle.title}</h2>
                <p>{featuredArticle.excerpt}</p>
                <button className="v2-link-btn">{t("v2.actuality.readFullArticle")} →</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FILTER & GRID */}
      <section className="actu-v2-grid-section">
        <div className="v2-container">
          <div className="actu-filters">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>{t("v2.actuality.filterAll")}</button>
            <button className={filter === 'terrain' ? 'active' : ''} onClick={() => setFilter('terrain')}>{t("v2.actuality.filterTerrain")}</button>
            <button className={filter === 'travaux' ? 'active' : ''} onClick={() => setFilter('travaux')}>{t("v2.actuality.filterInfra")}</button>
            <button className={filter === 'institutionnel' ? 'active' : ''} onClick={() => setFilter('institutionnel')}>{t("v2.actuality.filterNGO")}</button>
          </div>

          <div className="actu-grid">
            {otherArticles.map((item) => (
              <div className="actu-card" key={item.id} onClick={() => navigate('/actualities')}>
                <div className="actu-card-img">
                  <img src={item.img} alt={item.title} />
                  <span className="actu-tag-overlay">{item.category}</span>
                </div>
                <div className="actu-card-body">
                  <span className="actu-date">{item.date}</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <span className="read-more">{t("v2.common.continueReading")} →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="actu-v2-subscribe">
        <div className="v2-container">
          <div className="subscribe-box">
            <h2>{t("v2.actuality.subscribeTitle")}</h2>
            <p>{t("v2.actuality.subscribeText")}</p>
            <div className="v2-subscribe-mini" style={{maxWidth: '500px', margin: '0 auto'}}>
              <input type="email" placeholder={t("v2.actuality.emailPlaceholder")} />
              <button>{t("v2.btns.subscribe")}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActualityPageV2;
