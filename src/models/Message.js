const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messageType: {
        type: String,
        enum: ['text', 'audio'],
        default: 'text'
    },
    content: {
        type: String,
        required: function () {
            return this.messageType === 'text';
        }
    },
    audioUrl: {
        type: String,
        required: function () {
            return this.messageType === 'audio';
        }
    },
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Index for efficient queries
messageSchema.index({ group: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
