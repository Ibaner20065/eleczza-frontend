# Technology Stack

**Analysis Date:** 2026-10-26

## Languages

**Primary:**
- TypeScript 5 - Application, API wrappers, typed Supabase models, validators, and configuration in `src/**/*.ts`, `src/**/*.tsx`, `next.config.ts`, and `eslint.config.mjs`.

**Secondary:**
- CSS - Tailwind CSS v4 utilities, theme variables, and component styling in `src/app/globals.css` and `src/styles/theme.css`.
- JSON - Package, TypeScript, shadcn, and tooling configuration in `package.json`, `tsconfig.json`, and `components.json`.

## Runtime

**Environment:**
- Node.js - Required by Next.js and the npm scripts; no `.nvmrc` or explicit Node version is present.

**Package Manager:**
- npm - Scripts and dependency installation are defined in `package.json`.
- Lockfile: present (`package-lock.json`).

## Frameworks

**Core:**
- Next.js 16.4.3 - App Router pages, layouts, route handler, middleware, image/font optimization, and production build in `src/app/`, `src/middleware.ts`, and `next.config.ts`.
- React 19.3.0 / React DOM 19.3.0 - Client components, providers, hooks, and rendered UI in `src/components/`, `src/hooks/`, and `src/app/`.
- TypeScript 5 - Strict type checking and typed application boundaries configured by `tsconfig.json`.

**Testing:**
- Not detected. `package.json` has no test runner or test script, and no test files are present in the scanned source tree.

**Build/Dev:**
- Tailwind CSS 4 with `@tailwindcss/turbopack` - Utility CSS and Turbopack CSS loading through `src/app/globals.css` and `next.config.ts`.
- Turbopack - Development/build CSS rule configured in `next.config.ts`.
- ESLint 9 with `eslint-config-next` 16.4.3 - Next.js core-web-vitals and TypeScript linting in `eslint.config.mjs`.
- Prettier 3.9.10 with `prettier-plugin-tailwindcss` - Formatting through `.prettierrc` and `package.json`.
- Husky 9.1.7 and lint-staged 17.6.0 - Git hook tooling configured by `.husky/` and `.lintstagedrc.json`.
- shadcn 4.22.1 - Component conventions and registry metadata in `components.json`, with local primitives in `src/components/ui/`.

## Key Dependencies

**Critical:**
- `@supabase/ssr` `^0.12.7` and `@supabase/supabase-js` `^2.118.0` - Browser/server Supabase clients, cookie-based SSR sessions, auth operations, and profile queries in `src/lib/supabase/` and `src/api/auth.ts`.
- `react-hook-form` `^7.91.0` and `zod` `^4.6.7` - Form state and schema validation in `src/app/(auth)/` and `src/lib/validators/`.
- `next` `16.4.3` - Full-stack web framework and runtime.

**Infrastructure:**
- `framer-motion` `^14.6.0` - Page, atmosphere, quiz, and reduced-motion animations in `src/components/` and `src/app/`.
- `lucide-react` `^1.61.0` - Interface icons throughout `src/components/` and `src/app/`.
- `sonner` `^2.0.8` - Toast notifications, wrapped by `src/components/ui/sonner.tsx`.
- `@base-ui/react` `^1.9.0` - Dialog primitive used by `src/components/ui/dialog.tsx`.
- `class-variance-authority` `^0.7.1`, `clsx` `^2.1.1`, `tailwind-merge` `^3.7.0`, `cn` `^0.5.0` - Class composition utilities in `src/components/ui/` and `src/lib/utils.ts`.
- `tw-animate-css` `^1.4.0` - Tailwind animation utilities imported by `src/app/globals.css`.

## Configuration

**Environment:**
- Public runtime configuration is documented in `.env.example`: Supabase URL/anon key, application URL, allowed email domain, Express API URL, and mock API toggle.
- `SUPABASE_SERVICE_ROLE_KEY` is documented for server-only administrative operations, but no current source usage was detected.
- Never expose secret values from local environment files; only variable names belong in project documentation.

**Build:**
- `next.config.ts` enables `cacheComponents`, `partialPrefetching`, and a Turbopack CSS loader for Tailwind.
- `tsconfig.json` enables strict mode, bundler module resolution, React JSX transform, incremental checking, and the `@/*` alias to `src/*`.
- `eslint.config.mjs` configures Next core-web-vitals and TypeScript rules.
- `.prettierrc` and `.prettierignore` define formatting behavior and exclusions.
- `components.json` configures shadcn with Tailwind CSS variables, `src/app/globals.css`, and `@/components`/`@/lib`/`@/hooks` aliases.

## Platform Requirements

**Development:**
- Node.js with npm and a browser.
- Optional Supabase project credentials for live authentication and profile/session middleware.
- Optional Express-compatible API at `NEXT_PUBLIC_API_URL`; local mock mode is available through `NEXT_PUBLIC_MOCK_API`.

**Production:**
- A Next.js-compatible Node hosting target. The README documents Vercel as the intended/easiest deployment target.
- Production Supabase redirect URLs must include `/auth/callback`, as described in `README.md`.

---

*Stack analysis: 2026-10-26*
