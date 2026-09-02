import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MountainSnow, Send } from 'lucide-react';
import { SITE } from '../lib/site';
import { useToast } from './ui';

const FacebookIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={props.className} fill="currentColor" aria-hidden>
    <path d="M13.5 21v-7.8h2.62l.4-3.04H13.5V8.22c0-.88.24-1.48 1.5-1.48h1.6V4.06c-.28-.04-1.23-.12-2.34-.12-2.32 0-3.9 1.41-3.9 4.02v2.24H7.75v3.04h2.61V21h3.14z" />
  </svg>
);
const InstagramIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={props.className} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.8" />
    <circle cx="12" cy="12" r="3.9" />
    <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);
const YoutubeIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={props.className} fill="currentColor" aria-hidden>
    <path d="M21.6 7.2a2.55 2.55 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.55 2.55 0 0 0 2.4 7.2 26.5 26.5 0 0 0 2 12a26.5 26.5 0 0 0 .4 4.8 2.55 2.55 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.55 2.55 0 0 0 1.8-1.8A26.5 26.5 0 0 0 22 12a26.5 26.5 0 0 0-.4-4.8zM10 15.2V8.8L15.6 12 10 15.2z" />
  </svg>
);
const PinterestIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={props.className} fill="currentColor" aria-hidden>
    <path d="M12 2a10 10 0 0 0-3.65 19.32c-.09-.77-.17-1.95.03-2.8l1.2-5.08s-.3-.6-.3-1.5c0-1.4.83-2.45 1.85-2.45.87 0 1.28.64 1.28 1.43 0 .87-.55 2.16-.84 3.36-.24 1 .5 1.82 1.5 1.82 1.79 0 3.17-1.9 3.17-4.62 0-2.42-1.73-4.11-4.21-4.11-2.87 0-4.55 2.15-4.55 4.37 0 .87.34 1.8.75 2.3.08.1.09.19.07.29l-.27 1.12c-.05.18-.15.22-.33.13-1.22-.57-1.98-2.35-1.98-3.78 0-3.07 2.24-5.9 6.45-5.9 3.39 0 6.02 2.41 6.02 5.64 0 3.37-2.12 6.08-5.07 6.08-.99 0-1.92-.52-2.24-1.12l-.6 2.32c-.22.85-.8 1.9-1.2 2.55A10 10 0 1 0 12 2z" />
  </svg>
);

const EXPLORE = [
  { label: 'Treks', to: '/treks?activity=trekking' },
  { label: 'Tours', to: '/treks?activity=tours' },
  { label: 'Destinations', to: '/destinations' },
  { label: 'Activities', to: '/activities' },
  { label: 'Regions', to: '/regions' },
  { label: 'Gallery', to: '/gallery' },
];

const INFO = [
  { label: 'Trekking Guide', to: '/travel-info/about-trekking' },
  { label: 'Trekking Grades', to: '/travel-info/trekking-grades' },
  { label: 'Trekking Seasons', to: '/travel-info/trekking-seasons' },
  { label: 'Nepal Information', to: '/travel-info/nepal-general-information' },
  { label: 'FAQ', to: '/travel-info#faq' },
];

const COMPANY = [
  { label: 'About Us', to: '/about' },
  { label: 'Book a Journey', to: '/booking' },
  { label: 'Contact', to: '/contact' },
  { label: 'Traveller Reviews', to: '/#reviews' },
];

const SOCIALS = [
  { icon: FacebookIcon, label: 'Facebook', href: SITE.socials.facebook },
  { icon: InstagramIcon, label: 'Instagram', href: SITE.socials.instagram },
  { icon: YoutubeIcon, label: 'YouTube', href: SITE.socials.youtube },
  { icon: PinterestIcon, label: 'Pinterest', href: SITE.socials.pinterest },
];

export function Footer() {
  const { push } = useToast();
  const [email, setEmail] = useState('');

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return push('Please enter a valid email address', 'info');
    setEmail('');
    push('Welcome to the expedition list — trail stories arrive monthly.');
  };

  return (
    <footer className="relative bg-night-950 text-white">
      <div className="prayer-strip h-1 w-full" aria-hidden />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-ember-500 text-white">
              <MountainSnow className="size-5.5" aria-hidden />
            </span>
            <span className="leading-none">
              <span className="block font-display text-lg font-semibold tracking-tight">{SITE.name}</span>
              <span className="block text-[9px] font-extrabold uppercase tracking-[0.34em] opacity-60">{SITE.line}</span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
            A Kathmandu-born team of guides, climbers and storytellers crafting safe, personal journeys through the
            greatest mountains on Earth since 2009.
          </p>
          <div className="mt-6 flex items-center gap-2.5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid size-10 place-items-center rounded-full border border-white/15 text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-ember-400 hover:bg-ember-500 hover:text-white"
              >
                <s.icon className="size-4.5" aria-hidden />
              </a>
            ))}
          </div>
          <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-white/40">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-ember-400" aria-hidden />
            {SITE.addressLine1}, {SITE.addressLine2}
          </p>
        </div>

        {/* Link columns */}
        {[
          { title: 'Explore', links: EXPLORE },
          { title: 'Information', links: INFO },
          { title: 'Company', links: COMPANY },
        ].map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-ember-400">{col.title}</h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
                  >
                    <span className="h-px w-0 bg-ember-400 transition-all duration-300 group-hover:w-4" aria-hidden />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Newsletter band */}
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-10 lg:flex-row lg:items-center">
          <div>
            <h3 className="font-display text-2xl font-medium tracking-tight">Trail notes, monthly.</h3>
            <p className="mt-1 text-sm text-white/50">Season reports, new routes and honest advice. No noise, ever.</p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
            <label htmlFor="footer-email" className="sr-only">Email address</label>
            <input
              id="footer-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/35 transition focus:border-ember-400 focus:outline-none"
            />
            <button
              type="submit"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-ember-500 text-white transition-all duration-300 hover:scale-105 hover:bg-ember-600 cursor-pointer"
              aria-label="Subscribe to the newsletter"
            >
              <Send className="size-4.5" aria-hidden />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.legalName} Registered with Nepal Tourism Board #1142.</p>
          <p className="flex items-center gap-1.5">
            Crafted at 1,400 m in Kathmandu
            <MountainSnow className="size-3.5 text-ember-400" aria-hidden />
          </p>
        </div>
      </div>
    </footer>
  );
}
