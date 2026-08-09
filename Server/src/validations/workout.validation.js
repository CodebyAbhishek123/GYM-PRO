import Joi from "joi";

export const workoutSchema = Joi.object({
  memberId: Joi.string().required(),

  weekStartDate: Joi.date().required(),

  weekEndDate: Joi.date().required(),

  notes: Joi.string(),

  days: Joi.array().required(),
});