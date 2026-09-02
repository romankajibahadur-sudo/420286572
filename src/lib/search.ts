import type { Journey } from '../data/types';
import { destinations, regions, activities } from '../data/content';
import { articles } from '../data/travelInfo';
import { ACTIVITY_FILTERS } from '../data/treks';

export type SearchGroup = 'Journeys' | 'Destinations' | 'Regions' | 'Activities' | 'Travel Guides' | 'Pages';

export interface SearchDoc {
  key: string;
  to: string;
  group: SearchGroup;
  title: string;
  meta: string;
  /** Free-text haystack: descriptions, categories, tags, locations… */
  body: string;
  /** Related concepts so "hotel" can surface "accommodation", "lodge"… */
  tags: string[];
  boost?: number;
}

export interface SearchHit extends SearchDoc {
  score: number;
}

/* ---------- Related-term expansion (synonym graph) ---------- */

const SYNONYMS: Record<string, string[]> = {
  hotel: ['accommodation', 'lodge', 'teahouse', 'guesthouse', 'stay', 'room', 'hospitality'],
  accommodation: ['hotel', 'lodge', 'teahouse', 'guesthouse', 'stay'],
  lodge: ['hotel', 'teahouse', 'accommodation'],
  hike: ['trek', 'trekking', 'walk', 'trail'],
  hiking: ['trek', 'trekking', 'walk', 'trail'],
  trek: ['hike', 'trekking', 'trail', 'walk'],
  climb: ['climbing', 'peak', 'mountaineering', 'expedition', 'summit'],
  climbing: ['climb', 'peak', 'mountaineering', 'summit'],
  mountain: ['peak', 'himalaya', 'summit', 'range', 'altitude'],
  peak: ['mountain', 'summit', 'climbing'],
  raft: ['rafting', 'river', 'water', 'kayak'],
  rafting: ['river', 'water', 'raft'],
  safari: ['wildlife', 'jungle', 'animals', 'rhino', 'tiger', 'chitwan'],
  wildlife: ['safari', 'jungle', 'animals', 'birds'],
  culture: ['cultural', 'heritage', 'temple', 'monastery', 'unesco', 'tour'],
  tour: ['tours', 'sightseeing', 'cultural', 'heritage'],
  food: ['meal', 'meals', 'dining', 'dal bhat', 'cuisine'],
  price: ['cost', 'budget', 'fee', 'money', 'payment'],
  cost: ['price', 'budget', 'fee'],
  cheap: ['budget', 'affordable', 'value'],
  visa: ['permit', 'immigration', 'passport', 'entry'],
  permit: ['visa', 'tims', 'restricted', 'fee'],
  weather: ['climate', 'season', 'rain', 'monsoon', 'temperature'],
  season: ['weather', 'climate', 'best time', 'monsoon'],
  gear: ['packing', 'equipment', 'kit', 'boots', 'clothing'],
  packing: ['gear', 'equipment', 'kit', 'list'],
  book: ['booking', 'reserve', 'reservation', 'enquire'],
  booking: ['book', 'reserve', 'reservation', 'deposit'],
  photo: ['photos', 'gallery', 'picture', 'image'],
  gallery: ['photo', 'photos', 'pictures', 'images'],
  guide: ['sherpa', 'porter', 'leader', 'staff'],
  easy: ['beginner', 'moderate', 'family', 'short'],
  hard: ['strenuous', 'challenging', 'difficult', 'tough'],
  everest: ['khumbu', 'ebc', 'base camp', 'sagarmatha', 'lukla'],
  annapurna: ['abc', 'pokhara', 'thorong', 'sanctuary'],
  contact: ['phone', 'email', 'whatsapp', 'reach', 'address'],
  about: ['company', 'team', 'story', 'who we are'],
};

const STOP = new Set(['the', 'a', 'an', 'in', 'of', 'to', 'for', 'and', 'or', 'my', 'me', 'i', 'is', 'on', 'at', 'with']);

export function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

/* ---------- Static pages are searchable too ---------- */

const PAGES: SearchDoc[] = [
  { key: 'p-home', to: '/', group: 'Pages', title: 'Home', meta: 'Start here', body: 'himalaya adventure home landing treks tours', tags: ['home', 'start'] },
  { key: 'p-treks', to: '/treks', group: 'Pages', title: 'All Treks & Tours', meta: 'Browse the full catalogue', body: 'catalogue filter search journeys expeditions price duration', tags: ['trek', 'tour', 'browse', 'price'] },
  { key: 'p-booking', to: '/booking', group: 'Pages', title: 'Book a Journey', meta: 'Reserve your place', body: 'booking reserve deposit price payment travellers dates add-ons', tags: ['book', 'booking', 'reserve', 'price', 'deposit'] },
  { key: 'p-gallery', to: '/gallery', group: 'Pages', title: 'Photo Gallery', meta: 'Photographs from the trail', body: 'gallery photos pictures images everest annapurna culture wildlife', tags: ['photo', 'gallery', 'pictures'] },
  { key: 'p-about', to: '/about', group: 'Pages', title: 'About Us', meta: 'Our story, team & safety', body: 'company story team guides safety community values founded sherpa', tags: ['about', 'team', 'guide', 'safety', 'company'] },
  { key: 'p-contact', to: '/contact', group: 'Pages', title: 'Contact', meta: 'Phone, WhatsApp & email', body: 'contact phone whatsapp email office kathmandu thamel address map hours', tags: ['contact', 'phone', 'email', 'address'] },
  { key: 'p-info', to: '/travel-info', group: 'Pages', title: 'Travel Information', meta: 'Guides & FAQ', body: 'travel information guides faq visa climate packing seasons grades culture', tags: ['info', 'faq', 'visa', 'guide'] },
  { key: 'p-dest', to: '/destinations', group: 'Pages', title: 'Destinations', meta: 'Nepal, Bhutan, Tibet & India', body: 'destinations countries nepal bhutan tibet india', tags: ['destination', 'country'] },
  { key: 'p-regions', to: '/regions', group: 'Pages', title: 'Regions', meta: 'Explore by mountain region', body: 'regions everest annapurna langtang rolwaling restricted', tags: ['region'] },
  { key: 'p-activities', to: '/activities', group: 'Pages', title: 'Activities', meta: 'Adventure your way', body: 'activities trekking climbing rafting safari tours day tours', tags: ['activity'] },
];

/** Build the searchable index from live data. */
export function buildIndex(journeys: Journey[]): SearchDoc[] {
  const docs: SearchDoc[] = [...PAGES];

  journeys.forEach((j) => {
    docs.push({
      key: `j-${j.slug}`,
      to: `/treks/${j.slug}`,
      group: 'Journeys',
      title: j.name,
      meta: `${j.duration} days · ${j.difficulty} · from $${j.price.toLocaleString()}`,
      body: [
        j.shortDescription, j.destination, j.region, j.activity, j.difficulty,
        j.bestSeason, j.startPoint, j.endPoint, j.accommodation, j.transport,
        j.highlights.join(' '), j.description.join(' '),
      ].join(' '),
      tags: [j.destination, j.region, j.activity, j.difficulty, 'trek', 'journey', 'price', 'accommodation'],
      boost: j.featured ? 1.25 : 1,
    });
  });

  destinations.forEach((d) => {
    docs.push({
      key: `d-${d.slug}`, to: `/destinations/${d.slug}`, group: 'Destinations',
      title: d.name, meta: d.tagline,
      body: [d.tagline, d.intro.join(' '), d.highlights.join(' '), d.capital, d.language, d.currency, d.bestSeason].join(' '),
      tags: [d.name, 'destination', 'country', 'travel'],
    });
  });

  regions.forEach((r) => {
    docs.push({
      key: `r-${r.slug}`, to: `/treks?region=${r.slug}`, group: 'Regions',
      title: r.name, meta: r.range, body: `${r.desc} ${r.range}`,
      tags: [r.name, 'region', 'mountain', 'trekking area'],
    });
  });

  activities.forEach((a) => {
    docs.push({
      key: `a-${a.slug}`, to: `/treks?activity=${a.slug}`, group: 'Activities',
      title: a.name, meta: a.stat, body: `${a.desc} ${a.stat}`,
      tags: [a.name, a.slug.replace('-', ' '), 'activity', 'adventure'],
    });
  });

  ACTIVITY_FILTERS.forEach((a) => {
    if (!activities.some((x) => x.slug === a.slug)) {
      docs.push({
        key: `af-${a.slug}`, to: `/treks?activity=${a.slug}`, group: 'Activities',
        title: a.label, meta: 'Browse journeys', body: a.label, tags: ['activity', a.label],
      });
    }
  });

  articles.forEach((a) => {
    docs.push({
      key: `g-${a.slug}`, to: `/travel-info/${a.slug}`, group: 'Travel Guides',
      title: a.title, meta: a.readTime,
      body: [a.excerpt, ...a.sections.flatMap((s) => [s.heading ?? '', ...s.body, ...(s.list ?? [])])].join(' '),
      tags: ['guide', 'information', 'advice'],
    });
  });

  return docs;
}

/**
 * Relevance search: case-insensitive, partial matching, multi-keyword,
 * synonym expansion and weighted field scoring.
 */
export function searchIndex(docs: SearchDoc[], query: string, limit = 12): SearchHit[] {
  const terms = tokenize(query);
  if (!terms.length) return [];

  // expand each term with related words (lower weight)
  const expanded = new Map<string, number>();
  terms.forEach((t) => {
    expanded.set(t, Math.max(expanded.get(t) ?? 0, 1));
    (SYNONYMS[t] ?? []).forEach((s) =>
      s.split(' ').forEach((w) => expanded.set(w, Math.max(expanded.get(w) ?? 0, 0.45))),
    );
  });

  const hits: SearchHit[] = [];

  docs.forEach((doc) => {
    const title = doc.title.toLowerCase();
    const meta = doc.meta.toLowerCase();
    const tags = doc.tags.join(' ').toLowerCase();
    const body = doc.body.toLowerCase();
    let score = 0;
    let matchedPrimary = 0;

    expanded.forEach((weight, term) => {
      let termScore = 0;
      if (title === term) termScore += 30;
      else if (title.startsWith(term)) termScore += 18;
      else if (title.includes(term)) termScore += 12;
      if (tags.includes(term)) termScore += 7;
      if (meta.includes(term)) termScore += 4;
      if (body.includes(term)) termScore += 3;
      // word-boundary bonus reduces noisy substring hits
      if (new RegExp(`\\b${term}`, 'i').test(body)) termScore += 1.5;
      if (termScore > 0) {
        score += termScore * weight;
        if (weight === 1) matchedPrimary += 1;
      }
    });

    if (score <= 0) return;
    // reward documents matching more of the user's actual words
    score *= 1 + (matchedPrimary / terms.length) * 0.8;
    score *= doc.boost ?? 1;
    hits.push({ ...doc, score });
  });

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Split text into segments so matched terms can be visually highlighted. */
export function highlight(text: string, query: string): { text: string; hit: boolean }[] {
  const terms = tokenize(query);
  if (!terms.length) return [{ text, hit: false }];
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig');
  return text
    .split(re)
    .filter(Boolean)
    .map((part) => ({ text: part, hit: terms.some((t) => part.toLowerCase() === t.toLowerCase()) }));
}
