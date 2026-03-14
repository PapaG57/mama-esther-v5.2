import React, { useState, useEffect } from "react";
import "../styles/NewsletterV2.css";
import { useTranslation } from "react-i18next";
import { newsletterService } from "../api/services";
import { newsletters as staticNewsletters } from "../data/newsletters";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import HandSpinner from "../components/HandSpinner";

const NewsletterV2 = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const separator = { isSeparator: true, img: "/assets/actualities/cameroun-village.webp" };
  const [fullList, setFullList] = useState([separator]);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await newsletterService.getAll();
        let newsData = res.data;
        
        // Si le backend est vide, on utilise les données statiques transformées pour être compatibles
        if (!newsData || newsData.length === 0) {
          newsData = staticNewsletters.map(nl => ({
            ...nl,
            newsletterNumber: nl.id,
            // Pour le résumé, on utilise la clé de traduction si c'est un objet complexe attendu
            summary: {
              fr: t(nl.summaryKey, { lng: 'fr' }),
              en: t(nl.summaryKey, { lng: 'en' })
            }
          }));
        }

        if (newsData && newsData.length > 0) {
          // Tri par date décroissante
          newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
          
          const listWithSeparator = [...newsData, separator];
          setFullList(listWithSeparator);
          setScrollIndex(listWithSeparator.length); 
        }
      } catch (err) {
        console.error("Erreur chargement newsletters:", err);
        // Fallback en cas d'erreur serveur
        const fallbackData = staticNewsletters.map(nl => ({
          ...nl,
          newsletterNumber: nl.id,
          summary: {
            fr: t(nl.summaryKey, { lng: 'fr' }),
            en: t(nl.summaryKey, { lng: 'en' })
          }
        })).sort((a, b) => new Date(b.date) - new Date(a.date));

        const listWithSeparator = [...fallbackData, separator];
        setFullList(listWithSeparator);
        setScrollIndex(listWithSeparator.length);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [t]);

  const displayItems = [...fullList, ...fullList, ...fullList];

  const nextSlide = () => setScrollIndex((prev) => prev + 1);
  const prevSlide = () => setScrollIndex((prev) => prev - 1);

  useEffect(() => {
    if (fullList.length <= 1) return; // Ne pas faire de scroll infini si vide

    if (scrollIndex === fullList.length * 2) {
      setTimeout(() => {
        const track = document.querySelector('.v2-newsletter-track');
        if (track) track.style.transition = 'none';
        setScrollIndex(fullList.length);
        setTimeout(() => {
          if (track) track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        }, 50);
      }, 500);
    }
    if (scrollIndex === fullList.length - 1) {
      setTimeout(() => {
        const track = document.querySelector('.v2-newsletter-track');
        if (track) track.style.transition = 'none';
        setScrollIndex(fullList.length * 2 - 1);
        setTimeout(() => {
          if (track) track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        }, 50);
      }, 500);
    }
  }, [scrollIndex, fullList.length]);

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

  const itemWidth = window.innerWidth <= 768 ? 200 : 240;
  const gap = 30;

  return (
    <section className="v2-newsletter">
      <div className="v2-container">
        <div className="v2-newsletter-flex">
          
          <div className="v2-newsletter-text">
            <span className="v2-subtitle">{t("actuality.pdfTitle")}</span>
            <h2 className="v2-title">{t("v2.actuality.subscribeTitle")}</h2>
            <p>{t("v2.actuality.subscribeText")}</p>
            
            <form className="v2-subscribe-form" onSubmit={handleSubscribe}>
              <FontAwesomeIcon icon={faEnvelope} className="v2-form-icon" style={{margin: 'auto 0 auto 20px', color: '#ccc'}} />
              <input 
                type="email" 
                placeholder={t("v2.actuality.emailPlaceholder")} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={isSubmitting} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {isSubmitting ? <HandSpinner /> : t("v2.btns.subscribe")}
              </button>
            </form>
          </div>

          <div className="v2-newsletter-right-side">
            <div className="v2-newsletter-grid-wrapper">
              <div 
                className="v2-newsletter-track"
                style={{ transform: `translateX(-${scrollIndex * (itemWidth + gap)}px)` }}
              >
                {loading ? (
                  <div style={{width: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><HandSpinner /></div>
                ) : displayItems.map((item, i) => (
                  item.isSeparator ? (
                    <div className="v2-magazine-separator" key={i}>
                      <img src={item.img} alt="Separator" />
                    </div>
                  ) : (
                    <a href={item.pdfPath} target="_blank" rel="noreferrer" className="v2-magazine-item" key={i}>
                      <div className="v2-magazine-cover">
                        <div className="v2-mag-header">
                          <img 
                            src="/assets/logos/logoMama.png" 
                            alt="Logo Mama Esther" 
                            style={{ width: '50px', marginBottom: '15px', filter: 'brightness(0) invert(1)' }} 
                          />
                          <span>{t("v2.hero.associationName").split(' ')[0]}</span>
                          <div className="v2-mag-title">Mama Esther</div>
                        </div>
                        
                        <div className="v2-mag-footer">
                          <div className="v2-mag-date" style={{textTransform: 'capitalize'}}>
                            {new Date(item.date).toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        <div className="v2-mag-number">#{item.newsletterNumber}</div>
                      </div>
                    </a>
                  )
                ))}
              </div>
            </div>

            {/* Contrôles de navigation */}
            <div className="v2-mag-nav-controls">
              <button className="v2-mag-nav-btn" onClick={prevSlide} disabled={fullList.length <= 1}><FontAwesomeIcon icon={faChevronLeft} /></button>
              <button className="v2-mag-nav-btn" onClick={nextSlide} disabled={fullList.length <= 1}><FontAwesomeIcon icon={faChevronRight} /></button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsletterV2;
