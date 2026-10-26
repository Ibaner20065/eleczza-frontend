# Codebase Structure

**Analysis Date:** 2026-10-26

## Directory Layout

```text
ELECZZA/
├── .planning/codebase/       # Generated codebase maps
├── .husky/                   # Git hook configuration
├── docs/                     # Project documentation
├── public/images/            # Static images served from the site root
├── src/
│   ├── app/                  # Next.js App Router layouts, pages, route handlers
│   ├── api/                  # Typed auth, quiz, team, and generic API services
│   ├── components/           # Reusable feature, shell, theme, and UI components
│   ├── hooks/                # Client-side state and behavior hooks
│   ├── lib/                  # Supabase adapters, validators, fixtures, utilities
│   ├── styles/               # Additional theme stylesheet
│   └── types/                # Domain TypeScript contracts
├── .env.example              # Environment variable name reference
├── next.config.ts            # Next.js runtime/build configuration
├── package.json              # Scripts and dependencies
├── tsconfig.json             # Strict TypeScript and `@/*` alias
└── README.md                 # Setup and Supabase integration notes
```

## Directory Purposes

**`src/app/`:**
- Purpose: Own URL structure and App Router composition.
- Contains: Root layout, public landing page, route-group layouts/pages, global CSS, error/not-found boundaries, and the Supabase callback route.
- Key files: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/(app)/layout.tsx`, `src/app/(auth)/layout.tsx`, `src/app/auth/callback/route.ts`.

**`src/app/(app)/`:**
- Purpose: Protected application experience with shared navigation and footer.
- Contains: `dashboard`, `leaderboard`, `quiz`, and `team` pages plus the group layout.
- Key files: `src/app/(app)/dashboard/page.tsx`, `src/app/(app)/quiz/lobby/page.tsx`, `src/app/(app)/quiz/page.tsx`.

**`src/app/(auth)/`:**
- Purpose: Authentication screens with a separate responsive visual shell.
- Contains: `login`, `signup`, `forgot-password`, and `reset-password` pages.
- Key files: `src/app/(auth)/layout.tsx`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`.

**`src/api/`:**
- Purpose: Keep feature operations and transport concerns out of route markup.
- Contains: `auth.ts` for Supabase auth commands, `team.ts` and `quiz.ts` for typed feature operations, and `client.ts` for bearer-authenticated external API requests.
- Key files: `src/api/client.ts`, `src/api/auth.ts`, `src/api/team.ts`, `src/api/quiz.ts`.

**`src/components/`:**
- Purpose: Reusable visual and interaction components.
- Contains: Feature folders (`auth`, `dashboard`, `quiz`), application shell (`layout`), visual system (`theme`), and shadcn-style primitives (`ui`).
- Key files: `src/components/auth/auth-provider.tsx`, `src/components/layout/navbar.tsx`, `src/components/theme/case-file-card.tsx`, `src/components/ui/button.tsx`.

**`src/hooks/`:**
- Purpose: Reusable client-side behavior and state.
- Contains: Auth context consumers, quiz state, timer/countdown logic, reduced-motion handling, and leaderboard polling.
- Key files: `src/hooks/use-auth.ts`, `src/hooks/use-quiz-state.ts`, `src/hooks/use-timer.ts`, `src/hooks/use-leaderboard-poll.ts`.

**`src/lib/`:**
- Purpose: Framework adapters, shared utilities, fixtures, validation, and motion definitions.
- Contains: `supabase/`, `validators/`, `mock-data.ts`, `motion.ts`, `password-strength.ts`, and `utils.ts`.
- Key files: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`, `src/lib/validators/auth.ts`.

**`src/styles/`:**
- Purpose: Hold theme-specific CSS separate from the App Router global entry.
- Contains: `src/styles/theme.css`.
- Key files: `src/styles/theme.css`; global application CSS is also imported/defined through `src/app/globals.css`.

**`src/types/`:**
- Purpose: Define stable domain contracts shared by pages, services, hooks, and components.
- Contains: `auth.types.ts`, `database.types.ts`, `quiz.types.ts`, and `team.types.ts`.
- Key files: `src/types/quiz.types.ts`, `src/types/team.types.ts`, `src/types/auth.types.ts`.

**`public/`:**
- Purpose: Serve static assets without bundling.
- Contains: `public/images/`, including the authentication hero image referenced as `/images/hero-sherlock.jpg`.

**`.planning/codebase/`:**
- Purpose: Store GSD codebase analysis documents.
- Contains: `ARCHITECTURE.md` and `STRUCTURE.md` for this mapping run.
- Generated: Yes.
- Committed: Repository policy determines commit handling; the files are intended as project planning artifacts.

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root HTML/body, fonts, global providers, and metadata.
- `src/app/page.tsx`: Public home/landing route.
- `src/middleware.ts`: Request middleware entry delegating to Supabase session handling.
- `src/app/auth/callback/route.ts`: Auth verification callback endpoint.

**Configuration:**
- `package.json`: Next.js scripts and runtime/development dependencies.
- `next.config.ts`: `cacheComponents`, partial prefetching, and Turbopack CSS loader configuration.
- `tsconfig.json`: Strict TypeScript compiler settings and `@/*` → `src/*` path alias.
- `components.json`: shadcn component aliases and global CSS configuration.
- `eslint.config.mjs`: ESLint configuration.
- `.prettierrc`: Prettier configuration.
- `.env.example`: Documented public environment variable names; do not copy secret values into source files.

**Core Logic:**
- `src/lib/supabase/middleware.ts`: Session refresh, protected-path checks, email-domain validation, and profile onboarding redirect.
- `src/components/auth/auth-provider.tsx`: Browser auth subscription and session context.
- `src/hooks/use-quiz-state.ts`: Quiz phase, timer, answer, network, and localStorage persistence behavior.
- `src/api/auth.ts`: Email auth, verification resend, password reset, and sign-out operations.
- `src/api/client.ts`: Generic API URL resolution, bearer token attachment, mock mode, and response normalization.

**Testing:**
- No test directories or `*.test.*`/`*.spec.*` source files are present in the repository tree.
- Verification currently belongs to the project scripts in `package.json` (`npm run lint`, `npm run build`, and `npm run format:check`) rather than a detected automated test suite.

## Naming Conventions

**Files:**
- Route files follow Next.js conventions: `page.tsx`, `layout.tsx`, `route.ts`, `error.tsx`, and `not-found.tsx` under `src/app/`.
- General files use lowercase kebab-case, such as `use-quiz-state.ts`, `case-file-card.tsx`, and `password-strength.ts`.
- Type modules use descriptive suffixes such as `auth.types.ts`, `quiz.types.ts`, and `team.types.ts`.
- Component names are PascalCase exports even when filenames are kebab-case, for example `CaseFileCard` in `src/components/theme/case-file-card.tsx`.

**Directories:**
- Route groups use parenthesized names: `src/app/(app)/` and `src/app/(auth)/`.
- Components are grouped by responsibility: `src/components/auth/`, `src/components/dashboard/`, `src/components/quiz/`, `src/components/layout/`, `src/components/theme/`, and `src/components/ui/`.
- Framework/domain helpers are grouped under `src/lib/supabase/` and `src/lib/validators/`.

**Imports:**
- Prefer the `@/` alias for internal imports, as shown throughout `src/app/`, `src/api/`, and `src/components/`.
- Use `import type` for type-only dependencies, as in `src/api/team.ts` and `src/types/` consumers.
- Keep shared UI imports under `@/components/ui` and shared utilities under `@/lib`.

## Where to Add New Code

**New Feature:**
- Primary route code: Add a route folder/page under `src/app/(app)/` for protected features or `src/app/(auth)/` for authentication flows.
- Shared page shell: Update `src/app/(app)/layout.tsx` or `src/app/(auth)/layout.tsx` only when the behavior applies to the whole route group.
- Feature components: Add to the closest domain folder under `src/components/` (`quiz`, `team` if introduced, `dashboard`, or `auth`).
- Services and contracts: Add operations under `src/api/`, domain types under `src/types/`, and input schemas under `src/lib/validators/`.
- Tests: No established test location exists; introduce tests in a dedicated `tests/` or co-located `*.test.ts(x)` pattern only with an accompanying runner/config decision.

**New Component/Module:**
- Reusable visual primitives: `src/components/theme/` for product-specific themed primitives or `src/components/ui/` for generic shadcn-style controls.
- Feature-specific components: `src/components/<feature>/`.
- Stateful browser behavior: `src/hooks/`; keep browser API access behind a client component boundary.
- External integrations: `src/lib/<provider>/` for provider adapters and `src/api/` for feature-facing operations.

**Utilities:**
- Shared class composition/general helpers: `src/lib/utils.ts`.
- Motion variants: `src/lib/motion.ts`.
- Validation schemas: `src/lib/validators/<domain>.ts`.
- Static development fixtures: `src/lib/mock-data.ts` until a persistent backend source replaces them.

**New protected route:**
- Add the route below `src/app/(app)/`.
- Add its pathname prefix to `isProtectedPath` in `src/lib/supabase/middleware.ts`.
- Decide whether it requires the existing agency/profile onboarding check and document any exception beside the route.

## Special Directories

**`src/app/`:**
- Purpose: Next.js filesystem routing.
- Generated: Partially; route files and layouts are authored, while `.next/` is generated outside the source tree.
- Committed: Yes.

**`public/`:**
- Purpose: Runtime static assets.
- Generated: No.
- Committed: Yes.

**`.planning/`:**
- Purpose: GSD planning and codebase intelligence artifacts.
- Generated: Workflow-generated.
- Committed: Repository policy determines whether planning artifacts are committed; this mapping writes directly here.

**`.husky/`:**
- Purpose: Git hook automation initialized by the `prepare` script.
- Generated: Setup-managed.
- Committed: Yes when hook behavior is part of repository workflow.

---

*Structure analysis: 2026-10-26*
