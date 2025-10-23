import httpStatus from 'http-status';
import { KycService } from '../services/KycService.js';

export class KycController {
  constructor() {
    this.kycService = new KycService();
  }

  status = async (req, res) => {
    const { kyc } = req.user;
    res.status(httpStatus.OK).json({ kyc: kyc || { status: 'unsubmitted' } });
  };

  upload = async (req, res, next) => {
    try {
      const user = req.user;
      const updates = { ...user.kyc };
      const files = req.files || {};

      if (files.idFront?.[0]) {
        const saved = await this.kycService.encryptAndStore(user.id, 'idFront', files.idFront[0].buffer, files.idFront[0].mimetype);
        updates.idFront = { file: saved.filename, uploadedAt: new Date() };
      }
      if (files.idBack?.[0]) {
        const saved = await this.kycService.encryptAndStore(user.id, 'idBack', files.idBack[0].buffer, files.idBack[0].mimetype);
        updates.idBack = { file: saved.filename, uploadedAt: new Date() };
      }
      if (files.selfie?.[0]) {
        const saved = await this.kycService.encryptAndStore(user.id, 'selfie', files.selfie[0].buffer, files.selfie[0].mimetype);
        updates.selfie = { file: saved.filename, uploadedAt: new Date() };
      }

      updates.status = 'submitted';
      updates.submittedAt = new Date();
      user.kyc = updates;
      await user.save();

      res.status(httpStatus.OK).json({ message: 'KYC files uploaded', kyc: user.kyc });
    } catch (err) {
      next(err);
    }
  };

  verifyFace = async (req, res, next) => {
    try {
      // Simulate facial verification scoring, mark as pending review
      const user = req.user;
      if (!user.kyc?.selfie || !user.kyc?.idFront) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'Upload selfie and ID first' });
      }
      const score = Math.round((0.8 + Math.random() * 0.15) * 1000) / 1000; // 0.8 - 0.95
      user.kyc.faceMatchScore = score;
      user.kyc.status = 'pending_review';
      user.kyc.reviewRequestedAt = new Date();
      await user.save();
      res.status(httpStatus.OK).json({ message: 'Face check simulated; awaiting review', score, kyc: user.kyc });
    } catch (err) {
      next(err);
    }
  };

  adminApprove = async (req, res, next) => {
    try {
      const user = req.userTarget; // set by route param middleware
      user.kyc = user.kyc || {};
      user.kyc.status = 'verified';
      user.kyc.verifiedAt = new Date();
      await user.save();
      res.status(httpStatus.OK).json({ message: 'KYC verified', kyc: user.kyc });
    } catch (err) {
      next(err);
    }
  };

  adminReject = async (req, res, next) => {
    try {
      const user = req.userTarget;
      user.kyc = user.kyc || {};
      user.kyc.status = 'rejected';
      user.kyc.rejectionReason = req.body?.reason || 'Not specified';
      user.kyc.rejectedAt = new Date();
      await user.save();
      res.status(httpStatus.OK).json({ message: 'KYC rejected', kyc: user.kyc });
    } catch (err) {
      next(err);
    }
  };
}
