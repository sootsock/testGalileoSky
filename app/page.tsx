export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Welcome</h1>
      <p className="text-sm text-black/60 dark:text-white/60">This app provides a form builder and a form filling page.</p>
      <div className="flex gap-3">
        <a className="border rounded px-3 py-2" href="/builder">Go to Builder</a>
          <a className="border rounded px-3 py-2" href="/watch">Go to Schema Testing</a>
      </div>
    </div>
  );
}
