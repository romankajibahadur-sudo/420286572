import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Button, Icon, Reveal, SectionHeading, Stagger, StaggerItem } from '../components/ui';
import { stats, whyUs, STATS_IMAGE } from '../data/content';
import { useCountUp } from '../lib/hooks';

/* ---------------- Why choose us ---------------- */

export function WhyUs() {
  return (
    <section className="container-x py-24 lg:py-32" aria-label="Why choose Ascent Himalaya">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            overline="The Ascent difference"
            title={
              <>
                Why 2,400+ travellers <em className="italic text-ember-500">trust us</em> with their mountains
              </>
            }
            sub="We are not a booking platform. We are the team on the trail — guides, porters, cooks and planners who have spent 15 years refining every step of these journeys."
          />
          <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-3">
            <Button to="/about" variant="outline-dark" icon>
              Meet the team
            </Button>
            <Button to="/contact" icon>
              Talk to a guide
            </Button>
          </Reveal>
          <Reveal delay={0.25} className="mt-10 hidden lg:block">
            <div className="glass-dark flex items-center gap-4 rounded-2xl border border-night-900/5 bg-night-900 p-5 text-white">
              <span className="font-display text-4xl font-semibold text-ember-400">98.6%</span>
              <span className="text-sm leading-snug text-white/70">
                of travellers rate their journey 5 stars —
                <span className="block text-[11px] uppercase tracking-[0.18em] text-white/40">verified post-trip surveys</span>
              </span>
            </div>
          </Reveal>
        </div>

        <Stagger className="grid gap-4 sm:grid-cols-2">
          {whyUs.map((f) => (
            <StaggerItem key={f.title}>
              <div className="group h-full rounded-3xl border border-night-900/8 bg-white p-6 card-hover hover:-translate-y-1.5 hover:border-ember-500/30 hover:shadow-lift">
                <span className="grid size-12 place-items-center rounded-2xl bg-ember-500/10 text-ember-600 transition-all duration-500 group-hover:bg-ember-500 group-hover:text-white group-hover:shadow-[0_10px_24px_-8px_rgba(242,105,46,0.6)]">
                  <Icon name={f.icon} className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-night-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-night-900/55">{f.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------------- Animated statistics band ---------------- */

function Stat({ value, suffix, label, icon, active }: { value: number; suffix: string; label: string; icon: string; active: boolean }) {
  const n = useCountUp(value, active);
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="grid size-14 place-items-center rounded-2xl border border-white/12 bg-white/6 text-ember-300 backdrop-blur-sm">
        <Icon name={icon} className="size-6" />
      </span>
      <span className="font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl">
        {n.toLocaleString()}
        <span className="text-ember-400">{suffix}</span>
      </span>
      <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/50">{label}</span>
    </div>
  );
}

export function StatsBand() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { once: true, margin: '-25%' });
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-12%', reduce ? '0%' : '12%']);

  return (
    <section ref={ref} className="relative overflow-hidden bg-night-950 py-24 lg:py-28" aria-label="Our track record">
      <motion.div style={{ y: bgY }} className="absolute inset-0 -bottom-24 -top-24" aria-hidden>
        <img src={STATS_IMAGE} alt="" loading="lazy" className="size-full object-cover opacity-35" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-night-950 via-night-950/60 to-night-950" aria-hidden />
      <div className="prayer-strip absolute left-0 top-0 h-1 w-full opacity-80" aria-hidden />

      <div className="container-x relative z-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-ember-300">Measured in mountains — and in trust</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {stats.map((s) => (
            <Stat key={s.label} {...s} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
