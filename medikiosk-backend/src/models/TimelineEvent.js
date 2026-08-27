import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    date: { type: Date, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ['Prescription', 'Hospital Discharge', 'Blood Test', 'Imaging', 'Current OPD Visit'],
      required: true,
    },
    detail: String,
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalDocument' },
  },
  { timestamps: true },
);

export const TimelineEvent = mongoose.model('TimelineEvent', timelineEventSchema);
