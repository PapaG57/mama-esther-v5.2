import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function AdminAccessGate({ children }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const allowed = Boolean(location.state?.viaAdminButton);

  useEffect(() => {
    if (!allowed) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [allowed]);

  if (allowed) return children;

  return (
    <div style={styles.overlay} aria-modal="true" role="dialog">
      <div style={styles.modal}>
        <h2 style={styles.title}>{t("admin.accessGate.denied")}</h2>
        <p style={styles.text}>
          {t("admin.accessGate.deniedText")}
        </p>

        <button style={styles.button} onClick={() => navigate(-1)}>
          {t("admin.accessGate.back")}
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modal: {
    width: "min(560px, 90vw)",
    background: "rgba(20,20,20,0.85)",
    color: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    padding: "24px",
    textAlign: "center"
  },
  title: { margin: 0, fontSize: "1.4rem", fontWeight: 700 },
  text: { marginTop: "12px", lineHeight: 1.5 },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "#ffffff22",
    border: "1px solid #ffffff55",
    borderRadius: "8px",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "1rem"
  }
};
