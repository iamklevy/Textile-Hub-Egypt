# Textile Hub Egypt (working name)

A trilingual (English / Arabic / Chinese) hub for Egypt's textile and garment industry:

| Section | URL | What it does |
|---|---|---|
| Factory directory | `/en/directory` | Search Egyptian textile companies by keyword, category and location; contact form on each company |
| Jobs | `/en/jobs` | Skilled textile roles; apply form on each job |
| Used machinery | `/en/machinery` | Machines for sale with brand, year, condition, price in EGP |
| For Chinese investors | `/zh/investors` | Request form for Chinese manufacturers setting up in Egypt |
| Add a listing | `/en/directory/new`, `/en/jobs/new`, `/en/machinery/new` | Anyone can submit; nothing is public until you approve it |

Swap `en` for `ar` or `zh` in any URL. Arabic renders right-to-left.

Built with Next.js 16 (App Router), Tailwind CSS 4 and Supabase (Postgres).

## 1. Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. With no Supabase keys the site runs in **demo mode**:
it shows fictional sample listings and forms answer but save nothing.

## 2. Connect Supabase (go live)

1. Create a free project at https://supabase.com.
2. In the dashboard open **SQL Editor**, paste the contents of `supabase/schema.sql`, and run it.
3. Optional: run `supabase/seed.sql` too if you want the sample listings in your database.
4. Copy `.env.example` to `.env.local` and fill in the two values from
   **Project Settings > API** (Project URL and the `anon` public key).
5. Restart `npm run dev`. The demo banner disappears.

## 3. Approve listings and read messages

There is no admin screen yet. Use the Supabase **Table Editor**:

- New companies, jobs and machines arrive with `status = pending`. Change it to
  `approved` to publish, or `rejected` to hide.
- Tick `verified` on a company after you have checked it (site visit, commercial
  register). It then shows the "Verified" badge.
- Messages from visitors land in the `inquiries` table. `kind = investor` rows are
  requests from the Chinese-investor form. Tick `handled` when you have replied.

## 4. Put it online (Vercel)

1. Push this folder to a GitHub repository.
2. Import the repository at https://vercel.com/new.
3. Add the two `NEXT_PUBLIC_SUPABASE_*` environment variables, then deploy.

## Where things are

```
src/app/[lang]/          pages (home, directory, jobs, machinery, investors)
src/app/actions.ts       form submissions (server actions)
src/components/          header/footer, cards, filter bar, forms
src/dictionaries/        all interface text: en.ts, ar.ts, zh.ts
src/lib/options.ts       categories, cities, roles (keys stored in the database)
src/lib/data.ts          database queries (falls back to demo data)
src/lib/demo-data.ts     the fictional sample listings
src/proxy.ts             sends visitors to /en, /ar or /zh by browser language
supabase/schema.sql      tables and security rules
```

- **Rename the site:** change `site.name` in the three dictionary files.
- **Add a city or category:** add the key in `src/lib/options.ts` and a label for
  it in each dictionary file.

## Known limits of this first version

- No user accounts: listers cannot edit their own listings; you edit them in Supabase.
- No photo uploads for machines or factories.
- No email or WhatsApp notification when an inquiry arrives; check the `inquiries` table.
- Spam protection is a hidden honeypot field only; add a CAPTCHA before promoting the site widely.
- Listing text is shown in the language it was written in; only the interface is translated.
- Contact details of approved listings are public.
