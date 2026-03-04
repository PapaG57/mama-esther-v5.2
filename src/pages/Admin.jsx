import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash, faPlusCircle, faUsersCog, faCoins, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import "../styles/AdminV2.css";
import PasswordField from "../components/PasswordField";
import confetti from "canvas-confetti";
import { useTranslation } from "react-i18next";
import { adminService } from "../api/services";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

function evaluatePasswordStrength(password) {
  const len = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (len < 8) return "faible";
  if (len > 10 && hasUpper && hasLower && hasDigit && hasSpecial) return "fort";
  return "moyen";
}

export default function Admin() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showSecureModal, setShowSecureModal] = useState(false);
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [nomDonateur, setNomDonateur] = useState("");
  const [montant, setMontant] = useState("");
  const [commentaires, setCommentaires] = useState("");
  const [source, setSource] = useState("");
  const [sourcePrecise, setSourcePrecise] = useState("");
  const [dons, setDons] = useState([]);
  const [donASupprimer, setDonASupprimer] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) setShowSecureModal(true);
  }, []);

  useEffect(() => {
    if (motDePasse.length >= 1) {
      setPasswordStrength(evaluatePasswordStrength(motDePasse));
    } else {
      setPasswordStrength("");
    }
  }, [motDePasse]);

  const fetchDons = async () => {
    try {
      const res = await adminService.getDons();
      setDons(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erreur récupération dons :", err);
      setDons([]);
    }
  };

  useEffect(() => {
    if (!showSecureModal) fetchDons();
  }, [showSecureModal]);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (motDePasse !== confirmationMotDePasse) {
      toast.error(t("admin.messages.passwordsNoMatch"));
      return;
    }
    try {
      await adminService.register({ identifiant, motDePasse });
      setShowSuccessModal(true);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setIdentifiant("");
      setMotDePasse("");
      setConfirmationMotDePasse("");
    } catch (err) {
      toast.error(err.response?.data?.error || t("admin.messages.networkError"));
    }
  };

  const handleManualDonation = async (e) => {
    e.preventDefault();
    const data = {
      nomDonateur,
      montant: parseFloat(montant),
      commentaires,
      source: source === "Autres (préciser)" ? sourcePrecise : source,
    };
    try {
      await adminService.addManualDonation(data);
      toast.success(t("admin.messages.donAdded"));
      setNomDonateur("");
      setMontant("");
      setCommentaires("");
      setSource("");
      setSourcePrecise("");
      fetchDons();
    } catch (err) {
      toast.error(err.response?.data?.error || t("admin.messages.networkError"));
    }
  };

  const handleSupprimerDon = async () => {
    if (!donASupprimer) return;
    const id = donASupprimer._id || donASupprimer.id;
    try {
      await adminService.deleteDon(id);
      toast.success(t("admin.messages.donDeleted"));
      fetchDons();
    } catch (err) {
      toast.error(t("admin.messages.networkError"));
    } finally {
      setDonASupprimer(null);
      setShowConfirmModal(false);
    }
  };

  // FONCTION EXPORT CSV
  const exportToCSV = () => {
    if (dons.length === 0) {
      toast.info("Aucun don à exporter.");
      return;
    }

    const headers = ["Donateur", "Montant (€)", "Source", "Date", "Commentaires"];
    const rows = dons.map(don => [
      don.nomDonateur,
      don.montant,
      don.source,
      new Date(don.date).toLocaleDateString(),
      don.commentaires || ""
    ]);

    const csvContent = [
      headers.join(";"), // Séparateur point-virgule pour Excel FR
      ...rows.map(row => row.map(val => `"${val}"`).join(";"))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `dons_mama_esther_${new Date().getFullYear()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Fichier CSV généré !");
  };

  if (showSecureModal) {
    return (
      <div className="v2-modal-overlay">
        <div className="v2-modal">
          <h2 style={{color: "var(--color-red)"}}>{t("admin.accessGate.secureAccess")}</h2>
          <p>{t("admin.accessGate.secureText")}</p>
          <div className="v2-modal-buttons" style={{marginTop: "30px"}}>
            <button className="v2-btn v2-btn-primary" onClick={() => navigate("/")}>
              {t("admin.accessGate.back")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      <main className="admin-v2-container">
        <div className="v2-container">
          <h1>
            <FontAwesomeIcon icon={faUsersCog} style={{marginRight: "20px", color: "var(--color-green)"}} />
            {t("admin.dashboard.title")}
          </h1>

          <div className="admin-v2-grid">
            <div className="admin-v2-card">
              <h2>{t("admin.dashboard.addAdminTitle")}</h2>
              <form onSubmit={handleAdminSubmit} className="admin-v2-form">
                <input type="text" className="admin-v2-input" placeholder={t("admin.forms.idPlaceholder")} value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} required />
                <PasswordField value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} label={t("admin.forms.password")} placeholder={t("admin.forms.passwordPlaceholder")} required />
                {passwordStrength && (
                  <p className={`password-strength-v2 strength-${passwordStrength}`}>
                    {t(`admin.messages.strength${passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}`)}
                  </p>
                )}
                <PasswordField value={confirmationMotDePasse} onChange={(e) => setConfirmationMotDePasse(e.target.value)} label={t("admin.forms.confirmPassword")} placeholder={t("admin.forms.passwordPlaceholder")} required />
                <button type="submit" className="v2-btn v2-btn-primary">
                  <FontAwesomeIcon icon={faPlusCircle} style={{marginRight: "10px"}} />
                  {t("admin.forms.submitCreate")}
                </button>
              </form>
            </div>

            <div className="admin-v2-card">
              <h2>
                <FontAwesomeIcon icon={faCoins} style={{marginRight: "15px", color: "var(--color-yellow)"}} />
                {t("admin.dashboard.addDonationTitle")}
              </h2>
              <form onSubmit={handleManualDonation} className="admin-v2-form">
                <input type="text" className="admin-v2-input" placeholder={t("admin.forms.donatorName")} value={nomDonateur} onChange={(e) => setNomDonateur(e.target.value)} required />
                <input type="number" className="admin-v2-input" placeholder={t("admin.forms.amount")} value={montant} onChange={(e) => setMontant(e.target.value)} required />
                <select className="admin-v2-input" value={source} onChange={(e) => setSource(e.target.value)} required>
                  <option value="">{t("admin.forms.source")}</option>
                  <option value="Chèque">{t("admin.forms.sourceCheque")}</option>
                  <option value="Virement">{t("admin.forms.sourceTransfer")}</option>
                  <option value="Espèces">{t("admin.forms.sourceCash")}</option>
                  <option value="Autres (préciser)">{t("admin.forms.sourceOther")}</option>
                </select>
                {source === "Autres (préciser)" && (
                  <input type="text" className="admin-v2-input" placeholder={t("admin.forms.sourceOtherPlaceholder")} value={sourcePrecise} onChange={(e) => setSourcePrecise(e.target.value)} required />
                )}
                <textarea className="admin-v2-input" style={{minHeight: "100px"}} placeholder={t("admin.forms.comments")} value={commentaires} onChange={(e) => setCommentaires(e.target.value)} />
                <button type="submit" className="v2-btn v2-btn-primary">{t("admin.forms.submitAddDon")}</button>
              </form>
            </div>
          </div>

          <div className="admin-v2-list-section">
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px"}}>
              <h2 style={{margin: 0}}>{t("admin.dashboard.donationListTitle")}</h2>
              <button className="v2-btn v2-btn-outline-green" style={{padding: "10px 20px", fontSize: "0.9rem"}} onClick={exportToCSV}>
                <FontAwesomeIcon icon={faFileExcel} style={{marginRight: "10px"}} />
                Exporter en Excel (CSV)
              </button>
            </div>
            
            <div className="admin-v2-table-wrapper">
              <table className="admin-v2-table">
                <thead>
                  <tr>
                    <th>{t("admin.table.name")}</th>
                    <th>{t("admin.table.amount")}</th>
                    <th>{t("admin.table.source")}</th>
                    <th>{t("admin.table.date")}</th>
                    <th>{t("admin.table.action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {dons.map((don) => (
                    <tr key={don._id || don.id}>
                      <td style={{fontWeight: "700", color: "var(--color-dark)"}}>{don.nomDonateur}</td>
                      <td style={{color: "var(--color-green)", fontWeight: "800"}}>{don.montant} €</td>
                      <td>{don.source}</td>
                      <td>{new Date(don.date).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-v2-actions">
                          <button className="admin-v2-btn-icon delete" onClick={() => { setDonASupprimer(don); setShowConfirmModal(true); }}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {dons.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{textAlign: 'center', padding: '60px', opacity: 0.5}}>{t("admin.dashboard.noDonations")}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{marginTop: "60px", textAlign: "center"}}>
            <button onClick={() => navigate("/")} className="v2-btn v2-btn-outline-green">
              <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: "10px" }} />
              {t("admin.accessGate.back")}
            </button>
          </div>
        </div>
      </main>

      {/* MODALES */}
      {showSuccessModal && (
        <div className="v2-modal-overlay">
          <div className="v2-modal">
            <h2 style={{color: "var(--color-green)"}}>{t("admin.modals.successTitle")}</h2>
            <p>{t("admin.modals.successText")}</p>
            <div style={{marginTop: "30px"}}>
              <button className="v2-btn v2-btn-primary" onClick={() => setShowSuccessModal(false)}>{t("admin.modals.close")}</button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="v2-modal-overlay">
          <div className="v2-modal">
            <h2 style={{color: "var(--color-red)"}}>{t("admin.modals.confirmDeleteTitle")}</h2>
            <p>{t("admin.modals.confirmDeleteText")}</p>
            <div className="v2-modal-buttons" style={{marginTop: "30px", display: "flex", gap: "20px", justifyContent: "center"}}>
              <button className="v2-btn v2-btn-outline-green" onClick={() => setShowConfirmModal(false)}>{t("admin.modals.cancel")}</button>
              <button className="v2-btn v2-btn-red" onClick={handleSupprimerDon}>{t("admin.modals.confirm")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
