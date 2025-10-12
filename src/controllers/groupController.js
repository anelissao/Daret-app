const groupService = require('../services/groupService');
const ApiResponse = require('../utils/response');

class GroupController {
    async createGroup(req, res, next) {
        try {
            const group = await groupService.createGroup(req.validatedData, req.user._id);

            ApiResponse.created(res, { group }, 'Group created successfully');
        } catch (error) {
            next(error);
        }
    }

    async getGroups(req, res, next) {
        try {
            const groups = await groupService.getUserGroups(req.user._id);

            ApiResponse.success(res, { groups }, 'Groups retrieved');
        } catch (error) {
            next(error);
        }
    }

    async getGroupById(req, res, next) {
        try {
            const group = await groupService.getGroupById(req.params.id);

            ApiResponse.success(res, { group }, 'Group retrieved');
        } catch (error) {
            next(error);
        }
    }

    async joinGroup(req, res, next) {
        try {
            const group = await groupService.joinGroup(req.params.id, req.user._id);

            ApiResponse.success(res, { group }, 'Joined group successfully');
        } catch (error) {
            next(error);
        }
    }

    async updateGroup(req, res, next) {
        try {
            const group = await groupService.updateGroup(
                req.params.id,
                req.validatedData,
                req.user._id
            );

            ApiResponse.success(res, { group }, 'Group updated successfully');
        } catch (error) {
            next(error);
        }
    }

    async startGroup(req, res, next) {
        try {
            const group = await groupService.startGroup(req.params.id, req.user._id);

            ApiResponse.success(res, { group }, 'Group started successfully');
        } catch (error) {
            next(error);
        }
    }

    async getGroupHistory(req, res, next) {
        try {
            const history = await groupService.getGroupHistory(req.params.id);

            ApiResponse.success(res, { history }, 'Group history retrieved');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new GroupController();
