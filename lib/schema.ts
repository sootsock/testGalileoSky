import { FieldType, FormField, FormSchema } from "@/lib/types";

export type SchemaValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateSchema(schema: unknown): SchemaValidationResult {
  const errors: string[] = [];
  if (!schema || typeof schema !== "object") {
    return { valid: false, errors: ["Schema must be an object"] };
  }
  const loadedSchema = schema as Partial<FormSchema> & Record<string, unknown>;

  if (!loadedSchema.title || typeof loadedSchema.title !== "string")
    errors.push("title must be a non-empty string");

  if (!Array.isArray(loadedSchema.fields)) errors.push("fields must be an array");

  if (!loadedSchema.id || typeof loadedSchema.id !== "string") errors.push("id must be a string");

  if (typeof loadedSchema.version !== "number") errors.push("version must be a number");

  const fieldIds = new Set<string>();
  const fieldNames = new Set<string>();

  if (Array.isArray(loadedSchema.fields)) {
    loadedSchema.fields.forEach((f, idx) => {
      const path = `fields[${idx}]`;
      if (!f || typeof f !== "object") {
        errors.push(`${path} must be an object`);
        return;
      }
      const field = f as Partial<FormField> & Record<string, unknown>;

      if (!field.id || typeof field.id !== "string") errors.push(`${path}.id must be a string`);

      if (!field.name || typeof field.name !== "string")
        errors.push(`${path}.name must be a non-empty string`);

      if (!field.label || typeof field.label !== "string")
        errors.push(`${path}.label must be a string`);

      if (!isFieldType(field.type))
        errors.push(`${path}.type must be one of integer|decimal|string|datetime`);

      if (typeof field.rank !== "number" || !Number.isInteger(field.rank) || field.rank < 0)
        errors.push(`${path}.rank must be a non-negative integer`);

      if (!field.validation || typeof field.validation !== "object") {
        errors.push(`${path}.validation must be an object`);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const v = field.validation as any;

        if (!isFieldType(v.type)) errors.push(`${path}.validation.type must match a valid type`);

        if (field.type && v.type && field.type !== v.type)
          errors.push(`${path}.validation.type must equal field.type`);

        const rules = v.rules ?? {};

        if (typeof rules !== "object") errors.push(`${path}.validation.rules must be an object`);

        if (v.type === "integer") {
          checkNumberIfDefined(rules.min, `${path}.validation.rules.min`, errors);
          checkNumberIfDefined(rules.max, `${path}.validation.rules.max`, errors);
          checkBooleanIfDefined(rules.required, `${path}.validation.rules.required`, errors);
          if (isNumber(rules.min) && isNumber(rules.max) && rules.min > rules.max)
            errors.push(`${path}.min must be <= max`);
        } else if (v.type === "decimal") {
          checkNumberIfDefined(rules.min, `${path}.validation.rules.min`, errors);
          checkNumberIfDefined(rules.max, `${path}.validation.rules.max`, errors);
          checkBooleanIfDefined(rules.required, `${path}.validation.rules.required`, errors);

          if (isNumber(rules.min) && isNumber(rules.max) && rules.min > rules.max)
            errors.push(`${path}.min must be <= max`);

          if (
            rules.decimalPlaces !== undefined &&
            (!Number.isInteger(rules.decimalPlaces) || rules.decimalPlaces < 0)
          ) {
            errors.push(`${path}.validation.rules.decimalPlaces must be a non-negative integer`);
          }
        } else if (v.type === "string") {
          checkBooleanIfDefined(rules.required, `${path}.validation.rules.required`, errors);
          if (
            rules.minLength !== undefined &&
            (!Number.isInteger(rules.minLength) || rules.minLength < 0)
          )
            errors.push(`${path}.validation.rules.minLength must be a non-negative integer`);

          if (
            rules.maxLength !== undefined &&
            (!Number.isInteger(rules.maxLength) || rules.maxLength < 0)
          )
            errors.push(`${path}.validation.rules.maxLength must be a non-negative integer`);

          if (
            isNumber(rules.minLength) &&
            isNumber(rules.maxLength) &&
            rules.minLength > rules.maxLength
          )
            errors.push(`${path}.minLength must be <= maxLength`);

          if (rules.pattern !== undefined && typeof rules.pattern !== "string")
            errors.push(`${path}.validation.rules.pattern must be a string`);
        } else if (v.type === "datetime") {
          checkBooleanIfDefined(rules.required, `${path}.validation.rules.required`, errors);

          if (rules.min !== undefined && typeof rules.min !== "string")
            errors.push(`${path}.validation.rules.min must be an ISO datetime string`);

          if (rules.max !== undefined && typeof rules.max !== "string")
            errors.push(`${path}.validation.rules.max must be an ISO datetime string`);

          if (typeof rules.min === "string" && typeof rules.max === "string") {
            if (new Date(rules.min) > new Date(rules.max))
              errors.push(`${path}.min must be <= max`);
          }
        }
      }
      if (field.id && typeof field.id === "string") {
        if (fieldIds.has(field.id)) errors.push(`${path}.id must be unique`);
        fieldIds.add(field.id);
      }
      if (field.name && typeof field.name === "string") {
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(field.name))
          errors.push(
            `${path}.name must be alphanumeric with underscores, not starting with digit`,
          );
        if (fieldNames.has(field.name)) errors.push(`${path}.name must be unique`);
        fieldNames.add(field.name);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

export function isSchemaValid(schema: unknown): schema is FormSchema {
  return validateSchema(schema).valid;
}

function isFieldType(t: unknown): t is FieldType {
  return t === "integer" || t === "decimal" || t === "string" || t === "datetime";
}

function isNumber(n: unknown): n is number {
  return typeof n === "number" && !Number.isNaN(n);
}

function checkNumberIfDefined(n: unknown, path: string, errors: string[]) {
  if (n === undefined) return;
  if (!isNumber(n)) errors.push(`${path} must be a number`);
}

function checkBooleanIfDefined(b: unknown, path: string, errors: string[]) {
  if (b === undefined) return;
  if (typeof b !== "boolean") errors.push(`${path} must be a boolean`);
}
