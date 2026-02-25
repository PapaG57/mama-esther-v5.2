import { Schema, model } from "mongoose";

const donationSchema = new Schema({
  nomDonateur: {
    type: String,
    required: true,
    trim: true,
  },
  montant: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
    trim: true,
  },
  commentaires: {
    type: String,
    trim: true,
  },
  admin: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model("Donation", donationSchema);
