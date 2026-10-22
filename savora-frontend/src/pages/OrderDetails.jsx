import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, CreditCard, MapPin } from 'lucide-react';
import { getOrderById } from '../services/orderService.js';
import { getSavedOrders } from '../utils/orderHistory.js';
import { formatPrice } from '../utils/money.js';
import StatusBadge from '../components/orders/StatusBadge.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

const STEPS = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered'];

export default function OrderDetails() {
  const { id } = useParams();
  const savedRef = useMemo(() => getSavedOrders().find((o) => o.id === id), [id]);

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!savedRef) return undefined;
    let cancelled = false;
    setStatus('loading');

    getOrderById(id, savedRef.token)
      .then((data) => {
        if (cancelled) return;
        setOrder(data);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [id, savedRef]);

  if (!savedRef) {
    return (
      <div className="px-4 py-20">
        <ErrorMessage message="We could not verify access to this order. Open it from the device where you placed it." />
        <div className="mt-6 text-center">
          <Link to="/my-orders" className="font-semibold text-orange hover:underline">Go to My Orders</Link>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return <div className="py-32"><LoadingSpinner label="Loading order" /></div>;
  }

  if (status === 'error') {
    return <div className="px-4 py-20"><ErrorMessage message={error} /></div>;
  }

  const stepIndex = STEPS.indexOf(order.status);
  const cancelled = order.status === 'Cancelled';

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange">
          {cancelled ? 'Order cancelled' : 'Order confirmed'}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Thank you for your order!</h1>
        <p className="mt-2 text-muted">
          Order {order.orderNumber || `#${order._id.slice(-6).toUpperCase()}`}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Order status</h2>
            <StatusBadge status={order.status} />
          </div>

          {!cancelled && (
            <ol className="mt-8 grid grid-cols-5 gap-2" aria-label="Order progress">
              {STEPS.map((step, i) => {
                const done = i <= stepIndex;
                return (
                  <li key={step} className="text-center">
                    <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${done ? 'bg-orange text-white' : 'bg-line text-muted'}`}>
                      {done ? <Check size={16} /> : i + 1}
                    </div>
                    <div className={`h-1.5 rounded-full ${done ? 'bg-orange' : 'bg-line'}`} />
                    <p className={`mt-2 text-xs font-medium ${done ? 'text-charcoal' : 'text-muted'}`}>{step}</p>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="mt-10 space-y-4 border-t border-line pt-6 text-sm">
            <p className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-orange" />{order.deliveryAddress}</p>
            <p className="flex items-center gap-3"><CreditCard size={18} className="shrink-0 text-orange" />Cash on delivery</p>
            {order.deliveryInstructions && <p className="rounded-xl bg-cream p-3 text-muted">Note: {order.deliveryInstructions}</p>}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <h2 className="font-display text-xl font-bold">Order details</h2>
          <ul className="mt-5 divide-y divide-line text-sm">
            {order.items.map((item) => (
              <li key={item.foodId} className="flex justify-between py-3">
                <span>{item.quantity}× {item.name}</span>
                <span className="font-semibold">{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Delivery fee</dt><dd>{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}</dd></div>
            <div className="flex justify-between pt-2 text-base font-bold"><dt>Total</dt><dd>{formatPrice(order.totalAmount)}</dd></div>
          </dl>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link to="/menu" className="rounded-full bg-charcoal px-7 py-3 font-semibold text-white transition hover:bg-orange">Order again</Link>
        <Link to="/my-orders" className="rounded-full border border-charcoal/20 px-7 py-3 font-semibold transition hover:border-charcoal">All my orders</Link>
      </div>
    </div>
  );
}