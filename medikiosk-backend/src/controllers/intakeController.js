import { MedicalDocument } from '../models/MedicalDocument.js';
import { Patient } from '../models/Patient.js';
import { TimelineEvent } from '../models/TimelineEvent.js';
import { Notification } from '../models/Notification.js';
import {
  evaluateRedFlags,
  priorityFromFlags,
} from '../services/redFlagService.js';
import { emitToDoctors } from '../sockets/index.js';

let tokenCounter = 100;

function nextToken() {
  tokenCounter += 1;
  return `A-${tokenCounter}`;
}

/**
 * POST /api/patient/session
 */
export async function createSession(req, res, next) {
  try {
    const {
      name,
      age,
      gender,
      mobileNumber,
      abhaId,
      language,
      isGuest,
      consent,
    } = req.body;

    if (!name || age === undefined || !gender) {
      return res.status(400).json({
        error: 'name, age and gender are required',
      });
    }

    const patient = await Patient.create({
      token: nextToken(),
      name,
      age,
      gender,
      mobileNumber,
      abhaId,
      language: language || 'en',
      isGuest: Boolean(isGuest),
      consent: consent || { given: false },
      status: 'NEW',
    });

    emitToDoctors('patient:new', {
      patientId: patient._id,
      token: patient.token,
      name: patient.name,
    });

    res.status(201).json({
      sessionId: patient._id,
      token: patient.token,
      ok: true,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/history/answer
 */
export async function submitAnswer(req, res, next) {
  try {
    const {
      sessionId,
      questionId,
      category,
      value,
    } = req.body;

    if (!sessionId || !questionId) {
      return res.status(400).json({
        error: 'sessionId and questionId are required',
      });
    }

    const patient = await Patient.findById(sessionId);

    if (!patient) {
      return res.status(404).json({
        error: 'Patient session not found',
      });
    }

    patient.historyOfPresentIllness =
      patient.historyOfPresentIllness || {};

    patient.historyOfPresentIllness[questionId] = value;

    patient.markModified('historyOfPresentIllness');

    const flags = evaluateRedFlags(
      patient.historyOfPresentIllness,
    );

    const previousFlagCount =
      patient.redFlags?.length || 0;

    patient.redFlags = flags;
    patient.priority = priorityFromFlags(flags);

    if (
      patient.priority === 'priority' &&
      patient.status !== 'IN_CONSULTATION' &&
      patient.status !== 'COMPLETED'
    ) {
      patient.status = 'PRIORITY';
    }

    await patient.save();

    if (flags.length > previousFlagCount) {
      await Notification.create({
        level: 'priority',
        title: 'Priority patient detected',
        message: `${patient.name} has a potential red-flag symptom.`,
        patient: patient._id,
      });

      emitToDoctors('patient:priority', {
        patientId: patient._id,
        name: patient.name,
        token: patient.token,
        redFlags: flags,
      });
    }

    emitToDoctors('patient:updated', {
      patientId: patient._id,
    });

    res.json({
      ok: true,
      redFlags: flags,
      priority: patient.priority,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/summary/generate
 */
export async function generateSummary(req, res, next) {
  try {
    const {
      sessionId,
      chiefComplaint,
      pastHistory,
      medications,
      allergies,
      familyHistory,
      personalHistory,
      reviewOfSystems,
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        error: 'sessionId is required',
      });
    }

    const patient = await Patient.findById(sessionId);

    if (!patient) {
      return res.status(404).json({
        error: 'Patient session not found',
      });
    }

    patient.chiefComplaint =
      chiefComplaint ?? patient.chiefComplaint ?? '';

    patient.pastHistory =
      pastHistory ?? patient.pastHistory ?? [];

    patient.medications =
      medications ?? patient.medications ?? [];

    patient.allergies =
      allergies ?? patient.allergies ?? [];

    patient.familyHistory =
      familyHistory ?? patient.familyHistory ?? [];

    patient.personalHistory =
      personalHistory ?? patient.personalHistory ?? {};

    patient.reviewOfSystems =
      reviewOfSystems ?? patient.reviewOfSystems ?? {};

    const flags = evaluateRedFlags(
      patient.historyOfPresentIllness || {},
    );

    patient.redFlags = flags;
    patient.priority = priorityFromFlags(flags);

    patient.summary = {
      chiefComplaint: patient.chiefComplaint,

      historyOfPresentIllness: Object.values(
        patient.historyOfPresentIllness || {},
      ).filter(
        (v) =>
          typeof v === 'string' &&
          v.trim() !== '',
      ),

      pastMedicalHistory:
        patient.pastHistory || [],

      pastSurgicalHistory: [],

      medications:
        patient.medications || [],

      allergies:
        patient.allergies || [],

      familyHistory:
        patient.familyHistory || [],

      personalHistory:
        patient.personalHistory || {},

      reviewOfSystems:
        patient.reviewOfSystems || {},

      confidence: 90,
      verified: false,
      generatedAt: new Date(),
    };

    patient.status =
      patient.priority === 'priority'
        ? 'PRIORITY'
        : 'WAITING';

    await patient.save();

    emitToDoctors('patient:summary-ready', {
      patientId: patient._id,
      name: patient.name,
      token: patient.token,
    });

    await Notification.create({
      level: 'info',
      title: 'New patient history ready',
      message: `${patient.name}'s history is ready for review.`,
      patient: patient._id,
    });

    res.json({
      ok: true,
      summary: patient.summary,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/session/submit
 *
 * Final Flutter step.
 * Saves documents and creates timeline events.
 */
export async function submitSession(req, res, next) {
  try {
    const {
      sessionId,
      documents,
      redFlags,
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        error: 'sessionId is required',
      });
    }

    const patient = await Patient.findById(sessionId);

    if (!patient) {
      return res.status(404).json({
        error: 'Patient session not found',
      });
    }

    let savedDocuments = 0;
    let savedTimelineEvents = 0;

    /*
     * Save uploaded documents
     */
    if (Array.isArray(documents)) {
      for (const document of documents) {
        try {
          if (!document || typeof document !== 'object') {
            continue;
          }

          const typeMap = {
            prescription: 'Prescription',
            lab_report: 'Lab Report',
            discharge_summary: 'Discharge Summary',
            scan_imaging: 'Imaging Report',

            Prescription: 'Prescription',
            'Lab Report': 'Lab Report',
            'Discharge Summary': 'Discharge Summary',
            'Imaging Report': 'Imaging Report',
          };

          const documentType =
            typeMap[document.category] ||
            typeMap[document.type] ||
            'Lab Report';

          /*
           * Accept multiple possible frontend names.
           */
          const fileUrl =
            document.fileUrl ||
            document.url ||
            document.downloadUrl ||
            document.previewUrl ||
            document.path ||
            '';

          /*
           * MedicalDocument requires fileUrl.
           *
           * If the Flutter app sends only a local file path,
           * MongoDB cannot display that file later.
           *
           * But we still keep the document data when a real URL
           * is supplied.
           */
          if (!fileUrl) {
            console.warn(
              '[document] skipped: no fileUrl/url',
              document,
            );
            continue;
          }

          const extractedData =
            document.extractedData ||
            {};

          const ocrResult =
            document.ocrResult ||
            {};

          const fields =
            ocrResult.labValues ||
            extractedData.fields ||
            document.fields ||
            [];

          const diagnosesNoted =
            ocrResult.diagnoses ||
            extractedData.diagnosesNoted ||
            document.diagnosesNoted ||
            [];

          const medicationsNoted =
            ocrResult.medications ||
            extractedData.medicationsNoted ||
            document.medicationsNoted ||
            [];

          const savedDocument =
            await MedicalDocument.create({
              patient: patient._id,

              type: documentType,

              title:
                document.title ||
                document.name ||
                document.fileName ||
                documentType,

              date:
                document.uploadedAt ||
                document.date ||
                new Date(),

              fileUrl,

              extractedData: {
                fields,
                diagnosesNoted,
                medicationsNoted,
              },

              status:
                document.ocrStatus === 'done' ||
                document.status === 'processed'
                  ? 'processed'
                  : 'pending',
            });

          savedDocuments += 1;

          /*
           * Create timeline event for every saved document.
           */
          await TimelineEvent.create({
            patient: patient._id,
            date:
              document.uploadedAt ||
              document.date ||
              new Date(),

            label:
              document.title ||
              document.name ||
              document.fileName ||
              documentType,

            type: documentType,

            detail:
              document.description ||
              `${documentType} uploaded by patient`,

            document: savedDocument._id,
          });

          savedTimelineEvents += 1;
        } catch (documentError) {
          console.error(
            '[document] failed to save:',
            documentError,
          );
        }
      }
    }

    /*
     * Save red flags
     */
    if (Array.isArray(redFlags)) {
      patient.redFlags = redFlags;

      if (redFlags.length > 0) {
        patient.priority = 'priority';
      }
    }

    /*
     * Add current OPD visit to timeline.
     */
    try {
      await TimelineEvent.create({
        patient: patient._id,
        date: new Date(),
        label: 'Current OPD Visit',
        type: 'Current OPD Visit',
        detail: 'Patient completed kiosk intake and submitted history.',
      });

      savedTimelineEvents += 1;
    } catch (timelineError) {
      console.error(
        '[timeline] failed to create OPD event:',
        timelineError,
      );
    }

    patient.status =
      patient.priority === 'priority'
        ? 'PRIORITY'
        : 'WAITING';

    await patient.save();

    emitToDoctors('patient:submitted', {
      patientId: patient._id,
      name: patient.name,
      token: patient.token,
      priority: patient.priority,
    });

    emitToDoctors('patient:updated', {
      patientId: patient._id,
    });

    res.json({
      ok: true,
      patientId: patient._id,
      tokenNumber: patient.token,
      savedDocuments,
      savedTimelineEvents,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/redflag/alert
 */
export async function alertRedFlag(req, res, next) {
  try {
    const {
      patientId,
      flags,
    } = req.body;

    const patient =
      await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        error: 'Patient not found',
      });
    }

    await Notification.create({
      level: 'priority',
      title: 'Priority patient detected',
      message: `${patient.name} has a potential red-flag symptom.`,
      patient: patient._id,
    });

    emitToDoctors('patient:priority', {
      patientId: patient._id,
      name: patient.name,
      token: patient.token,
      redFlags: flags,
    });

    res.json({
      ok: true,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/session/:id
 */
export async function getSession(req, res, next) {
  try {
    const patient =
      await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        error: 'Session not found',
      });
    }

    res.json(patient);
  } catch (err) {
    next(err);
  }
}
