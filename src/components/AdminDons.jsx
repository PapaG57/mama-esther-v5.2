import React, { useState, useEffect } from "react";
import "./AdminDons.css";
import { useTranslation } from "react-i18next";

const AdminDons = () => {
  const { t } = useTranslation();
  const [nomDonateur, setNomDonateur] = useState("");
  const [montant, setMontant] = useState("");
  const [message, setMessage] = useState("");
  const [campagne, setCampagne] = useState("");
  const [donsManuels, setDonsManuels] = useState([]);

  // Récupération des dons manuels existants
  useEffect(() => {
    fetch("http://localhost:5000/api/donations/manual")
      .then((res) => res.json())
      .then((data) => setDonsManuels(data.dons))
      .catch((err) => console.error("Erreur chargement dons manuels", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nouveauDon = { nomDonateur, montant, message, campagne };

    fetch("http://localhost:5000/api/donations/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nouveauDon),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(t("admin.messages.donAdded"));
        setNomDonateur("");
        setMontant("");
        setMessage("");
        setCampagne("");
        setDonsManuels((prev) => [...prev, data.don]); // mise à jour locale
      })
      .catch((err) => console.error("Erreur ajout don manuel", err));
  };

  return (
    <section className="admin-dons">
      <h1>{t("admin.dashboard.addDonationTitle")}</h1>

      {/* Formulaire d'ajout */}
      <form className="don-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={t("admin.forms.donatorName")}
          value={nomDonateur}
          onChange={(e) => setNomDonateur(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder={t("admin.forms.amount")}
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder={t("admin.forms.comments")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Campagne (facultatif)"
          value={campagne}
          onChange={(e) => setCampagne(e.target.value)}
        />
        <button type="submit">{t("admin.forms.submitAddDon")}</button>
      </form>

      {/* Tableau des dons manuels */}
      <div className="don-table">
        <h2>{t("admin.dashboard.donationListTitle")}</h2>
        <table>
          <thead>
            <tr>
              <th>{t("admin.table.name")}</th>
              <th>{t("admin.table.amount")}</th>
              <th>{t("admin.table.comments")}</th>
              <th>Campagne</th>
              <th>{t("admin.table.action")}</th>
            </tr>
          </thead>
          <tbody>
            {donsManuels.map((don, index) => (
              <tr key={index}>
                <td>{don.nomDonateur}</td>
                <td>{don.montant} €</td>
                <td>{don.message || "-"}</td>
                <td>{don.campagne || "-"}</td>
                <td>
                  <a
                    href={`http://localhost:5000/api/donations/manual/${don._id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("admin.table.viewFile")}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminDons;
