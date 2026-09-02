export type Difficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Strenuous';

export type ActivitySlug =
  | 'trekking'
  | 'peak-climbing'
  | 'river-rafting'
  | 'tours'
  | 'day-tours'
  | 'wildlife-safari'
  | 'special-programs';

export type RegionSlug =
  | 'everest'
  | 'annapurna'
  | 'langtang'
  | 'rolwaling'
  | 'restricted'
  | 'other';

export interface ItineraryDay {
  day: number;
  title: string;
  desc: string;
  alt?: number;
}

/** A "journey" is any bookable trip — trek, climb, tour, safari or expedition. */
export interface Journey {
  id: number;
  slug: string;
  name: string;
  destination: 'Nepal' | 'Bhutan' | 'Tibet' | 'India';
  region: RegionSlug;
  activity: ActivitySlug;
  duration: number; // days
  difficulty: Difficulty;
  maxAltitude: number; // metres
  price: number; // USD per person
  rating: number;
  reviews: number;
  bestSeason: string;
  startPoint: string;
  endPoint: string;
  accommodation: string;
  transport: string;
  groupSize: string;
  image: string;
  gallery: { src: string; alt: string }[];
  shortDescription: string;
  description: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  featured?: boolean;
}

export interface Destination {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  experiences: number;
  intro: string[];
  highlights: string[];
  bestSeason: string;
  capital: string;
  language: string;
  currency: string;
}

export interface Activity {
  slug: ActivitySlug;
  name: string;
  icon: string;
  image: string;
  desc: string;
  stat: string;
}

export interface Region {
  slug: RegionSlug;
  name: string;
  image: string;
  desc: string;
  range: string;
}

export interface Review {
  id: number;
  trek: string; // journey slug
  name: string;
  country: string;
  rating: number;
  date: string;
  text: string;
  featured?: boolean;
}

export interface InfoArticle {
  slug: string;
  title: string;
  icon: string;
  excerpt: string;
  readTime: string;
  sections: { heading?: string; body: string[]; list?: string[] }[];
}

export interface Faq {
  q: string;
  a: string;
}
