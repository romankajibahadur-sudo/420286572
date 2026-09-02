import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { listGallery } from '../lib/db';
import type { GalleryImage } from '../data/gallery';
import { seedGallery } from '../data/gallery';
import { useLockBody, useSeo } from '../lib/hooks';
import { PageHero, EmptyState, Reveal } from '../components/ui';
import { cn } from '../utils/cn';
import { pex } from '../lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function GalleryPage() {
  useSeo(
    'Gallery — Photographs from the Himalaya | Ascent Himalaya',
    'A visual journey through Everest, Annapurna, Langtang and Mustang — photographs from our guides and travellers.',
  );

  const [images, setImages] = useState<GalleryImage[]>(seedGallery);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [index, setIndex] = useState<number | null>(null);
  useLockBody(index !== null);

  useEffect(() => {
    listGallery()
      .then(setImages)
      .catch(() => setImages(seedGallery))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(images.map((i) => i.category)))],
    [images],
  );

  const shown = useMemo(
    () => (filter === 'All' ? images : images.filter((i) => i.category === filter)),
    [images, filter],
  );

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? null : (i + dir + shown.length) % shown.length)),
    [shown.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, close, step]);

  const active = index !== null ? shown[index] : null;

  return (
    <main>
      <PageHero
        image={pex(31372831, 1920, 800)}
        overline="Gallery"
        title="Photographs from the trail"
        sub="Frames captured by our guides and travellers across Nepal, Bhutan and the high Himalaya."
      />

      <section className="container-x py-14 lg:py-20" aria-label="Photo gallery">
        {/* category filter */}
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { setFilter(c); setIndex(null); }}
              className={cn(
                'shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 cursor-pointer',
                filter === c
                  ? 'bg-night-950 text-white shadow-lift'
                  : 'border border-night-900/12 bg-white text-night-900/60 hover:border-night-900/35 hover:text-night-900',
              )}
            >
              {c}
              {c !== 'All' && (
                <span className="ml-1.5 text-[11px] opacity-50">{images.filter((i) => i.category === c).length}</span>
              )}
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm font-semibold text-night-900/50" aria-live="polite">
          {loading ? 'Loading photographs…' : `${shown.length} ${shown.length === 1 ? 'photograph' : 'photographs'}`}
        </p>

        {loading ? (
          <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-night-900/6" />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No photographs here yet"
              text="This category is empty. Try another collection, or check back soon — we add new frames after every departure."
              actionLabel="View all photos"
              actionTo="/gallery"
            />
          </div>
        ) : (
          /* masonry columns */
          <motion.div layout className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4">
            <AnimatePresence mode="popLayout">
              {shown.map((img, i) => (
                <motion.button
                  key={img.id}
                  layout
                  type="button"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.45, ease: EASE, delay: Math.min(i * 0.03, 0.3) }}
                  onClick={() => setIndex(i)}
                  className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl bg-night-900/5 text-left"
                  aria-label={`Open ${img.title}`}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-night-950/85 via-night-950/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                  <span className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-ember-300">{img.category}</span>
                    <span className="mt-1 block font-display text-lg font-medium leading-snug text-white">{img.title}</span>
                  </span>
                  <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-night-900 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100" aria-hidden>
                    <Expand className="size-4" />
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <Reveal className="mt-14 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-night-900/15 bg-white/60 px-6 py-10 text-center">
          <Camera className="size-7 text-ember-500" aria-hidden />
          <p className="font-display text-xl text-night-900">Travelled with us?</p>
          <p className="max-w-md text-sm leading-relaxed text-night-900/55">
            Send us your best frames — we credit every photographer and feature the finest shots in this gallery.
          </p>
          <a
            href="/#/contact"
            className="mt-2 rounded-full bg-ember-500 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-ember-600"
          >
            Submit your photos
          </a>
        </Reveal>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[115] flex flex-col bg-night-950/97 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            onClick={close}
          >
            <div className="container-x flex items-center justify-between py-5">
              <span className="text-sm font-semibold text-white/60">
                {(index ?? 0) + 1} <span className="text-white/30">/ {shown.length}</span>
              </span>
              <button
                type="button"
                onClick={close}
                className="grid size-11 place-items-center rounded-full border border-white/15 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close gallery"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="flex flex-1 items-center justify-center px-4 pb-2" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.figure
                  key={active.id}
                  initial={{ opacity: 0, scale: 0.96, x: 24 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.97, x: -24 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70) step(1);
                    else if (info.offset.x > 70) step(-1);
                  }}
                  className="max-h-full text-center"
                >
                  <img
                    src={active.src}
                    alt={active.title}
                    className="mx-auto max-h-[62vh] w-auto max-w-full rounded-2xl object-contain shadow-lift"
                    draggable={false}
                  />
                  <figcaption className="mx-auto mt-5 max-w-xl">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ember-400">{active.category}</span>
                    <p className="mt-1.5 font-display text-xl font-medium text-white">{active.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/55">{active.caption}</p>
                    {active.credit && <p className="mt-2 text-xs text-white/35">Photo · {active.credit}</p>}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="pb-7" onClick={(e) => e.stopPropagation()}>
              <div className="mx-auto flex w-fit items-center gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="grid size-12 place-items-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="size-5" aria-hidden />
                </button>
                <div className="no-scrollbar flex max-w-[55vw] gap-2 overflow-x-auto px-1 py-1">
                  {shown.map((img, i) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={img.title}
                      className={cn(
                        'size-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300',
                        i === index ? 'border-ember-400 opacity-100' : 'border-transparent opacity-45 hover:opacity-80',
                      )}
                    >
                      <img src={img.src} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="grid size-12 place-items-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
                  aria-label="Next photo"
                >
                  <ChevronRight className="size-5" aria-hidden />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
