import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck, Bus, Calendar, Check, ChevronDown, ChevronRight, Clock, Flag, Gauge, Hotel, MapPin,
  MessageCircle, Minus, Mountain, Phone, Plus, Quote, ShieldCheck, Star, Users, X,
} from 'lucide-react';

const ShieldCheckV = ShieldCheck;
const BadgeCheckV = BadgeCheck;
import { useJourneys } from '../data/store';
import { reviewsFor } from '../data/reviews';
import type { ItineraryDay } from '../data/types';
import { useSeo } from '../lib/hooks';
import { SITE } from '../lib/site';
import { difficultyTone, formatAlt, formatPrice, initials } from '../lib/utils';
import { cn } from '../utils/cn';
import { Button, EmptyState, Reveal, SectionHeading, Stagger, StaggerItem, Stars } from '../components/ui';
import { Gallery } from '../components/Gallery';
import { InquiryForm } from '../components/InquiryForm';
import { TrekCard } from '../components/TrekCard';

const EASE = [0.22, 1, 0.36, 1] as const;
const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/* ---------------- Day-by-day itinerary accordion ---------------- */

function Itinerary({ days }: { days: ItineraryDay[] }) {
  const [open, setOpen] = useState<number>(0);
  const allOpen = open === -1;
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-semibold text-night-900/50">{days.length} days · door to door</p>
        <button
          type="button"
          onClick={() => setOpen(allOpen ? 0 : -1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-ember-600 transition hover:text-ember-700 cursor-pointer"
        >
          {allOpen ? <Minus className="size-3.5" aria-hidden /> : <Plus className="size-3.5" aria-hidden />}
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      <ol className="space-y-3">
        {days.map((d, i) => {
          const isOpen = allOpen || open === i;
          return (
            <li key={d.day} className="overflow-hidden rounded-2xl border border-night-900/8 bg-white shadow-card transition-shadow hover:shadow-lift">
              <button
                type="button"
                onClick={() => setOpen(allOpen ? i : isOpen ? -2 : i)}
                aria-expanded={isOpen}
                className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 p-4 text-left sm:p-5"
              >
                <span className={cn(
                  'rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold transition-colors',
                  isOpen ? 'bg-ember-500 text-white' : 'bg-night-900/5 text-night-900/60',
                )}>
                  {String(d.day).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className={cn('block truncate text-[15px] font-bold', isOpen ? 'text-night-900' : 'text-night-900/85')}>
                    Day {d.day} — {d.title}
                  </span>
                  {d.alt && (
                    <span className="mt-0.5 block text-xs font-medium text-night-900/45">
                      Max altitude {d.alt.toLocaleString()} m
                    </span>
                  )}
                </span>
                <ChevronDown className={cn('size-5 shrink-0 text-night-900/35 transition-transform duration-300', isOpen && 'rotate-180 text-ember-500')} aria-hidden />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <div className="border-t border-night-900/6 px-5 py-4 pl-[4.4rem] pr-6 text-sm leading-relaxed text-night-900/60 sm:pl-[4.6rem]">
                      {d.desc}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------------- Elevation profile (route visual, map-ready) ---------------- */

function ElevationProfile({ days }: { days: ItineraryDay[] }) {
  const alts = useMemo(() => {
    let last = 1400;
    return days.map((d) => {
      if (d.alt) last = d.alt;
      return last;
    });
  }, [days]);

  const W = 660, H = 220, PADX = 18, PADY = 26;
  const min = Math.min(...alts);
  const max = Math.max(...alts);
  const range = Math.max(max - min, 1);
  const px = (i: number) => PADX + (i * (W - PADX * 2)) / Math.max(alts.length - 1, 1);
  const py = (a: number) => H - PADY - ((a - min) / range) * (H - PADY * 2 - 18);
  const line = alts.map((a, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(a).toFixed(1)}`).join(' ');
  const area = `${line} L${px(alts.length - 1)},${H - PADY} L${px(0)},${H - PADY} Z`;
  const peakIdx = alts.indexOf(max);

  return (
    <div className="rounded-3xl border border-night-900/8 bg-night-950 p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Route elevation profile</h3>
          <p className="text-xs text-white/45">Sleeping-altitude style acclimatisation — live map integration ready</p>
        </div>
        <div className="flex gap-4 text-xs font-semibold text-white/55">
          <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-ember-400" /> Day-by-day altitude</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-5 w-full" role="img" aria-label={`Elevation profile from ${min} to ${max} metres`}>
        <defs>
          <linearGradient id="altFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2692e" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f2692e" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={PADX} x2={W - PADX} y1={H * f} y2={H * f} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 6" />
        ))}
        <path d={area} fill="url(#altFill)" />
        <path d={line} fill="none" stroke="#f2692e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {[0, Math.floor(alts.length / 2), peakIdx, alts.length - 1]
          .filter((v, i, arr) => arr.indexOf(v) === i)
          .map((i) => (
            <g key={i}>
              <circle cx={px(i)} cy={py(alts[i])} r={i === peakIdx ? 6 : 4} fill="#0b1218" stroke={i === peakIdx ? '#ffb38a' : '#f2692e'} strokeWidth="2.5" />
              <text x={px(i)} y={py(alts[i]) - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(255,255,255,0.75)">
                {alts[i].toLocaleString()} m
              </text>
              <text x={px(i)} y={H - 8} textAnchor="middle" fontSize="10" fontWeight="600" fill="rgba(255,255,255,0.4)">
                Day {days[i].day}
              </text>
            </g>
          ))}
      </svg>
      <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-xs text-white/50">
        <MapPin className="size-4 shrink-0 text-ember-400" aria-hidden />
        Interactive route map with GPS waypoints ships with every booking — Mapbox / Google Maps layer ready to connect.
      </div>
    </div>
  );
}

/* ---------------- The page ---------------- */

export default function TrekDetail() {
  const { slug } = useParams();
  const { journeys } = useJourneys();
  const j = journeys.find((x) => x.slug === (slug ?? ''));
  const tripReviews = useMemo(() => (j ? reviewsFor(j.slug) : []), [j]);
  const inquiryRef = useRef<HTMLDivElement>(null);
  const [inquiryVisible, setInquiryVisible] = useState(false);

  useSeo(
    j ? `${j.name} — ${j.duration} Days | Ascent Himalaya` : 'Journey not found | Ascent Himalaya',
    j?.shortDescription,
  );

  useEffect(() => {
    const el = document.getElementById('inquiry');
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInquiryVisible(e.isIntersecting), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [slug, j]);

  if (!j) {
    return (
      <main className="container-x flex min-h-screen items-center pt-24">
        <EmptyState
          title="We couldn't find that journey"
          text="It may have been renamed or retired. Browse the full collection of treks, tours and expeditions instead."
          actionLabel="Browse all journeys"
          actionTo="/treks"
        />
      </main>
    );
  }

  const related = journeys.filter((x) => x.slug !== j.slug && x.region === j.region).slice(0, 3);
  const facts = [
    { icon: Clock, label: 'Duration', value: `${j.duration} days` },
    { icon: Gauge, label: 'Difficulty', value: j.difficulty },
    { icon: Mountain, label: 'Highest point', value: formatAlt(j.maxAltitude) },
    { icon: Calendar, label: 'Best season', value: j.bestSeason },
    { icon: MapPin, label: 'Starts', value: j.startPoint },
    { icon: Flag, label: 'Ends', value: j.endPoint },
    { icon: Hotel, label: 'Accommodation', value: j.accommodation },
    { icon: Bus, label: 'Transport', value: j.transport },
  ];

  const meta = [
    { icon: Clock, text: `${j.duration} days` },
    { icon: Mountain, text: formatAlt(j.maxAltitude) },
    { icon: Calendar, text: j.bestSeason },
    { icon: Users, text: j.groupSize },
  ];

  return (
    <main className="pb-24 lg:pb-0">
      {/* ---------- Hero ---------- */}
      <header className="relative flex min-h-[74vh] flex-col justify-end overflow-hidden bg-night-950">
        <motion.img
          key={j.slug}
          src={j.image}
          alt={j.name}
          initial={{ scale: 1.14 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: EASE }}
          className="absolute inset-0 size-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night-950/55 via-night-950/20 to-night-950/90" aria-hidden />
        <div className="container-x relative z-10 pb-12 pt-36">
          <Reveal>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-white/55">
              <Link to="/" className="transition hover:text-white">Home</Link>
              <ChevronRight className="size-3" aria-hidden />
              <Link to="/treks" className="transition hover:text-white">Journeys</Link>
              <ChevronRight className="size-3" aria-hidden />
              <span className="text-ember-300">{j.name}</span>
            </nav>
            <h1 className="text-shadow-hero mt-4 max-w-3xl font-display text-[clamp(2.3rem,6vw,4.4rem)] font-medium leading-[1.02] tracking-tight text-white">
              {j.name}
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/75">{j.shortDescription}</p>
          </Reveal>

          <Reveal delay={0.15} className="mt-7 flex flex-wrap items-center gap-2.5">
            {meta.map((m) => (
              <span key={m.text} className="glass-dark inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[13px] font-bold text-white">
                <m.icon className="size-4 text-ember-400" aria-hidden />
                {m.text}
              </span>
            ))}
            <span className={cn('inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-bold', difficultyTone[j.difficulty])}>
              <Gauge className="size-4" aria-hidden />
              {j.difficulty}
            </span>
            <span className="glass-dark inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[13px] font-bold text-white">
              <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
              {j.rating} · {j.reviews} reviews
            </span>
          </Reveal>

          <Reveal delay={0.25} className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" to={`/booking?trek=${j.slug}`} icon>
              Book This Journey
            </Button>
            <Button variant="outline-light" size="lg" onClick={() => scrollToId('itinerary')}>
              See the itinerary
            </Button>
          </Reveal>
        </div>
        <div className="prayer-strip absolute bottom-0 left-0 h-1 w-full opacity-80" aria-hidden />
      </header>

      {/* ---------- Body ---------- */}
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:py-20">
        <div className="min-w-0 space-y-16">
          {/* Overview */}
          <section aria-label="Overview" className="scroll-mt-24">
            <SectionHeading overline="The journey" title="Overview" />
            <div className="mt-6 space-y-5 leading-relaxed text-night-900/70">
              {j.description.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Stagger className="mt-8 grid gap-3 sm:grid-cols-2">
              {j.highlights.map((h) => (
                <StaggerItem key={h}>
                  <div className="flex items-start gap-3 rounded-2xl border border-night-900/8 bg-white p-4">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ember-500/12 text-ember-600">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    <span className="text-sm font-semibold leading-snug text-night-900/80">{h}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            {/* Quick facts */}
            <Reveal className="mt-10 rounded-3xl border border-night-900/8 bg-white p-6 shadow-card sm:p-8">
              <h3 className="font-display text-xl font-semibold text-night-900">Quick facts</h3>
              <dl className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                {facts.map((f) => (
                  <div key={f.label} className="flex gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sand-100 text-ember-600">
                      <f.icon className="size-5" aria-hidden />
                    </span>
                    <span>
                      <dt className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-night-900/40">{f.label}</dt>
                      <dd className="mt-0.5 text-[13px] font-bold leading-snug text-night-900">{f.value}</dd>
                    </span>
                  </div>
                ))}
              </dl>
            </Reveal>
          </section>

          {/* Itinerary */}
          <section id="itinerary" aria-label="Itinerary" className="scroll-mt-24">
            <SectionHeading overline="Day by day" title="The itinerary" />
            <div className="mt-8">
              <Itinerary days={j.itinerary} />
            </div>
            <Reveal className="mt-8">
              <ElevationProfile days={j.itinerary} />
            </Reveal>
          </section>

          {/* Included / Excluded */}
          <section aria-label="What's included" className="scroll-mt-24">
            <SectionHeading overline="No surprises" title="What's included" />
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Reveal className="rounded-3xl border border-emerald-600/15 bg-emerald-50/60 p-6 sm:p-7">
                <h3 className="flex items-center gap-2.5 font-display text-lg font-semibold text-emerald-900">
                  <span className="grid size-8 place-items-center rounded-full bg-emerald-600 text-white"><Check className="size-4.5" aria-hidden /></span>
                  Included
                </h3>
                <ul className="mt-5 space-y-3">
                  {j.included.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-medium leading-snug text-emerald-950/75">
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1} className="rounded-3xl border border-rose-500/15 bg-rose-50/60 p-6 sm:p-7">
                <h3 className="flex items-center gap-2.5 font-display text-lg font-semibold text-rose-900">
                  <span className="grid size-8 place-items-center rounded-full bg-rose-500 text-white"><X className="size-4.5" aria-hidden /></span>
                  Not included
                </h3>
                <ul className="mt-5 space-y-3">
                  {j.excluded.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-medium leading-snug text-rose-950/70">
                      <X className="mt-0.5 size-4 shrink-0 text-rose-500" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>

          {/* Gallery */}
          <section aria-label="Gallery" className="scroll-mt-24">
            <SectionHeading overline="In pictures" title="From the trail" />
            <div className="mt-8">
              <Gallery images={j.gallery} />
            </div>
          </section>

          {/* Reviews */}
          <section aria-label="Reviews" className="scroll-mt-24">
            <SectionHeading overline="Traveller reviews" title={`What trekkers say`} />
            <div className="mt-8 flex items-center gap-5 rounded-3xl border border-night-900/8 bg-white p-6 shadow-card">
              <span className="font-display text-5xl font-semibold text-night-900">{j.rating}</span>
              <div>
                <Stars rating={j.rating} />
                <p className="mt-1 text-sm font-semibold text-night-900/55">{j.reviews} verified traveller reviews</p>
              </div>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {tripReviews.map((r) => (
                <Reveal key={r.id} className="flex h-full flex-col rounded-3xl border border-night-900/8 bg-white p-6">
                  <Quote className="size-6 text-ember-500/60" aria-hidden />
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-night-900/70">“{r.text}”</p>
                  <div className="mt-5 flex items-center gap-3 border-t border-night-900/8 pt-4">
                    <span className="grid size-10 place-items-center rounded-full bg-night-900 font-display text-xs font-semibold text-ember-300">
                      {initials(r.name)}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold text-night-900">{r.name}</span>
                      <span className="block text-xs text-night-900/45">{r.country} · {r.date}</span>
                    </span>
                    <Stars rating={r.rating} />
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </div>

        {/* ---------- Sticky booking sidebar ---------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start" ref={inquiryRef}>
          <div id="inquiry" className="scroll-mt-28 rounded-[1.75rem] border border-night-900/10 bg-white p-6 shadow-lift sm:p-7">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-night-900/40">From</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-semibold text-night-900">{formatPrice(j.price)}</span>
                  <span className="text-xs font-semibold text-night-900/45">/ person</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-3 py-1.5 text-xs font-extrabold text-night-900">
                <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
                {j.rating}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 border-y border-night-900/8 py-4 text-center">
              {[
                { v: `${j.duration}d`, l: 'Duration' },
                { v: formatAlt(j.maxAltitude), l: 'Max altitude' },
                { v: j.difficulty, l: 'Grade' },
              ].map((x) => (
                <div key={x.l}>
                  <span className="block text-sm font-extrabold text-night-900">{x.v}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-night-900/40">{x.l}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 rounded-2xl bg-sand-100 p-4">
              {[
                { icon: ShieldCheckV, text: `${formatPrice(Math.round(j.price * 0.2))} deposit (20%) locks your permits & crew` },
                { icon: BadgeCheckV, text: 'Fixed-price guarantee — the quote you accept is the price you pay. No hidden fees.' },
              ].map((r, i) => (
                <p key={i} className="flex items-start gap-2.5 text-[12px] font-semibold leading-snug text-night-900/60">
                  <r.icon className="mt-0.5 size-3.5 shrink-0 text-emerald-600" aria-hidden />
                  {r.text}
                </p>
              ))}
            </div>

            <Link
              to={`/booking?trek=${j.slug}`}
              className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-night-950 py-3.5 text-sm font-extrabold text-white transition-all duration-300 hover:bg-ember-500"
            >
              Book this journey
              <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
            <p className="mt-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-night-900/35">or ask a question first</p>

            <div className="mt-3">
              <InquiryForm trekName={j.name} compact />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-600/25 bg-emerald-50 py-2.5 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100"
              >
                <MessageCircle className="size-4" aria-hidden />
                WhatsApp
              </a>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-night-900/12 py-2.5 text-xs font-extrabold text-night-900/70 transition hover:border-ember-500 hover:text-ember-600"
              >
                <Phone className="size-4" aria-hidden />
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-night-900/8 bg-sand-100 p-4 text-xs leading-relaxed text-night-900/55">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-ember-500/15 text-ember-600">
              <Clock className="size-3.5" aria-hidden />
            </span>
            Private & custom departures daily from March–June and September–December. Ask about flexible dates within 24h.
          </div>
        </aside>
      </div>

      {/* ---------- Related ---------- */}
      {related.length > 0 && (
        <section className="container-x pb-24" aria-label="Related journeys">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading overline="Keep exploring" title="More in this region" />
          </div>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <StaggerItem key={r.slug}>
                <TrekCard journey={r} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* ---------- Mobile sticky CTA ---------- */}
      <AnimatePresence>
        {!inquiryVisible && (
          <motion.div
            initial={{ y: 90 }}
            animate={{ y: 0 }}
            exit={{ y: 90 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-night-900/10 bg-white/95 p-3 shadow-[0_-10px_30px_-12px_rgba(6,11,16,0.25)] backdrop-blur-xl lg:hidden"
          >
            <div className="container-x flex items-center justify-between gap-3 px-0">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-night-900/40">From</span>
                <span className="block font-display text-xl font-semibold leading-none text-night-900">{formatPrice(j.price)}</span>
              </div>
              <Button size="md" onClick={() => scrollToId('inquiry')} className="flex-1 justify-center sm:flex-none">
                Request This Journey
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
