import { Router } from 'express';
import multer from 'multer';
import httpStatus from 'http-status';
import { authenticate, authorize } from '../../middleware/auth.js';
import { KycController } from '../../controllers/KycController.js';
import { User } from '../../models/User.js';

const controller = new KycController();
export const kycRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 3 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      const err = new Error('Only JPEG, PNG, WEBP are allowed');
      err.statusCode = httpStatus.BAD_REQUEST;
      return cb(err);
    }
    return cb(null, true);
  },
});

// Get current user's KYC status
kycRouter.get('/status', authenticate, controller.status);

// Upload KYC images (front, back, selfie)
kycRouter.post(
  '/upload',
  authenticate,
  upload.fields([
    { name: 'idFront', maxCount: 1 },
    { name: 'idBack', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]),
  controller.upload
);

// Simulate face verification (no AI) -> moves to pending_review
kycRouter.post('/verify-face', authenticate, controller.verifyFace);

// Admin helpers to load target user
kycRouter.param('userId', async (req, _res, next, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = httpStatus.NOT_FOUND;
      return next(err);
    }
    req.userTarget = user;
    return next();
  } catch (e) {
    return next(e);
  }
});

// Admin decision endpoints
kycRouter.post('/:userId/approve', authenticate, authorize('admin'), controller.adminApprove);
kycRouter.post('/:userId/reject', authenticate, authorize('admin'), controller.adminReject);
