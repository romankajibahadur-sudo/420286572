import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3, Check, ChevronDown, Database, Inbox as InboxIcon, LogOut,
  MountainSnow, Pencil, Plus, RefreshCw, Search, Send, Star, Trash2, Users, X,
} from 'lucide-react';
import type { Journey } from '../../data/types';
import { ACTIVITY_FILTERS, DESTINATIONS_LIST, journeys as seedJourneys } from '../../data/treks';
import { regions } from '../../data/content';
import type { Account, Inquiry } from '../../lib/db';
import { addReply, deleteJourney, deleteInquiry, listUsers, resetJourneys, saveJourney, updateInquiry } from '../../lib/db';
import { backendMode, missingEnvKeys, REQUIRED_ENV_KEYS } from '../../lib/firebase';
import { mailtoLink } from '../../lib/notify';
import { SITE, emailDeliveryReady } from '../../lib/site';
import { useAuth } from '../../lib/auth';
import { useJourneys } from '../../data/store';
import { useToast } from '../../components/ui';
import { formatPrice, slugify } from '../../lib/utils';
import { cn } from '../../utils/cn';

const seedSlugs = new Set(seedJourneys.map((j) => j.slug));
const REGION_OPTS = regions.map((r) => ({ slug: r.slug, name: r.name }));
const DIFFICULTIES = ['Easy', 'Moderate', 'Challenging', 'Strenuous'];

const fieldCls =
  'w-full rounded-lg border border-night-900/12 bg-white px-3.5 py-2.5 text-sm text-night-900 placeholder:text-night-900/35 transition focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/20';
const labelCls = 'block text-[11px] font-extrabold uppercase tracking-[0.14em] text-night-900/45 mb-1.5';

export function PanelCard({ title, sub, children, action }: { title: string; sub?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-night-900/8 bg-white p-6 shadow-card sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-night-900">{title}</h2>
          {sub && <p className="mt-0.5 text-sm text-night-900/50">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ============================ Overview ============================ */

export function OverviewPanel({ inquiries, go }: { inquiries: Inquiry[] | null; go: (tab: string) => void }) {
  const { journeys, source } = useJourneys();
  const [users, setUsers] = useState<Account[] | null>(null);
  useEffect(() => { listUsers().then(setUsers).catch(() => setUsers([])); }, []);

  const newInquiries = inquiries?.filter((i) => i.status === 'new').length ?? 0;
  const avgRating = journeys.length ? (journeys.reduce((s, j) => s + j.rating, 0) / journeys.length).toFixed(2) : '—';

  const cards = [
    { icon: MountainSnow, label: 'Journeys live', value: journeys.length, note: source === 'database' ? 'from database' : 'from catalogue' },
    { icon: InboxIcon, label: 'New inquiries', value: newInquiries, note: `${inquiries?.length ?? 0} total` },
    { icon: Users, label: 'Registered users', value: users?.length ?? '—', note: 'all providers' },
    { icon: BarChart3, label: 'Average rating', value: avgRating, note: 'across all journeys' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-3xl border border-night-900/8 bg-white p-6 shadow-card">
            <span className="grid size-11 place-items-center rounded-2xl bg-ember-500/10 text-ember-600">
              <c.icon className="size-5.5" aria-hidden />
            </span>
            <span className="mt-4 block font-display text-3xl font-semibold text-night-900">{c.value}</span>
            <span className="text-sm font-bold text-night-900/70">{c.label}</span>
            <span className="block text-xs text-night-900/40">{c.note}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* backend status */}
        <PanelCard title="Backend status" sub="Where your data lives right now">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-sand-100 px-4 py-3">
              <span className="font-bold text-night-900/70">Storage</span>
              <span className={cn('rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider', backendMode === 'firebase' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700')}>
                {backendMode === 'firebase' ? 'Cloud Firestore' : 'Local database'}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-sand-100 px-4 py-3">
              <span className="font-bold text-night-900/70">Authentication</span>
              <span className="text-xs font-bold text-night-900/50">Email / password · PBKDF2 hashed</span>
            </div>
            {backendMode !== 'firebase' && (
              <p className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs font-medium leading-relaxed text-sky-900">
                Running on the built-in local database — accounts, content edits and the inbox all persist on this
                device. Connect Cloud Firestore in Settings to share data across devices and team members.
              </p>
            )}
            <button
              type="button"
              onClick={() => go('settings')}
              className="w-full rounded-xl bg-night-950 py-3 text-sm font-extrabold text-white transition hover:bg-ember-600 cursor-pointer"
            >
              {backendMode === 'firebase' ? 'View setup details →' : 'Connect cloud database →'}
            </button>
          </div>
        </PanelCard>

        {/* recent inquiries */}
        <PanelCard title="Latest inquiries" sub="Newest traveller requests" action={
          <button type="button" onClick={() => go('inquiries')} className="text-xs font-extrabold text-ember-600 hover:underline cursor-pointer">
            Open inbox →
          </button>
        }>
          {inquiries === null ? (
            <div className="space-y-2.5">{[...Array(3)].map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-night-900/5" />)}</div>
          ) : inquiries.length === 0 ? (
            <p className="rounded-xl border border-dashed border-night-900/15 px-4 py-8 text-center text-sm text-night-900/45">
              No inquiries yet — they appear the moment a traveller submits a request form.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {inquiries.slice(0, 4).map((inq) => (
                <li key={inq.id} className="flex items-center gap-3 rounded-xl border border-night-900/8 px-4 py-3">
                  <span className={cn('size-2 shrink-0 rounded-full', inq.status === 'new' ? 'bg-ember-500' : inq.status === 'read' ? 'bg-amber-400' : 'bg-emerald-500')} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-night-900">{inq.name}</span>
                    <span className="block truncate text-xs text-night-900/45">{inq.type === 'journey' ? inq.trek : inq.subject}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-night-900/35">
                    {new Date(inq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </PanelCard>
      </div>
    </div>
  );
}

/* ============================ Journey editor modal ============================ */

function blankJourney(): Journey {
  return {
    id: Date.now(),
    slug: '',
    name: '',
    destination: 'Nepal',
    region: 'everest',
    activity: 'trekking',
    duration: 10,
    difficulty: 'Moderate',
    maxAltitude: 4000,
    price: 999,
    rating: 5,
    reviews: 0,
    bestSeason: 'Mar – May, Sep – Nov',
    startPoint: 'Kathmandu',
    endPoint: 'Kathmandu',
    accommodation: 'Teahouses & hotels',
    transport: 'Private vehicle',
    groupSize: '2 – 12',
    image: 'https://images.pexels.com/photos/31372831/pexels-photo-31372831.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600&h=1000',
    gallery: [],
    shortDescription: '',
    description: [],
    highlights: [],
    itinerary: [{ day: 1, title: 'Arrival & briefing', desc: 'Detailed day-by-day plan is crafted with the client.', alt: 1400 }],
    included: ['Licensed guide & permits', 'Accommodation as stated', 'All ground transport'],
    excluded: ['International flights & visa', 'Travel insurance', 'Personal expenses & tips'],
    featured: false,
  };
}

export function JourneyEditor({
  journey, onClose, onSaved,
}: { journey: Journey | null; onClose: () => void; onSaved: () => void }) {
  const { push } = useToast();
  const isNew = journey === null;
  const [f, setF] = useState<Journey>(() => journey ?? blankJourney());
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<Journey>) => setF((x) => ({ ...x, ...patch }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return push('A journey name is required', 'info');
    if (!f.shortDescription.trim()) return push('Add a short description', 'info');
    setSaving(true);
    try {
      const slug = isNew ? slugify(f.name) || `journey-${Date.now()}` : f.slug;
      const built: Journey = {
        ...f,
        slug,
        gallery: f.gallery.length ? f.gallery : [{ src: f.image, alt: f.name }],
        description: f.description.length ? f.description : [f.shortDescription],
        highlights: f.highlights,
      };
      await saveJourney(built, isNew);
      push(isNew ? `“${built.name}” created and live` : `“${built.name}” updated`);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      push('Save failed — check database connection', 'info');
    } finally {
      setSaving(false);
    }
  };

  const num = (v: string) => (Number.isFinite(Number(v)) ? Number(v) : 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] overflow-y-auto bg-night-950/70 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={isNew ? 'Create journey' : `Edit ${f.name}`}
    >
      <motion.form
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-lift sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold text-night-900">{isNew ? 'New journey' : `Edit journey`}</h3>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full border border-night-900/12 transition hover:bg-night-900/5" aria-label="Close editor">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="je-name">Journey name *</label>
            <input id="je-name" className={fieldCls} value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Everest Base Camp Trek" />
            {isNew && f.name && <p className="mt-1 text-xs text-night-900/40">Slug: <span className="font-mono">{slugify(f.name)}</span></p>}
          </div>
          <div>
            <label className={labelCls} htmlFor="je-dest">Destination</label>
            <select id="je-dest" className={fieldCls} value={f.destination} onChange={(e) => set({ destination: e.target.value as Journey['destination'] })}>
              {DESTINATIONS_LIST.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="je-region">Region</label>
            <select id="je-region" className={fieldCls} value={f.region} onChange={(e) => set({ region: e.target.value as Journey['region'] })}>
              {REGION_OPTS.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="je-act">Activity</label>
            <select id="je-act" className={fieldCls} value={f.activity} onChange={(e) => set({ activity: e.target.value as Journey['activity'] })}>
              {ACTIVITY_FILTERS.map((a) => <option key={a.slug} value={a.slug}>{a.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="je-diff">Difficulty</label>
            <select id="je-diff" className={fieldCls} value={f.difficulty} onChange={(e) => set({ difficulty: e.target.value as Journey['difficulty'] })}>
              {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="je-dur">Duration (days)</label>
            <input id="je-dur" type="number" min={1} className={fieldCls} value={f.duration} onChange={(e) => set({ duration: num(e.target.value) })} />
          </div>
          <div>
            <label className={labelCls} htmlFor="je-alt">Max altitude (m)</label>
            <input id="je-alt" type="number" min={0} step={10} className={fieldCls} value={f.maxAltitude} onChange={(e) => set({ maxAltitude: num(e.target.value) })} />
          </div>
          <div>
            <label className={labelCls} htmlFor="je-price">Price per person (USD)</label>
            <input id="je-price" type="number" min={0} className={fieldCls} value={f.price} onChange={(e) => set({ price: num(e.target.value) })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="je-rating">Rating (0–5)</label>
              <input id="je-rating" type="number" min={0} max={5} step={0.1} className={fieldCls} value={f.rating} onChange={(e) => set({ rating: Math.min(5, num(e.target.value)) })} />
            </div>
            <div>
              <label className={labelCls} htmlFor="je-reviews">Reviews count</label>
              <input id="je-reviews" type="number" min={0} className={fieldCls} value={f.reviews} onChange={(e) => set({ reviews: num(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className={labelCls} htmlFor="je-season">Best season</label>
            <input id="je-season" className={fieldCls} value={f.bestSeason} onChange={(e) => set({ bestSeason: e.target.value })} />
          </div>
          <div>
            <label className={labelCls} htmlFor="je-group">Group size</label>
            <input id="je-group" className={fieldCls} value={f.groupSize} onChange={(e) => set({ groupSize: e.target.value })} />
          </div>
          <div>
            <label className={labelCls} htmlFor="je-start">Start point</label>
            <input id="je-start" className={fieldCls} value={f.startPoint} onChange={(e) => set({ startPoint: e.target.value })} />
          </div>
          <div>
            <label className={labelCls} htmlFor="je-end">End point</label>
            <input id="je-end" className={fieldCls} value={f.endPoint} onChange={(e) => set({ endPoint: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="je-img">Hero image URL</label>
            <input id="je-img" className={fieldCls} value={f.image} onChange={(e) => set({ image: e.target.value })} />
            {f.image && <img src={f.image} alt="" className="mt-2 h-24 w-40 rounded-lg object-cover" loading="lazy" />}
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="je-short">Short description *</label>
            <textarea id="je-short" rows={2} className={`${fieldCls} resize-none`} value={f.shortDescription} onChange={(e) => set({ shortDescription: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="je-desc">Long description (blank line between paragraphs)</label>
            <textarea
              id="je-desc" rows={4} className={fieldCls}
              value={f.description.join('\n\n')}
              onChange={(e) => set({ description: e.target.value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean) })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="je-high">Highlights (one per line)</label>
            <textarea
              id="je-high" rows={3} className={fieldCls}
              value={f.highlights.join('\n')}
              onChange={(e) => set({ highlights: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="je-accom">Accommodation</label>
            <input id="je-accom" className={fieldCls} value={f.accommodation} onChange={(e) => set({ accommodation: e.target.value })} />
          </div>
          <label className="flex items-center gap-3 rounded-xl border border-night-900/12 p-3.5 sm:col-span-2 cursor-pointer">
            <input type="checkbox" checked={!!f.featured} onChange={(e) => set({ featured: e.target.checked })} className="size-4.5 accent-ember-500" />
            <span>
              <span className="block text-sm font-bold text-night-900">Feature on homepage</span>
              <span className="text-xs text-night-900/45">Featured trekking journeys appear in the homepage grid</span>
            </span>
          </label>
        </div>

        <div className="mt-7 flex justify-end gap-3 border-t border-night-900/10 pt-5">
          <button type="button" onClick={onClose} className="rounded-xl border border-night-900/15 px-6 py-3 text-sm font-bold text-night-900/70 transition hover:bg-night-900/5 cursor-pointer">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-ember-500 px-7 py-3 text-sm font-extrabold text-white transition hover:bg-ember-600 disabled:opacity-60 cursor-pointer">
            {saving ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden /> : <Check className="size-4" aria-hidden />}
            {isNew ? 'Create journey' : 'Save changes'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

/* ============================ Journeys manager ============================ */

export function JourneysPanel() {
  const { journeys, refresh } = useJourneys();
  const { canEdit } = useAuth();
  const { push } = useToast();
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState<{ open: boolean; journey: Journey | null }>({ open: false, journey: null });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return journeys;
    return journeys.filter((j) => `${j.name} ${j.destination} ${j.region} ${j.activity}`.toLowerCase().includes(q));
  }, [journeys, query]);

  const remove = async (j: Journey) => {
    await deleteJourney(j.slug, !seedSlugs.has(j.slug));
    setConfirmDelete(null);
    await refresh();
    push(`“${j.name}” removed`);
  };

  const resetAll = async () => {
    await resetJourneys();
    setConfirmReset(false);
    await refresh();
    push('Catalogue restored to defaults');
  };

  return (
    <>
      <PanelCard
        title="Journeys manager"
        sub={canEdit ? `${journeys.length} live on the site — edits publish instantly` : `${journeys.length} live on the site — your role has view-only access`}
        action={
          canEdit ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-night-900/12 px-4 py-2.5 text-xs font-extrabold text-night-900/60 transition hover:border-rose-400 hover:text-rose-600 cursor-pointer"
              >
                <RefreshCw className="size-3.5" aria-hidden /> Reset catalogue
              </button>
              <button
                type="button"
                onClick={() => setEditor({ open: true, journey: null })}
                className="inline-flex items-center gap-2 rounded-xl bg-ember-500 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-ember-600 cursor-pointer"
              >
                <Plus className="size-4" aria-hidden /> Add journey
              </button>
            </div>
          ) : null
        }
      >
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-night-900/35" aria-hidden />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search journeys…" aria-label="Search journeys" className={`${fieldCls} pl-10`} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-night-900/8 text-[11px] font-extrabold uppercase tracking-[0.14em] text-night-900/40">
                <th className="pb-3 pr-4">Journey</th>
                <th className="pb-3 pr-4">Region</th>
                <th className="pb-3 pr-4">Duration</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 pr-4">Rating</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr key={j.slug} className="border-b border-night-900/5 transition-colors hover:bg-sand-100/60">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={j.image} alt="" className="size-11 rounded-lg object-cover" loading="lazy" />
                      <span>
                        <span className="flex items-center gap-1.5 font-bold text-night-900">
                          {j.name}
                          {j.featured && <Star className="size-3.5 fill-amber-400 text-amber-400" aria-label="Featured" />}
                        </span>
                        <span className="text-xs text-night-900/40">{j.destination} · {j.activity}{!seedSlugs.has(j.slug) && ' · custom'}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 capitalize text-night-900/60">{j.region}</td>
                  <td className="py-3 pr-4 font-semibold text-night-900/70">{j.duration}d</td>
                  <td className="py-3 pr-4 font-extrabold text-night-900">{formatPrice(j.price)}</td>
                  <td className="py-3 pr-4 text-night-900/70">{j.rating.toFixed(1)}</td>
                  <td className="py-3 text-right">
                    <div className={cn('inline-flex gap-1.5', !canEdit && 'hidden')}>
                      <button
                        type="button"
                        onClick={() => setEditor({ open: true, journey: j })}
                        className="grid size-9 place-items-center rounded-lg border border-night-900/10 text-night-900/60 transition hover:border-ember-500 hover:text-ember-600 cursor-pointer"
                        aria-label={`Edit ${j.name}`}
                      >
                        <Pencil className="size-4" aria-hidden />
                      </button>
                      {confirmDelete === j.slug ? (
                        <button
                          type="button"
                          onClick={() => remove(j)}
                          className="rounded-lg bg-rose-600 px-3 text-xs font-extrabold text-white transition hover:bg-rose-700 cursor-pointer"
                          aria-label={`Confirm delete ${j.name}`}
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(j.slug)}
                          className="grid size-9 place-items-center rounded-lg border border-night-900/10 text-night-900/60 transition hover:border-rose-500 hover:text-rose-600 cursor-pointer"
                          aria-label={`Delete ${j.name}`}
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-sm text-night-900/45">No journeys match “{query}”.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </PanelCard>

      {/* confirm reset */}
      <AnimatePresence>
        {confirmReset && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] grid place-items-center bg-night-950/70 p-4" onClick={() => setConfirmReset(false)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} className="max-w-sm rounded-3xl bg-white p-7 text-center" onClick={(e) => e.stopPropagation()}>
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-rose-100 text-rose-600"><RefreshCw className="size-5" aria-hidden /></span>
              <h3 className="mt-4 font-display text-xl font-semibold text-night-900">Reset the whole catalogue?</h3>
              <p className="mt-2 text-sm text-night-900/55">All custom journeys and edits will be removed. The original 15 journeys return.</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setConfirmReset(false)} className="rounded-xl border border-night-900/15 py-2.5 text-sm font-bold cursor-pointer">Cancel</button>
                <button type="button" onClick={resetAll} className="rounded-xl bg-rose-600 py-2.5 text-sm font-extrabold text-white hover:bg-rose-700 cursor-pointer">Reset</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editor.open && (
          <JourneyEditor journey={editor.journey} onClose={() => setEditor({ open: false, journey: null })} onSaved={() => void refresh()} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ============================ Inquiries inbox ============================ */

export function InquiriesPanel({ inquiries, reload }: { inquiries: Inquiry[] | null; reload: () => void }) {
  const { push } = useToast();
  const [open, setOpen] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'booking' | 'journey' | 'contact'>('all');

  const setStatus = async (id: string, status: Inquiry['status']) => {
    await updateInquiry(id, { status });
    reload();
  };
  const remove = async (id: string) => {
    await deleteInquiry(id);
    reload();
    push('Inquiry deleted');
  };

  const sendReply = async (inq: Inquiry) => {
    const body = (draft[inq.id] ?? '').trim();
    if (!body) return push('Write a reply first.', 'info');
    setSending(inq.id);
    try {
      await addReply(inq.id, body);
      // Open the admin's mail client pre-filled so the reply genuinely sends
      // from their own address (best deliverability, keeps the thread).
      window.location.href = mailtoLink(
        inq.email,
        `Re: ${inq.type === 'contact' ? inq.subject ?? 'Your enquiry' : inq.trek ?? 'Your journey'} — ${SITE.fullName}`,
        `${body}\n\n—\n${SITE.fullName}\n${SITE.phoneDisplay} · ${SITE.email}`,
      );
      setDraft((d) => ({ ...d, [inq.id]: '' }));
      reload();
      push('Reply saved & your email app opened');
    } finally {
      setSending(null);
    }
  };

  const shown = (inquiries ?? []).filter((i) => filter === 'all' || i.type === filter);
  const kindTone: Record<string, string> = {
    booking: 'bg-ember-100 text-ember-700',
    journey: 'bg-sky-100 text-sky-700',
    contact: 'bg-violet-100 text-violet-700',
  };

  return (
    <PanelCard title="Inbox" sub="Booking requests, journey inquiries and contact messages" action={
      <button type="button" onClick={reload} className="inline-flex items-center gap-2 rounded-xl border border-night-900/12 px-4 py-2.5 text-xs font-extrabold text-night-900/60 transition hover:text-ember-600 cursor-pointer">
        <RefreshCw className="size-3.5" aria-hidden /> Refresh
      </button>
    }>
      {/* delivery status + type filter */}
      <div className="mb-4 space-y-3">
        <div className={cn('flex items-start gap-2.5 rounded-xl px-4 py-3 text-xs font-semibold leading-relaxed',
          emailDeliveryReady ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800')}>
          <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
          {emailDeliveryReady
            ? <>Email delivery is live — every submission is emailed to <strong>{SITE.notifyEmail}</strong> the moment it arrives.</>
            : <>Submissions are saved here. To also receive them by email at <strong>{SITE.notifyEmail}</strong>, add a free Web3Forms key as <code className="font-mono">VITE_WEB3FORMS_KEY</code> (Settings tab).</>}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'booking', 'journey', 'contact'] as const).map((t) => (
            <button
              key={t} type="button" onClick={() => setFilter(t)}
              className={cn('rounded-full px-4 py-1.5 text-xs font-extrabold capitalize transition cursor-pointer',
                filter === t ? 'bg-night-950 text-white' : 'border border-night-900/12 text-night-900/55 hover:border-night-900/35')}
            >
              {t === 'all' ? 'All' : `${t}s`}
              <span className="ml-1.5 opacity-55">
                {t === 'all' ? inquiries?.length ?? 0 : (inquiries ?? []).filter((i) => i.type === t).length}
              </span>
            </button>
          ))}
        </div>
      </div>
      {inquiries === null ? (
        <div className="space-y-2.5">{[...Array(4)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-night-900/5" />)}</div>
      ) : shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-night-900/15 px-6 py-14 text-center">
          <InboxIcon className="mx-auto size-8 text-night-900/25" aria-hidden />
          <p className="mt-3 font-bold text-night-900/70">{filter === 'all' ? 'Inbox zero' : `No ${filter} requests`}</p>
          <p className="mt-1 text-sm text-night-900/45">New traveller requests land here in real time.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {shown.map((inq) => (
            <li key={inq.id} className="overflow-hidden rounded-2xl border border-night-900/8">
              <button type="button" onClick={() => setOpen(open === inq.id ? null : inq.id)} className="flex w-full flex-wrap items-center gap-3 px-4 py-3.5 text-left sm:px-5" aria-expanded={open === inq.id}>
                <span className={cn('size-2.5 shrink-0 rounded-full', inq.status === 'new' ? 'animate-pulse bg-ember-500' : inq.status === 'read' ? 'bg-amber-400' : 'bg-emerald-500')} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2">
                    <span className="font-bold text-night-900">{inq.name}</span>
                    <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider', kindTone[inq.type] ?? 'bg-night-900/5 text-night-900/50')}>
                      {inq.type}
                    </span>
                    {inq.emailed && <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600">✓ emailed</span>}
                  </span>
                  <span className="block truncate text-xs font-semibold text-ember-600">
                    {inq.trek ?? inq.subject}
                    {inq.date && ` · ${inq.date}`}
                    {inq.travelers && ` · ${inq.travelers} travellers`}
                  </span>
                </span>
                <span className="text-[11px] font-semibold text-night-900/35">
                  {new Date(inq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <ChevronDown className={cn('size-4 text-night-900/35 transition-transform', open === inq.id && 'rotate-180')} aria-hidden />
              </button>
              <AnimatePresence initial={false}>
                {open === inq.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="border-t border-night-900/8 bg-sand-100/60 px-5 py-4">
                      {/* contact details */}
                      <dl className="mb-3 grid gap-x-6 gap-y-1 text-xs sm:grid-cols-2">
                        {[['Email', inq.email], ['Phone', inq.phone], ['Country', inq.country], ['Preferred date', inq.date], ['Travellers', inq.travelers]]
                          .filter(([, v]) => v)
                          .map(([k, v]) => (
                            <div key={k} className="flex gap-2">
                              <dt className="font-bold text-night-900/45">{k}:</dt>
                              <dd className="truncate font-semibold text-night-900/75">
                                {k === 'Email' ? <a href={`mailto:${v}`} className="text-ember-600 hover:underline">{v}</a> : v}
                              </dd>
                            </div>
                          ))}
                      </dl>
                      <p className="whitespace-pre-wrap rounded-xl bg-white p-4 text-sm leading-relaxed text-night-900/70">{inq.message || '—'}</p>

                      {/* previous replies */}
                      {inq.replies?.length ? (
                        <div className="mt-3 space-y-2">
                          {inq.replies.map((r, i) => (
                            <div key={i} className="rounded-xl border-l-2 border-emerald-500 bg-emerald-50/70 px-4 py-2.5">
                              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                                Replied {new Date(r.at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <p className="mt-1 whitespace-pre-wrap text-sm text-emerald-950/75">{r.body}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {/* reply composer */}
                      <div className="mt-4">
                        <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-night-900/45" htmlFor={`rep-${inq.id}`}>
                          Reply to {inq.name.split(' ')[0]}
                        </label>
                        <textarea
                          id={`rep-${inq.id}`}
                          rows={3}
                          value={draft[inq.id] ?? ''}
                          onChange={(e) => setDraft((d) => ({ ...d, [inq.id]: e.target.value }))}
                          placeholder={`Hi ${inq.name.split(' ')[0]}, thanks for your interest in ${inq.trek ?? 'travelling with us'}…`}
                          className="w-full resize-none rounded-xl border border-night-900/12 bg-white px-4 py-3 text-sm transition focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/20"
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void sendReply(inq)}
                          disabled={sending === inq.id}
                          className="inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2 text-xs font-extrabold text-white transition hover:bg-ember-600 disabled:opacity-60 cursor-pointer"
                        >
                          <Send className="size-3.5" aria-hidden /> Send reply
                        </button>
                        {(['new', 'read', 'replied'] as const).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(inq.id, s)}
                            className={cn(
                              'rounded-full px-4 py-1.5 text-xs font-extrabold capitalize transition cursor-pointer',
                              inq.status === s ? 'bg-night-950 text-white' : 'border border-night-900/15 text-night-900/55 hover:border-night-900/40',
                            )}
                          >
                            {s}
                          </button>
                        ))}
                        <button type="button" onClick={() => remove(inq.id)} className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold text-rose-600 transition hover:bg-rose-50 cursor-pointer">
                          <Trash2 className="size-3.5" aria-hidden /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      )}
    </PanelCard>
  );
}

/* ============================ Settings / Setup ============================ */

export function SettingsPanel() {
  const { signOut } = useAuth();
  const { push } = useToast();
  const { refresh } = useJourneys();

  const steps = [
    'Create a project at console.firebase.google.com (free Spark plan)',
    'Create a Cloud Firestore database (start in production mode)',
    'Copy the web-app config values into a .env file (see .env.example)',
    'Paste the Firestore security rules from README.md',
    'Rebuild and deploy — staff accounts and content sync automatically',
  ];

  return (
    <div className="space-y-6">
      <PanelCard title="Database connection" sub="Cloud Firestore keeps content in sync across every device">
        <div className="mb-5 flex items-center justify-between rounded-xl bg-sand-100 px-4 py-3 text-sm">
          <span className="font-bold text-night-900/70">Current storage</span>
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold', backendMode === 'firebase' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700')}>
            <Database className="size-3.5" aria-hidden />
            {backendMode === 'firebase' ? 'Cloud Firestore' : 'Local database (this device)'}
          </span>
        </div>
        <ul className="space-y-2">
          {REQUIRED_ENV_KEYS.map((k) => {
            const ok = !missingEnvKeys.includes(k);
            return (
              <li key={k} className="flex items-center gap-3 text-sm">
                <span className={cn('grid size-6 place-items-center rounded-full', ok ? 'bg-emerald-100 text-emerald-600' : 'bg-night-900/6 text-night-900/35')}>
                  {ok ? <Check className="size-3.5" aria-hidden /> : <X className="size-3.5" aria-hidden />}
                </span>
                <code className="font-mono text-xs font-bold text-night-900/70">{k}</code>
                <span className="text-xs text-night-900/35">{ok ? 'configured' : 'missing'}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-5 rounded-xl border border-night-900/10 bg-night-950/95 p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-ember-400">Go live in 6 steps</p>
          <ol className="mt-3 space-y-2">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-[13px] font-medium leading-relaxed text-white/70">
                <span className="font-mono text-xs font-bold text-white/35">{String(i + 1).padStart(2, '0')}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </PanelCard>

      <PanelCard title="Email notifications" sub="Where booking & inquiry emails are delivered">
        <div className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-sand-100 px-4 py-3">
            <span className="font-bold text-night-900/70">Notification inbox</span>
            <code className="font-mono text-xs font-bold text-ember-600">{SITE.notifyEmail}</code>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-sand-100 px-4 py-3">
            <span className="font-bold text-night-900/70">Delivery status</span>
            <span className={cn('rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider',
              emailDeliveryReady ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
              {emailDeliveryReady ? 'Live — emails sending' : 'Not configured'}
            </span>
          </div>
          {!emailDeliveryReady && (
            <div className="rounded-xl border border-night-900/10 bg-night-950/95 p-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-ember-400">Turn on email delivery (free, 2 min)</p>
              <ol className="mt-3 space-y-2">
                {[
                  'Go to web3forms.com and enter your admin email — a free access key is emailed to you',
                  'Add it to .env as VITE_WEB3FORMS_KEY=your-key',
                  'Optionally set VITE_NOTIFY_EMAIL to the inbox that should receive submissions',
                  'Rebuild — every booking & inquiry now arrives in that inbox instantly',
                ].map((s, i) => (
                  <li key={i} className="flex gap-3 text-[13px] font-medium leading-relaxed text-white/70">
                    <span className="font-mono text-xs font-bold text-white/35">{String(i + 1).padStart(2, '0')}</span>{s}
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-[11px] leading-relaxed text-white/40">
                Until then every submission is still captured in the Inquiries inbox — nothing is ever lost.
              </p>
            </div>
          )}
        </div>
      </PanelCard>

      <PanelCard title="Danger zone" sub="Irreversible maintenance actions">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={async () => { await resetJourneys(); await refresh(); push('Catalogue restored'); }}
            className="inline-flex items-center gap-2 rounded-xl border border-night-900/15 px-5 py-3 text-sm font-extrabold text-night-900/70 transition hover:border-amber-500 hover:text-amber-600 cursor-pointer"
          >
            <RefreshCw className="size-4" aria-hidden /> Restore default catalogue
          </button>
          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex items-center gap-2 rounded-xl bg-night-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-ember-600 cursor-pointer"
          >
            <LogOut className="size-4" aria-hidden /> Sign out
          </button>
        </div>
      </PanelCard>
    </div>
  );
}
