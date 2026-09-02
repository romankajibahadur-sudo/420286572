/**
 * Password hashing using PBKDF2-SHA256 via the Web Crypto API.
 *
 * Passwords are NEVER stored or transmitted in plain text — only a random
 * per-user salt and the derived hash are persisted. Verification re-derives
 * the hash from the supplied password and compares in constant time.
 */

const ITERATIONS = 150_000;
const KEY_LEN = 32; // bytes

const toHex = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const fromHex = (hex: string) => {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i += 1) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
};

async function derive(password: string, salt: Uint8Array): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as unknown as BufferSource, iterations: ITERATIONS, hash: 'SHA-256' },
    key,
    KEY_LEN * 8,
  );
  return toHex(bits);
}

export interface PasswordRecord {
  salt: string;
  hash: string;
  algo: 'pbkdf2-sha256';
  iterations: number;
}

/** Create a salted hash record for a new/updated password. */
export async function hashPassword(password: string): Promise<PasswordRecord> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt);
  return { salt: toHex(salt.buffer), hash, algo: 'pbkdf2-sha256', iterations: ITERATIONS };
}

/** Constant-time-ish comparison of a candidate password against a record. */
export async function verifyPassword(password: string, record?: PasswordRecord | null): Promise<boolean> {
  if (!record?.salt || !record?.hash) return false;
  const candidate = await derive(password, fromHex(record.salt));
  if (candidate.length !== record.hash.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i += 1) diff |= candidate.charCodeAt(i) ^ record.hash.charCodeAt(i);
  return diff === 0;
}

/** Simple strength signal used by the admin user form. */
export function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score += 1;
  const labels = ['Too short', 'Weak', 'Fair', 'Strong', 'Excellent'];
  const s = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;
  return { score: s, label: labels[s] };
}
