"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [seasonFilter, setSeasonFilter] = useState<string>("all");
  const [onlyDiscount, setOnlyDiscount] = useState(false);

  useEffect(() => {
    const read = () => setSeasonFilter(localStorage.getItem("seasonFilter") || "all");
    read();
    window.addEventListener("seasonFilterChanged", read);
    return () => window.removeEventListener("seasonFilterChanged", read);
  }, []);

  useEffect(() => {
    (async () => {
      const col = collection(db, "products");
      const qAny = query(col, orderBy("modelSortKey", "asc"), orderBy("modelNumber", "asc"));
      const qSeason = seasonFilter !== "all"
        ? query(col, where("seasonId", "==", seasonFilter), orderBy("modelSortKey", "asc"), orderBy("modelNumber", "asc"))
        : qAny;

      const snap = await getDocs(qSeason);
      const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Product[];
      setProducts(list);
    })();
  }, [seasonFilter]);

  const filtered = useMemo(() => {
    return products.filter(p => (onlyDiscount ? !!p.hasDiscount : true));
  }, [products, onlyDiscount]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">المنتجات</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyDiscount} onChange={(e) => setOnlyDiscount(e.target.checked)} />
          عروض فقط
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-600">لا يوجد منتجات حالياً.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
