import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search dishes...' }) {
  return (
    <div className="relative w-full max-w-xl">
      <label htmlFor="food-search" className="sr-only">Search dishes</label>
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
      <input
        id="food-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-line bg-white py-3 pl-11 pr-11 text-sm shadow-sm outline-none transition focus:border-orange focus:ring-4 focus:ring-orange/15"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:text-charcoal"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}