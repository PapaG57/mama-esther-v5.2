import React, { useEffect, useState } from "react";
import "./DonationCounter.css";
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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DonationCounter = () => {
  const { t } = useTranslation();
  const [totalCumulé, setTotalCumulé] = useState(null); // total depuis le premier don
  const [totalAnnuel, setTotalAnnuel] = useState(null); // total de l'année en cours
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // récupération du total cumulé
    fetch("http://localhost:5000/api/donations/count")
      .then((res) => res.json())
      .then((data) => setTotalCumulé(data.total))
      .catch((err) => console.error("Erreur chargement total cumulé", err));

    // récupération du total annuel
    fetch("http://localhost:5000/api/donations/annee")
      .then((res) => res.json())
      .then((data) => setTotalAnnuel(data.total))
      .catch((err) => console.error("Erreur chargement total annuel", err));

    // récupération des dons mensuels
    fetch("http://localhost:5000/api/donations/mois")
      .then((res) => res.json())
      .then((data) => setMonthlyData(data.donsParMois))
      .catch((err) => console.error("Erreur chargement graphique", err));
  }, []);

  // ouverture du PDF dans un onglet
  const handleDownloadPDF = () => {
    const url = "http://localhost:5000/api/donations/mois/pdf";
    window.open(url, "_blank");
  };

  const chartData = {
    labels: monthlyData.map((d) => `M${d.mois}`),
    datasets: [
      {
        label: t("donationCounter.monthlyLabel"),
        data: monthlyData.map((d) => d.total),
        backgroundColor: "#007a3d", // vert drapeau Cameroun
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 50 },
      },
    },
  };

  return (
    <section className="donation-counter">
      <div className="counter-content">
        <img src={logoMama} alt="Logo Mama Esther" className="logo" />

        {/* total cumulé depuis le premier don */}
        <h2 className="counter-title">
          <span className="counter-label">{t("donationCounter.cumulatedSupport")}</span>{" "}
          <span
            className={`counter-number ${
              typeof totalCumulé === "number" && totalCumulé === 0 ? "zero" : "positive"
            }`}
          >
            {Number.isFinite(totalCumulé) ? totalCumulé.toLocaleString() : "0"} €
          </span>
        </h2>

        {/* compteur annuel */}
        <h2 className="counter-title">
          <span className="counter-label">{t("donationCounter.annualDons", { year: new Date().getFullYear() })}</span>{" "}
          <span
            className={`counter-number ${
              typeof totalAnnuel === "number" && totalAnnuel === 0 ? "zero" : "positive"
            }`}
          >
            {Number.isFinite(totalAnnuel) ? totalAnnuel.toLocaleString() : "0"} €
          </span>
        </h2>

        <p className="counter-text">{t("donationCounter.thanks")}</p>

        <div className="divLine">
          <hr className="line" />
          <h1 className="counter-title">{t("donationCounter.seePdf")}</h1>
        </div>

        <div className="download-buttons">
          <button onClick={handleDownloadPDF} title={t("donationCounter.createPdf")}>
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
