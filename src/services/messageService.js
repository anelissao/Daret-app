const Message = require('../models/Message');
const Group = require('../models/Group');
const { NotFoundError, AuthorizationError } = require('../utils/errors');

class MessageService {
    async sendMessage(messageData, senderId) {
        const { groupId, messageType, content, audioUrl } = messageData;

        // Verify sender is member of group
        const group = await Group.findById(groupId);
        if (!group) {
            throw new NotFoundError('Group not found');
        }

        const isMember = group.members.some(
            m => m.user.toString() === senderId.toString()
        );

        if (!isMember) {
            throw new AuthorizationError('Not a member of this group');
        }

        // Create message
        const message = await Message.create({
            group: groupId,
            sender: senderId,
            messageType,
            content,
            audioUrl
        });

        await message.populate('sender', 'firstName lastName');

        return message;
    }

    async getGroupMessages(groupId, userId, limit = 50, skip = 0) {
        // Verify user is member
        const group = await Group.findById(groupId);
        if (!group) {
            throw new NotFoundError('Group not found');
        }

        const isMember = group.members.some(
            m => m.user.toString() === userId.toString()
        );

        if (!isMember) {
            throw new AuthorizationError('Not a member of this group');
        }

        const messages = await Message.find({ group: groupId })
            .populate('sender', 'firstName lastName')
            .sort('-createdAt')
            .limit(limit)
            .skip(skip);

        return messages;
    }

    async markAsRead(messageId, userId) {
        const message = await Message.findById(messageId);

        if (!message) {
            throw new NotFoundError('Message not found');
        }

        // Check if already read
        const alreadyRead = message.readBy.some(
            r => r.user.toString() === userId.toString()
        );

        if (!alreadyRead) {
            message.readBy.push({
                user: userId,
                readAt: new Date()
            });
            await message.save();
        }

        return message;
    }
}

module.exports = new MessageService();
