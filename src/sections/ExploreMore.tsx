import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Icon, SectionHeading, Stagger, StaggerItem } from '../components/ui';
import { activities, regions } from '../data/content';
import { useJourneys } from '../data/store';

/* ---------------- Explore by Region ---------------- */

export function RegionExplorer() {
  const { journeys } = useJourneys();
  const byRegion = (slug: string) => journeys.filter((j) => j.region === slug);
  return (
    <section className="container-x py-24 lg:py-32" aria-label="Explore by region">
      <SectionHeading
        overline="Chart your course"
        title={
          <>
            Explore by <em className="italic text-ember-500">region</em>
          </>
        }
        sub="Eight-thousand-metre arenas, rain-shadow deserts and hidden valleys — pick a horizon and we’ll draw the route."
      />

      <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {regions.map((r, i) => {
          const count = byRegion(r.slug).length;
          return (
            <StaggerItem key={r.slug} className={i === 0 ? 'md:col-span-2' : ''}>
              <Link
                to={`/treks?region=${r.slug}`}
                className="group relative flex h-60 flex-col justify-end overflow-hidden rounded-[1.5rem] p-6 md:h-64"
                aria-label={`Explore the ${r.name}`}
              >
                <img
                  src={r.image}
                  alt={r.name}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-[1.3s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night-950/90 via-night-950/25 to-transparent transition-opacity duration-500" aria-hidden />
                <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-night-950/55 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md" aria-hidden>
                  <MapPin className="size-3 text-ember-400" />
                  {r.range}
                </span>
                <div className="relative">
                  <h3 className="font-display text-2xl font-medium tracking-tight text-white">{r.name}</h3>
                  <p className="mt-1 line-clamp-2 max-w-md text-[13px] leading-snug text-white/65 opacity-90 transition-all duration-500 md:max-h-0 md:opacity-0 md:group-hover:max-h-12 md:group-hover:opacity-100">
                    {r.desc}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-ember-300">
                    {count > 0 ? `${count} journeys` : 'Private expeditions'}
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

/* ---------------- Adventure Your Way (activities) ---------------- */

export function ActivitiesSection() {
  return (
    <section className="bg-sand-100 py-24 lg:py-32" aria-label="Activities">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            overline="Adventure your way"
            title={
              <>
                Choose your <em className="italic text-ember-500">kind of wild</em>
              </>
            }
            sub="Ice or jungle, summit or stupa — every style of Himalayan adventure, engineered by specialists."
          />
          <Link
            to="/activities"
            className="group mb-1 hidden items-center gap-2 text-sm font-bold text-night-900/70 transition-colors hover:text-ember-600 md:inline-flex"
          >
            All activities
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((a) => (
            <StaggerItem key={a.slug}>
              <Link
                to={`/treks?activity=${a.slug}`}
                className="group block h-full rounded-[1.5rem] bg-white p-3 shadow-card card-hover hover:-translate-y-1.5 hover:shadow-lift"
                aria-label={`Explore ${a.name}`}
              >
                <div className="relative overflow-hidden rounded-[1.1rem]">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={a.image}
                      alt={a.name}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-night-950/60 to-transparent" aria-hidden />
                  <span className="absolute bottom-3.5 left-3.5 grid size-12 place-items-center rounded-2xl bg-ember-500 text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                    <Icon name={a.icon} className="size-6" />
                  </span>
                  <span className="absolute bottom-4 right-4 rounded-full bg-white/92 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-night-900 backdrop-blur">
                    {a.stat}
                  </span>
                </div>
                <div className="px-3 pb-3 pt-5">
                  <h3 className="font-display text-xl font-medium text-night-900">{a.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-night-900/55">{a.desc}</p>
                  <span className="mt-3.5 inline-flex items-center gap-1.5 text-[13px] font-extrabold text-ember-600">
                    Explore
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
