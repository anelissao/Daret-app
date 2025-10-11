const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ReliabilityScore = require('../models/ReliabilityScore');
const { ConflictError, AuthenticationError } = require('../utils/errors');
const jwtConfig = require('../config/jwt');

class AuthService {
    async register(userData) {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new ConflictError('Email already registered');
        }

        // Create user
        const user = await User.create(userData);

        // Create initial reliability score
        await ReliabilityScore.create({
            user: user._id,
            score: 100
        });

        // Link reliability score to user
        const score = await ReliabilityScore.findOne({ user: user._id });
        user.reliabilityScore = score._id;
        await user.save();

        // Generate token
        const token = this.generateToken(user._id);

        return {
            user,
            token
        };
    }

    async login(email, password) {
        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            throw new AuthenticationError('Invalid email or password');
        }

        if (!user.active) {
            throw new AuthenticationError('Account is deactivated');
        }

        // Generate token
        const token = this.generateToken(user._id);

        // Remove password from output
        user.password = undefined;

        return {
            user,
            token
        };
    }

    generateToken(userId) {
        return jwt.sign(
            { id: userId },
            jwtConfig.jwtSecret,
            {
                expiresIn: jwtConfig.jwtExpire,
                algorithm: jwtConfig.jwtAlgorithm
            }
        );
    }

    async getUserById(userId) {
        const user = await User.findById(userId)
            .populate('reliabilityScore');

        return user;
    }
}

module.exports = new AuthService();
