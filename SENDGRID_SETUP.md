# Email Notifications Setup (SendGrid)

## Current Status
Email notifications are stored as admin in-app notifications automatically.
To also send real emails, set up SendGrid (free tier: 100 emails/day).

## Steps to Enable Real Emails

1. Go to https://sendgrid.com and create a free account
2. Create an API key: Settings → API Keys → Create API Key (Mail Send permission)
3. Add the key to Cloudflare Pages:

```bash
npx wrangler pages secret put SENDGRID_KEY --project-name project-ba6e9ce4
# Paste your SendGrid API key when prompted

npx wrangler pages secret put ADMIN_EMAIL --project-name project-ba6e9ce4  
# Enter: admin@salonlink.it.com (or your actual admin email)
```

4. Redeploy: `npm run build && npx wrangler pages deploy dist --project-name project-ba6e9ce4`

## What Gets Emailed
- New customer registration → admin notified
- New provider registration → admin notified with business details + approve link
- Admin always sees notifications in /admin panel regardless of email setup
