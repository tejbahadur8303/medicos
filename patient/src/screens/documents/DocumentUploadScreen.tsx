import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../../store/usePatientStore";
import { useDocumentStore } from "../../store/useDocumentStore";
import { kDocumentCategories } from "../../utils/constants";
import KioskShell from "../../widgets/KioskShell";
import DocumentCard from "../../widgets/DocumentCard";
import { DocumentSummaryTile } from "../../widgets/DocumentCard";
import type { DocumentCategory } from "../../types/document";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function DocumentUploadScreen() {
  const navigate = useNavigate();
  const patient = usePatientStore((s) => s.patient);
  const isHindi = patient.language === "hi";
  const { documents, addDocument } = useDocumentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [pendingCategory, setPendingCategory] = useState<DocumentCategory | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [sheetOpen, setSheetOpen] = useState<DocumentCategory | null>(null);

  const openSheet = (category: DocumentCategory) => setSheetOpen(category);

  const handleFile = (file: File, category: DocumentCategory) => {
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPendingCategory(category);
    setSheetOpen(null);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pendingCategory !== null) handleFile(file, pendingCategory);
    e.target.value = "";
  };

  const useDocument = () => {
    if (!pendingCategory || !previewFile) return;
    const id = `doc-${Date.now()}`;
    addDocument({
      id,
      category: pendingCategory,
      localFileName: previewFile.name,
      uploadedAt: new Date().toISOString(),
      ocrStatus: "pending",
    });
    setPreviewUrl(null);
    setPreviewFile(null);
    setPendingCategory(null);
    navigate(`/ocr-processing/${id}`);
  };

  if (previewUrl) {
    return (
      <KioskShell showBack={false}>
        <h1 className="text-center font-display text-2xl text-ink">
          {isHindi ? "दस्तावेज़ देखें" : "Preview Document"}
        </h1>
        <div className="mt-5 flex justify-center overflow-hidden rounded-kiosk border border-stone-150 bg-black/5">
          <img src={previewUrl} alt="Document preview" className="max-h-[50vh] object-contain" />
        </div>
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => {
              setPreviewUrl(null);
              setPreviewFile(null);
              setPendingCategory(null);
            }}
            className="tap-target flex-1 rounded-2xl border-2 border-stone-150 bg-white py-3.5 text-base font-semibold text-ink/70"
          >
            {isHindi ? "फिर से लें" : "Retake"}
          </button>
          <button
            onClick={useDocument}
            className="tap-target flex-1 rounded-2xl bg-kiosk-500 py-3.5 text-base font-semibold text-white"
          >
            {isHindi ? "दस्तावेज़ का उपयोग करें" : "Use Document"}
          </button>
        </div>
      </KioskShell>
    );
  }

  return (
    <KioskShell step={5} totalSteps={5}>
      <h1 className="font-display text-2xl text-ink">
        {isHindi ? "पुराने मेडिकल दस्तावेज़ जोड़ें" : "Add Previous Medical Documents"}
      </h1>
      <p className="mt-1 text-sm text-ink/50">{isHindi ? "यह वैकल्पिक है" : "This step is optional"}</p>

      <div className="mt-5 grid grid-cols-2 gap-3.5">
        {kDocumentCategories.map((c) => (
          <DocumentCard
            key={c.key}
            emoji={c.emoji}
            label={isHindi ? c.hi : c.en}
            onTap={() => openSheet(c.key as DocumentCategory)}
          />
        ))}
      </div>

      {documents.length > 0 && (
        <div className="mt-6">
          <p className="font-display text-lg text-ink">{isHindi ? "जोड़े गए दस्तावेज़" : "Added documents"}</p>
          <div className="mt-2.5 space-y-2">
            {documents.map((d) => (
              <DocumentSummaryTile
                key={d.id}
                title={kDocumentCategories.find((c) => c.key === d.category)?.en || d.category}
                subtitle={d.localFileName}
                status={
                  d.ocrStatus === "done" ? (
                    <CheckCircle2 size={20} className="text-moss-500" />
                  ) : (
                    <Loader2 size={20} className="animate-spin text-kiosk-500" />
                  )
                }
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate("/timeline")}
        className="tap-target mt-7 w-full rounded-2xl bg-kiosk-500 py-4 text-lg font-bold text-white shadow-raised"
      >
        {isHindi ? "आगे बढ़ें" : "Continue"}
      </button>
      <button
        onClick={() => navigate("/timeline")}
        className="tap-target mt-2 w-full py-2.5 text-base font-semibold text-ink/50"
      >
        {isHindi ? "छोड़ें" : "Skip for now"}
      </button>

      {sheetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-ink/40"
          onClick={() => setSheetOpen(null)}
        >
          <div
            className="w-full rounded-t-kiosk bg-white p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-stone-150" />
            <button
              onClick={() => {
                setPendingCategory(sheetOpen);
                cameraInputRef.current?.click();
              }}
              className="tap-target flex w-full items-center gap-3 rounded-2xl px-2 py-3.5 text-lg font-medium text-ink hover:bg-stone-150/40"
            >
              📷 {isHindi ? "फोटो लें" : "Take Photo"}
            </button>
            <button
              onClick={() => {
                setPendingCategory(sheetOpen);
                fileInputRef.current?.click();
              }}
              className="tap-target flex w-full items-center gap-3 rounded-2xl px-2 py-3.5 text-lg font-medium text-ink hover:bg-stone-150/40"
            >
              📤 {isHindi ? "PDF/इमेज अपलोड करें" : "Upload PDF/Image"}
            </button>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={onFileChange} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileChange} />
    </KioskShell>
  );
}
