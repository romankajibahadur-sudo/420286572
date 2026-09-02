import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading, Stagger, StaggerItem } from '../components/ui';
import { TrekCard } from '../components/TrekCard';
import { useJourneys } from '../data/store';

export function FeaturedTreks() {
  const { journeys } = useJourneys();
  const featuredTreks = journeys.filter((j) => j.featured && j.activity === 'trekking').slice(0, 8);
  return (
    <section className="container-x py-24 lg:py-32" aria-label="Featured trekking packages">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          overline="Featured journeys"
          title={
            <>
              Treks our travellers <em className="italic text-ember-500">rave about</em>
            </>
          }
          sub="Hand-finished itineraries, family-run teahouses and the finest local crews in the Himalaya — bookable private or small-group."
        />
        <Link
          to="/treks"
          className="group mb-1 hidden items-center gap-2 text-sm font-bold text-night-900/70 transition-colors hover:text-ember-600 md:inline-flex"
        >
          View all 15 journeys
          <span className="grid size-8 place-items-center rounded-full border border-night-900/15 transition-all duration-300 group-hover:border-ember-500 group-hover:bg-ember-500 group-hover:text-white">
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </span>
        </Link>
      </div>

      <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-7">
        {featuredTreks.map((j) => (
          <StaggerItem key={j.slug} className="h-full">
            <TrekCard journey={j} />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-10 text-center md:hidden">
        <Link to="/treks" className="inline-flex items-center gap-2 text-sm font-bold text-ember-600">
          View all 15 journeys <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
