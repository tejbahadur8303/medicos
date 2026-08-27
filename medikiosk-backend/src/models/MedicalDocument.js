import mongoose from 'mongoose';

const ocrFieldSchema = new mongoose.Schema(
  {
    label: String,
    value: String,
    unit: String,
    confidence: { type: String, enum: ['high', 'low'], default: 'high' },
    flagged: { type: Boolean, default: false }, // abnormal value — physician attention only, never a diagnosis
  },
  { _id: false },
);

const documentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    type: {
      type: String,
      enum: ['Prescription', 'Lab Report', 'Discharge Summary', 'Imaging Report'],
      required: true,
    },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    fileUrl: { type: String, required: true },
    extractedData: {
      fields: [ocrFieldSchema],
      diagnosesNoted: [String],
      medicationsNoted: [String],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'processed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

export const MedicalDocument = mongoose.model('MedicalDocument', documentSchema);
