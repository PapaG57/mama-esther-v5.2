import React, { useEffect } from "react";
import "../styles/ActualityPageV2.css";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faTag } from "@fortawesome/free-solid-svg-icons";

const ActualityPageV2 = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const news = [
    {
      id: 1,
      slug: "visite-terrain",
      title: t("actuality.articles.article2.title"),
      date: "20 octobre 2024",
      category: "terrain",
      img: "/assets/actualities/actuality1.png",
      content: t("actuality.articles.article2.content")
    },
    {
      id: 2,
      slug: "signature-agrement",
      title: t("actuality.articles.article1.title"),
      date: "1er septembre 2024",
      category: "institutionnel",
      img: "/assets/actualities/actuality2.png",
      content: t("actuality.articles.article1.content")
    },
    {
      id: 3,
      slug: "pose-de-la-première-pierre",
      title: t("actuality.articles.article3.title"),
      date: "21 mai 2025",
      category: "travaux",
      img: "/assets/actualities/actuality3.png",
      content: "Les fondations sont terminées. La pose de la première pierre a été effectuée par notre grande sœur qui est aussi notre maîtresse d'œuvre, aidée de notre grand frère qui est aussi notre administrateur chantier, marquant le début officiel des travaux de construction de ce bâtiment qui se veut être d'abord un orphelinat, et aussi un refuge sûr et chaleureux pour les personnes en grande difficulté. C'est une étape symbolique qui nous rapproche de notre objectif de fournir un foyer aimant et des opportunités d'éducation pour les enfants vulnérables de la région. Nous sommes impatients de voir ce projet prendre vie et de continuer à travailler pour améliorer la vie de ces enfants et des personnes qui en auront besoin."
    }
  ];

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  }, [location]);

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      {/* HERO SECTION */}
      <section className="actu-v2-hero">
        <div className="v2-container">
          <div className="actu-v2-hero-content">
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>{t("v2.actuality.heroSubtitle")}</span>
            <h1 className="v2-title" style={{color: "white"}}>{t("v2.actuality.heroTitle")}</h1>
          </div>
        </div>
      </section>

      {/* ARTICLES LIST - FULL CONTENT */}
      <section className="actu-v2-full-list">
        <div className="v2-container">
          {news.map((item) => (
            <article className="actu-full-card" key={item.id} id={item.slug}>
              <div className="actu-full-img">
                <img src={item.img} alt={item.title} />
              </div>
              <div className="actu-full-body">
                <div className="actu-full-meta">
                  <span><FontAwesomeIcon icon={faCalendarAlt} /> {item.date}</span>
                  <span className="actu-full-tag"><FontAwesomeIcon icon={faTag} /> {item.category}</span>
                </div>
                <h2>{item.title}</h2>
                <div className="actu-full-content">
                  {item.content?.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <div className="actu-full-divider"></div>
              </div>
            </article>
          ))}
        </div>
      </section>

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
