import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Database wiring.
 *
 * With VITE_FIREBASE_* configured the app stores content, staff accounts
 * and inquiries in Cloud Firestore, shared across devices and team members.
 * Without it, the same API is served by a persistent local database so the
 * site is fully functional out of the box.
 *
 * Staff authentication is handled by the application itself (PBKDF2-hashed
 * credentials in the `users` collection) — no third-party identity provider.
 */

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const REQUIRED_ENV_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

export const missingEnvKeys = REQUIRED_ENV_KEYS.filter(
  (k) => !(import.meta.env as Record<string, string | undefined>)[k],
);

export const firebaseReady = missingEnvKeys.length === 0;

let app: FirebaseApp | null = null;
let fbStore: Firestore | null = null;

if (firebaseReady) {
  app = getApps()[0] ?? initializeApp(config);
  fbStore = getFirestore(app);
}

export { app, fbStore };
export const backendMode: 'firebase' | 'local' = firebaseReady ? 'firebase' : 'local';
