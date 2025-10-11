const Joi = require('joi');

const createContributionSchema = Joi.object({
    groupId: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid group ID',
        'any.required': 'Group ID is required'
    }),
    amount: Joi.number().positive().required().messages({
        'number.positive': 'Amount must be positive',
        'any.required': 'Amount is required'
    }),
    paymentProof: Joi.string().uri().optional(),
    notes: Joi.string().trim().max(500).optional()
});

module.exports = {
    createContributionSchema
};
