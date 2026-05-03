# Chat, Nearby Providers, and Service UI Setup

This branch adds a customer-provider messaging foundation, nearby provider discovery UI, and mobile service-list readability improvements.

## Migration Required

Apply the messages migration before using `/api/messages` in production:

```bash
npx wrangler d1 execute salonlink-production --file=migrations/0007_messages.sql
```

If the production D1 database name differs, run the command against the D1 database bound as `DB` in Cloudflare.

## Messages Model

SalonLink stores messages in the `messages` table.

- Conversation IDs use the format `provider:{provider_id}:customer:{customer_user_id}`.
- Customers can start a provider conversation from the provider profile.
- Providers can reply from the Messages page/inbox.
- Users can only read conversations where they are the sender, receiver, customer in the conversation ID, or the owner of the provider profile in the conversation ID.

## Nearby Providers

The Discover page enhancement asks for browser location permission and calls:

```text
/api/providers/nearby?lat={lat}&lng={lng}
```

Providers with saved `location_lat` and `location_lng` sort first by distance. Providers without coordinates can still appear lower in the list.

## Provider Location

The provider dashboard already includes a Location section with a `Use my current location` action and saves `location_lat` / `location_lng` through `PUT /api/providers/me`. This branch does not add a new provider-location schema change.

## No Deployment

This branch is for review only. Do not deploy or merge until reviewed.
