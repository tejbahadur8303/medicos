import type { ReactNode } from "react";
import { Volume2 } from "lucide-react";

export default function QuestionCard({
  question,
  onHear,
  children,
}: {
  question: string;
  onHear: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-kiosk border border-stone-150 bg-white p-6 shadow-kiosk">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-display text-2xl leading-snug text-ink">{question}</h2>
        <button
          onClick={onHear}
          aria-label="Hear question"
          className="tap-target flex shrink-0 items-center justify-center rounded-full bg-kiosk-50 text-kiosk-600 hover:bg-kiosk-100"
        >
          <Volume2 size={22} />
        </button>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
