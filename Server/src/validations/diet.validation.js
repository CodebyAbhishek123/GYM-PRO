import Joi from "joi";

export const dietSchema = Joi.object({
  memberId: Joi.string().required(),

  goal: Joi.string()
    .valid(
      "muscle_gain",
      "weight_loss",
      "fat_loss",
      "maintenance"
    )
    .required(),

  meals: Joi.array().required(),

  dailyCalories: Joi.number(),

  protein: Joi.number(),

  carbohydrates: Joi.number(),

  fats: Joi.number(),

  waterIntake: Joi.number(),

  notes: Joi.string(),
});