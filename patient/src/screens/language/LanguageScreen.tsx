import { useNavigate } from "react-router-dom";
import { Volume2 } from "lucide-react";
import { usePatientStore } from "../../store/usePatientStore";
import { speechService } from "../../services/speechService";
import KioskShell from "../../widgets/KioskShell";

export default function LanguageScreen() {
  const navigate = useNavigate();
  const setLanguage = usePatientStore((s) => s.setLanguage);

  const choose = (lang: "en" | "hi") => {
    setLanguage(lang);
    navigate("/register");
  };

  return (
    <KioskShell>
      <div className="flex flex-col items-center pt-8 text-center">
        <h1 className="font-display text-3xl text-ink">Choose Your Language</h1>
        <div className="mt-8 grid w-full max-w-xs gap-4">
          <button
            onClick={() => choose("hi")}
            className="tap-target flex items-center justify-center gap-3 rounded-kiosk border-2 border-stone-150 bg-white py-6 text-2xl font-semibold text-ink shadow-kiosk hover:border-kiosk-400"
          >
            🇮🇳 हिंदी
          </button>
          <button
            onClick={() => choose("en")}
            className="tap-target flex items-center justify-center gap-3 rounded-kiosk border-2 border-stone-150 bg-white py-6 text-2xl font-semibold text-ink shadow-kiosk hover:border-kiosk-400"
          >
            🇬🇧 English
          </button>
        </div>
        <p className="mt-6 text-sm text-ink/40">More languages coming soon</p>

        <button
          onClick={() => speechService.speak("Please choose your language.", "en")}
          className="mt-8 flex items-center gap-2 text-sm font-medium text-kiosk-600"
        >
          <Volume2 size={16} /> Listen to question
        </button>
      </div>
    </KioskShell>
  );
}
