export default function ProgressIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-kiosk-500" : "bg-stone-150"}`}
        />
      ))}
    </div>
  );
}
