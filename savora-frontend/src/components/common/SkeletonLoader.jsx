export default function FoodCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl bg-white shadow-card" aria-hidden="true">
      <div className="aspect-[4/3] bg-line" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 rounded bg-line" />
        <div className="h-5 w-2/3 rounded bg-line" />
        <div className="h-4 w-full rounded bg-line" />
        <div className="h-9 w-1/2 rounded-full bg-line" />
      </div>
    </div>
  );
}