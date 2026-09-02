import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { articles, getArticle } from '../data/travelInfo';
import { faqs } from '../data/content';
import { useSeo } from '../lib/hooks';
import { Button, EmptyState, Icon, PageHero, Reveal, SectionHeading, Stagger, StaggerItem } from '../components/ui';
import { cn } from '../utils/cn';
import { pex } from '../lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------- FAQ accordion (shared with list page) ---------------- */

function FaqAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="overflow-hidden rounded-2xl border border-night-900/8 bg-white shadow-card">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span className={cn('text-[15px] font-bold', isOpen ? 'text-night-900' : 'text-night-900/80')}>{f.q}</span>
              <ChevronDown className={cn('size-5 shrink-0 text-night-900/35 transition-transform duration-300', isOpen && 'rotate-180 text-ember-500')} aria-hidden />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="border-t border-night-900/6 px-5 py-4 text-sm leading-relaxed text-night-900/60">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- Guides index ---------------- */

export function TravelInfoPage() {
  useSeo('Travel Information — Himalayan Travel Guides | Ascent Himalaya', 'Everything to know before you go: Nepal visas, climate, seasons, packing, trekking grades, culture and more.');
  return (
    <main>
      <PageHero
        image={pex(36520506, 1920, 800)}
        overline="Traveller's library"
        title="Know before you go"
        sub="Ten honest, experience-written guides to Himalayan travel — the same briefings we give every client."
      />

      <section className="container-x py-16 lg:py-20" aria-label="Travel guides">
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <StaggerItem key={a.slug}>
              <Link
                to={`/travel-info/${a.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-night-900/8 bg-white p-7 shadow-card card-hover hover:-translate-y-1.5 hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-ember-500/10 text-ember-600 transition-colors duration-500 group-hover:bg-ember-500 group-hover:text-white">
                    <Icon name={a.icon} className="size-6" />
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-night-900/40">
                    <Clock className="size-3.5" aria-hidden />
                    {a.readTime}
                  </span>
                </div>
                <h2 className="mt-5 font-display text-xl font-semibold leading-snug text-night-900">{a.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-night-900/55">{a.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-extrabold text-ember-600">
                  Read guide
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="faq" className="scroll-mt-20 bg-sand-100 py-20 lg:py-24" aria-label="Frequently asked questions">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              overline="Questions, answered"
              title="Frequently asked"
              sub="The six questions every traveller asks before their first Himalayan journey — answered the way we'd tell a friend."
            />
            <Reveal delay={0.15} className="mt-8">
              <Button to="/contact" variant="outline-dark" icon>
                Ask something else
              </Button>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <FaqAccordion />
          </Reveal>
        </div>
      </section>
    </main>
  );
}

/* ---------------- Individual guide article ---------------- */

export function ArticlePage() {
  const { slug } = useParams();
  const a = getArticle(slug ?? '');
  const index = articles.findIndex((x) => x.slug === slug);
  const prev = index > 0 ? articles[index - 1] : null;
  const next = index < articles.length - 1 ? articles[index + 1] : null;

  useSeo(a ? `${a.title} | Ascent Himalaya Guides` : 'Guide not found | Ascent Himalaya', a?.excerpt);

  if (!a) {
    return (
      <main className="container-x flex min-h-screen items-center pt-24">
        <EmptyState title="Guide not found" text="Browse the full traveller's library instead." actionLabel="All travel guides" actionTo="/travel-info" />
      </main>
    );
  }

  return (
    <main>
      <PageHero image={pex(16087994, 1920, 800)} overline="Travel guide" title={a.title} sub={a.excerpt}>
        <Reveal delay={0.15} className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold text-white/60">
          <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5 text-ember-400" aria-hidden /> {a.readTime}</span>
          <nav aria-label="Breadcrumb" className="inline-flex items-center gap-1.5">
            <Link to="/travel-info" className="transition hover:text-white">Travel Info</Link>
            <ChevronRight className="size-3" aria-hidden />
            <span className="text-ember-300">{a.title}</span>
          </nav>
        </Reveal>
      </PageHero>

      <article className="container-x max-w-3xl py-16">
        {a.sections.map((s, i) => (
          <Reveal key={i} className={i > 0 ? 'mt-10' : ''}>
            {s.heading && (
              <h2 className="flex items-center gap-3 font-display text-2xl font-semibold tracking-tight text-night-900">
                <span className="h-6 w-1 rounded-full bg-ember-500" aria-hidden />
                {s.heading}
              </h2>
            )}
            {s.body.map((p, j) => (
              <p key={j} className="mt-4 leading-[1.85] text-night-900/70">{p}</p>
            ))}
            {s.list && (
              <ul className="mt-5 space-y-2.5">
                {s.list.map((li) => (
                  <li key={li} className="flex items-start gap-3 rounded-xl border border-night-900/8 bg-white p-3.5 text-sm font-medium leading-relaxed text-night-900/75">
                    <Check className="mt-0.5 size-4.5 shrink-0 text-ember-500" aria-hidden />
                    {li}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        ))}

        <Reveal className="mt-14 rounded-3xl bg-night-950 p-8 text-center text-white">
          <p className="font-display text-2xl font-medium">Still have questions?</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
            Our guides answer email the way they brief on the mountain — honestly and in detail.
          </p>
          <Button to="/contact" className="mt-6" icon>
            Ask a travel designer
          </Button>
        </Reveal>

        {/* prev / next */}
        <nav aria-label="More guides" className="mt-12 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link to={`/travel-info/${prev.slug}`} className="group rounded-2xl border border-night-900/10 bg-white p-5 transition hover:border-ember-500/40 hover:shadow-card">
              <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-night-900/40">
                <ArrowLeft className="size-3.5" aria-hidden /> Previous guide
              </span>
              <span className="mt-1.5 block font-display text-lg font-semibold text-night-900 transition-colors group-hover:text-ember-600">{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/travel-info/${next.slug}`} className="group rounded-2xl border border-night-900/10 bg-white p-5 text-right transition hover:border-ember-500/40 hover:shadow-card sm:col-start-2">
              <span className="flex items-center justify-end gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-night-900/40">
                Next guide <ArrowRight className="size-3.5" aria-hidden />
              </span>
              <span className="mt-1.5 block font-display text-lg font-semibold text-night-900 transition-colors group-hover:text-ember-600">{next.title}</span>
            </Link>
          ) : <span />}
        </nav>
      </article>
    </main>
  );
}
