"use client";

import { useMemo, useRef, useState, ChangeEventHandler } from "react";
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

  const onFileSelected: ChangeEventHandler<HTMLInputElement> = async (e) => {
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
      const parsedSchema = parsed as FormSchema;
      setSchema(parsedSchema);
      const initial: FormValues = {};
      parsedSchema.fields.forEach((field) => (initial[field.id] = ""));
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
    const error = validateAll(schema.fields, values);
    setErrors(error);
    if (Object.keys(error).length === 0) {
      setSubmitted(values);
      toast.success("Form submitted successfully");
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
        <p className="text-sm">Upload a schema JSON to render and test the form here.</p>
      )}

      {schema && (
        <div className="space-y-6">
          <h2 className="font-medium">{schema.title}</h2>
          <div className="space-y-4">
            {schema.fields.length === 0 && (
              <p className="text-sm">No fields in schema.</p>
            )}
            {schema.fields.map((field) => (
              <DynamicField
                key={field.id}
                field={field}
                value={values[field.id] ?? ""}
                error={errors[field.id]}
                onChange={(v) => {
                  setValues((s) => ({ ...s, [field.id]: v }));
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button className="border rounded px-3 py-1" onClick={submit}>Submit</button>
            <button className="border rounded px-3 py-1" onClick={() => { setValues({}); setErrors({}); setSubmitted(null); }}>Reset</button>
          </div>

          {result && (
            <section className="space-y-2">
              <h3 className="font-medium">Submission Result (JSON)</h3>
              <pre className="text-sm bg-black/5 dark:bg-white/5 p-3 rounded overflow-x-auto"><code>{result}</code></pre>
            </section>
          )}
        </div>
      )}
    </div>
  );
}


