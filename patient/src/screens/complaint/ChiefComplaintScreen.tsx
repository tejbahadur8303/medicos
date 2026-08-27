import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../store/usePatientStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { speechService } from "../../services/speechService";
import { kChiefComplaints } from "../../utils/constants";
import KioskShell from "../../widgets/KioskShell";
import VoiceButton from "../../widgets/VoiceButton";

export default function ChiefComplaintScreen() {
  const navigate = useNavigate();
  const patient = usePatientStore((s) => s.patient);
  const setChiefComplaint = useHistoryStore((s) => s.setChiefComplaint);
  const isHindi = patient.language === "hi";

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const supported = speechService.isSupported();

  const toggleListening = () => {
    if (listening) {
      speechService.stopListening();
      setListening(false);
      return;
    }
    setTranscript("");
    setListening(true);
    speechService.startListening(patient.language, (text, isFinal) => {
      setTranscript(text);
      if (isFinal) setListening(false);
    });
  };

  const guessComplaintFromTranscript = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes("chest") || lower.includes("सीने") || lower.includes("seene")) return "chest_pain";
    if (lower.includes("fever") || lower.includes("बुखार") || lower.includes("bukhar")) return "fever";
    if (lower.includes("cough") || lower.includes("खांसी") || lower.includes("khansi")) return "cough";
    if (lower.includes("breath") || lower.includes("सांस") || lower.includes("saans")) return "breathing";
    return "other";
  };

  const confirmVoice = () => {
    const guessed = guessComplaintFromTranscript(transcript);
    setChiefComplaint(guessed, transcript);
    navigate("/history");
  };

  const chooseTapped = (value: string) => {
    setSelected(value);
    setChiefComplaint(value);
    navigate("/history");
  };

  return (
    <KioskShell step={3} totalSteps={5}>
      <h1 className="text-center font-display text-2xl text-ink">
        {isHindi ? "आज आप अस्पताल क्यों आए हैं?" : "What brings you to the hospital today?"}
      </h1>

      <div className="mt-6 flex justify-center">
        <VoiceButton
          listening={listening}
          onClick={toggleListening}
          supported={supported}
          label={
            !supported
              ? isHindi
                ? "इस डिवाइस पर आवाज़ उपलब्ध नहीं है"
                : "Voice isn't available on this device"
              : listening
              ? isHindi
                ? "सुन रहे हैं..."
                : "Listening…"
              : isHindi
              ? "बोलने के लिए दबाएं"
              : "Tap to Speak"
          }
        />
      </div>

      {transcript && (
        <div className="mt-5 rounded-kiosk border border-stone-150 bg-white p-4">
          <p className="text-sm font-medium text-ink/50">{isHindi ? "आपने कहा:" : "You said:"}</p>
          <p className="mt-1 text-lg text-ink">"{transcript}"</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={confirmVoice}
              className="tap-target flex-1 rounded-2xl bg-kiosk-500 py-2.5 text-base font-semibold text-white"
            >
              ✓ {isHindi ? "पुष्टि करें" : "Confirm"}
            </button>
            <button
              onClick={() => setTranscript("")}
              className="tap-target flex-1 rounded-2xl border-2 border-stone-150 py-2.5 text-base font-semibold text-ink/70"
            >
              🎤 {isHindi ? "फिर बोलें" : "Speak Again"}
            </button>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-sm font-medium text-ink/50">
        {isHindi ? "या चुनें" : "Or choose one"}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {kChiefComplaints.map((c) => (
          <button
            key={c.value}
            onClick={() => chooseTapped(c.value)}
            className={`tap-target flex flex-col items-center gap-1.5 rounded-2xl border-2 py-4 text-base font-semibold ${
              selected === c.value ? "border-kiosk-500 bg-kiosk-500 text-white" : "border-stone-150 bg-white text-ink"
            }`}
          >
            <span className="text-2xl">{c.emoji}</span>
            {isHindi ? c.hi : c.en}
          </button>
        ))}
      </div>
    </KioskShell>
  );
}
