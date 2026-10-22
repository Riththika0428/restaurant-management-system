import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { getOrderById } from '../services/orderService.js';
import { getSavedOrders } from '../utils/orderHistory.js';
import OrderCard from '../components/orders/OrderCard.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

export default function MyOrders() {
  const [savedRefs] = useState(() => getSavedOrders());
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState(savedRefs.length ? 'loading' : 'empty');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (savedRefs.length === 0) return undefined;
    let cancelled = false;
    setStatus('loading');

    // allSettled keeps working even if one saved order was removed on the server.
    Promise.allSettled(savedRefs.map((ref) => getOrderById(ref.id, ref.token))).then((results) => {
      if (cancelled) return;
      const loaded = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => r.value)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(loaded);
      setStatus(loaded.length || savedRefs.length === 0 ? (loaded.length ? 'success' : 'empty') : 'error');
    });

    return () => {
      cancelled = true;
    };
  }, [savedRefs, retryKey]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange">Account</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">My orders</h1>
        <p className="mt-2 text-muted">Orders placed from this device are listed here.</p>
      </header>

      {status === 'loading' && <div className="py-24"><LoadingSpinner label="Loading orders" /></div>}

      {status === 'error' && (
        <ErrorMessage message="We could not load your orders. Please try again." onRetry={() => setRetryKey((k) => k + 1)} />
      )}

      {status === 'empty' && (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          message="Once you place an order, it will appear here with its status."
          action={<Link to="/menu" className="rounded-full bg-orange px-7 py-3 font-semibold text-white">Order something tasty</Link>}
        />
      )}

      {status === 'success' && (
        <div className="space-y-5">
          {orders.map((order) => <OrderCard key={order._id} order={order} />)}
        </div>
      )}
    </div>
  );
}