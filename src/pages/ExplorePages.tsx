import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { activities, regions } from '../data/content';
import { useJourneys } from '../data/store';
import { useSeo } from '../lib/hooks';
import { Icon, PageHero, Reveal, SectionHeading, Stagger, StaggerItem } from '../components/ui';
import { pex } from '../lib/utils';

/* ---------------- Activities page ---------------- */

export function ActivitiesPage() {
  useSeo('Activities — Trekking, Climbing, Safari & More | Ascent Himalaya', 'Adventure your way: Himalayan trekking, peak climbing, river rafting, wildlife safaris, cultural tours and day trips.');
  return (
    <main>
      <PageHero
        image={pex(28147290, 1920, 800)}
        overline="Adventure your way"
        title="Six ways into the wild"
        sub="From 6,000 m summit ridges to jungle rivers and living medieval cities — pick your discipline."
      />
      <section className="container-x py-16 lg:py-20" aria-label="Activity list">
        <div className="grid gap-8 lg:gap-10">
          {activities.map((a, i) => (
            <Reveal key={a.slug}>
              <Link
                to={`/treks?activity=${a.slug}`}
                className="group grid items-center gap-7 rounded-[2rem] border border-night-900/8 bg-white p-5 shadow-card card-hover hover:-translate-y-1 hover:shadow-lift sm:p-7 md:grid-cols-[38%_1fr]"
              >
                <div className={`relative overflow-hidden rounded-[1.4rem] ${i % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={a.image}
                      alt={a.name}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-[1.3s] ease-out group-hover:scale-105"
                    />
                  </div>
                  <span className="absolute bottom-4 left-4 grid size-14 place-items-center rounded-2xl bg-ember-500 text-white shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <Icon name={a.icon} className="size-7" />
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-ember-500">{a.stat}</span>
                  <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-night-900 sm:text-4xl">{a.name}</h2>
                  <p className="mt-3 max-w-xl leading-relaxed text-night-900/60">{a.desc}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-ember-600">
                    Explore {a.name.toLowerCase()} journeys
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 rounded-3xl border border-dashed border-night-900/15 bg-sand-100 p-7 text-center">
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-night-900/60">
            Something wilder in mind — paragliding, mountain biking, canyoning or a photography expedition? If it happens
            in the Himalaya, <Link to="/contact" className="font-bold text-ember-600 hover:underline">we can build it</Link>.
          </p>
        </Reveal>
      </section>
    </main>
  );
}

/* ---------------- Regions page ---------------- */

export function RegionsPage() {
  useSeo('Trekking Regions of the Himalaya | Ascent Himalaya', 'Everest, Annapurna, Langtang, Rolwaling and the restricted kingdoms — explore the Himalaya region by region.');
  const { journeys } = useJourneys();
  const byRegion = (slug: string) => journeys.filter((j) => j.region === slug);
  return (
    <main>
      <PageHero
        image={pex(31614039, 1920, 800)}
        overline="Chart your course"
        title="The great regions of the Himalaya"
        sub="Each region is a different world — geology, culture, season and trail character. Start with a horizon."
      />
      <section className="container-x py-16 lg:py-20" aria-label="Region list">
        <Stagger className="grid gap-6 md:grid-cols-2">
          {regions.map((r) => {
            const count = byRegion(r.slug).length;
            return (
              <StaggerItem key={r.slug}>
                <Link
                  to={`/treks?region=${r.slug}`}
                  className="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-[2rem] p-8"
                >
                  <img
                    src={r.image}
                    alt={r.name}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-950/95 via-night-950/35 to-night-950/5" aria-hidden />
                  <span className="absolute left-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-night-950/55 px-3.5 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
                    <MapPin className="size-3.5 text-ember-400" aria-hidden />
                    {r.range}
                  </span>
                  <div className="relative">
                    <h2 className="font-display text-3xl font-medium tracking-tight text-white">{r.name}</h2>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70">{r.desc}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4">
                      <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-ember-300">
                        {count > 0 ? `${count} journeys bookable` : 'Private expeditions on request'}
                      </span>
                      <span className="grid size-9 place-items-center rounded-full border border-white/30 text-white transition-all duration-300 group-hover:border-ember-400 group-hover:bg-ember-500">
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal className="mt-12">
          <SectionHeading
            align="center"
            overline="Can't decide?"
            title="Talk to someone who's walked them all"
            sub="Twenty minutes with a senior guide beats twenty browser tabs. Free, honest, no-obligation."
          />
          <div className="mt-8 text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-ember-500 px-8 py-4 text-sm font-bold text-white shadow-[0_10px_30px_-8px_rgba(242,105,46,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ember-600"
            >
              Book a free route consult
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
