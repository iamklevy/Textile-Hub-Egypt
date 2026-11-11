export type Company = {
  id: string;
  created_at: string;
  name: string;
  name_ar: string | null;
  name_zh: string | null;
  category: string;
  city: string;
  description: string | null;
  capabilities: string | null;
  employees: number | null;
  min_order: string | null;
  certifications: string | null;
  export_markets: string | null;
  open_to: string[];
  contact_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  verified: boolean;
};

export type Job = {
  id: string;
  created_at: string;
  title: string;
  company_name: string;
  role: string;
  city: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  languages: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
};

export type Machine = {
  id: string;
  created_at: string;
  title: string;
  category: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  condition: string;
  price_egp: number | null;
  negotiable: boolean;
  city: string;
  description: string | null;
  seller_name: string | null;
  phone: string | null;
  email: string | null;
};

export type Filters = { q?: string; category?: string; city?: string };

export type FormState = { ok: boolean; message: string } | null;
