"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Season } from "@/lib/types";

export default function SeasonsBar({ asMenu }: { asMenu?: boolean }) {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [active, setActive] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const q = query(collection(db, "seasons"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      setSeasons(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    })();
  }, []);

  const items = useMemo(() => [{ id: "all", name: "الكل" }, ...seasons], [seasons]);

  return (
    <div className={asMenu ? "space-y-2" : "flex gap-2 overflow-auto pb-2"}>
      {items.map((s) => (
        <button
          key={s.id}
          onClick={() => {
            setActive(s.id);
            // بسيط الآن: نخزن في localStorage لاستخدامه في ProductsGrid
            if (typeof window !== "undefined") {
              localStorage.setItem("seasonFilter", s.id);
              window.dispatchEvent(new Event("seasonFilterChanged"));
            }
          }}
          className={[
            "rounded-xl border px-4 py-2 text-sm font-semibold whitespace-nowrap",
            active === s.id ? "bg-brandPeach text-white border-brandPeach" : "bg-white hover:bg-slate-50"
          ].join(" ")}
        >
          {s.name}
        </button>
      ))}
    </div>
  );
}
