import httpStatus from 'http-status';
import { AuthService } from '../services/AuthService.js';
import { validateLogin, validateRegister } from '../validation/auth.validation.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res, next) => {
    try {
      const payload = validateRegister(req.body);
      const result = await this.authService.register(payload);
      res.status(httpStatus.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = validateLogin(req.body);
      const result = await this.authService.login(email, password);
      res.status(httpStatus.OK).json(result);
    } catch (err) {
      next(err);
    }
  };

  me = async (req, res) => {
    res.status(httpStatus.OK).json({ user: req.user });
  };
}
