import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../shared/config/index.js';
import { ApiError } from '../shared/utils/ApiError.js';

export class AuthService {
  async register(payload) {
    const exists = await User.findOne({ email: payload.email });
    if (exists) {
      throw new ApiError(httpStatus.CONFLICT, 'Email already in use');
    }
    const user = await User.create(payload);
    const token = this._signToken(user.id, user.role);
    return { user, token };
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }
    const token = this._signToken(user.id, user.role);
    return { user: user.toJSON(), token };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret, { issuer: config.jwt.issuer });
    } catch (_e) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
    }
  }

  _signToken(sub, role) {
    return jwt.sign({ sub, role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
      issuer: config.jwt.issuer,
    });
  }
}
