import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { newsletterService } from "../api/services";
import { newsletters as staticNewsletters } from "../data/newsletters";
import Navbar from "../components/Navbar";
import HandSpinner from "../components/HandSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import "../styles/AdminNewsletterEditor.css"; // Réutilisation des styles du magazine

const NewsletterView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const res = await newsletterService.getById(id);
        setNewsletter(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de la newsletter:", err);
        // Fallback sur les données statiques si non trouvé en BDD
        const staticNl = staticNewsletters.find(nl => nl.id.toString() === id.toString());
        if (staticNl) {
          setNewsletter({
            ...staticNl,
            title: { 
              fr: t(staticNl.titleKey, {lng: 'fr'}), 
              en: t(staticNl.titleKey, {lng: 'en'}) 
            },
            content: staticNl.fullContent
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNewsletter();
  }, [id, t]);

  if (loading) return <HandSpinner />;
  if (!newsletter) return <div className="v2-container" style={{padding: '100px 0', textAlign: 'center'}}><h2>Newsletter non trouvée</h2><button className="v2-btn v2-btn-green" onClick={() => navigate('/')}>Retour</button></div>;

  const currentLang = i18n.language.split("-")[0]; // 'fr' ou 'en'
  const content = newsletter.content[currentLang] || newsletter.content['fr'] || [];
  
  const edito = content.find(b => b.type === 'edito');
  const articles = content.filter(b => b.type !== 'edito');

  return (
    <div className="newsletter-editor-layout preview-mode" style={{paddingTop: '100px', paddingBottom: '100px'}}>
      <Navbar hideDonate={true} />
      
      <div className="v2-container" style={{marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <button className="v2-btn v2-btn-outline" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} style={{marginRight: '10px'}} />
          {t("actuality.back")}
        </button>
        {newsletter.pdfPath && (
          <a href={newsletter.pdfPath} target="_blank" rel="noopener noreferrer" className="v2-btn v2-btn-yellow">
            <FontAwesomeIcon icon={faFilePdf} style={{marginRight: '10px'}} />
            {t("newsletters.downloadPdf")}
          </a>
        )}
      </div>

      <div className="editor-container">
        {/* BANNIERE */}
        <div className="mag-header-banner">
          <img src={newsletter.bannerImage || "/assets/actualities/actuality7.webp"} alt="Banner" />
        </div>

        <div className="mag-content-padding">
          <h1 className="mag-main-title">
            {newsletter.title[currentLang] || newsletter.title['fr']}
          </h1>

          {/* EDITO */}
          {edito && (
            <div className="mag-edito-box">
              <div className="mag-edito-left">
                <img 
                  src={edito.image || "/assets/mentions/president-mama.webp"} 
                  alt="Edito" 
                  className="mag-edito-img" 
                />
              </div>
              <div className="mag-edito-right">
                <div className="edito-text" dangerouslySetInnerHTML={{ __html: edito.content }} />
              </div>
            </div>
          )}

          {/* ARTICLES */}
          <div className="mag-articles-list">
            {articles.map((article, idx) => (
              <div className="mag-article-row" key={idx}>
                <div className="mag-article-img-box">
                  <img src={article.image || "/assets/actualities/news.webp"} alt={article.title || "Article"} />
                </div>
                <div className="mag-article-text-box">
                  <div className="mag-article-text" dangerouslySetInnerHTML={{ __html: article.text }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER INTERNE MAGAZINE */}
        <div className="mag-footer-v2">
          <img src="/assets/logos/logoMama.png" alt="Logo" className="mag-footer-logo" />
          <p>{t("v2.footer.associationName")}</p>
          <div className="mag-footer-btns">
            <button className="mag-btn-news" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              {t("v2.btns.backToTop")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterView;
