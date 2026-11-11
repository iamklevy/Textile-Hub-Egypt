// Kept free of dictionary imports so the proxy bundle stays small.
export const locales = ["en", "ar", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
