import React, { useState } from "react";
import "./ActualityPageV2.css";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";

const ActualityPageV2 = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");

  const news = [
    {
      id: 1,
      title: "Signature des documents pour l'agrément",
      date: "25 Février 2025",
      category: "institutionnel",
      img: "/assets/actualities/actuality1.png",
      excerpt: "Un jour mémorable pour l'association Mama Esther. La création a été officiellement reconnue par le tribunal de Thionville...",
      featured: true
    },
    {
      id: 2,
      title: "Arrivée des fournitures à l'orphelinat",
      date: "12 Janvier 2025",
      category: "terrain",
      img: "/assets/actualities/actuality2.png",
      excerpt: "Grâce à vos dons, les enfants ont pu reprendre le chemin de l'école avec tout le matériel nécessaire."
    },
    {
      id: 3,
      title: "Projet Puits : L'eau arrive enfin",
      date: "05 Décembre 2024",
      category: "travaux",
      img: "/assets/actualities/news.png",
      excerpt: "Le forage est terminé. C'est une nouvelle vie qui commence pour les pensionnaires et le voisinage."
    },
    {
      id: 4,
      title: "Nouveau partenariat avec l'ONG locale",
      date: "20 Novembre 2024",
      category: "institutionnel",
      img: "/assets/actualities/actuality1.png",
      excerpt: "Une collaboration stratégique pour renforcer notre impact sur les régions reculées du Cameroun."
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
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>Le Journal de l'Impact</span>
            <h1 className="v2-title" style={{color: "white"}}>Récits du terrain & <br/>actualités</h1>
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      {filter === "all" && featuredArticle && (
        <section className="actu-v2-featured">
          <div className="v2-container">
            <div className="featured-card" onClick={() => window.location.href='/actualities'}>
              <div className="featured-img">
                <img src={featuredArticle.img} alt={featuredArticle.title} />
              </div>
              <div className="featured-text">
                <span className="actu-tag featured-tag">À la une</span>
                <span className="actu-date">{featuredArticle.date}</span>
                <h2>{featuredArticle.title}</h2>
                <p>{featuredArticle.excerpt}</p>
                <button className="v2-link-btn">Lire l'article complet →</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FILTER & GRID */}
      <section className="actu-v2-grid-section">
        <div className="v2-container">
          <div className="actu-filters">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Tout</button>
            <button className={filter === 'terrain' ? 'active' : ''} onClick={() => setFilter('terrain')}>Actions Terrain</button>
            <button className={filter === 'travaux' ? 'active' : ''} onClick={() => setFilter('travaux')}>Infrastructures</button>
            <button className={filter === 'institutionnel' ? 'active' : ''} onClick={() => setFilter('institutionnel')}>Vie de l'ONG</button>
          </div>

          <div className="actu-grid">
            {otherArticles.map((item) => (
              <div className="actu-card" key={item.id} onClick={() => window.location.href='/actualities'}>
                <div className="actu-card-img">
                  <img src={item.img} alt={item.title} />
                  <span className="actu-tag-overlay">{item.category}</span>
                </div>
                <div className="actu-card-body">
                  <span className="actu-date">{item.date}</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                  <span className="read-more">Continuer la lecture →</span>
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
            <h2>Ne manquez aucune nouvelle</h2>
            <p>Recevez nos derniers récits d'impact directement dans votre boîte mail.</p>
            <div className="v2-subscribe-mini" style={{maxWidth: '500px', margin: '0 auto'}}>
              <input type="email" placeholder="Votre adresse email" />
              <button>S'abonner</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActualityPageV2;
