import { Router } from 'express';
import { AuthController } from '../../controllers/AuthController.js';
import { authenticate } from '../../middleware/auth.js';

const controller = new AuthController();
export const authRouter = Router();

authRouter.post('/register', controller.register);
authRouter.post('/login', controller.login);
authRouter.get('/me', authenticate, controller.me);
