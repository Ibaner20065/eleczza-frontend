# ELECZZA 2.0 — Git Branching & Commit Conventions

To maintain a clean Scotland Yard ledger of all code revisions, all contributors must adhere to the following Git workflow standards:

---

## 1. Branch Strategy

Branches are created off `main` using structured prefixes:

| Branch Type        | Format                     | Example                        |
| :----------------- | :------------------------- | :----------------------------- |
| **Feature**        | `feat/<short-description>` | `feat/supabase-auth-gate`      |
| **Fix**            | `fix/<bug-description>`    | `fix/email-domain-regex`       |
| **Chore / Setup**  | `chore/<task-name>`        | `chore/husky-lint-staged`      |
| **Design / Theme** | `style/<theme-feature>`    | `style/victorian-fog-backdrop` |
| **Refactor**       | `refactor/<module>`        | `refactor/quiz-api-client`     |

### Branch Rules

- Branch names should be all lowercase with kebab-case hyphens.
- Keep branches short-lived and focused on a single phase or feature slice.

---

## 2. Commit Message Standards (Conventional Commits)

All commits must follow the format:

```
<type>(<scope>): <short imperative description>

[optional body describing the reasoning or context]
[optional footer reference e.g., Closes #12]
```

### Commit Types

- **`feat`**: A new feature (e.g., `feat(quiz): add pocket watch timer countdown`)
- **`fix`**: A bug fix (e.g., `fix(auth): correct case-sensitivity in email domain check`)
- **`docs`**: Documentation updates (e.g., `docs(brief): finalize Phase 0 design tokens`)
- **`style`**: Theme, CSS, formatting changes with zero logic alteration (e.g., `style(theme): adjust brass gold glow saturation`)
- **`refactor`**: Code changes that neither fix a bug nor add a feature (e.g., `refactor(supabase): extract SSR cookies handler`)
- **`chore`**: Tooling, packages, or config updates (e.g., `chore(scaffold): initialize shadcn and ESLint`)

### Commit Scopes

Recommended scopes:

- `auth`: Authentication, session cookies, domain restrictions
- `team`: Agency creation, member rosters, invite passcodes
- `quiz`: Clues, deduction submissions, hint requisitions
- `leaderboard`: Scoring telemetry, rankings, podium
- `theme`: Fonts, colors, animations, responsive layouts
- `api`: Typed service layers and database calls

---

## 3. Automated Pre-Commit Gates

With Husky and `lint-staged` configured in the repository:

1. Every commit automatically runs `eslint --fix` and `prettier --write` on staged TypeScript and styling files.
2. Commits with unresolved linting errors or compilation failures will be blocked until rectified.
