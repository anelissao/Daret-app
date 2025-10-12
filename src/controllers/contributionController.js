const contributionService = require('../services/contributionService');
const ApiResponse = require('../utils/response');

class ContributionController {
    async recordContribution(req, res, next) {
        try {
            const contribution = await contributionService.recordContribution(
                req.validatedData,
                req.user._id
            );

            ApiResponse.created(res, { contribution }, 'Contribution recorded successfully');
        } catch (error) {
            next(error);
        }
    }

    async getGroupContributions(req, res, next) {
        try {
            const contributions = await contributionService.getGroupContributions(
                req.params.groupId
            );

            ApiResponse.success(res, { contributions }, 'Contributions retrieved');
        } catch (error) {
            next(error);
        }
    }

    async getUserContributions(req, res, next) {
        try {
            const contributions = await contributionService.getUserContributions(
                req.user._id
            );

            ApiResponse.success(res, { contributions }, 'Your contributions retrieved');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ContributionController();
