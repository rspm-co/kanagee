# KANAGEE

React + Vite festival website. Run `npm install`, `npm run dev`; production: `npm run build`. Checks: `npm test`.

## Content handover
- Event configuration: `src/config/event.js`. Venue, prices, booking URL, contact and social information require confirmed values. Booking is inactive until a genuine URL is supplied.
- The former district gallery is removed. The Maharashtra map uses real geographic coordinates, projected with Mercator. Original MIT-licensed data and license: `src/assets/maps/`. Source: https://github.com/datta07/INDIAN-SHAPEFILES (primarily 2019 reference boundaries). Regenerate optimized paths using `node scripts/prepare-map.mjs`.
- Pune, Mumbai and Nagpur are shown for geographic orientation. No district boundaries or dish associations are invented.
- Palette: vermilion #ED1922, maroon #922420, warm cream #F7E7A6, ivory #FFF9E6. Brand name: KANAGEE. Major editorial phrases are in Marathi.
- Transparent logo: `public/kanagee-logo-transparent.webp`, made using the built-in image editor. Prompt: Remove only the outer pale grey/white background of the supplied badge, preserve the original Marathi lettering, shape, internal whites and colours, and output a transparent PNG. Original JPEG is preserved.
- The “More than a meal” section uses the supplied seafood photograph (`public/seafood-platter.webp`); it is not labelled as an event photograph. Textile artwork is an editorial illustration. Planned experiences remain marked pending programme confirmation. Empty sponsor data stays hidden.
- Countdown uses IST calendar dates, from 3 December inclusive to 7 December exclusive. Daily opening times are pending.
- GSAP entrances, scroll reveals, map drawing and desktop parallax are scoped and cleaned up. Reduced motion disables these and the Pune marker pulse. No scroll pinning or payment processing.
- Google Fonts are optional, with system fallbacks.

## Ticket interest signup
The hero and ticket section open an accessible mobile-number popup. Indian numbers are validated and normalized to +91. Signups use `/api/ticket-interest` by default. Set `VITE_TICKET_INTEREST_URL` only to override that path. The API must accept a JSON POST with `mobile`, `consent`, `purpose`, and `createdAt`, durably store the registration, and return a successful HTTP status only after saving. The notification service must send the ticket-opening update to registered numbers when sales begin. Never put provider secrets in Vite environment variables.

There is no local-storage or preview fallback. Success requires an HTTP success response with JSON `{ "ok": true }` from the server. Unavailable endpoints, invalid responses, and timeouts show an error and allow retry.

For Hostinger Node.js Web Apps, the Node server, MySQL table schema, and environment-variable deployment instructions are provided in `server/README.md`. Run `npm start` after building. The connected endpoint must return JSON `{ "ok": true }` after successful storage.

## Organisers and Chairman's message
`src/config/organiser.js` holds the supplied organiser credit: Ladachi Kulfi — R S Papal Group. The organiser section and Marathi “Our intent” section appear on the dedicated About KANAGEE page and describe the festival's intentions, without claiming certifications or unverified achievements.

The About page includes the supplied Chairman portrait and seven festival-vision points from the organiser. These are presented as the Chairman’s vision, without an invented personal quotation or name. Edit `organiser.chairman` in `src/config/organiser.js` to add his approved name or personal message later. The supplied “Maharashtra’s First Food Festival” and “100% Preservative-Free” positioning is organiser-provided copy.

The organiser credit, festival intentions and future Chairman's message are grouped on the dedicated `/about/` page (“About KANAGEE”), linked from both the header and footer. They no longer appear as full sections on the homepage. The build includes `about/index.html` so direct links and refreshes resolve on the deployed server.

## Admin dashboard
The private `/admin/` page displays interested visitors from MySQL. Set `ADMIN_USERNAME`, `ADMIN_PASSWORD` (12+ characters) and `ADMIN_SESSION_SECRET` (32+ random characters) privately in Hostinger. See `server/README.md` for setup and session details. No default password is shipped.

## Website motion
The photo animation layer is in `src/useSiteMotion.js`, with CSS floating food images, gentle plate rotation, photo hover effects, scroll reveals, card motion and a scroll-progress bar. The pause button stores only the visitor's animation preference locally. Reduced-motion preferences bypass motion, and floating images pause outside the viewport. Admin screens do not use festival scroll animations. The new Experiences thali is a background-removed edit of the supplied photograph (`public/experience-thali-cutout.webp`), not an event photograph.

## Food gallery
The homepage Gallery follows Experiences and uses a single-row horizontal slider at the original card widths, with swipe, arrow buttons and keyboard navigation. It offers All Maharashtra and the five regional filters: Konkan, Paschim Maharashtra, Uttar Maharashtra, Marathwada and Vidarbha plus a native-dialog photo viewer with arrow-key navigation and Escape-to-close. Photo records and captions are in `src/data/gallery.js`; images reuse the supplied food photos and edited cutouts. They are presented as inspiration, not a confirmed festival menu. Gallery entrance motion honours both the visitor's pause setting and reduced-motion preference.

Assign gallery images by setting `region` in `src/data/gallery.js` to an exact label from `galleryRegions`. Existing photos have `region: null` and appear only under All Maharashtra until assigned. Empty regions show a coming-soon message. Card sizes and the single-row slider are retained.

Ticket CTAs use a soft warm halo and slow light sweep, without a lightning symbol. On the landing and festival pages only, the signup popup opens shortly after load once per browsing session. Session storage prevents automatic repeats after refreshing or navigating between pages. A manual opening also counts as shown; automatic opening waits while another dialog is open, the tab is hidden, or the visitor is typing. It is not shown automatically on About or Admin pages. The popup is dismissible and the CTA can reopen it manually at any time. A matching Register Here button links to the stall-registration page.

## Ticket-focused landing page
The root URL `/` opens a compact landing page with the key festival details, a food image, ticket panel and a mobile ticket action. While event.bookingUrl is unset, the primary action opens the existing interest signup; it does not claim tickets are on sale. Set the confirmed event.bookingUrl later to switch the landing CTAs to Book tickets. The full festival website (including regional gallery) is preserved at `/festival/`, with About at `/about/` and the private dashboard at `/admin/`.

## Image delivery
Published PNG images have been converted to WebP. Original PNGs are preserved in `source-assets/images/`, outside the deployed public directory. Run `scripts/optimize-images.py` using Python with Pillow to regenerate full-size WebP files and 480/800px variants for large food photos. Logos use lossless encoding; photographic cutouts retain their alpha channel. Gallery thumbnails and food images use responsive sources while the viewer keeps full-resolution files. The landing hero has an early responsive preload in HTML, and the festival route preloads its own hero; About/Admin avoid unrelated food preloads. The SVG kulfi cursor stays vector.

## First-paint styles
Production HTML embeds Vite's compiled stylesheet, avoiding the separate render-blocking CSS request while keeping every page styled before React renders. The Google Fonts CSS @import has been removed; its HTML stylesheet link starts with media=print and switches to all after loading, with preconnect hints and display=swap. Fonts stay optional for first paint, with existing system fallbacks. Development continues to use Vite's normal CSS handling. Re-run Lighthouse after deployment to measure actual timing; no fixed millisecond improvement is guaranteed.
# Static asset caching

## Agent discovery and public information

The production build renders the real React public pages into initial HTML and emits route-specific titles, descriptions, canonicals, one H1 per public page, and Organization/WebSite/WebPage/FoodEvent JSON-LD. Public routes are `/`, `/festival/`, `/about/`, `/contact/`, `/terms/`, and `/privacy/`. Contact information uses the confirmed toll-free number, 1800 210 3696; Instagram is `@kanagee_`. Do not invent booking links, prices, addresses, schedules or contact details.

`src/config/site.js` supplies the public page metadata, Markdown, facts, and informational/legal page copy. Review that copy when business or data-handling practices change. `robots.txt` permits search and AI input, opts out of AI training, declares the sitemap, and excludes admin/API routes. `llms.txt` and per-page `index.md` files are generated during the build. Express negotiates `Accept: text/markdown`, sets `Vary: Accept`, and advertises alternates with Link headers. Cloudflare must not cache HTML and Markdown as the same representation; bypass cache for public documents if a custom “cache everything” rule is used. Existing versioned asset caching is unaffected.

`/mcp` uses the official MCP SDK with a stateless Streamable HTTP transport. Its two tools return public festival and booking information only; no database connection or signup/admin actions are exposed. The SEP-1649-style discovery card is served explicitly at `/.well-known/mcp/server-card.json`, bypassing the general dotfile restriction only for that route. Other dotfiles remain blocked. Browser WebMCP registers the same two information tools when `navigator.modelContext.registerTool` is available; unsupported browsers continue normally. MCP and WebMCP availability does not imply ticket purchasing capability.

Validate with `npm run build` then `npm test`. Tests use an actual MCP SDK client, verify content negotiation and crawler resources, and check all public pages' initial headings, canonical URLs and structured data. Redeploy Hostinger after pushing. The sitemap and discovery URLs are generated for `https://kanagee.com`.

Production builds give images content-based filenames and Vite fingerprints JavaScript and CSS. Express serves those URLs with `Cache-Control: public, max-age=31536000, immutable`. Changing an image changes its URL automatically. HTML and legacy unversioned files revalidate (`no-cache`); all API responses, including admin data and exports, remain `no-store`.

After redeploying Hostinger, check the live response headers. Cloudflare rules must respect the origin Cache-Control headers rather than override them with a shorter browser TTL. The third-party Cloudflare Insights beacon's caching is controlled by Cloudflare, outside this application's response headers.


## Stall registration

The Register Here buttons open `/register/`. This page presents the Marathi introduction and stall rules, then embeds the existing Google Form. `src/config/stalls.js` holds its responder and embed URLs. The Open form fallback opens the same form in a new tab, including when sign-in is required. Responses go to the form owner’s existing Google Forms response destination. No separate stall MySQL table, migration, or admin list is required. The website does not submit a hidden copy or report success on behalf of Google Forms. Manage fields, response collection, and notifications in the existing form.
