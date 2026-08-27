/**
 * Mock OCR provider. Swap this for a real OCR/vision-LLM call — keep
 * that call and its API key entirely on this backend (e.g. inside this
 * file), never in the Flutter app or the React dashboard.
 */
export async function runMockOcr(documentType) {
  await new Promise((r) => setTimeout(r, 400));

  if (documentType === 'Lab Report') {
    const glucose = 140 + Math.floor(Math.random() * 60);
    return {
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      detailSummary: `Glucose ${glucose} mg/dL — flagged`,
      extractedData: {
        fields: [
          { label: 'Glucose', value: String(glucose), unit: 'mg/dL', confidence: 'high', flagged: glucose >= 140 },
          { label: 'Hemoglobin', value: '10.2', unit: 'g/dL', confidence: 'high', flagged: true },
        ],
        diagnosesNoted: [],
        medicationsNoted: [],
      },
    };
  }

  if (documentType === 'Prescription') {
    return {
      date: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
      detailSummary: 'Metformin 500mg started',
      extractedData: {
        fields: [
          { label: 'Medication', value: 'Metfor...', confidence: 'low' },
          { label: 'Dosage', value: '500mg', confidence: 'high' },
        ],
        diagnosesNoted: ['Type 2 Diabetes — noted'],
        medicationsNoted: ['Metformin 500mg — once daily'],
      },
    };
  }

  if (documentType === 'Discharge Summary') {
    return {
      date: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
      detailSummary: 'Chest pain — ruled out for acute event',
      extractedData: {
        fields: [{ label: 'Reason for admission', value: 'Observation for chest pain', confidence: 'high' }],
        diagnosesNoted: ['Chest pain — ruled out for acute event'],
        medicationsNoted: [],
      },
    };
  }

  return {
    date: new Date(),
    detailSummary: '',
    extractedData: { fields: [], diagnosesNoted: [], medicationsNoted: [] },
  };
}
