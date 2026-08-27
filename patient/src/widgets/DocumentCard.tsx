import type { ReactNode } from "react";

export default function DocumentCard({
  emoji,
  label,
  onTap,
}: {
  emoji: string;
  label: string;
  onTap: () => void;
}) {
  return (
    <button
      onClick={onTap}
      className="flex flex-col items-center justify-center gap-3 rounded-kiosk border border-stone-150 bg-white px-3 py-6 shadow-kiosk transition-transform hover:-translate-y-0.5"
    >
      <span className="text-4xl">{emoji}</span>
      <span className="text-center text-lg font-semibold leading-tight text-ink">{label}</span>
    </button>
  );
}

export function DocumentSummaryTile({ title, subtitle, status }: { title: string; subtitle: string; status: ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-stone-150 bg-white px-4 py-3">
      <div>
        <p className="font-medium text-ink">{title}</p>
        <p className="text-sm text-ink/50">{subtitle}</p>
      </div>
      {status}
    </div>
  );
}
