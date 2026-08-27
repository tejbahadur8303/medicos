import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../store/usePatientStore";
import { useDocumentStore } from "../../store/useDocumentStore";
import { kDocumentCategories } from "../../utils/constants";
import KioskShell from "../../widgets/KioskShell";

export default function MedicalTimelineScreen() {
  const navigate = useNavigate();
  const patient = usePatientStore((s) => s.patient);
  const isHindi = patient.language === "hi";
  const { documents } = useDocumentStore();

  const sorted = [...documents].sort(
    (a, b) => new Date(a.ocrResult?.date || a.uploadedAt).getTime() - new Date(b.ocrResult?.date || b.uploadedAt).getTime()
  );

  return (
    <KioskShell step={5} totalSteps={5}>
      <h1 className="font-display text-2xl text-ink">
        {isHindi ? "मेडिकल इतिहास समयरेखा" : "Medical History Timeline"}
      </h1>

      {sorted.length === 0 ? (
        <p className="mt-6 text-base text-ink/50">
          {isHindi ? "कोई दस्तावेज़ नहीं जोड़ा गया।" : "No documents were added."}
        </p>
      ) : (
        <div className="mt-5 rounded-kiosk border border-stone-150 bg-white p-5">
          {sorted.map((d, i) => {
            const category = kDocumentCategories.find((c) => c.key === d.category);
            const date = d.ocrResult?.date || d.uploadedAt.slice(0, 10);
            return (
              <div key={d.id} className="relative flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="h-3 w-3 rounded-full bg-kiosk-500 ring-4 ring-kiosk-50" />
                  {i < sorted.length - 1 && <span className="mt-1 w-px flex-1 bg-stone-150" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink/50">{date}</p>
                  <p className="font-display text-lg text-ink">{isHindi ? category?.hi : category?.en}</p>
                  {d.ocrResult && d.ocrResult.labValues.length > 0 && (
                    <p className="text-sm text-ink/70">
                      {d.ocrResult.labValues.map((v) => `${v.name}: ${v.value} ${v.unit}`).join(", ")}
                    </p>
                  )}
                  {d.ocrResult && d.ocrResult.medications.length > 0 && (
                    <p className="text-sm text-ink/70">{d.ocrResult.medications.join(", ")}</p>
                  )}
                </div>
              </div>
            );
          })}
          <div className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <span className="h-3 w-3 rounded-full bg-marigold-500 ring-4 ring-marigold-50" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink/50">{new Date().toISOString().slice(0, 10)}</p>
              <p className="font-display text-lg text-ink">{isHindi ? "वर्तमान ओपीडी विज़िट" : "Current OPD Visit"}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate("/summary")}
        className="tap-target mt-7 w-full rounded-2xl bg-kiosk-500 py-4 text-lg font-bold text-white shadow-raised"
      >
        {isHindi ? "आगे बढ़ें" : "Continue"}
      </button>
    </KioskShell>
  );
}
