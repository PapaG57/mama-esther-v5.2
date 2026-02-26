import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointLeft, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import "../styles/admin.css";
import CamerounButton from "../components/CamerounButton";
import PasswordField from "../components/PasswordField";
import confetti from "canvas-confetti";
import { useTranslation } from "react-i18next";
import { adminService } from "../api/services";

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
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // États Dons
  const [nomDonateur, setNomDonateur] = useState("");
  const [montant, setMontant] = useState("");
  const [commentaires, setCommentaires] = useState("");
  const [source, setSource] = useState("");
  const [sourcePrecise, setSourcePrecise] = useState("");
  const [donFeedback, setDonFeedback] = useState("");
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
    setMessage("");

    if (motDePasse !== confirmationMotDePasse) {
      setMessage(t("admin.messages.passwordsNoMatch"));
      return;
    }

    if (motDePasse.length < 8 || motDePasse.length > 30) {
      setMessage(t("admin.messages.passwordLength"));
      return;
    }

    const strength = evaluatePasswordStrength(motDePasse);
    if (strength === "faible") {
      setMessage(t("admin.messages.passwordWeak"));
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
      setMessage(err.response?.data?.error || t("admin.messages.networkError"));
    }
  };

  const handleManualDonation = async (e) => {
    e.preventDefault();
    setDonFeedback("");

    const data = {
      nomDonateur,
      montant: parseFloat(montant),
      message: commentaires,
      source: source === "Autres (préciser)" ? sourcePrecise : source,
    };

    try {
      await adminService.addManualDonation(data);
      setDonFeedback(t("admin.messages.donAdded"));
      setNomDonateur("");
      setMontant("");
      setCommentaires("");
      setSource("");
      setSourcePrecise("");
      fetchDons();
    } catch (err) {
      setDonFeedback(err.response?.data?.error || t("admin.messages.networkError"));
    }
  };

  const handleSupprimerDon = async () => {
    if (!donASupprimer) return;
    const id = donASupprimer._id || donASupprimer.id;

    try {
      await adminService.deleteDon(id);
      setDonFeedback(t("admin.messages.donDeleted"));
      fetchDons();
    } catch (err) {
      setDonFeedback(t("admin.messages.networkError"));
    } finally {
      setDonASupprimer(null);
      setShowConfirmModal(false);
    }
  };

  const strengthClass =
    passwordStrength === "fort"
      ? "msg-green-bold"
      : passwordStrength === "moyen"
      ? "msg-orange-bold"
      : passwordStrength === "faible"
      ? "msg-red-bold"
      : "";

  if (showSecureModal) {
    return (
      <div className="admin-modal-overlay" onClick={() => navigate("/")}>
        <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
          <h2>{t("admin.accessGate.secureAccess")}</h2>
          <p>{t("admin.accessGate.secureText")}</p>
          <div className="admin-modal-buttons">
            <button onClick={() => navigate("/")}>{t("admin.accessGate.back")}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container v2-layout">
      <div className="v2-container">
        <h1>{t("admin.dashboard.title")}</h1>

        <div className="admin-grid">
          {/* Section Administrateurs */}
          <div className="admin-card">
            <h2>{t("admin.dashboard.addAdminTitle")}</h2>
            <form onSubmit={handleAdminSubmit}>
              <input
                type="text"
                className="input-standard"
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
                <p className={strengthClass}>
                  {passwordStrength === "faible"
                    ? t("admin.messages.strengthFaible")
                    : passwordStrength === "moyen"
                    ? t("admin.messages.strengthMoyen")
                    : t("admin.messages.strengthFort")}
                </p>
              )}
              <PasswordField
                value={confirmationMotDePasse}
                onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                label={t("admin.forms.confirmPassword")}
                placeholder={t("admin.forms.passwordPlaceholder")}
                required
              />
              {message && <p className="msg-error">{message}</p>}
              <button type="submit" className="v2-btn v2-btn-primary">
                {t("admin.forms.submitCreate")}
              </button>
            </form>
          </div>

          {/* Section Dons Manuels */}
          <div className="admin-card">
            <h2>{t("admin.dashboard.addDonationTitle")}</h2>
            <form onSubmit={handleManualDonation}>
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
              <select
                className="input-standard"
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
                  className="input-standard"
                  placeholder={t("admin.forms.sourceOtherPlaceholder")}
                  value={sourcePrecise}
                  onChange={(e) => setSourcePrecise(e.target.value)}
                  required
                />
              )}
              <textarea
                className="input-standard"
                placeholder={t("admin.forms.comments")}
                value={commentaires}
                onChange={(e) => setCommentaires(e.target.value)}
              />
              {donFeedback && <p className="msg-feedback">{donFeedback}</p>}
              <button type="submit" className="v2-btn v2-btn-primary">
                {t("admin.forms.submitAddDon")}
              </button>
            </form>
          </div>
        </div>

        {/* Liste des dons */}
        <div className="admin-list-section">
          <h2>{t("admin.dashboard.donationListTitle")}</h2>
          <div className="table-wrapper">
            <table>
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
                    <td>{don.nomDonateur}</td>
                    <td>{don.montant} €</td>
                    <td>{don.source}</td>
                    <td>{new Date(don.date).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button className="btn-icon delete" onClick={() => { setDonASupprimer(don); setShowConfirmModal(true); }}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
                {dons.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '40px'}}>
                      {t("admin.dashboard.noDonations")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <CamerounButton onClick={() => navigate("/")} className="v2-btn-outline" style={{marginTop: '40px'}}>
          <FontAwesomeIcon icon={faHandPointLeft} style={{ marginRight: "8px" }} />
          {t("admin.accessGate.back")}
        </CamerounButton>
      </div>

      {/* Modale Succès */}
      {showSuccessModal && (
        <div className="admin-modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t("admin.modals.successTitle")}</h2>
            <p>{t("admin.modals.successText")}</p>
            <button className="v2-btn v2-btn-primary" onClick={() => setShowSuccessModal(false)}>
              {t("admin.modals.close")}
            </button>
          </div>
        </div>
      )}

      {/* Modale Confirmation Suppression */}
      {showConfirmModal && (
        <div className="admin-modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t("admin.modals.confirmDeleteTitle")}</h2>
            <p>{t("admin.modals.confirmDeleteText")}</p>
            <div className="admin-modal-buttons">
              <button className="v2-btn v2-btn-outline" onClick={() => setShowConfirmModal(false)}>
                {t("admin.modals.cancel")}
              </button>
              <button className="v2-btn v2-btn-primary" onClick={handleSupprimerDon}>
                {t("admin.modals.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
