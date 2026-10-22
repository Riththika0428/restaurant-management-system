export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange/10 text-orange">
        <Icon size={44} strokeWidth={1.5} />
      </div>
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-muted">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}