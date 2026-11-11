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

1. Create a free project at https://supabase.com (region: Frankfurt `eu-central-1`
   is closest to Egypt). Save the database password somewhere safe.
2. Open **SQL Editor > New query**, paste all of `supabase/schema.sql`, and click
   **Run**. This creates the tables, the security rules, the admin setup and the
   `machine-photos` storage bucket. It is safe to run again after updates.
3. Optional: run `supabase/seed.sql` the same way to load the sample listings.
4. Open **Project Settings > API Keys** and copy the Project URL and the public
   key (the `anon` key, or the newer `sb_publishable_...` key; both work).
5. Copy `.env.example` to `.env.local` and paste the two values in.
6. Restart `npm run dev`. The demo banner disappears.

## 3. Create your admin account

1. In Supabase open **Authentication > Users > Add user > Create new user**.
   Enter your email and a strong password and tick **Auto Confirm User**.
2. In **SQL Editor**, run (with your email):

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

3. Recommended: **Authentication > Sign In / Providers > Email**, turn off
   **Allow new users to sign up**. Only accounts you create can then sign in.
4. Go to `/en/admin` (or `/ar/admin`, `/zh/admin`) and sign in.

The admin page has four tabs:

- **Companies, Jobs, Machinery:** new submissions wait under *Pending*. Approve
  to publish, Reject to hide, or move back to pending. Mark a company
  *Verified* after you have checked it (site visit, commercial register).
- **Messages:** contact requests, job applications, machine inquiries and
  Chinese-investor requests. Mark each one handled after you reply.

The admin link is not shown on the public site; bookmark it.

## 4. Put it online (Vercel)

1. Sign in at https://vercel.com with your GitHub account.
2. **Add New > Project**, import the `Textile-Hub-Egypt` repository.
3. Under **Environment Variables** add `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the same values as `.env.local`.
4. Click **Deploy**. Every later `git push` to `main` redeploys automatically.
5. In Supabase, **Authentication > URL Configuration**, set **Site URL** to your
   Vercel address (for example `https://textile-hub-egypt.vercel.app`).

## Where things are

```
src/app/[lang]/          pages (home, directory, jobs, machinery, investors)
src/app/actions.ts       form submissions (server actions)
src/app/admin-actions.ts sign-in and moderation (approve, reject, verify)
src/app/[lang]/admin/    the admin page and its sign-in page
src/components/          header/footer, cards, filter bar, forms
src/dictionaries/        all interface text: en.ts, ar.ts, zh.ts
src/lib/options.ts       categories, cities, roles (keys stored in the database)
src/lib/data.ts          database queries (falls back to demo data)
src/lib/demo-data.ts     the fictional sample listings
src/proxy.ts             sends visitors to /en, /ar or /zh; refreshes admin sessions
src/lib/photos.ts        machine photo limits and URLs
supabase/schema.sql      tables and security rules
```

- **Rename the site:** change `site.name` in the three dictionary files.
- **Add a city or category:** add the key in `src/lib/options.ts` and a label for
  it in each dictionary file.

## Known limits of this first version

- No user accounts for listers: they cannot edit their own listings; you edit
  them in the Supabase Table Editor.
- Photos only for machinery (up to 6), not for companies. Photos of rejected
  listings stay in storage; delete them in Supabase > Storage if needed.
- No email or WhatsApp notification when an inquiry arrives; check the `inquiries` table.
- Spam protection is a hidden honeypot field only; add a CAPTCHA before promoting the site widely.
- Listing text is shown in the language it was written in; only the interface is translated.
- Contact details of approved listings are public.
