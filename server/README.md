# Hostinger MySQL setup

This endpoint assumes a PHP-enabled Hostinger website serving the Vite build and API from the same HTTPS domain. It stores signups only; SMS/WhatsApp delivery is a separate integration.

1. In Hostinger phpMyAdmin, select your existing database and import `server/schema.sql`. This adds only the `ticket_interests` table. Mobile numbers are unique per notification purpose.
2. Copy `server/config.example.php` to `kanagee-config.php` one directory above `public_html`. Fill in database credentials and the exact website origin (scheme and host, no trailing slash) there. Use the database hostname shown in hPanel; for PHP on the same Hostinger server this is usually `localhost`. Keep the config outside the public website folder.
3. Enable PHP with PDO MySQL on your website. Use a currently supported PHP version. The build includes the endpoint at `dist/api/ticket-interest.php`.
4. No frontend environment variables are required: the signup URL defaults to `/api/ticket-interest.php`. To override it, set `VITE_TICKET_INTEREST_URL` before building. Never store credentials in Vite variables.
5. Run `npm run build`, then upload all contents of `dist/` into `public_html`, including `api/`. Keep the private config one directory above `public_html`. The Vite development server and static-only hosting cannot execute PHP.
6. Submit a test number you control. Check the POST returns HTTP 200 with `{"ok":true}`, then confirm the normalized number and consent timestamp are present in phpMyAdmin. Submit it again and confirm there is only one row. Invalid numbers and missing consent must fail. Verify failed requests never show the success screen.
7. Before opening registration publicly, apply request throttling to this API using your hosting/proxy protection. Origin checks are not bot protection or phone ownership verification. Do not expose a public contact-list endpoint.
8. Connect an SMS/WhatsApp sender for launch day. Process pending contacts and update notification_status/notified_at after successful delivery. This repository does not yet send messages or verify ownership of submitted phone numbers.

If the frontend is hosted elsewhere, this same-origin deployment needs adjustment before use. Do not enable broad CORS or expose MySQL directly to browsers.

The popup has no preview or local-storage fallback. Missing database configuration or an unavailable API causes a visible error, never a successful registration.
