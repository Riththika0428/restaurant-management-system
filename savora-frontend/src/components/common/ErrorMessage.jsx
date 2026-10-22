import { AlertTriangle } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-line bg-white px-6 py-12 text-center shadow-card">
      <AlertTriangle className="mb-4 text-orange" size={36} />
      <p className="font-semibold">Something went wrong</p>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 rounded-full bg-charcoal px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange"
        >
          Try again
        </button>
      )}
    </div>
  );
}