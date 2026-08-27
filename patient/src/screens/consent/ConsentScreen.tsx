import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, ShieldCheck } from "lucide-react";
import { usePatientStore } from "../../store/usePatientStore";
import { speechService } from "../../services/speechService";
import KioskShell from "../../widgets/KioskShell";

export default function ConsentScreen() {
  const navigate = useNavigate();
  const { patient, giveConsent } = usePatientStore();
  const isHindi = patient.language === "hi";
  const [checked, setChecked] = useState(false);
  const [declined, setDeclined] = useState(false);

  const consentText = isHindi
    ? "हम आपकी दी गई जानकारी का उपयोग डॉक्टर के लिए आपका मेडिकल इतिहास तैयार करने के लिए करेंगे।"
    : "We will use the information you provide to prepare your medical history for the doctor.";

  if (declined) {
    return (
      <KioskShell showBack={false}>
        <div className="flex flex-col items-center pt-16 text-center">
          <h1 className="font-display text-2xl text-ink">
            {isHindi ? "ठीक है, हम समझते हैं" : "That's okay — we understand"}
          </h1>
          <p className="mt-3 max-w-xs text-base text-ink/70">
            {isHindi
              ? "आपकी जानकारी डिजिटल रूप से एकत्र नहीं की जाएगी। कृपया रिसेप्शन डेस्क पर जाएं।"
              : "Your information will not be collected digitally. Please proceed to the reception desk for assistance."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="tap-target mt-8 rounded-2xl bg-kiosk-500 px-8 py-3.5 text-lg font-semibold text-white"
          >
            {isHindi ? "वापस जाएं" : "Return to start"}
          </button>
        </div>
      </KioskShell>
    );
  }

  return (
    <KioskShell step={2} totalSteps={5}>
      <div className="flex items-center gap-2">
        <ShieldCheck size={26} className="text-kiosk-500" />
        <h1 className="font-display text-2xl text-ink">
          {isHindi ? "आपकी गोपनीयता मायने रखती है" : "Your Privacy Matters"}
        </h1>
      </div>

      <p className="mt-4 text-base text-ink/80">{consentText}</p>

      <div className="mt-5 space-y-3 rounded-kiosk border border-stone-150 bg-white p-4">
        <div>
          <p className="text-sm font-semibold text-ink/50">{isHindi ? "क्या एकत्र किया जाता है" : "What data is collected"}</p>
          <p className="text-sm text-ink/80">
            {isHindi
              ? "आपका नाम, उम्र, लक्षण, पुरानी बीमारियां, दवाइयां और अपलोड किए गए दस्तावेज़।"
              : "Your name, age, symptoms, past conditions, medications, and any documents you upload."}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink/50">{isHindi ? "किसके पास पहुंच है" : "Who can see it"}</p>
          <p className="text-sm text-ink/80">
            {isHindi ? "केवल आपके इलाज करने वाले डॉक्टर और अधिकृत क्लिनिकल स्टाफ।" : "Only the doctor treating you and authorized clinical staff."}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink/50">{isHindi ? "इसका उपयोग कैसे होता है" : "How it is used"}</p>
          <p className="text-sm text-ink/80">
            {isHindi
              ? "डॉक्टर के परामर्श के लिए एक सारांश तैयार करने के लिए — निदान के लिए नहीं।"
              : "To prepare a summary for your doctor's consultation — never to make a diagnosis on its own."}
          </p>
        </div>
      </div>

      <button
        onClick={() => speechService.speak(consentText, patient.language)}
        className="mt-4 flex items-center gap-2 text-sm font-medium text-kiosk-600"
      >
        <Volume2 size={16} /> {isHindi ? "सहमति सुनें" : "Listen to consent"}
      </button>

      <label className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-stone-150 bg-white p-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="h-6 w-6 accent-kiosk-500"
        />
        <span className="text-base text-ink">
          {isHindi ? "मैं समझता/समझती हूं और सहमत हूं" : "I understand and agree"}
        </span>
      </label>

      <button
        disabled={!checked}
        onClick={() => {
          giveConsent();
          navigate("/complaint");
        }}
        className="tap-target mt-5 w-full rounded-2xl bg-kiosk-500 py-4 text-lg font-bold text-white shadow-raised disabled:opacity-40"
      >
        {isHindi ? "सहमति दें और आगे बढ़ें" : "Give Consent & Continue"}
      </button>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate(-1)}
          className="tap-target rounded-2xl border-2 border-stone-150 bg-white py-3 text-base font-semibold text-ink/70"
        >
          {isHindi ? "वापस" : "Back"}
        </button>
        <button
          onClick={() => setDeclined(true)}
          className="tap-target rounded-2xl border-2 border-crimson-500 bg-white py-3 text-base font-semibold text-crimson-600"
        >
          {isHindi ? "अस्वीकार करें" : "Decline"}
        </button>
      </div>
    </KioskShell>
  );
}
