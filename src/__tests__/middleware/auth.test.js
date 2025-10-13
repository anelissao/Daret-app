const { authenticate, authorize, requireKYC } = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

jest.mock('../../models/User');
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {},
            user: null
        };
        res = {};
        next = jest.fn();
        jest.clearAllMocks();
    });

    describe('authenticate', () => {
        it('should authenticate user with valid token', async () => {
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                active: true
            };

            req.headers.authorization = 'Bearer valid-token';
            jwt.verify.mockReturnValue({ id: 'user123' });
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            await authenticate(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
            expect(req.user).toEqual(mockUser);
            expect(next).toHaveBeenCalledWith();
        });

        it('should reject request without token', async () => {
            await authenticate(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: 'No token provided'
            }));
        });

        it('should reject invalid token', async () => {
            req.headers.authorization = 'Bearer invalid-token';
            jwt.verify.mockImplementation(() => {
                throw new Error('JsonWebTokenError');
            });

            await authenticate(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('authorize', () => {
        it('should allow access for authorized role', () => {
            req.user = { role: 'Admin' };

            const middleware = authorize('Admin', 'Particulier');
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });

        it('should deny access for unauthorized role', () => {
            req.user = { role: 'Particulier' };

            const middleware = authorize('Admin');
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Not authorized to access this resource'
            }));
        });

        it('should deny access if not authenticated', () => {
            const middleware = authorize('Admin');
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Not authenticated'
            }));
        });
    });

    describe('requireKYC', () => {
        it('should allow access for verified users', () => {
            req.user = { kycVerified: true };

            requireKYC(req, res, next);

            expect(next).toHaveBeenCalledWith();
        });

        it('should deny access for unverified users', () => {
            req.user = { kycVerified: false };

            requireKYC(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.objectContaining({
                message: 'KYC verification required'
            }));
        });
    });
});
