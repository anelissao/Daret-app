const Contribution = require('../models/Contribution');
const Group = require('../models/Group');
const reliabilityScoreService = require('./reliabilityScoreService');
const { NotFoundError, ValidationError } = require('../utils/errors');

class ContributionService {
    async recordContribution(contributionData, userId) {
        const { groupId, amount, paymentProof, notes } = contributionData;

        // Find pending contribution for this user in current round
        const group = await Group.findById(groupId);
        if (!group) {
            throw new NotFoundError('Group not found');
        }

        const contribution = await Contribution.findOne({
            group: groupId,
            contributor: userId,
            round: group.currentRound,
            status: 'pending'
        });

        if (!contribution) {
            throw new NotFoundError('No pending contribution found');
        }

        // Verify amount matches
        if (amount !== contribution.amount) {
            throw new ValidationError('Amount does not match required contribution');
        }

        // Update contribution
        contribution.status = 'paid';
        contribution.paidDate = new Date();
        contribution.paymentProof = paymentProof;
        contribution.notes = notes;

        await contribution.save();

        // Update reliability score
        await reliabilityScoreService.updateScoreAfterContribution(contribution);

        // Check if round is complete
        await this.checkRoundCompletion(group);

        return contribution;
    }

    async checkRoundCompletion(group) {
        // Count paid contributions in current round
        const roundContributions = await Contribution.find({
            group: group._id,
            round: group.currentRound
        });

        const allPaid = roundContributions.every(c => c.status === 'paid');

        if (allPaid) {
            // Mark current beneficiary turn as taken
            const currentMember = group.members.find(
                m => m.user.toString() === group.currentBeneficiary.toString()
            );

            if (currentMember) {
                currentMember.hasTakenTurn = true;
                currentMember.turnTakenAt = new Date();
            }

            // Move to next round
            const nextMember = group.members.find(
                m => !m.hasTakenTurn
            );

            if (nextMember) {
                group.currentRound += 1;
                group.currentBeneficiary = nextMember.user;
                await group.save();

                // Create contributions for next round
                await this.createNextRoundContributions(group);
            } else {
                // All members have taken turns, group completed
                group.status = 'completed';
                await group.save();
            }
        }
    }

    async createNextRoundContributions(group) {
        const dueDate = new Date();

        if (group.frequency === 'weekly') {
            dueDate.setDate(dueDate.getDate() + 7);
        } else {
            dueDate.setMonth(dueDate.getMonth() + 1);
        }

        const beneficiary = group.currentBeneficiary;

        const contributions = group.members.map(member => ({
            group: group._id,
            round: group.currentRound,
            contributor: member.user,
            beneficiary: beneficiary,
            amount: group.contributionAmount,
            dueDate: dueDate,
            status: 'pending'
        }));

        await Contribution.insertMany(contributions);
    }

    async getGroupContributions(groupId) {
        const contributions = await Contribution.find({ group: groupId })
            .populate('contributor', 'firstName lastName email')
            .populate('beneficiary', 'firstName lastName email')
            .sort('-round -createdAt');

        return contributions;
    }

    async getUserContributions(userId) {
        const contributions = await Contribution.find({ contributor: userId })
            .populate('group', 'name contributionAmount')
            .populate('beneficiary', 'firstName lastName email')
            .sort('-createdAt');

        return contributions;
    }

    async markLateContributions() {
        const now = new Date();

        // Find pending contributions past due date
        const lateContributions = await Contribution.find({
            status: 'pending',
            dueDate: { $lt: now }
        });

        for (const contribution of lateContributions) {
            contribution.status = 'late';
            await contribution.save();
        }

        return lateContributions.length;
    }
}

module.exports = new ContributionService();
