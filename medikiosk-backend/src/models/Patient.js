import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema(
  {
    name: String,
    dosage: String,
    frequency: String,
    needsVerification: { type: Boolean, default: false },
  },
  { _id: false },
);

const consultationSchema = new mongoose.Schema(
  {
    startedAt: Date,
    completedAt: Date,
    doctorName: String,
    verifiedBy: String,
    verifiedAt: Date,
  },
  { _id: false },
);

const summarySchema = new mongoose.Schema(
  {
    chiefComplaint: String,
    historyOfPresentIllness: [String],
    pastMedicalHistory: [String],
    pastSurgicalHistory: [String],
    medications: [medicationSchema],
    allergies: [String],
    familyHistory: [String],
    personalHistory: {
      tobacco: String,
      alcohol: String,
      physicalActivity: String,
      diet: String,
      sleep: String,
    },
    reviewOfSystems: { type: mongoose.Schema.Types.Mixed, default: {} },
    confidence: { type: Number, default: 0 }, // "history extraction confidence" — never diagnostic
    verified: { type: Boolean, default: false },
    verifiedBy: String,
    verifiedAt: Date,
    lastEditedBy: String,
    lastEditedAt: Date,
    generatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const patientSchema = new mongoose.Schema(
  {
    // Human-friendly identifiers (token is queue-facing, id below is Mongo's _id)
    token: { type: String, required: true, index: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    mobileNumber: { type: String },
    abhaId: { type: String },
    language: { type: String, default: 'en' },
    isGuest: { type: Boolean, default: false },

    // From the Flutter consent screen
    consent: {
      given: { type: Boolean, default: false },
      timestamp: Date,
    },

    // From the Flutter chief-complaint + adaptive history screens
    chiefComplaint: { type: String, default: '' },
    historyOfPresentIllness: { type: mongoose.Schema.Types.Mixed, default: {} },
    pastHistory: [String],
    medications: [medicationSchema],
    allergies: [String],
    familyHistory: [String],
    personalHistory: { type: mongoose.Schema.Types.Mixed, default: {} },
    reviewOfSystems: { type: mongoose.Schema.Types.Mixed, default: {} },

    // AI-generated, doctor-editable/verifiable summary
    summary: { type: summarySchema, default: () => ({}) },

    // Non-diagnostic safety layer
    redFlags: [String],

    // Triage classification
    priority: {
      type: String,
      enum: ['normal', 'review', 'priority'],
      default: 'normal',
    },

    // Lifecycle status — driven by both patient intake and doctor actions
    status: {
      type: String,
      enum: [
        'NEW',
        'WAITING',
        'PRIORITY',
        'IN_REVIEW',
        'IN_CONSULTATION',
        'VERIFIED',
        'COMPLETED',
        'NEEDS_REVIEW',
        'FAILED',
      ],
      default: 'NEW',
      index: true,
    },

    consultation: { type: consultationSchema, default: () => ({}) },

    notes: [
      {
        content: String,
        status: { type: String, enum: ['draft', 'final'], default: 'draft' },
        doctorName: String,
        savedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

patientSchema.index({ name: 'text', token: 'text' });

export const Patient = mongoose.model('Patient', patientSchema);
