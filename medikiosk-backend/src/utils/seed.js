import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Doctor } from '../models/Doctor.js';
import { Patient } from '../models/Patient.js';
import { Notification } from '../models/Notification.js';

async function seed() {
  await connectDB();

  const existingDoctor = await Doctor.findOne({ email: 'sharma@demohospital.in' });
  if (!existingDoctor) {
    const passwordHash = await Doctor.hashPassword('demo123');
    await Doctor.create({
      name: 'Dr. Sharma',
      email: 'sharma@demohospital.in',
      passwordHash,
      department: 'General Medicine',
      hospital: 'Demo Government Hospital',
    });
    console.log('[seed] Created doctor sharma@demohospital.in / demo123');
  } else {
    console.log('[seed] Doctor already exists, skipping');
  }

  const existingPatient = await Patient.findOne({ token: 'A-102' });
  if (!existingPatient) {
    await Patient.create({
      token: 'A-102',
      name: 'Rahul Kumar',
      age: 45,
      gender: 'Male',
      mobileNumber: '9876543210',
      language: 'hi',
      consent: { given: true, timestamp: new Date() },
      chiefComplaint: 'Chest pain since yesterday',
      historyOfPresentIllness: {
        cp_onset: 'Yesterday',
        cp_location: 'Center of chest',
        cp_character: 'Dull/Heavy',
        cp_exertion: 'yes',
        cp_rest: 'yes',
        cp_breathless: 'yes',
      },
      pastHistory: ['Diabetes', 'Hypertension'],
      medications: [{ name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }],
      allergies: [],
      familyHistory: ['Hypertension — reported'],
      personalHistory: { tobacco: 'No', alcohol: 'Occasional', physicalActivity: 'Low' },
      reviewOfSystems: {
        Respiratory: { Breathlessness: true },
        Cardiovascular: { 'Chest pain': true },
      },
      summary: {
        chiefComplaint: 'Chest pain since yesterday',
        historyOfPresentIllness: [
          'Started yesterday evening',
          'Worse while walking',
          'Improves with rest',
          'Associated breathlessness',
        ],
        pastMedicalHistory: ['Diabetes', 'Hypertension'],
        pastSurgicalHistory: [],
        medications: [{ name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' }],
        allergies: [],
        familyHistory: ['Hypertension — reported'],
        personalHistory: { tobacco: 'No', alcohol: 'Occasional', physicalActivity: 'Low' },
        reviewOfSystems: {
          Respiratory: { Breathlessness: true },
          Cardiovascular: { 'Chest pain': true },
        },
        confidence: 94,
        verified: false,
        generatedAt: new Date(),
      },
      redFlags: ['Chest pain with breathing difficulty reported'],
      priority: 'priority',
      status: 'PRIORITY',
    });
    console.log('[seed] Created demo patient Rahul Kumar (token A-102)');

    const created = await Patient.findOne({ token: 'A-102' });
    await Notification.create({
      level: 'priority',
      title: 'Priority patient detected',
      message: 'Rahul Kumar has a potential red-flag symptom.',
      patient: created._id,
    });
  } else {
    console.log('[seed] Demo patient already exists, skipping');
  }

  console.log('[seed] Done');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
