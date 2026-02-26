// src/components/BibleVerse.jsx
import React from "react";
import "../styles/components/BibleVerse.css";
import { useTranslation } from "react-i18next";

export default function BibleVerse({ text, reference }) {
  const { t } = useTranslation();
  
  const translatedText = t(text);
  const translatedRef = t(reference);

  return (
    <blockquote className="bible-verse">
      <p>{translatedText}</p>
      <span className="bible-verse-strong">{translatedRef}</span>
    </blockquote>
  );
}
