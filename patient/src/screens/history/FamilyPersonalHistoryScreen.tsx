import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../store/usePatientStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { kFamilyHistoryOptions } from "../../utils/constants";
import KioskShell from "../../widgets/KioskShell";
import LargeOptionButton from "../../widgets/LargeOptionButton";

const habits: { key: string; en: string; hi: string; icon: string }[] = [
  { key: "Smoking", en: "Smoking", hi: "धूम्रपान", icon: "🚬" },
  { key: "Alcohol", en: "Alcohol", hi: "शराब", icon: "🍺" },
  { key: "Tobacco", en: "Tobacco", hi: "तंबाकू", icon: "🌿" },
];

export default function FamilyPersonalHistoryScreen() {
  const navigate = useNavigate();
  const patient = usePatientStore((s) => s.patient);
  const isHindi = patient.language === "hi";
  const { familyHistory, setFamilyHistory, personalHistory, setPersonalHistory } = useHistoryStore();

  const [family, setFamily] = useState<Record<string, boolean>>(familyHistory);
  const [habitValues, setHabitValues] = useState<Record<string, string>>({
    Smoking: personalHistory.Smoking || "No",
    Alcohol: personalHistory.Alcohol || "No",
    Tobacco: personalHistory.Tobacco || "No",
  });

  const toggleFamily = (key: string, value: boolean) => setFamily((f) => ({ ...f, [key]: value }));
  const setHabit = (key: string, value: string) => setHabitValues((h) => ({ ...h, [key]: value }));

  const submit = () => {
    setFamilyHistory(family);
    setPersonalHistory(habitValues);
    navigate("/review-of-systems");
  };

  return (
    <KioskShell step={4} totalSteps={5}>
      <h1 className="font-display text-2xl text-ink">
        {isHindi ? "पारिवारिक इतिहास" : "Family History"}
      </h1>
      <div className="mt-4 space-y-2.5">
        {kFamilyHistoryOptions.map((opt) => {
          const key = opt.en;
          const value = family[key] ?? false;
          return (
            <div key={key} className="flex items-center justify-between rounded-2xl border border-stone-150 bg-white px-4 py-3">
              <span className="text-base text-ink">{isHindi ? opt.hi : opt.en}</span>
              <button
                role="switch"
                aria-checked={value}
                onClick={() => toggleFamily(key, !value)}
                className={`relative h-7 w-12 rounded-full transition-colors ${value ? "bg-kiosk-500" : "bg-stone-150"}`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    value ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <h2 className="mt-7 font-display text-2xl text-ink">
        {isHindi ? "व्यक्तिगत आदतें" : "Personal History"}
      </h2>
      <div className="mt-4 space-y-3">
        {habits.map((h) => (
          <div key={h.key} className="w-full rounded-2xl border border-stone-150 bg-white p-3.5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{h.icon}</span>
              <span className="text-base font-medium text-ink">{isHindi ? h.hi : h.en}</span>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              <LargeOptionButton
                label={isHindi ? "हां" : "Yes"}
                selected={habitValues[h.key] === "Yes"}
                onTap={() => setHabit(h.key, "Yes")}
              />
              <LargeOptionButton
                label={isHindi ? "नहीं" : "No"}
                selected={habitValues[h.key] === "No"}
                onTap={() => setHabit(h.key, "No")}
              />
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
