import React, { useEffect, useState } from "react";
import "../styles/components/DonationCounterV2.css";
import { Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faCheckCircle, faArrowRight, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useTranslation } from "react-i18next";
import { donationService } from "../api/services";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DonationCounter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cumulTotal, setCumulTotal] = useState(0);
  const [anneeTotal, setAnneeTotal] = useState(0);
  const [donorsCount, setDonorsCount] = useState(0);
  const [mensuelData, setMensuelData] = useState(new Array(12).fill(0)); // Initialisé à zéro pour éviter les crashs
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countRes, anneeRes, moisRes, donorsRes] = await Promise.all([
          donationService.getCount(),
          donationService.getAnnual(),
          donationService.getMonthly(),
          donationService.getDonorsCount()
        ]);
        
        setCumulTotal(countRes.data.total || 0);
        setAnneeTotal(anneeRes.data.total || 0);
        setDonorsCount(donorsRes.data.count || 0);
        
        if (moisRes.data && moisRes.data.donsParMois) {
          const formattedData = moisRes.data.donsParMois.map(d => d.total);
          setMensuelData(formattedData);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des dons :", err);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"],
    datasets: [
      {
        label: t("donationCounter.monthlyLabel"),
        data: mensuelData,
        backgroundColor: "rgba(0, 122, 94, 0.8)", // Vert Mama Esther
        hoverBackgroundColor: "#fcd116",
        borderRadius: 6,
        barThickness: 'flex',
        maxBarThickness: 30
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1a1a1a",
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#666", font: { size: 10, weight: 'bold' } },
        grid: { color: "rgba(0, 0, 0, 0.05)", drawBorder: false },
      },
      x: {
        ticks: { color: "#333", font: { size: 10, weight: 'bold' } },
        grid: { display: false },
      },
    },
  };

  return (
    <section className="v2-impact-section">
      <div className="v2-container">
        <div className="v2-impact-card">
          
          <div className="v2-impact-header">
            <span className="v2-impact-badge">
              <FontAwesomeIcon icon={faCheckCircle} />
              {t("donationCounter.impactVerified")}
            </span>
          </div>

          <div className="v2-impact-main">
            <span className="v2-impact-label">{t("donationCounter.cumulatedSupport")}</span>
            <span className="v2-impact-number small">
              {cumulTotal.toLocaleString()} €
            </span>
            <p className="v2-impact-subtext">{t("donationCounter.quote")}</p>
          </div>

          <div className="v2-impact-grid">
            <div className="v2-stat-item">
              <span className="v2-stat-value">{anneeTotal.toLocaleString()} €</span>
              <span className="v2-stat-label">{t("donationCounter.harvestedIn", { year: new Date().getFullYear() })}</span>
            </div>
            <div className="v2-stat-item">
              <span className="v2-stat-value" style={{color: "var(--color-yellow)"}}>{donorsCount}</span>
              <span className="v2-stat-label">{t("donationCounter.engagedDonors")}</span>
            </div>
          </div>

          <div className="v2-impact-toggle">
            <button className="v2-btn-details" onClick={() => setShowDetails(!showDetails)}>
              <FontAwesomeIcon icon={showDetails ? faChevronUp : faChevronDown} style={{marginRight: '10px'}} />
              {showDetails ? t("donationCounter.hideDetails") : t("donationCounter.showDetails")}
            </button>
          </div>

          {showDetails && (
            <div className="v2-impact-details-reveal">
              <div className="v2-impact-chart" style={{background: '#fff', borderRadius: '20px', padding: '20px'}}>
                <Bar data={chartData} options={chartOptions} />
              </div>
              <div className="v2-impact-actions">
                <button className="v2-btn-pdf" onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/donations/mois/pdf`, "_blank")}>
                  <FontAwesomeIcon icon={faFilePdf} style={{color: "#ce1126"}} />
                  {t("donationCounter.annualReport")}
                </button>
                <button className="v2-btn-pdf" style={{marginLeft: '15px'}} onClick={() => navigate('/actualities')}>
                  <FontAwesomeIcon icon={faFilePdf} style={{color: "#007a5e"}} />
                  {t("donationCounter.lastNewsletter")}
                </button>
              </div>
            </div>
          )}

          <div className="v2-impact-footer-simple">
            <button className="v2-btn v2-btn-primary" onClick={() => navigate('/don')}>
              {t("donationCounter.supportBtn")}
              <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: "15px" }} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DonationCounter;
