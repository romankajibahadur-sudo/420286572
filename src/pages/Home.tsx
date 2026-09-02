import { Hero } from '../sections/Hero';
import { FeaturedTreks } from '../sections/FeaturedTreks';
import { DestinationExplorer } from '../sections/DestinationExplorer';
import { RegionExplorer, ActivitiesSection } from '../sections/ExploreMore';
import { WhyUs, StatsBand } from '../sections/TrustSections';
import { Testimonials, CtaBanner } from '../sections/Closing';
import { useSeo } from '../lib/hooks';

export default function Home() {
  useSeo(
    'Sumina Himalaya — Adventure Beyond the Ordinary',
    'Premium Himalayan treks, climbs and cultural journeys across Nepal, Bhutan, Tibet and India, guided by local experts since 2009.',
  );
  return (
    <main>
      <Hero />
      <FeaturedTreks />
      <DestinationExplorer />
      <RegionExplorer />
      <ActivitiesSection />
      <WhyUs />
      <StatsBand />
      <Testimonials />
      <CtaBanner />
    </main>
  );
}
