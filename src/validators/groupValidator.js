const Joi = require('joi');

const createGroupSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required().messages({
        'string.empty': 'Group name is required',
        'string.min': 'Group name must be at least 3 characters',
        'any.required': 'Group name is required'
    }),
    description: Joi.string().trim().max(500).optional(),
    contributionAmount: Joi.number().positive().required().messages({
        'number.positive': 'Contribution amount must be positive',
        'any.required': 'Contribution amount is required'
    }),
    frequency: Joi.string().valid('weekly', 'monthly').default('monthly'),
    rules: Joi.object({
        maxMembers: Joi.number().integer().min(2).max(50).default(12),
        minReliabilityScore: Joi.number().min(0).max(100).default(50),
        autoStart: Joi.boolean().default(false)
    }).optional()
});

const updateGroupSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).optional(),
    description: Joi.string().trim().max(500).optional(),
    contributionAmount: Joi.number().positive().optional(),
    frequency: Joi.string().valid('weekly', 'monthly').optional(),
    rules: Joi.object({
        maxMembers: Joi.number().integer().min(2).max(50).optional(),
        minReliabilityScore: Joi.number().min(0).max(100).optional(),
        autoStart: Joi.boolean().optional()
    }).optional()
}).min(1);

module.exports = {
    createGroupSchema,
    updateGroupSchema
};
