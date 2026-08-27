/**
 * Server-side red-flag detection. This is the authoritative version —
 * the Flutter app runs an equivalent check for immediate on-device
 * feedback, but the backend re-evaluates on every intake/update so the
 * doctor dashboard always reflects a trustworthy triage signal even if
 * the client was tampered with or offline-queued.
 *
 * IMPORTANT SAFETY BOUNDARY: this NEVER returns a diagnosis. It only
 * returns neutral, non-diagnostic flag labels describing a pattern
 * worth a doctor's immediate attention.
 */
export function evaluateRedFlags(answers = {}) {
  const flags = [];

  const isYes = (key) => {
    const v = answers[key];
    if (v === undefined || v === null) return false;
    if (typeof v === 'boolean') return v;
    return String(v).toLowerCase() === 'yes';
  };

  if (isYes('cp_breathless')) flags.push('Chest pain with breathing difficulty reported');
  if (isYes('cp_sweating') && isYes('cp_dizziness')) flags.push('Chest pain with sweating and dizziness reported');
  if (isYes('fv_breathless')) flags.push('Fever with breathing difficulty reported');
  if (isYes('cg_breathless')) flags.push('Cough with breathing difficulty reported');
  if (answers.cg_type === 'With blood') flags.push('Cough with blood reported');

  const severity = Number(answers.cp_severity ?? answers.gn_severity);
  if (!Number.isNaN(severity) && severity >= 8) flags.push('Severity reported as high (8/10 or above)');

  return flags;
}

/** Maps a set of red flags to a triage priority level. */
export function priorityFromFlags(flags) {
  return flags.length > 0 ? 'priority' : 'normal';
}
