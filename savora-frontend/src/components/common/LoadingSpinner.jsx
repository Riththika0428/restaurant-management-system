export default function LoadingSpinner({ label = 'Loading', className = '' }) {
  return (
    <div role="status" className={`flex items-center justify-center ${className}`}>
      <span className="h-9 w-9 animate-spin rounded-full border-4 border-orange border-t-transparent" />
      <span className="sr-only">{label}</span>
    </div>
  );
}