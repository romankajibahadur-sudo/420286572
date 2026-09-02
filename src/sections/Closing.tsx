import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { Button, SectionHeading, Stagger, StaggerItem, Stars } from '../components/ui';
import { featuredReviews } from '../data/reviews';
import { CTA_IMAGE } from '../data/content';
import { SITE } from '../lib/site';
import { initials } from '../lib/utils';

/* ---------------- Traveller stories ---------------- */

export function Testimonials() {
  return (
    <section id="reviews" className="container-x scroll-mt-24 py-24 lg:py-32" aria-label="Traveller reviews">
      <SectionHeading
        align="center"
        overline="Traveller stories"
        title={
          <>
            Words from the <em className="italic text-ember-500">trail</em>
          </>
        }
        sub="Unedited reviews from recent journeys — collected independently after every trip."
      />

      <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredReviews.slice(0, 6).map((r) => (
          <StaggerItem key={r.id}>
            <figure className="flex h-full flex-col rounded-3xl border border-night-900/8 bg-white p-7 shadow-card card-hover hover:-translate-y-1.5 hover:shadow-lift">
              <div className="flex items-center justify-between">
                <Quote className="size-7 text-ember-500/70" aria-hidden />
                <Stars rating={r.rating} />
              </div>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-night-900/70">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-night-900/8 pt-5">
                <span className="grid size-11 place-items-center rounded-full bg-night-900 font-display text-sm font-semibold text-ember-300">
                  {initials(r.name)}
                </span>
                <span>
                  <span className="block text-sm font-bold text-night-900">{r.name}</span>
                  <span className="block text-xs text-night-900/50">{r.country} · {r.date}</span>
                </span>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ---------------- CTA banner ---------------- */

export function CtaBanner() {
  return (
    <section className="container-x pb-24 lg:pb-32" aria-label="Start planning">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2.5rem] px-7 py-16 text-center sm:px-12 lg:py-24"
      >
        <img src={CTA_IMAGE} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-night-950/75" aria-hidden />
        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-ember-300 backdrop-blur">
            <Star className="size-3.5 fill-ember-400 text-ember-400" aria-hidden />
            4.9 average · 2,400+ travellers
          </div>
          <h2 className="text-shadow-hero mt-6 font-display text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.05] tracking-tight text-white">
            Ready to write your <em className="italic text-ember-300">Himalayan story?</em>
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/70">
            Tell us when you can go and what you dream of seeing. A real travel designer — never a bot — replies
            within 24 hours with a first itinerary sketch.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3.5">
            <Button to="/booking" size="lg" icon>
              Plan Your Journey
            </Button>
            <Button to="/gallery" variant="outline-light" size="lg">
              View Gallery
            </Button>
          </div>
          <p className="mt-6 text-xs text-white/45">
            Prefer talking? <a href={SITE.phoneHref} className="font-semibold text-ember-300 underline-offset-4 hover:underline">{SITE.phoneDisplay}</a> · WhatsApp & Viber available
          </p>
        </div>
      </motion.div>
      <div className="mt-14 border-t border-night-900/10 text-center">
        <Link
          to="/travel-info"
          className="relative -top-3.5 inline-block bg-sand-50 px-6 text-xs font-bold uppercase tracking-[0.22em] text-night-900/40 transition-colors hover:text-ember-600"
        >
          New to the Himalaya? Start with our travel guides
        </Link>
      </div>
    </section>
  );
}
