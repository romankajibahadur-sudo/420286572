import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading, Stagger, StaggerItem } from '../components/ui';
import { destinations } from '../data/content';

/**
 * Full-bleed destination cards that expand their story on hover
 * (always-visible on touch, where hover doesn't exist).
 */
export function DestinationExplorer() {
  return (
    <section className="bg-night-950 py-24 lg:py-32" aria-label="Destinations">
      <div className="container-x">
        <SectionHeading
          dark
          align="center"
          overline="Where we wander"
          title={
            <>
              Four kingdoms of <em className="italic text-ember-400">wonder</em>
            </>
          }
          sub="From Nepal’s teahouse trails to Bhutan’s fortress monasteries — each destination run by people who call it home."
        />

        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d, i) => (
            <StaggerItem key={d.slug}>
              <Link
                to={`/destinations/${d.slug}`}
                className="group relative block h-[24rem] overflow-hidden rounded-[1.75rem] sm:h-[26rem] lg:h-[30rem]"
                aria-label={`Explore ${d.name}`}
              >
                <img
                  src={d.image}
                  alt={`${d.name} — ${d.tagline}`}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night-950/95 via-night-950/30 to-night-950/10 transition-opacity duration-500 group-hover:via-night-950/55" aria-hidden />

                {/* index marker */}
                <span className="absolute left-5 top-5 font-display text-sm font-semibold italic text-white/50" aria-hidden>
                  0{i + 1}
                </span>
                <span className="absolute right-5 top-5 grid size-10 place-items-center rounded-full border border-white/30 text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100" aria-hidden>
                  <ArrowUpRight className="size-4.5 transition-transform duration-500 group-hover:rotate-45" />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">{d.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-[13px] font-medium leading-snug text-white/70">{d.tagline}</p>
                  <div className="grid grid-rows-[0fr] transition-all duration-500 ease-out group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4">
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-ember-300">
                          {d.experiences} experiences
                        </span>
                        <span className="text-xs font-bold text-white/80">Explore →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
