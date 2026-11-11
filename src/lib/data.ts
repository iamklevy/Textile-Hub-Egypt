import "server-only";
import { getSupabase } from "@/lib/supabase";
import { demoCompanies, demoJobs, demoMachines } from "@/lib/demo-data";
import type { Company, Filters, Job, Machine } from "@/lib/types";

type Table = "companies" | "jobs" | "machines";

const categoryColumn: Record<Table, string> = {
  companies: "category",
  jobs: "role",
  machines: "category",
};

const searchColumns: Record<Table, string[]> = {
  companies: ["name", "name_ar", "name_zh", "description", "capabilities"],
  jobs: ["title", "company_name", "description"],
  machines: ["title", "brand", "model", "description"],
};

const demo: Record<Table, Record<string, unknown>[]> = {
  companies: demoCompanies,
  jobs: demoJobs,
  machines: demoMachines,
};

// Characters that have special meaning inside a PostgREST `or` filter.
const cleanQuery = (q: string) => q.replace(/[,()%*\\]/g, " ").trim().slice(0, 80);

async function list<T>(table: Table, filters: Filters, limit?: number): Promise<T[]> {
  const q = filters.q ? cleanQuery(filters.q) : "";
  const supabase = getSupabase();

  if (!supabase) {
    let rows = demo[table];
    if (filters.category)
      rows = rows.filter((r) => r[categoryColumn[table]] === filters.category);
    if (filters.city) rows = rows.filter((r) => r.city === filters.city);
    if (q) {
      const needle = q.toLowerCase();
      rows = rows.filter((r) =>
        searchColumns[table].some((c) =>
          String(r[c] ?? "").toLowerCase().includes(needle),
        ),
      );
    }
    return (limit ? rows.slice(0, limit) : rows) as T[];
  }

  let query = supabase
    .from(table)
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (filters.category) query = query.eq(categoryColumn[table], filters.category);
  if (filters.city) query = query.eq("city", filters.city);
  if (q) query = query.or(searchColumns[table].map((c) => `${c}.ilike.%${q}%`).join(","));
  query = query.limit(limit ?? 100);

  const { data, error } = await query;
  if (error) {
    console.error(`[data] list ${table} failed:`, error.message);
    return [];
  }
  return (data ?? []) as T[];
}

async function getOne<T>(table: Table, id: string): Promise<T | null> {
  const supabase = getSupabase();
  if (!supabase) return (demo[table].find((r) => r.id === id) as T) ?? null;

  // Listing ids are UUIDs; reject anything else before querying.
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();
  if (error) {
    console.error(`[data] get ${table} failed:`, error.message);
    return null;
  }
  return (data as T) ?? null;
}

export const listCompanies = (f: Filters = {}, limit?: number) =>
  list<Company>("companies", f, limit);
export const listJobs = (f: Filters = {}, limit?: number) => list<Job>("jobs", f, limit);
export const listMachines = (f: Filters = {}, limit?: number) =>
  list<Machine>("machines", f, limit);

export const getCompany = (id: string) => getOne<Company>("companies", id);
export const getJob = (id: string) => getOne<Job>("jobs", id);
export const getMachine = (id: string) => getOne<Machine>("machines", id);
