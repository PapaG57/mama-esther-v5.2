import React, { useEffect, useState } from "react";
import "../styles/components/DonationCounter.css";
import logoMama from "/assets/logos/logoMama.png";
import { Bar } from "react-chartjs-2";
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
  const [cumulTotal, setCumulTotal] = useState(0);
  const [anneeTotal, setAnneeTotal] = useState(0);
  const [mensuelData, setMensuelData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countRes, anneeRes, moisRes] = await Promise.all([
          donationService.getCount(),
          donationService.getAnnual(),
          donationService.getMonthly()
        ]);
        
        setCumulTotal(countRes.data.total || 0);
        setAnneeTotal(anneeRes.data.total || 0);
        setMensuelData(moisRes.data || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des dons :", err);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
      "Juil", "Août", "Sept", "Oct", "Nov", "Déc"
    ],
    datasets: [
      {
        label: t("donationCounter.monthlyLabel"),
        data: mensuelData,
        backgroundColor: "rgba(252, 209, 22, 0.8)", 
        borderColor: "#fcd116",
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      x: {
        ticks: { color: "#ffffff" },
        grid: { display: false },
      },
    },
  };

  return (
    <section className="donation-counter">
      <div className="counter-content">
        <img src={logoMama} alt="Logo Mama Esther" className="logo" />

        <div className="counter-title">
          <span className="counter-label">{t("donationCounter.cumulatedSupport")}</span>
          <div className={`counter-number ${cumulTotal === 0 ? "zero" : ""}`}>
            {cumulTotal.toLocaleString()} €
          </div>
        </div>

        <div className="divLine">
          <hr className="line" />
          <span className="counter-label">
            {t("donationCounter.annualDons", { year: new Date().getFullYear() })}
          </span>
          <div className="counter-number">
            {anneeTotal.toLocaleString()} €
          </div>
        </div>

        <p className="counter-text">{t("donationCounter.thanks")}</p>

        <div className="download-buttons">
          <button onClick={() => window.open("/donations-report.pdf", "_blank")}>
            {t("donationCounter.seePdf")}
          </button>
          <button>
            {t("donationCounter.createPdf")}
          </button>
        </div>

        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </section>
  );
};

export default DonationCounter;
