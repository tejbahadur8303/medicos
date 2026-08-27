import { Mic, MicOff } from "lucide-react";
import clsx from "clsx";

export default function VoiceButton({
  listening,
  onClick,
  supported,
  label,
}: {
  listening: boolean;
  onClick: () => void;
  supported: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={onClick}
        disabled={!supported}
        aria-label={label}
        className={clsx(
          "relative flex h-28 w-28 items-center justify-center rounded-full shadow-raised transition-colors disabled:opacity-40",
          listening ? "bg-crimson-500" : "bg-kiosk-500 hover:bg-kiosk-600"
        )}
      >
        {listening && (
          <span className="absolute inset-0 rounded-full bg-crimson-500 animate-pulse-ring" />
        )}
        {supported ? (
          <Mic size={44} className="relative text-white" strokeWidth={2} />
        ) : (
          <MicOff size={40} className="relative text-white" strokeWidth={2} />
        )}
      </button>
      <p className="text-center text-base font-medium text-ink/80">{label}</p>
    </div>
  );
}
