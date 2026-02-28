"use client";

import * as XLSX from "xlsx";
import { addDoc, collection, getDocs, query, updateDoc, where, doc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { modelSortKey } from "@/lib/modelSort";

type Row = {
  seasonId?: string;
  categoryId?: string;
  modelNumber?: number;
  title?: string;
  price?: number;
  hasDiscount?: boolean;
  discountPrice?: number;
};

export default function AdminExcel() {
  const [msg, setMsg] = useState<string>("");

  async function importExcel(file: File) {
    setMsg("جاري قراءة الملف...");
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<any>(sheet, { defval: "" });

    let added = 0;
    let updated = 0;

    for (const r of json) {
      const seasonId = String(r.seasonId || r.season || "default").trim();
      const categoryId = String(r.categoryId || r.category || "default").trim();
      const modelNumber = Number(String(r.modelNumber ?? r.model ?? "").replace(/[^0-9]/g, "")) || 0;

      const title = String(r.title || "").trim() || `موديل ${modelNumber}`;
      const price = Number(r.price || 0) || 0;

      // تحديث حسب (seasonId + modelNumber)
      const q = query(
        collection(db, "products"),
        where("seasonId", "==", seasonId),
        where("modelNumber", "==", modelNumber)
      );

      const snap = await getDocs(q);
      const payload: any = {
        seasonId,
        categoryId,
        modelNumber,
        modelSortKey: modelSortKey(modelNumber),
        title,
        price,
        hasDiscount: !!r.hasDiscount,
        discountPrice: r.discountPrice ? Number(r.discountPrice) : null,
        updatedAt: serverTimestamp(),
      };

      if (snap.empty) {
        await addDoc(collection(db, "products"), {
          ...payload,
          images: [],
          createdAt: serverTimestamp(),
        });
        added++;
      } else {
        await updateDoc(doc(db, "products", snap.docs[0].id), payload);
        updated++;
      }
    }

    setMsg(`تم الاستيراد ✅ تمت الإضافة: ${added} | تم التحديث: ${updated}`);
  }

  async function exportExcel() {
    setMsg("جاري التصدير...");
    const snap = await getDocs(collection(db, "products"));
    const rows = snap.docs.map((d) => {
      const p = d.data() as any;
      return {
        id: d.id,
        seasonId: p.seasonId,
        categoryId: p.categoryId,
        modelNumber: p.modelNumber,
        title: p.title,
        price: p.price,
        hasDiscount: p.hasDiscount,
        discountPrice: p.discountPrice,
        imageUrls: (p.images || []).map((x: any) => x.url).join("|"),
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "products");
    XLSX.writeFile(wb, "products.xlsx");
    setMsg("تم التصدير ✅");
  }

  return (
    <div className="rounded-2xl border p-4 bg-white space-y-4">
      <h2 className="text-xl font-bold">Excel Import / Export</h2>

      <div className="space-y-2">
        <div className="text-sm font-semibold">استيراد ملف Excel</div>
        <input type="file" accept=".xlsx,.xls" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) importExcel(f);
        }} />
        <p className="text-xs text-slate-600">
          الأعمدة المقترحة: seasonId, categoryId, modelNumber, title, price, hasDiscount, discountPrice
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button className="rounded-xl bg-brandBlue text-white px-4 py-2 font-semibold" onClick={exportExcel}>
          تصدير Excel
        </button>
      </div>

      {msg ? <p className="text-sm text-slate-700">{msg}</p> : null}
    </div>
  );
}
