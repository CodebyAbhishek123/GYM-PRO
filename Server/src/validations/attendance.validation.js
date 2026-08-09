import Joi from "joi";

export const attendanceSchema = Joi.object({
  memberId: Joi.string().required(),

  status: Joi.string()
    .valid(
      "present",
      "absent",
      "late"
    )
    .required(),
});