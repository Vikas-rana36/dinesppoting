let Joi = require('joi');
const { User, userSchema } = require('../../models/user');
/*
We can add multiple message like this
const ValidationSchemas = Joi.object({    
    name: Joi.string()  
      .min(6)
      .required()
      .messages({
        'string.empty': 'Display name cannot be empty',
        'string.min': 'Min 6 characteers',
      })
      .optional(),
    email: Joi.string().min(6).required().email().message('Must be a valid email address'),
    password: Joi.string().required().min(6).message('Password is required!'),
  });
  */
const loginJoiSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    socialToken: Joi.string(),
    password: Joi.string().when('socialToken', {is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required()}),
    name: Joi.string(),
    device_token: Joi.array()
})
const ForgotPasswordJoiSchema = Joi.object().keys({
    email: Joi.string().email().required(),
})

const signupJoiSchema = Joi.object().keys({
    first_name: Joi.string().max(10).required().label('First Name') ,
    last_name: Joi.string().max(10).label('Last Name'),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string()
              .min(8)
              .required()
              .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/)
              .label('Password')
              .messages({
      "string.min": "Must have at least 8 characters",
      "object.regex": "Must have at least 8 characters",
      "string.pattern.base": "Minimum length is 8. Password must contain at least 1 Letter in Capital Case. Password must contain at least 1 special character. Must contain at least 1 number."
    }),
    confirmPassword:Joi.string().required().valid(Joi.ref('password'))
})

const ChangePasswordJoiSchema = Joi.object().keys({
  oldPassword: Joi.string().required(),
  Password: Joi.string().required(),
})

const ContactUsJoiSchema = Joi.object().keys({
  first_name: Joi.string().required(),
  email: Joi.string().email().required(),
  last_name: Joi.string().allow('', null),
  message: Joi.string().required().label('Enter the message')
})

module.exports = {loginJoiSchema, signupJoiSchema, ContactUsJoiSchema, ForgotPasswordJoiSchema, ChangePasswordJoiSchema}