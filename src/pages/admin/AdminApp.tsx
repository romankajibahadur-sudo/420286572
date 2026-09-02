import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ExternalLink, Images, Inbox, LayoutDashboard, LogOut, Menu, MountainSnow,
  Settings, ShieldAlert, Users, X,
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { listInquiries, type Inquiry } from '../../lib/db';
import { useSeo, useLockBody } from '../../lib/hooks';
import { roleLabel, roleTone, type Permission } from '../../lib/roles';
import { SITE } from '../../lib/site';
import { cn } from '../../utils/cn';
import { InquiriesPanel, JourneysPanel, OverviewPanel, SettingsPanel } from './Panels';
import { GalleryPanel } from './GalleryPanel';
import { UsersPanel } from './UsersPanel';

const TABS: { slug: Permission; label: string; icon: typeof LayoutDashboard }[] = [
  { slug: 'overview', label: 'Overview', icon: LayoutDashboard },
  { slug: 'journeys', label: 'Journeys', icon: MountainSnow },
  { slug: 'gallery', label: 'Gallery', icon: Images },
  { slug: 'inquiries', label: 'Inquiries', icon: Inbox },
  { slug: 'users', label: 'Users', icon: Users },
  { slug: 'settings', label: 'Settings', icon: Settings },
];

const SIDEBAR_W = 'lg:w-[15.5rem]';
const CONTENT_PAD = 'lg:pl-[15.5rem]';

export default function AdminApp() {
  useSeo(`Admin Dashboard | ${SITE.fullName}`, 'Site administration — journeys, gallery, inquiries, users and settings.');
  const { user, loading, allows, signOut } = useAuth();
  const [params, setParams] = useSearchParams();
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  useLockBody(navOpen);

  const visible = TABS.filter((t) => allows(t.slug));
  const requested = (params.get('tab') as Permission) || 'overview';
  const tab = visible.some((t) => t.slug === requested) ? requested : visible[0]?.slug ?? 'overview';

  const reloadInquiries = useCallback(() => {
    listInquiries().then(setInquiries).catch(() => setInquiries([]));
  }, []);

  useEffect(() => {
    if (user && allows('inquiries')) reloadInquiries();
  }, [user, allows, reloadInquiries]);

  const go = (t: string) => {
    setParams({ tab: t }, { replace: true });
    setNavOpen(false);
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-sand-50" role="status" aria-label="Loading dashboard">
        <span className="grid size-16 animate-pulse-soft place-items-center rounded-2xl bg-night-950 text-ember-400 shadow-lift">
          <MountainSnow className="size-8" aria-hidden />
        </span>
      </main>
    );
  }

  if (!user) return <Navigate to={`/login?next=/admin`} replace />;

  if (visible.length === 0) {
    return (
      <main className="grid min-h-screen place-items-center bg-sand-50 px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md rounded-3xl border border-night-900/10 bg-white p-10 text-center shadow-lift">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-amber-100 text-amber-600">
            <ShieldAlert className="size-7" aria-hidden />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold text-night-900">No dashboard access</h1>
          <p className="mt-2 text-sm leading-relaxed text-night-900/55">
            Your account (<strong>{user.userId}</strong>) has no dashboard permissions assigned. Ask an administrator to update your role.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={signOut} className="rounded-xl bg-night-950 px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-ember-600 cursor-pointer">Sign out</button>
            <Link to="/" className="rounded-xl border border-night-900/15 px-5 py-2.5 text-sm font-bold text-night-900/70 hover:bg-night-900/5">Back to site</Link>
          </div>
        </motion.div>
      </main>
    );
  }

  const newCount = inquiries?.filter((i) => i.status === 'new').length ?? 0;

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex-1 space-y-1 px-3" aria-label="Dashboard sections">
      {visible.map((t) => (
        <button
          key={t.slug}
          type="button"
          onClick={() => { go(t.slug); onNavigate?.(); }}
          aria-current={tab === t.slug ? 'page' : undefined}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all cursor-pointer',
            tab === t.slug ? 'bg-ember-500 text-white shadow-lg' : 'text-white/55 hover:bg-white/8 hover:text-white',
          )}
        >
          <t.icon className="size-4.5 shrink-0" aria-hidden />
          <span className="truncate">{t.label}</span>
          {t.slug === 'inquiries' && newCount > 0 && (
            <span className={cn('ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold',
              tab === t.slug ? 'bg-white text-ember-600' : 'bg-ember-500 text-white')}>
              {newCount}
            </span>
          )}
        </button>
      ))}
    </nav>
  );

  const SidebarFooter = () => (
    <div className="space-y-1 border-t border-white/10 p-3">
      <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-white/55 transition hover:bg-white/8 hover:text-white">
        <ExternalLink className="size-4.5 shrink-0" aria-hidden /> View live site
      </Link>
      <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-white/55 transition hover:bg-white/8 hover:text-white cursor-pointer">
        <LogOut className="size-4.5 shrink-0" aria-hidden /> Sign out
      </button>
      <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/5 px-3.5 py-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ember-500 font-display text-xs font-semibold text-white">
          {user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-xs font-bold text-white">{user.name}</span>
          <span className="block truncate text-[10px] text-white/40">{roleLabel(user.role)}</span>
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand-100">
      {/* ---------- Desktop sidebar (fixed, content is padded by the same width) ---------- */}
      <aside className={cn('fixed inset-y-0 left-0 z-40 hidden shrink-0 flex-col bg-night-950 text-white lg:flex', SIDEBAR_W)}>
        <div className="prayer-strip h-1 w-full shrink-0" aria-hidden />
        <Link to="/" className="flex items-center gap-2.5 px-5 py-6">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ember-500 text-white">
            <MountainSnow className="size-5.5" aria-hidden />
          </span>
          <span className="min-w-0 leading-none">
            <span className="block truncate font-display text-lg font-semibold tracking-tight">{SITE.name} Admin</span>
            <span className="block text-[9px] font-extrabold uppercase tracking-[0.28em] text-white/40">Control room</span>
          </span>
        </Link>
        <div className="flex-1 overflow-y-auto pb-2"><NavList /></div>
        <SidebarFooter />
      </aside>

      {/* ---------- Mobile top bar ---------- */}
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-night-900/10 bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-night-900/12 text-night-900 transition hover:bg-night-900/5 cursor-pointer"
          aria-label="Open dashboard menu"
        >
          <Menu className="size-5" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ember-500">Control room</p>
          <p className="truncate font-display text-lg font-semibold leading-tight text-night-900">
            {visible.find((t) => t.slug === tab)?.label}
          </p>
        </div>
        {newCount > 0 && (
          <button type="button" onClick={() => go('inquiries')} className="relative grid size-10 shrink-0 place-items-center rounded-xl border border-night-900/12 cursor-pointer" aria-label={`${newCount} new inquiries`}>
            <Inbox className="size-5 text-night-900/70" aria-hidden />
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-ember-500 text-[10px] font-extrabold text-white">{newCount}</span>
          </button>
        )}
      </header>

      {/* ---------- Mobile drawer ---------- */}
      <AnimatePresence>
        {navOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setNavOpen(false)}
              className="fixed inset-0 z-[60] bg-night-950/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-[70] flex w-[17rem] max-w-[85vw] flex-col bg-night-950 text-white lg:hidden"
              role="dialog" aria-modal="true" aria-label="Dashboard menu"
            >
              <div className="flex items-center justify-between px-5 py-5">
                <span className="font-display text-lg font-semibold">{SITE.name} Admin</span>
                <button type="button" onClick={() => setNavOpen(false)} className="grid size-9 place-items-center rounded-lg text-white/60 hover:bg-white/10 cursor-pointer" aria-label="Close menu">
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto"><NavList onNavigate={() => setNavOpen(false)} /></div>
              <SidebarFooter />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ---------- Main content ---------- */}
      <div className={cn('min-w-0', CONTENT_PAD)}>
        <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-10">
          <header className="mb-6 hidden flex-wrap items-center justify-between gap-3 lg:flex">
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-ember-500">Control room</p>
              <h1 className="mt-1 truncate font-display text-3xl font-semibold tracking-tight text-night-900">
                {visible.find((t) => t.slug === tab)?.label}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-full border border-night-900/10 bg-white px-4 py-2 text-xs font-bold text-night-900/60">
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider', roleTone[user.role])}>
                {roleLabel(user.role)}
              </span>
              <span className="truncate text-night-900">{user.name}</span>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0"
            >
              {tab === 'overview' && <OverviewPanel inquiries={inquiries} go={go} />}
              {tab === 'journeys' && <JourneysPanel />}
              {tab === 'gallery' && <GalleryPanel />}
              {tab === 'inquiries' && <InquiriesPanel inquiries={inquiries} reload={reloadInquiries} />}
              {tab === 'users' && <UsersPanel />}
              {tab === 'settings' && <SettingsPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
