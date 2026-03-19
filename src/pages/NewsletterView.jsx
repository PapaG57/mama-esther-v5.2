import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { newsletterService } from "../api/services";
import { newsletters as staticNewsletters } from "../data/newsletters";
import Navbar from "../components/Navbar";
import Footer from '../components/Footer'; 
import HandSpinner from "../components/HandSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFilePdf, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import "../styles/NewsletterMagazine.css";

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
        console.error("Erreur récup API, passage en statique:", err);
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

  if (loading) return <HandSpinner fullPage={true} />;
  
  if (!newsletter) return (
    <>
      <Navbar hideDonate={true} />
      <div className="newsletter-magazine-container" style={{padding: '150px 0', textAlign: 'center'}}>
        <h2>Newsletter non trouvée</h2>
        <button className="v2-btn v2-btn-green" onClick={() => navigate('/')}>Retour</button>
      </div>
      <Footer />
    </>
  );

  const currentLang = i18n.language.split("-")[0]; 
  const content = newsletter.content?.[currentLang] || newsletter.content?.['fr'] || [];
  
  const edito = content.find(b => b.type === 'edito');
  const blocks = content.filter(b => b.type !== 'edito');

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="newsletter-view-page">
      <Navbar hideDonate={true} />
      
      <div className="newsletter-magazine-container" style={{paddingTop: '160px'}}>
        
        {/* BARRE D'ACTIONS TOP (Web Only) */}
        <div className="v2-container" style={{marginBottom: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px'}}>
          <button className="mag-action-btn" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} style={{marginRight: '10px'}} />
            {t("actuality.back")}
          </button>
        </div>

        {/* LA FEUILLE DE MAGAZINE (MIROIR PDF) */}
        <article className="mag-paper-sheet">
          
          {/* HEADER PDF IMAGE UNIFIÉ */}
          <div className="mag-hero-banner">
            <img src="/assets/covers/banner-news.webp" alt="Mama Esther Newsletter Header" />
          </div>

          {/* GROS TITRE PDF */}
          <div className="mag-pdf-header-text">
            <h1>{newsletter.headerTitle || "NEWSLETTER"}</h1>
          </div>

          <div className="mag-double-separator"></div>

          {/* EDITO BLEU */}
          {edito && (
            <section className="mag-edito-section">
              <div className="mag-edito-left">
                <h2>{edito.title || t("v2.actuality.newsletterTitle")}</h2>
                <img 
                  src={edito.image || "/assets/mentions/president-mama.webp"} 
                  alt="President" 
                  className="mag-edito-photo"
                />
              </div>
              <div className="mag-edito-text">
                <div dangerouslySetInnerHTML={{ __html: edito.content }} />
              </div>
            </section>
          )}

          <div className="mag-double-separator"></div>

          {/* CONTENU DES ARTICLES */}
          {blocks.map((block, idx) => {
            if (block.type === 'thanks-card') {
              return (
                <React.Fragment key={idx}>
                  <div className="mag-article-full-block">
                    {block.title && <h2 className="mag-section-title">{block.title}</h2>}
                    <div className="mag-article-content full-width">
                      <div className="mag-text-block">
                        <div dangerouslySetInnerHTML={{ __html: block.text }} />
                      </div>
                      {block.images && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '50px', flexWrap: 'wrap' }}>
                          {block.images.map((img, iIdx) => (
                            <img key={iIdx} src={img} alt="Thanks" className="mag-oval-img" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mag-double-separator"></div>
                </React.Fragment>
              );
            }

            const isFullWidth = block.type === 'impact-card' || !block.image;
            return (
              <React.Fragment key={idx}>
                <div className="mag-article-full-block">
                  {block.title && <h2 className="mag-section-title">{block.title}</h2>}
                  
                  <div className={`mag-article-content ${isFullWidth ? 'full-width' : ''}`}>
                    {block.images ? (
                      <div className="mag-article-main-img-wrapper">
                        {block.images.map((img, iIdx) => (
                          <img key={iIdx} src={img} alt={`Side ${iIdx}`} className="mag-main-img" />
                        ))}
                      </div>
                    ) : block.image ? (
                      <div className="mag-article-main-img-wrapper">
                        <img src={block.image} alt="Main" className="mag-main-img" />
                      </div>
                    ) : null}
                    <div className="mag-text-block">
                      <div dangerouslySetInnerHTML={{ __html: block.text }} />
                    </div>
                  </div>

                  {block.gallery && (
                    <div className="mag-images-grid">
                      {block.gallery.map((img, gIdx) => (
                        <img key={gIdx} src={img} alt="Gallery" className="mag-grid-img" />
                      ))}
                    </div>
                  )}
                </div>
                <div className="mag-double-separator"></div>
              </React.Fragment>
            );
          })}

          {/* BOUTON TELECHARGER PDF (JUSTE AVANT LE FOOTER) */}
          {newsletter.pdfPath && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <a href={newsletter.pdfPath} target="_blank" rel="noopener noreferrer" className="mag-action-btn" style={{ padding: '18px 40px', fontSize: '1.1rem' }}>
                <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '12px' }} />
                {t("newsletters.downloadAsPdf")}
              </a>
            </div>
          )}

          {/* FOOTER BLEU PDF UNIFIÉ */}
          <footer className="mag-pdf-footer">
            <img src="/assets/logos/footer_logoME.png" alt="Logo" className="mag-footer-logo" />
            <div style={{ marginBottom: '30px' }}>
              <p>© {new Date(newsletter.date).getFullYear()} - ASSOCIATION MAMA ESTHER - TOUS DROITS RÉSERVÉS</p>
            </div>
            
            <div className="mag-footer-btns">
              <button className="mag-action-btn" onClick={() => navigate('/contact')}>
                {t("footer.contactWriteUs") || "Contactez-nous !"}
              </button>
              <button className="mag-action-btn" onClick={() => navigate('/mentions-legales')}>
                {t("footer.serviceLegal") || "Mentions légales"}
              </button>
              <button className="mag-action-btn" style={{ opacity: 0.8 }} onClick={() => navigate('/unsubscribe')}>
                {t("unsubscribe.title")}
              </button>
            </div>
          </footer>

        </article>

        {/* BOUTON REMONTER (Web Only) */}
        <div className="v2-container" style={{padding: '40px 0', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '20px'}}>
          <button className="mag-action-btn" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} style={{marginRight: '10px'}} />
            {t("actuality.back")}
          </button>
          <button className="mag-action-btn" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <FontAwesomeIcon icon={faChevronUp} style={{marginRight: '10px'}} />
            {t("topbar.backToTop")}
          </button>
        </div>

      </div>


    </div>
  );
};

export default NewsletterView;
