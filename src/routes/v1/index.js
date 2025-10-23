import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { kycRouter } from './kyc.routes.js';
import { groupsRouter } from './groups.routes.js';

export const router = Router();

router.use('/auth', authRouter);
router.use('/kyc', kycRouter);
router.use('/groups', groupsRouter);
