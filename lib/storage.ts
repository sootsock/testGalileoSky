import { FormSchema } from "@/lib/types";

const SCHEMA_KEY = "form_builder_schema";

export function loadSchema(): FormSchema | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SCHEMA_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FormSchema;
  } catch {
    return null;
  }
}

export function saveSchema(schema: FormSchema) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SCHEMA_KEY, JSON.stringify(schema));
}


