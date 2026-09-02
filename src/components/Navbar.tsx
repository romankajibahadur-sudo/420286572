import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Menu, MountainSnow, Phone, Search, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useLockBody, useScrollY } from '../lib/hooks';
import { SITE } from '../lib/site';
import { cn } from '../utils/cn';
import { Button } from './ui';
import { SearchOverlay } from './SearchOverlay';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/treks', label: 'Treks' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/regions', label: 'Regions' },
  { to: '/activities', label: 'Activities' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/travel-info', label: 'Travel Info' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const y = useScrollY();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  useLockBody(menuOpen);
  // When the mobile menu is open, keep the bar transparent & light-text so it
  // melts into the full-screen menu rather than floating above it.
  // Pages without a dark hero (login, admin) always use the solid treatment.
  const forceSolid = location.pathname === '/login' || location.pathname.startsWith('/admin');
  const scrolled = (y > 28 || forceSolid) && !menuOpen;

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!userMenu) return;
    const close = (e: MouseEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node)) setUserMenu(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [userMenu]);

  // "/" focuses search from anywhere (unless the user is already typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
      if (e.key === '/' && !typing && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-[90] transition-all duration-500',
          scrolled ? 'glass border-b border-night-900/8 shadow-[0_8px_30px_-12px_rgba(6,11,16,0.15)]' : 'bg-transparent',
        )}
      >
        <div className="container-x">
          <div className={cn('flex items-center justify-between transition-all duration-500', scrolled ? 'h-16' : 'h-20')}>
            {/* Brand */}
            <Link to="/" className="group flex items-center gap-2.5" aria-label={`${SITE.fullName} — home`}>
              <span
                className={cn(
                  'grid size-10 place-items-center rounded-xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-105',
                  scrolled ? 'bg-ember-500 text-white shadow-lg' : 'bg-white/15 text-white backdrop-blur',
                )}
              >
                <MountainSnow className="size-5.5" aria-hidden />
              </span>
              <span className={cn('leading-none transition-colors duration-500', scrolled ? 'text-night-900' : 'text-white')}>
                <span className="block font-display text-lg font-semibold tracking-tight">{SITE.name}</span>
                <span className="block text-[9px] font-extrabold uppercase tracking-[0.34em] opacity-70">{SITE.line}</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                    className={({ isActive }) =>
                    cn(
                      'relative rounded-full px-2.5 py-2 text-[12.5px] font-bold tracking-wide transition-colors duration-300 2xl:px-3.5',
                      scrolled
                        ? isActive
                          ? 'text-ember-600'
                          : 'text-night-900/70 hover:text-night-900'
                        : isActive
                          ? 'text-white'
                          : 'text-white/75 hover:text-white',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      <span
                        className={cn(
                          'absolute -bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-ember-500 transition-all duration-300',
                          isActive ? 'w-5 opacity-100' : 'w-0 opacity-0',
                        )}
                        aria-hidden
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {/* Desktop: a real search affordance that opens the full search */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search the website"
                className={cn(
                  'hidden items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-all duration-300 xl:flex cursor-pointer',
                  scrolled
                    ? 'border-night-900/12 bg-night-900/4 text-night-900/50 hover:border-night-900/30 hover:text-night-900'
                    : 'border-white/25 bg-white/10 text-white/70 backdrop-blur hover:border-white/50 hover:text-white',
                )}
              >
                <Search className="size-4" aria-hidden />
                <span>Search…</span>
                <kbd className={cn('rounded px-1.5 py-0.5 text-[10px] font-extrabold',
                  scrolled ? 'bg-night-900/8 text-night-900/40' : 'bg-white/15 text-white/60')}>/</kbd>
              </button>
              {/* Mobile / tablet: icon only */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className={cn(
                  'grid size-10 place-items-center rounded-full transition-all duration-300 hover:scale-105 xl:hidden cursor-pointer',
                  scrolled ? 'text-night-900 hover:bg-night-900/5' : 'text-white hover:bg-white/12',
                )}
              >
                <Search className="size-5" aria-hidden />
              </button>
              {/* Account control is staff-only — travellers never need an account */}
              {isAdmin && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenu((o) => !o)}
                    aria-expanded={userMenu}
                    aria-label="Account menu"
                    className={cn(
                      'grid size-10 place-items-center rounded-full font-display text-xs font-semibold transition-all duration-300 hover:scale-105 cursor-pointer',
                      scrolled ? 'bg-night-950 text-ember-300' : 'bg-white/15 text-white backdrop-blur hover:bg-white/25',
                    )}
                  >
                    {user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                  </button>
                  <AnimatePresence>
                    {userMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                        className="glass absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-night-900/10 shadow-lift"
                      >
                        <div className="border-b border-night-900/8 px-5 py-4">
                          <p className="truncate text-sm font-bold text-night-900">{user.name}</p>
                          <p className="truncate text-xs text-night-900/50">{user.email}</p>
                          {isAdmin && (
                            <span className="mt-2 inline-block rounded-full bg-ember-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-ember-600">
                              Administrator
                            </span>
                          )}
                        </div>
                        <div className="p-1.5">
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenu(false)}
                              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-night-900/75 transition hover:bg-sand-100"
                            >
                              <LayoutDashboard className="size-4 text-ember-500" aria-hidden /> Admin dashboard
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => { setUserMenu(false); void signOut(); }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-night-900/75 transition hover:bg-sand-100 cursor-pointer"
                          >
                            <LogOut className="size-4 text-night-900/40" aria-hidden /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : null}
              <span className={menuOpen ? 'hidden' : 'hidden md:inline-flex'}>
                <Button to="/booking" size="sm">
                  Plan Your Journey
                </Button>
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                className={cn(
                  'grid size-10 place-items-center rounded-full transition-colors xl:hidden cursor-pointer',
                  menuOpen ? 'text-white hover:bg-white/10' : scrolled ? 'text-night-900 hover:bg-night-900/5' : 'text-white hover:bg-white/12',
                )}
              >
                {menuOpen ? <X className="size-5.5" aria-hidden /> : <Menu className="size-5.5" aria-hidden />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-night-950/98 backdrop-blur-xl xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="prayer-strip h-1 w-full shrink-0" aria-hidden />
            <nav className="container-x flex flex-1 flex-col justify-center" aria-label="Mobile">
              <ul className="space-y-1">
                {LINKS.map((l, i) => (
                  <motion.li
                    key={l.to}
                    initial={{ opacity: 0, x: -32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ delay: 0.06 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink
                      to={l.to}
                      end={l.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-baseline gap-4 border-b border-white/8 py-2.5',
                          isActive ? 'text-ember-400' : 'text-white/85',
                        )
                      }
                    >
                      <span className="font-mono text-xs text-white/30">0{i + 1}</span>
                      <span className="font-display text-2xl font-medium tracking-tight transition-transform duration-300 group-hover:translate-x-2 sm:text-3xl">
                        {l.label}
                      </span>
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Button to="/booking" icon>Plan Your Journey</Button>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 rounded-full border border-ember-400/50 bg-ember-500/10 px-5 py-3 text-sm font-bold text-ember-300 transition hover:bg-ember-500/20"
                  >
                    <LayoutDashboard className="size-4" aria-hidden /> Admin dashboard
                  </Link>
                )}
                <a
                  href={SITE.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white/85 transition hover:border-ember-400 hover:text-ember-300"
                >
                  <Phone className="size-4" aria-hidden /> {SITE.phoneDisplay}
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
