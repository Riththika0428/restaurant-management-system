import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UtensilsCrossed } from 'lucide-react';
import { getFoods } from '../services/foodService.js';
import useDebounce from '../hooks/useDebounce.js';
import { useCart } from '../context/CartContext.jsx';
import FoodCard from '../components/food/FoodCard.jsx';
import SearchBar from '../components/food/SearchBar.jsx';
import CategoryFilter from '../components/food/CategoryFilter.jsx';
import FoodCardSkeleton from '../components/common/SkeletonLoader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { MENU_CATEGORIES } from '../utils/restaurant.js';

export default function Menu() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [category, setCategory] = useState(
    MENU_CATEGORIES.includes(initialCategory) ? initialCategory : 'All'
  );

  const [foods, setFoods] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const { items, addItem } = useCart();

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    getFoods({ search: debouncedSearch, category, page: 1 })
      .then((res) => {
        if (cancelled) return;
        setFoods(res.data);
        setMeta(res.meta ?? { page: 1, totalPages: 1, total: res.data.length });
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
  }, [debouncedSearch, category, retryKey]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await getFoods({ search: debouncedSearch, category, page: meta.page + 1 });
      setFoods((prev) => [...prev, ...res.data]);
      setMeta(res.meta ?? meta);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAdd = (food) => {
    addItem(food);
    toast.success(`${food.name} added to cart`);
  };

  const qtyInCart = (id) => items.find((i) => i.id === id)?.quantity ?? 0;
  const hasMore = meta.page < meta.totalPages;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange">Our menu</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Everything we cook, in one place.</h1>
        <p className="mt-3 text-muted">Search by dish name, filter by category, and add your favorites to the cart.</p>
      </header>

      <div className="flex flex-col gap-6">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryFilter categories={MENU_CATEGORIES} active={category} onChange={setCategory} />
      </div>

      <div className="mt-10">
        {status === 'loading' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <FoodCardSkeleton key={i} />)}
          </div>
        )}

        {status === 'error' && (
          <ErrorMessage message={error} onRetry={() => setRetryKey((k) => k + 1)} />
        )}

        {status === 'success' && foods.length === 0 && (
          <EmptyState
            icon={UtensilsCrossed}
            title="No dishes found"
            message={debouncedSearch ? `Nothing matches "${debouncedSearch}". Try another word.` : 'No dishes in this category yet.'}
            action={
              <button
                onClick={() => { setSearch(''); setCategory('All'); }}
                className="rounded-full bg-charcoal px-6 py-2.5 text-sm font-semibold text-white"
              >
                Clear filters
              </button>
            }
          />
        )}

        {status === 'success' && foods.length > 0 && (
          <>
            <p className="mb-6 text-sm text-muted" aria-live="polite">
              Showing {foods.length} of {meta.total} dishes
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {foods.map((food) => (
                <FoodCard key={food._id} food={food} inCart={qtyInCart(food._id)} onAdd={handleAdd} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-3 rounded-full border border-charcoal px-8 py-3 font-semibold transition hover:bg-charcoal hover:text-white disabled:opacity-60"
                >
                  {loadingMore ? <LoadingSpinner label="Loading more dishes" className="h-5 w-5" /> : 'Load more dishes'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}