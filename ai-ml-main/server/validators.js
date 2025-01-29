const Joi = require('joi');

const analysisSchema = Joi.object({
  age: Joi.number()
    .required()
    .min(0)
    .max(120)
    .messages({
      'number.base': 'Age must be a number',
      'number.min': 'Age must be greater than 0',
      'number.max': 'Age must be less than 120',
      'any.required': 'Age is required'
    }),

  weight: Joi.number()
    .required()
    .min(20)
    .max(300)
    .messages({
      'number.base': 'Weight must be a number',
      'number.min': 'Weight must be greater than 20 kg',
      'number.max': 'Weight must be less than 300 kg',
      'any.required': 'Weight is required'
    }),

  height: Joi.number()
    .required()
    .min(100)
    .max(250)
    .messages({
      'number.base': 'Height must be a number',
      'number.min': 'Height must be greater than 100 cm',
      'number.max': 'Height must be less than 250 cm',
      'any.required': 'Height is required'
    }),

  cycle: Joi.number()
    .required()
    .min(0)
    .max(100)
    .messages({
      'number.base': 'Cycle length must be a number',
      'number.min': 'Cycle length must be greater than 0',
      'number.max': 'Cycle length must be less than 100 days',
      'any.required': 'Cycle length is required'
    }),

  hairGrowth: Joi.boolean().default(false),
  skinDarkening: Joi.boolean().default(false),
  hairLoss: Joi.boolean().default(false),
  pimples: Joi.boolean().default(false)
});

const validateAnalysis = (data) => {
  return analysisSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateAnalysis
};
