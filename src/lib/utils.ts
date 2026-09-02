export const formatPrice = (n: number) => `$${n.toLocaleString('en-US')}`;

export const formatAlt = (m: number) => `${m.toLocaleString('en-US')} m`;

export const difficultyTone: Record<string, string> = {
  Easy: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Moderate: 'bg-amber-100 text-amber-800 border-amber-200',
  Challenging: 'bg-orange-100 text-orange-800 border-orange-200',
  Strenuous: 'bg-rose-100 text-rose-800 border-rose-200',
};

export const difficultyDot: Record<string, string> = {
  Easy: 'bg-emerald-500',
  Moderate: 'bg-amber-500',
  Challenging: 'bg-orange-500',
  Strenuous: 'bg-rose-500',
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Build a Pexels image URL at a specific size (keeps CDN compression). */
export const pex = (id: number, w = 1200, h = 800, ext = 'jpeg') =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
