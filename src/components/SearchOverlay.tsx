import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Compass, CornerDownLeft, FileText, Layers, MapPin, MountainSnow, Newspaper, Search, SearchX, X,
} from 'lucide-react';
import { useJourneys } from '../data/store';
import { buildIndex, highlight, searchIndex, type SearchGroup, type SearchHit } from '../lib/search';
import { useDebounce, useLockBody } from '../lib/hooks';
import { SITE } from '../lib/site';
import { cn } from '../utils/cn';

const GROUP_ICON: Record<SearchGroup, typeof MapPin> = {
  Journeys: MountainSnow,
  Destinations: MapPin,
  Regions: Layers,
  Activities: Compass,
  'Travel Guides': Newspaper,
  Pages: FileText,
};

const SUGGESTIONS = ['Everest', 'hotel', 'budget trek', 'wildlife safari', 'visa', 'best season'];

/** Renders text with the matched query terms visually emphasised. */
function Highlighted({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlight(text, query).map((part, i) =>
        part.hit ? (
          <mark key={i} className="rounded bg-ember-400/25 px-0.5 text-ember-200">{part.text}</mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { journeys } = useJourneys();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounced = useDebounce(query, 200);
  useLockBody(open);

  const index = useMemo(() => buildIndex(journeys), [journeys]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  // debounce feedback
  useEffect(() => {
    if (!query.trim()) return setSearching(false);
    setSearching(true);
    const t = setTimeout(() => setSearching(false), 220);
    return () => clearTimeout(t);
  }, [query, debounced]);

  const results = useMemo<SearchHit[]>(
    () => (debounced.trim().length < 2 ? [] : searchIndex(index, debounced, 12)),
    [index, debounced],
  );

  useEffect(() => setActive(0), [results.length]);

  const go = (hit: SearchHit) => {
    onClose();
    navigate(hit.to);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === 'Enter' && results[active]) { e.preventDefault(); go(results[active]); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // keep the active row in view while arrowing
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  // group while preserving relevance order
  const grouped = useMemo(() => {
    const map = new Map<SearchGroup, SearchHit[]>();
    results.forEach((r) => map.set(r.group, [...(map.get(r.group) ?? []), r]));
    return [...map.entries()];
  }, [results]);

  let idx = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[110] overflow-y-auto overscroll-contain bg-night-950/75 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Search the website"
        >
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto w-full max-w-2xl px-3 pb-10 pt-4 sm:px-5 sm:pt-20"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-night-900/97 shadow-lift sm:rounded-3xl">
              {/* input */}
              <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3.5 sm:gap-3 sm:px-5 sm:py-4">
                <Search className="size-5 shrink-0 text-ember-400" aria-hidden />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search treks, hotels, guides…"
                  className="min-w-0 flex-1 bg-transparent text-base font-medium text-white placeholder:text-white/35 focus:outline-none"
                  aria-label="Search"
                  aria-autocomplete="list"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                    className="grid size-7 shrink-0 place-items-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="hidden shrink-0 rounded-lg border border-white/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white/45 transition hover:bg-white/10 hover:text-white sm:block"
                  aria-label="Close search"
                >
                  Esc
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white sm:hidden"
                  aria-label="Close search"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>

              {/* results */}
              <div ref={listRef} className="max-h-[60vh] overflow-y-auto overscroll-contain p-2 sm:max-h-[55vh] sm:p-2.5">
                {searching ? (
                  <div className="space-y-2 p-1.5" aria-label="Searching" role="status">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-2xl p-2.5">
                        <div className="size-9 shrink-0 animate-pulse rounded-xl bg-white/10" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3.5 w-1/2 animate-pulse rounded bg-white/10" />
                          <div className="h-2.5 w-3/4 animate-pulse rounded bg-white/5" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <>
                    <p className="px-3 pb-1 pt-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/30" aria-live="polite">
                      {results.length} result{results.length === 1 ? '' : 's'}
                    </p>
                    {grouped.map(([group, items]) => {
                      const Ico = GROUP_ICON[group];
                      return (
                        <div key={group} className="mb-1">
                          <p className="px-3 pb-1 pt-2.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/35">{group}</p>
                          {items.map((r) => {
                            idx += 1;
                            const i = idx;
                            return (
                              <button
                                key={r.key}
                                data-idx={i}
                                type="button"
                                onMouseEnter={() => setActive(i)}
                                onClick={() => go(r)}
                                className={cn(
                                  'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors',
                                  active === i ? 'bg-white/10' : 'hover:bg-white/5',
                                )}
                              >
                                <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl transition-colors',
                                  active === i ? 'bg-ember-500 text-white' : 'bg-white/8 text-white/60')}>
                                  <Ico className="size-4.5" aria-hidden />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-semibold text-white">
                                    <Highlighted text={r.title} query={debounced} />
                                  </span>
                                  <span className="block truncate text-xs text-white/45">
                                    <Highlighted text={r.meta} query={debounced} />
                                  </span>
                                </span>
                                <CornerDownLeft className={cn('size-4 shrink-0 transition-opacity', active === i ? 'text-white/40 opacity-100' : 'opacity-0')} aria-hidden />
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </>
                ) : debounced.trim().length >= 2 ? (
                  <div className="px-5 py-12 text-center" role="status">
                    <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/6 text-white/40">
                      <SearchX className="size-6" aria-hidden />
                    </span>
                    <p className="mt-4 font-display text-lg text-white/85">No results for “{debounced}”</p>
                    <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-white/45">
                      Try a broader word, check the spelling, or browse by category below.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button key={s} type="button" onClick={() => setQuery(s)}
                          className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/60 transition hover:border-ember-400 hover:text-ember-300">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center sm:py-10">
                    <p className="text-sm font-medium text-white/50">
                      Search journeys, destinations, regions, activities, travel guides and pages.
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button key={s} type="button" onClick={() => setQuery(s)}
                          className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/60 transition hover:border-ember-400 hover:text-ember-300">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* footer */}
              <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-2.5 text-[11px] font-semibold text-white/35 sm:px-5 sm:py-3">
                <span className="hidden gap-4 sm:flex">
                  <span>↑↓ Navigate</span><span>↵ Open</span><span>Esc Close</span>
                </span>
                <span className="sm:hidden">Tap a result to open</span>
                <span className="truncate text-ember-400/80">{SITE.fullName}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
