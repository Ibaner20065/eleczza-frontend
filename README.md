This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase email authentication

Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN`, and `NEXT_PUBLIC_APP_URL` in your local
environment. In Supabase Auth, enable email confirmations and add the callback
URL for each environment to the redirect URL allow list, for example:

- `http://localhost:3000/auth/callback`
- `https://your-production-domain.example/auth/callback`

The callback exchanges signup-verification and password-recovery email links
for a session before sending the user to the relevant page.

The Express API wrapper uses `NEXT_PUBLIC_API_URL` and attaches the current
Supabase access token as a bearer token. For local mock responses, set
`NEXT_PUBLIC_MOCK_API=true` and pass a typed mock value as the third argument
to `apiRequest`; mock mode intentionally fails if a caller has no mock value.

## Event run-through

Set `NEXT_PUBLIC_MOCK_API=true` to use the persistent browser demo for event,
agency, quiz, and leaderboard data. Sign in with an eligible account, then:

1. Create an agency in **Agency** to run the complete solo demo, or join the
   demo agency with passcode `BSK221` to exercise the invite flow.
2. Mark every roster member ready. The Lead Inspector can then start the
   investigation.
3. Answer the three timed multiple-choice questions. Progress and queued
   answers are saved in browser storage; queued answers and real-API readiness
   changes sync when connectivity returns.
4. Review the case-closed report and the live leaderboard.

The demo stores event state under `eleczza.event-demo.v1` and a queued answer
under `eleczza.quiz-answer-draft.v1` in local storage. Clear both keys to start
a fresh run. Real API mode is selected when
`NEXT_PUBLIC_MOCK_API` is not `true` and expects the API base URL to serve these
authenticated JSON endpoints:

- `GET /events/active` → `EventInfo`
- `GET /events/active/readiness` → `{ "readyTeams": number, "totalTeams": number }`
- `GET /teams/me` → `DetectiveAgency` or `null`
- `POST /teams` and `POST /teams/join` → `DetectiveAgency`
- `PATCH /teams/me/ready` → updated `DetectiveAgency`
- `GET /quiz/session` and `POST /quiz/session/start` → `QuizProgress`
- `POST /quiz/answers` → `AnswerResult`
- `GET /events/leaderboard` → `LeaderboardEntry[]`

The canonical response and request shapes are defined in
`src/types/event.types.ts` and `src/types/team.types.ts`. Quiz answer requests
contain `submissionId`, `questionId`, and `optionIndex`; use `-1` for a timed-out
question with no selected answer. The API should treat `submissionId` as an
idempotency key so an answer queued offline cannot be scored twice after a lost
response. Mutations must return the updated typed resource; API errors are
surfaced to the user rather than replaced with demo data.
The API must also enforce team membership, the four-member limit, readiness,
and Lead Inspector authorization server-side; client-side controls are not an
authorization boundary.

## Verification

Run the validator and authentication-form tests with `npm test`. Run the
Playwright browser suite with `npm run test:e2e`; it targets installed Chrome
and Microsoft Edge channels. The auth navigation test needs no test account; account-neutral error handling
is covered by the form tests. The full mock quiz run uses an account configured with
`E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD` in the local test environment. Set
those values only for a dedicated test account, and do not commit them.

`npm run build` type-checks and builds the production app. `npm run bundle:check`
runs the same build with the integrated Next.js bundle analyzer and writes its
report under `.next/diagnostics/analyze`.

## Vercel deployment checklist

Configure these environment variable **names** in Vercel for the appropriate
environments:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_MOCK_API`

Use `false` for mock mode in production and set the production app URL for
`NEXT_PUBLIC_APP_URL`. Only public configuration belongs in `NEXT_PUBLIC_*`
variables. Do not put a Supabase service-role key, API signing key, database
password, or other server secret in a `NEXT_PUBLIC_*` variable or a browser
bundle. Supabase's anonymous key is public by design; protect data with Row
Level Security and server-side authorization.

Add the following callback patterns to the Supabase Auth redirect allow list
and keep the production entry exact:

- `http://localhost:3000/auth/callback`
- `https://<production-domain>/auth/callback`
- `https://*-<vercel-team-slug>.vercel.app/auth/callback` (preview deployments;
  replace the team slug with the Vercel deployment hostname pattern in use)

Ensure the callback's `next` destination remains an internal path. Verify
signup verification and password recovery using dedicated test accounts on
both the production domain and a preview deployment before launch.

### Staging load-test plan

Run load tests only against a staging deployment with seeded, disposable
accounts and isolated event data. Keep mock mode off if validating the real API;
disable outbound transactional email or use a test mail sink. Do not include
passwords, tokens, email addresses, or answer payloads in load-test logs.

1. Capture a 5-minute baseline at 10 virtual users against sign-in, dashboard,
   team roster, quiz session, answer submission, and leaderboard endpoints.
2. Ramp 25 → 50 → 100 → 200 concurrent users over 10 minutes, hold each level
   for 5 minutes, then ramp down. Exercise the 10-second leaderboard polling
   cadence and submit quiz answers with unique idempotency IDs.
3. Repeat with 20% of quiz clients briefly disconnected, then reconnect and
   verify queued answers are accepted exactly once and team state is retained.
4. Set acceptance targets before the run: API p95 under 500 ms for reads and
   under 800 ms for answer writes, HTTP 5xx below 1%, no duplicate scoring, and
   no lost team or answer state. Investigate throttling separately from
   application errors.
5. Save aggregate latency/error metrics and sanitized server logs; compare
   against baseline and check Supabase connection, rate-limit, and resource
   dashboards before increasing traffic.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
