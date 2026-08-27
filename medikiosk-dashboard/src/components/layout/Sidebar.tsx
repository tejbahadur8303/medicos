import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListOrdered,
  AlertOctagon,
  Users,
  FileText,
  History,
  Settings,
  Stethoscope,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/queue', label: 'Patient Queue', icon: ListOrdered },
  { to: '/priority', label: 'Priority Patients', icon: AlertOctagon },
  { to: '/patients', label: 'All Patients', icon: Users },
  { to: '/documents', label: 'Medical Documents', icon: FileText },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex items-center gap-2.5 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
          <Stethoscope size={20} />
        </div>
        <div>
          <p className="font-display text-base font-semibold text-ink">MediKiosk</p>
          <p className="text-[11px] text-ink-faint">Doctor Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-light text-primary-dark'
                  : 'text-ink-soft hover:bg-canvas hover:text-ink',
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-4">
        <p className="label-eyebrow">Collect → Structure → Flag</p>
        <p className="mt-1 text-xs text-ink-soft">The doctor reviews, edits, verifies, and diagnoses.</p>
      </div>
    </aside>
  );
}
