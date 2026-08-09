import Joi from "joi";

export const paymentSchema = Joi.object({
  memberId: Joi.string().required(),

  membershipPlanId: Joi.string().required(),

  amount: Joi.number().required(),

  paymentMethod: Joi.string()
    .valid(
      "cash",
      "card",
      "online"
    )
    .required(),
});