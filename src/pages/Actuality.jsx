import React, { useState, useEffect } from "react";
import "../styles/ActualityPageV2.css";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faTag, faChevronLeft, faChevronRight, faPlayCircle, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { newsletterService } from "../api/services";
import { toast } from "react-toastify";

const ActualityPageV2 = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const newsPerPage = 3;

  const news = [
    {
      id: 8,
      slug: "derniers-moellons",
      title: t("actuality.articles.article8.title"),
      date: "17 Août 2025",
      category: "travaux",
      img: "/assets/actualities/actuality8.png",
      content: t("actuality.articles.article8.content"),
      videos: [
        { label: "vidéos murs 1", url: "/assets/videos/construction-finitions.mp4" },
        { label: "vidéos murs 2", url: "/assets/videos/construction-finitions2.mp4" }
      ]
    },
    {
      id: 7,
      slug: "elevation-murs",
      title: t("actuality.articles.article7.title"),
      date: "19 Juin 2025",
      category: "travaux",
      img: "/assets/actualities/actuality7.png",
      content: t("actuality.articles.article7.content")
    },
    {
      id: 6,
      slug: "pose-premiere-pierre",
      title: t("actuality.articles.article6.title"),
      date: "21 Mai 2025",
      category: "travaux",
      img: "/assets/actualities/actuality6.png",
      content: t("actuality.articles.article6.content")
    },
    {
      id: 5,
      slug: "delimitation-terrain",
      title: t("actuality.articles.article5.title"),
      date: "16 Mai 2025",
      category: "travaux",
      img: "/assets/actualities/actuality5.png",
      content: t("actuality.articles.article5.content")
    },
    {
      id: 4,
      slug: "abattage-arbres",
      title: t("actuality.articles.article4.title"),
      date: "22 Avril 2025",
      category: "travaux",
      img: "/assets/actualities/actuality4.png",
      content: t("actuality.articles.article4.content"),
      videos: [
        { label: "Vidéo d'un abattage d'arbre", url: "/assets/videos/Abattage.mp4" },
        { label: "Voir le façonnage des planches", url: "/assets/videos/façonnage-planches.mp4" }
      ]
    },
    {
      id: 3,
      slug: "preparation-parpaings",
      title: t("actuality.articles.article3.title"),
      date: "17 Février 2025",
      category: "travaux",
      img: "/assets/actualities/actuality3.png",
      content: t("actuality.articles.article3.content")
    },
    {
      id: 2,
      slug: "signature-agrement",
      title: t("actuality.articles.article1.title"),
      date: "1er Septembre 2024",
      category: "institutionnel",
      img: "/assets/actualities/actuality2.png",
      content: t("actuality.articles.article1.content")
    },
    {
      id: 1,
      slug: "visite-terrain",
      title: t("actuality.articles.article2.title"),
      date: "20 Octobre 2024",
      category: "terrain",
      img: "/assets/actualities/actuality1.png",
      content: t("actuality.articles.article2.content")
    }
  ];

  const totalNews = news.length;
  const totalPages = Math.ceil(totalNews / newsPerPage);
  
  // Correction de la logique de calcul
  const itemsOnFirstPage = totalNews % newsPerPage || newsPerPage;

  let currentNews = [];
  try {
    if (currentPage === 1) {
      currentNews = news.slice(0, itemsOnFirstPage);
    } else {
      const startIndex = itemsOnFirstPage + (currentPage - 2) * newsPerPage;
      currentNews = news.slice(startIndex, startIndex + newsPerPage);
    }
  } catch (err) {
    console.error("Pagination error:", err);
    currentNews = news.slice(0, newsPerPage);
  }

  // DETECTION AUTOMATIQUE DE LA PAGE VIA LE SLUG
  useEffect(() => {
    if (location.hash) {
      const slug = location.hash.replace("#", "");
      const articleIndex = news.findIndex(n => n.slug === slug);
      
      if (articleIndex !== -1) {
        let targetPage = 1;
        if (articleIndex >= itemsOnFirstPage) {
          targetPage = Math.floor((articleIndex - itemsOnFirstPage) / newsPerPage) + 2;
        }
        
        // Sécurité : ne pas dépasser le nombre de pages
        const safePage = Math.min(targetPage, totalPages);
        setCurrentPage(safePage);

        setTimeout(() => {
          const element = document.getElementById(slug);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 800);
      }
    }
  }, [location.hash, itemsOnFirstPage, totalPages]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await newsletterService.subscribe(email);
      toast.success(t("registration.success"));
      setEmail("");
    } catch (error) {
      toast.error(t("registration.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = selectedVideo ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedVideo]);

  const PaginationControls = () => (
    totalPages > 1 && (
      <div className="v2-pagination">
        <button 
          className="pag-btn" 
          onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo(0, 400); }}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span className="pag-info">
          {t("actuality.pagination", { current: currentPage, total: totalPages })}
        </span>
        <button 
          className="pag-btn" 
          onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo(0, 400); }}
          disabled={currentPage === totalPages}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    )
  );

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      <section className="actu-v2-hero">
        <div className="v2-container">
          <div className="actu-v2-hero-content">
            <span className="v2-subtitle" style={{color: "var(--color-yellow)"}}>{t("v2.actuality.heroSubtitle")}</span>
            <h1 className="v2-title" style={{color: "white"}}>{t("v2.actuality.heroTitle")}</h1>
          </div>
        </div>
      </section>

      <section className="actu-v2-full-list">
        <div className="v2-container">
          <div style={{marginBottom: '40px'}}><PaginationControls /></div>
          {currentNews.map((item) => (
            <article className="actu-full-card" key={item.id} id={item.slug}>
              <div className="actu-full-img"><img src={item.img} alt={item.title} /></div>
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
                {item.videos && (
                  <div className="actu-video-links" style={{marginTop: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                    {item.videos.map((vid, idx) => (
                      <button key={idx} className="v2-btn v2-btn-outline-green" style={{padding: '12px 24px', fontSize: '0.9rem'}} onClick={() => setSelectedVideo(vid.url)}>
                        <FontAwesomeIcon icon={faPlayCircle} style={{marginRight: '10px'}} />
                        {vid.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
          <PaginationControls />
        </div>
      </section>

      {selectedVideo && (
        <div className="v2-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="v2-modal-card video-modal" onClick={(e) => e.stopPropagation()} style={{maxWidth: '700px', padding: '0', background: '#000', maxHeight: '85vh'}}>
            <div className="video-player-container" style={{background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <video src={selectedVideo} controls autoPlay style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
            </div>
            <div style={{padding: '15px', textAlign: 'center', background: '#fff'}}>
               <button className="v2-btn v2-btn-red" style={{padding: '12px 24px', fontSize: '0.9rem'}} onClick={() => setSelectedVideo(null)}>Fermer la vidéo</button>
            </div>
          </div>
        </div>
      )}

      <section className="actu-v2-subscribe">
        <div className="v2-container">
          <div className="subscribe-box">
            <h2>{t("v2.actuality.subscribeTitle")}</h2>
            <p>{t("v2.actuality.subscribeText")}</p>
            <form className="v2-subscribe-form" onSubmit={handleSubscribe} style={{maxWidth: '600px', margin: '0 auto'}}>
              <FontAwesomeIcon icon={faEnvelope} style={{margin: 'auto 0 auto 20px', color: '#ccc', fontSize: '1.2rem'}} />
              <input type="email" placeholder={t("v2.actuality.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button type="submit" disabled={isSubmitting}>{isSubmitting ? "..." : t("v2.btns.subscribe")}</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActualityPageV2;
