"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Season, Category } from "@/lib/types";

export default function AdminSeasonsCategories() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [busy, setBusy] = useState(false);

  async function load() {
    const sSnap = await getDocs(query(collection(db, "seasons"), orderBy("order", "asc")));
    setSeasons(sSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Season[]);

    const cSnap = await getDocs(query(collection(db, "categories"), orderBy("order", "asc")));
    setCats(cSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Category[]);
  }

  useEffect(() => { load(); }, []);

  const catsBySeason = useMemo(() => {
    const m = new Map<string, Category[]>();
    for (const c of cats) {
      if (!m.has(c.seasonId)) m.set(c.seasonId, []);
      m.get(c.seasonId)!.push(c);
    }
    for (const [k, arr] of m) arr.sort((a,b)=>(a.order??0)-(b.order??0));
    return m;
  }, [cats]);

  async function addSeason() {
    setBusy(true);
    await addDoc(collection(db, "seasons"), {
      name: "موسم جديد",
      order: seasons.length + 1,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as any);
    await load();
    setBusy(false);
  }

  async function addCategory(seasonId: string) {
    setBusy(true);
    const existing = catsBySeason.get(seasonId)?.length ?? 0;
    await addDoc(collection(db, "categories"), {
      seasonId,
      name: "صنف جديد",
      order: existing + 1,
      icon: "shirt",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as any);
    await load();
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">المواسم والأصناف</h2>
        <button disabled={busy} className="rounded-xl bg-brandBlue text-white px-4 py-2 font-semibold disabled:opacity-60" onClick={addSeason}>
          + إضافة موسم
        </button>
      </div>

      {seasons.length === 0 ? (
        <div className="rounded-2xl border p-4 bg-white">
          <p className="text-slate-700">لا يوجد مواسم بعد. اضغط “إضافة موسم”.</p>
        </div>
      ) : null}

      <div className="grid gap-4">
        {seasons.map((s) => (
          <div key={s.id} className="rounded-2xl border p-4 bg-white space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="font-bold">الموسم</div>
              <div className="flex gap-2">
                <button disabled={busy} className="rounded-xl border px-3 py-2 text-sm" onClick={() => addCategory(s.id)}>
                  + إضافة صنف
                </button>
                <button
                  disabled={busy}
                  className="rounded-xl border px-3 py-2 text-sm text-red-600"
                  onClick={async () => {
                    if (!confirm("حذف الموسم؟ (سيتم حذف أصنافه فقط، المنتجات لن تُحذف تلقائيًا)")) return;
                    setBusy(true);
                    const qCats = await getDocs(query(collection(db, "categories"), where("seasonId", "==", s.id)));
                    for (const d of qCats.docs) await deleteDoc(doc(db, "categories", d.id));
                    await deleteDoc(doc(db, "seasons", s.id));
                    await load();
                    setBusy(false);
                  }}
                >
                  حذف
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <Field label="اسم الموسم" value={s.name} onSave={async (v) => {
                await updateDoc(doc(db, "seasons", s.id), { name: v, updatedAt: serverTimestamp() } as any);
                await load();
              }} disabled={busy} />
              <Field label="الترتيب" value={String(s.order ?? 0)} onSave={async (v) => {
                await updateDoc(doc(db, "seasons", s.id), { order: Number(v) || 0, updatedAt: serverTimestamp() } as any);
                await load();
              }} disabled={busy} />
              <Toggle label="نشط" value={!!s.isActive} onChange={async (v) => {
                await updateDoc(doc(db, "seasons", s.id), { isActive: v, updatedAt: serverTimestamp() } as any);
                await load();
              }} disabled={busy} />
            </div>

            <div className="pt-2 border-t">
              <div className="font-semibold mb-2">الأصناف</div>
              <div className="grid gap-2">
                {(catsBySeason.get(s.id) ?? []).map((c) => (
                  <div key={c.id} className="rounded-xl border p-3 bg-slate-50">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-bold">{c.name}</div>
                      <button
                        disabled={busy}
                        className="text-sm text-red-600"
                        onClick={async () => {
                          if (!confirm("حذف الصنف؟")) return;
                          setBusy(true);
                          await deleteDoc(doc(db, "categories", c.id));
                          await load();
                          setBusy(false);
                        }}
                      >
                        حذف
                      </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3 mt-2">
                      <Field label="اسم الصنف" value={c.name} onSave={async (v) => {
                        await updateDoc(doc(db, "categories", c.id), { name: v, updatedAt: serverTimestamp() } as any);
                        await load();
                      }} disabled={busy} />
                      <Field label="الترتيب" value={String(c.order ?? 0)} onSave={async (v) => {
                        await updateDoc(doc(db, "categories", c.id), { order: Number(v) || 0, updatedAt: serverTimestamp() } as any);
                        await load();
                      }} disabled={busy} />
                      <Field label="أيقونة" value={c.icon ?? "shirt"} onSave={async (v) => {
                        await updateDoc(doc(db, "categories", c.id), { icon: v, updatedAt: serverTimestamp() } as any);
                        await load();
                      }} disabled={busy} />
                    </div>
                  </div>
                ))}
              </div>
              {(catsBySeason.get(s.id)?.length ?? 0) === 0 ? (
                <p className="text-sm text-slate-600 mt-2">لا يوجد أصناف لهذا الموسم بعد.</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onSave,
  disabled,
}: {
  label: string;
  value: string;
  onSave: (v: string) => Promise<void>;
  disabled: boolean;
}) {
  const [v, setV] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => setV(value), [value]);

  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold">{label}</label>
      <div className="flex gap-2">
        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          value={v}
          onChange={(e) => setV(e.target.value)}
          disabled={disabled || saving}
        />
        <button
          className="rounded-xl border px-3 py-2 text-sm"
          disabled={disabled || saving}
          onClick={async () => {
            setSaving(true);
            await onSave(v.trim());
            setSaving(false);
          }}
        >
          حفظ
        </button>
      </div>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => Promise<void>;
  disabled: boolean;
}) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);

  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold">{label}</label>
      <button
        className={[
          "w-full rounded-xl border px-3 py-2 text-sm font-semibold",
          v ? "bg-emerald-600 text-white border-emerald-600" : "bg-white",
        ].join(" ")}
        disabled={disabled}
        onClick={async () => {
          const nv = !v;
          setV(nv);
          await onChange(nv);
        }}
      >
        {v ? "نعم" : "لا"}
      </button>
    </div>
  );
}
