/** Role-based access control for the admin dashboard. */

export type Role = 'admin' | 'board' | 'manager' | 'staff';
export type Permission = 'overview' | 'journeys' | 'gallery' | 'inquiries' | 'users' | 'settings';

export const ROLES: { slug: Role; label: string; blurb: string }[] = [
  { slug: 'admin', label: 'Administrator', blurb: 'Full control — content, users, settings' },
  { slug: 'board', label: 'Board Member', blurb: 'Read-only oversight of everything except users' },
  { slug: 'manager', label: 'Hotel / Ops Manager', blurb: 'Manage journeys, gallery and the inbox' },
  { slug: 'staff', label: 'Staff Member', blurb: 'Handle traveller inquiries and bookings' },
];

const MATRIX: Record<Role, Permission[]> = {
  admin: ['overview', 'journeys', 'gallery', 'inquiries', 'users', 'settings'],
  board: ['overview', 'journeys', 'gallery', 'inquiries'],
  manager: ['overview', 'journeys', 'gallery', 'inquiries'],
  staff: ['overview', 'inquiries'],
};

/** Roles that may only look, never change. */
export const READ_ONLY_ROLES: Role[] = ['board'];

export const can = (role: Role | undefined, perm: Permission): boolean =>
  !!role && MATRIX[role]?.includes(perm);

export const canEdit = (role: Role | undefined): boolean =>
  !!role && !READ_ONLY_ROLES.includes(role);

export const roleLabel = (role: Role | undefined): string =>
  ROLES.find((r) => r.slug === role)?.label ?? 'Member';

export const roleTone: Record<Role, string> = {
  admin: 'bg-ember-100 text-ember-700',
  board: 'bg-violet-100 text-violet-700',
  manager: 'bg-sky-100 text-sky-700',
  staff: 'bg-emerald-100 text-emerald-700',
};
