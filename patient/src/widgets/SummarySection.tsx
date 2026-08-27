import type { ReactNode } from "react";
import { Pencil } from "lucide-react";

export default function SummarySection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-stone-150 py-4 last:border-0">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wide text-ink/50">{title}</p>
        {onEdit && (
          <button onClick={onEdit} className="flex items-center gap-1 text-sm font-medium text-kiosk-600">
            <Pencil size={13} /> Edit
          </button>
        )}
      </div>
      <div className="mt-1.5 text-base text-ink/90">{children}</div>
    </div>
  );
}
