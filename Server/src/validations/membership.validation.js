import Joi from "joi";

export const membershipSchema = Joi.object({
  name: Joi.string().required(),

  duration: Joi.number().required(),

  price: Joi.number().required(),

  description: Joi.string(),

  features: Joi.array().items(
    Joi.string()
  ),
});