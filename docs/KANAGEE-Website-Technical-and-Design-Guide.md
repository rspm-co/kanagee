# KANAGEE Website Technical and Design Guide

Technical architecture and design handover

Prepared for the KANAGEE team and future website maintainers. Reviewed on 9 November 2026. This document describes the current local implementation, including changes awaiting publication. It is a maintenance reference, not a security certification or a specification for the separate booking application.

## 1 Website purpose and scope

KANAGEE is presented as a food and catering brand that also organises food festivals and events. The website introduces the festival, communicates its regional food heritage, directs visitors to ticket booking, accepts expressions of ticket interest, and embeds stall registration. Its visual identity combines cream backgrounds, maroon typography, food photography, Marathi storytelling, and compact editorial layouts.

The main website is a custom React application served by a Node.js and Express backend. It is not a WordPress installation and does not use a hosted page builder. Hostinger hosts the application, Cloudflare fronts the domain, and GitHub stores the source. The booking application at booking.kanagee.com is a separate service; its technology, payment processing, database, and capacity are outside this repository and this document.

### Public pages and private areas

| Route | Purpose |
| --- | --- |
| / | Ticket focused landing page, sponsors, ambassador, event details and visit information |
| /festival/ | Full festival story, district map, food heritage, women led kitchens, experiences, gallery and venue |
| /about/ | Business description, organisers, director vision and purpose |
| /register/ | Stall participation information, terms and embedded Google Form |
| /contact/ | Toll free contact, venue and official Instagram |
| /terms/ and /privacy/ | Website information and data handling disclosures |
| /admin/ | Private contact dashboard and Excel export |
| /countdown/ | Unlisted office display with event countdown and screen wake support |

There is no standalone Gallery page. The approved gallery remains a section of the festival page. The countdown and admin pages are excluded from public discovery; exclusion is not an access control. Admin data is protected independently by server authentication.

## 2 Technology stack

The versions below are resolved versions from package-lock.json at the review date. package.json allows compatible updates through its version ranges, so the lockfile should be committed and reviewed when dependencies change.

| Technology | Version | Role |
| --- | --- | --- |
| React and React DOM | 19.3.1 | Components, page rendering and interactive state |
| Vite | 6.4.5 | Local development, bundling and build rendering integration |
| JavaScript ES modules | Project standard | Frontend, backend and deployment scripts |
| CSS | Custom stylesheet | Responsive layouts, typography, shapes and animation |
| GSAP and ScrollTrigger | 3.15.0 | Entrance effects, scroll reveals and progress animation |
| Lucide React | 0.468.0 | Interface icons |
| Node.js | 22 or newer required | Server runtime; Hostinger was configured for Node 22 |
| Express | 5.3.0 | Static pages, API routes and public agent endpoints |
| mysql2 | 3.24.6 | MySQL connection pooling and prepared queries |
| ExcelJS | 4.4.0 | Streaming authenticated contact reports |
| express-rate-limit | 8.7.1 | API and login request limits |
| MCP SDK and Zod | 1.32.2 and 4.6.7 | Public read only agent tools and input schemas |

The project has no TypeScript compilation, React Router, Tailwind, Bootstrap, or general purpose CMS. Page selection uses the URL pathname in App.jsx. Content arrays and configuration files provide a lightweight editing structure.

### Request and build flow

1. A visitor requests a public URL through Cloudflare and Hostinger.
2. Express serves the generated HTML and versioned public assets, or handles an API request.
3. The build has already rendered public React content into HTML for discovery and an initial readable document.
4. Browser JavaScript starts React with createRoot and renders the interactive application. It does not currently use hydrateRoot.
5. Ticket booking opens the configured external booking URL. Stall applications go to Google Forms. Ticket interest submissions go to the main website API and MySQL.

## 3 Repository organisation

| Location | Responsibility |
| --- | --- |
| src/App.jsx | Shared header and footer, page selection, festival and About layouts |
| src/components/ | Landing page, sponsors, ambassador, gallery, map, registration and admin components |
| src/config/ | Event facts, campaign wording, organiser identity, public metadata and stall terms |
| src/data/ | Food stories, gallery records, sponsors, districts and client submission policies |
| src/styles/main.css | Base styles, components, breakpoints, motion and accumulated approved refinements |
| public/ | WebP images, cursor and standalone countdown assets |
| source-assets/ | Editable image masters and reference material |
| src/assets/maps/ | Geographic source data, provenance and licence |
| server.js and server/ | Runtime configuration, API, authentication, report export and database schema |
| scripts/ | Image, map, asset versioning and deployment preparation scripts |
| dist/ | Generated deployable package; ignored by Git |

The stylesheet is intentionally documented as it exists: several historical component rules are followed by later overrides. Later matching rules win. A future cleanup should consolidate them after visual comparison rather than deleting earlier rules indiscriminately.

## 4 Typography system

### Font families and roles

| Typeface | Use | Loaded weights |
| --- | --- | --- |
| DM Sans | English body text, landing headlines, navigation, buttons and modern section headings | 400, 500, 600, 700 |
| Barlow Condensed | Large festival campaign heading, selected display headings and countdown numerals | 600, 700, 800 |
| Noto Sans Devanagari | Marathi headings, paragraphs and bilingual labels | 400, 600, 700 |
| Georgia | Selected editorial story headings and italic emphasis | Browser supplied serif |

Google Fonts are preconnected and loaded using a deferred stylesheet with display=swap and a noscript fallback. DM Sans falls back to Noto Sans Devanagari and a generic sans serif. Font choice is intentional: condensed display text carries the festival identity, while a simpler body face keeps practical information readable.

### Size and proportion rules

| Role | Current size guidance | Line height |
| --- | --- | --- |
| Festival display headline | Approximately 52 to 82 px, responsive and component specific | About 0.97 to 1.1 |
| Landing main headline | Approximately 45 to 72 px across existing rules | About 1.1 |
| English section heading | Usually 32 to 44 px; smaller headings use 22 to 30 px | 1.1 to 1.4 |
| Marathi heading | Usually 25 to 38 px; compact women section 26 to 34 px | 1.5 to 1.6 |
| Card or story heading | Usually 15 to 23 px according to card width | 1.35 to 1.5 |
| Main content body | 14 px desktop and 13 px mobile in standard content sections | About 1.8 |
| Captions and helper text | Usually 10 to 12 px; final body caption token 11 px | 1.6 to 1.8 |
| Eyebrow labels | Usually 9 to 10 px; some compact brand labels are smaller | About 1.65 |

This is not a strict golden ratio or a single mathematical type scale. Sizes are responsive and chosen for their role. Relative to a 14 px body, a 28 px Marathi heading is 2 times larger and a 42 px section heading is 3 times larger. These are useful working relationships, not universal hard constraints.

Use generous line height for Marathi and avoid negative letter spacing that compresses Devanagari characters. English display headings can use slight negative tracking, while short uppercase labels use modest positive tracking. Body paragraphs should generally stay within 44 to 65 characters per line where layout permits. Multi line titles are balanced; paragraphs use natural wrapping.

Headlines that form one connected thought use commas. Complete prose sentences use full stops. Labels and short button text normally have no terminal full stop. Keep English brand and legal names consistent and preserve Marathi spelling when editing. Use one H1 per public page and descend through H2 and H3 according to content structure.

## 5 Colour and shape system

| Token or colour | Value | Purpose |
| --- | --- | --- |
| Maroon | #922420 | Primary actions, emphasis, navigation and festival identity |
| Deep maroon | #4E1716 | Dark sections, footer and button hover states |
| Main text | #422720 | Headings and strong text on light surfaces |
| Ivory | #FFFDF7 | Primary page surface and text on dark backgrounds |
| Cream | #F7E7A6 | Warm accents and contrast on dark sections |
| Muted text | #78675D | Secondary copy on light surfaces |
| Dividers | #E8DFD1 | Fine section and card boundaries |
| Red orange | #D73529 | Focus outline and selected accents |
| Supporting surfaces | #F6EFDF and #FAF7EF | Hero, ambassador and heritage backgrounds |

Gold shades vary by component, including #B3863F for decorative emphasis and #EFCA76 on the ticket highlight. They are supporting accents, not the primary reading colour. Use maroon or dark brown for essential text on cream surfaces and a light cream for text on dark maroon. Do not assume every small colour combination has passed a formal contrast audit.

Standard content cards use a 16 px corner radius. Standard buttons use an 8 px radius. The highlighted Book Tickets action is an exception: a rounded rectangle measuring 220 by 112 px on large screens and 180 by 100 px under the later 900 px rule. Its outer glow and pulse follow the same shape. The ambassador portrait uses an arched top and softly rounded lower corners. Small circular icon buttons remain circular because their form identifies a compact control.

Avoid adding a different radius, shadow or outline style to every section. One px borders and restrained warm shadows provide separation. Decorative effects must not obscure text or intercept pointer events.

## 6 Layout and spacing rules

The working spacing unit is 4 px. Common practical increments are 8, 12, 16, 20, 24, 28, 32, 36 and 44 px. The CSS does not enforce this as an exclusive grid, but new work should use these increments unless a measured layout needs an exception. There is no fixed centimetre layout: CSS pixels and responsive proportions adapt to different screens and zoom levels.

| Layout rule | Current implementation |
| --- | --- |
| General content width | About 1160 px maximum with responsive outer gutters |
| Standard section gutters | max of 6 percent or the centred 1160 px content calculation |
| Standard section vertical padding | clamp from 28 to 46 px using 3.4 viewport width units |
| Landing hero | Content based height with 28 px vertical padding and 32 px column gap |
| Landing booking | 36 px vertical padding and 40 px desktop column gap |
| Typical content grid gaps | 20 to 36 px desktop and 12 to 24 px mobile |
| Card internal padding | Usually 16 to 26 px, depending on content |
| Text group spacing | Usually 8 to 16 px between label, heading and paragraph |
| Touch target | Keep important controls at least 44 px in height or width as appropriate |

Use natural content height instead of empty minimum heights. A background colour does not justify a large gap. Maintain enough room to distinguish sections, preserve paragraph readability and allow focus outlines. Never reduce form controls or body type solely to fit more content into one screen.

### Approved section treatments

- Header: sticky brand navigation; the landing version centres Ladachi Kulfi with a small Organised by label. Primary actions follow Book Ticket then Stall booking. Festival links follow the section sequence.
- Sponsors: Presented By first, Associate Partner second and Branding Partners third. The main sponsor remains visually largest. Travelyfoodie and MLA were enlarged slightly but stay subordinate.
- Ambassador: booking action on the left, Marathi festival statement in the middle, Madhura Bachal identity and portrait on the right. The statement is followed by the 36 districts tagline. The order and app promotions are retained in code but disabled through ladachiPromotion=null.
- Heritage: decorative plate remains partially outside the right edge. Its desktop size is now 260 to 360 px and mobile size 230 px. A compact two photo composition pairs the seafood platter with the spice market image.
- Heart of the Kitchen: 30 px vertical section padding, 32 px desktop gap, 20 px support panel padding and support cards with a 134 px minimum height. Mobile uses 26 px section padding, 20 px gap and 120 px support cards.
- Experiences: two columns where space permits, content that expands on demand and 12 px card gaps.
- Food gallery: horizontal cards with five regional filters and a native photo dialog. It does not grow into a long grid by default.
- About and information pages: readable paragraphs, shorter heading gaps and no artificial minimum page height.
- Registration: rules and embedded form share columns on wider screens and stack on mobile. The external form height is functional space and should not be removed as if it were a blank margin.
- Footer: grouped organiser logos, venue and social contact information with tighter divisions and preserved link targets.

### Responsive behaviour

The stylesheet has component breakpoints at 1300, 1100, 1050, 900, 760, 600, 480, 420, 390 and 380 px. These are implementation history, not separate device classes. The principal content stack is at 760 px, and sponsor and ambassador adjustments frequently use 600 px. Extra narrow rules protect navigation and gallery controls.

Maintain desktop and mobile independently where needed. A four column ambassador arrangement should collapse into readable rows rather than shrinking every word. Avoid horizontal page overflow, cropped button labels and text under fixed mobile bars. Keep bottom padding wherever the fixed booking bar would otherwise cover footer content. A suggested visual review set is 320, 390, 768, 1024 and 1440 px widths, including landscape orientation and 200 percent text zoom. This is a review recommendation, not a claim that the latest local changes were visually checked at all those sizes.

## 7 Image and animation rules

Public raster images are predominantly WebP with responsive 480 and 800 px variants. Keep source masters outside the public delivery path. Use srcSet, sizes and intrinsic width and height. Food cutouts use object-fit:contain; editorial photographs may use object-fit:cover in a deliberate frame. Do not distort logos, stretch portraits, or label illustrative food images as verified photographs.

Only the relevant landing or festival hero image is preloaded for its page. Below fold imagery is lazy loaded where implemented. Build scripts fingerprint public image URLs with a content hash so they can be cached for a year without making future replacements stale. A visually compact image still needs an appropriately sized source.

GSAP handles scroll reveals, image motion and the page progress indicator. CSS handles the date marquee, ticket sheen, glow and pulse. The booking rectangle has an initial arrival animation followed by a gentle 2.8 second pulse, with motion stopped on hover or focus for easier clicking. The global motion setting is stored in localStorage and reduced motion preferences are respected.

Do not put overlays over a link hit area or let decorative pseudo elements capture clicks. Keep keyboard focus visible. Motion should emphasise an action or image without making content unreadable. The pink kulfi cursor is decorative; native controls must remain reliable, and touch interaction must not depend on hover.

The district map is an inline SVG with 36 district headquarters, bilingual pin interaction, keyboard selection, a Pune highlight and an expandable district list. Geographic preparation and standalone export scripts accompany the source and licence. It is not a bitmap generated by AI.

## 8 Content and external integrations

| Editable content | Primary source |
| --- | --- |
| Dates, hours, venue, booking URL and phone | src/config/event.js |
| Main English campaign wording | src/config/campaign.js |
| Organiser and director details | src/config/organiser.js |
| Page metadata, contact, terms and privacy | src/config/site.js |
| Sponsors and their roles | src/data/sponsors.js |
| Food photographs and region assignments | src/data/gallery.js |
| Stall instructions and Google Form links | src/config/stalls.js |
| Ambassador layout and promotion switch | src/components/SponsorStrip.jsx |

The configured booking URL is https://booking.kanagee.com/e/kanagee. The Google Play URL and badge are preserved for the Ladachi Kulfi promotion, but the promotion is currently hidden. Changing a sponsor role must also preserve category ordering in SponsorStrip.jsx.

Stall registration uses the existing Google Form, not the MySQL interest table. Submissions and form questions are managed in the Google account that owns the form. The main site cannot infer successful form completion from an iframe load or an Open form click. Do not report those clicks as confirmed applications.

The official Instagram profile and Google Maps search link are generated from shared event details. Google Analytics uses measurement ID G-YE9KRXWKS9 from the shared HTML template. A current review of GA reported around 11K active users over an unspecified reporting period, not simultaneous users. Completed applications and ticket purchases require separate conversion verification; the total event count is not a registration count.

## 9 Backend and database

The server creates a MySQL pool only when DB_NAME, DB_USER and DB_PASSWORD are present. The configured pool allows five active connections and 20 queued requests, with a 10 second connection timeout. These are limits, not evidence of a particular user capacity. Dates are handled in UTC in the database and displayed as IST in the export.

The ticket_interests table contains id, mobile, purpose, consent_at, created_at, notification_status and notified_at. The unique mobile and purpose key prevents duplicate interest entries. Inserts and searches use prepared parameters. Admin list pagination is 25 rows per page; Excel export reads in batches of 500 and streams the report.

| Endpoint | Function and access |
| --- | --- |
| GET /api/health | Server liveness only; does not check MySQL |
| POST /api/ticket-interest | Validated Indian mobile, explicit consent and ticket-launch purpose |
| POST /api/ticket-interest.php | Compatibility alias for older frontend builds |
| POST /api/admin/login | Origin checked credentials with login rate limiting |
| POST /api/admin/logout | Clears the admin cookie |
| GET /api/admin/session | Requires a valid signed session |
| GET /api/admin/interests | Authenticated list and mobile search |
| GET /api/admin/interests/export | Authenticated Excel download |
| POST /mcp | Rate limited public read only festival tools |

Admin sessions use an HMAC signed token, a one hour expiry and a Secure, HttpOnly, SameSite=Strict cookie. Admin readiness requires a password of at least 12 characters and a signing secret of at least 32 characters. Credentials stay on the server. Do not place passwords, database credentials, session secrets or contact exports in frontend variables or the Git repository.

Notification delivery is not integrated. A pending row does not mean that SMS or WhatsApp was sent, and phone format validation does not verify ownership.

## 10 Discovery and performance

Build preparation renders each public page, adds its title, description and canonical link, and emits structured JSON-LD including Organisation, website and event entities. It also generates robots.txt with content signals, sitemap.xml, llms.txt and Markdown alternatives. Express negotiates Markdown for matching requests and advertises discovery resources through Link headers.

Optional WebMCP registration is guarded by browser support. The public MCP server exposes festival and booking information only and has no access to contact records or admin functions. Its server card is published under /.well-known/mcp/server-card.json.

The entire compiled stylesheet is inlined into each public HTML page to remove an external render blocking CSS request. This trades extra HTML size for immediate styling; it is not equivalent to a minimal critical CSS extraction. As the stylesheet grows, reassess that tradeoff with measurements. Vite hashes bundled JavaScript and CSS. Images have their own content hashes. Versioned assets receive a one year immutable cache policy, pages revalidate, and API responses are no-store.

For future performance work, measure real user loading and interaction metrics, review the JavaScript bundle, consolidate CSS overrides, and consider page specific code splitting. These are recommendations, not features already implemented.

## 11 Hosting and release operations

The repository is https://github.com/rspm-co/kanagee and the deployment branch is main. A GitHub push changes the source repository. It is not proof that Hostinger has deployed it successfully or that Cloudflare is serving the newest output.

### Local commands

- npm install installs dependencies; the postinstall hook also builds when source files are present.
- npm run dev starts the Vite frontend preview. The current review preview was started on http://127.0.0.1:5186/.
- npm run build writes dist/client, prepares generated public content, and packages the server into dist.
- npm test runs the Node test suite. Some server tests require local networking permission in the review environment.
- npm start runs server.js with the required production environment configured. The Vite preview alone is not a production API server.

### Production configuration

| Variable | Purpose |
| --- | --- |
| APP_ORIGIN | Exact HTTPS website origin without a trailing slash |
| DB_HOST and DB_PORT | MySQL connection destination; defaults exist in server.js |
| DB_NAME, DB_USER and DB_PASSWORD | Server database credentials |
| ADMIN_USERNAME | Optional admin username, default admin |
| ADMIN_PASSWORD | Private admin password with at least 12 characters |
| ADMIN_SESSION_SECRET | Private signing secret with at least 32 characters |
| PORT | Host supplied listening port; normally let Hostinger provide it |
| VITE_TICKET_INTEREST_URL | Optional public endpoint override; generally leave unset for the same origin API |

There are two supported package shapes: source repository deployment, where installation builds the frontend, and deployment of the prepared dist package, where client/index.html is already present. In both cases run the Node server with server.js and serve the packaged client directory. A static Vite deployment by itself does not implement the admin or interest APIs. Hostinger panel labels vary; verify the entry file and actual uploaded directory rather than guessing an output setting.

Before release, build and test, inspect changed files, exclude private configuration, commit the intended files, push main, and redeploy or verify the configured automatic deployment. Afterwards check the homepage, festival, About, registration, admin session response and ticket destination. Verify new asset hashes and key text. Keep a known working deployment available for rollback.

## 12 Security findings and operating limits

The 9 November review found public pages responding, unauthenticated admin session access returning 401, and sensitive paths such as /.env and /.git/config returning 403. The local implementation uses prepared SQL, input validation, body limits and secure cookie attributes. These checks do not certify the absence of vulnerabilities.

Outstanding findings from the read only review are separate from the layout work:

- Production dependency audit reported two moderate package entries tied to one uuid advisory through ExcelJS. The inspected ExcelJS code uses v4, while the advisory concerns v3, v5 and v6 buffer handling; application exploitability was not established. Preserve report compatibility when remediating.
- Live HTML lacked several hardening headers, and its CSP only upgraded insecure requests. Any stronger policy must account for Google Fonts, analytics, inline styles and the Google Form before enforcement.
- Express rate limits use the detected remote address without a verified hosting proxy trust configuration. Visitors may share a limit behind a proxy. Do not blindly trust forwarded headers or set trust proxy to true without confirming the network boundary.
- Rate limit storage is process local. Stateless admin cookies are not individually revoked server side on logout; signing secret rotation invalidates outstanding tokens.
- Actual MySQL health, backup restoration, hosting limits, concurrent user capacity and the payment application were not tested. No load test was performed on production.

The security review reference is tmp/website-review-2026-11-09.md. It is a local review artifact and is ignored by Git. Primary supporting references are https://github.com/advisories/GHSA-w5hq-g745-h8pq, https://express-rate-limit.mintlify.app/guides/troubleshooting-proxy-issues and https://expressjs.com/en/advanced/best-practice-security/.

## 13 Maintenance and acceptance checks

For a content change, edit the relevant configuration or data file, verify grammar and punctuation in both languages, preserve heading hierarchy, and check the actual destination of every modified action. Keep booking, notification interest and stall registration separate in wording.

For a design change, compare the same content at mobile and desktop widths. Check text wrapping, consistent gutters, card alignment, portrait crop, logo hierarchy, section height, fixed bar overlap and keyboard focus. Review both animation enabled and paused states. Keep compact sections readable rather than removing all separation.

For an image change, keep an editable source, export efficient WebP variants, set accurate alt text and dimensions, check the crop and preserve transparency when it is part of the approved asset. Rebuild to refresh public hashes. An uploaded logo should retain its original proportions and should not be recreated as an approximation.

For an API change, exercise success and failure cases using test data. Verify authentication, invalid input rejection, SQL parameters, response caching, rate limit behaviour and exports. Do not test with real visitor contact records in a public preview.

The latest complete suite before this handover contained 33 passing checks. Coverage includes rendered page metadata, protected admin routes, signup validation, exports, cache policy, image handling, discovery endpoints, district data, popup policy and countdown wake behaviour. Automated tests are not a substitute for a full browser layout review. Browser preview automation was timing out during recent visual checks, so final visual sign off is still required on the local site before publishing.

### Known implementation details to revisit

The general event status counter uses midnight boundaries while the office display and structured event opening use noon on the first day. Keep those intentionally distinct or unify them after confirming the desired visitor behaviour. Some older informational copy still mentions app booking even though ticket buttons now link to the booking website; review that wording before a payment provider submission. The stylesheet has accumulated overrides, and the browser uses createRoot rather than hydration for prerendered pages. These are documented maintenance considerations, not claims of a current outage.

## 14 Handover status

This guide records the current local design, ambassador feature, sponsor label, compact spacing rules, business description and director designation. Those changes require an intentional commit and deployment to become the live version. No private credentials are included here. The original festival gallery remains approved; the experimental standalone Gallery page was removed.

Keep this document with the source and update it when routes, dependencies, event facts, external integrations, design tokens or deployment settings change. The repository and final CSS are the source of truth where implementation differs from this dated snapshot.
