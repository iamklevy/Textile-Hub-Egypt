"use client";

import { useActionState, useEffect, useRef, useState, type ChangeEvent } from "react";
import { CheckIcon } from "@/components/icons";
import { MAX_PHOTOS } from "@/lib/photos";
import type { FormState } from "@/lib/types";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;
type Option = { value: string; label: string };

export type Field = {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "textarea"
    | "select"
    | "checkboxes"
    | "checkbox"
    | "photos";
  required?: boolean;
  hint?: string;
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

const MAX_SIDE = 1600;

/** Re-encode a photo as a JPEG no larger than MAX_SIDE px on its long side. */
async function shrink(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.8));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    // Formats the browser cannot decode are sent as-is; the server checks them.
    return file;
  }
}

/**
 * File picker for machine photos. Photos are resized in the browser and put
 * back into the same <input>, so the form submits the small versions.
 */
function PhotoInput({ f }: { f: Field }) {
  const [previews, setPreviews] = useState<string[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  // React resets the form after each submit; clear the previews with it.
  useEffect(() => {
    const form = ref.current?.form;
    const clear = () => setPreviews([]);
    form?.addEventListener("reset", clear);
    return () => form?.removeEventListener("reset", clear);
  }, []);

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const picked = Array.from(input.files ?? [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, MAX_PHOTOS);
    const small = await Promise.all(picked.map(shrink));
    const dt = new DataTransfer();
    small.forEach((file) => dt.items.add(file));
    input.files = dt.files;
    setPreviews(small.map((file) => URL.createObjectURL(file)));
  }

  return (
    <div className="md:col-span-2">
      <label htmlFor={`f-${f.name}`} className="mb-1.5 block text-sm font-medium">
        {f.label}
      </label>
      <input
        ref={ref}
        id={`f-${f.name}`}
        name={f.name}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={onChange}
        className="field file:me-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-sand file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink"
      />
      {f.hint && <p className="mt-1.5 text-xs text-muted">{f.hint}</p>}
      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {previews.map((src) => (
            // Local blob previews; next/image cannot optimize these.
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className="aspect-square w-full rounded-lg object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}

function FieldInput({ f, labels }: { f: Field; labels: FormLabels }) {
  const id = `f-${f.name}`;

  if (f.type === "photos") return <PhotoInput f={f} />;

  if (f.type === "checkbox") {
    return (
      <label className="flex cursor-pointer items-center gap-2.5 text-sm md:col-span-2">
        <input type="checkbox" name={f.name} className="h-4 w-4 accent-[var(--color-nile)]" />
        {f.label}
      </label>
    );
  }

  if (f.type === "checkboxes") {
    return (
      <fieldset className="md:col-span-2">
        <legend className="mb-2.5 text-sm font-medium">{f.label}</legend>
        <div className="flex flex-wrap gap-2">
          {f.options?.map((o) => (
            <label
              key={o.value}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-line-strong bg-white px-3 py-2 text-sm transition-colors hover:border-ink-soft has-[:checked]:border-nile has-[:checked]:bg-nile-soft has-[:checked]:text-nile"
            >
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
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
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
      <div role="status" className="flex items-start gap-3 rounded-xl border border-nile/25 bg-nile-soft p-5 text-nile">
        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-nile text-white">
          <CheckIcon className="h-3.5 w-3.5" />
        </span>
        <p className="font-medium leading-relaxed">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-x-4 gap-y-5 md:grid-cols-2">
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
        <p role="alert" className="rounded-lg bg-thread/10 px-3.5 py-2.5 text-sm font-medium text-thread-dark md:col-span-2">
          {state.message}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4 pt-1 md:col-span-2">
        <button disabled={pending} className="btn btn-primary">
          {pending ? labels.sending : labels.submit}
        </button>
        {labels.note && <span className="text-sm text-muted">{labels.note}</span>}
      </div>
    </form>
  );
}
