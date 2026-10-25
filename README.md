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
