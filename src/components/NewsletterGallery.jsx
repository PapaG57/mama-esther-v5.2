import React, { useState, useEffect } from "react";
import "../styles/components/NewsletterGalerry.css";
import { useTranslation } from "react-i18next";
import { newsletterService } from "../api/services";
import { newsletters as staticNewsletters } from "../data/newsletters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faGlobe, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import HandSpinner from "./HandSpinner";
import { useNavigate } from "react-router-dom";

function NewsletterGallery() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [newsletters, setNewsletters] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);

  const separator = { isSeparator: true, img: "/assets/actualities/cameroun-village.webp" };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await newsletterService.getAll();
        let newsData = res.data;
        
        if (!newsData || newsData.length === 0) {
          newsData = staticNewsletters.map(nl => ({
            ...nl,
            newsletterNumber: nl.id,
            title: { fr: t(nl.titleKey, {lng:'fr'}), en: t(nl.titleKey, {lng:'en'}) }
          }));
        }

        if (newsData && newsData.length > 0) {
          newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
          const listWithSeparator = [...newsData, separator];
          setNewsletters(listWithSeparator);
          setScrollIndex(listWithSeparator.length); 
        }
      } catch (err) {
        console.error("Error loading newsletters:", err);
        const fallbackData = staticNewsletters.map(nl => ({
          ...nl,
          newsletterNumber: nl.id,
          title: { fr: t(nl.titleKey, {lng:'fr'}), en: t(nl.titleKey, {lng:'en'}) }
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
        const listWithSeparator = [...fallbackData, separator];
        setNewsletters(listWithSeparator);
        setScrollIndex(listWithSeparator.length);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [t]);

  const displayItems = [...newsletters, ...newsletters, ...newsletters];

  const nextSlide = () => setScrollIndex((prev) => prev + 1);
  const prevSlide = () => setScrollIndex((prev) => prev - 1);

  useEffect(() => {
    if (newsletters.length <= 1) return;
    if (scrollIndex === newsletters.length * 2) {
      setTimeout(() => {
        const track = document.querySelector('.v2-newsletter-track-gallery');
        if (track) track.style.transition = 'none';
        setScrollIndex(newsletters.length);
        setTimeout(() => {
          if (track) track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        }, 50);
      }, 500);
    }
    if (scrollIndex === newsletters.length - 1) {
      setTimeout(() => {
        const track = document.querySelector('.v2-newsletter-track-gallery');
        if (track) track.style.transition = 'none';
        setScrollIndex(newsletters.length * 2 - 1);
        setTimeout(() => {
          if (track) track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        }, 50);
      }, 500);
    }
  }, [scrollIndex, newsletters.length]);

  const itemWidth = window.innerWidth <= 768 ? 200 : 240;
  const gap = 30;

  return (
    <div className="v2-newsletter-gallery-wrapper">
      <div className="v2-newsletter-right-side">
        <div className="v2-newsletter-grid-wrapper">
          <div 
            className="v2-newsletter-track-gallery"
            style={{ 
              display: 'flex',
              gap: `${gap}px`,
              transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
              transform: `translateX(-${scrollIndex * (itemWidth + gap)}px)` 
            }}
          >
            {loading ? (
              <div style={{width: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><HandSpinner /></div>
            ) : displayItems.map((item, i) => (
              item.isSeparator ? (
                <div className="v2-magazine-separator" key={i}>
                  <img src={item.img} alt="Separator" />
                </div>
              ) : (
                <div className="v2-magazine-item" key={i}>
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
                    
                    {/* BOUTONS GLASSMORPHISM AU CENTRE */}
                    <div className="v2-mag-actions-overlay">
                      <button className="v2-mag-btn-glass" onClick={() => navigate(`/newsletter/view/${item._id || item.id}`)}>
                        <FontAwesomeIcon icon={faGlobe} style={{ color: '#fcd116' }} />
                        {t("newsletters.viewOnline")}
                      </button>
                      <button className="v2-mag-btn-glass" onClick={() => window.open(item.pdfPath, '_blank')}>
                        <FontAwesomeIcon icon={faFilePdf} style={{ color: '#ff4d4d' }} />
                        {t("newsletters.viewPdf")}
                      </button>
                    </div>

                    <div className="v2-mag-footer">
                      <div className="v2-mag-date" style={{textTransform: 'capitalize'}}>
                        {new Date(item.date).toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="v2-mag-number">#{item.newsletterNumber}</div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="v2-mag-nav-controls">
          <button className="v2-mag-nav-btn" onClick={prevSlide} disabled={newsletters.length <= 1}><FontAwesomeIcon icon={faChevronLeft} /></button>
          <button className="v2-mag-nav-btn" onClick={nextSlide} disabled={newsletters.length <= 1}><FontAwesomeIcon icon={faChevronRight} /></button>
        </div>
      </div>
    </div>
  );
}

export default NewsletterGallery;
