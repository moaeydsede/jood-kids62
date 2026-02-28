"use client";

import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getCompanySettings } from "@/lib/settings";
import { loadCart, clearCart } from "@/lib/cart";
import type { CartItem } from "@/lib/types";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [companyWhatsApp, setCompanyWhatsApp] = useState<string>("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [shippingCompany, setShippingCompany] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "shipping" | "instapay" | "bank" | "wallet">("cash");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    (async () => {
      const s = await getCompanySettings();
      setCompanyWhatsApp((s?.whatsappNumber || "").toString());
    })();
  }, []);

  const total = useMemo(() => items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0), [items]);

  async function submit() {
    if (!items.length) return alert("السلة فارغة.");
    if (!customerName.trim()) return alert("اكتب الاسم.");
    if (!customerPhone.trim()) return alert("اكتب رقم الهاتف.");
    if (!city.trim()) return alert("اكتب المحافظة/المدينة.");
    if (!address.trim()) return alert("اكتب العنوان.");

    setSending(true);
    try {
      const now = new Date();
const y = String(now.getFullYear()).slice(-2);
const mo = String(now.getMonth() + 1).padStart(2, "0");
const d = String(now.getDate()).padStart(2, "0");
const h = String(now.getHours()).padStart(2, "0");
const mi = String(now.getMinutes()).padStart(2, "0");
const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
const orderNo = `JK-${y}${mo}${d}-${h}${mi}-${rand}`;

const orderPayload = {
  orderNo,
  customerName: customerName.trim(),
  customerPhone: customerPhone.trim(),
  city: city.trim(),
  address: address.trim(),
  shippingCompany: shippingCompany.trim(),
  paymentMethod,
  notes: notes.trim(),
  items,
  total,
  status: "new",
  createdAt: serverTimestamp(),
};


      const ref = await addDoc(collection(db, "orders"), orderPayload as any);

      const lines = items.map((it, idx) => {
        return `${idx + 1}) ${it.title} | موديل: ${it.modelNumber} | كمية: ${it.qty} | سعر: ${it.price}`;
      });

      const msg =
        `طلبية جديدة ✅\n` +
        `رقم الطلب: ${(orderPayload as any).orderNo || ref.id}\n\n` +
        `العميل: ${customerName}\n` +
        `موبايل: ${customerPhone}\n` +
        `المدينة: ${city}\n` +
        `العنوان: ${address}\n` +
        (shippingCompany ? `شركة الشحن: ${shippingCompany}\n` : "") +
        `طريقة الدفع: ${paymentMethod}\n\n` +
        `المنتجات:\n${lines.join("\n")}\n\n` +
        `الإجمالي: ${total}\n` +
        (notes ? `ملاحظات: ${notes}\n` : "");

      const wa = companyWhatsApp ? companyWhatsApp.replace(/\D/g, "") : "";
      const url = wa
        ? `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/?text=${encodeURIComponent(msg)}`;

      // clear cart then go to success page (WhatsApp can be opened there with a reliable user click)
      clearCart();
      try { sessionStorage.setItem("lastWaUrl", url); } catch {}
      window.location.href = `/order-success?orderId=${ref.id}`;
    } catch (e: any) {
      alert("حدث خطأ أثناء إرسال الطلب. تأكد من Rules.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 space-y-6">
      <h1 className="text-2xl font-extrabold">إتمام الطلب</h1>

      <div className="rounded-2xl border bg-white p-4 space-y-3">
        <div className="font-bold">بيانات العميل</div>
        <div className="grid md:grid-cols-2 gap-3">
          <Input label="الاسم" value={customerName} onChange={setCustomerName} />
          <Input label="رقم الموبايل" value={customerPhone} onChange={setCustomerPhone} />
          <Input label="المحافظة/المدينة" value={city} onChange={setCity} />
          <Input label="العنوان بالتفصيل" value={address} onChange={setAddress} />
          <Input label="شركة الشحن (نص كتابة)" value={shippingCompany} onChange={setShippingCompany} />
          <div className="space-y-1">
            <label className="text-xs font-semibold">طريقة الدفع</label>
            <select className="w-full rounded-xl border px-3 py-2 text-sm" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
              <option value="cash">نقدًا من الفرع / كاش</option>
              <option value="shipping">بوليصة شحن</option>
              <option value="instapay">إنستا باي</option>
              <option value="bank">تحويل بنكي</option>
              <option value="wallet">محافظ إلكترونية</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold">ملاحظات (اختياري)</label>
          <textarea className="w-full rounded-xl border px-3 py-2 text-sm min-h-[90px]" value={notes} onChange={(e)=>setNotes(e.target.value)} />
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-bold">ملخص الطلب</div>
          <div className="text-sm font-bold">الإجمالي: {total}</div>
        </div>
        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.productId} className="rounded-xl border p-3 flex items-center justify-between text-sm">
              <div>
                <div className="font-bold">{it.title}</div>
                <div className="text-slate-600">موديل: {it.modelNumber} • كمية: {it.qty}</div>
              </div>
              <div className="font-bold">{it.price * it.qty}</div>
            </div>
          ))}
        </div>

        <button
          disabled={sending}
          onClick={submit}
          className="w-full rounded-2xl bg-emerald-600 text-white font-extrabold py-3 disabled:opacity-60"
        >
          {sending ? "جارٍ إرسال الطلب..." : "إرسال الطلب على واتساب"}
        </button>

        <div className="text-xs text-slate-600 leading-6">
          سيتم تسجيل الطلب داخل Firestore (orders) ثم يتم فتح واتساب برسالة جاهزة.
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold">{label}</label>
      <input className="w-full rounded-xl border px-3 py-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
