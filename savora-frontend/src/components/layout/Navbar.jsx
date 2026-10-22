import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu as MenuIcon, ShoppingBag, UtensilsCrossed, X } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/my-orders', label: 'My Orders' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition hover:text-orange ${isActive ? 'text-orange' : 'text-charcoal/80'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange text-white">
            <UtensilsCrossed size={18} />
          </span>
          Savora
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            aria-label={`Cart, ${totalItems} item${totalItems === 1 ? '' : 's'}`}
            className="relative flex items-center gap-2 rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange px-1 text-xs font-bold text-white ring-2 ring-cream">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 transition hover:bg-line md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-cream px-4 py-3 md:hidden">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-3 font-medium ${isActive ? 'bg-orange/10 text-orange' : 'text-charcoal'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}