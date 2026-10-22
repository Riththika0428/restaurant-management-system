import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import CartItem from '../components/cart/CartItem.jsx';
import OrderSummary from '../components/cart/OrderSummary.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ConfirmationModal from '../components/common/ConfirmationModal.jsx';

export default function Cart() {
  const { items, subtotal, deliveryFee, grandTotal, totalItems, clearCart } = useCart();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        message="Looks like you have not picked anything yet. Explore the menu and add a few favorites."
        action={
          <Link to="/menu" className="rounded-full bg-orange px-7 py-3 font-semibold text-white transition hover:bg-orange-dark">
            Browse the menu
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold">Your cart</h1>
          <p className="mt-1 text-muted">{totalItems} item{totalItems === 1 ? '' : 's'} ready to order</p>
        </div>
        <button onClick={() => setConfirmOpen(true)} className="text-sm font-semibold text-orange hover:underline">
          Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8" aria-label="Cart items">
          <ul className="divide-y divide-line">
            {items.map((item) => <CartItem key={item.id} item={item} />)}
          </ul>
          <Link to="/menu" className="mt-6 inline-flex text-sm font-semibold text-charcoal hover:text-orange">
            ← Continue shopping
          </Link>
        </section>

        <OrderSummary subtotal={subtotal} deliveryFee={deliveryFee} total={grandTotal}>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full rounded-full bg-charcoal py-3.5 font-semibold text-white transition hover:bg-orange"
          >
            Proceed to checkout
          </button>
        </OrderSummary>
      </div>

      <ConfirmationModal
        open={confirmOpen}
        title="Clear your cart?"
        message="All items will be removed. This cannot be undone."
        confirmLabel="Clear cart"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          clearCart();
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}