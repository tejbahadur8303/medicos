import { CheckCircle2, FileText, UserPlus } from 'lucide-react';
import { formatTime } from '../../utils/formatDate';

interface ActivityItem {
  id: string;
  icon: 'completed' | 'document' | 'new';
  text: string;
  time: string;
}

const activity: ActivityItem[] = [
  { id: 'a1', icon: 'new', text: 'Rahul Kumar checked in via kiosk — chest pain reported', time: '2026-08-22T08:10:00+05:30' },
  { id: 'a2', icon: 'document', text: "Rahul Kumar's blood report processed — glucose flagged", time: '2026-08-22T08:13:00+05:30' },
  { id: 'a3', icon: 'new', text: 'Priya Sharma completed history intake', time: '2026-08-22T08:24:00+05:30' },
  { id: 'a4', icon: 'completed', text: "Vikram Rao's consultation completed by Dr. Sharma", time: '2026-08-22T07:58:00+05:30' },
];

const iconMap = { completed: CheckCircle2, document: FileText, new: UserPlus };
const colorMap = { completed: 'text-success', document: 'text-accent', new: 'text-primary' };

export function RecentActivity() {
  return (
    <div className="card p-5">
      <h2 className="mb-4 font-display text-lg font-semibold text-ink">Recent Activity</h2>
      <ul className="space-y-4">
        {activity.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <li key={item.id} className="flex items-start gap-3">
              <Icon size={16} className={`mt-0.5 shrink-0 ${colorMap[item.icon]}`} />
              <div>
                <p className="text-sm text-ink">{item.text}</p>
                <p className="text-xs text-ink-faint">{formatTime(item.time)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
