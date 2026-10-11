import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTrash, 
  faPlusCircle, 
  faUsersCog, 
  faCoins, 
  faFileExcel, 
  faSignOutAlt, 
  faNewspaper, 
  faKey, 
  faUserEdit,
  faRobot,
  faPaperPlane,
  faCopy,
  faTimes,
  faMagic // <-- Remplacé faSparkles par faMagic ici
} from "@fortawesome/free-solid-svg-icons";
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

  // États formulaires et Modales Admin
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [nomDonateur, setNomDonateur] = useState("");
  const [emailDonateur, setEmailDonateur] = useState("");
  const [montant, setMontant] = useState("");
  const [commentaires, setCommentaires] = useState("");
  const [source, setSource] = useState("");
  const [sourcePrecise, setSourcePrecise] = useState("");
  const [dons, setDons] = useState([]);
  const [donASupprimer, setDonASupprimer] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showChangeCredentialsModal, setShowChangeCredentialsModal] = useState(false);
  const [changeCredentials, setChangeCredentials] = useState({
    nouvelIdentifiant: "",
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmationNouveauMotDePasse: "",
  });

  // États pour la modale Chat AI Gemini
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Bonjour ! Je suis votre assistant IA Gemini. Comment puis-je vous aider dans la rédaction de vos newsletters ou la gestion de l'association ?" }
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatBottomRef = useRef(null);

  // Auto-scroll vers le bas des messages
  useEffect(() => {
    if (showChatModal) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, showChatModal, isAiLoading]);

  // Appel API Gemini direct
  const handleSendMessage = async () => {
    if (currentInput.trim() === "" || isAiLoading) return;

    const userText = currentInput.trim();
    const newUserMessage = { sender: "user", text: userText };
    setChatMessages((prev) => [...prev, newUserMessage]);
    setCurrentInput("");
    setIsAiLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      toast.error("Clé API Gemini non configurée dans .env (VITE_GEMINI_API_KEY)");
      setChatMessages((prev) => [
        ...prev, 
        { sender: "ai", text: "⚠️ Erreur : La clé API VITE_GEMINI_API_KEY manque dans votre fichier .env." }
      ]);
      setIsAiLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `Tu es un assistant rédactionnel bienveillant et efficace pour l'association Mama Esther. Réponds de façon claire et structurée à la demande suivante :\n\n${userText}` }]
              }
            ]
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Erreur lors de l'appel Gemini");
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas pu générer de réponse.";
      setChatMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
    } catch (err) {
      console.error("Erreur Gemini AI :", err);
      toast.error("Erreur lors de la génération IA");
      setChatMessages((prev) => [
        ...prev, 
        { sender: "ai", text: `❌ Erreur : ${err.message || "Impossible d'interroger Gemini."}` }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Texte copié dans le presse-papier !"))
      .catch(() => toast.error("Erreur de copie"));
  };

  const handleChangeCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (!changeCredentials.ancienMotDePasse) {
      toast.error("L'ancien mot de passe est obligatoire");
      return;
    }
    if (!changeCredentials.nouvelIdentifiant && !changeCredentials.nouveauMotDePasse) {
      toast.error("Au moins un champ doit être renseigné");
      return;
    }
    if (changeCredentials.nouveauMotDePasse && changeCredentials.nouveauMotDePasse !== changeCredentials.confirmationNouveauMotDePasse) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await adminService.changeCredentials({
        ancienMotDePasse: changeCredentials.ancienMotDePasse,
        nouvelIdentifiant: changeCredentials.nouvelIdentifiant || undefined,
        nouveauMotDePasse: changeCredentials.nouveauMotDePasse || undefined,
      });

      toast.success("Identifiants mis à jour avec succès !");
      setShowChangeCredentialsModal(false);
      setChangeCredentials({
        nouvelIdentifiant: "",
        ancienMotDePasse: "",
        nouveauMotDePasse: "",
        confirmationNouveauMotDePasse: "",
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Erreur de mise à jour";
      toast.error(msg);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    window.location.replace("/");
  };

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
    fetchDons();
    return () => {
      if (!window.location.pathname.includes("/admin")) {
        sessionStorage.removeItem("adminToken");
      }
    };
  }, []);

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
      toast.error(err.message || t("admin.messages.networkError"));
    }
  };

  const handleManualDonation = async (e) => {
    e.preventDefault();
    const data = {
      nomDonateur,
      email: emailDonateur,
      montant: parseFloat(montant),
      commentaires,
      source: source === "Autres (préciser)" ? sourcePrecise : source,
    };
    try {
      await adminService.addManualDonation(data);
      toast.success(t("admin.messages.donAdded"));
      setNomDonateur("");
      setEmailDonateur("");
      setMontant("");
      setCommentaires("");
      setSource("");
      setSourcePrecise("");
      fetchDons();
    } catch (err) {
      toast.error(err.message || t("admin.messages.networkError"));
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
      toast.error(err.message || t("admin.messages.networkError"));
    } finally {
      setDonASupprimer(null);
      setShowConfirmModal(false);
    }
  };

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
      headers.join(";"),
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

  return (
    <div className="v2-layout">
      <Navbar hideDonate={true} />
      
      <main className="admin-v2-container">
        <div className="v2-container">
          <h1>
            <FontAwesomeIcon icon={faUsersCog} style={{marginRight: "20px", color: "var(--color-green)"}} />
            {t("admin.dashboard.title")}
          </h1>

          {/* BARRE DE BOUTONS D'ACTION */}
          <div style={{display: "flex", justifyContent: "center", gap: "20px", marginBottom: "30px", flexWrap: "wrap"}}>
            <button
              className="v2-btn v2-btn-green"
              style={{
                padding: "14px 28px",
                fontSize: "1rem",
                fontWeight: "700",
                borderRadius: "9999px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                cursor: "pointer",
                border: "none",
              }}
              onClick={() => setShowChangeCredentialsModal(true)}
            >
              <FontAwesomeIcon icon={faKey} style={{ marginRight: "10px" }} />
              🔑 Modifier mes identifiants
            </button>

            {/* BOUTON CHAT AI AMÉLIORÉ */}
            <button
              className="v2-btn v2-btn-primary"
              style={{
                padding: "14px 28px",
                fontSize: "1rem",
                fontWeight: "700",
                borderRadius: "9999px",
                boxShadow: "0 4px 12px rgba(0, 122, 94, 0.3)",
                background: "linear-gradient(135deg, #007a5e 0%, #00b386 100%)",
                color: "white",
                cursor: "pointer",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
              onClick={() => setShowChatModal(true)}
            >
              <FontAwesomeIcon icon={faRobot} style={{ fontSize: "1.2rem" }} />
              🤖 Assistant Chat AI Gemini
            </button>
          </div>

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
                <input type="email" className="admin-v2-input" placeholder="Email du donateur (pour remerciement)" value={emailDonateur} onChange={(e) => setEmailDonateur(e.target.value)} />
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

          <div className="admin-v2-grid" style={{ marginTop: '40px' }}>
            <div className="admin-v2-card" style={{ cursor: 'pointer', border: '2px solid var(--color-green)', transition: 'transform 0.3s' }} onClick={() => navigate('/admin/newsletter/new')}>
              <h2 style={{ textAlign: 'center' }}>
                <FontAwesomeIcon icon={faNewspaper} style={{ marginRight: '15px' }} />
                {t("admin.newsletters.title")}
              </h2>
              <p style={{ textAlign: 'center', opacity: 0.7 }}>Cliquez ici pour créer, modifier ou supprimer vos newsletters dans un éditeur visuel moderne.</p>
              <button className="v2-btn v2-btn-green" style={{ width: '100%', marginTop: '20px' }}>
                <FontAwesomeIcon icon={faPlusCircle} style={{ marginRight: '10px' }} />
                {t("admin.newsletters.createBtn")}
              </button>
            </div>
          </div>

          <div style={{marginTop: "60px", textAlign: "center"}}>
            <button onClick={handleLogout} className="v2-btn v2-btn-red">
              <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: "10px" }} />
              {t("admin.dashboard.logout")}
            </button>
          </div>
        </div>
      </main>

      {/* MODALES CLASSIQUES */}
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

      {showChangeCredentialsModal && (
        <div className="v2-modal-overlay" style={{backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.5)"}}>
          <div className="v2-modal" style={{maxWidth: "450px", borderRadius: "20px", padding: "30px"}}>
            <h2 style={{color: "var(--color-green)", textAlign: "center", marginBottom: "20px"}}>
              <FontAwesomeIcon icon={faUserEdit} style={{marginRight: "10px"}} />
              Modifier mes identifiants
            </h2>
            <form onSubmit={handleChangeCredentialsSubmit} className="admin-v2-form">
              <label style={{display: "block", marginBottom: "5px", fontWeight: "600", color: "var(--color-dark)"}}>Nouvel identifiant / Email</label>
              <input
                type="text"
                className="admin-v2-input"
                placeholder="Nouvel identifiant (optionnel)"
                value={changeCredentials.nouvelIdentifiant}
                onChange={(e) => setChangeCredentials({...changeCredentials, nouvelIdentifiant: e.target.value})}
              />
              <label style={{display: "block", marginBottom: "5px", fontWeight: "600", color: "var(--color-dark)"}}>Ancien mot de passe (Requis)</label>
              <PasswordField
                value={changeCredentials.ancienMotDePasse}
                onChange={(e) => setChangeCredentials({...changeCredentials, ancienMotDePasse: e.target.value})}
                placeholder="Ancien mot de passe"
                required
              />
              <label style={{display: "block", marginBottom: "5px", fontWeight: "600", color: "var(--color-dark)"}}>Nouveau mot de passe</label>
              <PasswordField
                value={changeCredentials.nouveauMotDePasse}
                onChange={(e) => setChangeCredentials({...changeCredentials, nouveauMotDePasse: e.target.value})}
                placeholder="Nouveau mot de passe (optionnel)"
              />
              <label style={{display: "block", marginBottom: "5px", fontWeight: "600", color: "var(--color-dark)"}}>Confirmer le nouveau mot de passe</label>
              <PasswordField
                value={changeCredentials.confirmationNouveauMotDePasse}
                onChange={(e) => setChangeCredentials({...changeCredentials, confirmationNouveauMotDePasse: e.target.value})}
                placeholder="Confirmer le nouveau mot de passe"
              />
              <div style={{display: "flex", gap: "15px", marginTop: "20px"}}>
                <button type="submit" className="v2-btn v2-btn-green" style={{flex: 1}}>
                  <FontAwesomeIcon icon={faKey} style={{marginRight: "8px"}} />
                  Mettre à jour
                </button>
                <button type="button" className="v2-btn v2-btn-outline-green" style={{flex: 1}} onClick={() => setShowChangeCredentialsModal(false)}>
                  {t("admin.modals.cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE MODERNE ASSISTANT GEMINI AI */}
      {showChatModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '680px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            height: '85vh',
            maxHeight: '750px',
            overflow: 'hidden',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            {/* Header de la Modale */}
            <div style={{
              background: 'linear-gradient(135deg, #007a5e 0%, #004d3b 100%)',
              color: 'white',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FontAwesomeIcon icon={faMagic} style={{ fontSize: '1.2rem', color: '#ffea79' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Assistant IA Mama Esther</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', opacity: 0.85 }}>Propulsé par Google Gemini 2.5 Flash</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChatModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  opacity: 0.8,
                  padding: '6px',
                  borderRadius: '50%',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Zone de conversation */}
            <div style={{
              flexGrow: 1,
              overflowY: 'auto',
              padding: '24px',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {chatMessages.map((msg, index) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={index} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    alignSelf: isUser ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{
                      backgroundColor: isUser ? '#007a5e' : '#ffffff',
                      color: isUser ? '#ffffff' : '#1e293b',
                      padding: '14px 18px',
                      borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      boxShadow: isUser ? '0 4px 12px rgba(0, 122, 94, 0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
                      fontSize: '0.95rem',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      position: 'relative'
                    }}>
                      {msg.text}
                    </div>

                    {!isUser && (
                      <button 
                        onClick={() => handleCopyMessage(msg.text)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          marginTop: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        <FontAwesomeIcon icon={faCopy} /> Copier
                      </button>
                    )}
                  </div>
                );
              })}

              {isAiLoading && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#ffffff', padding: '12px 18px', borderRadius: '20px 20px 20px 4px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <FontAwesomeIcon icon={faMagic} className="fa-spin" style={{ color: '#007a5e' }} />
                  <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>L'IA réfléchit...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Zone de saisie */}
            <div style={{
              padding: '18px 24px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Rédiger un article, poser une question..."
                style={{
                  flexGrow: 1,
                  padding: '12px 16px',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '14px',
                  outline: 'none',
                  fontSize: '0.95rem',
                  resize: 'none',
                  maxHeight: '100px',
                  minHeight: '46px',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007a5e'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />

              <button
                onClick={handleSendMessage}
                disabled={isAiLoading || !currentInput.trim()}
                style={{
                  backgroundColor: currentInput.trim() && !isAiLoading ? '#007a5e' : '#cbd5e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  width: '48px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentInput.trim() && !isAiLoading ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s',
                  fontSize: '1.1rem'
                }}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}