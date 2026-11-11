"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/types";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;
type Option = { value: string; label: string };

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "select" | "checkboxes" | "checkbox";
  required?: boolean;
  options?: Option[];
  wide?: boolean;
  dir?: "ltr" | "rtl";
};

export type FormLabels = {
  submit: string;
  sending: string;
  optional: string;
  select: string;
  note?: string;
};

function FieldInput({ f, labels }: { f: Field; labels: FormLabels }) {
  const id = `f-${f.name}`;

  if (f.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm md:col-span-2">
        <input type="checkbox" name={f.name} className="h-4 w-4 accent-[var(--color-nile)]" />
        {f.label}
      </label>
    );
  }

  if (f.type === "checkboxes") {
    return (
      <fieldset className="md:col-span-2">
        <legend className="mb-2 text-sm font-medium">{f.label}</legend>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {f.options?.map((o) => (
            <label key={o.value} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name={f.name}
                value={o.value}
                className="h-4 w-4 accent-[var(--color-nile)]"
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  const labelEl = (
    <label htmlFor={id} className="mb-1 block text-sm font-medium">
      {f.label}
      {f.required ? (
        <span className="text-thread"> *</span>
      ) : (
        <span className="font-normal text-muted"> ({labels.optional})</span>
      )}
    </label>
  );

  return (
    <div className={f.wide || f.type === "textarea" ? "md:col-span-2" : ""}>
      {labelEl}
      {f.type === "textarea" ? (
        <textarea id={id} name={f.name} required={f.required} rows={4} className="field" />
      ) : f.type === "select" ? (
        <select id={id} name={f.name} required={f.required} defaultValue="" className="field">
          <option value="" disabled>
            {labels.select}
          </option>
          {f.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={f.name}
          type={f.type ?? "text"}
          required={f.required}
          min={f.type === "number" ? 0 : undefined}
          dir={f.dir}
          className="field"
        />
      )}
    </div>
  );
}

/** Generic form used for new listings and for inquiries. */
export function ActionForm({
  action,
  fields,
  labels,
  hidden,
}: {
  action: Action;
  fields: Field[];
  labels: FormLabels;
  hidden: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  if (state?.ok) {
    return (
      <p role="status" className="rounded-xl border border-nile/30 bg-nile-soft p-5 font-medium text-nile">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {/* Honeypot: hidden from people, tempting for bots. */}
      <input
        type="text"
        name="company_website_url"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      {fields.map((f) => (
        <FieldInput key={f.name} f={f} labels={labels} />
      ))}
      {state && !state.ok && (
        <p role="alert" className="text-sm font-medium text-thread md:col-span-2">
          {state.message}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4 md:col-span-2">
        <button
          disabled={pending}
          className="rounded-full bg-thread px-6 py-2.5 text-sm font-semibold text-white hover:bg-thread-dark disabled:opacity-60"
        >
          {pending ? labels.sending : labels.submit}
        </button>
        {labels.note && <span className="text-sm text-muted">{labels.note}</span>}
      </div>
    </form>
  );
}
