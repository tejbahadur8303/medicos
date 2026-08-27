export const kFamilyHistoryOptions: { en: string; hi: string }[] = [
  { en: "Diabetes", hi: "मधुमेह" },
  { en: "High blood pressure", hi: "उच्च रक्तचाप" },
  { en: "Heart disease", hi: "हृदय रोग" },
  { en: "Cancer", hi: "कैंसर" },
];

export const kChiefComplaints: { en: string; hi: string; emoji: string; value: string }[] = [
  { en: "Fever", hi: "बुखार", emoji: "🤒", value: "fever" },
  { en: "Pain", hi: "दर्द", emoji: "😣", value: "pain" },
  { en: "Breathing Problem", hi: "सांस की समस्या", emoji: "😮\u200d💨", value: "breathing" },
  { en: "Cough", hi: "खांसी", emoji: "🤧", value: "cough" },
  { en: "Stomach Problem", hi: "पेट की समस्या", emoji: "🤢", value: "stomach" },
  { en: "Headache", hi: "सिरदर्द", emoji: "🧠", value: "headache" },
  { en: "Chest Pain", hi: "सीने में दर्द", emoji: "💔", value: "chest_pain" },
  { en: "Other", hi: "अन्य", emoji: "➕", value: "other" },
];

export const kReviewOfSystems: Record<string, { en: string; hi: string }[]> = {
  General: [
    { en: "Fever", hi: "बुखार" },
    { en: "Weight loss", hi: "वजन घटना" },
    { en: "Fatigue", hi: "थकान" },
  ],
  Respiratory: [
    { en: "Cough", hi: "खांसी" },
    { en: "Breathlessness", hi: "सांस फूलना" },
  ],
  Cardiovascular: [
    { en: "Chest pain", hi: "सीने में दर्द" },
    { en: "Palpitations", hi: "धड़कन तेज़ होना" },
  ],
  Gastrointestinal: [
    { en: "Abdominal pain", hi: "पेट दर्द" },
    { en: "Vomiting", hi: "उल्टी" },
    { en: "Diarrhea", hi: "दस्त" },
  ],
  Neurological: [
    { en: "Headache", hi: "सिरदर्द" },
    { en: "Dizziness", hi: "चक्कर आना" },
    { en: "Weakness", hi: "कमजोरी" },
  ],
};

export const kDocumentCategories: { key: string; en: string; hi: string; emoji: string }[] = [
  { key: "prescription", en: "Prescription", hi: "नुस्खा", emoji: "📄" },
  { key: "labReport", en: "Lab Report", hi: "लैब रिपोर्ट", emoji: "🧪" },
  { key: "dischargeSummary", en: "Discharge Summary", hi: "डिस्चार्ज सारांश", emoji: "🏥" },
  { key: "scanImaging", en: "Scan / Imaging", hi: "स्कैन / इमेजिंग", emoji: "🩻" },
];
