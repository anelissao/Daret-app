import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contributionAmount: { type: Number, required: true, min: 1 },
    frequency: { type: String, enum: ['weekly', 'monthly', 'custom'], required: true },
    frequencyDays: { type: Number, min: 1, max: 90 },
    maxMembers: { type: Number, min: 2, max: 100, default: 12 },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    rotationOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    currentRound: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Group = mongoose.model('Group', groupSchema);
