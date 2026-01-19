# Swag Cuts
Responsive grooming website with booking, pricing, policy pages, and SEO-ready blog templates.

## Architecture
- Static frontend pages live at the repo root.
- Custom API lives in `server/` (no dependencies required).
- Architecture notes live in `docs/ARCHITECTURE.md`.

## WordPress (theme-based)
- VM installer + Nginx config: `wordpress/server-setup`
- Deploy bundle (wp-content sync): `wordpress/deploy`
- Theme package backup: `wordpress/website-templates-backup`

## API (custom)
Run locally:
```
node server/index.js
```
Default base URL: `http://localhost:3000/api`

Dependencies (API):
```
cd server
npm install
```

Environment variables:
- Copy `server/.env.example` to your own `.env` file or export variables manually.
See `docs/ARCHITECTURE.md` for provider credentials and DB details.

Migrations (Postgres):
```
node server/db/migrate.js
```

Endpoints:
- `GET /api/health`
- `POST /api/bookings`
- `GET /api/products`
- `GET /api/posts`
- `GET /api/cart?cartId=...`
- `POST /api/cart/items`
- `POST /api/checkout`

## Pages
- `index.html` main site
- `about.html`, `services.html`, `services-plus.html`, `pricing.html`, `testimonials.html`, `team.html`, `faq.html`, `contact.html`
- `ai-features.html`, `veterinary-clinic.html`, `pet-shop.html`
- `privacy.html`, `terms.html`, `grooming-waiver.html`, `cancellation.html`, `cookie-policy.html`, `affiliate-disclosure.html`, `accessibility.html`
- `blog/index.html` with sample posts
- `shop/index.html` with product + category pages
- `template-crawl.html` renders the crawl list from `crawl_sites.txt`
- `admin.html` demo policy version manager (stores data in localStorage)
