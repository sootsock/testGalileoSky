"use client";

import { useEffect, useMemo, useRef, useState, ChangeEventHandler } from "react";
import { FormField, FormSchema } from "@/lib/types";
import FieldEditor from "@/components/FieldEditor";
import { loadSchema, saveSchema } from "@/lib/storage";
import { validateSchema } from "@/lib/schema";
import { useToast } from "@/components/ToastProvider";

export default function BuilderPage() {
  const [schema, setSchema] = useState<FormSchema>(() => ({ id: cryptoRandomId(), title: "My Form", fields: [], version: 1 }));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const clearUI = () => {
    setSchema({ id: cryptoRandomId(), title: "My Form", fields: [], version: 1 });
    setMessage(null);
    setError(null);
  };

  const onClear = () => {
    const ok = window.confirm("Are you sure you want to clear the current schema? Unsaved changes will be lost.");
    if (!ok) return;
    clearUI();
    toast.info("Schema cleared");
  };

  const onDownloadAndClear = () => {
    onDownload();
    clearUI();
    toast.success("Downloaded and cleared");
  };

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onFileSelected: ChangeEventHandler<HTMLInputElement> = async (e) => {
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
    } catch (err) {
      setError("Failed to load schema file. Ensure it is valid JSON.");
      setMessage(null);
      console.error(err);
      toast.error("Failed to load schema file");
    }
  };

  const exportJson = useMemo(() => JSON.stringify(schema, null, 2), [schema]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Form Builder</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex gap-2">
          <button className="border rounded px-3 py-1" onClick={() => addField("string")}>Add field</button>
        </div>
        <div className="flex gap-2 sm:justify-end">
          <input
            className="border rounded px-2 py-1 bg-transparent w-60"
            value={schema.title}
            onChange={(e) => setSchema((s) => ({ ...s, title: e.target.value }))}
            placeholder="Form title"
          />
          <button className="border rounded px-3 py-1" onClick={onSave}>Save</button>
          <button className="border rounded px-3 py-1" onClick={onDownload}>Download</button>
          <button className="border rounded px-3 py-1" onClick={onDownloadAndClear}>Download & Clear</button>
          <button className="border rounded px-3 py-1" onClick={onUploadClick}>Upload</button>
          <button className="border rounded px-3 py-1" onClick={onClear}>Clear</button>
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
        {mounted ? (
          <pre className="text-sm bg-black/5 dark:bg-white/5 p-3 rounded overflow-x-auto"><code>{exportJson}</code></pre>
        ) : (
          <pre className="text-sm bg-black/5 dark:bg-white/5 p-3 rounded overflow-x-auto"><code>{"{\n  \"id\": \"loading...\",\n  \"title\": \"My Form\",\n  \"fields\": [],\n  \"version\": 1\n}"}</code></pre>
        )}
      </section>
    </div>
  );
}

function defaultValidation(type: FormField["type"]): FormField["validation"] {
  switch (type) {
    case "string":
      return {type: "string", rules: {required: false}};
    case "integer":
      return {type: "integer", rules: {required: false}};
    case "decimal":
      return {type: "decimal", rules: {required: false, decimalPlaces: 2}};
    default:
      return {type: "datetime", rules: {required: false}}
  }
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}



