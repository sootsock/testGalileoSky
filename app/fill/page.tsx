"use client";

import { useEffect, useMemo, useState } from "react";
import { FormSchema, FormValues } from "@/lib/types";
import { loadSchema } from "@/lib/storage";
import DynamicField from "@/components/DynamicField";
import { validateAll } from "@/lib/validation";
import { validateSchema } from "@/lib/schema";

export default function FillPage() {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [values, setValues] = useState<FormValues>({});
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [schemaError, setSchemaError] = useState<string | null>(null);

  useEffect(() => {
    const s = loadSchema();
    setSchema(s);
    if (s) {
      const result = validateSchema(s);
      if (!result.valid) {
        setSchemaError(`Invalid saved schema: ${result.errors[0]}`);
        return;
      }
      const initial: FormValues = {};
      s.fields.forEach((f) => (initial[f.id] = ""));
      setValues(initial);
      setSchemaError(null);
    }
  }, []);

  if (!schema) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Fill Form</h1>
        <p className="text-sm text-black/60 dark:text-white/60">No saved schema. Go to Builder to create and save one.</p>
      </div>
    );
  }

  const submit = () => {
    const e = validateAll(schema.fields, values);
    setErrors(e);
    if (Object.keys(e).length === 0) setSubmitted(values);
  };

  const result = useMemo(() => (submitted ? JSON.stringify(submitted, null, 2) : null), [submitted]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{schema.title}</h1>

      {schemaError && (
        <div className="text-red-600 text-sm">{schemaError}</div>
      )}

      <div className="space-y-4">
        {schema.fields.length === 0 && (
          <p className="text-sm text-black/60 dark:text-white/60">No fields in schema.</p>
        )}
        {schema.fields.map((f) => (
          <DynamicField key={f.id} field={f} value={values[f.id] ?? ""} error={errors[f.id]} onChange={(v) => setValues((s) => ({ ...s, [f.id]: v }))} />
        ))}
      </div>

      <div className="flex gap-2">
        <button className="border rounded px-3 py-1" onClick={submit}>Submit</button>
        <button className="border rounded px-3 py-1" onClick={() => { setValues({}); setErrors({}); setSubmitted(null); }}>Reset</button>
      </div>

      {result && (
        <section className="space-y-2">
          <h2 className="font-medium">Submitted JSON</h2>
          <pre className="text-sm bg-black/5 dark:bg-white/5 p-3 rounded overflow-x-auto"><code>{result}</code></pre>
        </section>
      )}
    </div>
  );
}


