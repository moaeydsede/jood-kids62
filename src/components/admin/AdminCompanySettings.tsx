"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CompanyInfo } from "@/lib/types";

export default function AdminCompanySettings() {
  const [v, setV] = useState<CompanyInfo>({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "settings", "company"));
      if (snap.exists()) setV(snap.data() as CompanyInfo);
    })();
  }, []);

  async function save() {
    await setDoc(doc(db, "settings", "company"), v, { merge: true });
    setMsg("تم الحفظ ✅");
    setTimeout(() => setMsg(""), 2000);
  }

  return (
    <div className="rounded-2xl border p-4 bg-white space-y-4">
      <h2 className="text-xl font-bold">بيانات الشركة</h2>

      <div className="grid md:grid-cols-2 gap-3">
        <Field label="WhatsApp Number" value={v.whatsappNumber || ""} onChange={(x) => setV({ ...v, whatsappNumber: x })} />
        <Field label="Instagram URL" value={v.instagramUrl || ""} onChange={(x) => setV({ ...v, instagramUrl: x })} />
        <Field label="Facebook URL" value={v.facebookUrl || ""} onChange={(x) => setV({ ...v, facebookUrl: x })} />
        <Field label="Telegram URL" value={v.telegramUrl || ""} onChange={(x) => setV({ ...v, telegramUrl: x })} />
        <Field label="رابط موقع المصنع (خرائط)" value={v.factoryLocationUrl || ""} onChange={(x) => setV({ ...v, factoryLocationUrl: x })} />
        <Field label="رابط موقع المحل (خرائط)" value={v.shopLocationUrl || ""} onChange={(x) => setV({ ...v, shopLocationUrl: x })} />
      </div>

      <button className="rounded-xl bg-brandBlue text-white px-4 py-2 font-semibold" onClick={save}>
        حفظ
      </button>

      {msg ? <p className="text-sm text-slate-700">{msg}</p> : null}
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
