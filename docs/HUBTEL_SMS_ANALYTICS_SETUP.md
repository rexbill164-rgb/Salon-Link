# Hubtel SMS and Analytics Setup

This implementation uses SalonLink-managed OTP codes delivered through Hubtel SMS. It does not use a Hubtel-managed OTP verification API.

## OTP Model

- SalonLink generates a 6-digit OTP on `POST /api/sms/otp/send`.
- The OTP is hashed and stored in D1 in the `otp_codes` table.
- Hubtel is used only to deliver the SMS message to the normalized Ghana phone number.
- The OTP expires after 10 minutes.
- Verification attempts are limited to 5 attempts per OTP session.
- SMS delivery attempts are stored in `sms_logs`; OTP bodies are truncated/redacted in logs to avoid retaining the code unnecessarily.

## Required Cloudflare Environment Variables

Add these variables in Cloudflare:

`Cloudflare -> Workers & Pages -> project-ba6e9ce4 -> Settings -> Environment Variables`

Required variables:

- `HUBTEL_CLIENT_ID`
- `HUBTEL_CLIENT_SECRET`
- `HUBTEL_SENDER_ID` or `HUBTEL_SMS_FROM`
- `JWT_SECRET`
- `ADMIN_EMAIL`

`HUBTEL_SMS_FROM` takes priority over `HUBTEL_SENDER_ID` when both are present. `JWT_SECRET` should match the application JWT signing secret used by the deployed SalonLink API.

## D1 Migration

Apply this migration before deployment:

```bash
npx wrangler d1 execute salonlink-production --file=migrations/0004_hubtel_sms_analytics.sql
```

If the database name differs, use the production D1 database that is bound to the Worker as `DB`.

The migration creates:

- `customer_profiles`
- `otp_codes`
- `sms_logs`
- `analytics_events`
- `automation_rules`

The `/api/sms` and `/api/analytics` routes return `Database migration required` if the needed tables are missing.
