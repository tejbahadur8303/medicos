import type { ReactNode } from 'react';

interface HistorySectionProps {
  title: string;
  children: ReactNode;
}

export function HistorySection({ title, children }: HistorySectionProps) {
  return (
    <div className="border-b border-border py-4 last:border-0">
      <h3 className="label-eyebrow mb-2">{title}</h3>
      <div className="text-sm text-ink">{children}</div>
    </div>
  );
}

export function BulletList({ items, emptyLabel = 'None reported' }: { items: string[]; emptyLabel?: string }) {
  if (items.length === 0) {
    return <p className="text-ink-soft">{emptyLabel}</p>;
  }
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
          {item}
        </li>
      ))}
    </ul>
  );
}
