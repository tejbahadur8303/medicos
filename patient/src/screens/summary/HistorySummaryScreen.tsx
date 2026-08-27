import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../store/usePatientStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { useDocumentStore } from "../../store/useDocumentStore";
import { kChiefComplaints } from "../../utils/constants";
import KioskShell from "../../widgets/KioskShell";
import SummarySection from "../../widgets/SummarySection";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export default function HistorySummaryScreen() {
  const navigate = useNavigate();
  const patient = usePatientStore((s) => s.patient);
  const isHindi = patient.language === "hi";
  const history = useHistoryStore();
  const { documents } = useDocumentStore();

  const complaintLabel =
    kChiefComplaints.find((c) => c.value === history.chiefComplaint)?.[isHindi ? "hi" : "en"] ||
    history.chiefComplaint ||
    "—";

  const presentIllness = Object.entries(history.answers).filter(([k]) => k.startsWith("cp_") || k.startsWith("fv_") || k.startsWith("cg_") || k.startsWith("gn_"));

  const flaggedLabs = documents.flatMap((d) => d.ocrResult?.labValues.filter((v) => v.flagged) || []);

  return (
    <KioskShell step={5} totalSteps={5}>
      <h1 className="font-display text-2xl text-ink">
        {isHindi ? "आपका मेडिकल इतिहास" : "Your Medical History"}
      </h1>
      <p className="mt-1 text-sm text-ink/50">
        {isHindi
          ? "AI द्वारा तैयार जानकारी में गलती हो सकती है। कृपया जो गलत है उसे ठीक करें।"
          : "AI-generated information may contain mistakes. Please correct anything that is wrong."}
      </p>

      <div className="mt-5 rounded-kiosk border border-stone-150 bg-white p-5">
        <SummarySection title={isHindi ? "मुख्य शिकायत" : "Chief Complaint"} onEdit={() => navigate("/complaint")}>
          {complaintLabel}
          {history.chiefComplaintTranscript && (
            <p className="mt-1 text-sm italic text-ink/50">"{history.chiefComplaintTranscript}"</p>
          )}
        </SummarySection>

        <SummarySection title={isHindi ? "वर्तमान बीमारी का इतिहास" : "History of Present Illness"} onEdit={() => navigate("/history")}>
          <ul className="list-disc space-y-1 pl-4 text-sm">
            {presentIllness.map(([k, v]) => (
              <li key={k}>{Array.isArray(v) ? v.join(", ") : v}</li>
            ))}
          </ul>
        </SummarySection>

        <SummarySection title={isHindi ? "दवाइयां" : "Medications"} onEdit={() => navigate("/medication")}>
          {history.medications.length ? (
            <ul className="list-disc space-y-1 pl-4 text-sm">
              {history.medications.map((m, i) => (
                <li key={i}>{m.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-ink/50">{isHindi ? "कोई नहीं बताई गई" : "None reported"}</p>
          )}
        </SummarySection>

        <SummarySection title={isHindi ? "एलर्जी" : "Allergies"} onEdit={() => navigate("/allergy")}>
          {history.allergies.length ? history.allergies.join(", ") : (isHindi ? "कोई ज्ञात एलर्जी नहीं" : "No known allergy reported")}
        </SummarySection>

        {flaggedLabs.length > 0 && (
          <SummarySection title={isHindi ? "पिछली जांच" : "Previous Investigations"}>
            <div className="space-y-1">
              {flaggedLabs.map((v, i) => (
                <p key={i} className="flex items-center gap-1.5 text-sm">
                  {v.name}: {v.value} {v.unit}
                  <span className="flex items-center gap-1 text-xs text-marigold-600">
                    <AlertTriangle size={11} /> {isHindi ? "समीक्षा के लिए चिह्नित" : "Flagged for physician attention"}
                  </span>
                </p>
              ))}
            </div>
          </SummarySection>
        )}

        {history.redFlags.length > 0 && (
          <div className="mt-4 rounded-2xl border-2 border-crimson-500 bg-crimson-50 p-4">
            <p className="flex items-center gap-2 font-display text-lg text-crimson-600">
              <ShieldAlert size={18} /> {isHindi ? "प्राथमिकता समीक्षा" : "Potential priority review"}
            </p>
            <ul className="mt-1 space-y-0.5 text-sm text-ink/80">
              {history.redFlags.map((f) => (
                <li key={f.id}>🔴 {f.label}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/confirm")}
        className="tap-target mt-6 w-full rounded-2xl bg-kiosk-500 py-4 text-lg font-bold text-white shadow-raised"
      >
        {isHindi ? "आगे बढ़ें" : "Continue"}
      </button>
    </KioskShell>
  );
}
