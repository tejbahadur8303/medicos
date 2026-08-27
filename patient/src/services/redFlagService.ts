import type { RedFlag } from "../types/history";
import type { HistoryQuestion } from "../types/history";

// Safety layer: inspects accumulated answers against simple rules and
// returns triage-only labels, never a diagnosis. This only flags potential
// urgency for clinical staff — the physician decides everything else.

const labelMap: Record<string, { en: string; hi: string }> = {
  cp_breathless: { en: "Chest pain with breathlessness", hi: "सीने में दर्द के साथ सांस फूलना" },
  fv_breathless: { en: "Fever with breathing difficulty", hi: "बुखार के साथ सांस लेने में तकलीफ" },
  fv_rash: { en: "Fever with rash or bleeding", hi: "बुखार के साथ दाने या रक्तस्राव" },
  cg_blood: { en: "Coughing up blood", hi: "खांसी में खून आना" },
  cg_breathless: { en: "Cough with breathing difficulty", hi: "खांसी के साथ सांस लेने में तकलीफ" },
};

export function evaluateRedFlags(
  questions: HistoryQuestion[],
  answers: Record<string, string | string[]>
): RedFlag[] {
  const flags: RedFlag[] = [];
  for (const q of questions) {
    if (q.redFlagRule && q.redFlagRule(answers)) {
      const label = labelMap[q.id];
      if (label) {
        flags.push({ id: q.id, label: label.en });
      }
    }
  }
  return flags;
}

export function hasCriticalCombination(answers: Record<string, string | string[]>): boolean {
  // chest pain + breathlessness is the flagship demo combination
  return answers["cp_breathless"] === "yes";
}
