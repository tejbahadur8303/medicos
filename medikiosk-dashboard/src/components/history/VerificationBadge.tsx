import { ShieldCheck, Sparkles } from 'lucide-react';
import { formatDateTime } from '../../utils/formatDate';

interface VerificationBadgeProps {
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  confidence: number;
}

export function VerificationBadge({ verified, verifiedBy, verifiedAt, confidence }: VerificationBadgeProps) {
  if (verified) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-success-light px-3 py-2 text-success">
        <ShieldCheck size={16} />
        <div className="text-xs">
          <p className="font-semibold">History Verified</p>
          {verifiedBy && verifiedAt && (
            <p className="text-success/80">
              Verified by {verifiedBy} · {formatDateTime(verifiedAt)}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-accent-light px-3 py-2 text-accent">
      <Sparkles size={16} />
      <div className="text-xs">
        <p className="font-semibold">AI-Generated Draft</p>
        <p className="text-accent/80">History extraction confidence: {confidence}% — please verify before clinical use.</p>
      </div>
    </div>
  );
}
