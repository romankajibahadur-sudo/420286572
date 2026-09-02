import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Calendar, Coins, Landmark, Languages } from 'lucide-react';
import { destinations } from '../data/content';
import { useJourneys } from '../data/store';
import { useSeo } from '../lib/hooks';
import { Button, EmptyState, PageHero, Reveal, SectionHeading, Stagger, StaggerItem } from '../components/ui';
import { TrekCard } from '../components/TrekCard';
import { pex } from '../lib/utils';

/* ---------------- All destinations ---------------- */

export function DestinationsPage() {
  useSeo('Destinations — Nepal, Bhutan, Tibet & India | Ascent Himalaya', 'Explore the four Himalayan worlds we call home: Nepal, Bhutan, Tibet and the Indian Himalaya.');
  return (
    <main>
      <PageHero
        image={pex(31372831, 1920, 800)}
        overline="Destinations"
        title="Four Himalayan worlds"
        sub="Every destination we run is run by people born there. Choose a country — or ask us to combine several into one journey."
      />
      <section className="container-x space-y-8 py-16 lg:py-20" aria-label="Destination list">
        {destinations.map((d, i) => (
          <Reveal key={d.slug}>
            <Link
              to={`/destinations/${d.slug}`}
              className="group grid overflow-hidden rounded-[2rem] bg-white shadow-card card-hover hover:shadow-lift md:grid-cols-[45%_1fr]"
            >
              <div className={`relative min-h-64 overflow-hidden md:min-h-80 ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                <img
                  src={d.image}
                  alt={d.name}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-[1.3s] ease-out group-hover:scale-105"
                />
                <span className="absolute left-5 top-5 glass-dark rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white">
                  {d.experiences} experiences
                </span>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-ember-500">Destination 0{i + 1}</span>
                <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-night-900 sm:text-4xl">{d.name}</h2>
                <p className="mt-2 text-sm font-semibold text-night-900/50">{d.tagline}</p>
                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-night-900/60">{d.intro[0]}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {d.highlights.slice(0, 2).map((h) => (
                    <span key={h} className="rounded-full bg-sand-100 px-3 py-1.5 text-xs font-bold text-night-900/60">{h}</span>
                  ))}
                </div>
                <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-ember-600">
                  Explore {d.name}
                  <span className="grid size-8 place-items-center rounded-full bg-ember-500 text-white transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
    </main>
  );
}

/* ---------------- Destination detail ---------------- */

export function DestinationDetail() {
  const { slug } = useParams();
  const { journeys } = useJourneys();
  const d = destinations.find((x) => x.slug === slug);
  const trips = d ? journeys.filter((x) => x.destination === d.name) : [];

  useSeo(
    d ? `${d.name} — Treks, Tours & Travel | Ascent Himalaya` : 'Destination | Ascent Himalaya',
    d?.tagline,
  );

  if (!d) {
    return (
      <main className="container-x flex min-h-screen items-center pt-24">
        <EmptyState title="Destination not found" text="Browse our four Himalayan destinations instead." actionLabel="All destinations" actionTo="/destinations" />
      </main>
    );
  }

  const facts = [
    { icon: Landmark, label: 'Capital', value: d.capital },
    { icon: Calendar, label: 'Best season', value: d.bestSeason },
    { icon: Languages, label: 'Language', value: d.language },
    { icon: Coins, label: 'Currency', value: d.currency },
  ];

  return (
    <main>
      <PageHero image={d.image.replace('w=1200', 'w=1920').replace('h=900', 'h=800')} overline="Destination" title={d.name} sub={d.tagline} />

      <section className="container-x grid gap-12 py-16 lg:grid-cols-[1.5fr_1fr] lg:py-20">
        <div>
          <SectionHeading overline="Why go" title={`${d.name}, up close`} />
          <div className="mt-6 space-y-5 leading-relaxed text-night-900/70">
            {d.intro.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <Stagger className="mt-8 grid gap-3 sm:grid-cols-2">
            {d.highlights.map((h) => (
              <StaggerItem key={h}>
                <div className="flex items-start gap-3 rounded-2xl border border-night-900/8 bg-white p-4">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-ember-500" aria-hidden />
                  <span className="text-sm font-semibold leading-snug text-night-900/80">{h}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Reveal className="rounded-[1.75rem] border border-night-900/10 bg-night-950 p-7 text-white shadow-lift">
            <h3 className="font-display text-xl font-semibold">Fast facts</h3>
            <dl className="mt-6 space-y-5">
              {facts.map((f) => (
                <div key={f.label} className="flex items-start gap-3.5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/8 text-ember-300">
                    <f.icon className="size-5" aria-hidden />
                  </span>
                  <span>
                    <dt className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/40">{f.label}</dt>
                    <dd className="mt-0.5 text-sm font-bold leading-snug text-white/90">{f.value}</dd>
                  </span>
                </div>
              ))}
            </dl>
            <Button to="/contact" className="mt-7 w-full" icon>
              Plan a {d.name} journey
            </Button>
          </Reveal>
        </aside>
      </section>

      <section className="container-x pb-24" aria-label={`Journeys in ${d.name}`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading overline="Bookable now" title={`Journeys in ${d.name}`} />
          <Link to="/treks" className="mb-1 inline-flex items-center gap-2 text-sm font-bold text-night-900/60 transition-colors hover:text-ember-600">
            Browse everything <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        {trips.length > 0 ? (
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {trips.map((t) => (
              <StaggerItem key={t.slug}>
                <TrekCard journey={t} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <Reveal className="mt-10">
            <EmptyState
              title={`${d.name} journeys are tailor-made`}
              text={`We run ${d.name} privately, built around your dates, interests and pace with trusted local partners. Tell us when you're thinking of going and we'll sketch the route.`}
              actionLabel={`Design my ${d.name} trip`}
              actionTo="/contact"
            />
          </Reveal>
        )}
      </section>
    </main>
  );
}
