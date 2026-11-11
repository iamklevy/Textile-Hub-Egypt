import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getAuthClient } from "@/lib/supabase";

export const listingTables = ["companies", "jobs", "machines"] as const;
export type ListingTable = (typeof listingTables)[number];
export const adminTabs = [...listingTables, "inquiries"] as const;
export type AdminTab = (typeof adminTabs)[number];
export const statuses = ["pending", "approved", "rejected"] as const;

export type AdminSession =
  | { state: "demo" }
  | { state: "signed-out" }
  | { state: "not-admin"; email: string }
  | { state: "ok"; email: string; supabase: SupabaseClient };

/**
 * Who is looking at the admin area. The database rules (is_admin() in
 * supabase/schema.sql) are the real gate; this check decides what to render
 * and stops server actions early.
 */
export async function getAdminSession(): Promise<AdminSession> {
  const supabase = await getAuthClient();
  if (!supabase) return { state: "demo" };

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { state: "signed-out" };
  const email = data.user.email ?? "";

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) return { state: "not-admin", email };
  return { state: "ok", email, supabase };
}

export const isUuid = (v: string) => /^[0-9a-f-]{36}$/i.test(v);
