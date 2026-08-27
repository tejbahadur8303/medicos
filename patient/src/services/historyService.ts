import type { HistoryQuestion } from "../types/history";

// Dynamic question engine. For the hackathon MVP: chest pain, fever, cough,
// and a general fallback flow. Each complaint maps to an ordered list of
// HistoryQuestions; the screen walks the list and records answers, and the
// red-flag service inspects the accumulated answers after every question.

const chestPainFlow: HistoryQuestion[] = [
  {
    id: "cp_onset",
    question: "When did the pain start?",
    hindiQuestion: "दर्द कब शुरू हुआ?",
    type: "singleChoice",
    required: true,
    category: "Present Illness",
    options: [
      { en: "Today", hi: "आज", value: "today" },
      { en: "Yesterday", hi: "कल", value: "yesterday" },
      { en: "This week", hi: "इस हफ्ते", value: "this_week" },
      { en: "Longer ago", hi: "इससे पहले", value: "longer" },
    ],
  },
  {
    id: "cp_location",
    question: "Where is the pain?",
    hindiQuestion: "दर्द कहाँ है?",
    type: "singleChoice",
    required: true,
    category: "Present Illness",
    options: [
      { en: "Center of chest", hi: "छाती के बीच में", value: "center" },
      { en: "Left side", hi: "बाईं ओर", value: "left" },
      { en: "Right side", hi: "दाईं ओर", value: "right" },
      { en: "Other", hi: "अन्य", value: "other" },
    ],
  },
  {
    id: "cp_severity",
    question: "How severe is it?",
    hindiQuestion: "दर्द कितना तेज़ है?",
    type: "singleChoice",
    required: true,
    category: "Present Illness",
    options: [
      { en: "Mild", hi: "हल्का", value: "mild" },
      { en: "Moderate", hi: "मध्यम", value: "moderate" },
      { en: "Severe", hi: "गंभीर", value: "severe" },
    ],
  },
  {
    id: "cp_walking",
    question: "Does walking make it worse?",
    hindiQuestion: "क्या चलने से दर्द बढ़ता है?",
    type: "yesNo",
    required: true,
    category: "Present Illness",
  },
  {
    id: "cp_rest",
    question: "Does resting make it better?",
    hindiQuestion: "क्या आराम करने से दर्द कम होता है?",
    type: "yesNo",
    required: true,
    category: "Present Illness",
  },
  {
    id: "cp_breathless",
    question: "Do you have breathing difficulty?",
    hindiQuestion: "क्या आपको सांस लेने में तकलीफ है?",
    type: "yesNo",
    required: true,
    category: "Review of Systems",
    redFlagRule: (answers) => answers["cp_breathless"] === "yes",
  },
  {
    id: "cp_sweating",
    question: "Do you have sweating?",
    hindiQuestion: "क्या आपको पसीना आ रहा है?",
    type: "yesNo",
    required: true,
    category: "Review of Systems",
  },
  {
    id: "cp_dizziness",
    question: "Do you have dizziness?",
    hindiQuestion: "क्या आपको चक्कर आ रहे हैं?",
    type: "yesNo",
    required: true,
    category: "Review of Systems",
  },
  {
    id: "cp_diabetes",
    question: "Do you have diabetes?",
    hindiQuestion: "क्या आपको मधुमेह है?",
    type: "yesNo",
    required: true,
    category: "Past History",
  },
  {
    id: "cp_hypertension",
    question: "Do you have high blood pressure?",
    hindiQuestion: "क्या आपको उच्च रक्तचाप है?",
    type: "yesNo",
    required: true,
    category: "Past History",
  },
];

const feverFlow: HistoryQuestion[] = [
  {
    id: "fv_duration",
    question: "How many days have you had fever?",
    hindiQuestion: "बुखार कितने दिनों से है?",
    type: "singleChoice",
    required: true,
    category: "Present Illness",
    options: [
      { en: "1 day", hi: "1 दिन", value: "1" },
      { en: "2-3 days", hi: "2-3 दिन", value: "2_3" },
      { en: "More than 3 days", hi: "3 दिन से ज़्यादा", value: "more" },
    ],
  },
  {
    id: "fv_pattern",
    question: "Is the fever constant or does it come and go?",
    hindiQuestion: "क्या बुखार लगातार है या आता-जाता है?",
    type: "singleChoice",
    required: true,
    category: "Present Illness",
    options: [
      { en: "Constant", hi: "लगातार", value: "constant" },
      { en: "Comes and goes", hi: "आता-जाता है", value: "intermittent" },
    ],
  },
  {
    id: "fv_chills",
    question: "Do you have chills or body ache?",
    hindiQuestion: "क्या आपको ठंड लगना या बदन दर्द है?",
    type: "yesNo",
    required: true,
    category: "Review of Systems",
  },
  {
    id: "fv_breathless",
    question: "Do you have breathing difficulty?",
    hindiQuestion: "क्या आपको सांस लेने में तकलीफ है?",
    type: "yesNo",
    required: true,
    category: "Review of Systems",
    redFlagRule: (answers) => answers["fv_breathless"] === "yes",
  },
  {
    id: "fv_rash",
    question: "Do you have any rash or bleeding?",
    hindiQuestion: "क्या आपको कोई दाने या रक्तस्राव है?",
    type: "yesNo",
    required: true,
    category: "Review of Systems",
    redFlagRule: (answers) => answers["fv_rash"] === "yes",
  },
];

const coughFlow: HistoryQuestion[] = [
  {
    id: "cg_duration",
    question: "How long have you had the cough?",
    hindiQuestion: "खांसी कब से है?",
    type: "singleChoice",
    required: true,
    category: "Present Illness",
    options: [
      { en: "Less than a week", hi: "एक हफ्ते से कम", value: "lt_week" },
      { en: "1-2 weeks", hi: "1-2 हफ्ते", value: "1_2_weeks" },
      { en: "More than 2 weeks", hi: "2 हफ्ते से ज़्यादा", value: "gt_2_weeks" },
    ],
  },
  {
    id: "cg_type",
    question: "Is it a dry cough or does it bring up phlegm?",
    hindiQuestion: "क्या यह सूखी खांसी है या बलगम आता है?",
    type: "singleChoice",
    required: true,
    category: "Present Illness",
    options: [
      { en: "Dry", hi: "सूखी", value: "dry" },
      { en: "With phlegm", hi: "बलगम के साथ", value: "phlegm" },
    ],
  },
  {
    id: "cg_blood",
    question: "Have you coughed up any blood?",
    hindiQuestion: "क्या खांसी में खून आया है?",
    type: "yesNo",
    required: true,
    category: "Review of Systems",
    redFlagRule: (answers) => answers["cg_blood"] === "yes",
  },
  {
    id: "cg_breathless",
    question: "Do you have breathing difficulty?",
    hindiQuestion: "क्या आपको सांस लेने में तकलीफ है?",
    type: "yesNo",
    required: true,
    category: "Review of Systems",
    redFlagRule: (answers) => answers["cg_breathless"] === "yes",
  },
];

const generalFlow: HistoryQuestion[] = [
  {
    id: "gn_duration",
    question: "How long have you had this problem?",
    hindiQuestion: "यह समस्या कब से है?",
    type: "singleChoice",
    required: true,
    category: "Present Illness",
    options: [
      { en: "Today", hi: "आज", value: "today" },
      { en: "This week", hi: "इस हफ्ते", value: "this_week" },
      { en: "Longer ago", hi: "इससे पहले", value: "longer" },
    ],
  },
  {
    id: "gn_severity",
    question: "How much is it bothering you?",
    hindiQuestion: "यह आपको कितना परेशान कर रहा है?",
    type: "singleChoice",
    required: true,
    category: "Present Illness",
    options: [
      { en: "A little", hi: "थोड़ा", value: "mild" },
      { en: "Somewhat", hi: "कुछ हद तक", value: "moderate" },
      { en: "A lot", hi: "बहुत ज़्यादा", value: "severe" },
    ],
  },
  {
    id: "gn_getting_worse",
    question: "Is it getting worse?",
    hindiQuestion: "क्या यह बढ़ रहा है?",
    type: "yesNo",
    required: true,
    category: "Present Illness",
  },
];

const flowsByComplaint: Record<string, HistoryQuestion[]> = {
  chest_pain: chestPainFlow,
  fever: feverFlow,
  cough: coughFlow,
};

export function getQuestionFlow(chiefComplaint: string): HistoryQuestion[] {
  return flowsByComplaint[chiefComplaint] || generalFlow;
}
