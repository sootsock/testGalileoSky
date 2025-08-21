"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FormField, FormSchema } from "@/lib/types";
import FieldEditor from "@/components/FieldEditor";
import { loadSchema, saveSchema } from "@/lib/storage";
import { validateSchema } from "@/lib/schema";
import { useToast } from "@/components/ToastProvider";

export default function BuilderPage() {
  const [schema, setSchema] = useState<FormSchema>(() => ({ id: cryptoRandomId(), title: "My Form", fields: [], version: 1 }));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

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
    setMessage("Schema saved to localStorage");
    setError(null);
    toast.success("Schema saved");
  };

  const onLoad = () => {
    const loaded = loadSchema();
    if (loaded) setSchema(loaded);
    toast.info("Schema loaded from LocalStorage");
  };

  const onDownload = () => {
    const json = JSON.stringify(schema, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeTitle = schema.title.replace(/[^A-Za-z0-9_-]+/g, "_");
    a.download = `${safeTitle || "form"}_${schema.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.info("Schema downloaded");
  };

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onFileSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const result = validateSchema(parsed);
      if (!result.valid) {
        setError(`Invalid schema: ${result.errors[0]}`);
        setMessage(null);
        toast.error("Invalid schema file");
        return;
      }
      setSchema(parsed as FormSchema);
      setMessage("Schema loaded from file");
      setError(null);
      toast.success("Schema uploaded");
    } catch (err: any) {
      setError("Failed to load schema file. Ensure it is valid JSON.");
      setMessage(null);
      toast.error("Failed to load schema file");
    }
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
          <button className="border rounded px-3 py-1" onClick={onDownload}>Download</button>
          <button className="border rounded px-3 py-1" onClick={onUploadClick}>Upload</button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={onFileSelected} />
        </div>
      </div>

      {(message || error) && (
        <div className={`${error ? "text-red-600" : "text-green-700"} text-sm`}>
          {error || message}
        </div>
      )}

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



