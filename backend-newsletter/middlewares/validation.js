import Joi from "joi";

export const validateContact = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "string.min": "Le nom doit contenir au moins 2 caractères.",
      "string.max": "Le nom ne peut pas dépasser 50 caractères.",
      "any.required": "Le nom est obligatoire."
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Veuillez fournir une adresse email valide.",
      "any.required": "L'email est obligatoire."
    }),
    subject: Joi.string().min(1).max(100).required().messages({
      "string.min": "Le sujet doit contenir au moins 1 caractère.",
      "string.max": "Le sujet ne peut pas dépasser 100 caractères.",
      "any.required": "Le sujet est obligatoire."
    }),
    message: Joi.string().min(5).max(3000).required().messages({
      "string.min": "Le message doit contenir au moins 5 caractères.",
      "string.max": "Le message ne peut pas dépasser 3000 caractères.",
      "any.required": "Le message est obligatoire."
    }),
    extraField: Joi.string().allow('', null).optional().custom((value, helpers) => {
      if (value && value.trim() !== '') {
        return helpers.error('any.invalid');
      }
      return value;
    }).messages({
      "any.invalid": "Le champ extraField doit rester vide."
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validateSubscription = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Veuillez fournir une adresse email valide.",
      "any.required": "L'email est obligatoire."
    }),
    extraField: Joi.string().allow('', null).optional().custom((value, helpers) => {
      if (value && value.trim() !== '') {
        return helpers.error('any.invalid');
      }
      return value;
    }).messages({
      "any.invalid": "Le champ extraField doit rester vide."
    })
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validateDonation = (req, res, next) => {
  const schema = Joi.object({
    nomDonateur: Joi.string().min(2).max(100).required().messages({
      "string.min": "Le nom du donateur doit contenir au moins 2 caractères.",
      "string.max": "Le nom du donateur ne peut pas dépasser 100 caractères.",
      "any.required": "Le nom du donateur est obligatoire."
    }),
    montant: Joi.number().positive().max(1000000).required().messages({
      "number.base": "Le montant doit être un nombre.",
      "number.positive": "Le montant doit être positif.",
      "number.max": "Le montant ne peut pas dépasser 1 000 000.",
      "any.required": "Le montant est obligatoire."
    }),
    message: Joi.string().allow('', null).optional(),
    commentaires: Joi.string().allow('', null).optional(),
    source: Joi.string().allow('', null).optional(),
    admin: Joi.string().allow('', null).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
