# Ascent Himalaya — Trekking & Travel Platform

A premium, data-driven Himalayan trekking website: cinematic marketing site, live
journey catalogue, photo gallery, booking flow, and a role-based staff dashboard.

## Feature map

| Area | Details |
| --- | --- |
| Marketing site | Timelapse video hero, destinations, regions, activities, stats, guides |
| Catalogue | 15 journeys with filters, sorting and relevance search — database-backed |
| Journey pages | Itinerary accordion, elevation profile, gallery, reviews, inquiry form |
| Gallery | `/gallery` — masonry grid, category filter, lightbox; admin-editable |
| Booking | `/booking` — journey picker, add-ons, live price + 20% deposit summary |
| Search | Site-wide relevance search with synonyms, ranking and highlighting |
| Email | Every booking & inquiry emailed to the admin inbox (Web3Forms, free) |
| Staff auth | Email/password only — PBKDF2-SHA256 hashed. **No social login.** |
| Admin | `/admin` — journeys, gallery, inbox with replies, user management, settings |

Visitors never create accounts. Browsing, enquiring and booking are all open;
`/login` exists purely for staff to reach the dashboard.

## Run locally

```bash
npm install
npm run dev
```

### First sign-in

The first administrator account is created automatically on first run:

```
User ID   admin
Password  Ascent@2024
```

Sign in at `/login`, then immediately open **Users → your account → Reset
password**. The login screen stops showing these credentials once changed.

## Staff accounts & roles

**Admin → Users** provides full account management: create members, assign a
unique User ID, set an initial password, choose a role, enable/disable access,
reset passwords, edit details and delete accounts. Search and role filters are
built in.

| Role | Access |
| --- | --- |
| **Administrator** | Everything — content, gallery, inbox, users, settings |
| **Board Member** | View-only across content, gallery and the inbox |
| **Hotel / Ops Manager** | Manage journeys, gallery and the inbox |
| **Staff Member** | Handle traveller inquiries and bookings |

Navigation, panels and edit controls are all filtered by role, and the route
itself is guarded — a signed-in user with no permissions sees an access notice
rather than the dashboard.

### Password security

Passwords are salted (16-byte CSPRNG) and hashed with **PBKDF2-SHA256 at
150,000 iterations** via the Web Crypto API before storage. Plain text is never
written to the database and never appears in the user table — passwords can
only be reset, never revealed. Verification uses a constant-time comparison.

> Note on architecture: this app is a static front end, so hashing happens in
> the browser. When you connect Firestore, protect the `users` collection with
> the rules below so only administrators can read or write accounts. For a
> higher-assurance setup, move `authenticate()` behind a Cloud Function.

## Cloud database (optional, free)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. **Firestore Database → Create database** (production mode)
3. **Project settings → Your apps → Web app** — copy the config values
4. Paste them into `.env` (see `.env.example`)
5. Add the security rules below, then `npm run build`

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /journeys/{slug} { allow read: if true;  allow write: if isAdmin(); }
    match /gallery/{id}    { allow read: if true;  allow write: if isAdmin(); }
    match /inquiries/{id}  { allow create: if true; allow read, update, delete: if isAdmin(); }
    match /users/{uid}     { allow read, write: if isAdmin(); }
  }
}
```

## Email notifications (2-minute setup, free)

1. Go to [web3forms.com](https://web3forms.com), enter your admin email → a free key is mailed to you
2. Add `VITE_WEB3FORMS_KEY=your-key` to `.env` (optionally `VITE_NOTIFY_EMAIL`)
3. Rebuild — every booking and inquiry now arrives in that inbox instantly

Replies are composed in the dashboard (saved to the thread) and open in your own
mail client so they send from your real address. Without a key nothing is lost —
submissions are still captured in the Inquiries inbox.

## Search

`src/lib/search.ts` builds an index over journeys, destinations, regions,
activities, travel guides and static pages. It supports partial and
case-insensitive matching, multiple keywords, weighted fields (title > tags >
meta > body), a synonym graph (searching *hotel* also surfaces accommodation,
lodges and teahouses) and relevance ranking. Input is debounced by 200 ms, terms
are highlighted in results, and there are dedicated loading and no-result states.
Press <kbd>/</kbd> anywhere to open it.

## Architecture

```
src/
  data/          Seed content (journeys, gallery, guides, reviews) + live store
  lib/
    firebase.ts  Firestore init (no auth SDK — staff auth is self-contained)
    db.ts        Unified data API: journeys, gallery, inquiries, accounts
    crypto.ts    PBKDF2 password hashing & verification
    auth.tsx     Staff session provider
    roles.ts     Role → permission matrix
    search.ts    Search index, synonyms, ranking, highlighting
    notify.ts    Email delivery for bookings & inquiries
  components/    UI kit, navbar, footer, search, cards, gallery, forms
  sections/      Homepage sections
  pages/         Public routes + `admin/` dashboard panels
```

Swapping in a different backend later only touches `src/lib/db.ts` — the UI
never talks to a data source directly.
