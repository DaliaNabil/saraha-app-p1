import Joi from "joi";
import { isValidObjectId } from "mongoose";

const ObjectId = (value, helper) => {
  return isValidObjectId(value) ? value : helper.message(`Invalid ObjectId`);
};
export const generalValidators = {
  sub: Joi.custom(ObjectId),
  email: Joi.string()
    .email({ tlds: { allow: ["com", "org"] }, multiple: true, separator: "$" })
    .required(),
  password: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "password must contain Minimum eight characters, at least one letter and one number",
    }),
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "phone number must be 10 digits",
    }),
};
