import clsx from "clsx";
import type { ReactNode } from "react";

export default function LargeOptionButton({
  label,
  selected,
  onTap,
  icon,
}: {
  label: string;
  selected: boolean;
  onTap: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      onClick={onTap}
      className={clsx(
        "tap-target flex w-full items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3.5 text-lg font-semibold transition-colors",
        selected
          ? "border-kiosk-500 bg-kiosk-500 text-white shadow-kiosk"
          : "border-stone-150 bg-white text-ink hover:border-kiosk-400"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
