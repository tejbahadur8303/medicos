import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, HelpCircle } from "lucide-react";
import ProgressIndicator from "./ProgressIndicator";

export default function KioskShell({
  children,
  step,
  totalSteps,
  showBack = true,
}: {
  children: ReactNode;
  step?: number;
  totalSteps?: number;
  showBack?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              aria-label="Back"
              className="tap-target flex items-center justify-center rounded-full text-ink/50 hover:bg-stone-150/60"
            >
              <ChevronLeft size={26} />
            </button>
          ) : (
            <div className="h-14 w-14" />
          )}
          {step !== undefined && totalSteps !== undefined && (
            <div className="flex-1">
              <ProgressIndicator step={step} total={totalSteps} />
            </div>
          )}
          <button
            aria-label="Help"
            className="tap-target flex items-center justify-center rounded-full text-ink/50 hover:bg-stone-150/60"
          >
            <HelpCircle size={24} />
          </button>
        </div>
        <div className="mt-4 flex-1">{children}</div>
      </div>
    </div>
  );
}
