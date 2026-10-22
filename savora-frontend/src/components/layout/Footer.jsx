import { Link } from 'react-router-dom';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { RESTAURANT } from '../../utils/restaurant.js';

function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

const SOCIALS = [
  { href: RESTAURANT.socials.instagram, label: 'Instagram', Icon: InstagramIcon },
  { href: RESTAURANT.socials.facebook, label: 'Facebook', Icon: FacebookIcon },
  { href: RESTAURANT.socials.youtube, label: 'YouTube', Icon: YoutubeIcon },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold text-cream">Savora</p>
          <p className="mt-3 text-sm leading-relaxed">{RESTAURANT.tagline}</p>
        </div>

        <div>
          <h3 className="font-semibold text-cream">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="transition hover:text-orange">Home</Link></li>
            <li><Link to="/menu" className="transition hover:text-orange">Menu</Link></li>
            <li><Link to="/my-orders" className="transition hover:text-orange">My Orders</Link></li>
            <li><Link to="/cart" className="transition hover:text-orange">Cart</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-cream">Opening hours</h3>
          <p className="mt-4 flex items-start gap-2 text-sm">
            <Clock size={16} className="mt-0.5 shrink-0 text-orange" /> {RESTAURANT.hours}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-cream">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-orange" />{RESTAURANT.address}</li>
            <li className="flex items-center gap-2"><Phone size={16} className="shrink-0 text-orange" />{RESTAURANT.phone}</li>
            <li className="flex items-center gap-2"><Mail size={16} className="shrink-0 text-orange" />{RESTAURANT.email}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Savora. All rights reserved.</p>
          <div className="flex gap-3">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="rounded-full border border-white/15 p-2 transition hover:border-orange hover:text-orange"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}