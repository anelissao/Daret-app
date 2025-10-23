import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    round: { type: Number, required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    distributedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

payoutSchema.index({ group: 1, round: 1 }, { unique: true });

export const Payout = mongoose.model('Payout', payoutSchema);
