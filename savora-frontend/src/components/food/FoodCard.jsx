import { Check, Leaf, Plus, Star } from 'lucide-react';
import FoodImage from '../common/FoodImage.jsx';
import { formatPrice } from '../../utils/money.js';

export default function FoodCard({ food, inCart = 0, onAdd }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card transition duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <FoodImage
          src={food.image}
          alt={food.name}
          className="h-full w-full transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {food.isVegetarian && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-green-700">
              <Leaf size={12} /> Vegetarian
            </span>
          )}
          {food.isPopular && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange px-2.5 py-1 text-xs font-semibold text-white">
              <Star size={12} /> Popular
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange">{food.category}</p>
        <h3 className="mt-1 font-display text-xl font-bold">{food.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{food.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-lg font-bold">{formatPrice(food.price)}</span>
          <button
            onClick={() => onAdd(food)}
            aria-label={`Add ${food.name} to cart`}
            className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange"
          >
            {inCart > 0 ? <Check size={16} /> : <Plus size={16} />}
            {inCart > 0 ? `In cart (${inCart})` : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}