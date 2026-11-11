import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when Supabase env vars are set. Otherwise the app runs on sample data. */
export const isLive = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/**
 * Server-side client using the public anon key with no user session. Used by
 * every public page and form. What it can read and write is decided by the
 * row-level-security policies in supabase/schema.sql.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isLive) return null;
  client ??= createClient(url!, anonKey!, { auth: { persistSession: false } });
  return client;
}

/**
 * Client carrying the signed-in user's session from cookies. Only the admin
 * area uses it. Create a new one per request; never share it.
 */
export async function getAuthClient(): Promise<SupabaseClient | null> {
  // Read cookies first, even in demo mode, so admin pages always render per
  // request instead of being frozen at build time.
  const cookieStore = await cookies();
  if (!isLive) return null;
  return createServerClient(url!, anonKey!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(toSet) {
        try {
          for (const { name, value, options } of toSet) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read-only. The
          // proxy refreshes the session on admin requests, so this is safe.
        }
      },
    },
  });
}
