"use client";

import { useMemo, useRef, useState } from "react";
import { FormSchema, FormValues } from "@/lib/types";
import { validateSchema } from "@/lib/schema";
import DynamicField from "@/components/DynamicField";
import { validateAll } from "@/lib/validation";
import { useToast } from "@/components/ToastProvider";

export default function WatchPage() {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  const onUploadClick = () => fileInputRef.current?.click();

  const onFileSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const result = validateSchema(parsed);
      if (!result.valid) {
        toast.error("Invalid schema file");
        return;
      }
      const s = parsed as FormSchema;
      setSchema(s);
      const initial: FormValues = {};
      s.fields.forEach((f) => (initial[f.id] = ""));
      setValues(initial);
      setErrors({});
      setSubmitted(null);
      toast.success("Schema loaded");
    } catch {
      toast.error("Failed to parse JSON");
    }
  };

  const submit = () => {
    if (!schema) return;
    const e = validateAll(schema.fields, values);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setSubmitted(values);
      toast.success("Form valid");
    } else {
      toast.error("Please fix validation errors");
    }
  };

  const result = useMemo(() => (submitted ? JSON.stringify(submitted, null, 2) : null), [submitted]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Check Schema Form</h1>
        <div className="flex gap-2">
          <button className="border rounded px-3 py-1" onClick={onUploadClick}>Upload Schema</button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={onFileSelected} />
          {schema && (
            <button className="border rounded px-3 py-1" onClick={() => { setSchema(null); setValues({}); setErrors({}); setSubmitted(null); }}>Clear</button>
          )}
        </div>
      </div>

      {!schema && (
        <p className="text-sm text-black/60 dark:text-white/60">Upload a schema JSON to render and test the form here.</p>
      )}

      {schema && (
        <div className="space-y-6">
          <h2 className="font-medium">{schema.title}</h2>
          <div className="space-y-4">
            {schema.fields.length === 0 && (
              <p className="text-sm text-black/60 dark:text-white/60">No fields in schema.</p>
            )}
            {schema.fields.map((f) => (
              <DynamicField
                key={f.id}
                field={f}
                value={values[f.id] ?? ""}
                error={errors[f.id]}
                onChange={(v) => {
                  setValues((s) => ({ ...s, [f.id]: v }));
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button className="border rounded px-3 py-1" onClick={submit}>Validate</button>
            <button className="border rounded px-3 py-1" onClick={() => { setValues({}); setErrors({}); setSubmitted(null); }}>Reset</button>
          </div>

          {result && (
            <section className="space-y-2">
              <h3 className="font-medium">Values JSON</h3>
              <pre className="text-sm bg-black/5 dark:bg-white/5 p-3 rounded overflow-x-auto"><code>{result}</code></pre>
            </section>
          )}
        </div>
      )}
    </div>
  );
}


