const authService = require('../../services/authService');
const User = require('../../models/User');
const ReliabilityScore = require('../../models/ReliabilityScore');
const jwt = require('jsonwebtoken');

jest.mock('../../models/User');
jest.mock('../../models/ReliabilityScore');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '0612345678'
            };

            const mockUser = {
                _id: 'user123',
                ...userData,
                save: jest.fn()
            };

            const mockScore = {
                _id: 'score123',
                user: 'user123',
                score: 100
            };

            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue(mockUser);
            ReliabilityScore.create.mockResolvedValue(mockScore);
            ReliabilityScore.findOne.mockResolvedValue(mockScore);
            jwt.sign.mockReturnValue('fake-token');

            const result = await authService.register(userData);

            expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
            expect(User.create).toHaveBeenCalledWith(userData);
            expect(ReliabilityScore.create).toHaveBeenCalledWith({ user: mockUser._id });
            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
        });

        it('should throw error if email already exists', async () => {
            const userData = {
                email: 'existing@example.com'
            };

            User.findOne.mockResolvedValue({ email: userData.email });

            await expect(authService.register(userData))
                .rejects
                .toThrow('Email already registered');
        });
    });

    describe('login', () => {
        it('should login user with correct credentials', async () => {
            const email = 'john@example.com';
            const password = 'password123';

            const mockUser = {
                _id: 'user123',
                email,
                active: true,
                comparePassword: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });
            jwt.sign.mockReturnValue('fake-token');

            const result = await authService.login(email, password);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
            expect(mockUser.comparePassword).toHaveBeenCalledWith(password);
        });

        it('should throw error with invalid credentials', async () => {
            const email = 'john@example.com';
            const password = 'wrongpassword';

            const mockUser = {
                comparePassword: jest.fn().mockResolvedValue(false)
            };

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            await expect(authService.login(email, password))
                .rejects
                .toThrow('Invalid email or password');
        });

        it('should throw error if account is deactivated', async () => {
            const email = 'john@example.com';
            const password = 'password123';

            const mockUser = {
                active: false,
                comparePassword: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            await expect(authService.login(email, password))
                .rejects
                .toThrow('Account is deactivated');
        });
    });

    describe('generateToken', () => {
        it('should generate a valid JWT token', () => {
            const userId = 'user123';
            jwt.sign.mockReturnValue('generated-token');

            const token = authService.generateToken(userId);

            expect(jwt.sign).toHaveBeenCalled();
            expect(token).toBe('generated-token');
        });
    });
});
