const Joi = require('joi');

const registerSchema = Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'First name is required',
        'string.min': 'First name must be at least 2 characters',
        'any.required': 'First name is required'
    }),
    lastName: Joi.string().trim().min(2).max(50).required().messages({
        'string.empty': 'Last name is required',
        'string.min': 'Last name must be at least 2 characters',
        'any.required': 'Last name is required'
    }),
    email: Joi.string().email().lowercase().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    }),
    phone: Joi.string().trim().pattern(/^[0-9+\-\s()]+$/).required().messages({
        'string.pattern.base': 'Please provide a valid phone number',
        'any.required': 'Phone number is required'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    })
});

module.exports = {
    registerSchema,
    loginSchema
};
