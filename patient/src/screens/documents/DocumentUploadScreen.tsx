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

  const [pendingCategory, setPendingCategory] =
    useState<DocumentCategory | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const [sheetOpen, setSheetOpen] =
    useState<DocumentCategory | null>(null);

  const openSheet = (category: DocumentCategory) => {
    setPendingCategory(category);
    setSheetOpen(category);
  };

  const handleFile = (
    file: File,
    category: DocumentCategory,
  ) => {
    // Basic validation
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        isHindi
          ? "कृपया केवल PDF या Image अपलोड करें।"
          : "Please upload only a PDF or image.",
      );
      return;
    }

    // 10 MB limit
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        isHindi
          ? "फाइल का आकार 10 MB से कम होना चाहिए।"
          : "File size must be less than 10 MB.",
      );
      return;
    }

    setPreviewFile(file);

    // PDF browser preview is not handled by <img>
    if (file.type === "application/pdf") {
      setPreviewUrl(null);
    } else {
      setPreviewUrl(URL.createObjectURL(file));
    }

    setPendingCategory(category);
    setSheetOpen(null);
  };

  const onFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (file && pendingCategory) {
      handleFile(file, pendingCategory);
    }

    // Allow selecting the same file again
    e.target.value = "";
  };

  const resetPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setPreviewFile(null);
    setPendingCategory(null);
  };

  const useDocument = () => {
    if (!pendingCategory || !previewFile) {
      return;
    }

    const id = `doc-${Date.now()}`;

    /*
     * IMPORTANT:
     * Store the actual File object temporarily.
     *
     * The previous code only stored localFileName,
     * so backend never received the actual document.
     */
    addDocument({
      id,
      category: pendingCategory,
      localFileName: previewFile.name,
      uploadedAt: new Date().toISOString(),
      ocrStatus: "pending",

      // Keep the actual browser File available
      file: previewFile,
    } as any);

    resetPreview();

    navigate(`/ocr-processing/${id}`);
  };

  /*
   * PDF doesn't work with <img>, so show a simple PDF preview.
   */
  const isPdf = previewFile?.type === "application/pdf";

  if (previewFile) {
    return (
      <KioskShell showBack={false}>
        <h1 className="text-center font-display text-2xl text-ink">
          {isHindi
            ? "दस्तावेज़ देखें"
            : "Preview Document"}
        </h1>

        <div className="mt-5 flex min-h-[250px] justify-center overflow-hidden rounded-kiosk border border-stone-150 bg-black/5">
          {isPdf ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <div className="text-5xl">📄</div>

              <p className="mt-3 font-semibold text-ink">
                {previewFile.name}
              </p>

              <p className="mt-1 text-sm text-ink/50">
                PDF Document
              </p>
            </div>
          ) : (
            previewUrl && (
              <img
                src={previewUrl}
                alt="Document preview"
                className="max-h-[50vh] object-contain"
              />
            )
          )}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={resetPreview}
            className="tap-target flex-1 rounded-2xl border-2 border-stone-150 bg-white py-3.5 text-base font-semibold text-ink/70"
          >
            {isHindi ? "फिर से लें" : "Retake"}
          </button>

          <button
            onClick={useDocument}
            className="tap-target flex-1 rounded-2xl bg-kiosk-500 py-3.5 text-base font-semibold text-white"
          >
            {isHindi
              ? "दस्तावेज़ का उपयोग करें"
              : "Use Document"}
          </button>
        </div>
      </KioskShell>
    );
  }

  return (
    <KioskShell step={5} totalSteps={5}>
      <h1 className="font-display text-2xl text-ink">
        {isHindi
          ? "पुराने मेडिकल दस्तावेज़ जोड़ें"
          : "Add Previous Medical Documents"}
      </h1>

      <p className="mt-1 text-sm text-ink/50">
        {isHindi
          ? "यह वैकल्पिक है"
          : "This step is optional"}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3.5">
        {kDocumentCategories.map((c) => (
          <DocumentCard
            key={c.key}
            emoji={c.emoji}
            label={isHindi ? c.hi : c.en}
            onTap={() =>
              openSheet(c.key as DocumentCategory)
            }
          />
        ))}
      </div>

      {documents.length > 0 && (
        <div className="mt-6">
          <p className="font-display text-lg text-ink">
            {isHindi
              ? "जोड़े गए दस्तावेज़"
              : "Added documents"}
          </p>

          <div className="mt-2.5 space-y-2">
            {documents.map((d: any) => (
              <DocumentSummaryTile
                key={d.id}
                title={
                  kDocumentCategories.find(
                    (c) => c.key === d.category,
                  )?.en || d.category
                }
                subtitle={d.localFileName}
                status={
                  d.ocrStatus === "done" ? (
                    <CheckCircle2
                      size={20}
                      className="text-moss-500"
                    />
                  ) : (
                    <Loader2
                      size={20}
                      className="animate-spin text-kiosk-500"
                    />
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
              📷{" "}
              {isHindi
                ? "फोटो लें"
                : "Take Photo"}
            </button>

            <button
              onClick={() => {
                setPendingCategory(sheetOpen);
                fileInputRef.current?.click();
              }}
              className="tap-target flex w-full items-center gap-3 rounded-2xl px-2 py-3.5 text-lg font-medium text-ink hover:bg-stone-150/40"
            >
              📤{" "}
              {isHindi
                ? "PDF/इमेज अपलोड करें"
                : "Upload PDF/Image"}
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={onFileChange}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onFileChange}
      />
    </KioskShell>
  );
}