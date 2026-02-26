import React, { useState, useEffect } from "react";
import "../styles/components/AdminDons.css";
import { useTranslation } from "react-i18next";
import { adminService } from "../api/services";

const AdminDons = () => {
  const { t } = useTranslation();
  const [nomDonateur, setNomDonateur] = useState("");
  const [montant, setMontant] = useState("");
  const [message, setMessage] = useState("");
  const [campagne, setCampagne] = useState("");
  const [donsManuels, setDonsManuels] = useState([]);

  // Récupération des dons manuels existants
  useEffect(() => {
    fetchDons();
  }, []);

  const fetchDons = async () => {
    try {
      const res = await adminService.getDons();
      // On filtre ou on adapte si nécessaire, ici on suppose que le service retourne la liste
      setDonsManuels(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erreur chargement dons manuels", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nouveauDon = { 
      nomDonateur, 
      montant: parseFloat(montant), 
      commentaires: message, 
      source: campagne || "Manuel" 
    };

    try {
      await adminService.addManualDonation(nouveauDon);
      alert(t("admin.messages.donAdded"));
      setNomDonateur("");
      setMontant("");
      setMessage("");
      setCampagne("");
      fetchDons();
    } catch (err) {
      console.error("Erreur ajout don manuel", err);
      alert(t("admin.messages.networkError"));
    }
  };

  return (
    <section className="admin-dons v2-layout">
      <div className="v2-container">
        <h1>{t("admin.dashboard.addDonationTitle")}</h1>

        {/* Formulaire d'ajout */}
        <div className="admin-card">
          <form className="don-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="input-standard"
              placeholder={t("admin.forms.donatorName")}
              value={nomDonateur}
              onChange={(e) => setNomDonateur(e.target.value)}
              required
            />
            <input
              type="number"
              className="input-standard"
              placeholder={t("admin.forms.amount")}
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              required
            />
            <textarea
              className="input-standard"
              placeholder={t("admin.forms.comments")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <input
              type="text"
              className="input-standard"
              placeholder="Campagne (facultatif)"
              value={campagne}
              onChange={(e) => setCampagne(e.target.value)}
            />
            <button type="submit" className="v2-btn v2-btn-primary">{t("admin.forms.submitAddDon")}</button>
          </form>
        </div>

        {/* Tableau des dons manuels */}
        <div className="admin-list-section">
          <h2>{t("admin.dashboard.donationListTitle")}</h2>
          <div className="table-wrapper">
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
                  <tr key={don._id || index}>
                    <td>{don.nomDonateur}</td>
                    <td>{don.montant} €</td>
                    <td>{don.commentaires || don.message || "-"}</td>
                    <td>{don.source || "-"}</td>
                    <td>
                      <button className="v2-link-btn" onClick={() => window.open(`/api/donations/manual/${don._id}/pdf`, '_blank')}>
                        {t("admin.table.viewFile")}
                      </button>
                    </td>
                  </tr>
                ))}
                {donsManuels.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Aucun don trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDons;
