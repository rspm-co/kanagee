# Hostinger Node.js Web App deployment

The Node.js server serves the built React website and the MySQL signup API. PHP and kanagee-config.php are no longer used for this deployment. Legacy PHP files are retained only for the alternative PHP hosting setup and are not included in the Node.js build.

Hostinger settings:
- Server-side Node.js app, framework Express or Other (not static-only React/Vite).
- Node.js 22 or 24.
- Build command: npm run build
- Package manager: npm
- Output directory: dist
- Entry file inside that output directory: server.js
- Start command when requested: npm start

Set these server runtime variables in hPanel, without surrounding quotes:

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=YOUR_FULL_DATABASE_NAME
DB_USER=YOUR_FULL_DATABASE_USERNAME
DB_PASSWORD=YOUR_DATABASE_PASSWORD
APP_ORIGIN=https://yourdomain.com
NODE_ENV=production

Use the full database/user names including Hostinger prefixes. APP_ORIGIN must match your actual website origin exactly, without a trailing slash. Leave PORT to Hostinger. No VITE_ variable is required; if VITE_TICKET_INTEREST_URL was previously set, remove it (or set it to /api/ticket-interest). The old /api/ticket-interest.php path also works through the Node.js server.

Import server/schema.sql into your existing database via phpMyAdmin before testing signups. Redeploy the updated GitHub main branch, then restart the app after changing runtime variables.

Check /api/health returns {"ok":true} (server availability only), submit your own number, and verify its row in ticket_interests. Submit twice to confirm duplicates do not create extra rows. Failed requests must not show success. The local build/tests do not verify your live database connection.

The endpoint validates mobile numbers and consent, uses parameterized inserts, limits request size and applies a basic per-IP rate limit. When behind a hosting proxy, the default limit may be shared across visitors; configure trusted proxy handling only after confirming Hostinger's actual proxy topology. Apply edge abuse protection as traffic grows. Phone ownership is not verified. Keep database credentials out of GitHub and VITE_ variables.

SMS/WhatsApp delivery remains a separate future integration. Stored rows begin with pending notification status. No messages are sent by this app yet.

Hostinger reference: https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/

If deployment logs say `Entry file: none` or `Application type: not specified`, update Hostinger's framework/application selection to a server-side Node.js app and set entry file `server.js`. Publishing only the static frontend will not run the signup API. Vite is deliberately a production dependency because Hostinger may omit development dependencies when NODE_ENV=production is set during installation.
