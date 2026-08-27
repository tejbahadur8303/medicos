import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../store/usePatientStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { getQuestionFlow } from "../../services/historyService";
import { evaluateRedFlags } from "../../services/redFlagService";
import { speechService } from "../../services/speechService";
import KioskShell from "../../widgets/KioskShell";
import QuestionCard from "../../widgets/QuestionCard";
import LargeOptionButton from "../../widgets/LargeOptionButton";
import EmergencyAlert from "../../widgets/EmergencyAlert";
import VoiceButton from "../../widgets/VoiceButton";

export default function AiHistoryScreen() {
  const navigate = useNavigate();
  const patient = usePatientStore((s) => s.patient);
  const isHindi = patient.language === "hi";
  const { chiefComplaint, answers, setAnswer, addRedFlags } = useHistoryStore();

  const questions = useMemo(() => getQuestionFlow(chiefComplaint || "other"), [chiefComplaint]);
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [voiceDraft, setVoiceDraft] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const question = questions[index];

  useEffect(() => {
    if (!question) return;
    const flags = evaluateRedFlags([question], answers);
    if (flags.length > 0) {
      addRedFlags(flags);
      setShowAlert(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  if (!question) {
    return (
      <KioskShell step={4} totalSteps={5}>
        <div className="flex flex-col items-center pt-10 text-center">
          <h1 className="font-display text-2xl text-ink">
            {isHindi ? "बहुत बढ़िया, हो गया!" : "Great, that's everything!"}
          </h1>
          <button
            onClick={() => navigate("/medication")}
            className="tap-target mt-8 w-full max-w-xs rounded-2xl bg-kiosk-500 py-4 text-lg font-bold text-white shadow-raised"
          >
            {isHindi ? "आगे बढ़ें" : "Continue"}
          </button>
        </div>
      </KioskShell>
    );
  }

  const answerAndAdvance = (value: string) => {
    setAnswer(question.id, value);
    setVoiceDraft("");
    setIndex((i) => i + 1);
  };

  const toggleVoice = () => {
    if (listening) {
      speechService.stopListening();
      setListening(false);
      return;
    }
    setListening(true);
    speechService.startListening(patient.language, (text, isFinal) => {
      setVoiceDraft(text);
      if (isFinal) setListening(false);
    });
  };

  return (
    <KioskShell step={4} totalSteps={5}>
      {showAlert && (
        <div className="mb-4">
          <EmergencyAlert
            title={isHindi ? "🚨 प्राथमिकता चेतावनी" : "🚨 PRIORITY ALERT"}
            message={
              isHindi
                ? "आपके उत्तर बताते हैं कि आपको तत्काल चिकित्सा ध्यान की आवश्यकता हो सकती है।"
                : "Your answers indicate symptoms that may require urgent medical attention."
            }
            buttonLabel={isHindi ? "अस्पताल स्टाफ को सूचित करें" : "Alert Hospital Staff"}
            onAlert={() => setShowAlert(false)}
          />
        </div>
      )}

      <p className="text-sm font-medium text-kiosk-600">
        {question.category} · {index + 1}/{questions.length}
      </p>

      <div className="mt-2">
        <QuestionCard
          question={isHindi ? question.hindiQuestion : question.question}
          onHear={() => speechService.speak(isHindi ? question.hindiQuestion : question.question, patient.language)}
        >
          {question.type === "yesNo" && (
            <div className="grid grid-cols-2 gap-3">
              <LargeOptionButton label={isHindi ? "हां" : "Yes"} selected={false} onTap={() => answerAndAdvance("yes")} />
              <LargeOptionButton label={isHindi ? "नहीं" : "No"} selected={false} onTap={() => answerAndAdvance("no")} />
            </div>
          )}

          {question.type === "singleChoice" && question.options && (
            <div className="grid gap-2.5">
              {question.options.map((opt) => (
                <LargeOptionButton
                  key={opt.value}
                  label={isHindi ? opt.hi : opt.en}
                  selected={answers[question.id] === opt.value}
                  onTap={() => answerAndAdvance(opt.value)}
                />
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-col items-center gap-3 border-t border-stone-150 pt-5">
            <VoiceButton
              listening={listening}
              onClick={toggleVoice}
              supported={speechService.isSupported()}
              label={isHindi ? "🎤 बोलें" : "🎤 Speak"}
            />
            {voiceDraft && (
              <div className="w-full rounded-2xl border border-stone-150 bg-kiosk-50 p-3 text-center">
                <p className="text-base text-ink">"{voiceDraft}"</p>
                <button
                  onClick={() => answerAndAdvance(voiceDraft)}
                  className="tap-target mt-2 w-full rounded-xl bg-kiosk-500 py-2 text-sm font-semibold text-white"
                >
                  ✓ {isHindi ? "पुष्टि करें" : "Confirm"}
                </button>
              </div>
            )}
          </div>
        </QuestionCard>
      </div>
    </KioskShell>
  );
}
