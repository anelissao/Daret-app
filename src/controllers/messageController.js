const messageService = require('../services/messageService');
const ApiResponse = require('../utils/response');

class MessageController {
    async sendMessage(req, res, next) {
        try {
            const message = await messageService.sendMessage(
                {
                    groupId: req.params.groupId,
                    ...req.body
                },
                req.user._id
            );

            ApiResponse.created(res, { message }, 'Message sent');
        } catch (error) {
            next(error);
        }
    }

    async getMessages(req, res, next) {
        try {
            const { limit = 50, skip = 0 } = req.query;

            const messages = await messageService.getGroupMessages(
                req.params.groupId,
                req.user._id,
                parseInt(limit),
                parseInt(skip)
            );

            ApiResponse.success(res, { messages }, 'Messages retrieved');
        } catch (error) {
            next(error);
        }
    }

    async markAsRead(req, res, next) {
        try {
            const message = await messageService.markAsRead(
                req.params.messageId,
                req.user._id
            );

            ApiResponse.success(res, { message }, 'Message marked as read');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MessageController();
