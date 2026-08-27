import { useNavigate } from 'react-router-dom';
import { AlertOctagon, Info, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { formatTime } from '../../utils/formatDate';

const levelIcon = {
  priority: AlertOctagon,
  info: Info,
  warning: AlertTriangle,
};

const levelColor = {
  priority: 'text-danger',
  info: 'text-accent',
  warning: 'text-warning',
};

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markNotificationRead } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="absolute right-0 top-12 z-40 w-80 rounded-xl2 border border-border bg-surface shadow-popover">
      <div className="border-b border-border px-4 py-3">
        <p className="font-display text-sm font-semibold text-ink">Notifications</p>
      </div>
      <div className="max-h-80 overflow-auto">
        {notifications.map((n) => {
          const Icon = levelIcon[n.level];
          return (
            <button
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.patientId) navigate(`/patients/${n.patientId}`);
                onClose();
              }}
              className={`flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left last:border-0 hover:bg-canvas ${
                n.read ? 'opacity-60' : ''
              }`}
            >
              <Icon size={17} className={`mt-0.5 shrink-0 ${levelColor[n.level]}`} />
              <div>
                <p className="text-sm font-medium text-ink">{n.title}</p>
                <p className="text-xs text-ink-soft">{n.message}</p>
                <p className="mt-1 text-[11px] text-ink-faint">{formatTime(n.createdAt)}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
