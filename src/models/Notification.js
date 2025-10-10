const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['payment_reminder', 'turn_notification', 'group_update', 'contribution_received', 'system'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    relatedContribution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contribution'
    },
    read: {
        type: Boolean,
        default: false
    },
    readAt: Date
}, {
    timestamps: true
});

// Index for efficient queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
