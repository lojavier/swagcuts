# Swag Cuts Architecture

This repo uses a full-custom architecture with provider toggles for hybrid fallback. The frontend stays static for fast SEO and the API handles booking, notifications, commerce, and blog data.

## Components
- Web: Static pages in the repo root, served by Nginx or a CDN.
- API: Node HTTP server in `server/` that exposes JSON endpoints.

## Domains
- Bookings: `/api/bookings`
- Notifications: triggered by booking consent flags
- Commerce: `/api/products`, `/api/cart/items`, `/api/checkout`
- Blog: `/api/posts`
- Analytics: `/api/events`

## Provider toggles (hybrid fallback)
Use environment variables to switch from custom to third-party services:

```
BOOKING_PROVIDER=custom|acuity
NOTIFICATIONS_PROVIDER=custom|twilio
COMMERCE_PROVIDER=custom|stripe
BLOG_PROVIDER=custom|cms
```

Notification provider `twilio` uses Twilio for SMS and SendGrid for email (if both credentials are present).

## Environment variables
```
DATABASE_URL=postgres://user:pass@host:5432/swagcuts
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=secret
PGDATABASE=swagcuts

TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+15550102000

SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=hello@swagcuts.com

STRIPE_SECRET_KEY=sk_live_...
STRIPE_SUCCESS_URL=https://www.swagcuts.com/shop/checkout.html
STRIPE_CANCEL_URL=https://www.swagcuts.com/shop/cart.html
STRIPE_CURRENCY=usd

EVENTS_READ_KEY=optional-secret-for-admin-reads
```

Set `EVENTS_READ_KEY` to require `x-api-key` (or `Authorization: Bearer ...`) on `GET /api/events`. `POST /api/events` remains open for client analytics submissions.

## Database setup
Run migrations once the database connection is configured:

```
node server/db/migrate.js
```

## Data model (custom build)
- users: id, name, email, phone, marketing_opt_in
- pets: id, owner_id, name, size, notes
- appointments: id, owner_id, pet_id, service, date, time, status, session_id, attribution
- price_rules: id, service, size, add_on, price
- products: id, name, price, category, tags
- orders: id, user_id, total, status
- posts: id, title, slug, category, published_at
- affiliates: id, name, code, payout_rate
- analytics_events: id, event_name, session_id, page_url, referrer, utm, properties, context, created_at

## Running locally
```
node server/index.js
```

The API is served at `http://localhost:3000/api`.

If the frontend is hosted separately, set `window.SWAGCUTS_API_BASE` before loading `js/site.js`.
