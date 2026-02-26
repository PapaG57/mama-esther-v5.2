import React from "react";
import "../styles/NewsletterV2.css";
import { useTranslation } from "react-i18next";

const NewsletterV2 = () => {
  const { t } = useTranslation();

  const newsletters = [
    { id: 1, title: "Février 2025", pdf: "/assets/newsletter-pdf/pdf/newsletter1-fevrier-2025.pdf", cover: "/assets/covers/news1.jpg" },
    { id: 2, title: "Mai 2025", pdf: "/assets/newsletter-pdf/pdf/newsletter2-mai-2025.pdf", cover: "/assets/covers/news2.jpg" },
  ];

  return (
    <section className="v2-newsletter">
      <div className="v2-container">
        <div className="v2-newsletter-flex">
          <div className="v2-newsletter-text">
            <span className="v2-subtitle">{t("actuality.pdfTitle")}</span>
            <h2 className="v2-title">{t("v2.actuality.subscribeTitle")}</h2>
            <p>{t("actuality.pdfText")}</p>
            <div className="v2-subscribe-mini">
              <input type="email" placeholder={t("v2.actuality.emailPlaceholder")} />
              <button>{t("v2.btns.subscribe")}</button>
            </div>
          </div>

          <div className="v2-newsletter-grid">
            {newsletters.map((news) => (
              <a href={news.pdf} target="_blank" rel="noreferrer" className="v2-news-doc-card" key={news.id}>
                <div className="v2-doc-icon">
                  <img src="/assets/actualities/pdf.png" alt="PDF" />
                </div>
                <div className="v2-doc-info">
                  <span className="v2-doc-tag">{t("actuality.newsletterTitle")}</span>
                  <h4>Newsletter - {news.title}</h4>
                  <span className="v2-doc-link">{t("newsletters.viewPdf")} →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterV2;
