import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Compass, MapPin, Search, Wallet } from 'lucide-react';
import { FilterSelect } from './FilterSelect';
import { ACTIVITY_FILTERS, BUDGET_FILTERS, DESTINATIONS_LIST, DURATION_FILTERS } from '../data/treks';
import { cn } from '../utils/cn';

const DEST_OPTS = DESTINATIONS_LIST.map((d) => ({ slug: d.toLowerCase(), label: d }));

/** The adventure finder — used in the homepage hero and the top of the journeys page. */
export function SearchPanel({
  className,
  compact = false,
  initial = {},
  onSearch,
}: {
  className?: string;
  compact?: boolean;
  initial?: { destination?: string; activity?: string; duration?: string; budget?: string };
  onSearch?: (q: { destination: string; activity: string; duration: string; budget: string }) => void;
}) {
  const navigate = useNavigate();
  const [destination, setDestination] = useState(initial.destination ?? '');
  const [activity, setActivity] = useState(initial.activity ?? '');
  const [duration, setDuration] = useState(initial.duration ?? '');
  const [budget, setBudget] = useState(initial.budget ?? '');
  const [searching, setSearching] = useState(false);

  const submit = () => {
    const q = { destination, activity, duration, budget };
    setSearching(true);
    if (onSearch) {
      setTimeout(() => setSearching(false), 450);
      onSearch(q);
      return;
    }
    const params = new URLSearchParams(Object.entries(q).filter(([, v]) => v) as [string, string][]);
    setTimeout(() => navigate(`/treks${params.toString() ? `?${params}` : ''}`), 450);
  };

  return (
    <div
      className={cn(
        'rounded-[1.75rem] border border-white/30 bg-white/95 p-3 shadow-lift backdrop-blur-xl sm:p-3.5',
        className,
      )}
    >
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <FilterSelect label="Destination" icon={<MapPin className="size-4.5" />} value={destination} onChange={setDestination} options={DEST_OPTS} anyLabel="Anywhere" />
        <FilterSelect label="Activity" icon={<Compass className="size-4.5" />} value={activity} onChange={setActivity} options={ACTIVITY_FILTERS} anyLabel="Any activity" />
        <FilterSelect label="Duration" icon={<Calendar className="size-4.5" />} value={duration} onChange={setDuration} options={DURATION_FILTERS} anyLabel="Any length" />
        <FilterSelect label="Budget" icon={<Wallet className="size-4.5" />} value={budget} onChange={setBudget} options={BUDGET_FILTERS} anyLabel="Any budget" />
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={searching}
        className={cn(
          'group/btn relative mt-2.5 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-[1.25rem] bg-night-900 px-6 font-bold text-white transition-all duration-300 hover:bg-ember-500 disabled:opacity-80 cursor-pointer',
          compact ? 'py-3 text-sm' : 'py-4 text-[15px]',
        )}
      >
        <span className="relative z-10 flex items-center gap-2.5">
          {searching ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
              Searching the Himalaya…
            </>
          ) : (
            <>
              <Search className="size-4.5" aria-hidden />
              Find My Adventure
            </>
          )}
        </span>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" aria-hidden />
      </button>
    </div>
  );
}
