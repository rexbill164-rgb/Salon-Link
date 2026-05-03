# SalonLink QA and Security Audit

Branch: `qa/security-platform-audit`

This is a safe, non-destructive audit. It does not brute-force, attack, load-test, or change production data.

## Scope reviewed

- Authentication and registration flow
- Provider listing and provider dashboard routes
- Booking creation and booking status routes
- Admin stats/users/providers/bookings routes
- Customer journey: discover -> provider -> booking -> dashboard
- Provider journey: login -> dashboard -> services -> bookings -> KYC
- Admin journey: login -> dashboard -> users/providers/KYC/payments/fees

## High-priority findings

### 1. Runtime JWT secret is inconsistent across core routes

Several routes verify/sign tokens using a hardcoded fallback secret instead of a runtime `JWT_SECRET` environment variable. This can cause auth mismatches and makes secret rotation harder.

Files observed:
- `src/routes/auth.ts`
- `src/routes/providers.ts`
- `src/routes/bookings.ts`
- `src/routes/admin.ts`

Recommended fix:

```ts
function getJwtSecret(c: any): string {
  return c.env.JWT_SECRET || ['salonlink', 'jwt', 'secret', '2026'].join('_')
}
```

Then use `getJwtSecret(c)` in every `sign()` and `verify()` call.

### 2. Password hashing is weak for production

The app currently uses plain SHA-256 hashing for passwords. This is better than plaintext, but it is not strong enough for production password storage because it is fast and unsalted.

Recommended fix:
- Use bcrypt, argon2, or a hardened Cloudflare-compatible password hashing strategy.
- Add migration path for existing users.
- Keep login backward-compatible during migration.

### 3. Demo password reset code can expose reset codes when email is not configured

The reset-password route returns `demo_code` when email service is unavailable. This is useful during development but unsafe in production.

Recommended fix:
- Disable demo reset codes in production.
- Gate demo behavior behind an explicit environment variable such as `ALLOW_DEMO_CODES=true`.

### 4. OTP demo response must be disabled in production

Existing OTP logic can return demo OTP codes when WhatsApp/SMS credentials are not configured. This must not happen in production.

Recommended fix:
- Return a clear configuration error in production.
- Only return OTP codes in local/dev mode.

### 5. Admin and provider page scripts need syntax-level repair

The live admin console showed `Unexpected identifier 't'` inside the rendered admin page. This breaks the page's own JavaScript and prevents KPI cards and tables from loading.

Recommended fix:
- Fix the real syntax error in `src/pages/admin.ts` instead of adding fallback scripts.
- Run a build after the fix.
- Test admin tabs: Overview, Users, Providers, Bookings, KYC, Payments, Fees, Registrants, Reconcile, Reports, Security.

## Medium-priority findings

### 6. Booking flow has good double-booking protection, but needs edge-case tests

The booking route checks provider availability, provider verification, service ownership, overlapping bookings, and customer conflicts. These are strong protections.

Recommended tests:
- Same customer books same time twice.
- Two customers book overlapping time for same provider.
- Unverified provider receives booking attempt.
- Cancelled booking frees the slot.
- Long-duration service blocks multiple 30-minute slots.

### 7. Admin endpoints should use consistent JWT secret and stricter role checks

Admin endpoints already check admin role, but the JWT secret should use the runtime helper. This avoids mismatch if `JWT_SECRET` is set in Cloudflare.

### 8. Public provider listing may need pagination limits

Provider listing accepts `limit` and `offset`. Limit should be capped server-side to prevent very large responses.

Recommended fix:

```ts
const safeLimit = Math.min(parseInt(limit || '20'), 50)
```

### 9. Sensitive image data should not be returned in large admin list endpoints

The admin providers endpoint already excludes large image columns, which is good. Keep KYC image loading on-demand only.

## Customer walkthrough checks

### Customer flow to test manually

1. Open homepage.
2. Search for a service and city.
3. Open Discover.
4. Open a provider card.
5. Select service.
6. Start booking.
7. Choose date/time.
8. Confirm booking.
9. Verify booking appears in dashboard.
10. Cancel booking and confirm slot behavior.

### Provider flow to test manually

1. Login as provider.
2. Open provider dashboard.
3. Add/edit service.
4. Toggle accepting bookings.
5. Submit KYC.
6. View pending bookings.
7. Confirm/completed/cancel booking status.

### Admin flow to test manually

1. Login as admin.
2. Open admin dashboard.
3. Confirm KPI numbers load.
4. Open Users.
5. Open Providers.
6. Open KYC Queue.
7. Approve/reject provider.
8. Open Bookings.
9. Open Payments.
10. Open Fees/Reconcile.

## Recommended fix order

1. Fix admin page JavaScript syntax error.
2. Standardize JWT secret handling across all routes.
3. Disable demo reset/OTP codes in production.
4. Cap list endpoint limits.
5. Add production-safe password hashing migration.
6. Merge Hubtel SMS/analytics PR only after D1 migration and env vars are ready.
7. Add booking SMS reminders and cron in a later PR.

## Do not deploy checklist

Before any merge/deploy:

- Confirm GitHub branch matches the currently desired UI/theme.
- Confirm Cloudflare production environment variables are set.
- Confirm D1 migrations have run.
- Confirm GitHub Actions build passes.
- Confirm `/api/health` returns expected version.
- Confirm admin/provider pages have no console syntax errors.
