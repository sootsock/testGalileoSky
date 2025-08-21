"use client";

import { FormField } from "@/lib/types";
import { useId } from "react";

type Props = {
  field: FormField;
  value: string;
  error?: string;
  onChange: (v: string) => void;
};

export default function DynamicField({ field, value, error, onChange }: Props) {
  const uid = useId();

  return (
    <div className="space-y-1">
      <label htmlFor={`${uid}-input`} className="text-sm">{field.label}</label>
      {renderInput(field, `${uid}-input`, value, onChange)}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}

function renderInput(field: FormField, id: string, value: string, onChange: (v: string) => void) {
  if (field.type === "integer" || field.type === "decimal") {
    return (
      <input
        id={id}
        className="w-full border rounded px-2 py-1 bg-transparent"
        value={value}
        inputMode="decimal"
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === "string") {
    return (
      <input
        id={id}
        className="w-full border rounded px-2 py-1 bg-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <input
      id={id}
      type="datetime-local"
      className="w-full border rounded px-2 py-1 bg-transparent"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}


