import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { createOrder } from '../services/orderService.js';
import { saveOrderReference } from '../utils/orderHistory.js';
import { validateCheckout } from '../utils/validators.js';
import OrderSummary from '../components/cart/OrderSummary.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import FoodImage from '../components/common/FoodImage.jsx';
import { formatPrice } from '../utils/money.js';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  phone: '',
  deliveryAddress: '',
  deliveryInstructions: '',
};

const FIELDS = [
  { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name', required: true },
  { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email', required: true },
  { name: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel', required: true },
];

function FormField({ label, name, error, as = 'input', ...props }) {
  const Field = as;
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <Field
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-orange/15 ${
          error ? 'border-red-400 focus:border-red-400' : 'border-line focus:border-orange'
        }`}
        {...props}
      />
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function Checkout() {
  const { items, subtotal, deliveryFee, grandTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const submittingRef = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;

    const validationErrors = validateCheckout(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError('');

    try {
      // Only item IDs and quantities are sent. The server calculates the prices.
      const { data: order, trackingToken } = await createOrder({
        customer: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
        deliveryAddress: form.deliveryAddress.trim(),
        deliveryInstructions: form.deliveryInstructions.trim(),
        paymentMethod: 'cash_on_delivery',
        items: items.map((item) => ({ foodId: item.id, quantity: item.quantity })),
      });

      saveOrderReference({ id: order._id, token: trackingToken, createdAt: order.createdAt });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${order._id}`, { replace: true });
    } catch (err) {
      setSubmitError(err.message);
      toast.error('We could not place your order. Please try again.');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !submitting) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Nothing to check out"
        message="Your cart is empty. Add some dishes first."
        action={<Link to="/menu" className="rounded-full bg-orange px-7 py-3 font-semibold text-white">Go to menu</Link>}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-display text-4xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="mb-6 font-display text-xl font-bold">Contact details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.name} className={field.name === 'fullName' ? 'sm:col-span-2' : ''}>
                  <FormField
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    value={form[field.name]}
                    onChange={handleChange}
                    error={errors[field.name]}
                    disabled={submitting}
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="mb-6 font-display text-xl font-bold">Delivery</h2>
            <div className="space-y-5">
              <FormField
                label="Delivery address"
                name="deliveryAddress"
                as="textarea"
                rows={3}
                autoComplete="street-address"
                value={form.deliveryAddress}
                onChange={handleChange}
                error={errors.deliveryAddress}
                disabled={submitting}
              />
              <FormField
                label="Delivery instructions (optional)"
                name="deliveryInstructions"
                as="textarea"
                rows={2}
                placeholder="Gate code, floor, or a note for the driver"
                value={form.deliveryInstructions}
                onChange={handleChange}
                error={errors.deliveryInstructions}
                disabled={submitting}
              />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="mb-2 font-display text-xl font-bold">Payment</h2>
            <label className="mt-4 flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-orange bg-orange/5 p-4">
              <input type="radio" name="paymentMethod" value="cash_on_delivery" checked readOnly className="accent-orange" />
              <span>
                <span className="block font-semibold">Cash on delivery</span>
                <span className="text-sm text-muted">Pay when your order arrives.</span>
              </span>
            </label>
          </section>

          {submitError && (
            <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <OrderSummary subtotal={subtotal} deliveryFee={deliveryFee} total={grandTotal}>
            <ul className="max-h-60 space-y-3 overflow-y-auto border-t border-line pt-4 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <FoodImage src={item.image} alt="" className="h-12 w-12 shrink-0 rounded-xl" />
                  <span className="flex-1">{item.quantity}× {item.name}</span>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-orange py-3.5 font-semibold text-white transition hover:bg-orange-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? <><LoadingSpinner label="Placing order" className="h-5 w-5" /> Placing order…</> : 'Place order'}
            </button>
          </OrderSummary>
        </div>
      </form>
    </div>
  );
}