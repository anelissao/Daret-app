import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    idCard: {
      number: { type: String, required: true, trim: true },
      type: { type: String, required: true, trim: true },
    },
    kyc: {
      status: {
        type: String,
        enum: ['unsubmitted', 'submitted', 'pending_review', 'verified', 'rejected'],
        default: 'unsubmitted',
      },
      idFront: {
        file: { type: String },
        uploadedAt: { type: Date },
      },
      idBack: {
        file: { type: String },
        uploadedAt: { type: Date },
      },
      selfie: {
        file: { type: String },
        uploadedAt: { type: Date },
      },
      faceMatchScore: { type: Number },
      submittedAt: { type: Date },
      reviewRequestedAt: { type: Date },
      verifiedAt: { type: Date },
      rejectedAt: { type: Date },
      rejectionReason: { type: String },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject({ versionKey: false });
  delete obj.password;
  return obj;
};

export const User = mongoose.model('User', userSchema);
