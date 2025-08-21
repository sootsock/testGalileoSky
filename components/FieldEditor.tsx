"use client";

import { FormField } from "@/lib/types";
import { useId } from "react";

type Props = {
  field: FormField;
  onChange: (field: FormField) => void;
  onRemove: () => void;
};

export default function FieldEditor({ field, onChange, onRemove }: Props) {
  const uid = useId();

  return (
    <div className="rounded border border-black/10 dark:border-white/10 p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label htmlFor={`${uid}-name`} className="text-sm">Name</label>
          <input
            id={`${uid}-name`}
            className="mt-1 w-full border rounded px-2 py-1 bg-transparent"
            value={field.name}
            onChange={(e) => onChange({ ...field, name: e.target.value })}
            placeholder="field_name"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-label`} className="text-sm">Label</label>
          <input
            id={`${uid}-label`}
            className="mt-1 w-full border rounded px-2 py-1 bg-transparent"
            value={field.label}
            onChange={(e) => onChange({ ...field, label: e.target.value })}
            placeholder="Field label"
          />
        </div>
        <div>
          <label htmlFor={`${uid}-type`} className="text-sm">Type</label>
          <select
            id={`${uid}-type`}
            className="mt-1 w-full border rounded px-2 py-1 bg-transparent"
            value={field.type}
            onChange={(e) => {
              const t = e.target.value as FormField["type"];
              onChange({
                ...field,
                type: t,
                validation: defaultValidationFor(t),
              });
            }}
          >
            <option value="integer">integer</option>
            <option value="decimal">decimal</option>
            <option value="string">string</option>
            <option value="datetime">datetime</option>
          </select>
        </div>
      </div>

      <ValidationEditor
        type={field.type}
        validation={field.validation}
        onChange={(validation) => onChange({ ...field, validation })}
      />

      <div className="flex justify-end">
        <button className="text-red-600 text-sm hover:underline" onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
}

import { FieldValidation } from "@/lib/types";

function defaultValidationFor(type: FormField["type"]): FieldValidation {
  if (type === "integer") return { type: "integer", rules: { required: false } };
  if (type === "decimal") return { type: "decimal", rules: { required: false, decimalPlaces: 2 } };
  if (type === "string") return { type: "string", rules: { required: false } };
  return { type: "datetime", rules: { required: false } };
}

type VProps = {
  type: FormField["type"];
  validation: FieldValidation;
  onChange: (v: FieldValidation) => void;
};

function ValidationEditor({ type, validation, onChange }: VProps) {
  if (type === "integer") {
    const rules = validation.type === "integer" ? validation.rules : { required: false };
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Checkbox label="Required" checked={!!rules.required} onChange={(b) => onChange({ type: "integer", rules: { ...rules, required: b } })} />
        <NumberInput label="Min" value={rules.min ?? ""} onChange={(v) => onChange({ type: "integer", rules: { ...rules, min: parseOptionalNumber(v) } })} />
        <NumberInput label="Max" value={rules.max ?? ""} onChange={(v) => onChange({ type: "integer", rules: { ...rules, max: parseOptionalNumber(v) } })} />
      </div>
    );
  }
  if (type === "decimal") {
    const rules = validation.type === "decimal" ? validation.rules : { required: false, decimalPlaces: 2 };
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Checkbox label="Required" checked={!!rules.required} onChange={(b) => onChange({ type: "decimal", rules: { ...rules, required: b } })} />
        <NumberInput label="Min" value={rules.min ?? ""} onChange={(v) => onChange({ type: "decimal", rules: { ...rules, min: parseOptionalNumber(v) } })} />
        <NumberInput label="Max" value={rules.max ?? ""} onChange={(v) => onChange({ type: "decimal", rules: { ...rules, max: parseOptionalNumber(v) } })} />
        <NumberInput label="Decimal places" value={rules.decimalPlaces ?? ""} onChange={(v) => onChange({ type: "decimal", rules: { ...rules, decimalPlaces: parseOptionalInteger(v) } })} />
      </div>
    );
  }
  if (type === "string") {
    const rules = validation.type === "string" ? validation.rules : { required: false };
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Checkbox label="Required" checked={!!rules.required} onChange={(b) => onChange({ type: "string", rules: { ...rules, required: b } })} />
        <NumberInput label="Min length" value={rules.minLength ?? ""} onChange={(v) => onChange({ type: "string", rules: { ...rules, minLength: parseOptionalInteger(v) } })} />
        <NumberInput label="Max length" value={rules.maxLength ?? ""} onChange={(v) => onChange({ type: "string", rules: { ...rules, maxLength: parseOptionalInteger(v) } })} />
        <div>
          <label className="text-sm">Pattern (RegExp)</label>
          <input className="mt-1 w-full border rounded px-2 py-1 bg-transparent" value={rules.pattern ?? ""} onChange={(e) => onChange({ type: "string", rules: { ...rules, pattern: e.target.value || undefined } })} />
        </div>
      </div>
    );
  }
  const rules = validation.type === "datetime" ? validation.rules : { required: false };
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Checkbox label="Required" checked={!!rules.required} onChange={(b) => onChange({ type: "datetime", rules: { ...rules, required: b } })} />
      <div>
        <label className="text-sm">Min</label>
        <input type="datetime-local" className="mt-1 w-full border rounded px-2 py-1 bg-transparent" value={rules.min ?? ""} onChange={(e) => onChange({ type: "datetime", rules: { ...rules, min: e.target.value || undefined } })} />
      </div>
      <div>
        <label className="text-sm">Max</label>
        <input type="datetime-local" className="mt-1 w-full border rounded px-2 py-1 bg-transparent" value={rules.max ?? ""} onChange={(e) => onChange({ type: "datetime", rules: { ...rules, max: e.target.value || undefined } })} />
      </div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (b: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 mt-6">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number | ""; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        className="mt-1 w-full border rounded px-2 py-1 bg-transparent"
        value={value}
        inputMode="numeric"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function parseOptionalNumber(v: string): number | undefined {
  if (v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function parseOptionalInteger(v: string): number | undefined {
  if (v === "") return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isNaN(n) ? undefined : n;
}


