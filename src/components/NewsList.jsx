import React from "react";
import "../styles/components/../styles/newsList.css"; // crée ce fichier si tu veux ajouter du style
import { useTranslation } from "react-i18next";

export default function NewsList({ data }) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return <p>{t("actuality.noNews")}</p>;
  }

  return (
    <ul className="newsletter-list">
      {data.map((n) => (
        <li key={n.id} className="newsletter-line">
          <a
            href={n.htmlPath}
            target="_blank"
            rel="noopener noreferrer"
            className="newsletter-link"
          >
            {n.title}
          </a>
          <a
            href={n.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            title={t("actuality.openPdf", { title: n.title })}
            className="pdf-icon-link"
          >
            <i className="fa-solid fa-file-pdf fa-2x pdf-icon-awesome" />
            <span className="visually-hidden">{t("actuality.downloadPdf")}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
