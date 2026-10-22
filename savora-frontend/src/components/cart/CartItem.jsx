import { Minus, Plus, Trash2 } from 'lucide-react';
import FoodImage from '../common/FoodImage.jsx';
import { formatPrice } from '../../utils/money.js';
import { useCart } from '../../context/CartContext.jsx';

const MAX_QUANTITY = 20;

export default function CartItem({ item }) {
  const { setQuantity, removeItem } = useCart();

  return (
    <li className="flex gap-4 py-5">
      <FoodImage src={item.image} alt={item.name} className="h-24 w-24 shrink-0 rounded-2xl sm:h-28 sm:w-28" />

      <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-display text-lg font-bold">{item.name}</h3>
          <p className="text-sm text-muted">{item.category}</p>
          <p className="mt-1 text-sm font-semibold text-orange">{formatPrice(item.price)} each</p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="flex items-center rounded-full border border-line bg-white" role="group" aria-label={`Quantity for ${item.name}`}>
            <button
              onClick={() => setQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className="p-2.5 transition hover:text-orange disabled:opacity-30"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{item.quantity}</span>
            <button
              onClick={() => setQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= MAX_QUANTITY}
              aria-label="Increase quantity"
              className="p-2.5 transition hover:text-orange disabled:opacity-30"
            >
              <Plus size={14} />
            </button>
          </div>

          <p className="w-24 text-right font-bold">{formatPrice(item.price * item.quantity)}</p>

          <button
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name}`}
            className="rounded-full p-2 text-muted transition hover:bg-orange/10 hover:text-orange"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </li>
  );
}