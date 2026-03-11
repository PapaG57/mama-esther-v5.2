import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import "../styles/404V2.css";
import { useTranslation } from "react-i18next";

const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(1);

    const draw = () => {
      // Fond noir semi-transparent pour l'effet de traînée (Matrix style)
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; 
      ctx.fillRect(0, 0, width, height);

      // Couleur des caractères (Vert Cameroun #007a5e)
      ctx.fillStyle = "#007a5e"; 
      ctx.font = `${fontSize}px "Courier New"`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      width = (canvas.width = window.innerWidth);
      height = (canvas.height = window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="v2-matrix-canvas" />;
};

const Page404 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      <main className="v2-404-container">
        <MatrixBackground />
        
        <div className="v2-container">
          <div className="v2-404-content">
            <div className="v2-404-visual">
              <span className="v2-404-number-glitch" data-text="404">404</span>
            </div>
            
            <h1 className="v2-title" style={{color: 'white'}}>{t("error404.title")}</h1>
            <p className="v2-404-text">
              {t("error404.subtitle")}
            </p>

            <div className="v2-404-btns">
              <button 
                className="v2-btn v2-btn-primary" 
                onClick={() => {
                  if (window.history.length > 2) {
                    navigate(-1);
                  } else {
                    navigate("/");
                  }
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} style={{marginRight: '10px'}} />
                {t("v2.common.back")}
              </button>
              <button className="v2-btn v2-btn-outline" onClick={() => navigate('/contact')}>
                {t("error404.contact")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page404;
