import Joi from "joi";

export const exerciseSchema = Joi.object({
  name: Joi.string().required(),

  muscleGroup: Joi.string().required(),

  description: Joi.string().required(),

  difficulty: Joi.string()
    .valid(
      "beginner",
      "intermediate",
      "advanced"
    )
    .required(),

  equipment: Joi.array().items(Joi.string()),

  sets: Joi.number(),

  reps: Joi.string(),

  restTime: Joi.number(),

  safetyInstructions: Joi.string(),

  commonMistakes: Joi.string(),

  gifUrl: Joi.string(),

  youtubeUrl: Joi.string(),

  tips: Joi.string(),
});