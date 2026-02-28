"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import ProductsSkeleton from "@/components/ProductsSkeleton";

export default function OffersGrid() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<"all"|"in"|"out">("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const col = collection(db, "products");
      const snap = await getDocs(query(col, orderBy("modelSortKey", "asc"), orderBy("modelNumber", "asc")));
      const all = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Product[];
      setItems(all);
      setLoading(false);
    })();
  }, []);

  const visible = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    return items.filter((p) => {
      const hasOffer = !!p.hasDiscount && (Number(p.discountPrice || 0) > 0) && (Number(p.price || 0) > Number(p.discountPrice || 0));
      if (!hasOffer) return false;
      const stockOk =
        stockFilter === "all" ? true : stockFilter === "in" ? (p.inStock ?? true) : !(p.inStock ?? true);
      if (!stockOk) return false;
      if (!s) return true;
      const title = (p.title || "").toLowerCase();
      const model = String(p.modelNumber ?? "");
      return title.includes(s) || model.includes(s);
    });
  }, [items, searchTerm, stockFilter]);

  if (loading) return <ProductsSkeleton />;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-white p-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex-1">
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="بحث بالعروض بالاسم أو رقم الموديل"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className={`rounded-xl border px-3 py-2 text-sm font-semibold ${stockFilter==="all"?"bg-slate-100":""}`} onClick={()=>setStockFilter("all")} type="button">الكل</button>
          <button className={`rounded-xl border px-3 py-2 text-sm font-semibold ${stockFilter==="in"?"bg-slate-100":""}`} onClick={()=>setStockFilter("in")} type="button">متوفر</button>
          <button className={`rounded-xl border px-3 py-2 text-sm font-semibold ${stockFilter==="out"?"bg-slate-100":""}`} onClick={()=>setStockFilter("out")} type="button">غير متوفر</button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border bg-white p-5 text-slate-700">لا توجد عروض حاليًا.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {visible.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
