const contributionService = require('../../services/contributionService');
const Contribution = require('../../models/Contribution');
const Group = require('../../models/Group');
const reliabilityScoreService = require('../../services/reliabilityScoreService');

jest.mock('../../models/Contribution');
jest.mock('../../models/Group');
jest.mock('../../services/reliabilityScoreService');

describe('ContributionService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('recordContribution', () => {
        it('should record a contribution successfully', async () => {
            const contributionData = {
                groupId: 'group123',
                amount: 1000,
                paymentProof: 'proof.jpg',
                notes: 'Payment made'
            };
            const userId = 'user123';

            const mockGroup = {
                _id: 'group123',
                currentRound: 1
            };

            const mockContribution = {
                group: 'group123',
                contributor: userId,
                round: 1,
                amount: 1000,
                status: 'pending',
                save: jest.fn()
            };

            Group.findById.mockResolvedValue(mockGroup);
            Contribution.findOne.mockResolvedValue(mockContribution);
            reliabilityScoreService.updateScoreAfterContribution.mockResolvedValue({});

            const result = await contributionService.recordContribution(contributionData, userId);

            expect(mockContribution.status).toBe('paid');
            expect(mockContribution.paymentProof).toBe('proof.jpg');
            expect(mockContribution.save).toHaveBeenCalled();
            expect(reliabilityScoreService.updateScoreAfterContribution).toHaveBeenCalledWith(mockContribution);
        });

        it('should throw error if amount does not match', async () => {
            const contributionData = {
                groupId: 'group123',
                amount: 500
            };
            const userId = 'user123';

            const mockGroup = {
                currentRound: 1
            };

            const mockContribution = {
                amount: 1000
            };

            Group.findById.mockResolvedValue(mockGroup);
            Contribution.findOne.mockResolvedValue(mockContribution);

            await expect(contributionService.recordContribution(contributionData, userId))
                .rejects
                .toThrow('Amount does not match required contribution');
        });
    });

    describe('getUserContributions', () => {
        it('should return user contributions', async () => {
            const userId = 'user123';
            const mockContributions = [
                { contributor: userId, amount: 1000 },
                { contributor: userId, amount: 1000 }
            ];

            Contribution.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue(mockContributions)
            });

            const result = await contributionService.getUserContributions(userId);

            expect(result).toEqual(mockContributions);
        });
    });

    describe('markLateContributions', () => {
        it('should mark overdue contributions as late', async () => {
            const mockContributions = [
                { status: 'pending', save: jest.fn() },
                { status: 'pending', save: jest.fn() }
            ];

            Contribution.find.mockResolvedValue(mockContributions);

            const result = await contributionService.markLateContributions();

            expect(result).toBe(2);
            mockContributions.forEach(contrib => {
                expect(contrib.status).toBe('late');
                expect(contrib.save).toHaveBeenCalled();
            });
        });
    });
});
