import { useNavigate } from "react-router-dom";
import { Stethoscope, PlayCircle } from "lucide-react";
import { usePatientStore } from "../../store/usePatientStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { useDocumentStore } from "../../store/useDocumentStore";

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const setPatient = usePatientStore((s) => s.setPatient);
  const setLanguage = usePatientStore((s) => s.setLanguage);
  const giveConsent = usePatientStore((s) => s.giveConsent);
  const setChiefComplaint = useHistoryStore((s) => s.setChiefComplaint);
  const setAnswer = useHistoryStore((s) => s.setAnswer);
  const addRedFlags = useHistoryStore((s) => s.addRedFlags);
  const addDocument = useDocumentStore((s) => s.addDocument);

  const startDemo = () => {
    setLanguage("hi");
    setPatient({
      name: "Rahul Kumar",
      age: 45,
      gender: "Male",
      mobile: "98XXXXXX10",
      language: "hi",
      isGuest: true,
    });
    giveConsent();
    setChiefComplaint("chest_pain", "Kal se mere seene mein dard hai aur chalne par saans phoolti hai.");
    setAnswer("cp_onset", "yesterday");
    setAnswer("cp_location", "center");
    setAnswer("cp_severity", "moderate");
    setAnswer("cp_walking", "yes");
    setAnswer("cp_rest", "yes");
    setAnswer("cp_breathless", "yes");
    setAnswer("cp_sweating", "no");
    setAnswer("cp_dizziness", "no");
    setAnswer("cp_diabetes", "yes");
    setAnswer("cp_hypertension", "yes");
    addRedFlags([{ id: "cp_breathless", label: "Chest pain with breathlessness" }]);
    addDocument({
      id: "demo-doc-1",
      category: "labReport",
      localFileName: "blood_report.jpg",
      uploadedAt: new Date().toISOString(),
      ocrStatus: "done",
      ocrResult: {
        documentType: "lab_report",
        date: "2026-08-12",
        diagnoses: [],
        medications: [],
        labValues: [
          { name: "Glucose", value: "178", unit: "mg/dL", flagged: true },
          { name: "Hemoglobin", value: "10.2", unit: "g/dL", flagged: true },
        ],
      },
    });
    navigate("/summary");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-kiosk-500 shadow-raised">
        <Stethoscope size={36} className="text-white" />
      </div>
      <h1 className="mt-6 font-display text-4xl text-ink">MediKiosk</h1>
      <p className="mt-2 text-lg text-ink/60">Your History. Your Voice. Ready for the Doctor.</p>
      <p className="mt-8 max-w-xs text-base text-ink/70">
        Let's prepare your medical history before you meet the doctor.
      </p>

      <button
        onClick={() => navigate("/language")}
        className="tap-target mt-10 w-full max-w-xs rounded-2xl bg-kiosk-500 py-4 text-xl font-bold text-white shadow-raised hover:bg-kiosk-600"
      >
        START
      </button>
      <button className="tap-target mt-3 w-full max-w-xs rounded-2xl border-2 border-stone-150 bg-white py-3.5 text-lg font-semibold text-ink/70">
        Help
      </button>

      <button
        onClick={startDemo}
        className="mt-8 flex items-center gap-2 text-sm font-medium text-kiosk-600 hover:text-kiosk-700"
      >
        <PlayCircle size={16} /> Try Demo
      </button>
    </div>
  );
}
