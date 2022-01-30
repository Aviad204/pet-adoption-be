const Joi = require("@hapi/joi");

const addPetSchema = Joi.object({
  type: Joi.string().max(50).valid("dog", "cat", "rabbit", "parrot").required(),
  name: Joi.string().max(50).required(),
  adoptionStatus: Joi.string()
    .valid("Adoption", "Adopted", "Fostered", "Fostering", "Both")
    .required(),
  color: Joi.string().max(50),
  breed: Joi.string().max(50),
  bio: Joi.string().max(200),
  height: Joi.number().min(0).max(200),
  weight: Joi.number().min(0).max(80),
  dietery: Joi.string().max(200),
  hypoallergenic: Joi.boolean(),
  image: Joi.string().max(500),
});

const editPetSchema = Joi.object({
  name: Joi.string().max(50).required(),
  adoptionStatus: Joi.string().valid(
    "Adoption",
    "Adopted",
    "Fostered",
    "Fostering",
    "Both"
  ),
  color: Joi.string().max(50),
  breed: Joi.string().max(50),
  bio: Joi.string().max(200),
  height: Joi.number().min(0).max(200),
  weight: Joi.number().min(0).max(80),
  dietery: Joi.string().max(200),
  hypoallergenic: Joi.boolean(),
  image: Joi.string().max(500),
  petID: Joi.string().min(0).max(500),
});

module.exports = {
  addPetSchema,
  editPetSchema,
};
