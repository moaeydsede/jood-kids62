"use client";

import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CompanyInfo } from "@/lib/types";
import { CartItem, cartTotal, clearCart, readCart, removeItem, updateQty, itemUnitPrice } from "@/lib/cart";
import { waLink } from "@/lib/whatsapp";
import Image from "next/image";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [info, setInfo] = useState<CompanyInfo>({});

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener("cartChanged", sync);
    return () => window.removeEventListener("cartChanged", sync);
  }, []);

  useEffect(() => {
    (async () => {
      const s = await getDoc(doc(db, "settings", "company"));
      if (s.exists()) setInfo(s.data() as CompanyInfo);
    })();
  }, []);

  const total = useMemo(() => cartTotal(items), [items]);

  const message = useMemo(() => {
    if (items.length === 0) return "السلام عليكم، أريد الاستفسار عن المنتجات.";
    const lines = [
      "السلام عليكم، هذه طلبيتي:",
      "",
      ...items.map((i, idx) => {
        const unit = itemUnitPrice(i);
        return `${idx + 1}) ${i.title} | موديل: ${i.modelNumber} | كمية: ${i.qty} | سعر: ${unit} ج`;
      }),
      "",
      `الإجمالي: ${total} ج`,
      "",
      "طريقة الدفع: (اكتب كاش / بوليصة شحن / إنستا باي / محفظة إلكترونية / تحويل بنكي)",
      "الاسم: ",
      "العنوان: ",
      "رقم الهاتف: ",
    ];
    return lines.join("\n");
  }, [items, total]);

  const wa = useMemo(() => waLink(info.whatsappNumber || "", message), [info.whatsappNumber, message]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">السلة</h1>
        {items.length ? (
          <button className="rounded-xl border px-3 py-2 text-sm text-red-600" onClick={() => { if (confirm("حذف كل محتويات السلة؟")) clearCart(); }}>
            تفريغ السلة
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border bg-white p-6">
          <p className="text-slate-700">سلتك فارغة الآن.</p>
          <a href="/" className="inline-block mt-3 rounded-xl bg-brandBlue text-white px-4 py-2 font-bold">
            رجوع للمنتجات
          </a>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            {items.map((i) => (
              <div key={i.id} className="rounded-3xl border bg-white p-4 flex gap-3">
                <div className="relative w-20 h-20 rounded-2xl border bg-slate-50 overflow-hidden shrink-0">
                  {i.imageUrl ? <Image src={i.imageUrl} alt="" fill className="object-contain" /> : null}
                </div>

                <div className="flex-1">
                  <div className="font-extrabold">{i.title}</div>
                  <div className="text-sm text-slate-600">موديل: {i.modelNumber}</div>
                  <div className="text-sm font-bold text-brandBlue mt-1">{itemUnitPrice(i)} ج</div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button className="w-10 h-10 rounded-xl border" onClick={() => updateQty(i.id, (i.qty || 1) - 1)}>-</button>
                      <div className="min-w-10 text-center font-extrabold">{i.qty}</div>
                      <button className="w-10 h-10 rounded-xl border" onClick={() => updateQty(i.id, (i.qty || 1) + 1)}>+</button>
                    </div>

                    <button className="text-sm text-red-600" onClick={() => removeItem(i.id)}>
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="rounded-3xl border bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="font-bold">الإجمالي</div>
                <div className="text-xl font-extrabold text-brandBlue">{total} ج</div>
              </div>

              <button
                className="mt-4 w-full rounded-2xl bg-emerald-600 text-white px-4 py-3 font-extrabold"
                onClick={() => window.open(wa, "_blank")}
              >
                إرسال الطلبية على واتساب
              </button>

              <p className="text-xs text-slate-500 mt-2">
                سيُفتح واتساب برسالة جاهزة—فقط اكتب اسمك وعنوانك ورقمك ثم أرسل.
              </p>
            </div>

            <div className="rounded-3xl border p-5 bg-white">
              <h2 className="font-extrabold mb-2">طرق الدفع</h2>
              <ul className="list-disc pr-6 space-y-1 text-slate-700 text-sm">
                <li>الكاش</li>
                <li>بوليصة شحن</li>
                <li>نقدًا من خلال أحد فروعنا</li>
                <li>تحويلات بنكية</li>
                <li>انستا باي</li>
                <li>محافظ إلكترونية (فودافون كاش / اتصالات كاش / أورنج كاش)</li>
                <li>لا يوجد بيع بالآجل</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
