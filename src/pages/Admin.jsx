import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointLeft } from "@fortawesome/free-solid-svg-icons";
import "../styles/admin.css";
import CamerounButton from "../components/CamerounButton";
import PasswordField from "../components/PasswordField";
import confetti from "canvas-confetti";
import { useTranslation } from "react-i18next";

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

  // 🔒 Protection de la page : vérifie le token dès le montage
  const [showSecureModal, setShowSecureModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setShowSecureModal(true); // affiche la modale sécurisée
    }
  }, [navigate]);

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
    setPasswordStrength(strength);
    if (strength === "faible") {
      setMessage(t("admin.messages.passwordWeak"));
      return;
    }

    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ identifiant, motDePasse }),
      });

      const result = await res.json();
      setMessage(result.message || result.error || t("admin.messages.creationSuccess"));

      if (res.ok) {
        localStorage.setItem("adminName", identifiant);
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        setShowSuccessModal(true);
        setIdentifiant("");
        setMotDePasse("");
        setConfirmationMotDePasse("");
        setPasswordStrength("");
      }
    } catch {
      setMessage(t("admin.messages.networkError"));
    }
  };

  const demanderConfirmationSuppression = (don) => {
    setDonASupprimer(don);
    setShowConfirmModal(true);
  };

  const annulerSuppression = () => {
    setDonASupprimer(null);
    setShowConfirmModal(false);
  };

  const confirmerSuppression = async () => {
    if (!donASupprimer) return;
    const token = localStorage.getItem("adminToken");
    const id = donASupprimer.id ?? donASupprimer._id;

    try {
      const res = await fetch(`/api/admin/dons/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      let result = {};
      if (res.status !== 204) {
        try {
          result = await res.json();
        } catch {}
      }

      if (!res.ok) {
        setDonFeedback(result.error || `Erreur serveur (${res.status})`);
      } else {
        setDonFeedback(result.message || t("admin.messages.donDeleted"));
        fetchDons();
      }
    } catch {
      setDonFeedback(t("admin.messages.networkError"));
    } finally {
      setDonASupprimer(null);
      setShowConfirmModal(false);
    }
  };

  const fetchDons = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("/api/admin/dons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDons(Array.isArray(data) ? data : []);
    } catch {
      setDons([]);
    }
  };

  useEffect(() => {
    fetchDons();
  }, []);

  const strengthClass =
    passwordStrength === "fort"
      ? "msg-green-bold"
      : passwordStrength === "moyen"
      ? "msg-orange-bold"
      : passwordStrength === "faible"
      ? "msg-red-bold"
      : "";

  return (
    <div className="admin-container">
      {showSecureModal ? (
        // 🔒 Modale sécurisée uniquement
        <div className="admin-modal-overlay" onClick={() => navigate("/")}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t("admin.accessGate.secureAccess")}</h2>
            <p>{t("admin.accessGate.secureText")}</p>
            <div className="admin-modal-buttons">
              <button onClick={() => navigate("/")}>{t("admin.accessGate.back")}</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1>{t("admin.dashboard.title")}</h1>

          {/* Formulaire connexion admin */}
          <form onSubmit={handleAdminSubmit}>
            <h2>{t("admin.dashboard.addAdminTitle")}</h2>
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
            {message && <p className="msg-red-bold">{message}</p>}
            <p className="msg-green-bold">
              {t("admin.messages.passwordInfo")}
            </p>
            <button type="submit">{t("admin.forms.submitCreate")}</button>
          </form>

          {/* 🎉 Modale succès */}
          {showSuccessModal && (
            <div
              className="admin-modal-overlay"
              onClick={() => setShowSuccessModal(false)}
            >
              <div
                className="admin-modal success-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <h2>{t("admin.modals.successTitle")}</h2>
                <p>{t("admin.modals.successText")}</p>
                <button onClick={() => setShowSuccessModal(false)}>
                  {t("admin.modals.close")}
                </button>
              </div>
            </div>
          )}

          {/* Formulaire ajout don manuel */}
          <form onSubmit={async (e) => {
              e.preventDefault();
              const token = localStorage.getItem("adminToken");
              const adminName = localStorage.getItem("adminName");

              try {
                const res = await fetch("/api/donations/manual", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    nomDonateur,
                    montant: parseFloat(montant),
                    commentaires,
                    source: source === "autres" ? sourcePrecise : source,
                    admin: adminName,
                  }),
                });

                const result = await res.json();
                setDonFeedback(result.message || result.error || t("admin.messages.donAdded"));
                setNomDonateur("");
                setMontant("");
                setCommentaires("");
                setSource("");
                setSourcePrecise("");
                fetchDons();
              } catch (err) {
                setDonFeedback(t("admin.messages.networkError"));
              }
            }}>
            <h2>{t("admin.dashboard.addDonationTitle")}</h2>
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
              <option value="chèque">{t("admin.forms.sourceCheque")}</option>
              <option value="virement">{t("admin.forms.sourceTransfer")}</option>
              <option value="espèces">{t("admin.forms.sourceCash")}</option>
              <option value="autres">{t("admin.forms.sourceOther")}</option>
            </select>

            {source === "autres" && (
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
            <button type="submit">{t("admin.forms.submitAddDon")}</button>
            {donFeedback && <p>{donFeedback}</p>}
          </form>

          {/* Liste des dons */}
          <h2>{t("admin.dashboard.donationListTitle")}</h2>
          {dons.length === 0 ? (
            <p>{t("admin.dashboard.noDonations")}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>{t("admin.table.name")}</th>
                  <th>{t("admin.table.amount")}</th>
                  <th>{t("admin.table.source")}</th>
                  <th>{t("admin.table.date")}</th>
                  <th>{t("admin.table.comments")}</th>
                  <th>{t("admin.table.addedBy")}</th>
                  <th>{t("admin.table.action")}</th>
                </tr>
              </thead>
              <tbody>
                {dons.map((don, index) => (
                  <tr
                    key={
                      don.id ??
                      don._id ??
                      `${don.nomDonateur}-${don.montant}-${don.date}-${index}`
                    }
                  >
                    <td>{don.nomDonateur}</td>
                    <td>{don.montant}</td>
                    <td>{don.source}</td>
                    <td>{new Date(don.date).toLocaleString()}</td>
                    <td>{don.commentaires || "-"}</td>
                    <td>{don.admin || "-"}</td>
                    <td>
                      <button
                        onClick={() => demanderConfirmationSuppression(don)}
                      >
                        {t("admin.table.delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Modale de confirmation de suppression */}
          {showConfirmModal && (
            <div className="admin-modal-overlay" onClick={annulerSuppression}>
              <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <h2>{t("admin.modals.confirmDeleteTitle")}</h2>
                <p>
                  {t("admin.modals.confirmDeleteText")}
                </p>
                <div className="admin-modal-buttons">
                  <button onClick={confirmerSuppression}>{t("admin.modals.confirm")}</button>
                  <button onClick={annulerSuppression}>{t("admin.modals.cancel")}</button>
                </div>
              </div>
            </div>
          )}

          {/* Bouton retour */}
          <div className="floating-contact fixed-bottom-right">
            <CamerounButton
              onClick={() => navigate(-1)}
              className="about-button"
            >
              <FontAwesomeIcon
                icon={faHandPointLeft}
                style={{ marginRight: "8px" }}
              />
              {t("admin.accessGate.back")}
            </CamerounButton>
          </div>
        </>
      )}
    </div>
  );
}
