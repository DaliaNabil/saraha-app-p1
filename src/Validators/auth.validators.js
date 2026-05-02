import Joi from "joi";
import { GENDER } from "../Common/constants.js";
import { generalValidators } from "../Common/validators/general.validators.js";

export const registerSchema = {
    body: Joi.object({
        firstName: Joi.string().min(2).max(50).alphanum(),
        lastName: Joi.string().min(2).max(50),
        email: generalValidators.email,
        password: generalValidators.password,
       
        confirmPassword: Joi.valid(Joi.ref('password')).messages({
            'any.only': 'Confirm password must match password'
        }),
        gender: Joi.string().valid(...Object.values(GENDER)),
  
        phoneNumber: Joi.string().length(11).pattern(/^[0-9]+$/).messages({
            'string.length': 'Phone number must be exactly 11 digits',
            'string.pattern.base': 'Phone number must contain only numbers'
        }),
    })
    .with('password', 'confirmPassword') 
    .options({ 
        presence: 'required'  
    })
}