import {
  addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc,
} from 'firebase/firestore';
import type { Journey } from '../data/types';
import { journeys as seedJourneys } from '../data/treks';
import { seedGallery, type GalleryImage } from '../data/gallery';
import { fbStore, firebaseReady } from './firebase';
import { hashPassword, verifyPassword, type PasswordRecord } from './crypto';
import type { Role } from './roles';

/* ============================ Shared types ============================ */

export interface Account {
  uid: string;
  /** Login handle — unique, case-insensitive */
  userId: string;
  name: string;
  email?: string;
  role: Role;
  status: 'active' | 'disabled';
  createdAt: number;
  lastLogin?: number;
  /** true until the bootstrap administrator changes the initial password */
  mustChangePassword?: boolean;
}

/** Internal shape — the password record never leaves this module. */
type StoredUser = Account & { password?: PasswordRecord };

export interface Inquiry {
  id: string;
  type: 'journey' | 'contact' | 'booking';
  trek?: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  date?: string;
  travelers?: string;
  subject?: string;
  message?: string;
  createdAt: number;
  status: 'new' | 'read' | 'replied';
  emailed?: boolean;
  replies?: { at: number; body: string }[];
}

type JourneyOverride = Partial<Journey> & { hidden?: boolean; added?: boolean };
type GalleryOverride = Partial<GalleryImage> & { hidden?: boolean; added?: boolean };

interface LocalDB {
  users: StoredUser[];
  inquiries: Inquiry[];
  journeyOverrides: Record<string, JourneyOverride>;
  journeyAdded: Journey[];
  galleryOverrides: Record<string, GalleryOverride>;
  galleryAdded: GalleryImage[];
  session: string | null;
}

/* ============================ Persistence ============================ */

const LS_KEY = 'ascent.db.v4';
const newId = (p = 'u') => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

/** Credentials for the first administrator, created automatically on first run. */
export const BOOTSTRAP = { userId: 'admin', password: 'Ascent@2024' };

function empty(): LocalDB {
  return {
    users: [],
    inquiries: [],
    journeyOverrides: {},
    journeyAdded: [],
    galleryOverrides: {},
    galleryAdded: [],
    session: null,
  };
}

function loadLocal(): LocalDB {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LocalDB;
      if (parsed && Array.isArray(parsed.users)) {
        parsed.galleryOverrides ??= {};
        parsed.galleryAdded ??= [];
        parsed.journeyOverrides ??= {};
        parsed.journeyAdded ??= [];
        parsed.inquiries ??= [];
        return parsed;
      }
    }
  } catch {
    /* unreadable store → start clean */
  }
  const fresh = empty();
  saveLocal(fresh);
  return fresh;
}

function saveLocal(db: LocalDB) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(db));
  } catch {
    /* quota / private mode — changes remain in memory for this session */
  }
}

const strip = ({ password: _pw, ...acc }: StoredUser): Account => acc;

/* ============================ Accounts & credentials ============================ */

async function readUsers(): Promise<StoredUser[]> {
  if (firebaseReady && fbStore) {
    const snap = await getDocs(collection(fbStore, 'users'));
    return snap.docs.map((d) => ({ ...(d.data() as StoredUser), uid: d.id }));
  }
  return loadLocal().users;
}

async function writeUser(user: StoredUser): Promise<void> {
  if (firebaseReady && fbStore) {
    await setDoc(doc(fbStore, 'users', user.uid), user, { merge: true });
    return;
  }
  const db = loadLocal();
  const i = db.users.findIndex((u) => u.uid === user.uid);
  if (i >= 0) db.users[i] = user;
  else db.users.push(user);
  saveLocal(db);
}

/** Creates the first administrator if no accounts exist yet. */
export async function ensureBootstrapAdmin(): Promise<void> {
  const users = await readUsers();
  if (users.length > 0) return;
  await writeUser({
    uid: newId(),
    userId: BOOTSTRAP.userId,
    name: 'Administrator',
    email: '',
    role: 'admin',
    status: 'active',
    createdAt: Date.now(),
    mustChangePassword: true,
    password: await hashPassword(BOOTSTRAP.password),
  });
}

/** True while the bootstrap admin still uses the initial password. */
export async function bootstrapPasswordUnchanged(): Promise<boolean> {
  const users = await readUsers();
  return users.some((u) => u.role === 'admin' && u.mustChangePassword);
}

export type AuthResult =
  | { ok: true; account: Account }
  | { ok: false; error: string };

/** Verify credentials. Accepts either the user ID or the email address. */
export async function authenticate(identifier: string, password: string): Promise<AuthResult> {
  await ensureBootstrapAdmin();
  const id = identifier.trim().toLowerCase();
  const users = await readUsers();
  const user = users.find(
    (u) => u.userId?.toLowerCase() === id || (u.email && u.email.toLowerCase() === id),
  );
  if (!user) return { ok: false, error: 'No account found with that user ID or email.' };
  if (user.status === 'disabled') return { ok: false, error: 'This account has been disabled. Contact an administrator.' };
  const valid = await verifyPassword(password, user.password);
  if (!valid) return { ok: false, error: 'Incorrect password. Please try again.' };

  const updated: StoredUser = { ...user, lastLogin: Date.now() };
  await writeUser(updated);
  return { ok: true, account: strip(updated) };
}

export async function listUsers(): Promise<Account[]> {
  await ensureBootstrapAdmin();
  const users = await readUsers();
  return users.map(strip).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export async function getAccount(uid: string): Promise<Account | null> {
  const users = await readUsers();
  const found = users.find((u) => u.uid === uid);
  return found ? strip(found) : null;
}

export interface NewUserInput {
  name: string;
  userId: string;
  email?: string;
  password: string;
  role: Role;
  status: 'active' | 'disabled';
}

export async function createUser(input: NewUserInput): Promise<{ ok: boolean; error?: string }> {
  const users = await readUsers();
  const id = input.userId.trim().toLowerCase();
  if (!id) return { ok: false, error: 'A user ID is required.' };
  if (users.some((u) => u.userId?.toLowerCase() === id)) return { ok: false, error: 'That user ID is already taken.' };
  if (input.email && users.some((u) => u.email?.toLowerCase() === input.email!.trim().toLowerCase())) {
    return { ok: false, error: 'That email is already registered.' };
  }
  await writeUser({
    uid: newId(),
    userId: input.userId.trim(),
    name: input.name.trim(),
    email: input.email?.trim() ?? '',
    role: input.role,
    status: input.status,
    createdAt: Date.now(),
    password: await hashPassword(input.password),
  });
  return { ok: true };
}

export async function updateUser(
  uid: string,
  patch: Partial<Pick<Account, 'name' | 'email' | 'role' | 'status' | 'userId'>>,
): Promise<{ ok: boolean; error?: string }> {
  const users = await readUsers();
  const user = users.find((u) => u.uid === uid);
  if (!user) return { ok: false, error: 'Account not found.' };
  if (patch.userId) {
    const id = patch.userId.trim().toLowerCase();
    if (users.some((u) => u.uid !== uid && u.userId?.toLowerCase() === id)) {
      return { ok: false, error: 'That user ID is already taken.' };
    }
  }
  await writeUser({ ...user, ...patch });
  return { ok: true };
}

/** Sets a new password (hashed) and clears the bootstrap flag. */
export async function setUserPassword(uid: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const users = await readUsers();
  const user = users.find((u) => u.uid === uid);
  if (!user) return { ok: false, error: 'Account not found.' };
  await writeUser({ ...user, password: await hashPassword(password), mustChangePassword: false });
  return { ok: true };
}

export async function deleteUser(uid: string): Promise<void> {
  if (firebaseReady && fbStore) {
    await deleteDoc(doc(fbStore, 'users', uid));
    return;
  }
  const db = loadLocal();
  db.users = db.users.filter((u) => u.uid !== uid);
  saveLocal(db);
}

/* -------- session (kept locally in both modes) -------- */

export const setSession = (uid: string | null) => {
  const db = loadLocal();
  db.session = uid;
  saveLocal(db);
};
export const getSessionUid = (): string | null => loadLocal().session;

/* ============================ Journeys CRUD ============================ */

export async function listJourneys(): Promise<Journey[]> {
  if (firebaseReady && fbStore) {
    const snap = await getDocs(collection(fbStore, 'journeys'));
    const overrides = new Map<string, JourneyOverride>();
    const added: JourneyOverride[] = [];
    snap.forEach((d) => {
      const data = d.data() as JourneyOverride;
      if (data.added) added.push(data);
      else overrides.set(d.id, data);
    });
    const merged = seedJourneys
      .filter((s) => !overrides.get(s.slug)?.hidden)
      .map((s) => {
        const o = overrides.get(s.slug);
        return o ? ({ ...s, ...o, slug: s.slug } as Journey) : s;
      });
    return [...merged, ...(added.filter((a) => !a.hidden) as Journey[])];
  }
  const db = loadLocal();
  const merged = seedJourneys
    .filter((s) => !db.journeyOverrides[s.slug]?.hidden)
    .map((s) => (db.journeyOverrides[s.slug] ? ({ ...s, ...db.journeyOverrides[s.slug], slug: s.slug } as Journey) : s));
  return [...merged, ...db.journeyAdded];
}

export async function saveJourney(j: Journey, isNew: boolean): Promise<void> {
  if (firebaseReady && fbStore) {
    await setDoc(doc(fbStore, 'journeys', j.slug), { ...j, hidden: false, added: isNew }, { merge: !isNew });
    return;
  }
  const db = loadLocal();
  if (isNew) {
    db.journeyAdded = [...db.journeyAdded.filter((x) => x.slug !== j.slug), j];
  } else if (db.journeyAdded.some((x) => x.slug === j.slug)) {
    db.journeyAdded = db.journeyAdded.map((x) => (x.slug === j.slug ? j : x));
  } else {
    db.journeyOverrides[j.slug] = { ...db.journeyOverrides[j.slug], ...j, hidden: false };
  }
  saveLocal(db);
}

export async function deleteJourney(slug: string, isAdded: boolean): Promise<void> {
  if (firebaseReady && fbStore) {
    if (isAdded) await deleteDoc(doc(fbStore, 'journeys', slug));
    else await setDoc(doc(fbStore, 'journeys', slug), { hidden: true }, { merge: true });
    return;
  }
  const db = loadLocal();
  if (isAdded) {
    db.journeyAdded = db.journeyAdded.filter((x) => x.slug !== slug);
    delete db.journeyOverrides[slug];
  } else {
    db.journeyOverrides[slug] = { ...db.journeyOverrides[slug], hidden: true };
  }
  saveLocal(db);
}

export async function resetJourneys(): Promise<void> {
  if (firebaseReady && fbStore) {
    const snap = await getDocs(collection(fbStore, 'journeys'));
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
    return;
  }
  const db = loadLocal();
  db.journeyOverrides = {};
  db.journeyAdded = [];
  saveLocal(db);
}

/* ============================ Gallery CRUD ============================ */

export async function listGallery(): Promise<GalleryImage[]> {
  if (firebaseReady && fbStore) {
    const snap = await getDocs(collection(fbStore, 'gallery'));
    const overrides = new Map<string, GalleryOverride>();
    const added: GalleryOverride[] = [];
    snap.forEach((d) => {
      const data = d.data() as GalleryOverride;
      if (data.added) added.push({ ...data, id: d.id });
      else overrides.set(d.id, data);
    });
    const merged = seedGallery
      .filter((g) => !overrides.get(g.id)?.hidden)
      .map((g) => (overrides.get(g.id) ? ({ ...g, ...overrides.get(g.id), id: g.id } as GalleryImage) : g));
    return [...merged, ...(added.filter((a) => !a.hidden) as GalleryImage[])].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );
  }
  const db = loadLocal();
  const merged = seedGallery
    .filter((g) => !db.galleryOverrides[g.id]?.hidden)
    .map((g) => (db.galleryOverrides[g.id] ? ({ ...g, ...db.galleryOverrides[g.id], id: g.id } as GalleryImage) : g));
  return [...merged, ...db.galleryAdded].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function saveGalleryImage(img: GalleryImage, isNew: boolean): Promise<void> {
  if (firebaseReady && fbStore) {
    await setDoc(doc(fbStore, 'gallery', img.id), { ...img, hidden: false, added: isNew || img.custom }, { merge: !isNew });
    return;
  }
  const db = loadLocal();
  if (isNew) {
    db.galleryAdded = [...db.galleryAdded.filter((x) => x.id !== img.id), { ...img, custom: true }];
  } else if (db.galleryAdded.some((x) => x.id === img.id)) {
    db.galleryAdded = db.galleryAdded.map((x) => (x.id === img.id ? img : x));
  } else {
    db.galleryOverrides[img.id] = { ...db.galleryOverrides[img.id], ...img, hidden: false };
  }
  saveLocal(db);
}

export async function deleteGalleryImage(id: string, isAdded: boolean): Promise<void> {
  if (firebaseReady && fbStore) {
    if (isAdded) await deleteDoc(doc(fbStore, 'gallery', id));
    else await setDoc(doc(fbStore, 'gallery', id), { hidden: true }, { merge: true });
    return;
  }
  const db = loadLocal();
  if (isAdded) db.galleryAdded = db.galleryAdded.filter((x) => x.id !== id);
  else db.galleryOverrides[id] = { ...db.galleryOverrides[id], hidden: true };
  saveLocal(db);
}

export async function resetGallery(): Promise<void> {
  if (firebaseReady && fbStore) {
    const snap = await getDocs(collection(fbStore, 'gallery'));
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
    return;
  }
  const db = loadLocal();
  db.galleryOverrides = {};
  db.galleryAdded = [];
  saveLocal(db);
}

/* ============================ Inquiries ============================ */

export async function createInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<void> {
  const record = { ...data, createdAt: Date.now(), status: 'new' as const };
  if (firebaseReady && fbStore) {
    await addDoc(collection(fbStore, 'inquiries'), record);
    return;
  }
  const db = loadLocal();
  db.inquiries.unshift({ ...record, id: newId('i') });
  saveLocal(db);
}

export async function listInquiries(): Promise<Inquiry[]> {
  if (firebaseReady && fbStore) {
    const snap = await getDocs(collection(fbStore, 'inquiries'));
    return snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Omit<Inquiry, 'id'>) }))
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  return [...loadLocal().inquiries].sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateInquiry(id: string, patch: Partial<Inquiry>): Promise<void> {
  if (firebaseReady && fbStore) {
    await updateDoc(doc(fbStore, 'inquiries', id), patch);
    return;
  }
  const db = loadLocal();
  db.inquiries = db.inquiries.map((i) => (i.id === id ? { ...i, ...patch } : i));
  saveLocal(db);
}

export async function addReply(id: string, body: string): Promise<void> {
  const entry = { at: Date.now(), body };
  if (firebaseReady && fbStore) {
    const snap = await getDocs(collection(fbStore, 'inquiries'));
    const existing = (snap.docs.find((d) => d.id === id)?.data() as Inquiry | undefined)?.replies ?? [];
    await updateDoc(doc(fbStore, 'inquiries', id), { replies: [...existing, entry], status: 'replied' });
    return;
  }
  const db = loadLocal();
  db.inquiries = db.inquiries.map((i) =>
    i.id === id ? { ...i, replies: [...(i.replies ?? []), entry], status: 'replied' as const } : i,
  );
  saveLocal(db);
}

export async function deleteInquiry(id: string): Promise<void> {
  if (firebaseReady && fbStore) {
    await deleteDoc(doc(fbStore, 'inquiries', id));
    return;
  }
  const db = loadLocal();
  db.inquiries = db.inquiries.filter((i) => i.id !== id);
  saveLocal(db);
}
