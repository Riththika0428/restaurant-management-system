import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center px-4 py-32 text-center">
      <p className="font-display text-7xl font-bold text-orange">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold">This page is off the menu.</h1>
      <p className="mt-2 text-muted">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-8 rounded-full bg-charcoal px-7 py-3 font-semibold text-white transition hover:bg-orange">
        Back to home
      </Link>
    </div>
  );
}