# Events Map — Project Handover Document

**Document version:** 1.0  
**Generated from source code review:** June 2026  
**Repositories:**

| Repository | Path (local) | Remote (CI) |
|------------|--------------|-------------|
| Frontend | `eventsmap-frontend/` | `ghcr.io/zerosoft-technologies/eventsmap-frontend-vue` |
| Backend | `eventsmap-backend/` | `ghcr.io/zerosoft-technologies/eventsmap-backend` |

---

# Project Overview

## Project name

**Events Map** (The Events Map)

## Purpose of the application

Events Map is a geospatial event discovery and profile management platform. Users browse events, talents, organisers, and venues on an interactive map, create and manage premium or free profiles, send/receive event invitations, chat via Firebase, and subscribe to premium features through Stripe.

## Business functionality

- **Public discovery:** Map and list views for events and V2 profiles (talent, organiser, venue) with category, date/time, location, and viewport filters.
- **Profile management:** Users create one profile type per account (Event, Talent, Organiser, Venue) in free or premium tiers.
- **Event publishing:** Premium event publishers create events, invite registered profiles or guest emails, and manage publication lifecycle (draft → published, status, recurring events).
- **Invitations:** Accepted/rejected invitation workflow with email notifications and Firestore in-app notifications.
- **Monetisation:** Stripe Checkout for premium registration/upgrade; subscription billing portal; invoice PDF generation.
- **Communication:** Firebase Firestore chat (global and event-scoped), contact boxes on premium profiles.
- **Administration:** Separate admin API for moderation, analytics, V2 CRUD, and super-admin taxonomy management.

## Main user roles

| Role | Source | Description |
|------|--------|-------------|
| **Guest / Visitor** | No auth | Browse public map, events, profiles |
| **Registered user (`user`)** | `User::ROLE_USER` | Login, free or premium account |
| **Event publisher** | `profile_type = event` | Creates and publishes events (premium) |
| **Talent** | `profile_type = talent` | Talent freemium/premium profile |
| **Organiser** | `profile_type = organizer` | Organiser freemium/premium profile (distinct from “Event Publisher” terminology in UI) |
| **Venue** | `profile_type = venue` | Venue freemium/premium profile |
| **Admin** | `User::ROLE_ADMIN` | Admin panel API access |
| **Super Admin** | `User::ROLE_SUPER_ADMIN` | Taxonomy, backoffice users, invoices |

**Account types:** `free`, `premium` (`User::ACCOUNT_FREE`, `User::ACCOUNT_PREMIUM`)  
**Account statuses:** `active`, `pending_payment`, `suspended`

## Core features

- Interactive map (MapLibre GL) with event/profile markers, clustering, wishlist
- List view panel synced with map viewport
- Header search with category/subcategory and date/time (06:00 discovery window)
- V2 profile CRUD (events, talents, organisers, venues)
- Event invitations (registered + guest email)
- Gallery image upload (premium)
- Stripe payments and subscriptions
- Firebase chat and invitation notifications
- Multi-language UI (en-GB, nl-NL, fr-FR)
- Admin backoffice API
- PDF invoices (DomPDF)

---

# Technology Stack

## Frontend (`eventsmap-frontend`)

| Category | Technology | Version / Notes |
|----------|------------|-----------------|
| Framework | Vue 3 (Composition API, `<script setup>`) | ^3.5 |
| Build | Vite | ^7.2 |
| Language | TypeScript + legacy JavaScript | Mixed codebase |
| Routing | Vue Router 4 | HTML5 history |
| State | Pinia | ^3.0 |
| HTTP | Axios | `/api/` and `/api/v2/` |
| Styling | Tailwind CSS v4, SCSS | `@tailwindcss/vite` |
| i18n | vue-i18n | en-GB, nl-NL, fr-FR |
| Maps | MapLibre GL, `@indoorequal/vue-maplibre-gl` | OSM tiles, MapTiler style |
| Geospatial | Turf.js | Clustering, regions |
| Dates | flatpickr, vue-tailwind-datepicker | |
| Firebase | firebase (Auth + Firestore) | Chat, notifications, presence |
| Icons | lucide-vue-next | |
| Production serve | `serve` (static) | Docker CMD port 3000 |

## Backend (`eventsmap-backend`)

| Category | Technology | Version / Notes |
|----------|------------|-----------------|
| Framework | Laravel | ^12.0 |
| Language | PHP | ^8.2 (Docker/CI: 8.4) |
| API auth | Laravel Sanctum | Bearer tokens |
| Database | PostgreSQL (PostGIS in dev compose) | Default in `.env.example` |
| ORM | Eloquent | 34 models |
| Payments | stripe/stripe-php | ^19.4 |
| Firebase Admin | kreait/firebase-php | Custom tokens, notifications |
| PDF | barryvdh/laravel-dompdf | Invoices |
| Queue | Laravel queue (database/sync) | Invitation emails use `emails` queue |
| Cache | Database cache store | Configurable |
| Mail | SMTP | Laravel Mail |

## Databases

- **Primary:** PostgreSQL (`pgsql`) — production-oriented
- **Dev compose:** PostGIS 16 (`podman-compose.dev.yml`)
- **Legacy config default:** SQLite mentioned in `config/database.php` but not used in `.env.example`

## Caching systems

- Laravel `CACHE_STORE=database` (default in `.env.example`)
- Redis configured but optional (`REDIS_*` env vars)
- Memcached host placeholder — **Not Found in active use**

## Cloud services

- **GitHub Container Registry (GHCR):** Docker images
- **AWS S3:** Optional via `FILESYSTEM_DISK` / `AWS_*` — **optional, not required for local dev**
- **Firebase (Google):** Auth tokens, Firestore, FCM-related project config
- **Stripe:** Payments and webhooks
- **MapTiler:** Map style API (frontend)
- **OSRM:** Public routing API (`router.project-osrm.org`)
- **OpenStreetMap / Nominatim:** Tiles and geocoding

## DevOps tools

- **GitHub Actions:** `.github/workflows/otap-frontend.yml`, `otap-backend.yml`
- **Podman Compose:** test/stage/prod deployment on VPS
- **Docker:** Multi-stage builds (frontend + backend)
- **Trivy + Syft:** SBOM and vulnerability scan in CI
- **Jenkins:** **Not Found in Codebase**
- **PM2:** **Not Found in Codebase**
- **Nginx:** **Not Found in Codebase** (likely on VPS outside repos)

---

# System Architecture

## High-level architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                          │
│  Vue 3 SPA (Vite build) — Map, List, Profiles, Chat sidebar      │
└───────────────┬─────────────────────────────┬───────────────────┘
                │ HTTPS REST                   │ Firebase SDK
                ▼                              ▼
┌───────────────────────────┐    ┌──────────────────────────────┐
│  Laravel API (PHP)         │    │  Firebase (Auth + Firestore)  │
│  /api/auth, /api/v2, ...   │    │  Chat, notifications, presence│
└───────────────┬───────────┘    └──────────────────────────────┘
                │
                ▼
┌───────────────────────────┐    ┌──────────────────────────────┐
│  PostgreSQL                │    │  Stripe (Checkout/Webhooks)   │
│  events_v2, profiles, etc. │    │  Subscriptions & invoices     │
└───────────────────────────┘    └──────────────────────────────┘
                │
                ▼
┌───────────────────────────┐
│  Local/S3 storage          │
│  Gallery, invoices, images │
└───────────────────────────┘
```

## Application flow

1. User opens SPA → `main.ts` bootstraps Pinia, router, i18n → `authStore.initializeAuth()` loads `/api/auth/me` if token exists.
2. **Home (`/`):** `Home.vue` + `Header.vue` load discovery data from `/api/v2/events` or profile listing endpoints; map renders via `EventsMap.vue`.
3. **Authenticated flows:** Token attached via Axios interceptor; premium routes gated by router + backend `premium.active` middleware.
4. **Chat:** After login, frontend requests `/api/v2/firebase/token`, signs into Firebase, listens to Firestore collections.
5. **Payments:** Registration/upgrade returns Stripe Checkout URL; webhook updates user subscription state; frontend handles `/payment/success`, `/payment-required`.

## Frontend → Backend → Database interaction

| Layer | Responsibility |
|-------|----------------|
| `src/services/api.ts` | Axios instance, base URL, 401/403 interceptors |
| `src/api/*` | Typed API modules (events, discovery, subscription, gallery) |
| `src/stores/*` | Pinia state (auth, map, events, chat, wishlist) |
| Laravel routes | `routes/v2.php`, `routes/auth.php`, `routes/api.php` |
| Controllers | `app/Http/Controllers/V2/*` |
| Services | `app/Services/V2/*` (business logic) |
| Models | Eloquent → PostgreSQL tables |

## Authentication flow

```
Register/Login → POST /api/auth/register|login
              → { user, token }
              → localStorage.setItem('token', token)
              → Subsequent requests: Authorization: Bearer {token}
              → Optional: POST /api/v2/firebase/token → Firebase signInWithCustomToken
Logout        → POST /api/auth/logout → clear token
401           → clear token, redirect /login
403 pending_payment → redirect /payment-required
```

Email verification: `MustVerifyEmail` on User; links to `/api/auth/email/verify/{id}/{hash}`.

## External service integrations

| Service | Direction | Integration point |
|---------|-----------|-------------------|
| Stripe | Backend ↔ Stripe | `StripeController`, webhooks, `SubscriptionService` |
| Firebase | Backend → token; Frontend ↔ Firestore | `FirebaseTokenController`, `firebase.ts`, `chatFirestore.ts` |
| SMTP | Backend → Mail | Invitation, verification, invoice emails |
| MapTiler | Frontend → CDN | `src/config/mapConfig.ts` |
| OSRM | Frontend → API | `src/services/routingService.ts` |
| Nominatim | Frontend → API | Geocoding in Header/Home |

---

# Repository Structure

## Frontend (`eventsmap-frontend/`)

| Folder / File | Purpose | Entry / Important files |
|---------------|---------|-------------------------|
| `index.html` | Vite HTML shell | Loads `/src/main.ts` |
| `src/main.ts` | **App entry** | Creates Vue app, auth bootstrap |
| `src/App.vue` | Root layout | Header, router-view, chat, wishlist |
| `src/router/index.ts` | **Routing** | Guards: auth, premium, profile type |
| `src/pages/` | Route pages | `Home.vue`, `pages/packages/*`, `pages/auth/*` |
| `src/components/` | UI components | `Header.vue`, `EventsMap.vue`, `DiscoveryProfileDetailsPanel.vue` |
| `src/stores/` | Pinia stores | `auth.ts`, `mapStore.ts`, `chatStore.ts` |
| `src/services/` | HTTP + Firebase | `api.ts`, `firebase.ts`, `chatService.ts` |
| `src/api/` | API modules | `events.ts`, `discoveryProfiles.ts`, `subscription.ts` |
| `src/locales/` | i18n JSON | `en-GB.json`, `nl-NL.json`, `fr-FR.json` |
| `src/composables/` | Reusable logic | Validation, billing, gallery |
| `public/` | Static assets | Map style JSON, markers |
| `docs/` | Project docs | `EVENTS_API.md`, this handover |
| `Dockerfile` | Production image | Node build + `serve` |
| `podman-compose.*.yml` | VPS deployment | Ports 3001–3003 |
| `.github/workflows/` | CI/CD | `otap-frontend.yml` |
| `firestore.rules` | Firestore security | Chat/notification rules |
| `vite.config.ts` | Vite config | `@` alias, Tailwind plugin |

**Legacy / stale artifacts:** `.next/` (Next.js remnant), `.env.dev` (`NEXT_PUBLIC_*`), `Guidelines to Setup.md` (references Next.js).

## Backend (`eventsmap-backend/`)

| Folder / File | Purpose | Entry / Important files |
|---------------|---------|-------------------------|
| `artisan` | **CLI entry** | Migrations, queue, serve |
| `public/index.php` | **HTTP entry** | Web root |
| `bootstrap/app.php` | App bootstrap | Route groups, middleware aliases |
| `routes/v2.php` | **Primary API** | V2 events, profiles, chat, invitations |
| `routes/auth.php` | User auth | `/api/auth/*` |
| `routes/api.php` | Legacy + billing | v1 events, Stripe, gallery, invoices |
| `routes/admin.php` | Admin API | `/api/admin/*` |
| `routes/organizer.php` | Legacy organizer | Auth middleware **commented out** |
| `app/Http/Controllers/V2/` | V2 controllers | 20 controllers |
| `app/Services/V2/` | Domain services | Event, invitation, profile, Firebase |
| `app/Models/` | Eloquent models | 34 models |
| `database/migrations/` | Schema | 90 migration files |
| `database/seeders/` | Seed data | `DatabaseSeeder.php` (blocked in production) |
| `config/` | Configuration | `services.php`, `cors.php`, `invoice.php` |
| `resources/views/emails/` | Email templates | Blade |
| `docs/` | Internal API docs | `SEEDING_DATABASE.md`, `SUBSCRIPTION_API.md` |
| `tests/` | PHPUnit | 24 test files |
| `Dockerfile` | Production image | PHP 8.4, port 8000 |
| `podman-compose.*.yml` | VPS deployment | Ports 4001–4003 |
| `.github/workflows/` | CI/CD | `otap-backend.yml` |

---

# Environment Configuration

## Backend — `.env.example`

**File:** `eventsmap-backend/.env.example`

> **Security warning:** The committed `.env.example` contains example mail credentials and Firebase paths. Rotate all secrets before production handover. Do not copy literal values to production.

### Safe `.env.example` template (sanitized)

```env
# ─── Application ───
APP_NAME="Events Map"
APP_ENV=local
APP_KEY=                          # Required: php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US
APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

# ─── Logging ───
LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

# ─── Database (Required for production) ───
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=eventsmap
DB_USERNAME=eventsmap
DB_PASSWORD=your_db_password_here

# ─── Session ───
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

# ─── Queue / Cache / Files ───
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
CACHE_STORE=database

# ─── Redis (Optional) ───
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# ─── Mail (Required for invitations/verification) ───
MAIL_MAILER=smtp
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="${APP_NAME}"

# ─── AWS S3 (Optional) ───
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

# ─── Frontend URL (Required for emails/Stripe redirects) ───
FRONTEND_URL=http://localhost:5173

# ─── Stripe (Required for premium) ───
STRIPE_KEY=pk_test_xxx
STRIPE_SECRET=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID=price_xxx
STRIPE_CHECKOUT_MODE=auto
STRIPE_PREMIUM_AMOUNT=100
STRIPE_PREMIUM_CURRENCY=eur

# ─── Invoices ───
INVOICE_COMPANY_NAME="${APP_NAME}"
INVOICE_COMPANY_ADDRESS=
INVOICE_COMPANY_VAT_NUMBER=
INVOICE_COMPANY_EMAIL="${MAIL_FROM_ADDRESS}"
INVOICE_LOGO_PATH=images/marker.png
INVOICE_NUMBER_PREFIX=INV
INVOICE_DEFAULT_TAX_RATE=0
INVOICE_STORAGE_DISK=public
INVOICE_EMAIL_ASYNC=false
INVOICE_EMAIL_QUEUE=default

# ─── Firebase (Required for chat/notifications) ───
FIREBASE_CREDENTIALS=storage/app/firebase-service-account.json
FIREBASE_PROJECT_ID=your-firebase-project-id

VITE_APP_NAME="${APP_NAME}"
```

### Backend variable reference

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `APP_KEY` | Encryption key | **Required** | Generated by artisan |
| `DB_*` | PostgreSQL connection | **Required** | See template |
| `FRONTEND_URL` | CORS, email links, Stripe return URLs | **Required** | `https://app.example.com` |
| `STRIPE_*` | Payments | Required for premium | Stripe dashboard |
| `FIREBASE_*` | Chat tokens, Firestore writes | Required for chat | Service account JSON path |
| `MAIL_*` | Transactional email | Required for invites | SMTP provider |
| `QUEUE_CONNECTION` | Job processing | Optional (`sync` for dev) | `database` + worker |
| `AWS_*` | S3 storage | Optional | — |

## Frontend — `.env.example`

**File:** `eventsmap-frontend/.env.example`

```env
# Backend API base URL (no trailing slash)
VITE_API_BASE_URL=http://localhost:8000
```

| Variable | Purpose | Required | Example |
|----------|---------|----------|---------|
| `VITE_API_BASE_URL` | Axios API base | **Required** | `http://localhost:8001` |

**CI/Docker mismatch (known issue):** GitHub Actions and `Dockerfile` inject `VITE_API_URL`, but application code reads `VITE_API_BASE_URL` (`src/services/api.ts`). Align before deployment or builds may default to `http://localhost:8000`.

**Firebase config:** Hardcoded in `src/services/firebase.ts` (not env-driven).

**MapTiler key:** Hardcoded in `src/config/mapConfig.ts`.

---

# Database Documentation

## Database type

**PostgreSQL** (PostGIS extension used in local dev compose)

## Schema overview (ERD-style)

```
users ──┬──< talents_v2
        ├──< organiser_v2
        ├──< venue_v2
        ├──< events_v2 (via user_id owner)
        ├──< subscriptions
        ├──< gallery_images
        ├──< wishlists
        └──< personal_access_tokens (Sanctum)

events_v2 ──┬──< event_invitations ──> users (receiver)
            ├──< event_v2_likes
            ├──< event_v2_views
            ├── event_v2_subcategory (pivot) ──> subcategories
            ├── event_v2_organiser / event_v2_talent (pivots)
            └── invited JSON fields (legacy compat)

talent_categories ──< talent_subcategories
organiser_categories ──< organiser_subcategories
venue_categories ──< venue_subcategories

categories ──< subcategories (legacy event taxonomy)

event_invitations ──< event_invitation_logs
chat_reports, chat_moderation_logs, chat_bans, user_chat_blocks
subscription_invoices, invoices
```

## Main tables

| Table | Model | Purpose |
|-------|-------|---------|
| `users` | `User` | Accounts, roles, Stripe IDs, profile_type |
| `events_v2` | `EventV2` | Primary events |
| `talents_v2` | `TalentV2` | Talent profiles |
| `organiser_v2` | `OrganiserV2` | Organiser profiles |
| `venue_v2` | `VenueV2` | Venue profiles |
| `event_invitations` | `EventInvitation` | Invitation workflow |
| `wishlists` | `Wishlist` | Saved events |
| `gallery_images` | `GalleryImage` | Premium media library |
| `subscriptions` | `Subscription` | Stripe subscription state |
| `subscription_invoices` / `invoices` | Invoice records | PDF receipts |
| `personal_access_tokens` | Sanctum | API tokens |

## Legacy tables (v1)

`events`, `talents`, `events_organizer`, `venues`, etc. — coexist with V2; new features use V2.

## Migrations

- **Location:** `eventsmap-backend/database/migrations/`
- **Count:** 90 files
- **Run:** `php artisan migrate --force` (CI runs post-deploy)

## Seeders

- **Location:** `eventsmap-backend/database/seeders/`
- **Count:** 30 seeders
- **Entry:** `DatabaseSeeder.php` — **throws in production**
- **Docs:** `docs/SEEDING_DATABASE.md`

---

# API Documentation

Base URLs:

- Auth: `/api/auth`
- Legacy: `/api/v1`, `/api`
- **Primary:** `/api/v2`
- Admin: `/api/admin`
- Health: `GET /up`

Standard JSON envelope (most V2 endpoints): `{ "success": true|false, "message": "...", "data": { ... } }`

## Authentication API (`/api/auth`)

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/register` | No | Register user; may return Stripe checkout URL |
| POST | `/login` | No | Login → `{ user, token }` |
| POST | `/password/forgot` | No | Send reset email |
| POST | `/password/reset` | No | Reset password |
| GET/POST | `/email/verify/{id}/{hash}` | No | Verify email |
| POST | `/email/resend` | No | Resend verification |
| POST | `/logout` | Sanctum | Revoke session |
| GET | `/me` | Sanctum | Current user |

## Billing & gallery (`/api`)

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/payment/verify` | No | Verify Stripe session after checkout |
| POST | `/webhook/stripe` | No (signature) | Stripe webhooks |
| POST | `/payment/retry` | Sanctum | Retry pending payment |
| POST | `/user/upgrade-plan` | Sanctum | Free → premium upgrade |
| GET | `/subscription` | Sanctum | Subscription status |
| GET/PUT | `/user/profile` | Sanctum | User profile |
| GET | `/gallery-images` | Sanctum | List gallery |
| POST | `/gallery-images/upload` | Sanctum | Upload image |
| DELETE | `/gallery-images/{image_id}` | Sanctum | Delete image |
| GET | `/invoices` | Sanctum | List invoices |
| GET | `/invoices/{id}/download` | Sanctum | Download PDF |
| GET | `/my-account/invites` | Sanctum | Aggregated invites |

## Reference data (`/api/v1`)

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/events`, `/events/{id}`, … | No | Legacy event reads |
| GET | `/categories`, `/categories/{slug}/subcategories` | No | Event categories |
| GET | `/categories-talents` | No | Talent taxonomy |
| GET | `/categories-organisers` | No | Organiser taxonomy |
| GET | `/categories-venues` | No | Venue taxonomy |
| GET | `/countries`, `/talent-languages` | No | Reference data |

## V2 Public (`/api/v2/public`)

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/events`, `/events/map` | No | Public event feed |
| GET | `/events/{id}`, `/events/slug/{slug}` | No | Event detail |
| GET | `/talents`, `/organisers`, `/venues` | No | Public profile listings |
| GET | `/talents/{id}`, `/organisers/{id}`, `/venues/{id}` | No | Public profile detail (incl. past/upcoming events) |

## V2 Discovery (mixed auth)

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| GET | `/events` | No* | Browse events (filters: lat, lng, radius, category, dates) |
| GET | `/talents`, `/organisers`, `/venues` | No* | Profile listings |
| POST | `/event-invitations/{id}/respond` | Optional token | Accept/reject invitation |
| GET | `/guest-invitations/token/{token}` | No | Guest invite prefill |

\*Listing routes in `v2.php` are outside sanctum group but may expect auth for some operations — verify per controller.

## V2 Authenticated (`/api/v2` + `auth:sanctum`)

### Profiles & events CRUD

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/my-events`, `/my-talents`, `/my-organisers`, `/my-venues` | Sidebar lists |
| POST/GET/PUT/DELETE | `/events`, `/events/{id}` | Event CRUD |
| POST/GET/PUT/DELETE | `/talents/{id}`, `/organisers/{id}`, `/venues/{id}` | Profile CRUD |
| PATCH | `/{type}/{id}/status`, `/publish-status` | Publication lifecycle |
| POST | `/events/{id}/wishlist` | Toggle wishlist |

### Invitations

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/invitations`, `/invited-events` | Received invitations |
| POST | `/invitations/{id}/respond` | Accept/reject (authenticated) |
| DELETE | `/event-invitations/{id}` | Cancel invitation |
| POST | `/event-invitations/{id}/resend` | Resend email |
| GET | `/events/{event_id}/invitations` | Event's invitations |
| POST | `/events/{event_id}/invitations/send` | Send pending invitations |
| POST | `/events/{event}/guest-invitations` | Guest email invite |

### Chat & Firebase

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/chat/users`, `/chat/blocks` | Global chat |
| POST | `/chat/block/{user_id}` | Block user |
| GET | `/events/{event_id}/chat-users`, `/chat-access` | Event chat permissions |
| POST | `/events/{event_id}/chat/report`, `/mute`, `/ban` | Moderation |
| POST | `/firebase/token` | Firebase custom token |
| POST | `/firebase/token/event/{event_id}` | Event-scoped token |

## Admin API (`/api/admin`)

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/auth/login` | No | Admin login |
| * | Various CRUD | `auth:sanctum` + `admin` | Events, users, V2 admin, media |
| * | Super-admin routes | + `super_admin` | Taxonomies, backoffice users |

**Full admin route list:** `eventsmap-backend/routes/admin.php`  
**Internal docs:** `eventsmap-backend/docs/ADMIN_API_DESIGN.md`

## Request/response patterns

- **V2 Event create/update:** Multipart form data or JSON (see `StoreEventRequest`, `UpdateEventRequest`)
- **Profile create/update:** Multipart with `image_path`, `additional_images[]`, taxonomy IDs
- **Invitation respond:** `{ "status": "accepted"|"rejected", "token"?: "..." }`
- **Resources:** `app/Http/Resources/V2/*` shape JSON responses

Detailed frontend API notes: `eventsmap-frontend/docs/EVENTS_API.md`

---

# Authentication & Authorization

## Login flow

1. `POST /api/auth/login` with email/password
2. Backend validates, returns Sanctum token + user object
3. Frontend stores token in `localStorage` key `token`
4. `authStore.fetchUser()` / `initializeAuth()` syncs user state
5. Router guards check `meta.requiresAuth`, `meta.requiresPremium`, profile type routes

## Token management

- **Type:** Laravel Sanctum personal access token
- **Header:** `Authorization: Bearer {token}`
- **Storage:** `localStorage` (frontend)
- **Expiry:** Sanctum default (no explicit expiry in codebase — **verify Sanctum config**)

## Roles and permissions

| Middleware | File | Effect |
|------------|------|--------|
| `auth:sanctum` | Sanctum | Valid API token |
| `admin` | `AdminMiddleware` | User role admin/super_admin |
| `super_admin` | `SuperAdminMiddleware` | Super admin only |
| `premium.active` | `EnsurePremiumIsActive` | Premium account required |
| `email.verified` | `EnsureEmailIsVerified` | Email verified |
| `account.active` | `EnsureAccountIsActive` | Not suspended |
| `chat.ratelimit` | Rate limit event chat | |
| `global.chat.ratelimit` | Rate limit global chat | |

## Session handling

- API is stateless (Bearer tokens)
- Laravel `SESSION_DRIVER=database` used for web routes only
- Firebase session separate (custom token)

## Security mechanisms

- CORS: `config/cors.php` — localhost + `projectenconnectc.nl` domains
- CSRF exempt: `api/webhook/stripe` only
- Password hashing: bcrypt
- Email verification required (`MustVerifyEmail`)
- Chat rate limiting middleware
- Firestore rules: `firestore.rules` (frontend repo)

---

# Build & Run Instructions

## Prerequisites

- Node.js 22+ (CI uses 22; local dev works with 20+)
- PHP 8.2+ with extensions: pdo_pgsql, mbstring, openssl, etc.
- PostgreSQL 14+ (or PostGIS via Podman)
- Composer 2.x
- Optional: Podman/Docker

## Backend — local development

```bash
cd eventsmap-backend
cp .env.example .env
# Edit DB_*, STRIPE_*, FIREBASE_*, MAIL_*, FRONTEND_URL
composer install
php artisan key:generate
php artisan migrate
# Optional: php artisan db:seed
php artisan serve --port=8001
# Or: composer run dev   # server + queue + vite + logs
```

**Docker dev (from repo):**

```bash
cd eventsmap-backend
podman-compose -f podman-compose.dev.yml up --build
# API: http://localhost:8001
# Postgres: localhost:5433
```

## Frontend — local development

```bash
cd eventsmap-frontend
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:8001
npm ci
npm run dev
# App: http://localhost:5173
```

## Database setup

```bash
cd eventsmap-backend
php artisan migrate
php artisan db:seed   # Non-production only
```

## Queue worker (if QUEUE_CONNECTION=database)

```bash
php artisan queue:work --queue=emails,default
```

## Production build

**Frontend:**

```bash
npm run build   # vue-tsc -b && vite build → dist/
```

**Backend:**

```bash
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan migrate --force
```

---

# Deployment Process

## Workflow overview

```
Push to branch (dev|test|stage|master)
    → GitHub Actions build
    → Docker build & push to GHCR
    → Trivy scan + SBOM
    → (test|stage|master) SSH deploy to VPS via Podman
    → podman-compose up -d
    → Backend: php artisan migrate --force
```

| Branch | Build | Deploy | Environment |
|--------|-------|--------|-------------|
| `dev` | Yes | No | — |
| `test` | Yes | Yes | Port FE 3001 / BE 4001 |
| `stage` | Yes | Yes (approval) | Port FE 3002 / BE 4002 |
| `master` | Yes | Yes (approval) | Port FE 3003 / BE 4003 |

## Workflow files

- Frontend: `eventsmap-frontend/.github/workflows/otap-frontend.yml`
- Backend: `eventsmap-backend/.github/workflows/otap-backend.yml`

## Docker usage

**Frontend Dockerfile:** Node 24 build → `serve -s dist -l 3000`  
**Backend Dockerfile:** PHP 8.4-FPM + `artisan serve` on 8000

## GitHub Actions secrets (documented in workflows)

- `GHCR_PAT`, `DEPLOY_SSH_PRIVATE_KEY`, `SSH_KNOWN_HOSTS`
- `DEPLOY_SERVER`, `DEPLOY_USER`, `DEPLOY_PORT`
- `VITE_API_URL` (frontend — should align with `VITE_API_BASE_URL`)

## PM2 / Nginx

**Not Found in Codebase** — production uses containerized `serve` (frontend) and PHP built-in server/FPM (backend). Reverse proxy configuration lives on VPS outside these repositories.

---

# Third-Party Services

| Service | Purpose | Integration files |
|---------|---------|-------------------|
| **Stripe** | Premium checkout, subscriptions, webhooks | `StripeController`, `app/Services/Stripe/*`, `src/pages/payment/*` |
| **Firebase** | Chat (Firestore), invitation notifications, custom auth tokens | `FirebaseService.php`, `firebase.ts`, `firestore.rules` |
| **SMTP (Gmail/etc.)** | Verification, invitations, invoices | `config/mail.php`, Blade templates |
| **MapTiler** | Map basemap style | `src/config/mapConfig.ts` |
| **OpenStreetMap** | Raster tiles | `EventsMap.vue` |
| **OSRM** | Turn-by-turn routing | `routingService.ts` |
| **Nominatim** | Reverse geocoding | `Header.vue` |
| **DomPDF** | Invoice PDFs | `barryvdh/laravel-dompdf` |
| **AWS S3** | Optional file storage | `config/filesystems.php` |

**SMS providers:** Not Found in Codebase  
**Analytics (GA4):** Firebase `measurementId` present in config — usage Not Found in Codebase  
**AI services:** Not Found in Codebase  
**Monitoring (Sentry/Datadog):** Not Found in Codebase

---

# Security Review

## Hardcoded credentials / secrets in repository

| Location | Issue | Severity |
|----------|-------|----------|
| `eventsmap-backend/.env.example` | Contains real-looking mail password and Firebase path | **High** — rotate and sanitize |
| `eventsmap-frontend/src/services/firebase.ts` | Full Firebase web config hardcoded | **Medium** — move to env |
| `eventsmap-frontend/src/config/mapConfig.ts` | MapTiler API key hardcoded | **Medium** |
| `eventsmap-backend/.env.example` | Contains `APP_KEY` example | Low — must regenerate per env |

## Security risks

1. **`routes/organizer.php`:** Auth middleware commented out — legacy organizer routes may be unprotected.
2. **Token in localStorage:** XSS could steal tokens; consider httpOnly cookies for future hardening.
3. **CI env var mismatch:** Wrong API URL in production builds.
4. **Firestore rules:** Must be deployed separately to Firebase console (`firestore.rules`).
5. **Upload limits:** PHP `upload_max_filesize` must match gallery requirements (see `UploadGalleryImageRequest.php`, Docker/php.ini).

## Missing validations

- Review URL validation on all premium profile social fields (partially implemented frontend).
- Guest invitation token expiry enforced backend — see `EventInvitation::GUEST_TOKEN_EXPIRY_DAYS`.

## Recommended improvements

1. Sanitize `.env.example`; use secrets manager on VPS/GitHub Secrets only.
2. Align `VITE_API_BASE_URL` vs `VITE_API_URL` in CI/Docker.
3. Remove or secure legacy `/api/organizer` routes.
4. Enable queue worker in production for email reliability.
5. Add `config/sanctum.php` with explicit token expiration if required.
6. Remove hardcoded Firebase/MapTiler keys from source; use build-time env injection.
7. Delete stale `.next/`, fix `docker-compose.dev.yml` (`npm start` undefined).

---

# Known Issues and Technical Debt

| Area | Issue |
|------|-------|
| **Stack migration** | Next.js artifacts remain (`.next/`, docs, `.env.dev`) |
| **API versioning** | v1 and v2 coexist; some legacy controllers still referenced |
| **Mixed TS/JS** | Stores/services split between `.ts` and `.js` |
| **Orphan pages** | `Dashboard.vue`, `Events.vue` not in router |
| **docker-compose.dev.yml** | References undefined `npm start` |
| **Guidelines to Setup.md** | Outdated Next.js instructions |
| **Premium route group** | `/api/premium` prefix mostly empty placeholder |
| **Organiser vs Event Publisher** | Terminology partially migrated in UI/notifications |
| **Past events visibility** | Requires accepted invitations + finished events + premium flag |
| **Profile discovery** | Talents/organisers need lat/lng and published status to appear on map |
| **Tests** | 24 backend tests; frontend automated tests **Not Found in Codebase** |

---

# Developer Notes

## Architectural decisions

1. **V2 is the primary API** for events, profiles, invitations, and chat (`routes/v2.php`).
2. **Sanctum tokens** for SPA auth; Firebase custom tokens for real-time features only.
3. **Profile types are mutually exclusive** per user account (`profile_type` on User).
4. **Premium gating** enforced both in Vue Router (`meta.requiresPremium`) and Laravel middleware (`premium.active`).
5. **Firestore** stores chat messages and invitation notifications; PostgreSQL is source of truth for business data.
6. **06:00 discovery window** — home/map default time range runs until next 06:00 (`discoveryDateTimeFilters.ts`).

## Common troubleshooting

| Problem | Check |
|---------|-------|
| API 401 loops | Token in localStorage; `/api/auth/me` response |
| CORS errors | `config/cors.php`, `FRONTEND_URL` |
| Chat not working | `FIREBASE_CREDENTIALS`, `/api/v2/firebase/token`, Firestore rules |
| Invitations not emailing | `QUEUE_CONNECTION`, queue worker, `MAIL_*` |
| Stripe webhook failures | `STRIPE_WEBHOOK_SECRET`, CSRF exempt route |
| Gallery upload 413/422 | PHP upload limits, `UploadGalleryImageRequest` |
| Wrong API in prod | `VITE_API_BASE_URL` vs `VITE_API_URL` in build |
| Migrations fail | PostGIS extension, DB credentials in compose |

## Important business rules

- **Event Publisher** terminology used for invitation sender (not organiser profile type).
- **Organiser profiles** (`organiser_v2`) are freemium/premium directory profiles, separate from event ownership.
- **Past events on premium profiles** shown only when `show_past_events=true`, `event_type=premium`, and accepted invitation history exists.
- **Finished events** hidden from map/list discovery (`filterActiveDiscoveryEvents`).
- **DatabaseSeeder** blocked in production environment.
- **Guest invitations** expire per `EventInvitation::GUEST_TOKEN_EXPIRY_DAYS`.

## Hidden dependencies

- Firebase service account JSON must be copied to backend container on deploy (CI workflow step).
- MapTiler account for map style URL.
- Stripe webhook endpoint must be registered pointing to `/api/webhook/stripe`.
- VPS must expose ports 3001–3003 (FE) and 4001–4003 (BE) or reverse proxy.

---

# Handover Checklist

- [ ] Source code transferred (both `eventsmap-frontend` and `eventsmap-backend` repositories)
- [ ] GitHub org/repo access granted (Zerosoft / OTAP)
- [ ] Environment variables documented and secrets rotated (Stripe, Firebase, Mail, DB)
- [ ] `.env.example` sanitized; production `.env` files on VPS documented
- [ ] Database backup procedure documented and initial backup completed
- [ ] Deployment process documented (GitHub Actions + Podman compose)
- [ ] CI/CD configuration reviewed (`otap-frontend.yml`, `otap-backend.yml`)
- [ ] GitHub Environments (test/stage/master) and approval gates configured
- [ ] Third-party services documented (Stripe, Firebase, SMTP, MapTiler)
- [ ] Firebase project ownership transferred; Firestore rules/indexes deployed
- [ ] Stripe account and webhook endpoints transferred
- [ ] DNS / reverse proxy (nginx) configuration documented (**outside repo**)
- [ ] GHCR package access (`ghcr.io/zerosoft-technologies/*`) verified
- [ ] SSH deploy keys and VPS access transferred
- [ ] Queue worker process documented for production email delivery
- [ ] Known issues and technical debt reviewed with receiving team
- [ ] Admin credentials and super-admin accounts documented securely
- [ ] `VITE_API_BASE_URL` / `VITE_API_URL` mismatch resolved in CI

---

# Appendix: Key documentation files

| Document | Path |
|----------|------|
| Events API (frontend) | `eventsmap-frontend/docs/EVENTS_API.md` |
| Firestore chat setup | `eventsmap-frontend/FIRESTORE_CHAT_SETUP.md` |
| Backend seeding | `eventsmap-backend/docs/SEEDING_DATABASE.md` |
| Subscription API | `eventsmap-backend/docs/SUBSCRIPTION_API.md` |
| Invoice system | `eventsmap-backend/docs/INVOICE_PDF_SYSTEM.md` |
| Admin API design | `eventsmap-backend/docs/ADMIN_API_DESIGN.md` |
| Notifications setup | `eventsmap-backend/NOTIFICATIONS_SETUP.md` |
| Migration guide (FE) | `eventsmap-frontend/src/docs/MIGRATION_GUIDE.md` |

---

*End of handover document.*
