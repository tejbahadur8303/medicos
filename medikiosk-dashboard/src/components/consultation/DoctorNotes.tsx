import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '../common/Button';

interface DoctorNotesProps {
  patientId: string;
  onSaveDraft: (content: string) => void;
}

export function DoctorNotes({ onSaveDraft }: DoctorNotesProps) {
  const [content, setContent] = useState('');
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  function handleSaveDraft() {
    onSaveDraft(content);
    setSavedMessage('Draft saved');
    setTimeout(() => setSavedMessage(null), 2000);
  }

  return (
    <div className="card p-6">
      <h2 className="mb-3 font-display text-lg font-semibold text-ink">Doctor Notes</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter consultation notes..."
        rows={8}
        className="input resize-none"
      />
      <div className="mt-3 flex items-center gap-3">
        <Button variant="secondary" icon={<Save size={16} />} onClick={handleSaveDraft}>
          Save Draft
        </Button>
        {savedMessage && <span className="text-sm text-success">{savedMessage}</span>}
      </div>
    </div>
  );
}
