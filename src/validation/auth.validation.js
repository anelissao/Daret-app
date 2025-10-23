import Joi from 'joi';
import httpStatus from 'http-status';
import { ApiError } from '../shared/utils/ApiError.js';

const idCardSchema = Joi.object({
  number: Joi.string().min(3).max(64).required(),
  type: Joi.string().min(2).max(32).required(),
});

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  idCard: idCardSchema.required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

export const validateRegister = (payload) => {
  const { value, error } = registerSchema.validate(payload, { abortEarly: false, stripUnknown: true });
  if (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.details.map((d) => d.message).join(', '));
  }
  return value;
};

export const validateLogin = (payload) => {
  const { value, error } = loginSchema.validate(payload, { abortEarly: false, stripUnknown: true });
  if (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.details.map((d) => d.message).join(', '));
  }
  return value;
};
