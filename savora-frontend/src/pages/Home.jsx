import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  Flame,
  Gift,
  Star,
  Tag,
  Truck,
  UtensilsCrossed,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useParallax from '../hooks/useParallax.js';
import { getFeaturedFoods } from '../services/foodService.js';
import { useCart } from '../context/CartContext.jsx';
import FoodCard from '../components/food/FoodCard.jsx';
import FoodCardSkeleton from '../components/common/SkeletonLoader.jsx';
import FoodImage from '../components/common/FoodImage.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import {
  BENEFITS,
  HERO_IMAGE,
  HOME_CATEGORIES,
  OFFERS,
  PARALLAX_IMAGE,
  RESTAURANT,
  TESTIMONIALS,
} from '../utils/restaurant.js';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const { items, addItem } = useCart();

  const heroBlobRef = useParallax(0.12);
  const heroImageRef = useParallax(-0.06);
  const bandRef = useParallax(0.25);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    getFeaturedFoods()
      .then((data) => {
        if (cancelled) return;
        setFeatured(data);
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
  }, [retryKey]);

  const qtyInCart = (id) => items.find((i) => i.id === id)?.quantity ?? 0;

  const handleAdd = (food) => {
    addItem(food);
    toast.success(`${food.name} added to cart`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          ref={heroBlobRef}
          className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-orange/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span
              className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-muted shadow-sm"
              style={{ animationDelay: '0ms' }}
            >
              <Flame size={14} className="text-orange" /> Freshly cooked for every order
            </span>

            <h1
              className="animate-fade-up mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-6xl"
              style={{ animationDelay: '120ms' }}
            >
              Savor every <em className="italic text-orange">bite</em>, delivered warm to your door.
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-lg text-lg leading-relaxed text-muted"
              style={{ animationDelay: '240ms' }}
            >
              Hand-prepared starters, mains and desserts from our kitchen, packed carefully and delivered hot.
            </p>

            <div
              className="animate-fade-up mt-8 flex flex-wrap gap-4"
              style={{ animationDelay: '360ms' }}
            >
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange/30 transition duration-300 hover:-translate-y-0.5 hover:bg-orange-dark"
              >
                Order now <ArrowRight size={18} />
              </Link>
              <a
                href="#categories"
                className="rounded-full border border-charcoal/15 bg-white px-7 py-3.5 font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-charcoal"
              >
                Explore menu
              </a>
            </div>

            <div
              className="animate-fade-up mt-12 grid max-w-md grid-cols-3 gap-4 text-center text-sm"
              style={{ animationDelay: '480ms' }}
            >
              <div>
                <Flame className="mx-auto mb-2 text-orange" size={22} />
                <p className="font-semibold">Made fresh</p>
                <p className="text-xs text-muted">Never reheated</p>
              </div>
              <div>
                <Truck className="mx-auto mb-2 text-orange" size={22} />
                <p className="font-semibold">30–45 min</p>
                <p className="text-xs text-muted">To your door</p>
              </div>
              <div>
                <Clock className="mx-auto mb-2 text-orange" size={22} />
                <p className="font-semibold">Order anytime</p>
                <p className="text-xs text-muted">No account needed</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div ref={heroImageRef} className="relative">
              <div className="animate-scale-in overflow-hidden rounded-[2rem] shadow-card">
                <FoodImage
                  src={HERO_IMAGE}
                  alt="Freshly prepared dishes on a wooden table"
                  className="aspect-[4/5] w-full transition duration-700 hover:scale-105"
                />
              </div>
              <div
                className="animate-float absolute -bottom-6 -left-4 rounded-2xl bg-charcoal px-6 py-4 text-cream shadow-card sm:-left-8"
              >
                <p className="text-xs uppercase tracking-widest text-orange">Today</p>
                <p className="font-display text-2xl font-bold">Open now</p>
                <p className="text-xs text-cream/70">{RESTAURANT.hours}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange">Browse</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Popular categories</h2>
          </div>
          <Link to="/menu" className="hidden text-sm font-semibold text-orange hover:underline sm:block">
            View full menu
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {HOME_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/menu?category=${encodeURIComponent(cat.name)}`}
              className="group relative overflow-hidden rounded-3xl shadow-card"
            >
              <FoodImage
                src={cat.image}
                alt=""
                className="aspect-square w-full transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
              <p className="absolute bottom-4 left-4 font-display text-lg font-bold text-white">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured dishes */}
      <section id="featured" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-16 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange">Chef's picks</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Featured dishes</h2>
        </div>

        {status === 'loading' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <FoodCardSkeleton key={i} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <ErrorMessage message={error} onRetry={() => setRetryKey((k) => k + 1)} />
        )}

        {status === 'success' && featured.length === 0 && (
          <EmptyState
            icon={UtensilsCrossed}
            title="No featured dishes yet"
            message="Check back soon, or browse the full menu."
            action={
              <Link to="/menu" className="rounded-full bg-charcoal px-6 py-2.5 text-sm font-semibold text-white">
                Go to menu
              </Link>
            }
          />
        )}

        {status === 'success' && featured.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((food) => (
              <FoodCard key={food._id} food={food} inCart={qtyInCart(food._id)} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </section>

      {/* Parallax benefits band */}
      <section className="relative overflow-hidden py-24 text-cream">
        <div
          ref={bandRef}
          className="absolute left-0 right-0 -top-[15%] -bottom-[15%] bg-cover bg-center"
          style={{ backgroundImage: `url(${PARALLAX_IMAGE})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-charcoal/80" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-orange">Why Savora</p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
            Restaurant quality, delivered with care.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/10"
              >
                <Star className="text-orange" size={24} />
                <h3 className="mt-4 font-display text-xl font-bold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex items-center gap-3">
          <Gift className="text-orange" />
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Special offers</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {OFFERS.map((offer) => (
            <div
              key={offer.title}
              className="rounded-3xl border border-line bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1"
            >
              <Tag className="text-orange" />
              <h3 className="mt-4 font-display text-xl font-bold">{offer.title}</h3>
              <p className="mt-2 text-sm text-muted">{offer.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange">Testimonials</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">What guests say</h2>
            <p className="mt-2 text-xs text-muted">Sample content for demonstration purposes.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="rounded-3xl bg-cream p-7">
                <div className="flex gap-1 text-orange" aria-label="Five star rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-charcoal/80">"{t.text}"</blockquote>
                <figcaption className="mt-5 text-sm font-semibold">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}