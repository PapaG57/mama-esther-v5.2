import React, { useState, useEffect } from "react";
import "../styles/NewsletterV2.css";
import { useTranslation } from "react-i18next";
import { newsletterService } from "../api/services";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import HandSpinner from "../components/HandSpinner";

const NewsletterV2 = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const realNewsletters = [
    { id: 2, date: "Mai 2025", pdf: "/assets/newsletter-pdf/pdf/newsletter2-mai-2025.pdf" },
    { id: 1, date: "Février 2025", pdf: "/assets/newsletter-pdf/pdf/newsletter1-fevrier-2025.pdf" },
  ];

  const separator = { isSeparator: true, img: "/assets/actualities/cameroun-village.webp" };
  const fullList = [...realNewsletters, separator];
  const displayItems = [...fullList, ...fullList, ...fullList];
  
  const [scrollIndex, setScrollIndex] = useState(fullList.length);

  const nextSlide = () => setScrollIndex((prev) => prev + 1);
  const prevSlide = () => setScrollIndex((prev) => prev - 1);

  useEffect(() => {
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
                {displayItems.map((item, i) => (
                  item.isSeparator ? (
                    <div className="v2-magazine-separator" key={i}>
                      <img src={item.img} alt="Separator" />
                    </div>
                  ) : (
                    <a href={item.pdf} target="_blank" rel="noreferrer" className="v2-magazine-item" key={i}>
                      <div className="v2-magazine-cover">
                        <div className="v2-mag-header">
                          <span>{t("v2.hero.associationName").split(' ')[0]}</span>
                          <div className="v2-mag-title">Mama Esther</div>
                        </div>
                        <div className="v2-mag-body">
                          <p style={{fontSize: '0.8rem', opacity: 0.9, lineHeight: 1.4}}>
                            {t("newsletters.list.news1.summary")}
                          </p>
                        </div>
                        <div className="v2-mag-footer">
                          <div className="v2-mag-date">
                            {t(`v2.months.${item.date.split(' ')[0].toLowerCase().replace('é', 'e')}`)} {item.date.split(' ')[1]}
                          </div>
                        </div>
                        <div className="v2-mag-number">#{item.id}</div>
                      </div>
                    </a>
                  )
                ))}
              </div>
            </div>

            {/* Contrôles de navigation en bas et centrés */}
            <div className="v2-mag-nav-controls">
              <button className="v2-mag-nav-btn" onClick={prevSlide}><FontAwesomeIcon icon={faChevronLeft} /></button>
              <button className="v2-mag-nav-btn" onClick={nextSlide}><FontAwesomeIcon icon={faChevronRight} /></button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsletterV2;
