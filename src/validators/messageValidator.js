const Joi = require('joi');

const sendMessageSchema = Joi.object({
    messageType: Joi.string().valid('text', 'audio').default('text'),
    content: Joi.when('messageType', {
        is: 'text',
        then: Joi.string().trim().min(1).max(1000).required(),
        otherwise: Joi.optional()
    }),
    audioUrl: Joi.when('messageType', {
        is: 'audio',
        then: Joi.string().uri().required(),
        otherwise: Joi.optional()
    })
});

const createTicketSchema = Joi.object({
    subject: Joi.string().trim().min(3).max(200).required(),
    description: Joi.string().trim().min(10).max(2000).required(),
    category: Joi.string().valid('payment', 'dispute', 'technical', 'other').default('other'),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    group: Joi.string().hex().length(24).optional()
});

module.exports = {
    sendMessageSchema,
    createTicketSchema
};
