# StreamSaaS Webapp

## Cloud Proof Storage Setup (Cloudinary)

Payment proof uploads now use a durable storage strategy:

1. Cloudinary (primary, recommended for production)
2. Local filesystem (fallback)
3. Inline data URL (last-resort safety fallback)

### Required environment variables

Set these in your deployment platform environment settings:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional:

- `CLOUDINARY_PROOF_FOLDER` (default: `payment-proofs`)

### Local development

1. Copy `.env.example` to `.env`.
2. Fill in your Cloudinary values.
3. Run the app normally.

If Cloudinary env vars are missing, the app will still accept submissions via fallback storage, but production should always set Cloudinary for reliable proof hosting.

## Admin Alerts (Email + SMS)

When a new order/payment proof is submitted, the backend can notify admins via:

1. Email (SMTP)
2. SMS (Twilio)

These alerts are optional and non-blocking. If either provider is not configured or temporarily fails, order submission still succeeds.

### Email alert variables

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_SECURE` (`true` or `false`)
- `ADMIN_ALERT_EMAIL_FROM`
- `ADMIN_ALERT_EMAIL_TO` (comma-separated emails)

### SMS alert variables

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_SMS_FROM` (your Twilio SMS sender, e.g. `+14155238886`) OR
- `TWILIO_MESSAGING_SERVICE_SID` (if using Twilio Messaging Service)
- `ADMIN_SMS_TO` (destination number in E.164 format)

### Optional link base URL

- `APP_BASE_URL` (used in notification links to admin payment queue)

