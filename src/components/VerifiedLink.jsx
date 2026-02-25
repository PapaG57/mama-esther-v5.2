import React from "react";

function VerifiedLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        fontWeight: "bold",
        textDecoration: "none",
        color: "#007a5e" /* vert drapeau Cameroun */,
      }}
    >
      {children}
    </a>
  );
}

export default VerifiedLink;
