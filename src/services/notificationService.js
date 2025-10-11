const Notification = require('../models/Notification');
const Contribution = require('../models/Contribution');
const cron = require('node-cron');

class NotificationService {
    async createNotification(notificationData) {
        const notification = await Notification.create(notificationData);
        return notification;
    }

    async getUserNotifications(userId, unreadOnly = false) {
        const query = { user: userId };

        if (unreadOnly) {
            query.read = false;
        }

        const notifications = await Notification.find(query)
            .populate('relatedGroup', 'name')
            .sort('-createdAt')
            .limit(50);

        return notifications;
    }

    async markAsRead(notificationId, userId) {
        const notification = await Notification.findOne({
            _id: notificationId,
            user: userId
        });

        if (notification && !notification.read) {
            notification.read = true;
            notification.readAt = new Date();
            await notification.save();
        }

        return notification;
    }

    async sendPaymentReminder(contribution) {
        await this.createNotification({
            user: contribution.contributor,
            type: 'payment_reminder',
            title: 'Payment Reminder',
            message: `You have a pending contribution of ${contribution.amount} due soon`,
            relatedGroup: contribution.group,
            relatedContribution: contribution._id
        });
    }

    async sendTurnNotification(user, group) {
        await this.createNotification({
            user: user._id,
            type: 'turn_notification',
            title: 'Your Turn!',
            message: `It's your turn to receive the pot in group "${group.name}"`,
            relatedGroup: group._id
        });
    }

    // Schedule automatic payment reminders
    scheduleReminders() {
        // Run daily at 9 AM
        cron.schedule('0 9 * * *', async () => {
            try {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(23, 59, 59);

                const twoDaysFromNow = new Date();
                twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
                twoDaysFromNow.setHours(0, 0, 0);

                // Find contributions due in next 2 days
                const upcomingContributions = await Contribution.find({
                    status: 'pending',
                    dueDate: {
                        $gte: new Date(),
                        $lte: twoDaysFromNow
                    }
                }).populate('contributor group');

                for (const contribution of upcomingContributions) {
                    await this.sendPaymentReminder(contribution);
                }

                console.log(`Sent ${upcomingContributions.length} payment reminders`);
            } catch (error) {
                console.error('Error sending payment reminders:', error);
            }
        });
    }
}

module.exports = new NotificationService();
