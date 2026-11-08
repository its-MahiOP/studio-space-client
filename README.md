# StudioSpace

**Live site:** https://studio-space-client-beta.vercel.app/

StudioSpace is a peer-to-peer marketplace where creators discover, inspect and
book photo studios, sound stages, podcast rooms, music suites and art workshops
from independent hosts — with transparent hourly pricing, real availability and
no middle layer.

The frontend lives in this repo; the data API lives in
[`studio-space-server`](https://github.com/its-MahiOP/studio-space-server) and
is reached through a same-origin proxy.

---

## At a glance

- **Live website** — https://studio-space-client-beta.vercel.app/ (deployed on
  Vercel; API health check at `/api/backend/health` returns
  `{"status":"ok","database":"connected"}`)
- **Feature-rich** — home page with hero slides, live featured grid and five
  category sections; full studio CRUD with image gallery; bookings with status
  transitions and double-booking protection; reviews (one per user per studio);
  saved-studios wishlist; PDF booking invoices; light/dark theme
- **Tech stack** — Next.js 16 (App Router, Turbopack, React Compiler), Tailwind
  CSS v4, Base UI + lucide icons, BetterAuth (email/password + Google) with
  MongoDB, jsPDF, and an Express + MongoDB API on Vercel serverless
- **Local setup** — clone, `npm install`, copy `.env.example` → `.env`, fill in
  `MONGO_URI` + `BETTER_AUTH_SECRET`, start the API (`npm run dev` on :5000)
  then the client (`npm run dev` on :3000)
- **Examiner test credentials** — sign in at
  https://studio-space-client-beta.vercel.app/login with
  **`test@studiospace.dev`** / **`StudioSpace2026`** (or register a new account
  at `/register`)

---

## Examiner test account

| Field    | Value                                                            |
| -------- | ---------------------------------------------------------------- |
| Email    | `test@studiospace.dev`                                           |
| Password | `StudioSpace2026`                                                |
| Sign in  | https://studio-space-client-beta.vercel.app/login                |

The account has no listings yet — use **Add a studio** to create one, then book,
review and save studios to exercise every flow. It works locally and on the live
deployment.

---

## Tech stack

| Layer      | Choice                                                  |
| ---------- | ------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack, React Compiler)      |
| Styling    | Tailwind CSS v4 with design tokens in `globals.css`     |
| Data       | TanStack-free custom hooks (`useAsyncData`) over `fetch` |
| Auth       | BetterAuth (email/password + Google, MongoDB adapter, JWT plugin) |
| UI         | Base UI primitives, custom toast system, lucide icons   |
| PDF        | jsPDF for booking invoices                              |
| Deploy     | Vercel                                                  |

---

## Architecture

```
Browser ──▶ Next.js (Vercel)
              │  /api/auth/*      BetterAuth (session cookie)
              │  /api/auth-token  mints the API JWT → HTTPOnly cookie
              │  /api/backend/*   same-origin proxy → Express API
              ▼
         Express API + MongoDB
```

**Why the proxy exists:** the JWT that authorizes mutations lives in an
HTTPOnly cookie scoped to *this* app's host. Cookies are host-scoped, so if the
browser called a second `*.vercel.app` deployment directly, the cookie would
never be sent and every mutation would 401. `src/app/api/backend/[...path]/route.ts`
forwards the request server-to-server, keeping the browser on a single origin
while the page's JavaScript still can't read the token (Challenge 1 preserved).

**Route protection** is layered: `src/proxy.ts` (Next middleware) redirects
cookie-less requests on `/dashboard`, `/add-studio`, `/my-bookings`,
`/my-listings`, `/studios/edit` and `/wishlist` to `/login?redirect=…`;
`RequireAuth` and the dashboard layout repeat the check client-side.

---

## Project map

```
src/
├── app/                     Routes (App Router)
│   ├── page.tsx             Home: hero, featured grid, categories, stats
│   ├── studios/             Index, detail (gallery + reviews), edit
│   ├── dashboard/           Owner overview, listings, bookings
│   ├── add-studio/  my-bookings/  my-listings/  wishlist/
│   ├── login/  register/
│   └── api/
│       ├── auth/[...all]/   BetterAuth handler
│       ├── auth-token/      Mints/clears the API JWT cookie
│       └── backend/[...path]/  Same-origin API proxy
├── components/
│   ├── providers/           Auth, theme, toast, wishlist
│   ├── layout/              Header, footer, logo
│   ├── studios/             Cards, detail, forms, reviews, gallery, booking
│   ├── dashboard/           Overview + panels
│   └── shared/              States, skeletons, loaders, images
├── hooks/use-api-data.ts    useStudios / useBookings / useReviews / useWishlist
├── lib/                     api.ts, auth.ts, invoice.ts, format.ts
├── data/                    Categories, amenities, nav, home copy
└── proxy.ts                 Middleware: private-route matchers
```

---

## Local setup

**Prerequisites:** Node.js 20+, a MongoDB database (Atlas or local), and the
companion API repo cloned next to this one.

```bash
# 1. Start the API (separate terminal) — http://localhost:5000
cd "../Studio Space Server/studio-space-server"
npm install
cp .env.example .env        # set MONGO_URI
npm run dev

# 2. Start the client — http://localhost:3000
npm install
cp .env.example .env        # fill in the values below
npm run dev
```

`.env` (copy from `.env.example`; `.env*` is git-ignored, `.env.example` is not):

```bash
# Required — MongoDB connection string (BetterAuth stores users here too)
MONGO_URI=

# Required — the Express API this app proxies /api/backend/* to.
# Local: http://localhost:5000   Production: https://<your-api>.vercel.app
SERVER_BASE_URL=http://localhost:5000

# Required — BetterAuth session secret (npx @better-auth/cli secret)
BETTER_AUTH_SECRET=
# Public URL of THIS app
BETTER_AUTH_URL=http://localhost:3000

# Optional — Google OAuth (email/password works without these)
BETTER_AUTH_GOOGLE_CLIENT_ID=
BETTER_AUTH_GOOGLE_CLIENT_SECRET=

# Optional — image uploads from the studio form (api.imgbb.com)
NEXT_PUBLIC_IMGBB_API_KEY=
```

Open http://localhost:3000 and sign in with the examiner account above.

Both apps share the same MongoDB database: BetterAuth owns the `user` /
`session` / `account` collections, the API owns `studios`, `bookings`, `reviews`
and `wishlists`.

> On Vercel, set every variable above in Project → Settings → Environment
> Variables (Production + Preview).

### Checks before you push

```bash
npx tsc --noEmit     # typecheck
npx eslint .         # lint
npm run build        # production build (also validates every route)
```

---

## Deploying to Vercel

The client is live at **https://studio-space-client-beta.vercel.app/** — these
are the steps that produced it. Deploy the **API first**, then this app, since
the client needs the API's URL.

1. **Import both repos** into Vercel (client preset: *Next.js*, defaults).
2. **Set the client's environment variables** for Production + Preview:
   `MONGO_URI`, `SERVER_BASE_URL`, `AUTH_JWKS_URL` (on the *server* repo),
   `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and optionally the Google +
   ImgBB keys.
3. **Google OAuth (optional):** in Google Cloud Console add the redirect URI
   `https://studio-space-client-beta.vercel.app/api/auth/callback/google`.
4. **Atlas:** allow network access from Vercel (0.0.0.0/0 or the Vercel
   integration) so both deployments can reach the database.
5. **Deploy the client**, then update the server's `AUTH_JWKS_URL` and
   `CLIENT_ORIGINS` to `https://studio-space-client-beta.vercel.app` and
   redeploy the server.

Verify: `https://studio-space-client-beta.vercel.app/api/backend/health`
should return `{"status":"ok","database":"connected"}`.

---

## Feature checklist

**Layout** — responsive header with active-path highlighting, mobile sheet,
theme toggle (light/dark, no flash via pre-paint script), footer, consistent
`shell`/`eyebrow`/`display-*` design tokens.

**Home** — hero with three linked slides, featured grid (live query,
`limit=6&sort=recommended`), five category sections, stats, testimonials.

**Auth** — BetterAuth email/password + Google, HTTPOnly session, protected
routes via middleware + `RequireAuth`, JWT minted to an HTTPOnly cookie for API
mutations.

**CRUD** — studios (create/read/update/delete, owner-only), bookings
(create/list/status transitions with overlap rejection), reviews (list/create,
one per user per studio), wishlist (save/remove).

**Challenges** — (1) HTTPOnly-cookie auth with proxy + JWKS verification,
(2) client-side route protection with redirect-back, (3) theme applied before
first paint.

**Optional** — PDF booking invoices (jsPDF) and a saved-studios wishlist with
heart toggles on every card plus a dedicated `/wishlist` page.

---

## Design notes

- **Render-phase state sync.** The search box mirrors its value into
  `useSearchParams` during render (`syncedQuery`) instead of a `useEffect`, so
  there's no input lag and no hydration mismatch.
- **Optimistic wishlist.** Hearts update immediately and roll back on failure
  with a toast; all cards share one `WishlistProvider` request rather than one
  fetch per card.
- **Graceful deletions.** The wishlist page resolves saved ids with
  `Promise.allSettled`, dropping studios whose hosts deleted them instead of
  failing the page.
