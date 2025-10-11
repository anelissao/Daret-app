const jwt = require('jsonwebtoken');
const { AuthenticationError, AuthorizationError } = require('../utils/errors');
const User = require('../models/User');
const jwtConfig = require('../config/jwt');

class AuthMiddleware {
    // Verify JWT token and authenticate user
    async authenticate(req, res, next) {
        try {
            let token;

            // Get token from header
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }

            if (!token) {
                throw new AuthenticationError('No token provided');
            }

            // Verify token
            const decoded = jwt.verify(token, jwtConfig.jwtSecret);

            // Get user from token
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                throw new AuthenticationError('User not found');
            }

            if (!user.active) {
                throw new AuthenticationError('User account is deactivated');
            }

            // Attach user to request
            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                next(new AuthenticationError('Invalid token'));
            } else if (error.name === 'TokenExpiredError') {
                next(new AuthenticationError('Token has expired'));
            } else {
                next(error);
            }
        }
    }

    // Authorize based on roles
    authorize(...roles) {
        return (req, res, next) => {
            if (!req.user) {
                return next(new AuthenticationError('Not authenticated'));
            }

            if (!roles.includes(req.user.role)) {
                return next(new AuthorizationError('Not authorized to access this resource'));
            }

            next();
        };
    }

    // Require KYC verification
    requireKYC(req, res, next) {
        if (!req.user) {
            return next(new AuthenticationError('Not authenticated'));
        }

        if (!req.user.kycVerified) {
            return next(new AuthorizationError('KYC verification required'));
        }

        next();
    }
}

const authMiddleware = new AuthMiddleware();

module.exports = {
    authenticate: authMiddleware.authenticate.bind(authMiddleware),
    authorize: authMiddleware.authorize.bind(authMiddleware),
    requireKYC: authMiddleware.requireKYC.bind(authMiddleware)
};
