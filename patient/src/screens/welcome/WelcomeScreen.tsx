import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, ArrowRight, HelpCircle, PlayCircle } from "lucide-react";
import { usePatientStore } from "../../store/usePatientStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { useDocumentStore } from "../../store/useDocumentStore";

// Cycles through how "welcome" is said across languages a patient here
// might speak — doubles as a preview of the language step that's next.
const GREETINGS = ["Namaste", "Welcome", "Vanakkam", "Nomoshkar", "Sat Sri Akal"];

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const setPatient = usePatientStore((s) => s.setPatient);
  const setLanguage = usePatientStore((s) => s.setLanguage);
  const giveConsent = usePatientStore((s) => s.giveConsent);
  const setChiefComplaint = useHistoryStore((s) => s.setChiefComplaint);
  const setAnswer = useHistoryStore((s) => s.setAnswer);
  const addRedFlags = useHistoryStore((s) => s.addRedFlags);
  const addDocument = useDocumentStore((s) => s.addDocument);

  const [mounted, setMounted] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [now, setNow] = useState(new Date());

  // One entrance moment on load — nothing else in the screen animates on its own.
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(
      () => setGreetingIndex((i) => (i + 1) % GREETINGS.length),
      2200
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

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

  const timeLabel = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-paper px-6 text-center">
      {/* Faint ECG-style line grounding the screen in a clinical setting,
          not just decoration — sits low and quiet behind the content. */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-24 h-24 w-full text-kiosk-500/10"
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 30 H140 L155 30 L165 8 L178 52 L190 30 L205 30 H400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      </svg>

      {/* Device status row — reads as a real kiosk, not a webpage */}
      <div className="absolute top-6 flex items-center gap-2 text-xs font-medium text-ink/40">
        <span className="h-1.5 w-1.5 rounded-full bg-kiosk-500" />
        <span>Reception kiosk · {timeLabel}</span>
      </div>

      <div
        className={`flex flex-col items-center transition-all duration-700 ease-out ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-kiosk-500 shadow-raised">
          <span className="absolute inset-0 rounded-[1.75rem] bg-kiosk-500 animate-ping opacity-20" />
          <Stethoscope size={34} className="relative text-white" />
        </div>

        <p
          key={greetingIndex}
          className="mt-5 h-6 text-base font-medium text-kiosk-600 transition-opacity duration-500"
        >
          {GREETINGS[greetingIndex]}
        </p>

        <h1 className="mt-1 font-display text-4xl text-ink">MediKiosk</h1>
        <p className="mt-2 max-w-xs text-base text-ink/60">
          Your history, in your words — ready before the doctor calls you in.
        </p>
      </div>

      <div
        className={`mt-10 flex w-full max-w-xs flex-col items-center transition-all delay-150 duration-700 ease-out ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <button
          onClick={() => navigate("/language")}
          className="tap-target flex w-full items-center justify-center gap-2 rounded-2xl bg-kiosk-500 py-4 text-xl font-bold text-white shadow-raised hover:bg-kiosk-600"
        >
          Start
          <ArrowRight size={22} />
        </button>

        <button className="tap-target mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-stone-150 bg-white py-3.5 text-lg font-semibold text-ink/70">
          <HelpCircle size={18} />
          Help
        </button>
      </div>

      {/* Discreet demo affordance — deliberately out of the patient's way */}
      <button
        onClick={startDemo}
        className="absolute bottom-5 right-5 flex items-center gap-1.5 rounded-full border border-stone-150 bg-white/80 px-3 py-1.5 text-xs font-medium text-ink/40 hover:text-kiosk-600"
      >
        <PlayCircle size={13} />
        Demo
      </button>
    </div>
  );
}