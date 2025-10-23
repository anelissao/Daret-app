import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    round: { type: Number, required: true },
    amount: { type: Number, required: true, min: 0 },
    paidAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['paid', 'pending', 'failed'], default: 'paid' },
  },
  { timestamps: true }
);

contributionSchema.index({ group: 1, user: 1, round: 1 }, { unique: true });

export const Contribution = mongoose.model('Contribution', contributionSchema);
