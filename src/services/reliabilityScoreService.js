const ReliabilityScore = require('../models/ReliabilityScore');
const Contribution = require('../models/Contribution');

class ReliabilityScoreService {
    async getScoreByUserId(userId) {
        let score = await ReliabilityScore.findOne({ user: userId });

        if (!score) {
            score = await ReliabilityScore.create({ user: userId });
        }

        return score;
    }

    async updateScoreAfterContribution(contribution) {
        const score = await this.getScoreByUserId(contribution.contributor);

        // Update totals
        score.totalContributions += 1;

        // Update payment status counts
        if (contribution.status === 'paid') {
            if (contribution.delayDays === 0) {
                score.onTimePayments += 1;
            } else {
                score.latePayments += 1;
            }
        } else if (contribution.status === 'missed') {
            score.missedPayments += 1;
        }

        // Calculate average delay
        const contributions = await Contribution.find({
            contributor: contribution.contributor,
            status: 'paid'
        });

        if (contributions.length > 0) {
            const totalDelay = contributions.reduce((sum, c) => sum + (c.delayDays || 0), 0);
            score.averageDelayDays = totalDelay / contributions.length;
        }

        // Recalculate score
        score.calculateScore();
        await score.save();

        return score;
    }

    async recalculateUserScore(userId) {
        const score = await this.getScoreByUserId(userId);

        // Get all user contributions
        const contributions = await Contribution.find({ contributor: userId });

        // Reset counters
        score.totalContributions = contributions.length;
        score.onTimePayments = 0;
        score.latePayments = 0;
        score.missedPayments = 0;

        // Count payment statuses
        contributions.forEach(contrib => {
            if (contrib.status === 'paid') {
                if (contrib.delayDays === 0) {
                    score.onTimePayments += 1;
                } else {
                    score.latePayments += 1;
                }
            } else if (contrib.status === 'missed') {
                score.missedPayments += 1;
            }
        });

        // Calculate average delay
        const paidContributions = contributions.filter(c => c.status === 'paid');
        if (paidContributions.length > 0) {
            const totalDelay = paidContributions.reduce((sum, c) => sum + (c.delayDays || 0), 0);
            score.averageDelayDays = totalDelay / paidContributions.length;
        }

        // Recalculate score
        score.calculateScore();
        await score.save();

        return score;
    }
}

module.exports = new ReliabilityScoreService();
