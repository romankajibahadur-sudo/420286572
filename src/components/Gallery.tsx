import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useLockBody } from '../lib/hooks';
import { cn } from '../utils/cn';
import { Stagger, StaggerItem } from './ui';

type Img = { src: string; alt: string };

export function Gallery({ images }: { images: Img[] }) {
  const [index, setIndex] = useState<number | null>(null);
  useLockBody(index !== null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? null : (i + dir + images.length) % images.length)),
    [images.length],
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

  return (
    <>
      <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((img, i) => (
          <StaggerItem key={img.src + i} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block size-full overflow-hidden rounded-2xl"
              aria-label={`Open photo: ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className={cn(
                  'size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105',
                  i === 0 ? 'aspect-[4/3] md:aspect-auto md:min-h-[21rem]' : 'aspect-[4/3]',
                )}
              />
              <span className="absolute inset-0 bg-night-950/0 transition-colors duration-300 group-hover:bg-night-950/25" aria-hidden />
              <span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-white/90 text-night-900 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100" aria-hidden>
                <Expand className="size-4" />
              </span>
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Lightbox */}
      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-[115] flex flex-col bg-night-950/97 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label="Photo gallery"
            onClick={close}
          >
            <div className="container-x flex items-center justify-between py-5">
              <span className="text-sm font-semibold text-white/60">
                {index + 1} <span className="text-white/30">/ {images.length}</span>
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

            <div className="flex flex-1 items-center justify-center px-4 pb-4" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.figure
                  key={index}
                  initial={{ opacity: 0, scale: 0.96, x: 24 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.97, x: -24 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70) step(1);
                    else if (info.offset.x > 70) step(-1);
                  }}
                  className="max-h-full"
                >
                  <img
                    src={images[index].src}
                    alt={images[index].alt}
                    className="max-h-[68vh] w-auto max-w-full rounded-2xl object-contain shadow-lift"
                    draggable={false}
                  />
                  <figcaption className="mt-4 text-center text-sm text-white/60">{images[index].alt}</figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            {/* controls */}
            <div className="pb-8" onClick={(e) => e.stopPropagation()}>
              <div className="mx-auto flex w-fit items-center gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="grid size-12 place-items-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="size-5" aria-hidden />
                </button>
                <div className="no-scrollbar flex max-w-[50vw] gap-2 overflow-x-auto px-1 py-1">
                  {images.map((img, i) => (
                    <button
                      key={img.src + i}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Photo ${i + 1}`}
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
    </>
  );
}
