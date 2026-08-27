import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Trash2 } from "lucide-react";
import { usePatientStore } from "../../store/usePatientStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { speechService } from "../../services/speechService";
import KioskShell from "../../widgets/KioskShell";
import LargeOptionButton from "../../widgets/LargeOptionButton";

export default function MedicationScreen() {
  const navigate = useNavigate();
  const patient = usePatientStore((s) => s.patient);
  const isHindi = patient.language === "hi";
  const { medicationStatus, setMedicationStatus, medications, addMedication, removeMedication } = useHistoryStore();

  const [draftName, setDraftName] = useState("");
  const [listening, setListening] = useState(false);

  const speakName = () => {
    if (listening) {
      speechService.stopListening();
      setListening(false);
      return;
    }
    setListening(true);
    speechService.startListening(patient.language, (text, isFinal) => {
      setDraftName(text);
      if (isFinal) setListening(false);
    });
  };

  const canContinue = medicationStatus !== null;

  return (
    <KioskShell step={4} totalSteps={5}>
      <h1 className="font-display text-2xl text-ink">
        {isHindi ? "क्या आप कोई दवा ले रहे हैं?" : "Are you currently taking any medicines?"}
      </h1>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <LargeOptionButton
          label={isHindi ? "हां" : "Yes"}
          selected={medicationStatus === "yes"}
          onTap={() => setMedicationStatus("yes")}
        />
        <LargeOptionButton
          label={isHindi ? "नहीं" : "No"}
          selected={medicationStatus === "no"}
          onTap={() => setMedicationStatus("no")}
        />
        <LargeOptionButton
          label={isHindi ? "पता नहीं" : "Don't know"}
          selected={medicationStatus === "unknown"}
          onTap={() => setMedicationStatus("unknown")}
        />
      </div>

      {medicationStatus === "yes" && (
        <div className="mt-5 rounded-kiosk border border-stone-150 bg-white p-4">
          <p className="text-sm font-medium text-ink/60">
            {isHindi ? "दवा का नाम लिखें या बोलें" : "Type or speak the medicine name"}
          </p>
          <div className="mt-2 flex gap-2">
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="tap-target flex-1 rounded-2xl border-2 border-stone-150 px-4 py-3 text-lg focus:border-kiosk-400 focus:outline-none"
              placeholder={isHindi ? "जैसे मेटफॉर्मिन" : "e.g. Metformin"}
            />
            <button
              onClick={speakName}
              className={`tap-target flex items-center justify-center rounded-2xl px-4 ${
                listening ? "bg-crimson-500" : "bg-kiosk-500"
              } text-white`}
            >
              <Mic size={20} />
            </button>
          </div>
          <button
            disabled={!draftName.trim()}
            onClick={() => {
              addMedication({ name: draftName.trim() });
              setDraftName("");
            }}
            className="tap-target mt-3 w-full rounded-2xl bg-kiosk-500 py-2.5 text-base font-semibold text-white disabled:opacity-40"
          >
            + {isHindi ? "दवा जोड़ें" : "Add medicine"}
          </button>

          {medications.length > 0 && (
            <div className="mt-4 space-y-2">
              {medications.map((m, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl bg-kiosk-50 px-4 py-2.5">
                  <span className="text-base text-ink">{m.name}</span>
                  <button onClick={() => removeMedication(i)} className="text-ink/40 hover:text-crimson-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        disabled={!canContinue}
        onClick={() => navigate("/allergy")}
        className="tap-target mt-6 w-full rounded-2xl bg-kiosk-500 py-4 text-lg font-bold text-white shadow-raised disabled:opacity-40"
      >
        {isHindi ? "आगे बढ़ें" : "Continue"}
      </button>
    </KioskShell>
  );
}
