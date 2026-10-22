import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { formatPrice } from '../../utils/money.js';

export default function OrderCard({ order }) {
  const itemCount = order.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <article className="rounded-3xl bg-white p-6 shadow-card transition hover:-translate-y-0.5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-bold">Order {order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}</p>
          <p className="text-sm text-muted">
            {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })} · {itemCount} item{itemCount === 1 ? '' : 's'}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <ul className="mt-4 space-y-1 text-sm">
        {order.items?.map((item) => (
          <li key={item.foodId} className="flex justify-between gap-4">
            <span>{item.quantity}× {item.name}</span>
            <span className="text-muted">{formatPrice(item.lineTotal)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="flex items-center gap-2 text-sm text-muted">
          <CreditCard size={16} /> {order.paymentMethod === 'cash_on_delivery' ? 'Cash on delivery' : order.paymentMethod}
        </p>
        <div className="flex items-center gap-4">
          <span className="font-bold">{formatPrice(order.totalAmount)}</span>
          <Link
            to={`/orders/${order._id}`}
            className="rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}