import type { Field } from "@/components/forms";
import type { Dict } from "@/lib/i18n";
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

const opts = (keys: readonly string[], map: Record<string, string>) =>
  keys.map((value) => ({ value, label: map[value] ?? value }));

export const companyFields = (t: Dict): Field[] => [
  { name: "name", label: t.directory.name, required: true, dir: "ltr" },
  { name: "name_ar", label: t.directory.nameAr, dir: "rtl" },
  { name: "name_zh", label: t.directory.nameZh },
  { name: "category", label: t.common.category, type: "select", required: true, options: opts(companyCategories, t.companyCategories) },
  { name: "city", label: t.common.city, type: "select", required: true, options: opts(cities, t.cities) },
  { name: "employees", label: t.directory.employees, type: "number" },
  { name: "description", label: t.directory.description, type: "textarea" },
  { name: "capabilities", label: t.directory.capabilities, type: "textarea" },
  { name: "min_order", label: t.directory.minOrder },
  { name: "certifications", label: t.directory.certifications },
  { name: "export_markets", label: t.directory.exportMarkets },
  { name: "open_to", label: t.directory.openTo, type: "checkboxes", options: opts(openToOptions, t.openTo) },
  { name: "contact_name", label: t.directory.contactName },
  { name: "phone", label: t.common.phone, type: "tel", required: true, dir: "ltr" },
  { name: "whatsapp", label: t.common.whatsapp, type: "tel", dir: "ltr" },
  { name: "email", label: t.common.email, type: "email", dir: "ltr" },
  { name: "website", label: t.common.website, dir: "ltr" },
];

export const jobFields = (t: Dict): Field[] => [
  { name: "title", label: t.jobs.jobTitle, required: true },
  { name: "company_name", label: t.jobs.company, required: true },
  { name: "role", label: t.jobs.role, type: "select", required: true, options: opts(jobRoles, t.jobRoles) },
  { name: "city", label: t.common.city, type: "select", required: true, options: opts(cities, t.cities) },
  { name: "job_type", label: t.jobs.type, type: "select", required: true, options: opts(jobTypes, t.jobTypes) },
  { name: "languages", label: t.jobs.languages },
  { name: "salary_min", label: t.jobs.salaryMin, type: "number" },
  { name: "salary_max", label: t.jobs.salaryMax, type: "number" },
  { name: "description", label: t.jobs.description, type: "textarea" },
  { name: "phone", label: t.common.phone, type: "tel", required: true, dir: "ltr" },
  { name: "email", label: t.common.email, type: "email", dir: "ltr" },
];

export const machineFields = (t: Dict): Field[] => [
  { name: "title", label: t.machinery.machineTitle, required: true, wide: true },
  { name: "category", label: t.common.category, type: "select", required: true, options: opts(machineCategories, t.machineCategories) },
  { name: "condition", label: t.machinery.condition, type: "select", required: true, options: opts(machineConditions, t.machineConditions) },
  { name: "brand", label: t.machinery.brand },
  { name: "model", label: t.machinery.model },
  { name: "year", label: t.machinery.year, type: "number" },
  { name: "city", label: t.common.city, type: "select", required: true, options: opts(cities, t.cities) },
  { name: "price_egp", label: t.machinery.price, type: "number" },
  { name: "negotiable", label: t.machinery.negotiable, type: "checkbox" },
  { name: "description", label: t.machinery.description, type: "textarea" },
  { name: "seller_name", label: t.machinery.sellerName },
  { name: "phone", label: t.common.phone, type: "tel", required: true, dir: "ltr" },
  { name: "email", label: t.common.email, type: "email", dir: "ltr" },
];

export const inquiryFields = (t: Dict): Field[] => [
  { name: "name", label: t.form.yourName, required: true },
  { name: "company", label: t.form.yourCompany },
  { name: "phone", label: t.form.yourPhone, type: "tel", required: true, dir: "ltr" },
  { name: "email", label: t.form.yourEmail, type: "email", dir: "ltr" },
  { name: "message", label: t.form.message, type: "textarea" },
];

export const investorFields = (t: Dict): Field[] => [
  { name: "name", label: t.form.yourName, required: true },
  { name: "company", label: t.form.yourCompany, required: true },
  { name: "email", label: t.form.yourEmail, type: "email", required: true, dir: "ltr" },
  { name: "wechat", label: t.form.yourWechat, dir: "ltr" },
  { name: "phone", label: t.form.yourPhone, type: "tel", dir: "ltr" },
  { name: "interests", label: t.investors.interest, type: "checkboxes", options: opts(investorInterests, t.investorInterests) },
  { name: "message", label: t.form.message, type: "textarea" },
];

export const formLabels = (t: Dict, kind: "listing" | "inquiry") => ({
  submit: kind === "listing" ? t.form.submit : t.form.send,
  sending: t.form.sending,
  optional: t.common.optional,
  select: t.common.select,
  note: kind === "listing" ? t.form.reviewNote : undefined,
});
