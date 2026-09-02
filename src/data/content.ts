import type { Activity, Destination, Faq, Region } from './types';
import { pex } from '../lib/utils';

export const destinations: Destination[] = [
  {
    slug: 'nepal',
    name: 'Nepal',
    tagline: 'The rooftop of the world — eight of the fourteen 8,000ers',
    image: pex(36564643, 1200, 900),
    experiences: 24,
    intro: [
      'Nepal is the beating heart of Himalayan adventure. Within a single day’s travel you can move from subtropical jungle to the highest trekking passes on Earth, through cultures layered over two thousand years of trade between India and Tibet.',
      'Kathmandu’s medieval squares, the Annapurna and Everest trails, and the warmth of teahouse hospitality make Nepal the complete mountain destination — and the home we know best.',
    ],
    highlights: ['Everest, Annapurna & Manaslu trekking corridors', 'Kathmandu Valley’s 7 UNESCO sites', 'Chitwan & Bardia jungle safaris', 'Birthplace of Buddha at Lumbini'],
    bestSeason: 'October – November & March – April',
    capital: 'Kathmandu',
    language: 'Nepali (English widely spoken in tourism)',
    currency: 'Nepalese Rupee (NPR)',
  },
  {
    slug: 'bhutan',
    name: 'Bhutan',
    tagline: 'The last Himalayan kingdom, measuring wealth in happiness',
    image: pex(35402324, 1200, 900),
    experiences: 6,
    intro: [
      'Bhutan guards its culture and forests with fierce, gentle intention — 72% forested by law, carbon-negative in fact. Tourism here is deliberately high-value and low-impact, which means empty trails and intact traditions.',
      'Our private Bhutan journeys pair fortress monasteries and farmhouse hospitality with day-walks beneath unclimbed sacred peaks — the Jomolhari and Druk Path treks available on request.',
    ],
    highlights: ['Tiger’s Nest & the great dzongs', 'High-value, low-impact travel model', 'Jomolhari & Druk Path treks (private)', 'Tshechu festival departures'],
    bestSeason: 'March – May & September – November',
    capital: 'Thimphu',
    language: 'Dzongkha (English is the medium of instruction)',
    currency: 'Ngultrum (BTN), pegged to INR',
  },
  {
    slug: 'tibet',
    name: 'Tibet',
    tagline: 'The high plateau — monasteries, vast skies, Everest’s north face',
    image: pex(38374937, 1200, 900),
    experiences: 4,
    intro: [
      'Tibet is the Himalaya’s other side: an immense high-altitude plateau where Buddhism shaped an entire civilisation. Lhasa’s Potala Palace, the kora at Jokhang and the long overland road to Everest’s north base camp remain among Asia’s great journeys.',
      'We arrange private Tibet overland tours in partnership with licensed operators in Lhasa, handling permits end-to-end. All Tibet travel is currently organised on a private, tailor-made basis.',
    ],
    highlights: ['Potala Palace & Jokhang Temple', 'Everest North Base Camp overland', 'Yamdrok & Namtso holy lakes', 'Kathmandu–Lhasa overland expeditions'],
    bestSeason: 'April – October',
    capital: 'Lhasa',
    language: 'Tibetan, Mandarin',
    currency: 'Chinese Yuan (CNY)',
  },
  {
    slug: 'india',
    name: 'India',
    tagline: 'Ladakh, Sikkim & Uttarakhand — the Indian Himalaya',
    image: pex(28933429, 1200, 900),
    experiences: 8,
    intro: [
      'The Indian Himalaya stretches for 2,500 km and holds an astonishing range of worlds: the moonscapes of Ladakh, Sikkim’s orchid-draped valleys beneath Kangchenjunga, and the pilgrim trails of Uttarakhand.',
      'Our Indian journeys are private and tailor-made — built around your dates with vetted local partners, whether that’s the Markha Valley trek, a Sikkim monastery circuit or a high-altitude road expedition.',
    ],
    highlights: ['Markha Valley & Stok Kangri region, Ladakh', 'Kangchenjunga Base Camp from Sikkim', 'Valley of Flowers, Uttarakhand', 'Spiti high-desert circuits'],
    bestSeason: 'May – September (Ladakh) & March – June (Sikkim)',
    capital: 'New Delhi',
    language: 'Hindi, English & many regional languages',
    currency: 'Indian Rupee (INR)',
  },
];

export const activities: Activity[] = [
  {
    slug: 'trekking',
    name: 'Trekking',
    icon: 'mountain',
    image: pex(28933429, 1200, 800),
    desc: 'Teahouse trails from gentle valley rambles to the great high circuits of Everest, Annapurna and Manaslu.',
    stat: '100+ routes',
  },
  {
    slug: 'peak-climbing',
    name: 'Peak Climbing',
    icon: 'mountain-snow',
    image: pex(9683997, 1200, 800),
    desc: '6,000 m summits with UIAA-trained Sherpa guides, fixed ropes and full expedition support.',
    stat: '50+ peaks',
  },
  {
    slug: 'river-rafting',
    name: 'River Rafting',
    icon: 'waves',
    image: pex(37776428, 1200, 800),
    desc: 'From half-day floats to nine-day wilderness expeditions down the legendary Sun Kosi.',
    stat: '6 rivers',
  },
  {
    slug: 'wildlife-safari',
    name: 'Wildlife Safari',
    icon: 'binoculars',
    image: pex(38267708, 1200, 800),
    desc: 'Rhinos, tigers and 500 bird species in the jungles of Chitwan and Bardia national parks.',
    stat: '2 parks',
  },
  {
    slug: 'tours',
    name: 'Cultural Tours',
    icon: 'landmark',
    image: pex(28831413, 1200, 800),
    desc: 'UNESCO cities, living goddesses and Himalayan kingdoms — privately guided, deeply local.',
    stat: '12 itineraries',
  },
  {
    slug: 'day-tours',
    name: 'Day Tours',
    icon: 'sun',
    image: pex(17370946, 1200, 800),
    desc: 'Sunrise ridges, city food walks and helicopter breakfasts — big experiences, zero days used.',
    stat: '10 options',
  },
];

export const regions: Region[] = [
  {
    slug: 'everest',
    name: 'Everest Region',
    image: pex(6642124, 1200, 800),
    desc: 'The Khumbu — Sherpa homeland, the highest peaks on Earth, and trails steeped in expedition history.',
    range: 'Sagarmatha / 8,848 m',
  },
  {
    slug: 'annapurna',
    name: 'Annapurna Region',
    image: pex(6845912, 1200, 800),
    desc: 'Nepal’s most diverse trekking ground: rhododendron forests, deep gorges and the great Thorong La.',
    range: 'Annapurna I / 8,091 m',
  },
  {
    slug: 'langtang',
    name: 'Langtang Region',
    image: pex(13040872, 1200, 800),
    desc: 'The valley of glaciers, one day from Kathmandu — Tamang culture beneath Langtang Lirung.',
    range: 'Langtang Lirung / 7,227 m',
  },
  {
    slug: 'rolwaling',
    name: 'Rolwaling Region',
    image: pex(31614039, 1200, 800),
    desc: 'The hidden valley west of Everest — Tsho Rolpa lake, the Tashi Lapcha pass, and true solitude.',
    range: 'Gauri Shankar / 7,134 m',
  },
  {
    slug: 'restricted',
    name: 'Restricted Regions',
    image: pex(34022827, 1200, 800),
    desc: 'Manaslu, Mustang and Dolpo — permit-protected kingdoms where old Tibet survives intact.',
    range: 'Manaslu / 8,163 m',
  },
  {
    slug: 'other',
    name: 'Other Trekking Regions',
    image: pex(29622195, 1200, 800),
    desc: 'Makalu, Kangchenjunga, Dhaulagiri and the far west — expeditions for the connoisseur.',
    range: 'Kangchenjunga / 8,586 m',
  },
];

export const whyUs = [
  {
    icon: 'users',
    title: 'Born-here local guides',
    text: 'Every guide is a licensed local professional with 10–25 years on these exact trails — fluent in the mountains, the culture and your safety.',
  },
  {
    icon: 'shield-check',
    title: 'Safety engineered in',
    text: 'Pulse-oximeter checks twice daily, conservative acclimatisation profiles, satellite backup and an emergency response plan on every departure.',
  },
  {
    icon: 'map-pinned',
    title: 'Deep local knowledge',
    text: 'Family-run teahouse partners, festival timing, and the viewpoint detours that never make the guidebooks — 15 years of relationships, shared.',
  },
  {
    icon: 'notebook-pen',
    title: 'Truly personal itineraries',
    text: 'No fixed-departure factories. Every journey is tuned to your fitness, interests and pace before you ever board a plane.',
  },
  {
    icon: 'phone-call',
    title: 'Support that answers',
    text: 'A real human on WhatsApp within two hours, from first inquiry to the flight home — plus post-trip help with claims and certificates.',
  },
  {
    icon: 'hand-heart',
    title: 'Travel that gives back',
    text: 'Fair wages above industry standard, porter welfare gear, and 5% of profits funding Langtang classroom rebuilds since 2015.',
  },
];

export const stats = [
  { value: 15, suffix: '+', label: 'Years guiding in the Himalaya', icon: 'calendar' },
  { value: 100, suffix: '+', label: 'Trekking routes & tours', icon: 'route' },
  { value: 50, suffix: '+', label: 'Peaks climbed with clients', icon: 'mountain' },
  { value: 2400, suffix: '+', label: 'Happy travellers hosted', icon: 'heart' },
];

export const team = [
  {
    name: 'Dawa Sherpa',
    role: 'Founder & Expedition Leader',
    initials: 'DS',
    detail: '22 years guiding · 11 Everest summits · UIAA mountain guide',
  },
  {
    name: 'Pasang Tamang',
    role: 'Head of Trekking Operations',
    initials: 'PT',
    detail: 'Langtang native · 17 years · wilderness first responder',
  },
  {
    name: 'Anjali Gurung',
    role: 'Guest Experience & Logistics',
    initials: 'AG',
    detail: 'Pokhara · permits wizard · answers WhatsApp within 2 hours',
  },
  {
    name: 'Tashi Gyaltsen',
    role: 'Bhutan & Tibet Programmes',
    initials: 'TG',
    detail: 'Thimphu-trained cultural guide · fluent in 5 languages',
  },
];

export const faqs: Faq[] = [
  {
    q: 'How fit do I need to be for a Himalayan trek?',
    a: 'For moderate treks like Langtang or Mardi Himal, comfortably walking 5–6 hours a day on hilly ground for a week is enough — no technical skills required. Challenging treks (EBC, Annapurna Circuit) reward 2–3 months of preparation with cardio and loaded hill walks. Strenuous trips like Manaslu or Island Peak need previous multi-day trekking experience.',
  },
  {
    q: 'Is altitude sickness a real risk?',
    a: 'Yes, and we design around it. Every itinerary places rest days where medical guidance recommends (Namche, Dingboche, Manang), guides check blood-oxygen twice daily, and our ascent profiles follow the 300–500 m sleeping-altitude rule above 3,000 m. If symptoms escalate, descent is immediate and non-negotiable — agreed in advance with every guest.',
  },
  {
    q: 'What insurance do I need?',
    a: 'A policy covering trekking to your maximum altitude (5,545 m for EBC; 6,200 m for Island Peak) including helicopter evacuation. We verify coverage before departure and carry the evacuation coordination side ourselves. We cannot run treks above 3,000 m without verified insurance.',
  },
  {
    q: 'When is the best time to trek in Nepal?',
    a: 'October–November brings the clearest skies and is the classic season; March–May offers warmer days and rhododendron bloom. Monsoon (June–August) is superb in rain-shadow Mustang and Dolpo. Winter is cold but stunningly clear on lower treks below 4,000 m.',
  },
  {
    q: 'How does the booking and payment process work?',
    a: 'Enquire with your dates; we confirm an itinerary and hold space for 7 days. A 20% deposit secures permits and guides; the balance is payable on arrival in Kathmandu. We accept bank transfer and major cards — and we never sell journeys we wouldn’t put our own families on.',
  },
  {
    q: 'Can you customise any itinerary?',
    a: 'That’s our speciality. Add rest days, switch teahouses for luxury lodges, combine trekking with safari or Bhutan, or build something entirely new with our travel designers. Around 60% of our clients travel on modified or fully custom itineraries.',
  },
];

export const CTA_IMAGE = pex(6845912, 1600, 900);
export const STATS_IMAGE = pex(31614039, 1600, 1000);
export const ABOUT_STORY_IMAGE = pex(20808434, 1200, 900);
export const ABOUT_CAMP_IMAGE = pex(29622195, 1200, 900);
