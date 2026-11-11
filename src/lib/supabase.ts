import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when Supabase env vars are set. Otherwise the app runs on sample data. */
export const isLive = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/**
 * Server-side client using the public anon key. What it can read and write is
 * decided by the row-level-security policies in supabase/schema.sql.
 */
export function getSupabase(): SupabaseClient | null {
  if (!isLive) return null;
  client ??= createClient(url!, anonKey!, { auth: { persistSession: false } });
  return client;
}
