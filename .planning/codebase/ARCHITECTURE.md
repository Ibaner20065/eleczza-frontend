<!-- refreshed: 2026-10-26 -->
# Architecture

**Analysis Date:** 2026-10-26

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│  `src/app/layout.tsx`  `src/app/(auth)`  `src/app/(app)`     │
│  Server Components by default; interactive pages opt in     │
│  with `"use client"`                                       │
└───────────────┬─────────────────────┬───────────────────────┘
                │                     │
                ▼                     ▼
┌──────────────────────────┐  ┌────────────────────────────────┐
│ Presentation Components    │  │ Route/API Boundary              │
│ `src/components/`         │  │ `src/app/auth/callback/route.ts`│
│ `src/hooks/`              │  │ `src/api/`                       │
└──────────────┬───────────┘  └───────────────┬────────────────┘
               │                             │
               ▼                             ▼
┌─────────────────────────────────────────────────────────────┐
│ Domain Types, Validators, and Client State                    │
│ `src/types/`  `src/lib/validators/`  `src/hooks/`             │
│ Mock fixtures in `src/lib/mock-data.ts` and typed API stubs   │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Supabase Session/Auth and External API                         │
│ `src/lib/supabase/{client,server,middleware}.ts`              │
│ `src/api/client.ts` → `NEXT_PUBLIC_API_URL`                   │
└─────────────────────────────────────────────────────────────┘
```

ELECZZA is a Next.js 16 App Router application for a themed forensic quiz portal. Route groups separate authenticated application screens from authentication screens without changing their public URLs. The UI currently combines Supabase authentication/session handling with typed mock-backed quiz and team flows.

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root layout | Fonts, global CSS, auth context, toast host, metadata | `src/app/layout.tsx` |
| Application route group | Shared navbar, footer, fog background, page shell | `src/app/(app)/layout.tsx` |
| Authentication route group | Login/signup visual shell and domain messaging | `src/app/(auth)/layout.tsx` |
| Route pages | Render dashboard, team, quiz, leaderboard, and auth experiences | `src/app/(app)/*/page.tsx`, `src/app/(auth)/*/page.tsx` |
| Presentation components | Reusable theme, layout, domain, and shadcn-style controls | `src/components/` |
| Auth provider | Browser session state and auth event subscription | `src/components/auth/auth-provider.tsx`, `src/hooks/use-auth.ts` |
| API service modules | Typed auth, team, and quiz operations | `src/api/auth.ts`, `src/api/team.ts`, `src/api/quiz.ts` |
| Supabase integration | Browser/server clients and middleware session refresh | `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts` |
| Domain model layer | Quiz, team, and auth input/output types | `src/types/`, `src/lib/validators/` |

## Pattern Overview

**Overall:** App Router layered frontend with route-group composition, feature-oriented components, typed service modules, and a hybrid Supabase/mock data boundary.

**Key Characteristics:**
- Use `src/app/` for URL ownership and route-level composition; use `src/components/` for reusable UI rather than placing shared components in route folders.
- Use server components by default. Pages needing browser state, forms, timers, animation, or browser APIs explicitly declare `"use client"` (for example `src/app/(app)/quiz/page.tsx` and `src/hooks/use-quiz-state.ts`).
- Keep domain contracts in `src/types/` and form schemas in `src/lib/validators/`; feature pages import these contracts instead of duplicating shapes.
- Centralize Supabase client construction in the three files under `src/lib/supabase/`; do not instantiate Supabase clients ad hoc in components.
- Route protection is middleware-driven, while client auth state is supplied through the root `AppAuthProvider`.

## Layers

**Route and rendering layer:**
- Purpose: Map URLs to layouts, pages, and the auth callback handler.
- Location: `src/app/`
- Contains: Root metadata/layout, `(app)` and `(auth)` route groups, public pages, and `auth/callback/route.ts`.
- Depends on: Components, hooks, service modules, validators, and domain types.
- Used by: Next.js runtime and browser navigation.

**Presentation layer:**
- Purpose: Render the Sherlock Holmes visual language and reusable interaction controls.
- Location: `src/components/`
- Contains: Feature components under `auth`, `dashboard`, `quiz`; shell components under `layout`; theme primitives under `theme`; UI primitives under `ui`.
- Depends on: `src/lib/`, `src/hooks/`, domain types, and third-party UI/icon/animation packages.
- Used by: Route pages and layouts.

**Client state and interaction layer:**
- Purpose: Manage auth state, timers, network state, reduced motion, polling, and quiz progression.
- Location: `src/hooks/`
- Contains: Context-backed auth state (`src/hooks/use-auth.ts`), quiz state persistence (`src/hooks/use-quiz-state.ts`), and focused browser hooks.
- Depends on: React, Supabase browser client, mock data, and domain types.
- Used by: Client pages/components.

**Service and integration layer:**
- Purpose: Encapsulate auth operations, quiz/team operations, and generic bearer-authenticated API requests.
- Location: `src/api/`
- Contains: `auth.ts`, `quiz.ts`, `team.ts`, and `client.ts`.
- Depends on: Supabase browser client, validators, and domain types.
- Used by: Pages and hooks; `src/api/client.ts` is the integration point for an Express-style backend.

**Infrastructure and domain layer:**
- Purpose: Provide Supabase clients, validators, utility functions, fixtures, motion definitions, and stable TypeScript contracts.
- Location: `src/lib/` and `src/types/`
- Contains: `src/lib/supabase/`, `src/lib/validators/`, `src/lib/mock-data.ts`, and feature type files.
- Depends on: Framework adapters and third-party libraries, but not route components.
- Used by: All higher layers.

## Data Flow

### Primary Request Path

1. A request enters Next.js middleware at `src/middleware.ts`, which delegates to `src/lib/supabase/middleware.ts`.
2. Middleware refreshes the Supabase session using request/response cookies and checks protected prefixes (`/dashboard`, `/team`, `/quiz`, `/leaderboard`).
3. Protected requests without a valid user, an allowed email domain, or an onboarded profile are redirected to `/login` or `/team`.
4. Next.js resolves the matching route in `src/app/`; `(app)` pages receive the shared shell from `src/app/(app)/layout.tsx`, while auth pages receive `src/app/(auth)/layout.tsx`.
5. A page composes feature components and either reads typed fixtures from `src/lib/mock-data.ts` or calls a service in `src/api/`.
6. Client interactions update local React state/hooks; auth operations use `src/lib/supabase/client.ts`, and generic backend calls use `src/api/client.ts`.

### Authentication Callback Flow

1. `src/api/auth.ts` creates Supabase email links pointing to `/auth/callback`.
2. `src/app/auth/callback/route.ts` accepts either a code or signup/recovery token hash.
3. The server Supabase client in `src/lib/supabase/server.ts` exchanges/verifies the credential and persists session cookies.
4. The callback allowlists the next destination (`/reset-password` or `/login?verified=1`) and redirects, falling back to an invalid-link page.

### Quiz Interaction Flow

1. `src/app/(app)/quiz/lobby/page.tsx` reads the typed mock team/case and computes readiness.
2. The quiz page validates deduction form input with `src/lib/validators/quiz.ts`.
3. Quiz progression can be coordinated by `src/hooks/use-quiz-state.ts`, which exposes phase, current question, answers, timer, readiness, and callbacks.
4. Quiz answers are persisted under a case-specific localStorage key for reconnect recovery; the current quiz service implementation in `src/api/quiz.ts` returns typed mock cases/results.

**State Management:**
- Global auth state is React Context mounted in `src/app/layout.tsx`.
- Feature state is local component state or feature hooks; no Redux/Zustand store is present.
- Quiz reconnect state uses browser `localStorage` in `src/hooks/use-quiz-state.ts`.
- Server/session state is represented by Supabase cookies and refreshed by middleware.

## Key Abstractions

**Route groups:**
- Purpose: Share layouts while keeping URL paths clean.
- Examples: `src/app/(app)/layout.tsx`, `src/app/(auth)/layout.tsx`.
- Pattern: Parenthesized folder names are organizational and do not appear in URLs.

**Supabase client split:**
- Purpose: Respect browser, server component, and middleware runtime boundaries.
- Examples: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`.
- Pattern: Use `createBrowserClient` in browser code, `createServerClient` with `next/headers` in server code, and request/response cookies in middleware.

**Typed API boundary:**
- Purpose: Keep page code independent of response parsing and future backend changes.
- Examples: `src/api/client.ts`, `src/api/team.ts`, `src/api/quiz.ts`.
- Pattern: Return explicit domain promises or `ApiResponse<T>` and import input types from validators.

**Theme/UI primitives:**
- Purpose: Keep the visual system consistent across route pages.
- Examples: `src/components/theme/brass-button.tsx`, `src/components/theme/case-file-card.tsx`, `src/components/ui/button.tsx`.
- Pattern: Compose feature pages from shared primitives and Tailwind utility classes; use `cn` from `src/lib/utils.ts` where class composition is needed.

## Entry Points

**Root application:**
- Location: `src/app/layout.tsx`
- Triggers: Every App Router request.
- Responsibilities: Metadata, fonts, global styles, auth provider, and toaster.

**Public landing page:**
- Location: `src/app/page.tsx`
- Triggers: `GET /`.
- Responsibilities: Public entry experience and navigation into auth/application routes.

**Protected application shell:**
- Location: `src/app/(app)/layout.tsx`
- Triggers: `/dashboard`, `/team`, `/quiz`, `/leaderboard` route group pages.
- Responsibilities: Background, navbar, main content width, and footer.

**Authentication shell:**
- Location: `src/app/(auth)/layout.tsx`
- Triggers: `/login`, `/signup`, `/forgot-password`, `/reset-password`.
- Responsibilities: Domain-aware auth presentation and responsive themed form container.

**Middleware:**
- Location: `src/middleware.ts`
- Triggers: Requests matching the exported matcher.
- Responsibilities: Delegate session refresh and access/onboarding redirects.

**Auth callback route:**
- Location: `src/app/auth/callback/route.ts`
- Triggers: Supabase verification links.
- Responsibilities: Exchange code/OTP and safely redirect to the allowed continuation page.

## Architectural Constraints

- **Runtime:** Next.js App Router mixes server and client components; browser-only APIs such as `localStorage`, `navigator`, and Supabase browser auth belong behind `"use client"` boundaries.
- **Session boundary:** Server/middleware Supabase clients must use cookie-aware adapters; browser code must use the singleton client in `src/lib/supabase/client.ts`.
- **Global state:** The only app-wide state provider is `AppAuthProvider` in `src/components/auth/auth-provider.tsx`; quiz and UI state remain feature-local.
- **Routing:** Protected route checks are prefix-based in `src/lib/supabase/middleware.ts`; adding a protected area requires updating this list and its onboarding behavior.
- **Path aliases:** Use the `@/*` alias configured in `tsconfig.json`, which maps to `src/*`.
- **Configuration:** Public runtime configuration is read from `NEXT_PUBLIC_*` environment variables; `.env.example` documents the expected names without being imported as application code.

## Anti-Patterns

### Bypassing the service/type boundary

**What happens:** Route components can embed backend calls or duplicate quiz/team object shapes.
**Why it's wrong:** It couples rendering to transport details and allows drift from `src/types/` and validators.
**Do this instead:** Add a typed operation in `src/api/` and use the domain contracts in `src/types/` and `src/lib/validators/`.

### Constructing Supabase clients in components

**What happens:** A component can create an ad hoc browser/server client.
**Why it's wrong:** It risks using the wrong runtime and breaks the cookie/session ownership model.
**Do this instead:** Import `createClient` from `src/lib/supabase/client.ts` for client code or `src/lib/supabase/server.ts` for server code.

### Using browser state from a server component

**What happens:** A route page accesses timers, `localStorage`, `navigator`, or event handlers without a client boundary.
**Why it's wrong:** Those APIs are unavailable during server rendering and cause hydration/runtime failures.
**Do this instead:** Put stateful behavior in a `"use client"` component or hook such as `src/hooks/use-quiz-state.ts`.

## Error Handling

**Strategy:** Service functions generally throw Supabase errors for auth failures, while generic API calls convert transport failures into `ApiResponse<T>` with `data`, `error`, and `status`. Middleware and callback code use redirects and graceful fallbacks.

**Patterns:**
- `src/api/auth.ts` throws Supabase errors for callers to display.
- `src/api/client.ts` normalizes JSON/text error payloads and catches network exceptions.
- `src/lib/supabase/middleware.ts` skips session checks when credentials are absent and logs offline/mock failures.
- `src/app/auth/callback/route.ts` maps invalid credentials to safe error query parameters.
- `src/app/error.tsx` provides the route-level error boundary.

## Cross-Cutting Concerns

**Logging:** Uses `console.error`, `console.warn`, and occasional `console.log` in auth/middleware and the quiz page; no dedicated logging abstraction is detected.

**Validation:** Zod schemas under `src/lib/validators/` are connected to React Hook Form through `@hookform/resolvers` in form pages.

**Authentication:** Supabase email/password auth, browser auth context, cookie session refresh, allowed-domain checks, and profile/agency onboarding checks are implemented across `src/api/auth.ts`, `src/hooks/use-auth.ts`, and `src/lib/supabase/middleware.ts`.

**Styling and motion:** Tailwind CSS v4 utilities, global theme CSS in `src/app/globals.css`/`src/styles/theme.css`, Framer Motion, and reusable theme components provide the visual layer.

---

*Architecture analysis: 2026-10-26*
