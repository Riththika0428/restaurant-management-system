export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
      {categories.map((category) => {
        const isActive = active === category;
        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition ${
              isActive ? 'bg-charcoal text-white' : 'bg-white text-charcoal shadow-sm hover:bg-orange/10'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}