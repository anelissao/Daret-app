const groupService = require('../services/groupService');
const kycService = require('../services/kycService');
const ticketService = require('../services/ticketService');
const User = require('../models/User');
const ApiResponse = require('../utils/response');

class AdminController {
    async getAllGroups(req, res, next) {
        try {
            const { status } = req.query;
            const query = {};

            if (status) {
                query.status = status;
            }

            const groups = await require('../models/Group').find(query)
                .populate('creator', 'firstName lastName email')
                .populate('members.user', 'firstName lastName email')
                .sort('-createdAt');

            ApiResponse.success(res, { groups }, 'All groups retrieved');
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await User.find()
                .populate('reliabilityScore')
                .sort('-createdAt');

            ApiResponse.success(res, { users }, 'All users retrieved');
        } catch (error) {
            next(error);
        }
    }

    async getPendingKYC(req, res, next) {
        try {
            const pendingUsers = await kycService.getPendingKYCVerifications();

            ApiResponse.success(res, { pendingUsers }, 'Pending KYC verifications retrieved');
        } catch (error) {
            next(error);
        }
    }

    async verifyKYC(req, res, next) {
        try {
            const { userId } = req.params;
            const { approved, rejectionReason } = req.body;

            const user = await kycService.verifyKYC(
                userId,
                req.user._id,
                approved,
                rejectionReason
            );

            ApiResponse.success(res, { user }, 'KYC verification completed');
        } catch (error) {
            next(error);
        }
    }

    async getAllTickets(req, res, next) {
        try {
            const tickets = await ticketService.getAllTickets(req.query);

            ApiResponse.success(res, { tickets }, 'All tickets retrieved');
        } catch (error) {
            next(error);
        }
    }

    async getStats(req, res, next) {
        try {
            const totalUsers = await User.countDocuments();
            const totalGroups = await require('../models/Group').countDocuments();
            const activeGroups = await require('../models/Group').countDocuments({ status: 'active' });
            const pendingKYC = await User.countDocuments({ 'kycDocument.verificationStatus': 'pending' });

            const stats = {
                totalUsers,
                totalGroups,
                activeGroups,
                pendingKYC
            };

            ApiResponse.success(res, { stats }, 'Stats retrieved');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminController();
