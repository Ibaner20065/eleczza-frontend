# Testing Patterns

**Analysis Date:** 2026-10-26

## Test Framework

**Runner:**
- No test runner is configured. `package.json` has no Jest, Vitest, Playwright, Cypress, or test script, and no test configuration file is present.
- The repository currently contains no `*.test.*` or `*.spec.*` files and no test directories outside ignored/generated locations.

**Assertion Library:**
- Not applicable; no assertion library is configured.

**Run Commands:**
```bash
npm run lint          # ESLint static analysis
npm run format:check  # Prettier formatting verification
npm run build         # Next.js production build and TypeScript/build validation
```

These are the available automated quality gates from `package.json`; there is no `npm test` command.

## Test File Organization

**Location:**
- Automated tests are not detected. Production code is organized under `src/`, with feature pages in `src/app/`, reusable components in `src/components/`, hooks in `src/hooks/`, API modules in `src/api/`, validators in `src/lib/validators/`, and domain types in `src/types/`.
- If tests are introduced, colocate unit/component tests beside the owning module or establish a clearly named `src/__tests__/` structure consistently; preserve the current domain grouping.

**Naming:**
- No test naming pattern exists in the repository. Use `<module>.test.ts` for non-UI logic and `<component>.test.tsx` for React components if a runner is added.

**Structure:**
```
src/
├── api/                 # API helpers to unit-test with mocked clients/fetch
├── components/          # Reusable UI component tests
├── hooks/               # Hook behavior tests
├── lib/validators/      # Pure schema validation tests
└── app/                 # Route/page integration or component tests
```

## Test Structure

**Suite Organization:**
```typescript
// No repository test example exists.
// For new tests, keep arrange/act/assert explicit and test public behavior:
describe("loginSchema", () => {
  it("rejects a non-college email", () => {
    const result = loginSchema.safeParse({
      email: "detective@example.com",
      password: "secret123",
    });

    expect(result.success).toBe(false);
  });
});
```

**Patterns:**
- There is no established setup or teardown pattern.
- Prefer testing exported behavior rather than implementation details: schemas such as `loginSchema` in `src/lib/validators/auth.ts`, pure data such as `passwordRequirements` in `src/lib/password-strength.ts`, and API result mapping in `src/api/client.ts` are natural unit boundaries.
- For React behavior, assert rendered states and user actions around public props and callbacks; avoid asserting Tailwind class ordering, which is formatter-managed.
- Use deterministic fixtures based on existing mock data in `src/lib/mock-data.ts` when tests need quiz or team entities.

## Mocking

**Framework:** No mocking framework is configured.

**Patterns:**
```typescript
// No repository mocking example exists.
// New API tests should isolate browser/network dependencies explicitly:
const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);
```

**What to Mock:**
- Mock `fetch`, Supabase client creation, browser storage, timers, and network status when testing `src/api/client.ts`, `src/api/auth.ts`, `src/lib/supabase/`, or `src/hooks/use-quiz-state.ts`.
- Mock external providers and browser APIs at the boundary, not the validator or pure transformation logic.
- For form tests, mock API functions such as `loginWithEmail` in `src/api/auth.ts` and drive the form through user-visible input and submit behavior.

**What NOT to Mock:**
- Do not mock Zod schemas, simple type guards, or pure utility functions when their real implementation is fast and deterministic.
- Do not mock the component under test or assert only that an internal setter was called; verify the resulting UI state.
- Do not rely on real Supabase credentials or environment secrets in tests. `.env.example` documents required configuration, but secret files must remain outside test fixtures.

## Fixtures and Factories

**Test Data:**
```typescript
// Existing deterministic application fixtures:
import { MOCK_QUESTIONS, MOCK_MY_TEAM } from "@/lib/mock-data";

// Use these as starting fixtures for quiz/team behavior tests.
```

**Location:**
- Existing mock fixtures are in `src/lib/mock-data.ts`; no dedicated test fixtures or factory modules are detected.
- Keep reusable test-only factories in a dedicated test support location if fixture complexity grows, rather than coupling unrelated tests to page modules.

## Coverage

**Requirements:** No coverage target, coverage script, or CI coverage gate is configured.

**View Coverage:**
```bash
# Not available until a test runner and coverage provider are added.
```

The current quality signal is static linting/formatting and the Next.js build. The Husky hook in `.husky/pre-commit` runs `npx lint-staged`, whose configuration in `.lintstagedrc.json` runs ESLint and Prettier on staged files.

## Test Types

**Unit Tests:**
- Not currently present. Prioritize pure validators in `src/lib/validators/`, helpers in `src/lib/`, and response/error normalization in `src/api/client.ts`.

**Integration Tests:**
- Not currently present. Appropriate seams include API modules with mocked Supabase/fetch clients (`src/api/`) and auth/session behavior around `src/hooks/use-auth.ts` and `src/lib/supabase/`.

**E2E Tests:**
- No E2E framework or tests are configured. Authentication redirects and quiz/team flows span browser state, Supabase, and route navigation, so they require an explicitly configured E2E environment before being automated.

## Common Patterns

**Async Testing:**
```typescript
// No repository example exists. Test async public behavior by awaiting it:
it("returns a normalized API error", async () => {
  const result = await apiRequest("/cases");
  expect(result.error).toBeDefined();
});
```

For timer and persistence-heavy behavior in `src/hooks/use-quiz-state.ts` and `src/hooks/use-timer.ts`, use fake timers and controlled storage/network mocks once a test runner is selected.

**Error Testing:**
```typescript
// No repository example exists. Cover both thrown provider errors and
// returned ApiResponse failures:
await expect(loginWithEmail(input)).rejects.toThrow();
expect(result).toMatchObject({ data: null, status: 401 });
```

Exercise user-facing error mapping in `src/app/(auth)/login/page.tsx`, schema error messages in `src/lib/validators/auth.ts`, malformed localStorage handling in `src/hooks/use-quiz-state.ts`, and the retry path in `src/app/error.tsx`.

---

*Testing analysis: 2026-10-26*
