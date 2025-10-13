const groupService = require('../../services/groupService');
const Group = require('../../models/Group');
const ReliabilityScore = require('../../models/ReliabilityScore');
const Contribution = require('../../models/Contribution');

jest.mock('../../models/Group');
jest.mock('../../models/ReliabilityScore');
jest.mock('../../models/Contribution');

describe('GroupService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createGroup', () => {
        it('should create a new group successfully', async () => {
            const groupData = {
                name: 'Test Group',
                contributionAmount: 1000,
                frequency: 'monthly'
            };
            const creatorId = 'user123';

            const mockGroup = {
                ...groupData,
                creator: creatorId,
                members: [{ user: creatorId, turnOrder: 1 }],
                populate: jest.fn().mockReturnThis()
            };

            Group.create.mockResolvedValue(mockGroup);

            const result = await groupService.createGroup(groupData, creatorId);

            expect(Group.create).toHaveBeenCalled();
            expect(result).toBeDefined();
            expect(mockGroup.populate).toHaveBeenCalled();
        });
    });

    describe('joinGroup', () => {
        it('should allow user to join a pending group', async () => {
            const groupId = 'group123';
            const userId = 'user456';

            const mockGroup = {
                _id: groupId,
                status: 'pending',
                members: [{ user: { _id: 'user123' } }],
                rules: { maxMembers: 10, minReliabilityScore: 50 },
                save: jest.fn(),
                populate: jest.fn().mockReturnThis()
            };

            const mockScore = {
                user: userId,
                score: 80
            };

            Group.findById.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn().mockResolvedValue(mockGroup)
                    })
                })
            });

            ReliabilityScore.findOne.mockResolvedValue(mockScore);

            mockGroup.members.some = jest.fn().mockReturnValue(false);
            mockGroup.members.push = jest.fn();

            const result = await groupService.joinGroup(groupId, userId);

            expect(mockGroup.members.push).toHaveBeenCalled();
            expect(mockGroup.save).toHaveBeenCalled();
        });

        it('should throw error if user already a member', async () => {
            const groupId = 'group123';
            const userId = 'user123';

            const mockGroup = {
                status: 'pending',
                members: [{ user: { _id: userId } }],
                rules: { maxMembers: 10 }
            };

            Group.findById.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn().mockResolvedValue(mockGroup)
                    })
                })
            });

            mockGroup.members.some = jest.fn().mockReturnValue(true);

            await expect(groupService.joinGroup(groupId, userId))
                .rejects
                .toThrow('Already a member of this group');
        });
    });

    describe('startGroup', () => {
        it('should start a group successfully', async () => {
            const groupId = 'group123';
            const userId = 'user123';

            const mockGroup = {
                _id: groupId,
                creator: { _id: userId },
                status: 'pending',
                members: [
                    { user: 'user123', _id: 'member1' },
                    { user: 'user456', _id: 'member2' }
                ],
                save: jest.fn(),
                id: jest.fn()
            };

            Group.findById.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn().mockResolvedValue(mockGroup)
                    })
                })
            });

            ReliabilityScore.findOne = jest.fn()
                .mockResolvedValueOnce({ score: 90 })
                .mockResolvedValueOnce({ score: 85 });

            Contribution.insertMany.mockResolvedValue([]);

            await groupService.startGroup(groupId, userId);

            expect(mockGroup.save).toHaveBeenCalled();
            expect(mockGroup.status).toBe('active');
        });

        it('should throw error if not creator', async () => {
            const groupId = 'group123';
            const userId = 'user456';

            const mockGroup = {
                creator: { _id: 'user123' },
                status: 'pending'
            };

            Group.findById.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn().mockResolvedValue(mockGroup)
                    })
                })
            });

            await expect(groupService.startGroup(groupId, userId))
                .rejects
                .toThrow('Only group creator can start group');
        });
    });
});
