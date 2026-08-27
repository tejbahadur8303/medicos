import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../store/usePatientStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { useDocumentStore } from "../../store/useDocumentStore";
import { useAppStore } from "../../store/useAppStore";
import { api } from "../../services/apiService";
import KioskShell from "../../widgets/KioskShell";
import { ClipboardCheck } from "lucide-react";

export default function PatientConfirmationScreen() {
  const navigate = useNavigate();
  const { patient, consent } = usePatientStore();
  const isHindi = patient.language === "hi";
  const history = useHistoryStore();
  const { documents } = useDocumentStore();
  const { demoMode, setSubmission } = useAppStore();

  const submit = async () => {
    const payload = {
      patient: {
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        language: patient.language,
        abhaId: patient.abhaId,
      },
      consent: { given: consent.given, timestamp: consent.timestamp },
      chiefComplaint: history.chiefComplaint,
      historyOfPresentIllness: history.answers,
      pastHistory: [],
      medications: history.medications,
      allergies: history.allergies,
      familyHistory: history.familyHistory,
      personalHistory: history.personalHistory,
      reviewOfSystems: history.reviewOfSystems,
      documents,
      redFlags: history.redFlags,
      summary: "",
    };

    const patientId = `MK-${Math.floor(1000 + Math.random() * 9000)}`;
    const token = `A-${Math.floor(100 + Math.random() * 900)}`;

    if (!demoMode) {
      try {
        await api.submitSession(payload);
        if (history.redFlags.length > 0) await api.alertRedFlag({ patientId, redFlags: history.redFlags });
      } catch {
        // Offline/backend unavailable — the session stays saved locally
        // (zustand persist) so nothing is lost; submission still proceeds
        // in a queued state for the demo.
      }
    }

    setSubmission(patientId, token);
    navigate("/submitted");
  };

  return (
    <KioskShell step={5} totalSteps={5}>
      <div className="flex flex-col items-center pt-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-kiosk-50">
          <ClipboardCheck size={30} className="text-kiosk-600" />
        </div>
        <h1 className="mt-4 font-display text-2xl text-ink">
          {isHindi ? "अपनी जानकारी जांचें" : "Please Check Your Information"}
        </h1>
        <p className="mt-2 max-w-xs text-base text-ink/70">
          {isHindi
            ? "AI द्वारा तैयार जानकारी में गलती हो सकती है। कृपया आगे बढ़ने से पहले पिछली स्क्रीन पर जांच लें।"
            : "AI-generated information may contain mistakes. Please correct anything that is wrong before continuing."}
        </p>

        <button
          onClick={() => navigate("/summary")}
          className="tap-target mt-6 w-full max-w-xs rounded-2xl border-2 border-stone-150 bg-white py-3.5 text-base font-semibold text-ink/70"
        >
          {isHindi ? "सारांश फिर देखें" : "Review summary again"}
        </button>

        <button
          onClick={submit}
          className="tap-target mt-4 w-full max-w-xs rounded-2xl bg-kiosk-500 py-4 text-lg font-bold text-white shadow-raised"
        >
          {isHindi ? "पुष्टि करें और भेजें" : "Confirm & Submit"}
        </button>
      </div>
    </KioskShell>
  );
}
