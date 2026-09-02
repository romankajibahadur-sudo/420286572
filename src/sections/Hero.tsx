import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Award, ChevronDown, Mountain, Users } from 'lucide-react';
import { Button } from '../components/ui';
import { SearchPanel } from '../components/SearchPanel';
import { pex } from '../lib/utils';

const HERO_IMAGE = pex(20839113, 1920, 1080);
/**
 * Himalayan timelapse for the hero backdrop.
 * Tried in order — if one fails to stream, the next is attempted and the
 * poster image stays as the graceful final fallback. Swap in your own
 * hosted .mp4 here (H.264/AAC, ideally ≤ 15 MB, 1280–1920 px wide).
 */
const HERO_VIDEO_SOURCES = [
  'https://videos.pexels.com/video-files/8025691/8025691-uhd_3840_2160_24fps.mp4',
  'https://videos.pexels.com/video-files/8201470/8201470-uhd_3840_2160_30fps.mp4',
  'https://videos.pexels.com/video-files/6693764/6693764-uhd_4096_2160_24fps.mp4',
];

const FLOAT_CHIPS = [
  { icon: Mountain, top: '8,848 m', bottom: 'Everest — roof of the world', delay: '0s' },
  { icon: Users, top: '2,400+', bottom: 'travellers guided home safe', delay: '1.4s' },
  { icon: Award, top: '15+ years', bottom: 'of Himalayan expertise', delay: '2.8s' },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const [loadVideo, setLoadVideo] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '32%']);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  /**
   * Poster paints instantly at full priority; the timelapse is requested right
   * after mount (all devices) and crossfades in the moment it can play.
   * Skipped entirely when the visitor prefers reduced motion.
   */
  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setLoadVideo(true), 400);
    return () => window.clearTimeout(t);
  }, [reduce]);

  /* Enforce autoplay rules explicitly — the muted property must be set on the
     element itself for some browsers to allow programmatic playback. */
  useEffect(() => {
    if (!loadVideo) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const attempt = v.play();
    if (attempt) attempt.catch(() => { /* browser keeps it paused; poster stays */ });
  }, [loadVideo, srcIndex]);

  const handleVideoError = () => {
    setVideoReady(false);
    if (srcIndex < HERO_VIDEO_SOURCES.length - 1) setSrcIndex((i) => i + 1);
    else setVideoFailed(true);
  };

  return (
    <>
      <section ref={ref} className="relative flex min-h-svh flex-col overflow-hidden bg-night-950" aria-label="Welcome to Ascent Himalaya">
        {/* Cinematic backdrop — poster image, then timelapse video */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 -bottom-32" aria-hidden>
          <img
            src={HERO_IMAGE}
            alt="Dawn light over the snow-covered peaks of Nuptse and Everest in the Himalaya"
            className={`size-full object-cover transition-opacity duration-1000 ${
              videoReady ? 'opacity-0' : 'opacity-100 animate-kenburns'
            }`}
            fetchPriority="high"
          />
          {loadVideo && !videoFailed && (
            <video
              key={HERO_VIDEO_SOURCES[srcIndex]}
              ref={videoRef}
              src={HERO_VIDEO_SOURCES[srcIndex]}
              poster={HERO_IMAGE}
              muted
              autoPlay
              loop
              playsInline
              disablePictureInPicture
              controls={false}
              preload="auto"
              onCanPlay={() => setVideoReady(true)}
              onPlaying={() => setVideoReady(true)}
              onError={handleVideoError}
              className={`absolute inset-0 size-full scale-105 object-cover transition-opacity duration-[1500ms] ${
                videoReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-night-950/65 via-night-950/25 to-night-950/90" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-night-950/55 via-transparent to-transparent" aria-hidden />

        {/* Floating stat chips */}
        <div className="pointer-events-none absolute right-10 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-4 2xl:flex" aria-hidden>
          {FLOAT_CHIPS.map((c) => (
            <motion.div
              key={c.top}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="glass-dark pointer-events-auto flex w-56 items-center gap-3.5 rounded-2xl border border-white/15 p-4 animate-float"
                style={{ animationDelay: c.delay }}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ember-500/90 text-white">
                  <c.icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold leading-tight text-white">{c.top}</span>
                  <span className="block text-[11px] font-medium leading-snug text-white/60">{c.bottom}</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Copy */}
        <motion.div style={{ y: textY, opacity: fade }} className="container-x relative z-10 flex flex-1 flex-col justify-center pb-40 pt-32 sm:pb-44">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-10 bg-ember-400" aria-hidden />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-ember-300 sm:text-xs">
                Himalayan expeditions · est. 2009
              </span>
            </motion.div>

            <h1 className="text-shadow-hero mt-6 font-display text-[clamp(2.9rem,8.5vw,6.3rem)] font-medium leading-[0.98] tracking-tight text-white">
              <span className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                >
                  Adventure beyond
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.55, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                >
                  the <em className="font-light italic text-ember-300">ordinary.</em>
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
            >
              Discover the Himalaya, one unforgettable journey at a time — treks, climbs and cultural odysseys led by
              the local guides who were born beneath these peaks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-wrap items-center gap-3.5"
            >
              <Button to="/treks" size="lg" icon>
                Explore Treks
              </Button>
              <Button to="/booking" variant="outline-light" size="lg">
                Plan Your Trip
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="absolute bottom-40 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2.5 text-white/55 sm:flex"
          aria-hidden
        >
          <span className="text-[10px] font-extrabold uppercase tracking-[0.3em]">Scroll</span>
          <span className="flex h-10 w-6 items-start justify-center rounded-full border border-white/30 p-1.5">
            <motion.span
              animate={{ y: [0, 14, 0], opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="size-1.5 rounded-full bg-ember-400"
            />
          </span>
          <ChevronDown className="size-3.5 animate-bounce" />
        </motion.div>
      </section>

      {/* Adventure finder, overlapping the hero */}
      <div className="container-x relative z-20 -mt-28">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <SearchPanel />
          <p className="mt-4 text-center text-xs font-medium text-night-900/45">
            15 handcrafted journeys · instant filtering · honest prices, no hidden fees
          </p>
        </motion.div>
      </div>
    </>
  );
}
