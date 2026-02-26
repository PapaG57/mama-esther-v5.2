// PasswordField.jsx
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../styles/components/PasswordField.css";

export default function PasswordField({
  value,
  onChange,
  label = "Mot de passe",
  required = false,
  placeholder,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-field">
      {label && <label className="password-label">{label}</label>}
      <div className="password-input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          className="input-standard"
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={
            showPassword
              ? "Masquer le mot de passe"
              : "Afficher le mot de passe"
          }
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </button>
      </div>
    </div>
  );
}
