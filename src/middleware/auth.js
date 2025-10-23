import httpStatus from 'http-status';
import { AuthService } from '../services/AuthService.js';
import { ApiError } from '../shared/utils/ApiError.js';
import { User } from '../models/User.js';

const authService = new AuthService();

export const authenticate = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Authorization header missing or malformed');
    }
    const decoded = authService.verifyToken(token);
    const user = await User.findById(decoded.sub);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
  }
  return next();
};
