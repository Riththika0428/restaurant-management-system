const STYLES = {
  Pending: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Preparing: 'bg-orange/15 text-orange-dark',
  Ready: 'bg-emerald-100 text-emerald-800',
  Delivered: 'bg-green-600 text-white',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STYLES[status] || 'bg-line text-charcoal'}`}>
      {status}
    </span>
  );
}