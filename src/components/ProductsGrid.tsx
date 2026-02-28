"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";

function SkeletonCard() {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <div className="aspect-square bg-slate-100 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-slate-100 rounded-lg animate-pulse" />
        <div className="h-3 w-1/2 bg-slate-100 rounded-lg animate-pulse" />
        <div className="h-4 w-1/3 bg-slate-100 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

export default function ProductsGrid() {
  const sp = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [seasonFilter, setSeasonFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [onlyDiscount, setOnlyDiscount] = useState(false);

  // Init from URL (e.g. /?discount=1)
  useEffect(() => {
    const d = sp.get("discount");
    if (d === "1") setOnlyDiscount(true);
  }, [sp]);

  // Init/Listen taxonomy filters (from SideMenu)
  useEffect(() => {
    const read = () => {
      setSeasonFilter(localStorage.getItem("seasonFilter") || "all");
      setCategoryFilter(localStorage.getItem("categoryFilter") || "all");
    };
    read();
    window.addEventListener("filtersChanged", read);
    return () => window.removeEventListener("filtersChanged", read);
  }, []);

  // Load products
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const col = collection(db, "products");

        // Base ordering (modelSortKey then modelNumber)
        const baseOrder: any[] = [orderBy("modelSortKey", "asc"), orderBy("modelNumber", "asc")];

        // Build query with optional season/category
        const clauses: any[] = [];
        if (seasonFilter !== "all") clauses.push(where("seasonId", "==", seasonFilter));
        if (categoryFilter !== "all") clauses.push(where("categoryId", "==", categoryFilter));

        const qFinal = clauses.length ? query(col, ...clauses, ...baseOrder) : query(col, ...baseOrder);

        const snap = await getDocs(qFinal);
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Product[];
        setProducts(list);
      } finally {
        setLoading(false);
      }
    })();
  }, [seasonFilter, categoryFilter]);

  const filtered = useMemo(() => {
    if (!onlyDiscount) return products;
    return products.filter(
      (p) =>
        !!p.hasDiscount &&
        typeof p.discountPrice === "number" &&
        p.discountPrice > 0 &&
        p.discountPrice < p.price
    );
  }, [products, onlyDiscount]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-white p-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex-1">
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="بحث بالاسم أو رقم الموديل"
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
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold">المنتجات</h2>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={onlyDiscount} onChange={(e) => setOnlyDiscount(e.target.checked)} />
          عروض فقط
        </label>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-slate-600">لا يوجد منتجات مطابقة حالياً.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
