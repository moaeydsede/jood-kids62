"use client";

import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDocs, query, orderBy, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";
import { modelSortKey } from "@/lib/modelSort";
import { uploadToCloudinaryUnsigned } from "@/lib/cloudinary";

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const snap = await getDocs(query(collection(db, "products"), orderBy("updatedAt", "desc")));
    setItems(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Product[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">المنتجات</h2>
        <button className="rounded-xl bg-brandBlue text-white px-4 py-2 font-semibold" onClick={async () => {
          const base: Omit<Product, "id"> = {
            seasonId: "default",
            categoryId: "default",
            modelNumber: 100,
            modelSortKey: modelSortKey(100),
            title: "منتج جديد",
            price: 0,
            images: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await addDoc(collection(db, "products"), base as any);
          await load();
        }}>
          + إضافة منتج سريع
        </button>
      </div>

      {loading ? <p>جاري التحميل...</p> : null}

      <div className="grid gap-3">
        {items.map(p => (
          <ProductRow key={p.id} p={p} onChanged={load} />
        ))}
      </div>

      <p className="text-sm text-slate-600">
        ملاحظة: لتفعيل المواسم/التصنيفات بشكل كامل، أضف بيانات seasons/categories ثم اربط seasonId و categoryId للمنتج.
      </p>
    </div>
  );
}

function ProductRow({ p, onChanged }: { p: Product; onChanged: () => Promise<void> }) {
  const [title, setTitle] = useState(p.title);
  const [model, setModel] = useState(String(p.modelNumber));
  const [price, setPrice] = useState(String(p.price ?? 0));
  const [discount, setDiscount] = useState(String(p.discountPrice ?? ""));
  const [hasDiscount, setHasDiscount] = useState(!!p.hasDiscount);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    const mn = Number(model.replace(/[^0-9]/g, "")) || 0;
    const pr = Number(price) || 0;
    const dp = discount ? (Number(discount) || 0) : undefined;

    await updateDoc(doc(db, "products", p.id), {
      title: title.trim(),
      modelNumber: mn,
      modelSortKey: modelSortKey(mn),
      price: pr,
      hasDiscount: hasDiscount,
      discountPrice: hasDiscount ? dp : null,
      updatedAt: serverTimestamp(),
    } as any);

    setBusy(false);
    await onChanged();
  }

  async function del() {
    if (!confirm("حذف المنتج؟")) return;
    setBusy(true);
    await deleteDoc(doc(db, "products", p.id));
    setBusy(false);
    await onChanged();
  }

  async function addImages(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    const uploaded = [];
    for (const f of Array.from(files)) {
      const u = await uploadToCloudinaryUnsigned(f);
      uploaded.push({ url: u.url, publicId: u.publicId });
    }
    await updateDoc(doc(db, "products", p.id), {
      images: [...(p.images || []), ...uploaded],
      updatedAt: serverTimestamp(),
    } as any);
    setBusy(false);
    await onChanged();
  }

  return (
    <div className="rounded-2xl border p-3 bg-white space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-bold">#{p.id.slice(0, 6)}</div>
        <div className="flex gap-2">
          <button disabled={busy} className="rounded-xl border px-3 py-2 text-sm" onClick={save}>حفظ</button>
          <button disabled={busy} className="rounded-xl border px-3 py-2 text-sm text-red-600" onClick={del}>حذف</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <Field label="اسم المنتج" value={title} onChange={setTitle} />
        <Field label="رقم الموديل" value={model} onChange={setModel} />
        <Field label="السعر" value={price} onChange={setPrice} />
        <div className="space-y-1">
          <label className="text-xs font-semibold">خصم؟</label>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={hasDiscount} onChange={(e) => setHasDiscount(e.target.checked)} />
            <input
              className="flex-1 rounded-xl border px-3 py-2 text-sm disabled:opacity-60"
              placeholder="سعر الخصم"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              disabled={!hasDiscount}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-sm font-semibold">رفع صور (Cloudinary)</label>
        <input disabled={busy} type="file" multiple accept="image/*" onChange={(e) => addImages(e.target.files)} />
      </div>

      <div className="text-xs text-slate-600">
        modelSortKey الحالي: <b>{p.modelSortKey}</b>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold">{label}</label>
      <input className="w-full rounded-xl border px-3 py-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
