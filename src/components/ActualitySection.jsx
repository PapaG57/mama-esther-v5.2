import React, { useState } from "react";
import "../styles/components/actualitySection.css";
import Divider from "./Divider";
import CamerounButton from "./CamerounButton";
import { Link } from "react-router-dom"; 
import { useTranslation } from "react-i18next";

function ActualitySection() {
  const { t } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);

  const newsData = [
    {
      id: 1,
      title: t("actualitySection.news1"),
      img: "/assets/actualities/actuality1.png",
      link: "/actualities#news2",
    },
    {
      id: 2,
      title: t("actualitySection.news2"),
      img: "/assets/actualities/actuality2.png",
      link: "/actualities#news1",
    },
    {
      id: 3,
      title: t("actualitySection.news3"),
      img: "/assets/actualities/pdf.png",
      link: "/actualities#pdf",
    },
  ];

  return (
    <section id="actualitySection" className="news-carousel actuality-section">
      <Divider /> 
      <h2>{t("actualitySection.title")}</h2>
      <p>
        {t("actualitySection.subtitle")}
      </p>
      <div
        className={`news-carousel-track ${isPaused ? "paused" : ""}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {[...newsData, ...newsData].map((news, index) => (
          <Link
            key={index}
            to={{
              pathname: news.link.split("#")[0], 
              hash: `#${news.link.split("#")[1]}`, 
            }}
            state={{ from: "actualitySection" }} 
            className="news-item"
          >
            <div className="news-visual">
              <img src={news.img} alt={news.title} />
            </div>
            <h3 className="news-title">{news.title}</h3>
          </Link>
        ))}
      </div>
      <div className="btn-wrapper">
        <div className="actuality-button-wrapper">
          <CamerounButton to="/actualities">
            {t("actualitySection.button")}
          </CamerounButton>
        </div>
      </div>
      <Divider /> 
    </section>
  );
}

export default ActualitySection;
