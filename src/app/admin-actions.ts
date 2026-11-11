"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { getAdminSession, isUuid, listingTables, statuses } from "@/lib/admin";
import { defaultLocale, getDict, hasLocale } from "@/lib/i18n";
import { getAuthClient } from "@/lib/supabase";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const langOf = (fd: FormData) => {
  const l = str(fd, "lang");
  return hasLocale(l) ? l : defaultLocale;
};

export type LoginState = { error: string } | null;

export async function signIn(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const lang = langOf(fd);
  const supabase = await getAuthClient();
  if (!supabase) return { error: getDict(lang).admin.demoNote };

  const { error } = await supabase.auth.signInWithPassword({
    email: str(fd, "email").slice(0, 200),
    password: String(fd.get("password") ?? "").slice(0, 200),
  });
  if (error) return { error: getDict(lang).admin.loginError };
  redirect(`/${lang}/admin`);
}

export async function signOut(fd: FormData) {
  const supabase = await getAuthClient();
  await supabase?.auth.signOut();
  redirect(`/${langOf(fd)}/admin/login`);
}

/** Every moderation action starts here: no admin session, no change. */
async function adminClient() {
  const session = await getAdminSession();
  if (session.state !== "ok") throw new Error("Not authorized");
  return session.supabase;
}

export async function setStatus(fd: FormData) {
  const supabase = await adminClient();
  const table = str(fd, "table");
  const id = str(fd, "id");
  const status = str(fd, "status");
  if (
    !(listingTables as readonly string[]).includes(table) ||
    !isUuid(id) ||
    !(statuses as readonly string[]).includes(status)
  )
    throw new Error("Invalid request");

  const { error } = await supabase.from(table).update({ status }).eq("id", id);
  if (error) throw new Error(`Update failed: ${error.message}`);
  refresh();
}

export async function setVerified(fd: FormData) {
  const supabase = await adminClient();
  const id = str(fd, "id");
  if (!isUuid(id)) throw new Error("Invalid request");
  const verified = str(fd, "verified") === "true";

  const { error } = await supabase.from("companies").update({ verified }).eq("id", id);
  if (error) throw new Error(`Update failed: ${error.message}`);
  refresh();
}

export async function setHandled(fd: FormData) {
  const supabase = await adminClient();
  const id = str(fd, "id");
  if (!isUuid(id)) throw new Error("Invalid request");
  const handled = str(fd, "handled") === "true";

  const { error } = await supabase.from("inquiries").update({ handled }).eq("id", id);
  if (error) throw new Error(`Update failed: ${error.message}`);
  refresh();
}
