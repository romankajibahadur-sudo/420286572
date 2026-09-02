import { pex } from '../lib/utils';

export const GALLERY_CATEGORIES = [
  'Everest',
  'Annapurna',
  'Langtang',
  'Mustang',
  'Culture',
  'Wildlife',
  'Adventure',
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  caption: string;
  category: GalleryCategory | string;
  credit?: string;
  /** true when uploaded/created from the admin dashboard */
  custom?: boolean;
  order?: number;
}

/** Seed gallery — the admin dashboard can edit, hide, reorder or extend this. */
export const seedGallery: GalleryImage[] = [
  { id: 'g1', src: pex(20839113, 1600, 1100), title: 'Dawn on Nuptse & Everest', caption: 'First light hits the Khumbu wall at 5,200 m — the reward for a 4 a.m. start.', category: 'Everest', credit: 'Prabin Sunar' },
  { id: 'g2', src: pex(6642124, 1600, 1100), title: 'Everest from Khumjung', caption: 'A rare cloudless winter morning above the Sherpa capital.', category: 'Everest', credit: 'Dick Hoskins' },
  { id: 'g3', src: pex(4185836, 1600, 1100), title: 'Prayer flags at altitude', caption: 'Wind-torn lungta carry blessings across the highest valley on Earth.', category: 'Culture', credit: 'Ashok J Kshetri' },
  { id: 'g4', src: pex(14158631, 1600, 1100), title: 'Yak train, Khumjung', caption: 'Everything above Namche still moves on the backs of yaks.', category: 'Everest', credit: 'Volker Meyer' },
  { id: 'g5', src: pex(6845912, 1600, 1100), title: 'Annapurna sunset panorama', caption: 'The massif catches the last light from Narchyang, deep in the valley.', category: 'Annapurna', credit: 'Mark de Jong' },
  { id: 'g6', src: pex(26570334, 1600, 1100), title: 'Machapuchare at sunrise', caption: 'The sacred fishtail — never climbed, never permitted.', category: 'Annapurna', credit: 'Abdul Kayum' },
  { id: 'g7', src: pex(13041045, 1600, 1100), title: 'Ghandruk first light', caption: 'Golden hour over the Annapurna south face from a stone village rooftop.', category: 'Annapurna', credit: 'Bijay Chaurasia' },
  { id: 'g8', src: pex(20768442, 1600, 1100), title: 'The Annapurna wall', caption: 'Seven thousand metres of vertical relief in a single frame.', category: 'Annapurna', credit: 'Bobby Diwakar' },
  { id: 'g9', src: pex(13040872, 1600, 1100), title: 'Langtang Lirung', caption: '7,227 m of ice hanging above the valley floor.', category: 'Langtang', credit: 'Bijay Chaurasia' },
  { id: 'g10', src: pex(16087994, 1600, 1100), title: 'Prayer flags, Langtang', caption: 'Colour against stone on the trail to Kyanjin Gompa.', category: 'Langtang', credit: 'Volker Meyer' },
  { id: 'g11', src: pex(34241677, 1600, 1100), title: 'Lo Manthang', caption: 'The walled capital of the forbidden kingdom, unchanged for six centuries.', category: 'Mustang', credit: 'Ashok J Kshetri' },
  { id: 'g12', src: pex(34022827, 1600, 1100), title: 'Mustang badlands', caption: 'Wind-carved ochre canyons in the Himalayan rain shadow.', category: 'Mustang', credit: 'Ashok J Kshetri' },
  { id: 'g13', src: pex(20808434, 1600, 1100), title: 'Chhusang cliffs', caption: 'Life continues beneath thousand-metre walls of conglomerate rock.', category: 'Mustang', credit: 'Rajan Pun' },
  { id: 'g14', src: pex(36564643, 1600, 1100), title: 'Swayambhunath', caption: 'The watching eyes above Kathmandu, wrapped in prayer flags.', category: 'Culture', credit: 'Mr Dr3igeteilt' },
  { id: 'g15', src: pex(28831413, 1600, 1100), title: 'Monsoon light, Kathmandu', caption: 'Storm clouds gather over the ancient stupa.', category: 'Culture', credit: 'Roman Saienko' },
  { id: 'g16', src: pex(39128859, 1600, 1100), title: "Tiger's Nest, Bhutan", caption: 'Taktsang clings to the cliff 900 m above the Paro valley.', category: 'Culture', credit: 'Soonam Wooeser' },
  { id: 'g17', src: pex(38267708, 1600, 1100), title: 'Greater one-horned rhino', caption: 'Chitwan protects over 750 — one of conservation’s great comebacks.', category: 'Wildlife', credit: 'Kaustav Chetia' },
  { id: 'g18', src: pex(36914166, 1600, 1100), title: 'Yak on high pasture', caption: 'Grazing above 4,000 m where nothing else survives the winter.', category: 'Wildlife', credit: 'Arijit Dey' },
  { id: 'g19', src: pex(32225792, 1600, 1100), title: 'Gokyo turquoise', caption: 'Glacial flour turns the sacred lakes an unreal shade of blue.', category: 'Everest', credit: 'Arjay Neyra' },
  { id: 'g20', src: pex(9683997, 1600, 1100), title: 'Roped on the ridge', caption: 'Two climbers moving together on a summit day approach.', category: 'Adventure', credit: 'Ezmari Nabizadeh' },
  { id: 'g21', src: pex(29622195, 1600, 1100), title: 'High camp under stars', caption: 'Expedition tents pitched on the glacier moraine.', category: 'Adventure', credit: 'Siddhartha Sen' },
  { id: 'g22', src: pex(37776428, 1600, 1100), title: 'White water', caption: 'Grade IV rapids on a Himalayan river expedition.', category: 'Adventure', credit: 'Evan Marlon' },
  { id: 'g23', src: pex(37911662, 1600, 1100), title: 'Breaking trail', caption: 'Fresh snow on the pass — slow going, unforgettable views.', category: 'Adventure', credit: 'Shubham Dhage' },
  { id: 'g24', src: pex(31614039, 1600, 1100), title: 'Storm over the range', caption: 'Weather builds fast in the afternoon at altitude.', category: 'Everest', credit: 'Dipak Chettri' },
];
