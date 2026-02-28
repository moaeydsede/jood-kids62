import { CreditCard } from "lucide-react";

function PayIcon({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-white">
      <CreditCard size={18} />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <PayIcon label="فودافون كاش" />
          <PayIcon label="اتصالات كاش" />
          <PayIcon label="أورنج كاش" />
          <PayIcon label="انستا باي" />
          <PayIcon label="كاش" />
        </div>

        <div className="text-sm text-slate-600 flex items-center justify-between flex-wrap gap-3">
          <p>© {new Date().getFullYear()} JoodKids</p>
          <a className="underline" href="/policy">سياسة الدفع والاسترجاع</a>
        </div>
      </div>
    </footer>
  );
}
