const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Group name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        turnOrder: Number,
        hasTakenTurn: {
            type: Boolean,
            default: false
        },
        turnTakenAt: Date
    }],
    contributionAmount: {
        type: Number,
        required: [true, 'Contribution amount is required'],
        min: [1, 'Contribution amount must be positive']
    },
    frequency: {
        type: String,
        enum: ['weekly', 'monthly'],
        default: 'monthly'
    },
    startDate: Date,
    currentRound: {
        type: Number,
        default: 0
    },
    currentBeneficiary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    rules: {
        maxMembers: {
            type: Number,
            default: 12
        },
        minReliabilityScore: {
            type: Number,
            default: 50
        },
        autoStart: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

// Validate members count
groupSchema.pre('save', function (next) {
    if (this.members.length > this.rules.maxMembers) {
        next(new Error('Group has reached maximum members'));
    }
    next();
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
