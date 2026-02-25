import { Schema, model } from "mongoose";

const adminSchema = new Schema({
  identifiant: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  motDePasse: {
    type: String,
    required: true,
  },
  crééLe: {
    type: Date,
    default: Date.now,
  },
});

export default model("Admin", adminSchema);
