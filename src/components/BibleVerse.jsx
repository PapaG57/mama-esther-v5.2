// src/components/BibleVerse.jsx
import React from "react";
import "./BibleVerse.css";
import { useTranslation } from "react-i18next";

export default function BibleVerse({ text, reference }) {
  const { t } = useTranslation();
  
  // On essaie de traduire. Si la clé n'existe pas, i18next renvoie la clé elle-même.
  const translatedText = t(text);
  const translatedRef = t(reference);

  return (
    <blockquote className="bible-verse">
      <p>{translatedText}</p>
      <span className="bible-verse-strong">{translatedRef}</span>
    </blockquote>
  );
}
