import { MedicalDocument } from '../models/MedicalDocument.js';
import { TimelineEvent } from '../models/TimelineEvent.js';
import { runMockOcr } from '../services/ocrService.js';
import { emitToDoctors } from '../sockets/index.js';

const timelineTypeByDocType = {
  Prescription: 'Prescription',
  'Lab Report': 'Blood Test',
  'Discharge Summary': 'Hospital Discharge',
  'Imaging Report': 'Imaging',
};

/**
 * POST /api/document/upload
 * Called by the Flutter app after the patient takes/selects a photo.
 * Stores document metadata; actual file bytes would go to S3/GCS in
 * production — fileUrl here is whatever storage URL the caller provides.
 */
export async function uploadDocument(req, res, next) {
  try {
    const { patientId, type, title, fileUrl } = req.body;
    const doc = await MedicalDocument.create({
      patient: patientId,
      type,
      title: title || type,
      fileUrl,
      status: 'pending',
    });
    res.status(201).json({ ok: true, documentId: doc._id });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/document/ocr
 * Runs OCR extraction on a previously uploaded document. Swap
 * runMockOcr for a real OCR/vision-LLM provider call — the provider API
 * key stays in this backend's environment only, never in Flutter.
 */
export async function processOcr(req, res, next) {
  try {
    const { documentId } = req.body;
    const doc = await MedicalDocument.findById(documentId);
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    doc.status = 'processing';
    await doc.save();

    const result = await runMockOcr(doc.type);
    doc.extractedData = result.extractedData;
    doc.date = result.date;
    doc.status = 'processed';
    await doc.save();

    await TimelineEvent.create({
      patient: doc.patient,
      date: result.date,
      label: doc.title,
      type: timelineTypeByDocType[doc.type] || 'Blood Test',
      detail: result.detailSummary,
      document: doc._id,
    });

    emitToDoctors('patient:updated', { patientId: doc.patient });

    res.json({ ok: true, extractedData: doc.extractedData });
  } catch (err) {
    next(err);
  }
}
