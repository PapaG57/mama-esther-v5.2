import { Schema, model } from "mongoose";

const SubscriberSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const Subscriber = model("Subscriber", SubscriberSchema);

export default Subscriber;
