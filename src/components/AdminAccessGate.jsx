import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/AdminV2.css";

export default function AdminAccessGate({ children }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Vérification si un token admin existe (même si ce n'est pas "valid-admin-token" pour le dev)
  const token = sessionStorage.getItem("adminToken");
  const isAuthorized = !!token;

  if (!isAuthorized) {
    return (
      <div className="v2-modal-overlay">
        <div className="v2-modal" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <h2 style={{ color: "var(--color-red)", marginBottom: '20px' }}>
            {t("admin.accessGate.denied")}
          </h2>
          <p style={{ marginBottom: '30px', color: 'var(--color-text-muted)' }}>
            {t("admin.accessGate.deniedText")}
          </p>
          <button 
            className="v2-btn v2-btn-primary" 
                        onClick={() => {
              // Retour propre vers l'accueil en utilisant le routeur
              navigate("/");
            }}
          >
            {t("admin.accessGate.back")}
          </button>
        </div>
      </div>
    );
  }

  return children;
}


