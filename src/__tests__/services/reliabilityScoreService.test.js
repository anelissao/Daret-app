const reliabilityScoreService = require('../../services/reliabilityScoreService');
const ReliabilityScore = require('../../models/ReliabilityScore');
const Contribution = require('../../models/Contribution');

jest.mock('../../models/ReliabilityScore');
jest.mock('../../models/Contribution');

describe('ReliabilityScoreService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getScoreByUserId', () => {
        it('should return existing score', async () => {
            const userId = 'user123';
            const mockScore = {
                user: userId,
                score: 85
            };

            ReliabilityScore.findOne.mockResolvedValue(mockScore);

            const result = await reliabilityScoreService.getScoreByUserId(userId);

            expect(ReliabilityScore.findOne).toHaveBeenCalledWith({ user: userId });
            expect(result).toEqual(mockScore);
        });

        it('should create score if not exists', async () => {
            const userId = 'user123';
            const mockScore = {
                user: userId,
                score: 100
            };

            ReliabilityScore.findOne.mockResolvedValue(null);
            ReliabilityScore.create.mockResolvedValue(mockScore);

            const result = await reliabilityScoreService.getScoreByUserId(userId);

            expect(ReliabilityScore.create).toHaveBeenCalledWith({ user: userId });
            expect(result).toEqual(mockScore);
        });
    });

    describe('updateScoreAfterContribution', () => {
        it('should update score for paid contribution', async () => {
            const mockContribution = {
                contributor: 'user123',
                status: 'paid',
                delayDays: 0
            };

            const mockScore = {
                user: 'user123',
                totalContributions: 5,
                onTimePayments: 4,
                latePayments: 1,
                missedPayments: 0,
                averageDelayDays: 0,
                calculateScore: jest.fn().mockReturnValue(95),
                save: jest.fn()
            };

            ReliabilityScore.findOne.mockResolvedValue(mockScore);
            Contribution.find.mockResolvedValue([
                { delayDays: 0 },
                { delayDays: 2 }
            ]);

            const result = await reliabilityScoreService.updateScoreAfterContribution(mockContribution);

            expect(mockScore.totalContributions).toBe(6);
            expect(mockScore.onTimePayments).toBe(5);
            expect(mockScore.calculateScore).toHaveBeenCalled();
            expect(mockScore.save).toHaveBeenCalled();
        });

        it('should update score for late contribution', async () => {
            const mockContribution = {
                contributor: 'user123',
                status: 'paid',
                delayDays: 3
            };

            const mockScore = {
                user: 'user123',
                totalContributions: 5,
                onTimePayments: 4,
                latePayments: 1,
                missedPayments: 0,
                averageDelayDays: 0,
                calculateScore: jest.fn(),
                save: jest.fn()
            };

            ReliabilityScore.findOne.mockResolvedValue(mockScore);
            Contribution.find.mockResolvedValue([]);

            await reliabilityScoreService.updateScoreAfterContribution(mockContribution);

            expect(mockScore.latePayments).toBe(2);
        });
    });

    describe('recalculateUserScore', () => {
        it('should recalculate score based on all contributions', async () => {
            const userId = 'user123';

            const mockContributions = [
                { status: 'paid', delayDays: 0 },
                { status: 'paid', delayDays: 2 },
                { status: 'missed' }
            ];

            const mockScore = {
                totalContributions: 0,
                onTimePayments: 0,
                latePayments: 0,
                missedPayments: 0,
                averageDelayDays: 0,
                calculateScore: jest.fn(),
                save: jest.fn()
            };

            ReliabilityScore.findOne.mockResolvedValue(mockScore);
            Contribution.find.mockResolvedValue(mockContributions);

            await reliabilityScoreService.recalculateUserScore(userId);

            expect(mockScore.totalContributions).toBe(3);
            expect(mockScore.onTimePayments).toBe(1);
            expect(mockScore.latePayments).toBe(1);
            expect(mockScore.missedPayments).toBe(1);
            expect(mockScore.calculateScore).toHaveBeenCalled();
        });
    });
});
