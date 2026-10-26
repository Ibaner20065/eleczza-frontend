# Codebase Concerns

**Analysis Date:** 2026-10-26

## Tech Debt

**Mock services are the active application data layer:**
- Issue: The user-facing dashboard, team, lobby, quiz, and leaderboard screens read from static objects in `src/lib/mock-data.ts`. The typed services in `src/api/team.ts` and `src/api/quiz.ts` return hard-coded data, and no caller uses `apiRequest` from `src/api/client.ts`.
- Files: `src/lib/mock-data.ts`, `src/api/team.ts`, `src/api/quiz.ts`, `src/api/client.ts`, `src/app/(app)/dashboard/page.tsx`, `src/app/(app)/team/page.tsx`, `src/app/(app)/quiz/lobby/page.tsx`, `src/app/(app)/leaderboard/page.tsx`
- Impact: Accounts can authenticate, but team membership, quiz progress, scoring, and rankings are not persisted or shared with a backend. Different users will see the same roster and results, and core event behavior cannot be trusted in production.
- Fix approach: Connect each page to the typed API layer, implement the Express/Supabase-backed endpoints, model loading/error/empty states, and remove mock data from production code behind an explicit development fixture switch.

**Feature handlers only update local UI state:**
- Issue: Team creation and joining display success toasts without calling `createAgency` or `joinAgency`; kicking members, changing roles, and readiness changes only mutate React state. Quiz submission logs the form data and resets the form instead of calling `submitDeduction`.
- Files: `src/app/(app)/team/page.tsx`, `src/app/(app)/quiz/page.tsx`, `src/api/team.ts`, `src/api/quiz.ts`
- Impact: The UI reports successful operations that are lost on refresh and can disagree between clients. The quiz has no authoritative validation, attempt count, penalty calculation, or result recording.
- Fix approach: Make handlers await server mutations, disable controls while requests are pending, surface API failures, and refresh or update state from the server response.

**No project verification dependencies are installed in the working tree:**
- Issue: `npm run lint` and `npm run build` both fail before executing because `eslint` and `next` are not available in `node_modules`; the repository has `package-lock.json` but no installed dependency tree in the scanned workspace.
- Files: `package.json`, `package-lock.json`, `eslint.config.mjs`
- Impact: Type, lint, and production-build regressions cannot be detected locally or in an environment that does not run dependency installation first.
- Fix approach: Ensure CI runs `npm ci` before `npm run lint` and `npm run build`, document the required Node/npm versions, and add a CI status check for both commands.

## Known Bugs

**Event status and dates are stale relative to the current application date:**
- Symptoms: The dashboard event starts at `2026-10-26T10:00:00+05:30` and ends at 13:00 while the analysis date is 2026-10-26; `MOCK_CASE` still declares `isLive: true`. `getActiveCases` uses 2026-10-25 timestamps and also returns `isLive: true`.
- Files: `src/lib/mock-data.ts`, `src/api/quiz.ts`, `src/app/(app)/dashboard/page.tsx`, `src/components/dashboard/dashboard-countdown.tsx`
- Trigger: Open the dashboard or quiz after the configured event window.
- Workaround: None in the application; update fixtures manually.

**Leaderboard polling produces non-authoritative, accumulating scores:**
- Symptoms: Every refresh adds a random value between -10 and 19 to each score and then reuses that mutated score on the next refresh. The displayed rank and score therefore drift without any server event.
- Files: `src/hooks/use-leaderboard-poll.ts`
- Trigger: Use a screen that calls `useLeaderboardPoll` for longer than one polling interval.
- Workaround: Refresh the page to reset to `MOCK_LEADERBOARD`.

**Quiz persistence can restore inconsistent state:**
- Symptoms: `useQuizState` persists only `answers`, `currentIndex`, and `phase`, but restores answers and index without restoring the phase, timer, lock state, or case metadata. A saved state is also accepted without checking that the records belong to the requested case.
- Files: `src/hooks/use-quiz-state.ts`
- Trigger: Leave a quiz after answering, reload it, or reuse the same browser for another case.
- Workaround: Clear the `eleczza_quiz_state_<caseId>` local-storage entry.

## Security Considerations

**Client-side quiz answers and scoring are authoritative in the mock flow:**
- Risk: `useQuizState` marks the first option as correct and calculates points in the browser. A user can edit local storage or client state and submit manipulated answers or scores once a backend is connected without server-side enforcement.
- Files: `src/hooks/use-quiz-state.ts`, `src/lib/mock-data.ts`, `src/api/quiz.ts`
- Current mitigation: `deductionSubmissionSchema` validates UUID-shaped case and question IDs, but it does not validate correctness, ownership, attempt limits, or score.
- Recommendations: Keep answer keys and scoring rules server-side, validate case/team/session ownership on every mutation, enforce attempt and time limits atomically, and return computed results rather than accepting client scores.

**Missing Supabase configuration fails open in middleware:**
- Risk: `updateSession` returns an unmodified response when the public Supabase URL or anon key is absent. In a misconfigured deployment, protected routes are not redirected and can be served without authentication checks.
- Files: `src/lib/supabase/middleware.ts`, `src/middleware.ts`, `.env.example`
- Current mitigation: The behavior is convenient for offline development, and normal configured requests call `supabase.auth.getUser()`.
- Recommendations: Fail closed outside an explicit development mode, validate required configuration during startup/build, and add a deployment smoke test that requests a protected route without a session.

**Sensitive gameplay state is stored in browser local storage:**
- Risk: Answer selections and correctness flags are written to `localStorage`, which is readable by any script running in the origin and can be modified by the user. It is not suitable for trusted state or sensitive competition data.
- Files: `src/hooks/use-quiz-state.ts`
- Current mitigation: The stored object is parsed and basic answer field types are checked.
- Recommendations: Store only a resumable client hint, keep authoritative progress server-side, scope records to authenticated user/team and case, and handle storage errors without breaking the quiz.

**Backend error text is exposed to callers:**
- Risk: `apiRequest` returns `Error.message` directly for network failures and forwards `error`, `message`, or `details` strings from non-2xx responses. UI code can display backend internals or operational details to end users.
- Files: `src/api/client.ts`
- Current mitigation: JSON parsing is guarded and a generic fallback exists for unknown payloads.
- Recommendations: Log detailed errors only in protected server-side telemetry, map responses to stable user-safe error codes/messages, and avoid returning raw upstream details.

## Performance Bottlenecks

**Authenticated navigation performs a Supabase profile query on every protected request:**
- Problem: Middleware calls `auth.getUser()` and then selects `id, agency_id` from `profiles` for every request under `/dashboard`, `/team`, `/quiz`, and `/leaderboard`, including navigations and non-static requests.
- Files: `src/lib/supabase/middleware.ts`, `src/middleware.ts`
- Cause: Onboarding authorization is implemented in request middleware with no cache or claim-based shortcut.
- Improvement path: Keep token validation in middleware, cache or embed the minimal onboarding claim where safe, and perform profile loading in protected layouts/server handlers when a fresh check is required. Measure latency before and after.

**Client timers can outlive the component that created them:**
- Problem: Quiz submission schedules nested timeouts after an awaited delay; those timeouts are not stored or cancelled during unmount. A callback can update state after navigation and retain component state longer than needed.
- Files: `src/hooks/use-quiz-state.ts`
- Cause: Only the interval used for the countdown has an effect cleanup; the delayed submission and transition timers are unmanaged.
- Improvement path: Track all timeout handles in refs, cancel them in cleanup, and use an abort/request-id guard before applying async results.

## Fragile Areas

**Authentication route and middleware contract:**
- Files: `src/lib/supabase/middleware.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `src/app/auth/callback/route.ts`, `src/hooks/use-auth.ts`
- Why fragile: Access control, onboarding redirects, cookie propagation, and email-domain policy are spread across middleware, server clients, and browser state. The middleware also swallows Supabase errors and continues with a possibly unauthenticated `user`.
- Safe modification: Test every protected and auth route with missing, valid, expired, and wrong-domain sessions; preserve cookie propagation on redirects; keep service-role credentials out of client modules; and distinguish development fallback from production failure.
- Test coverage: No test files or test runner configuration were detected in the repository.

**Team screen assumes a fixed leader and shared mock roster:**
- Files: `src/app/(app)/team/page.tsx`, `src/lib/mock-data.ts`
- Why fragile: `isLeader` is hard-coded to `true`, member emails and IDs are fixture values, and all mutations are local. Any backend integration must replace both authorization and state ownership rather than merely adding fetch calls.
- Safe modification: Derive the current user from `useUser`, authorize mutations on the server, load the roster by authenticated agency, and handle empty/teamless states before retaining the current controls.
- Test coverage: No component or integration tests were detected.

**Quiz flow uses incompatible fixture contracts:**
- Files: `src/hooks/use-quiz-state.ts`, `src/lib/mock-data.ts`, `src/api/quiz.ts`, `src/app/(app)/quiz/page.tsx`
- Why fragile: The hook expects `MOCK_QUESTIONS` IDs such as `q1`, while the page submits UUID-shaped default IDs and the API fixture returns a separate case with no questions. The page also uses a separate deduction form rather than the hook's answer flow.
- Safe modification: Define one case/question contract, use the server-provided IDs throughout, and cover lobby-to-question-to-result transitions with integration tests before removing fixtures.
- Test coverage: No automated coverage was found for the quiz state machine, local-storage resume behavior, or submission failure paths.

## Scaling Limits

**In-memory/mock leaderboard and roster:**
- Current capacity: One browser-local copy of a seven-entry leaderboard and a four-member fixture roster.
- Limit: State is not shared across users, processes, or deployments; score updates are random and local.
- Scaling path: Persist event, team, membership, answer, score, and leaderboard records in Supabase/Postgres, add server-side aggregation/indexes, and use polling or realtime subscriptions against authoritative rows.

## Dependencies at Risk

**Framework and dependency versions are unusually forward-moving:**
- Risk: `next@16.4.3`, `react@19.3.0`, `react-dom@19.3.0`, Tailwind 4, and `zod@4.6.7` increase compatibility and migration risk for an application with no automated test suite.
- Impact: Framework/API changes can break middleware, cache behavior, form resolvers, or styling without a fast regression signal.
- Migration plan: Pin and regularly audit versions, run `npm ci` plus lint/build in CI, add auth/team/quiz integration tests, and upgrade one ecosystem boundary at a time.

## Missing Critical Features

**Authoritative event and competition backend:**
- Problem: There is no implemented persistence for cases, questions, submissions, attempts, hints, scores, team membership, or leaderboard updates.
- Blocks: Reliable multi-user competition, anti-cheating controls, reconnect behavior, auditability, and production ranking.

**Operational failure handling:**
- Problem: The app has no detected error tracking integration, API retry policy, offline submission queue, or user-visible recovery path for failed clipboard, profile, or mutation requests.
- Blocks: Diagnosing production failures and safely recovering from transient connectivity loss during a timed quiz.

## Test Coverage Gaps

**Authentication and authorization:**
- What's not tested: Cookie refresh, callback code/token-hash exchange, wrong-domain rejection, missing configuration, onboarding redirects, and protected-route behavior.
- Files: `src/lib/supabase/middleware.ts`, `src/app/auth/callback/route.ts`, `src/hooks/use-auth.ts`
- Risk: A redirect or fail-open change can expose protected screens or strand users during signup/recovery.
- Priority: High

**Core quiz and scoring flow:**
- What's not tested: Timer expiry, duplicate submissions, unmount during submission, reconnect restoration, attempt penalties, server errors, and result calculation.
- Files: `src/hooks/use-quiz-state.ts`, `src/api/quiz.ts`, `src/app/(app)/quiz/page.tsx`
- Risk: Competition outcomes can be incorrect or exploitable without visible failures.
- Priority: High

**Team mutations and leaderboard integrity:**
- What's not tested: Concurrent joins/kicks/role changes, authorization by role, passcode handling, ready-state synchronization, and stable ranking updates.
- Files: `src/app/(app)/team/page.tsx`, `src/api/team.ts`, `src/hooks/use-leaderboard-poll.ts`
- Risk: Teams can be corrupted or rankings can diverge between clients once real data is introduced.
- Priority: Medium

**Build and static quality gates:**
- What's not tested: TypeScript compilation, ESLint, production build, and dependency installation in the current workspace.
- Files: `package.json`, `eslint.config.mjs`, `tsconfig.json`
- Risk: Basic regressions are currently unverified; `npm run lint` and `npm run build` cannot run until dependencies are installed.
- Priority: High

---

*Concerns audit: 2026-10-26*
