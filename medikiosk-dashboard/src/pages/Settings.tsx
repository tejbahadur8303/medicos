import { useAppStore } from '../hooks/useAppStore';
import { useDemoStore } from '../hooks/useDemoStore';
import { backendUnavailable } from '../services/api';

export function Settings() {
  const { doctor } = useAppStore();
  const { demoMode, toggleDemoMode } = useDemoStore();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink-soft">Profile, data source, and display preferences.</p>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Doctor Profile</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-light text-lg font-semibold text-accent">
            {doctor.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <p className="font-medium text-ink">{doctor.name}</p>
            <p className="text-sm text-ink-soft">{doctor.department}</p>
            <p className="text-sm text-ink-soft">{doctor.hospital}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
            </p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-1 font-display text-lg font-semibold text-ink">Data Source</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Development-only toggle. When ON, the dashboard uses realistic demo data instead of calling the backend —
          useful when no Node.js backend is running.
        </p>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="font-medium text-ink">Demo Data</p>
            <p className="text-xs text-ink-soft">
              Backend status:{' '}
              <span className={backendUnavailable ? 'text-warning' : 'text-success'}>
                {backendUnavailable ? 'Unavailable — using fallback' : 'Reachable'}
              </span>
            </p>
          </div>
          <button
            onClick={toggleDemoMode}
            className={`relative h-6 w-11 rounded-full transition-colors ${demoMode ? 'bg-primary' : 'bg-ink-faint/40'}`}
            aria-pressed={demoMode}
            aria-label="Toggle demo mode"
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                demoMode ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-1 font-display text-lg font-semibold text-ink">Preferences</h2>
        <div className="mt-4 space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ink">Language</span>
            <select className="input w-40" defaultValue="en">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink">Notifications</span>
            <span className="text-ink-soft">Enabled</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink">Display density</span>
            <span className="text-ink-soft">Comfortable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
