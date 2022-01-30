const Joi = require("@hapi/joi");

const authLoginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
});

const authSignupSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required(),
  phoneNumber: Joi.number(),
});

module.exports = {
  authLoginSchema,
  authSignupSchema,
};
