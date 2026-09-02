import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Heart, MapPin, Mountain, Star } from 'lucide-react';
import type { Journey } from '../data/types';
import { cn } from '../utils/cn';
import { formatPrice } from '../lib/utils';

export function TrekCard({ journey: j }: { journey: Journey }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card card-hover hover:-translate-y-2 hover:shadow-lift">
      <Link to={`/treks/${j.slug}`} className="relative block overflow-hidden" aria-label={`View ${j.name}`}>
        <div className="aspect-[16/11] overflow-hidden">
          <img
            src={j.image}
            alt={j.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-night-950/70 via-night-950/10 to-transparent" aria-hidden />
        {/* floating badges */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="glass-dark inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white">
            <Clock className="size-3" aria-hidden /> {j.duration} {j.duration === 1 ? 'day' : 'days'}
          </span>
          <span className="glass-dark inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white">
            <Mountain className="size-3" aria-hidden /> {j.maxAltitude.toLocaleString()} m
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/85">
            <MapPin className="size-3.5 text-ember-400" aria-hidden />
            {j.destination}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-extrabold text-night-900">
            <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden />
            {j.rating}
            <span className="font-medium text-night-900/50">({j.reviews})</span>
          </span>
        </div>
      </Link>

      {/* favourite */}
      <button
        type="button"
        onClick={() => setLiked((l) => !l)}
        aria-label={liked ? 'Remove from favourites' : 'Save to favourites'}
        aria-pressed={liked}
        className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
      >
        <Heart className={cn('size-4.5 transition-all duration-300', liked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-night-900/60')} aria-hidden />
      </button>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-night-900/40">
          <span>{j.region === 'restricted' ? 'Restricted Area' : `${j.region} region`}</span>
          <span className="size-1 rounded-full bg-ember-500" aria-hidden />
          <span className="text-ember-600">{j.difficulty}</span>
        </div>
        <h3 className="mt-2.5 font-display text-[1.35rem] font-medium leading-snug text-night-900">
          <Link to={`/treks/${j.slug}`} className="transition-colors hover:text-ember-600">
            {j.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-night-900/55">{j.shortDescription}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-night-900/40">From</span>
            <span className="font-display text-2xl font-semibold text-night-900">{formatPrice(j.price)}</span>
            <span className="ml-1 text-xs text-night-900/45">per person</span>
          </div>
          <Link
            to={`/treks/${j.slug}`}
            className="group/cta inline-flex items-center gap-1.5 rounded-full bg-night-900 py-2.5 pl-5 pr-3 text-[13px] font-bold text-white transition-all duration-300 hover:bg-ember-500 hover:pr-2.5"
          >
            View Journey
            <span className="grid size-6 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover/cta:rotate-45">
              <ArrowUpRight className="size-3.5" aria-hidden />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
