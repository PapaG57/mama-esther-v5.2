import Joi from "joi";

export const validateContact = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    subject: Joi.string().min(3).max(100).required(),
    message: Joi.string().min(10).max(2000).required(),
    extraField: Joi.string().allow('', null) // Honeypot
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validateSubscription = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    extraField: Joi.string().allow('', null) // Honeypot
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validateDonation = (req, res, next) => {
  const schema = Joi.object({
    nomDonateur: Joi.string().min(2).max(100).required(),
    montant: Joi.number().positive().required(),
    message: Joi.string().allow('', null),
    commentaires: Joi.string().allow('', null), // Used in Admin.jsx
    source: Joi.string().required(),
    admin: Joi.string().allow('', null)
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
