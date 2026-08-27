import { Patient } from '../models/Patient.js';
import { MedicalDocument } from '../models/MedicalDocument.js';
import { TimelineEvent } from '../models/TimelineEvent.js';
import { emitToDoctors } from '../sockets/index.js';

function toPatientDTO(p) {
  const waitingSinceMinutes = p.createdAt
    ? Math.max(0, Math.round((Date.now() - new Date(p.createdAt).getTime()) / 60000))
    : undefined;
  return {
    id: p._id.toString(),
    name: p.name,
    age: p.age,
    gender: p.gender,
    token: p.token,
    language: p.language,
    chiefComplaint: p.chiefComplaint,
    priority: p.priority,
    status: p.status,
    createdAt: p.createdAt,
    abhaId: p.abhaId,
    waitingSinceMinutes,
    consultation: p.consultation,
  };
}

/** GET /api/patients — all patients, newest first. */
export async function getAllPatients(req, res, next) {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients.map(toPatientDTO));
  } catch (err) {
    next(err);
  }
}

/** GET /api/patients/queue — everyone not yet completed. */
export async function getQueue(req, res, next) {
  try {
    const patients = await Patient.find({ status: { $ne: 'COMPLETED' } }).sort({ createdAt: 1 });
    res.json(patients.map(toPatientDTO));
  } catch (err) {
    next(err);
  }
}

/** GET /api/patients/priority — patients flagged for priority review. */
export async function getPriorityPatients(req, res, next) {
  try {
    const patients = await Patient.find({ priority: 'priority', status: { $ne: 'COMPLETED' } }).sort({ createdAt: 1 });
    res.json(patients.map(toPatientDTO));
  } catch (err) {
    next(err);
  }
}

/** GET /api/patients/:id */
export async function getPatientById(req, res, next) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(toPatientDTO(patient));
  } catch (err) {
    next(err);
  }
}

/** GET /api/patients/:id/history — raw structured clinical history. */
export async function getPatientHistory(req, res, next) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json({
      chiefComplaint: patient.chiefComplaint,
      historyOfPresentIllness: patient.historyOfPresentIllness,
      pastMedicalHistory: patient.pastHistory,
      medications: patient.medications,
      allergies: patient.allergies,
      familyHistory: patient.familyHistory,
      personalHistory: patient.personalHistory,
      reviewOfSystems: patient.reviewOfSystems,
      redFlags: patient.redFlags,
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/patients/:id/summary — the AI-generated, doctor-editable draft. */
export async function getPatientSummary(req, res, next) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json({
      content: {
        chiefComplaint: patient.summary.chiefComplaint,
        historyOfPresentIllness: patient.summary.historyOfPresentIllness,
        pastMedicalHistory: patient.summary.pastMedicalHistory,
        pastSurgicalHistory: patient.summary.pastSurgicalHistory,
        medications: patient.summary.medications,
        allergies: patient.summary.allergies,
        familyHistory: patient.summary.familyHistory,
        personalHistory: patient.summary.personalHistory,
        reviewOfSystems: patient.summary.reviewOfSystems,
      },
      confidence: patient.summary.confidence,
      generatedAt: patient.summary.generatedAt,
      verified: patient.summary.verified,
      verifiedBy: patient.summary.verifiedBy,
      verifiedAt: patient.summary.verifiedAt,
      lastEditedBy: patient.summary.lastEditedBy,
      lastEditedAt: patient.summary.lastEditedAt,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/patients/:id/summary
 * Doctor edits the AI-generated draft (chief complaint, HPI lines,
 * medications, allergies, etc). Records who changed it and when.
 */
export async function updatePatientSummary(req, res, next) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const { content, doctorName } = req.body;
    if (content) {
      patient.summary = {
        ...patient.summary.toObject(),
        ...content,
        lastEditedBy: doctorName || req.doctor?.name || 'Unknown',
        lastEditedAt: new Date(),
      };
    }
    await patient.save();

    emitToDoctors('patient:updated', { patientId: patient._id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/patients/:id/verify
 * The core "doctor approves" action. Marks the AI summary as reviewed
 * and confirmed, sets status to VERIFIED, and records who/when.
 */
export async function verifyPatient(req, res, next) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const doctorName = req.body.doctorName || req.doctor?.name || 'Unknown';
    patient.summary.verified = true;
    patient.summary.verifiedBy = doctorName;
    patient.summary.verifiedAt = new Date();
    patient.status = 'VERIFIED';
    patient.consultation.verifiedBy = doctorName;
    patient.consultation.verifiedAt = new Date();

    await patient.save();

    emitToDoctors('patient:updated', { patientId: patient._id });
    res.json({ ok: true, verifiedBy: doctorName, verifiedAt: patient.summary.verifiedAt });
  } catch (err) {
    next(err);
  }
}

/** POST /api/patients/:id/mark-priority — manual doctor override. */
export async function markPriority(req, res, next) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    patient.priority = 'priority';
    if (patient.status !== 'IN_CONSULTATION' && patient.status !== 'COMPLETED') {
      patient.status = 'PRIORITY';
    }
    await patient.save();

    emitToDoctors('patient:updated', { patientId: patient._id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

/** POST /api/patients/:id/start-consultation */
export async function startConsultation(req, res, next) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const doctorName = req.body.doctorName || req.doctor?.name || 'Unknown';
    patient.status = 'IN_CONSULTATION';
    patient.consultation.startedAt = new Date();
    patient.consultation.doctorName = doctorName;
    await patient.save();

    emitToDoctors('patient:updated', { patientId: patient._id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

/** POST /api/patients/:id/complete-consultation */
export async function completeConsultation(req, res, next) {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    patient.status = 'COMPLETED';
    patient.consultation.completedAt = new Date();
    await patient.save();

    emitToDoctors('patient:updated', { patientId: patient._id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

/** GET /api/patients/:id/documents */
export async function getPatientDocuments(req, res, next) {
  try {
    const docs = await MedicalDocument.find({ patient: req.params.id }).sort({ date: 1 });
    res.json(
      docs.map((d) => ({
        id: d._id.toString(),
        type: d.type,
        title: d.title,
        date: d.date,
        fileUrl: d.fileUrl,
        extractedData: d.extractedData,
      })),
    );
  } catch (err) {
    next(err);
  }
}

/** GET /api/patients/:id/timeline */
export async function getPatientTimeline(req, res, next) {
  try {
    const events = await TimelineEvent.find({ patient: req.params.id }).sort({ date: 1 });
    res.json(
      events.map((e) => ({
        id: e._id.toString(),
        date: e.date,
        label: e.label,
        type: e.type,
        detail: e.detail,
        documentId: e.document?.toString(),
      })),
    );
  } catch (err) {
    next(err);
  }
}
