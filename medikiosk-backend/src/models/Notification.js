import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    level: { type: String, enum: ['priority', 'info', 'warning'], default: 'info' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Notification = mongoose.model('Notification', notificationSchema);
