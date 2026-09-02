import { MountainSnow } from 'lucide-react';
import { useSeo } from '../lib/hooks';
import { Button, Reveal } from '../components/ui';

export default function NotFound() {
  useSeo('Page not found | Ascent Himalaya', 'The trail you followed has gone cold. Head back to camp.');
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-night-950 px-6 text-center text-white">
      <div className="prayer-strip absolute left-0 top-0 h-1 w-full" aria-hidden />
      <MountainSnow className="size-12 animate-float text-ember-400" aria-hidden />
      <Reveal>
        <p className="mt-8 font-display text-[clamp(5rem,20vw,11rem)] font-semibold leading-none tracking-tight text-white/10">404</p>
        <h1 className="-mt-6 font-display text-3xl font-medium tracking-tight sm:text-4xl">You've wandered off the trail</h1>
        <p className="mx-auto mt-4 max-w-md text-white/60">
          This page seems to have been swept away by an avalanche. Let's rope you back to base camp.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button to="/" icon>Back to home</Button>
          <Button to="/treks" variant="outline-light">Browse journeys</Button>
        </div>
      </Reveal>
    </main>
  );
}
