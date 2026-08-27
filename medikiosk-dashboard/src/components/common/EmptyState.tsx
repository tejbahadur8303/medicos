import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl2 border border-dashed border-border py-16 text-center">
      <div className="mb-1 text-ink-faint">{icon ?? <Inbox size={28} />}</div>
      <p className="font-display font-semibold text-ink">{title}</p>
      {message && <p className="max-w-sm text-sm text-ink-soft">{message}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
