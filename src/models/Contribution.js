const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    round: {
        type: Number,
        required: true
    },
    contributor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    beneficiary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    dueDate: {
        type: Date,
        required: true
    },
    paidDate: Date,
    status: {
        type: String,
        enum: ['pending', 'paid', 'late', 'missed'],
        default: 'pending'
    },
    paymentProof: {
        type: String
    },
    notes: {
        type: String,
        trim: true
    },
    delayDays: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for efficient queries
contributionSchema.index({ group: 1, round: 1 });
contributionSchema.index({ contributor: 1 });

// Calculate delay days before saving
contributionSchema.pre('save', function (next) {
    if (this.status === 'paid' && this.paidDate && this.dueDate) {
        const diffTime = this.paidDate - this.dueDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        this.delayDays = Math.max(0, diffDays);
    }
    next();
});

const Contribution = mongoose.model('Contribution', contributionSchema);

module.exports = Contribution;
