const User = require('../models/User');
const { NotFoundError, ValidationError } = require('../utils/errors');

class KYCService {
    async submitKYC(userId, kycData) {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (user.kycVerified) {
            throw new ValidationError('KYC already verified');
        }

        // Update KYC document
        user.kycDocument = {
            idCardNumber: kycData.idCardNumber,
            idCardImage: kycData.idCardImage,
            selfieImage: kycData.selfieImage,
            verificationStatus: 'pending'
        };

        await user.save();

        return user;
    }

    async verifyKYC(userId, adminId, approved, rejectionReason = null) {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (!user.kycDocument) {
            throw new ValidationError('No KYC document submitted');
        }

        if (approved) {
            user.kycDocument.verificationStatus = 'approved';
            user.kycVerified = true;
            user.kycDocument.verifiedBy = adminId;
            user.kycDocument.verifiedAt = new Date();
        } else {
            user.kycDocument.verificationStatus = 'rejected';
            user.kycDocument.rejectionReason = rejectionReason;
            user.kycVerified = false;
        }

        await user.save();

        return user;
    }

    async getPendingKYCVerifications() {
        const users = await User.find({
            'kycDocument.verificationStatus': 'pending'
        }).select('firstName lastName email kycDocument createdAt');

        return users;
    }

    // Placeholder for future facial verification integration
    async verifyFacialMatch(idCardImage, selfieImage) {
        // TODO: Integrate with face-api.js or LLM model
        // This is prepared for future implementation

        // For now, return a placeholder response
        return {
            match: false,
            confidence: 0,
            message: 'Facial verification not yet implemented'
        };
    }
}

module.exports = new KYCService();
