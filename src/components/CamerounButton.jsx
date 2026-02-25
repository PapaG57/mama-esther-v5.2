import { Link } from "react-router-dom";
import "./camerounButton.css";

export default function CamerounButton({
  children,
  to,
  onClick,
  style = {},
  className = "",
}) {
  if (to) {
    return (
      <Link to={to} className={`about-button ${className}`} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`about-button ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
