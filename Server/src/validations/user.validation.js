import Joi from "joi";

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50),

  phone: Joi.string(),

  address: Joi.string(),

  gender: Joi.string().valid(
    "male",
    "female",
    "other"
  ),

  dateOfBirth: Joi.date(),

  profileImage: Joi.string(),
});