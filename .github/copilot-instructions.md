<!-- GSD:project-start source:PROJECT.md -->

## Project

**ELECZZA**

ELECZZA is a Next.js App Router quiz portal with Supabase authentication, protected application routes, and a themed forensic quiz experience. This milestone transforms the existing product into an immersive Sherlock Holmes-inspired Victorian investigation journey while preserving the real authentication and quiz flow already present in the application.

The experience should feel like entering a private Baker Street investigation room: cinematic, editorial, atmospheric, and readable. The new journey runs from authentication through a one-time post-login case-file transition into the existing quiz landing and quiz flow.

**Core Value:** Users should feel that they have entered and can successfully complete a coherent mystery investigation without losing the reliability of the existing authenticated quiz.

### Constraints

- **Compatibility**: Preserve the existing Next.js App Router, Supabase session behavior, protected routes, quiz state, scoring, and backend/API boundaries.
- **Visual direction**: Use restrained Victorian materials and lighting: obsidian/charcoal, dark walnut, aged parchment/ivory, antique brass, and crimson. Avoid generic gradients, excessive neon, and unreadable atmosphere.
- **Motion**: Reuse Framer Motion and existing motion/reduced-motion patterns where practical. The scroll sequence must not block scrolling, overflow horizontally, or ignore `prefers-reduced-motion`.
- **Security**: Never bypass authentication, fabricate success, expose secrets, store passwords in browser storage, or weaken route protections.
- **Scope**: Fix only issues tightly coupled to the auth-to-quiz journey; do not broaden this milestone into full backend hardening.
- **Execution**: Use fine-grained phases and sequential execution so global styles, routing, authentication, and shared components are reconciled centrally.
- **Documentation**: Planning artifacts remain local because the user selected not to commit `.planning/` documents.

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- TypeScript 5 - Application, API wrappers, typed Supabase models, validators, and configuration in `src/**/*.ts`, `src/**/*.tsx`, `next.config.ts`, and `eslint.config.mjs`.
- CSS - Tailwind CSS v4 utilities, theme variables, and component styling in `src/app/globals.css` and `src/styles/theme.css`.
- JSON - Package, TypeScript, shadcn, and tooling configuration in `package.json`, `tsconfig.json`, and `components.json`.

## Runtime

- Node.js - Required by Next.js and the npm scripts; no `.nvmrc` or explicit Node version is present.
- npm - Scripts and dependency installation are defined in `package.json`.
- Lockfile: present (`package-lock.json`).

## Frameworks

- Next.js 16.4.3 - App Router pages, layouts, route handler, middleware, image/font optimization, and production build in `src/app/`, `src/middleware.ts`, and `next.config.ts`.
- React 19.3.0 / React DOM 19.3.0 - Client components, providers, hooks, and rendered UI in `src/components/`, `src/hooks/`, and `src/app/`.
- TypeScript 5 - Strict type checking and typed application boundaries configured by `tsconfig.json`.
- Not detected. `package.json` has no test runner or test script, and no test files are present in the scanned source tree.
- Tailwind CSS 4 with `@tailwindcss/turbopack` - Utility CSS and Turbopack CSS loading through `src/app/globals.css` and `next.config.ts`.
- Turbopack - Development/build CSS rule configured in `next.config.ts`.
- ESLint 9 with `eslint-config-next` 16.4.3 - Next.js core-web-vitals and TypeScript linting in `eslint.config.mjs`.
- Prettier 3.9.10 with `prettier-plugin-tailwindcss` - Formatting through `.prettierrc` and `package.json`.
- Husky 9.1.7 and lint-staged 17.6.0 - Git hook tooling configured by `.husky/` and `.lintstagedrc.json`.
- shadcn 4.22.1 - Component conventions and registry metadata in `components.json`, with local primitives in `src/components/ui/`.

## Key Dependencies

- `@supabase/ssr` `^0.12.7` and `@supabase/supabase-js` `^2.118.0` - Browser/server Supabase clients, cookie-based SSR sessions, auth operations, and profile queries in `src/lib/supabase/` and `src/api/auth.ts`.
- `react-hook-form` `^7.91.0` and `zod` `^4.6.7` - Form state and schema validation in `src/app/(auth)/` and `src/lib/validators/`.
- `next` `16.4.3` - Full-stack web framework and runtime.
- `framer-motion` `^14.6.0` - Page, atmosphere, quiz, and reduced-motion animations in `src/components/` and `src/app/`.
- `lucide-react` `^1.61.0` - Interface icons throughout `src/components/` and `src/app/`.
- `sonner` `^2.0.8` - Toast notifications, wrapped by `src/components/ui/sonner.tsx`.
- `@base-ui/react` `^1.9.0` - Dialog primitive used by `src/components/ui/dialog.tsx`.
- `class-variance-authority` `^0.7.1`, `clsx` `^2.1.1`, `tailwind-merge` `^3.7.0`, `cn` `^0.5.0` - Class composition utilities in `src/components/ui/` and `src/lib/utils.ts`.
- `tw-animate-css` `^1.4.0` - Tailwind animation utilities imported by `src/app/globals.css`.

## Configuration

- Public runtime configuration is documented in `.env.example`: Supabase URL/anon key, application URL, allowed email domain, Express API URL, and mock API toggle.
- `SUPABASE_SERVICE_ROLE_KEY` is documented for server-only administrative operations, but no current source usage was detected.
- Never expose secret values from local environment files; only variable names belong in project documentation.
- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and a Turbopack CSS loader for Tailwind.
- `tsconfig.json` enables strict mode, bundler module resolution, React JSX transform, incremental checking, and the `@/*` alias to `src/*`.
- `eslint.config.mjs` configures Next core-web-vitals and TypeScript rules.
- `.prettierrc` and `.prettierignore` define formatting behavior and exclusions.
- `components.json` configures shadcn with Tailwind CSS variables, `src/app/globals.css`, and `@/components`/`@/lib`/`@/hooks` aliases.

## Platform Requirements

- Node.js with npm and a browser.
- Optional Supabase project credentials for live authentication and profile/session middleware.
- Optional Express-compatible API at `NEXT_PUBLIC_API_URL`; local mock mode is available through `NEXT_PUBLIC_MOCK_API`.
- A Next.js-compatible Node hosting target. The README documents Vercel as the intended/easiest deployment target.
- Production Supabase redirect URLs must include `/auth/callback`, as described in `README.md`.

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- Use lowercase kebab-case for TypeScript and TSX files, for example `src/components/auth/auth-card.tsx`, `src/hooks/use-quiz-state.ts`, and `src/lib/password-strength.ts`.
- Next.js route files use the framework names `page.tsx`, `layout.tsx`, `template.tsx`, `error.tsx`, `not-found.tsx`, and `route.ts` under `src/app/`.
- Type declaration files use a domain suffix such as `src/types/auth.types.ts` and `src/types/quiz.types.ts`.
- Use camelCase for functions and handlers: `loginWithEmail`, `getAuthCallbackUrl`, `onSubmit`, `copyPasscode`, and `markTeamReady` in `src/api/auth.ts`, `src/app/(auth)/login/page.tsx`, and `src/app/(app)/team/page.tsx`.
- React components and page exports use PascalCase: `AuthCard`, `ErrorPage`, `LoginPage`, and `TeamPage`.
- Custom hooks use the `use` prefix and camelCase, such as `useAuth`, `useQuizState`, and `useTimer` in `src/hooks/`.
- Boolean state and predicates use `is`, `has`, or action-oriented names such as `isLocked`, `isOnline`, `isAllowedDomain`, `allReady`, and `isRateLimitError`.
- Use camelCase for local variables and state setters, including `currentIndex`, `formError`, `resendCooldown`, `setCurrentIndex`, and `setFormError`.
- Use `SCREAMING_SNAKE_CASE` for module constants representing fixed data or storage keys, including `STATE_KEY` and `MOCK_QUESTIONS` in `src/hooks/use-quiz-state.ts` and `src/lib/mock-data.ts`.
- Use PascalCase for enum-like object keys and discriminated string values where the domain model requires it, such as `LEAD_INSPECTOR`, `CRYPTANALYST`, and `FIELD_AGENT` in `src/types/team.types.ts`.
- Use PascalCase for interfaces, type aliases, and inferred input types: `ApiResponse<T>`, `AuthContextValue`, `AnswerRecord`, `LoginInput`, and `TeamRole`.
- Prefer `interface` for object-shaped public/component props and context contracts; use `type` for unions, inferred Zod inputs, and simple aliases.
- Keep domain types in `src/types/`, validator schemas and their inferred input types together in `src/lib/validators/`, and component props adjacent to the component implementation.

## Code Style

- Prettier is the formatter (`prettier` in `package.json`) and uses the repository configuration in `.prettierrc`; the repository uses double quotes, semicolons, trailing commas, and a print width of 80.
- `prettier-plugin-tailwindcss` is configured, so Tailwind utility classes should be left for the formatter to order.
- Run `npm run format:check` to verify formatting or `npm run format` to rewrite files. Staged TypeScript, TSX, JSON, Markdown, and stylesheet files are formatted automatically by `.lintstagedrc.json`.
- ESLint 9 uses the flat configuration in `eslint.config.mjs`, combining `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- Next build artifacts are ignored through the ESLint config (`.next/**`, `out/**`, `build/**`, and `next-env.d.ts`).
- Run `npm run lint`; staged JavaScript and TypeScript files run `eslint --fix` through `.lintstagedrc.json`.
- TypeScript is strict (`strict: true`) with `noEmit: true` in `tsconfig.json`; preserve explicit types at API and validation boundaries.

## Import Organization

- Use `@/*` for absolute imports from `src/*`, as configured in `tsconfig.json`.
- Prefer `@/components/...`, `@/lib/...`, `@/hooks/...`, `@/api/...`, and `@/types/...` over long relative paths.
- `src/lib/utils.ts` is the small shared utility module and re-exports `cn`; do not create a new relative utility import when an existing alias is available.

## Error Handling

- API functions using Supabase throw provider errors after checking the returned `{ data, error }` result, as in `src/api/auth.ts` and `src/hooks/use-auth.ts`. UI callers catch those errors and translate them into user-facing messages.
- The generic API wrapper returns a typed result instead of throwing for HTTP, session, parsing, and network failures: `ApiResponse<T>` in `src/api/client.ts` carries `data`, `error`, and `status`.
- Use `unknown` in catch boundaries and narrow with `instanceof Error` or a typed property check. `errorDetails` in `src/app/(auth)/login/page.tsx` is the clearest example.
- Zod schemas in `src/lib/validators/` perform input validation at form boundaries; forms use `zodResolver` and render field messages through React Hook Form.
- Preserve safe fallback behavior for malformed external or persisted data. `src/hooks/use-quiz-state.ts` validates parsed localStorage records with `isRecord` and `isAnswerRecord` and ignores malformed state.
- Route-level rendering failures use the Next.js error boundary in `src/app/error.tsx`, which logs the error and exposes retry/navigation actions.

## Logging

- Log authentication initialization failures in `src/hooks/use-auth.ts` with `console.error`.
- Log middleware failures and warnings in `src/lib/supabase/middleware.ts` with `console.error` and `console.warn`.
- The route error boundary logs the captured error in `src/app/error.tsx`; the quiz page currently logs mock submission activity with `console.log` in `src/app/(app)/quiz/page.tsx`.
- Avoid logging credentials, access tokens, or sensitive form values. User-facing errors should be generic where provider messages could reveal account state; `src/app/(auth)/login/page.tsx` maps errors to safe messages.

## Comments

- Comments explain non-obvious browser lifecycle, persistence, mock, or framework behavior, such as the localStorage/reconnect notes in `src/hooks/use-quiz-state.ts` and the error-boundary sections in `src/app/error.tsx`.
- JSX comments label major visual sections in larger pages such as `src/app/(app)/team/page.tsx`; use comments for structure or rationale, not for restating obvious markup.
- Mark intentionally temporary/mock behavior explicitly, for example `// mock: current user is leader` in `src/app/(app)/team/page.tsx`.
- Formal JSDoc/TSDoc is not detected in `src/`; use clear names, interfaces, and focused comments for public or non-obvious behavior instead.

## Function Design

## Module Design

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

```

## Component Responsibilities

| Component                  | Responsibility                                                  | File                                                                                         |
| -------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Root layout                | Fonts, global CSS, auth context, toast host, metadata           | `src/app/layout.tsx`                                                                         |
| Application route group    | Shared navbar, footer, fog background, page shell               | `src/app/(app)/layout.tsx`                                                                   |
| Authentication route group | Login/signup visual shell and domain messaging                  | `src/app/(auth)/layout.tsx`                                                                  |
| Route pages                | Render dashboard, team, quiz, leaderboard, and auth experiences | `src/app/(app)/*/page.tsx`, `src/app/(auth)/*/page.tsx`                                      |
| Presentation components    | Reusable theme, layout, domain, and shadcn-style controls       | `src/components/`                                                                            |
| Auth provider              | Browser session state and auth event subscription               | `src/components/auth/auth-provider.tsx`, `src/hooks/use-auth.ts`                             |
| API service modules        | Typed auth, team, and quiz operations                           | `src/api/auth.ts`, `src/api/team.ts`, `src/api/quiz.ts`                                      |
| Supabase integration       | Browser/server clients and middleware session refresh           | `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts` |
| Domain model layer         | Quiz, team, and auth input/output types                         | `src/types/`, `src/lib/validators/`                                                          |

## Pattern Overview

- Use `src/app/` for URL ownership and route-level composition; use `src/components/` for reusable UI rather than placing shared components in route folders.
- Use server components by default. Pages needing browser state, forms, timers, animation, or browser APIs explicitly declare `"use client"` (for example `src/app/(app)/quiz/page.tsx` and `src/hooks/use-quiz-state.ts`).
- Keep domain contracts in `src/types/` and form schemas in `src/lib/validators/`; feature pages import these contracts instead of duplicating shapes.
- Centralize Supabase client construction in the three files under `src/lib/supabase/`; do not instantiate Supabase clients ad hoc in components.
- Route protection is middleware-driven, while client auth state is supplied through the root `AppAuthProvider`.

## Layers

- Purpose: Map URLs to layouts, pages, and the auth callback handler.
- Location: `src/app/`
- Contains: Root metadata/layout, `(app)` and `(auth)` route groups, public pages, and `auth/callback/route.ts`.
- Depends on: Components, hooks, service modules, validators, and domain types.
- Used by: Next.js runtime and browser navigation.
- Purpose: Render the Sherlock Holmes visual language and reusable interaction controls.
- Location: `src/components/`
- Contains: Feature components under `auth`, `dashboard`, `quiz`; shell components under `layout`; theme primitives under `theme`; UI primitives under `ui`.
- Depends on: `src/lib/`, `src/hooks/`, domain types, and third-party UI/icon/animation packages.
- Used by: Route pages and layouts.
- Purpose: Manage auth state, timers, network state, reduced motion, polling, and quiz progression.
- Location: `src/hooks/`
- Contains: Context-backed auth state (`src/hooks/use-auth.ts`), quiz state persistence (`src/hooks/use-quiz-state.ts`), and focused browser hooks.
- Depends on: React, Supabase browser client, mock data, and domain types.
- Used by: Client pages/components.
- Purpose: Encapsulate auth operations, quiz/team operations, and generic bearer-authenticated API requests.
- Location: `src/api/`
- Contains: `auth.ts`, `quiz.ts`, `team.ts`, and `client.ts`.
- Depends on: Supabase browser client, validators, and domain types.
- Used by: Pages and hooks; `src/api/client.ts` is the integration point for an Express-style backend.
- Purpose: Provide Supabase clients, validators, utility functions, fixtures, motion definitions, and stable TypeScript contracts.
- Location: `src/lib/` and `src/types/`
- Contains: `src/lib/supabase/`, `src/lib/validators/`, `src/lib/mock-data.ts`, and feature type files.
- Depends on: Framework adapters and third-party libraries, but not route components.
- Used by: All higher layers.

## Data Flow

### Primary Request Path

### Authentication Callback Flow

### Quiz Interaction Flow

- Global auth state is React Context mounted in `src/app/layout.tsx`.
- Feature state is local component state or feature hooks; no Redux/Zustand store is present.
- Quiz reconnect state uses browser `localStorage` in `src/hooks/use-quiz-state.ts`.
- Server/session state is represented by Supabase cookies and refreshed by middleware.

## Key Abstractions

- Purpose: Share layouts while keeping URL paths clean.
- Examples: `src/app/(app)/layout.tsx`, `src/app/(auth)/layout.tsx`.
- Pattern: Parenthesized folder names are organizational and do not appear in URLs.
- Purpose: Respect browser, server component, and middleware runtime boundaries.
- Examples: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`.
- Pattern: Use `createBrowserClient` in browser code, `createServerClient` with `next/headers` in server code, and request/response cookies in middleware.
- Purpose: Keep page code independent of response parsing and future backend changes.
- Examples: `src/api/client.ts`, `src/api/team.ts`, `src/api/quiz.ts`.
- Pattern: Return explicit domain promises or `ApiResponse<T>` and import input types from validators.
- Purpose: Keep the visual system consistent across route pages.
- Examples: `src/components/theme/brass-button.tsx`, `src/components/theme/case-file-card.tsx`, `src/components/ui/button.tsx`.
- Pattern: Compose feature pages from shared primitives and Tailwind utility classes; use `cn` from `src/lib/utils.ts` where class composition is needed.

## Entry Points

- Location: `src/app/layout.tsx`
- Triggers: Every App Router request.
- Responsibilities: Metadata, fonts, global styles, auth provider, and toaster.
- Location: `src/app/page.tsx`
- Triggers: `GET /`.
- Responsibilities: Public entry experience and navigation into auth/application routes.
- Location: `src/app/(app)/layout.tsx`
- Triggers: `/dashboard`, `/team`, `/quiz`, `/leaderboard` route group pages.
- Responsibilities: Background, navbar, main content width, and footer.
- Location: `src/app/(auth)/layout.tsx`
- Triggers: `/login`, `/signup`, `/forgot-password`, `/reset-password`.
- Responsibilities: Domain-aware auth presentation and responsive themed form container.
- Location: `src/middleware.ts`
- Triggers: Requests matching the exported matcher.
- Responsibilities: Delegate session refresh and access/onboarding redirects.
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

### Constructing Supabase clients in components

### Using browser state from a server component

## Error Handling

- `src/api/auth.ts` throws Supabase errors for callers to display.
- `src/api/client.ts` normalizes JSON/text error payloads and catches network exceptions.
- `src/lib/supabase/middleware.ts` skips session checks when credentials are absent and logs offline/mock failures.
- `src/app/auth/callback/route.ts` maps invalid credentials to safe error query parameters.
- `src/app/error.tsx` provides the route-level error boundary.

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.github/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-fast` for a trivial task inline, with no subagents and no PLAN.md
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.

<!-- GSD:profile-end -->
