import Joi from 'joi';
import httpStatus from 'http-status';
import { ApiError } from '../shared/utils/ApiError.js';

const objectId = Joi.string().regex(/^[a-f\d]{24}$/i, 'objectId');

const createSchema = Joi.object({
  name: Joi.string().min(3).max(120).required(),
  contributionAmount: Joi.number().positive().precision(2).required(),
  frequency: Joi.string().valid('weekly', 'monthly', 'custom').required(),
  frequencyDays: Joi.number().integer().min(1).max(90).when('frequency', {
    is: 'custom',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  maxMembers: Joi.number().integer().min(2).max(100).default(12),
  rotationOrder: Joi.array().items(objectId).min(1).optional(),
});

export const validateCreateGroup = (payload) => {
  const { value, error } = createSchema.validate(payload, { abortEarly: false, stripUnknown: true });
  if (error) throw new ApiError(httpStatus.BAD_REQUEST, error.details.map((d) => d.message).join(', '));
  return value;
};

export const validateGroupId = (params) => {
  const schema = Joi.object({ groupId: objectId.required() });
  const { value, error } = schema.validate(params);
  if (error) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid group id');
  return value.groupId;
};
