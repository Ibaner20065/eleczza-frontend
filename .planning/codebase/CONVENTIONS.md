# Coding Conventions

**Analysis Date:** 2026-10-26

## Naming Patterns

**Files:**
- Use lowercase kebab-case for TypeScript and TSX files, for example `src/components/auth/auth-card.tsx`, `src/hooks/use-quiz-state.ts`, and `src/lib/password-strength.ts`.
- Next.js route files use the framework names `page.tsx`, `layout.tsx`, `template.tsx`, `error.tsx`, `not-found.tsx`, and `route.ts` under `src/app/`.
- Type declaration files use a domain suffix such as `src/types/auth.types.ts` and `src/types/quiz.types.ts`.

**Functions:**
- Use camelCase for functions and handlers: `loginWithEmail`, `getAuthCallbackUrl`, `onSubmit`, `copyPasscode`, and `markTeamReady` in `src/api/auth.ts`, `src/app/(auth)/login/page.tsx`, and `src/app/(app)/team/page.tsx`.
- React components and page exports use PascalCase: `AuthCard`, `ErrorPage`, `LoginPage`, and `TeamPage`.
- Custom hooks use the `use` prefix and camelCase, such as `useAuth`, `useQuizState`, and `useTimer` in `src/hooks/`.
- Boolean state and predicates use `is`, `has`, or action-oriented names such as `isLocked`, `isOnline`, `isAllowedDomain`, `allReady`, and `isRateLimitError`.

**Variables:**
- Use camelCase for local variables and state setters, including `currentIndex`, `formError`, `resendCooldown`, `setCurrentIndex`, and `setFormError`.
- Use `SCREAMING_SNAKE_CASE` for module constants representing fixed data or storage keys, including `STATE_KEY` and `MOCK_QUESTIONS` in `src/hooks/use-quiz-state.ts` and `src/lib/mock-data.ts`.
- Use PascalCase for enum-like object keys and discriminated string values where the domain model requires it, such as `LEAD_INSPECTOR`, `CRYPTANALYST`, and `FIELD_AGENT` in `src/types/team.types.ts`.

**Types:**
- Use PascalCase for interfaces, type aliases, and inferred input types: `ApiResponse<T>`, `AuthContextValue`, `AnswerRecord`, `LoginInput`, and `TeamRole`.
- Prefer `interface` for object-shaped public/component props and context contracts; use `type` for unions, inferred Zod inputs, and simple aliases.
- Keep domain types in `src/types/`, validator schemas and their inferred input types together in `src/lib/validators/`, and component props adjacent to the component implementation.

## Code Style

**Formatting:**
- Prettier is the formatter (`prettier` in `package.json`) and uses the repository configuration in `.prettierrc`; the repository uses double quotes, semicolons, trailing commas, and a print width of 80.
- `prettier-plugin-tailwindcss` is configured, so Tailwind utility classes should be left for the formatter to order.
- Run `npm run format:check` to verify formatting or `npm run format` to rewrite files. Staged TypeScript, TSX, JSON, Markdown, and stylesheet files are formatted automatically by `.lintstagedrc.json`.

**Linting:**
- ESLint 9 uses the flat configuration in `eslint.config.mjs`, combining `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- Next build artifacts are ignored through the ESLint config (`.next/**`, `out/**`, `build/**`, and `next-env.d.ts`).
- Run `npm run lint`; staged JavaScript and TypeScript files run `eslint --fix` through `.lintstagedrc.json`.
- TypeScript is strict (`strict: true`) with `noEmit: true` in `tsconfig.json`; preserve explicit types at API and validation boundaries.

## Import Organization

**Order:**
1. React and framework imports, such as `react`, `next/link`, and `next/navigation`.
2. Third-party libraries, such as `react-hook-form`, `zod`, `lucide-react`, `sonner`, and `framer-motion`.
3. Internal absolute imports using the `@/` alias, grouped by API, components, hooks, libraries, and types as appropriate.
4. Type-only imports are written with `import type` when the symbol is used only for typing.

Examples appear in `src/app/(auth)/login/page.tsx`, `src/app/(app)/team/page.tsx`, and `src/components/ui/button.tsx`.

**Path Aliases:**
- Use `@/*` for absolute imports from `src/*`, as configured in `tsconfig.json`.
- Prefer `@/components/...`, `@/lib/...`, `@/hooks/...`, `@/api/...`, and `@/types/...` over long relative paths.
- `src/lib/utils.ts` is the small shared utility module and re-exports `cn`; do not create a new relative utility import when an existing alias is available.

## Error Handling

**Patterns:**
- API functions using Supabase throw provider errors after checking the returned `{ data, error }` result, as in `src/api/auth.ts` and `src/hooks/use-auth.ts`. UI callers catch those errors and translate them into user-facing messages.
- The generic API wrapper returns a typed result instead of throwing for HTTP, session, parsing, and network failures: `ApiResponse<T>` in `src/api/client.ts` carries `data`, `error`, and `status`.
- Use `unknown` in catch boundaries and narrow with `instanceof Error` or a typed property check. `errorDetails` in `src/app/(auth)/login/page.tsx` is the clearest example.
- Zod schemas in `src/lib/validators/` perform input validation at form boundaries; forms use `zodResolver` and render field messages through React Hook Form.
- Preserve safe fallback behavior for malformed external or persisted data. `src/hooks/use-quiz-state.ts` validates parsed localStorage records with `isRecord` and `isAnswerRecord` and ignores malformed state.
- Route-level rendering failures use the Next.js error boundary in `src/app/error.tsx`, which logs the error and exposes retry/navigation actions.

## Logging

**Framework:** `console`

**Patterns:**
- Log authentication initialization failures in `src/hooks/use-auth.ts` with `console.error`.
- Log middleware failures and warnings in `src/lib/supabase/middleware.ts` with `console.error` and `console.warn`.
- The route error boundary logs the captured error in `src/app/error.tsx`; the quiz page currently logs mock submission activity with `console.log` in `src/app/(app)/quiz/page.tsx`.
- Avoid logging credentials, access tokens, or sensitive form values. User-facing errors should be generic where provider messages could reveal account state; `src/app/(auth)/login/page.tsx` maps errors to safe messages.

## Comments

**When to Comment:**
- Comments explain non-obvious browser lifecycle, persistence, mock, or framework behavior, such as the localStorage/reconnect notes in `src/hooks/use-quiz-state.ts` and the error-boundary sections in `src/app/error.tsx`.
- JSX comments label major visual sections in larger pages such as `src/app/(app)/team/page.tsx`; use comments for structure or rationale, not for restating obvious markup.
- Mark intentionally temporary/mock behavior explicitly, for example `// mock: current user is leader` in `src/app/(app)/team/page.tsx`.

**JSDoc/TSDoc:**
- Formal JSDoc/TSDoc is not detected in `src/`; use clear names, interfaces, and focused comments for public or non-obvious behavior instead.

## Function Design

**Size:** Keep helpers focused and colocate small domain helpers with the consuming module. Examples include `getErrorMessage` and `getApiUrl` in `src/api/client.ts`, and `isRecord`/`isAnswerRecord` in `src/hooks/use-quiz-state.ts`. Larger page components own page-specific orchestration and form rendering.

**Parameters:** Prefer typed object inputs for related form data (`LoginInput`, `SignupInput`, and `ForgotPasswordInput`) and primitive parameters for single values such as `signOut()`, `copyPasscode()`, or `getActiveCases()`. Use generics at reusable API boundaries (`apiRequest<T>`).

**Return Values:** Return explicit domain values from API helpers and hooks. `src/api/client.ts` consistently returns `Promise<ApiResponse<T>>`; hooks return an object containing state and actions. Async Supabase operations return provider data or throw after an error check.

## Module Design

**Exports:** Use named exports for reusable APIs, hooks, validators, types, and UI components. Next.js route modules use the required default export for page/layout/error components, as in `src/app/page.tsx` and `src/app/error.tsx`.

**Barrel Files:** Broad barrel files are not detected. Import directly from the owning module, such as `@/lib/validators/auth` or `@/components/ui/button`. Small intentional re-exports are used in `src/lib/utils.ts`.

---

*Convention analysis: 2026-10-26*
