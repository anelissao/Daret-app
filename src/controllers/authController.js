const authService = require('../services/authService');
const ApiResponse = require('../utils/response');

class AuthController {
    async register(req, res, next) {
        try {
            const result = await authService.register(req.validatedData);

            ApiResponse.created(res, result, 'User registered successfully');
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.validatedData;
            const result = await authService.login(email, password);

            ApiResponse.success(res, result, 'Login successful');
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const user = await authService.getUserById(req.user._id);

            ApiResponse.success(res, { user }, 'Profile retrieved');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
