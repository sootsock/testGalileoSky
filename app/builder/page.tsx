"use client";

import { useEffect, useMemo, useState } from "react";
import { FormField, FormSchema } from "@/lib/types";
import FieldEditor from "@/components/FieldEditor";
import { loadSchema, saveSchema } from "@/lib/storage";

export default function BuilderPage() {
  const [schema, setSchema] = useState<FormSchema>(() => ({ id: cryptoRandomId(), title: "My Form", fields: [], version: 1 }));

  useEffect(() => {
    const loaded = loadSchema();
    if (loaded) setSchema(loaded);
  }, []);

  const addField = (type: FormField["type"]) => {
    const id = cryptoRandomId();
    const newField: FormField = {
      id,
      name: `field_${schema.fields.length + 1}`,
      label: `Field ${schema.fields.length + 1}`,
      type,
      validation: defaultValidation(type),
    };
    setSchema((s) => ({ ...s, fields: [...s.fields, newField] }));
  };

  const updateField = (id: string, update: FormField) => {
    setSchema((s) => ({ ...s, fields: s.fields.map((f) => (f.id === id ? update : f)) }));
  };

  const removeField = (id: string) => {
    setSchema((s) => ({ ...s, fields: s.fields.filter((f) => f.id !== id) }));
  };

  const onSave = () => {
    saveSchema(schema);
    alert("Schema saved to localStorage");
  };

  const onLoad = () => {
    const loaded = loadSchema();
    if (loaded) setSchema(loaded);
  };

  const exportJson = useMemo(() => JSON.stringify(schema, null, 2), [schema]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Form Builder</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex gap-2">
          <button className="border rounded px-3 py-1" onClick={() => addField("string")}>Add string</button>
          <button className="border rounded px-3 py-1" onClick={() => addField("integer")}>Add integer</button>
          <button className="border rounded px-3 py-1" onClick={() => addField("decimal")}>Add decimal</button>
          <button className="border rounded px-3 py-1" onClick={() => addField("datetime")}>Add datetime</button>
        </div>
        <div className="flex gap-2 sm:justify-end">
          <input
            className="border rounded px-2 py-1 bg-transparent w-60"
            value={schema.title}
            onChange={(e) => setSchema((s) => ({ ...s, title: e.target.value }))}
            placeholder="Form title"
          />
          <button className="border rounded px-3 py-1" onClick={onLoad}>Load</button>
          <button className="border rounded px-3 py-1" onClick={onSave}>Save</button>
        </div>
      </div>

      <div className="space-y-3">
        {schema.fields.length === 0 && (
          <p className="text-sm text-black/60 dark:text-white/60">No fields yet. Add one above.</p>
        )}
        {schema.fields.map((f) => (
          <FieldEditor key={f.id} field={f} onChange={(ff) => updateField(f.id, ff)} onRemove={() => removeField(f.id)} />
        ))}
      </div>

      <section className="space-y-2">
        <h2 className="font-medium">Schema JSON</h2>
        <pre className="text-sm bg-black/5 dark:bg-white/5 p-3 rounded overflow-x-auto"><code>{exportJson}</code></pre>
      </section>
    </div>
  );
}

function defaultValidation(type: FormField["type"]): FormField["validation"] {
  if (type === "integer") return { type: "integer", rules: { required: false } };
  if (type === "decimal") return { type: "decimal", rules: { required: false, decimalPlaces: 2 } };
  if (type === "string") return { type: "string", rules: { required: false } };
  return { type: "datetime", rules: { required: false } };
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}


