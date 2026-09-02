import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, RotateCcw, Route } from 'lucide-react';
import { PageHero, CardSkeleton, EmptyState } from '../components/ui';
import { SearchPanel } from '../components/SearchPanel';
import { FilterSelect } from '../components/FilterSelect';
import { TrekCard } from '../components/TrekCard';
import { DURATION_FILTERS, BUDGET_FILTERS } from '../data/treks';
import { useJourneys } from '../data/store';
import { regions } from '../data/content';
import { useSeo } from '../lib/hooks';
import { pex } from '../lib/utils';

const DIFFICULTIES = ['Easy', 'Moderate', 'Challenging', 'Strenuous'].map((d) => ({ slug: d.toLowerCase(), label: d }));
const REGION_OPTS = regions.map((r) => ({ slug: r.slug, label: r.name }));
const KEYS = ['destination', 'activity', 'duration', 'budget', 'region', 'difficulty'] as const;

const SORTS = [
  { slug: 'featured', label: 'Recommended' },
  { slug: 'price-asc', label: 'Price · low to high' },
  { slug: 'price-desc', label: 'Price · high to low' },
  { slug: 'rating', label: 'Top rated' },
  { slug: 'duration-asc', label: 'Shortest first' },
  { slug: 'duration-desc', label: 'Longest first' },
];

export default function TreksPage() {
  useSeo('Treks, Tours & Expeditions | Ascent Himalaya', 'Browse all Himalayan journeys — filter by destination, activity, duration, budget, region and difficulty.');
  const [params, setParams] = useSearchParams();
  const { journeys } = useJourneys();
  const [sort, setSort] = useState('featured');
  const [loading, setLoading] = useState(true);

  // URL is the single source of truth for filters (shareable + back-button safe)
  const applied = useMemo(() => {
    const o: Record<(typeof KEYS)[number], string> = {
      destination: '', activity: '', duration: '', budget: '', region: '', difficulty: '',
    };
    KEYS.forEach((k) => (o[k] = params.get(k) ?? ''));
    return o;
  }, [params]);

  // Simulated fetch shimmer whenever the query changes
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, [applied]);

  const patchMany = (obj: Partial<Record<(typeof KEYS)[number], string>>) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(obj).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
      return next;
    }, { replace: true });
  };

  const results = useMemo(() => {
    let list = [...journeys];
    if (applied.destination) list = list.filter((j) => j.destination.toLowerCase() === applied.destination);
    if (applied.activity) list = list.filter((j) => j.activity === applied.activity);
    if (applied.region) list = list.filter((j) => j.region === applied.region);
    if (applied.difficulty) list = list.filter((j) => j.difficulty.toLowerCase() === applied.difficulty);
    if (applied.duration) {
      const f = DURATION_FILTERS.find((d) => d.slug === applied.duration);
      if (f) list = list.filter(f.test);
    }
    if (applied.budget) {
      const f = BUDGET_FILTERS.find((b) => b.slug === applied.budget);
      if (f) list = list.filter(f.test);
    }
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
      case 'duration-asc': list.sort((a, b) => a.duration - b.duration); break;
      case 'duration-desc': list.sort((a, b) => b.duration - a.duration); break;
      default: list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || b.rating - a.rating);
    }
    return list;
  }, [applied, sort, journeys]);

  const activeCount = KEYS.filter((k) => applied[k]).length;
  const panelKey = [applied.destination, applied.activity, applied.duration, applied.budget].join('|');

  return (
    <main>
      <PageHero
        image={pex(37911662, 1920, 800)}
        overline="The full collection"
        title="Every journey, hand-built by locals"
        sub="Filter 15 treks, climbs, safaris and cultural odysseys — then talk to us and we'll tailor it around you."
      />

      <div className="container-x relative z-20 -mt-16">
        <SearchPanel
          key={panelKey}
          initial={applied}
          onSearch={(q) => patchMany(q)}
        />
      </div>

      <section className="container-x py-14 lg:py-16" aria-label="Journey results">
        {/* secondary filters */}
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <FilterSelect label="Region" icon={<Route className="size-4.5" />} value={applied.region} onChange={(v) => patchMany({ region: v })} options={REGION_OPTS} anyLabel="All regions" />
          <FilterSelect label="Difficulty" value={applied.difficulty} onChange={(v) => patchMany({ difficulty: v })} options={DIFFICULTIES} anyLabel="Any difficulty" />
          <div className="relative">
            <ArrowUpDown className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ember-500" aria-hidden />
            <label htmlFor="sort" className="sr-only">Sort journeys</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full appearance-none rounded-xl border border-night-900/10 bg-white py-[1.15rem] pl-10 pr-4 text-sm font-semibold text-night-900 transition hover:border-night-900/25 focus:border-ember-500 focus:outline-none cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.slug} value={s.slug}>{s.label}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => { setParams(new URLSearchParams(), { replace: true }); setSort('featured'); }}
            disabled={!activeCount && sort === 'featured'}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-night-900/12 px-5 py-2.5 text-sm font-bold text-night-900/60 transition-all hover:border-ember-500 hover:text-ember-600 disabled:cursor-not-allowed disabled:opacity-35 cursor-pointer"
          >
            <RotateCcw className="size-4" aria-hidden />
            Reset{activeCount ? ` (${activeCount})` : ''}
          </button>
        </div>

        {/* result count */}
        <div className="mt-8 flex items-center justify-between" aria-live="polite">
          <p className="text-sm font-semibold text-night-900/55">
            {loading ? 'Searching the mountains…' : (
              <>
                <span className="font-display text-lg font-semibold text-night-900">{results.length}</span>{' '}
                {results.length === 1 ? 'journey' : 'journeys'} found
              </>
            )}
          </p>
          <p className="hidden text-xs font-medium text-night-900/40 sm:block">Prices per person · includes all permits</p>
        </div>

        {/* grid */}
        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : results.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No journeys match that combination"
              text="Try widening a filter or two — or tell us what you're dreaming of and we'll build it as a private, tailor-made expedition."
              actionLabel="Ask us to build it"
              actionTo="/contact"
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {results.map((j) => (
                <motion.div
                  key={j.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 12 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <TrekCard journey={j} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </main>
  );
}
