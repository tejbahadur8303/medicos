import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { usePatients } from '../../hooks/usePatients';
import { NotificationPanel } from '../dashboard/NotificationPanel';

export function Topbar() {
  const { doctor } = useAppStore();
  const { patients } = usePatients();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const results = query.trim()
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.token.toLowerCase().includes(query.toLowerCase()) ||
          p.id.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-6">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={17} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
          placeholder="Search by name, token, or patient ID"
          className="input pl-9"
        />
        {showResults && results.length > 0 && (
          <div className="absolute left-0 right-0 top-11 z-40 max-h-72 overflow-auto rounded-xl2 border border-border bg-surface shadow-popover">
            {results.map((p) => (
              <button
                key={p.id}
                onMouseDown={() => navigate(`/patients/${p.id}`)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-canvas"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{p.name}</p>
                  <p className="text-xs text-ink-soft">
                    {p.age} yrs • {p.chiefComplaint}
                  </p>
                </div>
                <span className="font-mono text-xs text-ink-faint">{p.token}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowNotifications((s) => !s)}
            className="relative rounded-lg p-2.5 text-ink-soft hover:bg-canvas"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" />
          </button>
          {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
        </div>

        <div className="h-8 w-px bg-border" />

        <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-canvas">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-light text-sm font-semibold text-accent">
            {doctor.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-ink">{doctor.name}</p>
            <p className="text-xs text-ink-soft">{doctor.department}</p>
          </div>
          <ChevronDown size={16} className="text-ink-faint" />
        </button>

        <button className="rounded-lg p-2.5 text-ink-soft hover:bg-canvas" aria-label="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
