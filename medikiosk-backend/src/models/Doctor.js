import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    department: { type: String, default: 'General Medicine' },
    hospital: { type: String, default: 'Demo Government Hospital' },
    online: { type: Boolean, default: false },
  },
  { timestamps: true },
);

doctorSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

doctorSchema.statics.hashPassword = function (plain) {
  return bcrypt.hash(plain, 10);
};

export const Doctor = mongoose.model('Doctor', doctorSchema);
