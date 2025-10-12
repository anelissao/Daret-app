const kycService = require('../services/kycService');
const reliabilityScoreService = require('../services/reliabilityScoreService');
const User = require('../models/User');
const ApiResponse = require('../utils/response');

class UserController {
    async getProfile(req, res, next) {
        try {
            const user = await User.findById(req.user._id)
                .populate('reliabilityScore');

            ApiResponse.success(res, { user }, 'Profile retrieved');
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const { firstName, lastName, phone } = req.body;

            const user = await User.findById(req.user._id);

            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (phone) user.phone = phone;

            await user.save();

            ApiResponse.success(res, { user }, 'Profile updated successfully');
        } catch (error) {
            next(error);
        }
    }

    async submitKYC(req, res, next) {
        try {
            const user = await kycService.submitKYC(req.user._id, req.body);

            ApiResponse.success(res, { user }, 'KYC document submitted for verification');
        } catch (error) {
            next(error);
        }
    }

    async getReliabilityScore(req, res, next) {
        try {
            const score = await reliabilityScoreService.getScoreByUserId(req.user._id);

            ApiResponse.success(res, { score }, 'Reliability score retrieved');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
