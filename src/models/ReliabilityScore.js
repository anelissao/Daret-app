const mongoose = require('mongoose');

const reliabilityScoreSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    score: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
    },
    totalContributions: {
        type: Number,
        default: 0
    },
    onTimePayments: {
        type: Number,
        default: 0
    },
    latePayments: {
        type: Number,
        default: 0
    },
    missedPayments: {
        type: Number,
        default: 0
    },
    averageDelayDays: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate score based on payment history
reliabilityScoreSchema.methods.calculateScore = function () {
    if (this.totalContributions === 0) {
        return 100;
    }

    const onTimeRate = this.onTimePayments / this.totalContributions;
    const lateRate = this.latePayments / this.totalContributions;
    const missedRate = this.missedPayments / this.totalContributions;

    // Base score calculation
    let score = 100;

    // Penalties
    score -= (lateRate * 20);        // Up to -20 for late payments
    score -= (missedRate * 40);       // Up to -40 for missed payments
    score -= (this.averageDelayDays * 2); // -2 points per average delay day

    // Ensure score stays within bounds
    this.score = Math.max(0, Math.min(100, score));
    this.lastUpdated = new Date();

    return this.score;
};

const ReliabilityScore = mongoose.model('ReliabilityScore', reliabilityScoreSchema);

module.exports = ReliabilityScore;
