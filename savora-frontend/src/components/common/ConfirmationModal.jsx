import { useEffect } from 'react';

export default function ConfirmationModal({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 px-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-card">
        <h2 id="confirm-title" className="font-display text-xl font-bold">{title}</h2>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm font-semibold transition hover:border-charcoal">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-full bg-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-dark">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}