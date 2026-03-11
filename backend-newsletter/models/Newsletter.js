import { Schema, model } from "mongoose";

const newsletterSchema = new Schema({
  newsletterNumber: {
    type: Number,
    required: true,
    unique: true, // Pour suivre l'ordre (ex: 4, 5, 6...)
  },
  title: {
    fr: { type: String, required: true },
    en: { type: String, required: true }
  },
  date: {
    type: Date,
    default: Date.now,
  },
  summary: {
    fr: { type: String, required: true },
    en: { type: String, required: true }
  },
  content: {
    // Structure JSON pour stocker les blocs (Texte, Image, Titre)
    fr: { type: Array, required: true },
    en: { type: Array, required: true }
  },
  coverImage: {
    type: String, // URL de l'image stockée sur le serveur
    required: true,
  },
  pdfPath: {
    type: String, // URL du PDF généré
  },
  tags: {
    fr: [String],
    en: [String]
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default model("Newsletter", newsletterSchema);
