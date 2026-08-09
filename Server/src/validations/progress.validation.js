import Joi from "joi";

export const progressSchema = Joi.object({
  memberId: Joi.string().required(),

  weight: Joi.number().required(),

  bmi: Joi.number(),

  bodyFat: Joi.number(),

  chest: Joi.number(),

  waist: Joi.number(),

  arms: Joi.number(),

  thighs: Joi.number(),
});