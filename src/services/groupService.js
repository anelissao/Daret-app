const Group = require('../models/Group');
const User = require('../models/User');
const ReliabilityScore = require('../models/ReliabilityScore');
const Contribution = require('../models/Contribution');
const { NotFoundError, ValidationError, AuthorizationError } = require('../utils/errors');

class GroupService {
    async createGroup(groupData, creatorId) {
        // Create group
        const group = await Group.create({
            ...groupData,
            creator: creatorId,
            members: [{
                user: creatorId,
                joinedAt: new Date(),
                turnOrder: 1
            }]
        });

        await group.populate('members.user', 'firstName lastName email');
        return group;
    }

    async getGroupById(groupId) {
        const group = await Group.findById(groupId)
            .populate('members.user', 'firstName lastName email kycVerified')
            .populate('creator', 'firstName lastName email')
            .populate('currentBeneficiary', 'firstName lastName email');

        if (!group) {
            throw new NotFoundError('Group not found');
        }

        return group;
    }

    async getUserGroups(userId) {
        const groups = await Group.find({
            'members.user': userId,
            status: { $ne: 'cancelled' }
        })
            .populate('creator', 'firstName lastName email')
            .populate('members.user', 'firstName lastName email')
            .sort('-createdAt');

        return groups;
    }

    async joinGroup(groupId, userId) {
        const group = await this.getGroupById(groupId);

        // Check if group is accepting members
        if (group.status !== 'pending') {
            throw new ValidationError('Group is not accepting new members');
        }

        // Check if already a member
        const isMember = group.members.some(
            m => m.user._id.toString() === userId.toString()
        );

        if (isMember) {
            throw new ValidationError('Already a member of this group');
        }

        // Check max members
        if (group.members.length >= group.rules.maxMembers) {
            throw new ValidationError('Group has reached maximum members');
        }

        // Check reliability score
        const userScore = await ReliabilityScore.findOne({ user: userId });
        if (userScore && userScore.score < group.rules.minReliabilityScore) {
            throw new ValidationError(
                `Minimum reliability score of ${group.rules.minReliabilityScore} required`
            );
        }

        // Add user to group
        group.members.push({
            user: userId,
            joinedAt: new Date(),
            turnOrder: group.members.length + 1
        });

        await group.save();
        await group.populate('members.user', 'firstName lastName email');

        return group;
    }

    async updateGroup(groupId, updateData, userId) {
        const group = await this.getGroupById(groupId);

        // Only creator can update
        if (group.creator._id.toString() !== userId.toString()) {
            throw new AuthorizationError('Only group creator can update group');
        }

        // Cannot update if group is active or completed
        if (group.status === 'active' || group.status === 'completed') {
            throw new ValidationError('Cannot update active or completed group');
        }

        Object.assign(group, updateData);
        await group.save();

        return group;
    }

    async startGroup(groupId, userId) {
        const group = await this.getGroupById(groupId);

        // Only creator can start
        if (group.creator._id.toString() !== userId.toString()) {
            throw new AuthorizationError('Only group creator can start group');
        }

        if (group.status !== 'pending') {
            throw new ValidationError('Group already started');
        }

        // Need at least 2 members
        if (group.members.length < 2) {
            throw new ValidationError('Need at least 2 members to start');
        }

        // Order members by reliability score
        await this.orderMembersByScore(group);

        // Set first beneficiary
        group.currentBeneficiary = group.members[0].user;
        group.currentRound = 1;
        group.status = 'active';
        group.startDate = new Date();

        await group.save();

        // Create initial contributions for first round
        await this.createRoundContributions(group);

        return group;
    }

    async orderMembersByScore(group) {
        // Get all member scores
        const memberScores = await Promise.all(
            group.members.map(async (member) => {
                const score = await ReliabilityScore.findOne({ user: member.user });
                return {
                    memberId: member._id,
                    userId: member.user,
                    score: score ? score.score : 100
                };
            })
        );

        // Sort by score (highest first)
        memberScores.sort((a, b) => b.score - a.score);

        // Update turn order
        memberScores.forEach((ms, index) => {
            const member = group.members.id(ms.memberId);
            if (member) {
                member.turnOrder = index + 1;
            }
        });
    }

    async createRoundContributions(group) {
        const dueDate = new Date();

        // Set due date based on frequency
        if (group.frequency === 'weekly') {
            dueDate.setDate(dueDate.getDate() + 7);
        } else {
            dueDate.setMonth(dueDate.getMonth() + 1);
        }

        const beneficiary = group.currentBeneficiary;

        // Create contribution for each member
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

    async getGroupHistory(groupId) {
        const contributions = await Contribution.find({ group: groupId })
            .populate('contributor', 'firstName lastName email')
            .populate('beneficiary', 'firstName lastName email')
            .sort('-round -createdAt');

        return contributions;
    }
}

module.exports = new GroupService();
