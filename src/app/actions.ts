"use server";

import { getSupabase } from "@/lib/supabase";
import { getDict, hasLocale, defaultLocale } from "@/lib/i18n";
import {
  cities,
  companyCategories,
  investorInterests,
  jobRoles,
  jobTypes,
  machineCategories,
  machineConditions,
  openToOptions,
} from "@/lib/options";
import type { FormState } from "@/lib/types";

const text = (fd: FormData, key: string, max = 2000) => {
  const v = String(fd.get(key) ?? "").trim().slice(0, max);
  return v === "" ? null : v;
};

const int = (fd: FormData, key: string) => {
  const v = text(fd, key, 12);
  if (v === null) return null;
  const n = Number.parseInt(v.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
};

const oneOf = (fd: FormData, key: string, allowed: readonly string[]) => {
  const v = text(fd, key, 60);
  return v && allowed.includes(v) ? v : null;
};

const dictFor = (fd: FormData) => {
  const l = String(fd.get("locale") ?? "");
  return getDict(hasLocale(l) ? l : defaultLocale);
};

// Hidden field real visitors never fill in; bots usually do.
const isBot = (fd: FormData) => Boolean(text(fd, "company_website_url"));

async function insert(
  table: string,
  row: Record<string, unknown>,
  fd: FormData,
  successKey: "listingSaved" | "inquirySaved",
): Promise<FormState> {
  const t = dictFor(fd).form;
  if (isBot(fd)) return { ok: true, message: t[successKey] };

  const supabase = getSupabase();
  if (!supabase) return { ok: true, message: t.demoSaved };

  const { error } = await supabase.from(table).insert(row);
  if (error) {
    console.error(`[actions] insert into ${table} failed:`, error.message);
    return { ok: false, message: t.error };
  }
  return { ok: true, message: t[successKey] };
}

export async function submitCompany(_prev: FormState, fd: FormData): Promise<FormState> {
  const row = {
    name: text(fd, "name", 160),
    name_ar: text(fd, "name_ar", 160),
    name_zh: text(fd, "name_zh", 160),
    category: oneOf(fd, "category", companyCategories),
    city: oneOf(fd, "city", cities),
    description: text(fd, "description"),
    capabilities: text(fd, "capabilities"),
    employees: int(fd, "employees"),
    min_order: text(fd, "min_order", 160),
    certifications: text(fd, "certifications", 300),
    export_markets: text(fd, "export_markets", 300),
    open_to: fd
      .getAll("open_to")
      .map(String)
      .filter((v) => (openToOptions as readonly string[]).includes(v)),
    contact_name: text(fd, "contact_name", 160),
    phone: text(fd, "phone", 40),
    whatsapp: text(fd, "whatsapp", 40),
    email: text(fd, "email", 160),
    website: text(fd, "website", 200),
  };
  if (!row.name || !row.category || !row.city || !row.phone)
    return { ok: false, message: dictFor(fd).form.required };
  return insert("companies", row, fd, "listingSaved");
}

export async function submitJob(_prev: FormState, fd: FormData): Promise<FormState> {
  const row = {
    title: text(fd, "title", 160),
    company_name: text(fd, "company_name", 160),
    role: oneOf(fd, "role", jobRoles),
    city: oneOf(fd, "city", cities),
    job_type: oneOf(fd, "job_type", jobTypes) ?? "full_time",
    salary_min: int(fd, "salary_min"),
    salary_max: int(fd, "salary_max"),
    languages: text(fd, "languages", 160),
    description: text(fd, "description"),
    phone: text(fd, "phone", 40),
    email: text(fd, "email", 160),
  };
  if (!row.title || !row.company_name || !row.role || !row.city || !(row.phone || row.email))
    return { ok: false, message: dictFor(fd).form.required };
  return insert("jobs", row, fd, "listingSaved");
}

export async function submitMachine(_prev: FormState, fd: FormData): Promise<FormState> {
  const row = {
    title: text(fd, "title", 160),
    category: oneOf(fd, "category", machineCategories),
    brand: text(fd, "brand", 80),
    model: text(fd, "model", 80),
    year: int(fd, "year"),
    condition: oneOf(fd, "condition", machineConditions),
    price_egp: int(fd, "price_egp"),
    negotiable: fd.get("negotiable") === "on",
    city: oneOf(fd, "city", cities),
    description: text(fd, "description"),
    seller_name: text(fd, "seller_name", 160),
    phone: text(fd, "phone", 40),
    email: text(fd, "email", 160),
  };
  if (!row.title || !row.category || !row.condition || !row.city || !row.phone)
    return { ok: false, message: dictFor(fd).form.required };
  return insert("machines", row, fd, "listingSaved");
}

export async function submitInquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  const kind = oneOf(fd, "kind", ["company", "job", "machine", "investor"]);
  const row = {
    kind,
    target_id: text(fd, "target_id", 60),
    target_label: text(fd, "target_label", 200),
    name: text(fd, "name", 160),
    company: text(fd, "company", 160),
    phone: text(fd, "phone", 40),
    email: text(fd, "email", 160),
    wechat: text(fd, "wechat", 80),
    interests: fd
      .getAll("interests")
      .map(String)
      .filter((v) => (investorInterests as readonly string[]).includes(v)),
    message: text(fd, "message"),
    locale: text(fd, "locale", 5),
  };
  if (!kind || !row.name || !(row.phone || row.email || row.wechat))
    return { ok: false, message: dictFor(fd).form.required };
  return insert("inquiries", row, fd, "inquirySaved");
}
