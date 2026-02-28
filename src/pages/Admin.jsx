import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash, faPlusCircle, faUsersCog, faCoins } from "@fortawesome/free-solid-svg-icons";
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

  // 🔒 Protection de la page
  const [showSecureModal, setShowSecureModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setShowSecureModal(true);
    }
  }, []);

  // États Admin
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // États Dons
  const [nomDonateur, setNomDonateur] = useState("");
  const [montant, setMontant] = useState("");
  const [commentaires, setCommentaires] = useState("");
  const [source, setSource] = useState("");
  const [sourcePrecise, setSourcePrecise] = useState("");
  const [dons, setDons] = useState([]);
  const [donASupprimer, setDonASupprimer] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    if (!showSecureModal) {
      fetchDons();
    }
  }, [showSecureModal]);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    if (motDePasse !== confirmationMotDePasse) {
      toast.error(t("admin.messages.passwordsNoMatch"));
      return;
    }

    if (motDePasse.length < 8 || motDePasse.length > 30) {
      toast.error(t("admin.messages.passwordLength"));
      return;
    }

    const strength = evaluatePasswordStrength(motDePasse);
    if (strength === "faible") {
      toast.warning(t("admin.messages.passwordWeak"));
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
            {/* Section Administrateurs */}
            <div className="admin-v2-card">
              <h2>{t("admin.dashboard.addAdminTitle")}</h2>
              <form onSubmit={handleAdminSubmit} className="admin-v2-form">
                <input
                  type="text"
                  className="admin-v2-input"
                  placeholder={t("admin.forms.idPlaceholder")}
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  required
                />
                <PasswordField
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  label={t("admin.forms.password")}
                  placeholder={t("admin.forms.passwordPlaceholder")}
                  required
                />
                {passwordStrength && (
                  <p className={`password-strength-v2 strength-${passwordStrength}`}>
                    {t(`admin.messages.strength${passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}`)}
                  </p>
                )}
                <PasswordField
                  value={confirmationMotDePasse}
                  onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                  label={t("admin.forms.confirmPassword")}
                  placeholder={t("admin.forms.passwordPlaceholder")}
                  required
                />
                <button type="submit" className="v2-btn v2-btn-primary">
                  <FontAwesomeIcon icon={faPlusCircle} style={{marginRight: "10px"}} />
                  {t("admin.forms.submitCreate")}
                </button>
              </form>
            </div>

            {/* Section Dons Manuels */}
            <div className="admin-v2-card">
              <h2>
                <FontAwesomeIcon icon={faCoins} style={{marginRight: "15px", color: "var(--color-yellow)"}} />
                {t("admin.dashboard.addDonationTitle")}
              </h2>
              <form onSubmit={handleManualDonation} className="admin-v2-form">
                <input
                  type="text"
                  className="admin-v2-input"
                  placeholder={t("admin.forms.donatorName")}
                  value={nomDonateur}
                  onChange={(e) => setNomDonateur(e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="admin-v2-input"
                  placeholder={t("admin.forms.amount")}
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  required
                />
                <select
                  className="admin-v2-input"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                >
                  <option value="">{t("admin.forms.source")}</option>
                  <option value="Chèque">{t("admin.forms.sourceCheque")}</option>
                  <option value="Virement">{t("admin.forms.sourceTransfer")}</option>
                  <option value="Espèces">{t("admin.forms.sourceCash")}</option>
                  <option value="Autres (préciser)">{t("admin.forms.sourceOther")}</option>
                </select>
                {source === "Autres (préciser)" && (
                  <input
                    type="text"
                    className="admin-v2-input"
                    placeholder={t("admin.forms.sourceOtherPlaceholder")}
                    value={sourcePrecise}
                    onChange={(e) => setSourcePrecise(e.target.value)}
                    required
                  />
                )}
                <textarea
                  className="admin-v2-input"
                  style={{minHeight: "100px"}}
                  placeholder={t("admin.forms.comments")}
                  value={commentaires}
                  onChange={(e) => setCommentaires(e.target.value)}
                />
                <button type="submit" className="v2-btn v2-btn-primary">
                  {t("admin.forms.submitAddDon")}
                </button>
              </form>
            </div>
          </div>

          {/* Liste des dons */}
          <div className="admin-v2-list-section">
            <h2>{t("admin.dashboard.donationListTitle")}</h2>
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
                      <td colSpan="5" style={{textAlign: 'center', padding: '60px', opacity: 0.5}}>
                        {t("admin.dashboard.noDonations")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{marginTop: "60px", textAlign: "center"}}>
            <button onClick={() => navigate("/")} className="v2-btn v2-btn-outline">
              <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: "10px" }} />
              {t("admin.accessGate.back")}
            </button>
          </div>
        </div>
      </main>

      {/* Modale Succès */}
      {showSuccessModal && (
        <div className="v2-modal-overlay">
          <div className="v2-modal">
            <h2 style={{color: "var(--color-green)"}}>{t("admin.modals.successTitle")}</h2>
            <p>{t("admin.modals.successText")}</p>
            <div style={{marginTop: "30px"}}>
              <button className="v2-btn v2-btn-primary" onClick={() => setShowSuccessModal(false)}>
                {t("admin.modals.close")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Confirmation Suppression */}
      {showConfirmModal && (
        <div className="v2-modal-overlay">
          <div className="v2-modal">
            <h2 style={{color: "var(--color-red)"}}>{t("admin.modals.confirmDeleteTitle")}</h2>
            <p>{t("admin.modals.confirmDeleteText")}</p>
            <div className="v2-modal-buttons" style={{marginTop: "30px", display: "flex", gap: "20px", justifyContent: "center"}}>
              <button className="v2-btn v2-btn-outline" onClick={() => setShowConfirmModal(false)}>
                {t("admin.modals.cancel")}
              </button>
              <button className="v2-btn v2-btn-red" onClick={handleSupprimerDon}>
                {t("admin.modals.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
