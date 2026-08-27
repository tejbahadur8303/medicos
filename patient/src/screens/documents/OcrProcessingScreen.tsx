import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePatientStore } from "../../store/usePatientStore";
import { useDocumentStore } from "../../store/useDocumentStore";
import { runOCR } from "../../services/ocrService";
import { Loader2, CheckCircle2 } from "lucide-react";

const stagesEn = ["Reading your document…", "Extracting medical information…", "Organizing your medical history…"];
const stagesHi = ["आपका दस्तावेज़ पढ़ा जा रहा है…", "चिकित्सा जानकारी निकाली जा रही है…", "आपका मेडिकल इतिहास व्यवस्थित किया जा रहा है…"];

export default function OcrProcessingScreen() {
  const navigate = useNavigate();
  const { docId } = useParams();
  const patient = usePatientStore((s) => s.patient);
  const isHindi = patient.language === "hi";
  const { documents, updateDocument } = useDocumentStore();
  const doc = documents.find((d) => d.id === docId);
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!doc) return;
    updateDocument(doc.id, { ocrStatus: "processing" });

    const stageTimer = setInterval(() => {
      setStage((s) => Math.min(s + 1, stagesEn.length - 1));
    }, 700);

    runOCR(doc.category).then((result) => {
      updateDocument(doc.id, { ocrStatus: "done", ocrResult: result });
      setDone(true);
      clearInterval(stageTimer);
    });

    return () => clearInterval(stageTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?.id]);

  if (!doc) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-kiosk-50">
        {done ? (
          <CheckCircle2 size={44} className="text-moss-500" />
        ) : (
          <Loader2 size={40} className="animate-spin text-kiosk-500" />
        )}
      </div>
      <p className="mt-6 font-display text-xl text-ink">
        {done ? (isHindi ? "हो गया!" : "Done!") : (isHindi ? stagesHi[stage] : stagesEn[stage])}
      </p>

      {done && (
        <button
          onClick={() => navigate("/documents")}
          className="tap-target mt-8 w-full max-w-xs rounded-2xl bg-kiosk-500 py-4 text-lg font-bold text-white shadow-raised"
        >
          {isHindi ? "आगे बढ़ें" : "Continue"}
        </button>
      )}
    </div>
  );
}
