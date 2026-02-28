export default function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-2xl border bg-white overflow-hidden">
          <div className="w-full aspect-square bg-slate-200 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
            <div className="h-9 w-full bg-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
