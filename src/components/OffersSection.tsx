"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default function OffersSection() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "products"), orderBy("updatedAt", "desc")));
        const all = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Product[];
        const offers = all.filter(
          (p) =>
            !!p.hasDiscount &&
            typeof p.discountPrice === "number" &&
            p.discountPrice > 0 &&
            p.discountPrice < p.price
        );
        setItems(offers.slice(0, 8));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border bg-white p-5">
        <div className="h-6 w-40 bg-slate-100 rounded-xl animate-pulse" />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-white overflow-hidden">
              <div className="aspect-square bg-slate-100 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-3 w-1/2 bg-slate-100 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="rounded-3xl border bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold">العروض</h2>
        <span className="text-xs text-slate-500">تظهر تلقائيًا للمنتجات المخفّضة</span>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
