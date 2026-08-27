import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../store/usePatientStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import KioskShell from "../../widgets/KioskShell";
import LargeOptionButton from "../../widgets/LargeOptionButton";

const statusOptions: { key: "none" | "medicine" | "food" | "other"; en: string; hi: string }[] = [
  { key: "none", en: "No known allergy", hi: "कोई ज्ञात एलर्जी नहीं" },
  { key: "medicine", en: "Medicine", hi: "दवा" },
  { key: "food", en: "Food", hi: "खाना" },
  { key: "other", en: "Other", hi: "अन्य" },
];

export default function AllergyScreen() {
  const navigate = useNavigate();
  const patient = usePatientStore((s) => s.patient);
  const isHindi = patient.language === "hi";
  const { allergyStatus, setAllergyStatus, allergies, addAllergy } = useHistoryStore();
  const [draft, setDraft] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const canContinue = allergyStatus !== null && (allergyStatus === "none" || allergies.length > 0);

  return (
    <KioskShell step={4} totalSteps={5}>
      <h1 className="font-display text-2xl text-ink">
        {isHindi ? "क्या आपको कोई एलर्जी है?" : "Do you have any known allergies?"}
      </h1>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {statusOptions.map((opt) => (
          <LargeOptionButton
            key={opt.key}
            label={isHindi ? opt.hi : opt.en}
            selected={allergyStatus === opt.key}
            onTap={() => setAllergyStatus(opt.key)}
          />
        ))}
      </div>

      {(allergyStatus === "medicine" || allergyStatus === "food" || allergyStatus === "other") && (
        <div className="mt-5 rounded-kiosk border border-stone-150 bg-white p-4">
          <p className="text-sm font-medium text-ink/60">
            {isHindi ? "नाम बताएं या लिखें" : "Speak or type the name"}
          </p>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="tap-target mt-2 w-full rounded-2xl border-2 border-stone-150 px-4 py-3 text-lg focus:border-kiosk-400 focus:outline-none"
            placeholder={isHindi ? "जैसे पेनिसिलिन" : "e.g. Penicillin"}
          />
          <button
            disabled={!draft.trim()}
            onClick={() => {
              addAllergy(draft.trim());
              setDraft("");
              setConfirmed(true);
            }}
            className="tap-target mt-3 w-full rounded-2xl bg-kiosk-500 py-2.5 text-base font-semibold text-white disabled:opacity-40"
          >
            + {isHindi ? "जोड़ें" : "Add"}
          </button>
          {allergies.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {allergies.map((a, i) => (
                <span key={i} className="rounded-full bg-kiosk-50 px-3 py-1 text-sm text-kiosk-700">
                  {a}
                </span>
              ))}
            </div>
          )}
          {confirmed && (
            <p className="mt-3 text-sm font-medium text-ink/60">
              {isHindi ? "क्या यह जानकारी सही है?" : "Is this information correct?"}
            </p>
          )}
        </div>
      )}

      <button
        disabled={!canContinue}
        onClick={() => navigate("/family-history")}
        className="tap-target mt-6 w-full rounded-2xl bg-kiosk-500 py-4 text-lg font-bold text-white shadow-raised disabled:opacity-40"
      >
        {isHindi ? "आगे बढ़ें" : "Continue"}
      </button>
    </KioskShell>
  );
}
