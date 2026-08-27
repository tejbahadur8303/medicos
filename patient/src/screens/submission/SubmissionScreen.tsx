import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../store/usePatientStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { useDocumentStore } from "../../store/useDocumentStore";
import { useAppStore } from "../../store/useAppStore";
import { CheckCircle2 } from "lucide-react";

export default function SubmissionScreen() {
  const navigate = useNavigate();
  const patient = usePatientStore((s) => s.patient);
  const isHindi = patient.language === "hi";
  const { patientId, token } = useAppStore();
  const redFlags = useHistoryStore((s) => s.redFlags);
  const resetHistory = useHistoryStore((s) => s.resetHistory);
  const resetDocuments = useDocumentStore((s) => s.resetDocuments);
  const resetSession = usePatientStore((s) => s.resetSession);

  const startOver = () => {
    // Clear session data from the device now that it's been submitted.
    resetHistory();
    resetDocuments();
    resetSession();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-moss-50">
        <CheckCircle2 size={40} className="text-moss-500" />
      </div>
      <h1 className="mt-6 font-display text-3xl text-ink">
        {isHindi ? "इतिहास भेज दिया गया ✓" : "History Submitted ✓"}
      </h1>
      <p className="mt-2 max-w-xs text-base text-ink/70">
        {isHindi
          ? "आपका मेडिकल इतिहास क्लिनिकल टीम को भेज दिया गया है।"
          : "Your medical history has been sent to the clinical team."}
      </p>

      <div className="mt-6 w-full max-w-xs rounded-kiosk border border-stone-150 bg-white p-5">
        <div className="flex justify-between text-sm">
          <span className="text-ink/50">{isHindi ? "पेशेंट आईडी" : "Patient ID"}</span>
          <span className="font-semibold text-ink">{patientId}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-ink/50">{isHindi ? "टोकन नंबर" : "Token Number"}</span>
          <span className="font-semibold text-ink">{token}</span>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold">
          {redFlags.length > 0 ? (
            <span className="rounded-full bg-crimson-50 px-3 py-1.5 text-crimson-600">
              🔴 {isHindi ? "प्राथमिकता समीक्षा अनुरोधित" : "Priority review requested"}
            </span>
          ) : (
            <span className="rounded-full bg-moss-50 px-3 py-1.5 text-moss-500">
              🟢 {isHindi ? "परामर्श के लिए तैयार" : "Ready for Consultation"}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={startOver}
        className="tap-target mt-8 w-full max-w-xs rounded-2xl border-2 border-stone-150 bg-white py-3.5 text-base font-semibold text-ink/70"
      >
        {isHindi ? "नया सत्र शुरू करें" : "Start a new session"}
      </button>
    </div>
  );
}
