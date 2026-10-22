import { formatPrice, FREE_DELIVERY_THRESHOLD } from '../../utils/money.js';

export default function OrderSummary({ subtotal, deliveryFee, total, children }) {
  const remaining = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);

  return (
    <aside className="rounded-3xl bg-white p-6 shadow-card lg:sticky lg:top-28" aria-label="Order summary">
      <h2 className="font-display text-xl font-bold">Order summary</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-semibold">{formatPrice(subtotal)}</dd></div>
        <div className="flex justify-between">
          <dt className="text-muted">Delivery fee</dt>
          <dd className="font-semibold">{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</dd>
        </div>
      </dl>

      {remaining > 0 && subtotal > 0 && (
        <p className="mt-4 rounded-xl bg-orange/10 px-3 py-2 text-xs text-orange-dark">
          Add {formatPrice(remaining)} more for free delivery.
        </p>
      )}

      <div className="mt-5 flex justify-between border-t border-line pt-5">
        <span className="font-semibold">Total</span>
        <span className="font-display text-2xl font-bold">{formatPrice(total)}</span>
      </div>

      {children && <div className="mt-6 space-y-3">{children}</div>}
    </aside>
  );
}