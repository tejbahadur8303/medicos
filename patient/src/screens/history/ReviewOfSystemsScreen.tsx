import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../store/usePatientStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { kReviewOfSystems } from "../../utils/constants";
import KioskShell from "../../widgets/KioskShell";

export default function ReviewOfSystemsScreen() {
  const navigate = useNavigate();
  const patient = usePatientStore((s) => s.patient);
  const isHindi = patient.language === "hi";
  const { reviewOfSystems, setReviewOfSystems } = useHistoryStore();
  const [values, setValues] = useState<Record<string, boolean>>(reviewOfSystems);

  const toggle = (key: string, value: boolean) => setValues((v) => ({ ...v, [key]: value }));

  const submit = () => {
    setReviewOfSystems(values);
    navigate("/documents");
  };

  return (
    <KioskShell step={4} totalSteps={5}>
      <h1 className="font-display text-2xl text-ink">
        {isHindi ? "कुछ और लक्षण जांचें" : "A Few More Symptoms"}
      </h1>
      <p className="mt-1 text-sm text-ink/50">
        {isHindi ? "हां या नहीं में जवाब दें" : "Answer yes or no for each"}
      </p>

      <div className="mt-5 space-y-6">
        {Object.entries(kReviewOfSystems).map(([system, items]) => (
          <div key={system}>
            <p className="text-sm font-semibold uppercase tracking-wide text-kiosk-600">{system}</p>
            <div className="mt-2 space-y-2">
              {items.map((item) => {
                const key = `${system}_${item.en}`;
                const value = values[key];
                return (
                  <div key={key} className="flex items-center justify-between rounded-2xl border border-stone-150 bg-white px-4 py-2.5">
                    <span className="text-base text-ink">{isHindi ? item.hi : item.en}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggle(key, true)}
                        className={`tap-target rounded-xl px-4 py-2 text-sm font-semibold ${
                          value === true ? "bg-kiosk-500 text-white" : "bg-stone-150 text-ink/60"
                        }`}
                      >
                        ✓ {isHindi ? "हां" : "Yes"}
                      </button>
                      <button
                        onClick={() => toggle(key, false)}
                        className={`tap-target rounded-xl px-4 py-2 text-sm font-semibold ${
                          value === false ? "bg-ink/80 text-white" : "bg-stone-150 text-ink/60"
                        }`}
                      >
                        ✕ {isHindi ? "नहीं" : "No"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={submit}
        className="tap-target mt-7 w-full rounded-2xl bg-kiosk-500 py-4 text-lg font-bold text-white shadow-raised"
      >
        {isHindi ? "आगे बढ़ें" : "Continue"}
      </button>
    </KioskShell>
  );
}
