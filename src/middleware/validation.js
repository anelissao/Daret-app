const { ValidationError } = require('../utils/errors');

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return next(new ValidationError(
                errors.map(e => e.message).join(', ')
            ));
        }

        req.validatedData = value;
        next();
    };
};

module.exports = validate;
