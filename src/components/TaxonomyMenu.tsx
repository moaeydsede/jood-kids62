"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Season, Category } from "@/lib/types";

export default function TaxonomyMenu() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [openSeason, setOpenSeason] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const sSnap = await getDocs(query(collection(db, "seasons"), orderBy("order", "asc")));
      setSeasons(sSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Season[]);

      const cSnap = await getDocs(query(collection(db, "categories"), orderBy("order", "asc")));
      setCats(cSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Category[]);
    })();
  }, []);

  const catsBySeason = useMemo(() => {
    const m = new Map<string, Category[]>();
    for (const c of cats) {
      if (!m.has(c.seasonId)) m.set(c.seasonId, []);
      m.get(c.seasonId)!.push(c);
    }
    for (const [k, arr] of m) arr.sort((a,b)=>(a.order??0)-(b.order??0));
    return m;
  }, [cats]);

  function setFilters(seasonId: string, categoryId: string | "all") {
    localStorage.setItem("seasonFilter", seasonId);
    localStorage.setItem("categoryFilter", categoryId);
    window.dispatchEvent(new Event("filtersChanged"));
  }

  return (
    <div className="space-y-2">
      <button
        className="w-full rounded-xl border px-4 py-2 text-sm font-semibold bg-white hover:bg-slate-50"
        onClick={() => {
          setOpenSeason("all");
          setFilters("all", "all");
        }}
      >
        الكل
      </button>

      {seasons.map((s) => (
        <div key={s.id} className="rounded-xl border bg-white overflow-hidden">
          <button
            className="w-full px-4 py-2 flex items-center justify-between text-sm font-bold hover:bg-slate-50"
            onClick={() => {
              setOpenSeason(openSeason === s.id ? "all" : s.id);
              setFilters(s.id, "all");
            }}
          >
            <span>{s.name}</span>
            <span className="text-slate-400">{openSeason === s.id ? "−" : "+"}</span>
          </button>

          {openSeason === s.id ? (
            <div className="border-t bg-slate-50">
              {(catsBySeason.get(s.id) ?? []).map((c) => (
                <button
                  key={c.id}
                  className="w-full text-right px-4 py-2 text-sm hover:bg-white"
                  onClick={() => setFilters(s.id, c.id)}
                >
                  {c.name}
                </button>
              ))}
              {(catsBySeason.get(s.id)?.length ?? 0) === 0 ? (
                <div className="px-4 py-2 text-xs text-slate-600">لا يوجد أصناف لهذا الموسم.</div>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
