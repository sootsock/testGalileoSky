import { FieldType, FieldValidation, FormField, FormValues } from "@/lib/types";

export type ValidationError = {
  fieldId: string;
  message: string;
};

export function validateField(field: FormField, value: string): string | null {
  const v = field.validation;
  const trimmed = value?.toString() ?? "";

  if (v.type === "integer") {
    const { required, min, max } = v.rules;
    if (required && trimmed === "") return `${field.label} is required`;
    if (trimmed === "") return null;
    if (!/^[-+]?\d+$/.test(trimmed)) return `${field.label} must be an integer`;
    const n = Number(trimmed);
    if (min !== undefined && n < min) return `${field.label} must be >= ${min}`;
    if (max !== undefined && n > max) return `${field.label} must be <= ${max}`;
    return null;
  }

  if (v.type === "decimal") {
    const { required, min, max, decimalPlaces } = v.rules;
    if (required && trimmed === "") return `${field.label} is required`;
    if (trimmed === "") return null;
    if (!/^[-+]?\d+(?:\.\d+)?$/.test(trimmed)) return `${field.label} must be a decimal`;
    const n = Number(trimmed);
    if (Number.isNaN(n)) return `${field.label} must be a decimal`;
    if (decimalPlaces !== undefined) {
      const [, frac] = trimmed.split(".");
      if (frac && frac.length > decimalPlaces) return `${field.label} max ${decimalPlaces} decimal places`;
    }
    if (min !== undefined && n < min) return `${field.label} must be >= ${min}`;
    if (max !== undefined && n > max) return `${field.label} must be <= ${max}`;
    return null;
  }

  if (v.type === "string") {
    const { required, minLength, maxLength, pattern } = v.rules;
    if (required && trimmed === "") return `${field.label} is required`;
    if (trimmed === "") return null;
    if (minLength !== undefined && trimmed.length < minLength)
      return `${field.label} length must be >= ${minLength}`;
    if (maxLength !== undefined && trimmed.length > maxLength)
      return `${field.label} length must be <= ${maxLength}`;
    if (pattern) {
      try {
        const re = new RegExp(pattern);
        if (!re.test(trimmed)) return `${field.label} must match pattern`;
      } catch {
        return `Invalid pattern for ${field.label}`;
      }
    }
    return null;
  }

  if (v.type === "datetime") {
    const { required, min, max } = v.rules;
    if (required && trimmed === "") return `${field.label} is required`;
    if (trimmed === "") return null;
    // Accept "YYYY-MM-DDTHH:mm" format from input[type=datetime-local]
    const date = new Date(trimmed);
    if (Number.isNaN(date.getTime())) return `${field.label} must be a datetime`;
    if (min) {
      const minD = new Date(min);
      if (date < minD) return `${field.label} must be after ${min}`;
    }
    if (max) {
      const maxD = new Date(max);
      if (date > maxD) return `${field.label} must be before ${max}`;
    }
    return null;
  }

  return null;
}

export function validateAll(fields: FormField[], values: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const error = validateField(field, values[field.id] ?? "");
    if (error) errors[field.id] = error;
  }
  return errors;
}


