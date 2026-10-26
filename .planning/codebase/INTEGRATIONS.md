# External Integrations

**Analysis Date:** 2026-10-26

## APIs & External Services

**Supabase Authentication:**
- Supabase Auth - Email/password sign-in, signup verification, resend verification, password recovery, password update, sign-out, session restoration, and OTP/code callback handling.
  - SDK/Client: `@supabase/ssr` and `@supabase/supabase-js`, initialized in `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`.
  - Auth: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from `.env.example`.
  - Implementation: Browser auth operations are centralized in `src/api/auth.ts`; the callback route is `src/app/auth/callback/route.ts`; session refresh and route protection are handled by `src/lib/supabase/middleware.ts` and `src/middleware.ts`.

**Express-compatible application API:**
- Configurable backend API - `src/api/client.ts` can call an external HTTP API, resolve relative endpoints against `NEXT_PUBLIC_API_URL`, attach the current Supabase access token as a bearer token, and normalize JSON/text errors.
  - SDK/Client: Native `fetch` plus the Supabase browser client.
  - Auth: Supabase session access token in the `Authorization` header.
  - Configuration: `NEXT_PUBLIC_API_URL` in `.env.example`.
  - Current usage: The generic wrapper is present, but `src/api/quiz.ts` and `src/api/team.ts` currently return typed local mock/service data rather than invoking it.

**Google Fonts:**
- Google Fonts - Cormorant Garamond, Pinyon Script, and Special Elite are loaded through Next's font integration in `src/app/layout.tsx`.
  - SDK/Client: `next/font/google`.
  - Auth: None.

## Data Storage

**Databases:**
- Supabase Postgres - The configured persistence provider behind Supabase.
  - Connection: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.example`.
  - Client/ORM: `@supabase/ssr` server client in `src/lib/supabase/server.ts` and generated-style TypeScript model declarations in `src/types/database.types.ts`.
  - Current query: `src/lib/supabase/middleware.ts` reads `profiles.id` and `profiles.agency_id` to enforce onboarding.
  - Declared tables: `profiles` and `teams` in `src/types/database.types.ts`.

**File Storage:**
- Local/public application assets only - Static assets are under `public/`; no external object-storage client or upload integration was detected.

**Caching:**
- Next.js component/page caching configuration - `cacheComponents` and `partialPrefetching` are enabled in `next.config.ts`.
- No Redis or external cache service was detected.

## Authentication & Identity

**Auth Provider:**
- Supabase Auth.
  - Implementation: Email/password flows in `src/api/auth.ts`; browser session singleton in `src/lib/supabase/client.ts`; server cookie integration in `src/lib/supabase/server.ts`; middleware session refresh and protected-route redirects in `src/lib/supabase/middleware.ts`.
  - Access policy: `NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN` restricts the institutional email domain, with a default of `@aot.edu.in` in `src/lib/supabase/middleware.ts` and `src/lib/validators/auth.ts`.
  - Protected areas: `/dashboard`, `/team`, `/quiz`, and `/leaderboard`, enforced by `src/lib/supabase/middleware.ts`.
  - Callback paths: `/auth/callback` accepts Supabase authorization `code` or signup/recovery `token_hash` values and redirects only to approved local paths in `src/app/auth/callback/route.ts`.

## Monitoring & Observability

**Error Tracking:**
- None detected. No Sentry, hosted error tracker, or telemetry SDK is configured.

**Logs:**
- Browser/server console logging only. Authentication/session fallback and profile lookup failures log through `console.warn` or `console.error` in `src/lib/supabase/middleware.ts` and `src/hooks/use-auth.ts`.

## CI/CD & Deployment

**Hosting:**
- Vercel is documented as the intended deployment target in `README.md`; no provider-specific deployment configuration was detected.

**CI Pipeline:**
- None detected. No GitHub Actions workflow or other CI configuration was found in the repository snapshot.

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL used by browser, server, and middleware clients.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public anon key used by browser, server, and middleware clients.
- `NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN` - Institutional email suffix used for access control.
- `NEXT_PUBLIC_APP_URL` - Base URL used to construct Supabase email callback URLs.
- `NEXT_PUBLIC_API_URL` - Optional external Express-compatible API base URL.
- `NEXT_PUBLIC_MOCK_API` - Enables typed mock responses in `src/api/client.ts`.
- `SUPABASE_SERVICE_ROLE_KEY` - Documented server-only key for future/admin operations; no current source use detected.

**Secrets location:**
- Local environment values are expected in ignored environment files; `.env.example` contains placeholders and variable names only. Do not read, copy, or commit secret values.

## Webhooks & Callbacks

**Incoming:**
- Supabase Auth email callback at `/auth/callback` in `src/app/auth/callback/route.ts`. It handles authorization-code exchange and signup/recovery OTP verification; it is a browser redirect callback, not a webhook.
- No third-party webhook receiver endpoint was detected.

**Outgoing:**
- Supabase Auth sends signup verification and password-recovery emails through the configured Supabase project when invoked by `src/api/auth.ts`.
- Generic outbound HTTP requests are possible through `fetch` in `src/api/client.ts`; no concrete quiz/team API endpoint usage is currently wired.

---

*Integration audit: 2026-10-26*
