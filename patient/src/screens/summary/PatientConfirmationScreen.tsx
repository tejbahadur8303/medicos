import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../store/usePatientStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { useDocumentStore } from "../../store/useDocumentStore";
import { useAppStore } from "../../store/useAppStore";
import { api } from "../../services/apiService";
import KioskShell from "../../widgets/KioskShell";
import { ClipboardCheck, Loader2 } from "lucide-react";

export default function PatientConfirmationScreen() {
  const navigate = useNavigate();

  const { patient, consent } = usePatientStore();
  const isHindi = patient.language === "hi";

  const history = useHistoryStore();
  const { documents } = useDocumentStore();
  const { demoMode, setSubmission } = useAppStore();

  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (submitting) return;

    // Backend MongoDB patient/session ID is required
    if (!patient.sessionId) {
      alert(
        isHindi
          ? "Patient session नहीं मिला। कृपया registration से फिर शुरू करें।"
          : "Patient session not found. Please start again.",
      );
      return;
    }

    setSubmitting(true);

    const payload = {
      sessionId: patient.sessionId,

      patient: {
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        mobileNumber: patient.mobile,
        language: patient.language,
        abhaId: patient.abhaId,
        isGuest: patient.isGuest,
      },

      consent: {
        given: consent.given,
        timestamp: consent.timestamp,
      },

      chiefComplaint: history.chiefComplaint,

      historyOfPresentIllness: history.answers,

      pastHistory: [],

      medications: history.medications,

      allergies: history.allergies,

      familyHistory: history.familyHistory,

      personalHistory: history.personalHistory,

      reviewOfSystems: history.reviewOfSystems,

      documents: documents.map((doc) => ({
        id: doc.id,
        category: doc.category,
        localFileName: doc.localFileName,
        uploadedAt: doc.uploadedAt,
        fileUrl: doc.fileUrl || "",
        ocrResult: doc.ocrResult,
        ocrStatus: doc.ocrStatus,
      })),

      redFlags: history.redFlags,

      summary: "",
    };

    try {
      if (!demoMode) {
        const response = await api.submitSession(payload);

        console.log("Patient session submitted:", response);

        if (history.redFlags.length > 0) {
          await api.alertRedFlag({
            patientId: patient.sessionId,
            redFlags: history.redFlags,
          });
        }
      }

      const patientId = patient.sessionId;

      const token =
        patient.token || `A-${Math.floor(100 + Math.random() * 900)}`;

      setSubmission(patientId, token);

      navigate("/submitted");
    } catch (error) {
      console.error("Session submission failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : isHindi
            ? "Session submit नहीं हो सका। कृपया दोबारा प्रयास करें।"
            : "Unable to submit session. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KioskShell step={5} totalSteps={5}>
      <div className="flex flex-col items-center pt-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-kiosk-50">
          <ClipboardCheck size={30} className="text-kiosk-600" />
        </div>

        <h1 className="mt-4 font-display text-2xl text-ink">
          {isHindi
            ? "अपनी जानकारी जांचें"
            : "Please Check Your Information"}
        </h1>

        <p className="mt-2 max-w-xs text-base text-ink/70">
          {isHindi
            ? "AI द्वारा तैयार जानकारी में गलती हो सकती है। कृपया आगे बढ़ने से पहले पिछली स्क्रीन पर जांच लें।"
            : "AI-generated information may contain mistakes. Please correct anything that is wrong before continuing."}
        </p>

        <button
          onClick={() => navigate("/summary")}
          disabled={submitting}
          className="tap-target mt-6 w-full max-w-xs rounded-2xl border-2 border-stone-150 bg-white py-3.5 text-base font-semibold text-ink/70 disabled:opacity-50"
        >
          {isHindi ? "सारांश फिर देखें" : "Review summary again"}
        </button>

        <button
          onClick={submit}
          disabled={submitting}
          className="tap-target mt-4 flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-kiosk-500 py-4 text-lg font-bold text-white shadow-raised disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting && (
            <Loader2 size={22} className="animate-spin" />
          )}

          {submitting
            ? isHindi
              ? "भेजा जा रहा है..."
              : "Submitting..."
            : isHindi
              ? "पुष्टि करें और भेजें"
              : "Confirm & Submit"}
        </button>
      </div>
    </KioskShell>
  );
}