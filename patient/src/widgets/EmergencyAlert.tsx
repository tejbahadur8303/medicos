import { AlertTriangle } from "lucide-react";

export default function EmergencyAlert({
  title,
  message,
  buttonLabel,
  onAlert,
}: {
  title: string;
  message: string;
  buttonLabel: string;
  onAlert: () => void;
}) {
  return (
    <div className="rounded-kiosk border-2 border-crimson-500 bg-crimson-50 p-5">
      <div className="flex items-center gap-2 text-crimson-600">
        <AlertTriangle size={24} />
        <p className="font-display text-xl">{title}</p>
      </div>
      <p className="mt-2 text-base text-ink/80">{message}</p>
      <button
        onClick={onAlert}
        className="tap-target mt-4 w-full rounded-2xl bg-crimson-500 py-3.5 text-lg font-semibold text-white hover:bg-crimson-600"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
