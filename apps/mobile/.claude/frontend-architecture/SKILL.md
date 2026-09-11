# Expo and API integration

Use this reference when implementing the React Native client boundary with the NestJS API.

## Client architecture

Use Expo Router for navigation. Keep route files thin and place feature code outside the route directory:

```text
apps/mobile/src/
  app/                   routes and layouts only
  features/
    recipes/
    discovery/
    planning/
    cooking/
    favourites/
    uploads/
  components/
  api/                   generated client wrapper and query keys
  auth/
  storage/
  i18n/
  theme/
```

Use TanStack Query for remote server state. Use component state or a small local store for ephemeral UI and active cooking state. Do not copy server collections into a global state store.

## API contract

Generate types and request functions from the NestJS OpenAPI document into `packages/api-client`. Generated code is read-only. Wrap it with app-specific query hooks rather than importing generated calls throughout screens.

```text
Screen
  -> feature query/mutation hook
  -> generated API client
  -> NestJS API
```

Normalize errors once in the API wrapper and expose the backend error code, safe message, request ID, and retryability to features.

## Authentication

Allow public API calls without a token. For signed-in calls, attach the Supabase access token as a bearer token through one client interceptor/wrapper.

- Use the provider-supported persistent session mechanism for Expo.
- Refresh expired sessions centrally; do not implement refresh logic in individual screens.
- On sign-out, clear personal query caches, local private files, and active upload intents while retaining public recipe cache where safe.
- Never place the Supabase service-role key, database URL, or AI secret in an `EXPO_PUBLIC_*` variable.

An authenticated route that receives `401` may attempt one controlled refresh and retry once. Do not create infinite refresh loops.

## Locale behavior

Send the selected app locale explicitly. Render the API's resolved locale and fallback state when editorial/admin tooling needs to reveal missing translations.

Keep interface translations in app resource files; retrieve recipe and ingredient content from the API. Do not make the mobile release depend on shipping the full recipe catalog inside translation bundles.

Bundle fonts that render Burmese reliably. Avoid positive letter spacing for Burmese text and allow larger line height than Latin UI text.

## Guided cooking and timers

The server provides ordered steps, duration ranges, timer recommendation, heat level, completion cue, and ingredients used. The client controls execution.

When a timer starts:

1. Calculate and persist an absolute `endsAt` timestamp.
2. Schedule a local notification for that timestamp.
3. Derive remaining time from `endsAt - Date.now()` while the app is active.
4. On resume, recalculate rather than trusting missed interval ticks.
5. Do not auto-advance the cooking step when time expires. Ask the user to verify the completion cue.

Cancel or replace the scheduled notification when the timer is stopped or extended. Support multiple timers only after the cooking UX defines how users identify them.

Guest cooking sessions may stay local. Sync meaningful start, step progress, and completion events only for authenticated users or after explicit sign-in/merge behavior is defined.

## Offline and poor connectivity

- Keep active cooking state and the current recipe available locally once cooking begins.
- Cache recently viewed recipes and images within explicit size limits.
- Queue only safe, idempotent personal mutations for retry. Never silently retry public publishing, destructive admin actions, or duplicate-prone uploads.
- Show whether a change is local, syncing, synced, or failed.
- Ingredient search may use a downloaded lightweight index; full recipe freshness remains server-owned.

## Upload flow

For cooking-result photographs:

1. Ask for camera or library permission at the moment it is needed.
2. Let the user review and remove the image.
3. Resize/compress it to the configured limits while preserving adequate food detail.
4. Request a signed upload intent from the API.
5. Upload directly to storage.
6. Confirm the upload with the API and create the cooking result/media relation.
7. Default visibility to private.

Do not expose a permanent unrestricted upload URL. Strip unnecessary image metadata where practical and do not assume a photo proves taste, doneness, or safety.

## Deep links

Use stable recipe slugs for public links. A shared recipe link should open the installed app when configured and fall back to the public web page. Internal database IDs must not be the only public navigation key.

## Theme and accessibility

Consume shared semantic design tokens such as `background`, `surface`, `primary`, `onPrimary`, `text`, `textMuted`, `border`, `success`, and `error`. Components must not branch on literal colors.

Respect system light/dark mode and an explicit user override. Maintain readable contrast, dynamic text sizing, screen-reader labels, and touch targets suitable for use while cooking.

## Mobile testing

- Test Burmese text truncation and line height on both Android and iOS.
- Test expired authentication, sign-out cache clearing, offline recipe access, and reconnect behavior.
- Test timer behavior in foreground, background, after process restart, and after clock/timezone changes.
- Test upload cancellation, slow networks, duplicate confirmation, oversized files, and denied permissions.
- Test deep links from cold start and warm state.
- Keep business-rule assertions in backend/shared tests; mobile tests should focus on integration and user behavior.