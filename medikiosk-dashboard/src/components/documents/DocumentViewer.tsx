import { FileText } from 'lucide-react';
import type { MedicalDocument } from '../../types/document';
import { Modal } from '../common/Modal';
import { OCRResults } from './OCRResults';
import { formatDate } from '../../utils/formatDate';

export function DocumentViewer({
  document,
  onClose,
}: {
  document: MedicalDocument | null;
  onClose: () => void;
}) {
  if (!document) return null;

  return (
    <Modal open={!!document} onClose={onClose} title={document.title} widthClassName="max-w-4xl">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h4 className="label-eyebrow mb-2">Document</h4>
          <div className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl2 border border-dashed border-border bg-canvas text-ink-faint">
            <FileText size={40} />
            <p className="text-sm">{document.type}</p>
            <p className="text-xs">{formatDate(document.date)}</p>
            <p className="mt-2 max-w-[80%] text-center text-[11px] text-ink-faint">
              Scanned image preview would render here from {document.fileUrl}
            </p>
          </div>
        </div>
        <div>
          <h4 className="label-eyebrow mb-2">Extracted Information</h4>
          <OCRResults data={document.extractedData} />
        </div>
      </div>
    </Modal>
  );
}
