# KANAGEE

React + Vite festival website. Run `npm install`, `npm run dev`; production: `npm run build`. Checks: `npm test`.

## Content handover
- Event configuration: `src/config/event.js`. Venue, prices, booking URL, contact and social information require confirmed values. Booking is inactive until a genuine URL is supplied.
- The former district gallery is removed. The Maharashtra map uses real geographic coordinates, projected with Mercator. Original MIT-licensed data and license: `src/assets/maps/`. Source: https://github.com/datta07/INDIAN-SHAPEFILES (primarily 2019 reference boundaries). Regenerate optimized paths using `node scripts/prepare-map.mjs`.
- Pune, Mumbai and Nagpur are shown for geographic orientation. No district boundaries or dish associations are invented.
- Palette: vermilion #ED1922, maroon #922420, warm cream #F7E7A6, ivory #FFF9E6. Brand name: KANAGEE. Major editorial phrases are in Marathi.
- Transparent logo: `public/kanagee-logo-transparent.png`, made using the built-in image editor. Prompt: Remove only the outer pale grey/white background of the supplied badge, preserve the original Marathi lettering, shape, internal whites and colours, and output a transparent PNG. Original JPEG is preserved.
- The “More than a meal” section uses the supplied seafood photograph (`public/seafood-platter.png`); it is not labelled as an event photograph. Textile artwork is an editorial illustration. Planned experiences remain marked pending programme confirmation. Empty sponsor data stays hidden.
- Countdown uses IST calendar dates, from 3 December inclusive to 7 December exclusive. Daily opening times are pending.
- GSAP entrances, scroll reveals, map drawing and desktop parallax are scoped and cleaned up. Reduced motion disables these and the Pune marker pulse. No scroll pinning or payment processing.
- Google Fonts are optional, with system fallbacks.

## Ticket interest signup
The hero and ticket section open an accessible mobile-number popup. Indian numbers are validated and normalized to +91. Signups use `/api/ticket-interest` by default. Set `VITE_TICKET_INTEREST_URL` only to override that path. The API must accept a JSON POST with `mobile`, `consent`, `purpose`, and `createdAt`, durably store the registration, and return a successful HTTP status only after saving. The notification service must send the ticket-opening update to registered numbers when sales begin. Never put provider secrets in Vite environment variables.

There is no local-storage or preview fallback. Success requires an HTTP success response with JSON `{ "ok": true }` from the server. Unavailable endpoints, invalid responses, and timeouts show an error and allow retry.

For Hostinger Node.js Web Apps, the Node server, MySQL table schema, and environment-variable deployment instructions are provided in `server/README.md`. Run `npm start` after building. The connected endpoint must return JSON `{ "ok": true }` after successful storage.
