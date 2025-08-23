"use client";

import { useEffect, useMemo, useRef, useState, ChangeEventHandler } from "react";
import { FormField, FormSchema } from "@/lib/types";
import { FieldEditor, useToast, useLanguage } from "@/components";
import { loadSchema, saveSchema } from "@/lib/storage";
import { validateSchema } from "@/lib/schema";

export default function BuilderPage() {
  const { t } = useLanguage();
  const [schema, setSchema] = useState<FormSchema>(() => ({
    id: cryptoRandomId(),
    title: t('myForm'),
    fields: [],
    version: 1,
  }));
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
      rank: schema.fields.length,
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
    setMessage(t('schemaSaved'));
    setError(null);
    toast.success(t('schemaSaved'));
  };

  const onDownload = () => {
    const json = JSON.stringify(schema, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeTitle = schema.title.replace(/[^A-Za-z0-9_-]+/g, "_");
    a.download = `${safeTitle || t('form')}_${schema.id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.info(t('schemaDownloaded'));
  };

  const clearUI = () => {
    setSchema({ id: cryptoRandomId(), title: t('myForm'), fields: [], version: 1 });
    setMessage(null);
    setError(null);
  };

  const onClear = () => {
    const ok = window.confirm(t('clearConfirmation'));
    if (!ok) return;
    clearUI();
    toast.info(t('schemaCleared'));
  };

  const onDownloadAndClear = () => {
    onDownload();
    clearUI();
    toast.success(t('downloadedAndCleared'));
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
        toast.error(t('invalidSchema'));
        return;
      }
      setSchema(parsed as FormSchema);
      setMessage(t('schemaLoaded'));
      setError(null);
      toast.success(t('schemaUploaded'));
    } catch (err) {
      setError(t('failedToLoad'));
      setMessage(null);
      console.error(err);
      toast.error(t('failedToLoad'));
    }
  };

  const exportJson = useMemo(() => JSON.stringify(schema, null, 2), [schema]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{t('formBuilder')}</h1>
      <div className="space-y-3 sm:space-y-0 sm:grid sm:gap-1 sm:grid-cols-[auto_auto_1fr]">
        <div className="flex gap-3">
          <button className="border rounded px-3 py-1" onClick={() => addField("string")}>
            {t('addNewField')}
          </button>
        </div>
        <div className="flex gap-3 sm:pl-6">
          <input
            className="border rounded px-2 py-1 bg-transparent w-full sm:w-40"
            value={schema.title}
            onChange={(e) => setSchema((s) => ({ ...s, title: e.target.value }))}
            placeholder={t('formTitle')}
          />
        </div>
        <div className="flex flex-wrap gap-3 sm:justify-end">
          <button className="border rounded px-3 py-1" onClick={onSave}>
            {t('save')}
          </button>
          <button className="border rounded px-3 py-1" onClick={onDownload}>
            {t('download')}
          </button>
          <button className="border rounded px-3 py-1" onClick={onDownloadAndClear}>
            {t('downloadAndClear')}
          </button>
          <button className="border rounded px-3 py-1" onClick={onUploadClick}>
            {t('upload')}
          </button>
          <button className="border rounded px-3 py-1" onClick={onClear}>
            {t('clear')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={onFileSelected}
          />
        </div>
      </div>

      {(message || error) && (
        <div className={`${error ? "text-red-600" : "text-green-700"} text-sm`}>
          {error || message}
        </div>
      )}

      <div className="space-y-3">
        {schema.fields.length === 0 && <p className="text-sm">{t('noFieldsYet')}</p>}
        {schema.fields.map((f) => (
          <FieldEditor
            key={f.id}
            field={f}
            onChange={(ff) => updateField(f.id, ff)}
            onRemove={() => removeField(f.id)}
          />
        ))}
      </div>

      <section className="space-y-2">
        <h2 className="font-medium">{t('schemaJson')}</h2>
        {mounted ? (
          <pre className="text-sm bg-black/5 dark:bg-white/5 p-3 rounded overflow-x-auto">
            <code>{exportJson}</code>
          </pre>
        ) : (
          <pre className="text-sm bg-black/5 dark:bg-white/5 p-3 rounded overflow-x-auto">
            <code>
              {
                `{\n  "id": "${t('loading')}",\n  "title": "${t('myForm')}",\n  "fields": [],\n  "version": 1\n}`
              }
            </code>
          </pre>
        )}
      </section>
    </div>
  );
}

function defaultValidation(type: FormField["type"]): FormField["validation"] {
  switch (type) {
    case "string":
      return { type: "string", rules: { required: false } };
    case "integer":
      return { type: "integer", rules: { required: false } };
    case "decimal":
      return { type: "decimal", rules: { required: false, decimalPlaces: 2 } };
    default:
      return { type: "datetime", rules: { required: false } };
  }
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}
