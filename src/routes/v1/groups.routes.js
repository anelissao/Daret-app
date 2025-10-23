import { Router } from 'express';
import { GroupController } from '../../controllers/GroupController.js';
import { authenticate } from '../../middleware/auth.js';
import { requireVerified } from '../../middleware/kyc.js';
import { authorize } from '../../middleware/auth.js';

const controller = new GroupController();
export const groupsRouter = Router();

// Admin routes
groupsRouter.get('/admin/all', authenticate, authorize('admin'), controller.adminList);
groupsRouter.get('/admin/:groupId', authenticate, authorize('admin'), controller.adminGet);

// User routes
groupsRouter.get('/', authenticate, controller.myGroups);
groupsRouter.post('/', authenticate, requireVerified, controller.create);
groupsRouter.get('/:groupId', authenticate, controller.get);
groupsRouter.post('/:groupId/join', authenticate, requireVerified, controller.join);
groupsRouter.post('/:groupId/contribute', authenticate, requireVerified, controller.contribute);
