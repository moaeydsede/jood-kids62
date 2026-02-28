"use client";

import { useState } from "react";
import { httpsCallable, getFunctions } from "firebase/functions";
import { app } from "@/lib/firebase";

/**
 * ⚠️ مهم:
 * هذا الزر يحتاج Cloud Function باسم adminDeleteAll لكي يحذف:
 * - بيانات Firestore
 * - وصور Cloudinary (لأن Cloudinary delete يحتاج secret على السيرفر)
 *
 * لو لم تُنشئ Cloud Function بعد، الزر سيظهر رسالة خطأ.
 */
export default function AdminDangerZone() {
  const [confirmText, setConfirmText] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function runDeleteAll() {
    if (confirmText !== "DELETE") {
      setMsg("اكتب DELETE للتأكيد.");
      return;
    }

    setBusy(true);
    setMsg("جاري الحذف...");
    try {
      const fn = httpsCallable(getFunctions(app), "adminDeleteAll");
      await fn({ confirm: "DELETE" });
      setMsg("تم حذف جميع البيانات ✅");
    } catch (e: any) {
      setMsg("لم يتم الحذف. تأكد من إعداد Cloud Function adminDeleteAll.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border p-4 bg-white space-y-3">
      <h2 className="text-xl font-bold text-red-600">منطقة الخطر</h2>
      <p className="text-sm text-slate-700">
        هذا الزر يحذف <b>جميع البيانات</b> (المنتجات/التصنيفات/المواسم/الإعدادات) ويمكنه حذف صور Cloudinary عبر Cloud Function.
      </p>

      <div className="space-y-1">
        <label className="text-xs font-semibold">اكتب DELETE للتأكيد</label>
        <input className="w-full rounded-xl border px-3 py-2 text-sm" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
      </div>

      <button
        disabled={busy}
        className="rounded-xl bg-red-600 text-white px-4 py-2 font-semibold disabled:opacity-60"
        onClick={runDeleteAll}
      >
        حذف جميع البيانات
      </button>

      {msg ? <p className="text-sm text-slate-700">{msg}</p> : null}
    </div>
  );
}
