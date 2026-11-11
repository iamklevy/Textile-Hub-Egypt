"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin-actions";

export function LoginForm({
  lang,
  labels,
}: {
  lang: string;
  labels: { email: string; password: string; signIn: string; signingIn: string };
}) {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="lang" value={lang} />
      <div>
        <label htmlFor="admin-email" className="mb-1 block text-sm font-medium">
          {labels.email}
        </label>
        <input id="admin-email" name="email" type="email" required autoComplete="username" dir="ltr" className="field" />
      </div>
      <div>
        <label htmlFor="admin-password" className="mb-1 block text-sm font-medium">
          {labels.password}
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          dir="ltr"
          className="field"
        />
      </div>
      {state?.error && (
        <p role="alert" className="text-sm font-medium text-thread">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="w-full rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white hover:bg-ink-soft disabled:opacity-60"
      >
        {pending ? labels.signingIn : labels.signIn}
      </button>
    </form>
  );
}
