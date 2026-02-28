"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import TaxonomyMenu from "@/components/TaxonomyMenu";

export default function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">التصنيفات</h2>
          <button className="p-2 rounded-xl hover:bg-slate-100" onClick={onClose} aria-label="إغلاق">
            <X />
          </button>
        </div>

        <div className="mt-4">
          <TaxonomyMenu />
        </div>

        <div className="mt-6 space-y-2 text-sm">
          <a className="block rounded-xl border px-3 py-2 hover:bg-slate-50" href="/policy">سياسة الدفع والاسترجاع</a>
        </div>
      </div>
    </div>
  );
}
